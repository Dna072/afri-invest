import { AppShell } from "@/components/chrome/app-shell";
import { PortfolioChart } from "@/components/charts/portfolio-chart";
import { MoneyText, PriceChange } from "@/components/ui/money";
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
      <div className="rounded-[2rem] bg-card p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Total value</p>
        <MoneyText amount={portfolio.summary.total.toFixed()} currency="GHS" size="xl" />
        <div className="mt-2 flex gap-4 text-sm">
          <span>Invested <MoneyText amount={portfolio.summary.invested.toFixed()} currency="GHS" /></span>
          <PriceChange value={portfolio.summary.returnPercent} />
        </div>
        <PortfolioChart data={chart} />
        <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
          {portfolio.history.map((h) => (
            <span key={h.range} className="rounded-full bg-muted px-2 py-1">{h.range}</span>
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
          <li key={h.assetId} className="rounded-2xl bg-card px-4 py-3">
            <div className="flex justify-between">
              <div>
                <p className="font-medium">{h.name}</p>
                <p className="text-xs text-muted-foreground">Qty {h.quantity} · Avg {h.averageCost}</p>
              </div>
              <div className="text-right">
                <MoneyText amount={h.marketValue.toFixed()} currency={h.currency} />
                <PriceChange value={h.returnPercent} />
              </div>
            </div>
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
    <div className="rounded-3xl bg-card p-4">
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
