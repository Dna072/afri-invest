import Decimal from "decimal.js";
import { prisma } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { Money } from "@/lib/money";
import { logger } from "@/lib/logger";
import type { CurrencyCode } from "@/types/enums";
import { assertLedgerBalanced, liabilityBalance, type LedgerLine } from "@/domains/ledger/invariants";

export async function ensureLedgerAccount(input: {
  code: string;
  name: string;
  type: "asset" | "liability" | "equity" | "income" | "expense";
  currency: CurrencyCode;
  ownerType: "customer" | "platform" | "suspense";
  ownerId?: string;
  classification: string;
  accountId?: string;
}) {
  return prisma.ledgerAccount.upsert({
    where: { code: input.code },
    update: {},
    create: input,
  });
}

export async function customerCashCode(accountId: string, currency: CurrencyCode) {
  const code = `CUST_CASH:${accountId}:${currency}`;
  await ensureLedgerAccount({
    code,
    name: `Customer cash ${currency}`,
    type: "liability",
    currency,
    ownerType: "customer",
    ownerId: accountId,
    classification: "customer_cash",
    accountId,
  });
  return code;
}

export async function customerInvestmentsCode(accountId: string, currency: CurrencyCode) {
  const code = `CUST_INV:${accountId}:${currency}`;
  await ensureLedgerAccount({
    code,
    name: `Investments at custody ${currency}`,
    type: "asset",
    currency,
    ownerType: "customer",
    ownerId: accountId,
    classification: "customer_securities",
    accountId,
  });
  return code;
}

export async function customerSecuritiesClaimCode(accountId: string, currency: CurrencyCode) {
  const code = `CUST_SEC:${accountId}:${currency}`;
  await ensureLedgerAccount({
    code,
    name: `Customer securities claim ${currency}`,
    type: "liability",
    currency,
    ownerType: "customer",
    ownerId: accountId,
    classification: "customer_securities",
    accountId,
  });
  return code;
}

export async function safeguardedCashCode(currency: CurrencyCode) {
  const code = `SAFE_BANK:${currency}`;
  await ensureLedgerAccount({
    code,
    name: `Safeguarded bank ${currency}`,
    type: "asset",
    currency,
    ownerType: "platform",
    classification: "customer_safeguarded_cash",
  });
  return code;
}

export async function feeRevenueCode(currency: CurrencyCode, stream: string) {
  const code = `REV_${stream.toUpperCase()}:${currency}`;
  await ensureLedgerAccount({
    code,
    name: `${stream} revenue ${currency}`,
    type: "income",
    currency,
    ownerType: "platform",
    classification: "platform_operating",
  });
  return code;
}

export async function fxClearingCode(currency: CurrencyCode) {
  const code = `FX_CLEAR:${currency}`;
  await ensureLedgerAccount({
    code,
    name: `FX clearing ${currency}`,
    type: "asset",
    currency,
    ownerType: "platform",
    classification: "fx_clearing",
  });
  return code;
}

export async function postLedger(input: {
  type: string;
  description: string;
  idempotencyKey: string;
  lines: LedgerLine[];
  source?: string;
  destination?: string;
  metadata?: Record<string, unknown>;
  status?: string;
}) {
  const existing = await prisma.ledgerTransaction.findUnique({
    where: { idempotencyKey: input.idempotencyKey },
  });
  if (existing) return existing;

  assertLedgerBalanced(input.lines);

  const txn = await prisma.$transaction(async (tx) => {
    const created = await tx.ledgerTransaction.create({
      data: {
        type: input.type,
        description: input.description,
        idempotencyKey: input.idempotencyKey,
        status: input.status ?? "completed",
        source: input.source,
        destination: input.destination,
        metadata: JSON.stringify(input.metadata ?? {}),
      },
    });

    for (const line of input.lines) {
      const account = await tx.ledgerAccount.findUnique({ where: { code: line.accountCode } });
      if (!account) {
        throw new AppError("LEDGER_ACCOUNT_MISSING", `Unknown ledger account ${line.accountCode}.`, 500);
      }
      if (account.currency !== line.currency) {
        throw new AppError("LEDGER_CURRENCY_MISMATCH", "Ledger account currency does not match entry.");
      }
      await tx.ledgerEntry.create({
        data: {
          transactionId: created.id,
          ledgerAccountId: account.id,
          direction: line.direction,
          amount: new Decimal(line.amount).toFixed(2),
          currency: line.currency,
        },
      });
    }
    return created;
  });

  await refreshCustomerCashProjections(input.lines);
  logger.info("ledger.posted", { type: input.type, id: txn.id });
  return txn;
}

async function refreshCustomerCashProjections(lines: LedgerLine[]) {
  const codes = [...new Set(lines.map((l) => l.accountCode))].filter((c) => c.startsWith("CUST_CASH:"));
  for (const code of codes) {
    const account = await prisma.ledgerAccount.findUnique({ where: { code } });
    if (!account?.accountId) continue;
    const entries = await prisma.ledgerEntry.findMany({ where: { ledgerAccountId: account.id } });
    let debit = new Decimal(0);
    let credit = new Decimal(0);
    for (const entry of entries) {
      if (entry.direction === "debit") debit = debit.plus(entry.amount);
      else credit = credit.plus(entry.amount);
    }
    const available = liabilityBalance(debit, credit).toFixed(2);
    await prisma.currencyBalance.upsert({
      where: {
        accountId_currency: { accountId: account.accountId, currency: account.currency },
      },
      update: { available, pending: "0" },
      create: {
        accountId: account.accountId,
        currency: account.currency,
        available,
        pending: "0",
        reserved: "0",
      },
    });
  }
}

export async function getCustomerCash(accountId: string, currency: CurrencyCode): Promise<Money> {
  const code = `CUST_CASH:${accountId}:${currency}`;
  const account = await prisma.ledgerAccount.findUnique({ where: { code } });
  if (!account) return Money.zero(currency);
  const entries = await prisma.ledgerEntry.findMany({ where: { ledgerAccountId: account.id } });
  let debit = new Decimal(0);
  let credit = new Decimal(0);
  for (const entry of entries) {
    if (entry.direction === "debit") debit = debit.plus(entry.amount);
    else credit = credit.plus(entry.amount);
  }
  const value = liabilityBalance(debit, credit);
  if (value.lt(0)) {
    throw new AppError("NEGATIVE_CASH_BALANCE", `Negative ${currency} cash is not allowed.`);
  }
  return Money.from(value, currency);
}

export async function assertSufficientCash(accountId: string, amount: Money) {
  const cash = await getCustomerCash(accountId, amount.currency);
  if (cash.lt(amount)) {
    throw new AppError(
      "INSUFFICIENT_BALANCE",
      `Available ${amount.currency} balance is ${cash.toFixed()}.`,
      400,
    );
  }
}
