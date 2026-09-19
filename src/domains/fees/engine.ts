import Decimal from "decimal.js";
import type { CurrencyCode } from "@/types/enums";
import { Money } from "@/lib/money";

export interface FeeBreakdownItem {
  code: string;
  name: string;
  amount: string;
  currency: CurrencyCode;
  bps?: string;
  explanation: string;
}

export interface FeeQuote {
  items: FeeBreakdownItem[];
  total: Money;
  principal: Money;
  grandTotal: Money;
}

export function tradingFee(principal: Money, bps = "50") {
  const fee = principal.mul(new Decimal(bps).div(10_000));
  const item: FeeBreakdownItem = {
    code: "trading",
    name: "Trading fee",
    amount: fee.toFixed(),
    currency: principal.currency,
    bps,
    explanation: `${new Decimal(bps).div(100).toFixed(2)}% of ${principal.toFixed()} ${principal.currency}. Illustrative prototype pricing.`,
  };
  return {
    items: [item],
    total: fee,
    principal,
    grandTotal: principal.add(fee),
  } satisfies FeeQuote;
}

export function fxFee(principal: Money, bps = "60") {
  const fee = principal.mul(new Decimal(bps).div(10_000));
  return {
    items: [
      {
        code: "fx",
        name: "FX fee",
        amount: fee.toFixed(),
        currency: principal.currency,
        bps,
        explanation: `Platform FX fee of ${new Decimal(bps).div(100).toFixed(2)}% on ${principal.toFixed()} ${principal.currency}. Illustrative prototype pricing.`,
      },
    ],
    total: fee,
    principal,
    grandTotal: principal.add(fee),
  } satisfies FeeQuote;
}

export function withdrawalFee(principal: Money, flat = "0") {
  const fee = Money.from(flat, principal.currency);
  return {
    items: [
      {
        code: "withdrawal",
        name: "Withdrawal fee",
        amount: fee.toFixed(),
        currency: principal.currency,
        explanation: fee.isZero()
          ? "No withdrawal fee in this prototype configuration."
          : `Flat fee of ${fee.toFixed()} ${principal.currency}. Illustrative prototype pricing.`,
      },
    ],
    total: fee,
    principal,
    grandTotal: principal.add(fee),
  } satisfies FeeQuote;
}

export function combineFees(principal: Money, quotes: FeeQuote[]): FeeQuote {
  const items = quotes.flatMap((q) => q.items);
  const total = quotes.reduce((acc, q) => acc.add(Money.from(q.total.toFixed(), principal.currency)), Money.zero(principal.currency));
  return { items, total, principal, grandTotal: principal.add(total) };
}
