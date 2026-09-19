import { prisma } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { idempotencyKey } from "@/lib/ids";
import { Money } from "@/lib/money";
import type { CurrencyCode } from "@/types/enums";
import { getProviders } from "@/providers/registry";
import {
  customerCashCode,
  feeRevenueCode,
  postLedger,
  safeguardedCashCode,
} from "@/domains/ledger/service";
import { assertPaymentTransition } from "@/domains/ledger/invariants";
import { emitDomainEvent, recordAudit } from "@/services/audit";
import { notify } from "@/services/notifications";

export async function createDeposit(input: {
  accountId: string;
  userId: string;
  amount: string;
  currency: CurrencyCode;
  method: string;
  idempotencyKey?: string;
}) {
  const amount = Money.from(input.amount, input.currency);
  if (!amount.isPositive()) throw new AppError("INVALID_AMOUNT", "Enter an amount greater than zero.");
  const key = input.idempotencyKey ?? idempotencyKey("dep");
  const existing = await prisma.payment.findUnique({ where: { idempotencyKey: key } });
  if (existing) return existing;

  const provider = getProviders().payment;
  const intent = await provider.createPaymentIntent({
    amount: amount.toFixed(),
    currency: input.currency,
    method: input.method,
    idempotencyKey: key,
  });

  const payment = await prisma.payment.create({
    data: {
      accountId: input.accountId,
      method: input.method,
      amount: amount.toFixed(),
      currency: input.currency,
      status: intent.status === "failed" ? "failed" : "processing",
      idempotencyKey: key,
      providerRef: intent.id,
      failureReason: intent.status === "failed" ? "Provider declined the payment." : null,
    },
  });

  await prisma.transaction.create({
    data: {
      accountId: input.accountId,
      type: "deposit",
      status: payment.status,
      amount: amount.toFixed(),
      currency: input.currency,
      description: `Add money via ${input.method}`,
      relatedId: payment.id,
    },
  });

  await recordAudit({
    action: "PAYMENT_CREATED",
    entity: "payment",
    entityId: payment.id,
    actorId: input.userId,
  });

  if (payment.status !== "failed") {
    await completeDeposit(payment.id, input.userId);
  } else {
    await notify({
      userId: input.userId,
      category: "funding",
      title: "Payment failed",
      body: "We could not complete this deposit. No money was taken. You can try another method.",
    });
  }
  return prisma.payment.findUniqueOrThrow({ where: { id: payment.id } });
}

export async function completeDeposit(paymentId: string, userId?: string) {
  const payment = await prisma.payment.findUniqueOrThrow({ where: { id: paymentId } });
  if (payment.status === "completed") return payment;
  assertPaymentTransition(payment.status, "completed");

  const cash = await customerCashCode(payment.accountId, payment.currency as CurrencyCode);
  const bank = await safeguardedCashCode(payment.currency as CurrencyCode);
  const ledger = await postLedger({
    type: "deposit",
    description: `Deposit ${payment.amount} ${payment.currency}`,
    idempotencyKey: `ledger:${payment.idempotencyKey}`,
    source: "payment_provider",
    destination: cash,
    lines: [
      { accountCode: bank, direction: "debit", amount: payment.amount, currency: payment.currency as CurrencyCode },
      { accountCode: cash, direction: "credit", amount: payment.amount, currency: payment.currency as CurrencyCode },
    ],
  });

  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "completed" },
  });
  await prisma.transaction.updateMany({
    where: { relatedId: payment.id },
    data: { status: "completed", ledgerTxnId: ledger.id },
  });
  await recordAudit({ action: "PAYMENT_COMPLETED", entity: "payment", entityId: payment.id, actorId: userId });
  await emitDomainEvent("PaymentCompleted", { paymentId: payment.id });
  const account = await prisma.account.findUnique({ where: { id: payment.accountId } });
  if (account) {
    await notify({
      userId: account.userId,
      category: "funding",
      title: "Money added",
      body: `${payment.currency} ${payment.amount} is now available in your account.`,
    });
  }
  return prisma.payment.findUniqueOrThrow({ where: { id: payment.id } });
}

export async function failDeposit(paymentId: string) {
  const payment = await prisma.payment.findUniqueOrThrow({ where: { id: paymentId } });
  if (payment.status === "failed") return payment;
  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "failed", failureReason: "Simulated payment failure." },
  });
  await prisma.transaction.updateMany({ where: { relatedId: payment.id }, data: { status: "failed" } });
  return payment;
}

