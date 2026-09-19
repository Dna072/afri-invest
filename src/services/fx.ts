import { prisma } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { idempotencyKey } from "@/lib/ids";
import { Money } from "@/lib/money";
import type { CurrencyCode } from "@/types/enums";
import { getProviders } from "@/providers/registry";
import { quoteFx } from "@/domains/fx/engine";
import {
  assertSufficientCash,
  customerCashCode,
  feeRevenueCode,
  postLedger,
  safeguardedCashCode,
} from "@/domains/ledger/service";
import { recordAudit } from "@/services/audit";
import { notify } from "@/services/notifications";

export async function createFxQuote(input: {
  accountId: string;
  from: CurrencyCode;
  to: CurrencyCode;
  amount: string;
}) {
  if (input.from === input.to) {
    throw new AppError("INVALID_FX_PAIR", "Choose two different currencies.");
  }
  const provider = getProviders().fx;
  const rate = await provider.getRate(input.from, input.to);
  const quoted = quoteFx({
    from: input.from,
    to: input.to,
    amount: input.amount,
    sourceRate: rate.sourceRate,
  });
  const row = await prisma.fxQuote.create({
    data: {
      accountId: input.accountId,
      baseCurrency: input.from,
      quoteCurrency: input.to,
      sourceRate: quoted.sourceRate,
      platformFee: quoted.platformFee.toFixed(),
      spread: quoted.spreadAmount.toFixed(),
      customerAmount: quoted.customerAmount.toFixed(),
      amountReceived: quoted.amountReceived.toFixed(),
      feeCurrency: input.from,
      expiresAt: new Date(Date.now() + 60_000),
      status: "active",
    },
  });
  await recordAudit({ action: "FX_QUOTE_CREATED", entity: "fx_quote", entityId: row.id });
  return { row, quoted };
}

export async function executeFxQuote(input: { quoteId: string; userId: string; idempotencyKey?: string }) {
  const quote = await prisma.fxQuote.findUniqueOrThrow({ where: { id: input.quoteId } });
  if (quote.status !== "active") throw new AppError("FX_QUOTE_USED", "This quote is no longer available.");
  if (quote.expiresAt < new Date()) {
    await prisma.fxQuote.update({ where: { id: quote.id }, data: { status: "expired" } });
    throw new AppError("FX_QUOTE_EXPIRED", "The FX quote has expired. Please request a new one.");
  }

  const from = quote.baseCurrency as CurrencyCode;
  const to = quote.quoteCurrency as CurrencyCode;
  const debit = Money.from(quote.customerAmount, from).add(Money.from(quote.platformFee, from));
  await assertSufficientCash(quote.accountId, debit);

  const key = input.idempotencyKey ?? idempotencyKey("fx");
  const fromCash = await customerCashCode(quote.accountId, from);
  const toCash = await customerCashCode(quote.accountId, to);
  const fromBank = await safeguardedCashCode(from);
  const toBank = await safeguardedCashCode(to);
  const feeAcc = await feeRevenueCode(from, "fx");

  const ledger = await postLedger({
    type: "fx_conversion",
    description: `Convert ${quote.customerAmount} ${from} to ${quote.amountReceived} ${to}`,
    idempotencyKey: `ledger:${key}`,
    lines: [
      { accountCode: fromCash, direction: "debit", amount: quote.customerAmount, currency: from },
      { accountCode: fromBank, direction: "credit", amount: quote.customerAmount, currency: from },
      { accountCode: fromCash, direction: "debit", amount: quote.platformFee, currency: from },
      { accountCode: feeAcc, direction: "credit", amount: quote.platformFee, currency: from },
      { accountCode: toBank, direction: "debit", amount: quote.amountReceived, currency: to },
      { accountCode: toCash, direction: "credit", amount: quote.amountReceived, currency: to },
    ],
  });

  await getProviders().fx.executeQuote(quote.id);
  await prisma.fxQuote.update({ where: { id: quote.id }, data: { status: "executed" } });
  const conversion = await prisma.fxConversion.create({
    data: {
      quoteId: quote.id,
      accountId: quote.accountId,
      status: "completed",
      idempotencyKey: key,
      ledgerTxnId: ledger.id,
    },
  });
  await prisma.transaction.create({
    data: {
      accountId: quote.accountId,
      type: "fx",
      status: "completed",
      amount: quote.customerAmount,
      currency: from,
      counterAmount: quote.amountReceived,
      counterCurrency: to,
      description: `${from} → ${to}`,
      relatedId: conversion.id,
      ledgerTxnId: ledger.id,
    },
  });
  await prisma.revenueEvent.create({
    data: { stream: "fx", amount: quote.platformFee, currency: from, sourceId: conversion.id },
  });
  await recordAudit({ action: "FX_EXECUTED", entity: "fx_conversion", entityId: conversion.id, actorId: input.userId });
  await notify({
    userId: input.userId,
    category: "funding",
    title: "Currency converted",
    body: `You converted ${from} ${quote.customerAmount} to ${to} ${quote.amountReceived}.`,
  });
  return conversion;
}
