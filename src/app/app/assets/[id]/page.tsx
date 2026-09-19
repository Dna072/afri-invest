import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/chrome/app-shell";
import { PortfolioChart } from "@/components/charts/portfolio-chart";
import { Button } from "@/components/ui/button";
import { MoneyText, PriceChange, SandboxMark } from "@/components/ui/money";
import { toggleWatchlist } from "@/app/app/assets/actions";
import { prisma } from "@/lib/db";

export default async function AssetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const asset = await prisma.asset.findUnique({
    where: { id },
    include: { market: true, exchange: true, bondTerms: true, priceHistory: { orderBy: { ts: "asc" }, take: 40 } },
  });
  if (!asset) notFound();
  const chart = asset.priceHistory.map((p, i) => ({ label: String(i), value: Number(p.close) }));
  const tradable = asset.tradability === "open";

  return (
    <AppShell title={asset.name}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{asset.symbol} · {asset.exchange.name} · {asset.currency}</p>
          <div className="mt-2 flex items-center gap-3">
            <MoneyText amount={asset.price} currency={asset.currency} size="xl" />
            <PriceChange value={asset.changePercent} />
            <SandboxMark />
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-3xl bg-card p-4">
        <PortfolioChart data={chart} />
      </div>
      <div className="mt-6 grid gap-3 text-sm md:grid-cols-2">
        <Fact label="Market" value={asset.market.name} />
        <Fact label="Type" value={asset.assetType} />
        <Fact label="Risk" value={asset.riskCategory} />
        {asset.marketCap ? <Fact label="Market cap" value={asset.marketCap} /> : null}
        {asset.dividendYield ? <Fact label="Dividend yield" value={`${asset.dividendYield}%`} /> : null}
        {asset.week52Low ? <Fact label="52-week" value={`${asset.week52Low} – ${asset.week52High}`} /> : null}
        {asset.bondTerms ? <Fact label="Yield (indicative)" value={`${asset.bondTerms.yieldPercent}%`} /> : null}
      </div>
      <article className="mt-6 space-y-4 text-sm leading-6 text-muted-foreground">
        <h2 className="font-display text-2xl text-foreground">Overview</h2>
        <p>{asset.description}</p>
        <h2 className="font-display text-2xl text-foreground">Risk</h2>
        <p>Prices can fall. This listing is sandbox data. Educational only — not a recommendation.</p>
        <h2 className="font-display text-2xl text-foreground">Documents</h2>
        <p>Issuer documents will appear here when a live market-data and custody provider is connected.</p>
      </article>
      <div className="sticky bottom-20 mt-8 flex gap-3 md:bottom-6">
        {tradable ? (
          <Button asChild className="flex-1">
            <Link href={`/app/invest/${asset.id}`}>Invest</Link>
          </Button>
        ) : (
          <Button asChild className="flex-1" variant="outline">
            <Link href="/app/markets">Coming soon</Link>
          </Button>
        )}
        <form action={toggleWatchlist.bind(null, asset.id)}>
          <Button type="submit" variant="outline" className="min-w-28">
            Watchlist
          </Button>
        </form>
      </div>
    </AppShell>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