export async function reverseDeposit(paymentId: string) {
  const payment = await prisma.payment.findUniqueOrThrow({ where: { id: paymentId } });
  assertPaymentTransition(payment.status === "completed" ? "completed" : payment.status, "reversed");
  const cash = await customerCashCode(payment.accountId, payment.currency as CurrencyCode);
  const bank = await safeguardedCashCode(payment.currency as CurrencyCode);
  await postLedger({
    type: "reversal",
    description: `Reverse deposit ${payment.amount} ${payment.currency}`,
    idempotencyKey: `rev:${payment.idempotencyKey}`,
    lines: [
      { accountCode: cash, direction: "debit", amount: payment.amount, currency: payment.currency as CurrencyCode },
      { accountCode: bank, direction: "credit", amount: payment.amount, currency: payment.currency as CurrencyCode },
    ],
  });
  await prisma.payment.update({ where: { id: payment.id }, data: { status: "reversed" } });
  await prisma.transaction.create({
    data: {
      accountId: payment.accountId,
      type: "reversal",
      status: "completed",
      amount: payment.amount,
      currency: payment.currency,
      description: "Deposit reversed",
      relatedId: payment.id,
    },
  });
}

export async function createWithdrawal(input: {
  accountId: string;
  userId: string;
  amount: string;
  currency: CurrencyCode;
  destination: string;
  destinationLabel: string;
  idempotencyKey?: string;
}) {
  const amount = Money.from(input.amount, input.currency);
  const { assertSufficientCash } = await import("@/domains/ledger/service");
  await assertSufficientCash(input.accountId, amount);
  const key = input.idempotencyKey ?? idempotencyKey("wd");
  const large = amount.amount.gte(20_000);
  const withdrawal = await prisma.withdrawal.create({
    data: {
      accountId: input.accountId,
      amount: amount.toFixed(),
      currency: input.currency,
      destination: input.destination,
      destinationLabel: input.destinationLabel,
      status: large ? "pending" : "processing",
      idempotencyKey: key,
      requiresApproval: large,
    },
  });
  if (large) {
    await prisma.approvalRequest.create({
      data: {
        type: "large_withdrawal",
        status: "pending",
        entity: "withdrawal",
        entityId: withdrawal.id,
        makerId: input.userId,
        withdrawalId: withdrawal.id,
      },
    });
  } else {
    await settleWithdrawal(withdrawal.id, input.userId);
  }
  await recordAudit({
    action: "WITHDRAWAL_REQUESTED",
    entity: "withdrawal",
    entityId: withdrawal.id,
    actorId: input.userId,
  });
  return prisma.withdrawal.findUniqueOrThrow({ where: { id: withdrawal.id } });
}

export async function settleWithdrawal(withdrawalId: string, userId?: string) {
  const withdrawal = await prisma.withdrawal.findUniqueOrThrow({ where: { id: withdrawalId } });
  const cash = await customerCashCode(withdrawal.accountId, withdrawal.currency as CurrencyCode);
  const bank = await safeguardedCashCode(withdrawal.currency as CurrencyCode);
  const feeAcc = await feeRevenueCode(withdrawal.currency as CurrencyCode, "withdrawal");
  const { withdrawalFee } = await import("@/domains/fees/engine");
  const fee = withdrawalFee(Money.from(withdrawal.amount, withdrawal.currency as CurrencyCode));
  const gross = fee.grandTotal;
  const lines = [
    {
      accountCode: cash,
      direction: "debit" as const,
      amount: gross.toFixed(),
      currency: withdrawal.currency as CurrencyCode,
    },
    {
      accountCode: bank,
      direction: "credit" as const,
      amount: withdrawal.amount,
      currency: withdrawal.currency as CurrencyCode,
    },
  ];
  if (!fee.total.isZero()) {
    lines.push({
      accountCode: feeAcc,
      direction: "credit",
      amount: fee.total.toFixed(),
      currency: withdrawal.currency as CurrencyCode,
    });
  }
  await postLedger({
    type: "withdrawal",
    description: `Withdrawal ${withdrawal.amount} ${withdrawal.currency}`,
    idempotencyKey: `ledger:${withdrawal.idempotencyKey}`,
    lines,
  });
  await prisma.withdrawal.update({ where: { id: withdrawal.id }, data: { status: "completed" } });
  await prisma.transaction.create({
    data: {
      accountId: withdrawal.accountId,
      type: "withdrawal",
      status: "completed",
      amount: withdrawal.amount,
      currency: withdrawal.currency,
      description: `Withdrawal to ${withdrawal.destinationLabel}`,
      relatedId: withdrawal.id,
    },
  });
  void userId;
}
