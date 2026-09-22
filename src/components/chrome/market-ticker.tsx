import { AccraClock } from "@/components/brand/accra-clock";
import { ASSET_SEED } from "@/mock/catalog";

const tickers = ASSET_SEED.filter((a) => a.assetType === "equity").slice(0, 16);

export function MarketTicker() {
  const loop = [...tickers, ...tickers];
  return (
    <div className="relative border-b border-border bg-[#eef3ee]" aria-label="Sandbox market tape">
      <div className="ticker-wrap pr-28 sm:pr-44">
        <div className="ticker-track py-2">
          {loop.map((asset, i) => {
            const up = Number(asset.changePercent) >= 0;
            return (
              <span
                key={`${asset.symbol}-${i}`}
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
              </span>
            );
          })}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center bg-gradient-to-l from-[#eef3ee] via-[#eef3ee] to-transparent pl-8 pr-3">
        <AccraClock compact className="pointer-events-auto hidden sm:inline-flex" />
      </div>
    </div>
  );
}
