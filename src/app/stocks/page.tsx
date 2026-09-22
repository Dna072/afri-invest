import Link from "next/link";
import { PublicShell } from "@/components/chrome/public-shell";
import { AfricaMap } from "@/components/markets/africa-map";
import { StockRow } from "@/components/markets/stock-row";
import { Button } from "@/components/ui/button";
import { ASSET_SEED, MARKET_SEED } from "@/mock/catalog";
import { marketSlug } from "@/lib/markets-public";

export const metadata = { title: "African stocks" };

const listings = ASSET_SEED.filter((a) => a.assetType === "equity" || a.assetType === "etf");

export default function StocksDirectoryPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-6xl px-4 py-14">
        <p className="eyebrow">Explore</p>
        <h1 className="mt-2 font-display text-5xl">African stocks and ETFs</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Browse listings across African exchanges. Ghana is the pilot market. Other exchanges and global stocks are
          marked coming soon. Create an account, complete KYC, then buy.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/signup">Start investing</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/stocks/ghana">Ghana stocks</Link>
          </Button>
        </div>
        <div className="mt-10">
          <AfricaMap />
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {MARKET_SEED.map((m) => (
            <Link
              key={m.id}
              href={`/stocks/${marketSlug(m.id)}`}
              className="rounded-lg bg-card px-4 py-2 text-sm hover:bg-muted"
            >
              {m.name}
            </Link>
          ))}
        </div>
        <ul className="mt-8 grid gap-3 md:grid-cols-2">
          {listings.map((asset) => (
            <li key={asset.symbol}>
              <StockRow
                href={`/stocks/${marketSlug(asset.marketId)}/${asset.symbol.toLowerCase()}`}
                symbol={asset.symbol}
                name={asset.name}
                subtitle={`${asset.symbol} · ${asset.country} · ${asset.assetType}`}
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
