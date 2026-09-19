import Decimal from "decimal.js";
import { AppError } from "@/lib/errors";
import type { CurrencyCode } from "@/types/enums";

export const ORDER_TRANSITIONS: Record<string, string[]> = {
  draft: ["submitted", "cancelled"],
  submitted: ["accepted", "rejected", "failed"],
  accepted: ["partially_filled", "filled", "cancel_requested", "rejected", "failed"],
  partially_filled: ["filled", "cancel_requested", "cancelled", "failed"],
  filled: ["settlement_pending", "failed"],
  cancel_requested: ["cancelled", "filled", "partially_filled"],
  settlement_pending: ["settled", "failed"],
  settled: [],
  rejected: [],
  cancelled: [],
  failed: [],
};

export function canTransitionOrder(from: string, to: string) {
  return ORDER_TRANSITIONS[from]?.includes(to) ?? false;
}

export function assertOrderTransition(from: string, to: string) {
  if (!canTransitionOrder(from, to)) {
    throw new AppError("INVALID_ORDER_TRANSITION", `Cannot move order from ${from} to ${to}.`, 409);
  }
}

export const PAYMENT_TRANSITIONS: Record<string, string[]> = {
  initiated: ["pending", "cancelled", "failed"],
  pending: ["processing", "cancelled", "failed"],
  processing: ["completed", "failed"],
  completed: ["reversed"],
  failed: [],
  reversed: [],
  cancelled: [],
};

export function assertPaymentTransition(from: string, to: string) {
  if (!(PAYMENT_TRANSITIONS[from] ?? []).includes(to)) {
    throw new AppError("INVALID_PAYMENT_TRANSITION", `Cannot move payment from ${from} to ${to}.`, 409);
  }
}

export interface LedgerLine {
  accountCode: string;
  direction: "debit" | "credit";
  amount: Decimal.Value;
  currency: CurrencyCode;
}

export function assertLedgerBalanced(lines: LedgerLine[]) {
  const byCcy = new Map<string, { debit: Decimal; credit: Decimal }>();
  for (const line of lines) {
    const amount = new Decimal(line.amount);
    if (amount.lte(0)) {
      throw new AppError("INVALID_LEDGER_AMOUNT", "Ledger amounts must be positive.");
    }
    const bucket = byCcy.get(line.currency) ?? { debit: new Decimal(0), credit: new Decimal(0) };
    if (line.direction === "debit") bucket.debit = bucket.debit.plus(amount);
    else bucket.credit = bucket.credit.plus(amount);
    byCcy.set(line.currency, bucket);
  }
  for (const [ccy, bucket] of byCcy) {
    if (!bucket.debit.eq(bucket.credit)) {
      throw new AppError(
        "UNBALANCED_LEDGER",
        `Ledger is unbalanced in ${ccy}: debit ${bucket.debit.toFixed(2)} credit ${bucket.credit.toFixed(2)}.`,
      );
    }
  }
}

export function liabilityBalance(debits: Decimal.Value, credits: Decimal.Value) {
  return new Decimal(credits).minus(debits);
}

export function assetBalance(debits: Decimal.Value, credits: Decimal.Value) {
  return new Decimal(debits).minus(credits);
}
