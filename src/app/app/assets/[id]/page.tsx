import Link from "next/link";
import { QuotePanel } from "@/components/asset/quote-panel";
import { AppShell } from "@/components/chrome/app-shell";
import { Button } from "@/components/ui/button";
import { toggleWatchlist } from "@/app/app/assets/actions";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

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
    <AppShell title={asset.symbol}>
      <p className="mb-4 text-sm text-muted-foreground">
        <Link href="/app/markets" className="hover:text-foreground">
          ← Markets
        </Link>
        <span className="mx-2">·</span>
        {asset.exchange.name}
      </p>
      <QuotePanel
        asset={{
          name: asset.name,
          symbol: asset.symbol,
          exchangeName: asset.exchange.name,
          currency: asset.currency,
          price: asset.price,
          previousClose: asset.previousClose,
          changePercent: asset.changePercent,
          marketCap: asset.marketCap,
          dividendYield: asset.dividendYield,
          week52High: asset.week52High,
          week52Low: asset.week52Low,
          sector: asset.sector,
          description: asset.description,
          riskCategory: asset.riskCategory,
          marketStatus: asset.market.status,
        }}
        chart={chart}
      />
      {asset.bondTerms ? (
        <p className="mt-4 text-sm text-muted-foreground">Indicative yield {asset.bondTerms.yieldPercent}% · sandbox</p>
      ) : null}
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
            Watch
          </Button>
        </form>
      </div>
    </AppShell>
  );
}
