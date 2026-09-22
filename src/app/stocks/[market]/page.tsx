import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/chrome/public-shell";
import { StockRow } from "@/components/markets/stock-row";
import { Button } from "@/components/ui/button";
import { marketFromSlug, marketSlug, publicAssets } from "@/lib/markets-public";

export async function generateMetadata({ params }: { params: Promise<{ market: string }> }) {
  const { market } = await params;
  const found = marketFromSlug(market);
  return { title: found ? `${found.name} stocks` : "Market" };
}

export default async function CountryStocksPage({ params }: { params: Promise<{ market: string }> }) {
  const { market } = await params;
  const found = marketFromSlug(market);
  if (!found) notFound();
  const assets = publicAssets(found.id);
  const pilot = found.id === "ghana";

  return (
    <PublicShell>
      <div className="mx-auto max-w-6xl px-4 py-14">
        <p className="text-sm text-muted-foreground">
          <Link href="/stocks" className="hover:text-foreground">
            ← African stocks
          </Link>
        </p>
        <p className="eyebrow mt-6">{found.exchanges[0]?.name}</p>
        <h1 className="mt-2 font-display text-5xl">{found.name} stocks</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          {pilot
            ? "Ghana is our first pilot market. Complete KYC, add money, then buy shares, ETFs and government securities."
            : found.id === "global"
              ? "Global stocks and ETFs for African investors. This offering is not live yet."
              : `${found.name} will open after the Ghana pilot. You can browse listings now and we will notify you when trading starts.`}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/signup">Start investing</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/#how">How it works</Link>
          </Button>
        </div>
        <div className="mt-6 rounded-xl border border-border bg-card p-5">
          <p className="font-semibold">How do I buy {found.name} stocks?</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Open an account, verify your identity, add money, then place an order. Tax treatment depends on your country
            of residence, not only the exchange where the stock trades.
          </p>
        </div>
        <ul className="mt-8 grid gap-3 md:grid-cols-2">
          {assets.map((asset) => (
            <li key={asset.symbol}>
              <StockRow
                href={`/stocks/${marketSlug(found.id)}/${asset.symbol.toLowerCase()}`}
                symbol={asset.symbol}
                name={asset.name}
                subtitle={`${asset.symbol} · ${found.exchanges[0]?.name} · ${asset.assetType}`}
                price={`${asset.currency} ${asset.price}`}
                change={asset.changePercent}
              />
            </li>
          ))}
        </ul>
      </div>
    </PublicShell>
  );
}
