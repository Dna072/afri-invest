import Decimal from "decimal.js";
import { prisma } from "@/lib/db";
import { Money } from "@/lib/money";
import type { CurrencyCode } from "@/types/enums";
import { SANDBOX_FX_RATES } from "@/providers/mock/fx";
import { summarisePortfolio, allocation, type PositionSnapshot } from "@/domains/portfolio/calc";

function convert(amount: Money, reporting: CurrencyCode): Money {
  if (amount.currency === reporting) return amount;
  const direct = SANDBOX_FX_RATES[`${amount.currency}/${reporting}`];
  if (direct) return Money.from(amount.amount.times(direct), reporting);
  const inverse = SANDBOX_FX_RATES[`${reporting}/${amount.currency}`];
  if (inverse) return Money.from(amount.amount.div(inverse), reporting);
  return Money.from(amount.amount, reporting);
}

export async function getPortfolio(accountId: string, reporting: CurrencyCode = "GHS") {
  const [positions, balances, account] = await Promise.all([
    prisma.position.findMany({ where: { accountId }, include: { asset: { include: { market: true, exchange: true } } } }),
    prisma.currencyBalance.findMany({ where: { accountId } }),
    prisma.account.findUniqueOrThrow({ where: { id: accountId } }),
  ]);

  const snapshots: PositionSnapshot[] = positions.map((p) => ({
    assetId: p.assetId,
    symbol: p.asset.symbol,
    name: p.asset.name,
    quantity: p.quantity,
    averageCost: p.averageCost,
    costBasis: p.costBasis,
    currentPrice: p.asset.price,
    currency: p.currency as CurrencyCode,
    country: p.asset.country,
    market: p.asset.market.name,
    assetType: p.asset.assetType,
    sector: p.asset.sector ?? undefined,
  }));

  const summary = summarisePortfolio(
    snapshots,
    balances.map((b) => ({ currency: b.currency as CurrencyCode, amount: b.available })),
    reporting,
    (m) => convert(m, reporting),
  );

  const byCountry = allocation(
    Object.entries(
      summary.holdings.reduce<Record<string, Money>>((acc, h) => {
        const key = h.country ?? "Unknown";
        acc[key] = (acc[key] ?? Money.zero(reporting)).add(h.reportingValue);
        return acc;
      }, {}),
    ).map(([key, value]) => ({ key, value })),
  );
  const byType = allocation(
    Object.entries(
      summary.holdings.reduce<Record<string, Money>>((acc, h) => {
        const key = h.assetType ?? "other";
        acc[key] = (acc[key] ?? Money.zero(reporting)).add(h.reportingValue);
        return acc;
      }, {}),
    ).map(([key, value]) => ({ key, value })),
  );
  const byCurrency = allocation(
    summary.holdings.reduce<Array<{ key: string; value: Money }>>((acc, h) => {
      acc.push({ key: h.currency, value: h.reportingValue });
      return acc;
    }, balances.map((b) => ({ key: b.currency, value: convert(Money.from(b.available, b.currency as CurrencyCode), reporting) }))),
  );

  const history = buildHistory(summary.total);

  return { account, summary, byCountry, byType, byCurrency, balances, history };
}

function buildHistory(total: Money) {
  const points = ["1D", "1W", "1M", "3M", "6M", "1Y", "ALL"].map((range, idx) => {
    const n = range === "1D" ? 24 : range === "1W" ? 7 : range === "1M" ? 30 : range === "3M" ? 90 : range === "6M" ? 180 : 365;
    const values = Array.from({ length: Math.min(n, 40) }, (_, i) => {
      const drift = new Decimal(1).minus(new Decimal(0.04 - idx * 0.002)).plus(i * 0.001);
      return {
        label: `${i}`,
        value: Number(total.amount.times(drift).toFixed(2)),
      };
    });
    return { range, values };
  });
  return points;
}
