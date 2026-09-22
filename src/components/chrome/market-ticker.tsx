import Link from "next/link";
import { ASSET_SEED } from "@/mock/catalog";

const tickers = ASSET_SEED.filter((a) => a.assetType === "equity").slice(0, 16);

export function MarketTicker() {
  const loop = [...tickers, ...tickers];
  return (
    <div className="relative overflow-hidden border-b border-border bg-[#eef3ee]" aria-label="Sandbox market tape">
      <div className="ticker-track py-2">
        {loop.map((asset, i) => {
          const up = Number(asset.changePercent) >= 0;
          return (
            <Link
              key={`${asset.symbol}-${i}`}
              href="/app/markets"
              className="mx-4 inline-flex items-center gap-2 text-[13px] whitespace-nowrap"
            >
              <span className="font-semibold">{asset.symbol}</span>
              <span className="text-muted-foreground">{asset.currency}</span>
              <span className="tabular">{asset.price}</span>
              <span className={`tabular ${up ? "text-success" : "text-destructive"}`}>
                {up ? "+" : ""}
                {asset.changePercent}%
              </span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium tracking-wide text-muted-foreground">
                {asset.marketId === "ghana" ? "GSE · SANDBOX" : "PREVIEW"}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
