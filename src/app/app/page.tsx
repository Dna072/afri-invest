import Link from "next/link";
import { AppShell } from "@/components/chrome/app-shell";
import { PortfolioChart } from "@/components/charts/portfolio-chart";
import { MoneyText, PriceChange, SandboxMark } from "@/components/ui/money";
import { EmptyState } from "@/components/ui/states";
import { prisma } from "@/lib/db";
import { requireUser } from "@/services/auth";
import { getCustomerAccount } from "@/services/accounts";
import { getPortfolio } from "@/services/portfolio";
import type { CurrencyCode } from "@/types/enums";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default async function HomePage() {
  const user = await requireUser();
  const account = await getCustomerAccount(user);
  const reporting = "GHS" as CurrencyCode;
  const portfolio = await getPortfolio(account.id, reporting);
  const [watchlist, dividends, activity, articles] = await Promise.all([
    prisma.watchlistItem.findMany({
      where: { watchlist: { userId: user.id } },
      include: { asset: true },
      take: 4,
    }),
    prisma.dividend.findMany({ where: { accountId: account.id }, include: { asset: true }, take: 3, orderBy: { createdAt: "desc" } }),
    prisma.transaction.findMany({ where: { accountId: account.id }, take: 5, orderBy: { createdAt: "desc" } }),
    prisma.educationArticle.findMany({ take: 2 }),
  ]);
  const chart = portfolio.history.find((h) => h.range === "1M")?.values ?? [];

  return (
    <AppShell title={`${greeting()}, ${user.firstName}`}>
      <section className="rounded-[1.25rem] bg-[color:var(--navy-card)] p-6 text-primary-foreground md:p-8">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.2em] text-accent">Portfolio</p>
          <SandboxMark />
        </div>
        <div className="mt-3">
          <MoneyText amount={portfolio.summary.total.toFixed()} currency={reporting} size="xl" className="text-primary-foreground" />
        </div>
        <p className="mt-1 text-sm text-primary-foreground/70">Ghana portfolio · positions + GHS cash. Other currencies sit separately.</p>
        <div className="mt-2">
          <PriceChange value={portfolio.summary.returnPercent} className="text-accent" />
          <span className="ml-2 text-sm text-primary-foreground/70">on invested capital · sandbox</span>
        </div>
        <div className="mt-4 text-primary-foreground">
          <PortfolioChart data={chart} />
        </div>
      </section>
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["/app/funding", "Add Money"],
          ["/app/markets", "Invest"],
          ["/app/fx", "Convert"],
          ["/app/auto-invest", "Auto Invest"],
        ].map(([href, label]) => (
          <Link key={href} href={href} className="lift rounded-xl bg-card px-4 py-4 text-center text-sm font-medium">
            {label}
          </Link>
        ))}
      </div>
      <section className="mt-8">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-2xl">Your investments</h2>
          <Link href="/app/portfolio" className="text-sm underline">See all</Link>
        </div>
        {portfolio.summary.holdings.length === 0 ? (
          <EmptyState title="No investments yet." hint="Start building your African portfolio." />
        ) : (
          <ul className="space-y-2">
            {portfolio.summary.holdings.slice(0, 5).map((h) => (
              <li key={h.assetId}>
                <Link href={`/app/assets/${h.assetId}`} className="lift flex items-center justify-between rounded-xl bg-card px-4 py-3">
                  <div>
                    <p className="font-medium">{h.name}</p>
                    <p className="text-xs text-muted-foreground">{h.symbol} · {h.quantity} units</p>
                  </div>
                  <div className="text-right">
                    <MoneyText amount={h.marketValue.toFixed()} currency={h.currency} />
                    <div><PriceChange value={h.returnPercent} /></div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="mt-8">
        <h2 className="font-display text-2xl">Watchlist</h2>
        {watchlist.length === 0 ? (
          <EmptyState title="No watchlist items." hint="Keep an eye on companies and markets you're interested in." />
        ) : (
          <ul className="mt-3 space-y-2">
            {watchlist.map((w) => (
              <li key={w.id} className="lift flex justify-between rounded-xl bg-card px-4 py-3">
                <span>{w.asset.name}</span>
                <MoneyText amount={w.asset.price} currency={w.asset.currency} />
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl">Upcoming dividends</h2>
          <ul className="mt-3 space-y-2">
            {dividends.map((d) => (
              <li key={d.id} className="rounded-xl bg-card px-4 py-3 text-sm">
                {d.asset.name} · {d.currency} {d.netAmount} · {d.status}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-2xl">Recent activity</h2>
          <ul className="mt-3 space-y-2">
            {activity.map((t) => (
              <li key={t.id} className="rounded-xl bg-card px-4 py-3 text-sm">
                {t.description} · {t.currency} {t.amount}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="mt-8">
        <h2 className="font-display text-2xl">Learning</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {articles.map((a) => (
            <Link key={a.id} href={`/app/education/${a.slug}`} className="lift block rounded-xl bg-card p-4">
              <p className="text-xs text-muted-foreground">{a.category} · {a.readMinutes} min</p>
              <p className="mt-1 font-medium">{a.title}</p>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
