import Decimal from "decimal.js";
import { Money } from "@/lib/money";
import type { CurrencyCode } from "@/types/enums";

export interface PositionSnapshot {
  assetId: string;
  symbol: string;
  name: string;
  quantity: string;
  averageCost: string;
  costBasis: string;
  currentPrice: string;
  currency: CurrencyCode;
  country?: string;
  market?: string;
  assetType?: string;
  sector?: string;
}

export function positionMarketValue(position: PositionSnapshot) {
  return Money.from(new Decimal(position.quantity).times(position.currentPrice), position.currency);
}

export function unrealizedPnl(position: PositionSnapshot) {
  return positionMarketValue(position).sub(Money.from(position.costBasis, position.currency));
}

export function positionReturnPercent(position: PositionSnapshot) {
  const cost = new Decimal(position.costBasis);
  if (cost.isZero()) return new Decimal(0);
  return unrealizedPnl(position).amount.div(cost).times(100);
}

export function summarisePortfolio(
  positions: PositionSnapshot[],
  cash: Array<{ currency: CurrencyCode; amount: string }>,
  reporting: CurrencyCode,
  fxToReporting: (amount: Money) => Money,
) {
  const holdings = positions.map((p) => {
    const marketValue = positionMarketValue(p);
    const pnl = unrealizedPnl(p);
    return {
      ...p,
      marketValue,
      unrealizedPnl: pnl,
      returnPercent: positionReturnPercent(p).toFixed(2),
      reportingValue: fxToReporting(marketValue),
    };
  });

  const invested = holdings.reduce(
    (acc, h) => acc.add(fxToReporting(Money.from(h.costBasis, h.currency))),
    Money.zero(reporting),
  );
  const holdingsValue = holdings.reduce((acc, h) => acc.add(h.reportingValue), Money.zero(reporting));
  const cashValue = cash.reduce(
    (acc, c) => acc.add(fxToReporting(Money.from(c.amount, c.currency))),
    Money.zero(reporting),
  );
  const total = holdingsValue.add(cashValue);
  const pnl = holdingsValue.sub(invested);
  const returnPercent = invested.isZero() ? new Decimal(0) : pnl.amount.div(invested.amount).times(100);

  return {
    total,
    invested,
    cashValue,
    holdingsValue,
    pnl,
    returnPercent: returnPercent.toFixed(2),
    holdings,
  };
}

export function allocation(
  items: Array<{ key: string; value: Money }>,
) {
  const total = items.reduce((acc, i) => acc.add(i.value), Money.zero(items[0]?.value.currency ?? "GHS"));
  if (total.isZero()) return items.map((i) => ({ key: i.key, percent: "0.00", value: i.value }));
  return items.map((i) => ({
    key: i.key,
    percent: i.value.amount.div(total.amount).times(100).toFixed(2),
    value: i.value,
  }));
}
