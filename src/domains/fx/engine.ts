import Decimal from "decimal.js";
import type { CurrencyCode } from "@/types/enums";
import { Money } from "@/lib/money";
import { fxFee } from "@/domains/fees/engine";

export const DEFAULT_SPREAD_BPS = "30";

export function applySpread(sourceRate: Decimal.Value, spreadBps: Decimal.Value, customerSellsBase: boolean) {
  const rate = new Decimal(sourceRate);
  const spread = new Decimal(spreadBps).div(10_000);
  if (customerSellsBase) {
    return rate.times(new Decimal(1).minus(spread));
  }
  return rate.times(new Decimal(1).plus(spread));
}

export function quoteFx(input: {
  from: CurrencyCode;
  to: CurrencyCode;
  amount: Decimal.Value;
  sourceRate: Decimal.Value;
  spreadBps?: Decimal.Value;
  feeBps?: Decimal.Value;
}) {
  const principal = Money.from(input.amount, input.from);
  const spreadBps = input.spreadBps ?? DEFAULT_SPREAD_BPS;
  const customerRate = applySpread(input.sourceRate, spreadBps, true);
  const fees = fxFee(principal, String(input.feeBps ?? "60"));
  const converted = new Decimal(principal.toFixed()).times(customerRate);
  const received = Money.from(converted, input.to);
  const spreadAmount = principal.mul(new Decimal(spreadBps).div(10_000));
  return {
    from: input.from,
    to: input.to,
    sourceRate: new Decimal(input.sourceRate).toFixed(6),
    customerRate: customerRate.toFixed(6),
    spreadBps: String(spreadBps),
    spreadAmount,
    platformFee: fees.total,
    customerAmount: principal,
    amountReceived: received,
    debitTotal: fees.grandTotal,
    expiresInSeconds: 60,
    items: fees.items,
    disclaimer: "Illustrative sandbox FX. Not a live tradable rate.",
  };
}
