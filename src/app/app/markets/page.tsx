import Link from "next/link";
import { AppShell } from "@/components/chrome/app-shell";
import { AfricaMap } from "@/components/markets/africa-map";
import { MoneyText, PriceChange, SandboxMark, StatusBadge } from "@/components/ui/money";
import { prisma } from "@/lib/db";

export default async function MarketsPage({
  searchParams,
}: {
  searchParams: Promise<{ market?: string; type?: string }>;
}) {
  const sp = await searchParams;
  const markets = await prisma.market.findMany({ include: { exchanges: true } });
  const assets = await prisma.asset.findMany({
    where: {
      ...(sp.market ? { marketId: sp.market } : {}),
      ...(sp.type ? { assetType: sp.type } : {}),
    },
    include: { market: true, exchange: true },
    orderBy: { symbol: "asc" },
  });
  const types = ["equity", "bond", "treasury", "fund", "etf", "ipo"];

  return (
    <AppShell title="Explore African Markets">
      <AfricaMap />
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        <FilterChip href="/app/markets" active={!sp.market}>All</FilterChip>
        {markets.map((m) => (
          <FilterChip key={m.id} href={`/app/markets?market=${m.id}`} active={sp.market === m.id}>
            {m.name}
          </FilterChip>
        ))}
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
        {types.map((t) => (
          <FilterChip key={t} href={`/app/markets?type=${t}${sp.market ? `&market=${sp.market}` : ""}`} active={sp.type === t}>
            {t}
          </FilterChip>
        ))}
      </div>
      <ul className="mt-5 space-y-2">
        {assets.map((asset) => (
          <li key={asset.id}>
            <Link href={`/app/assets/${asset.id}`} className="lift flex items-center justify-between rounded-xl bg-card px-4 py-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{asset.name}</p>
                  <SandboxMark />
                </div>
                <p className="text-xs text-muted-foreground">
                  {asset.symbol} · {asset.exchange.name} · {asset.assetType}
                </p>
              </div>
              <div className="text-right">
                <MoneyText amount={asset.price} currency={asset.currency} />
                <div><PriceChange value={asset.changePercent} /></div>
                {asset.tradability !== "open" ? <StatusBadge status={asset.market.status} /> : null}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}

function FilterChip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className={`whitespace-nowrap rounded-[10px] px-4 py-2 text-sm ${active ? "bg-primary text-primary-foreground" : "bg-card"}`}>
      {children}
    </Link>
  );
}
