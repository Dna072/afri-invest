import { AppShell } from "@/components/chrome/app-shell";
import { PortfolioChart } from "@/components/charts/portfolio-chart";
import { StockRow } from "@/components/markets/stock-row";
import { MoneyText, PriceChange } from "@/components/ui/money";
import { formatMoney } from "@/lib/money";
import { requireUser } from "@/services/auth";
import { getCustomerAccount } from "@/services/accounts";
import { getPortfolio } from "@/services/portfolio";

export default async function PortfolioPage() {
  const user = await requireUser();
  const account = await getCustomerAccount(user);
  const portfolio = await getPortfolio(account.id, "GHS");
  const chart = portfolio.history.find((h) => h.range === "1Y")?.values ?? [];
  return (
    <AppShell title="Portfolio">
      <div className="rounded-[1.25rem] bg-[color:var(--navy-card)] p-6 text-primary-foreground">
        <p className="eyebrow text-accent">Ghana portfolio</p>
        <MoneyText amount={portfolio.summary.total.toFixed()} currency="GHS" size="xl" className="text-primary-foreground" />
        <div className="mt-2 flex gap-4 text-sm text-primary-foreground/75">
          <span>Invested <MoneyText amount={portfolio.summary.invested.toFixed()} currency="GHS" className="text-primary-foreground" /></span>
          <PriceChange value={portfolio.summary.returnPercent} className="text-accent" />
        </div>
        <PortfolioChart data={chart} />
        <div className="mt-2 flex gap-2 text-xs text-primary-foreground/70">
          {portfolio.history.map((h) => (
            <span key={h.range} className="rounded-full bg-white/10 px-2 py-1">{h.range}</span>
          ))}
        </div>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <Alloc title="By country" items={portfolio.byCountry} />
        <Alloc title="By asset type" items={portfolio.byType} />
      </div>
      <h2 className="mt-8 font-display text-2xl">Holdings</h2>
      <ul className="mt-3 space-y-2">
        {portfolio.summary.holdings.map((h) => (
          <li key={h.assetId}>
            <StockRow
              href={`/app/assets/${h.assetId}`}
              symbol={h.symbol}
              name={h.name}
              subtitle={`Qty ${h.quantity} · Avg ${h.averageCost}`}
              price={formatMoney(h.marketValue.toFixed(), h.currency)}
              change={h.returnPercent}
            />
          </li>
        ))}
      </ul>
      <h2 className="mt-8 font-display text-2xl">Cash</h2>
      <ul className="mt-3 space-y-2">
        {portfolio.balances.map((b) => (
          <li key={b.id} className="flex justify-between rounded-2xl bg-card px-4 py-3">
            <span>{b.currency}</span>
            <MoneyText amount={b.available} currency={b.currency} />
          </li>
        ))}
      </ul>
    </AppShell>
  );
}

function Alloc({ title, items }: { title: string; items: Array<{ key: string; percent: string }> }) {
  return (
    <div className="rounded-xl bg-card p-4">
      <p className="text-sm font-medium">{title}</p>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((i) => (
          <li key={i.key} className="flex justify-between">
            <span>{i.key}</span>
            <span className="tabular">{i.percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
