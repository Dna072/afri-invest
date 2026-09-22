import Link from "next/link";
import { AppShell } from "@/components/chrome/app-shell";
import { AfricaMap } from "@/components/markets/africa-map";
import { SessionBadge } from "@/components/markets/session-badge";
import { StockRow } from "@/components/markets/stock-row";
import { StatusBadge } from "@/components/ui/money";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/money";

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
  const ghanaFirst = !sp.market || sp.market === "ghana";

  return (
    <AppShell title="Explore African Markets">
      {ghanaFirst ? (
        <div className="mb-6 rounded-[1.25rem] bg-[color:var(--navy-card)] p-6 text-primary-foreground">
          <p className="eyebrow text-accent">Ghana Stock Exchange</p>
          <h2 className="mt-2 font-display text-3xl">GSE listings, in the sandbox.</h2>
          <p className="mt-2 max-w-xl text-sm text-primary-foreground/70">
            Hours 09:30–15:00 GMT · Accra. Quotes are illustrative. Other exchanges stay marked coming soon.
          </p>
          <div className="mt-4">
            <SessionBadge className="bg-white/10 text-primary-foreground" />
          </div>
        </div>
      ) : (
        <p className="mb-4 text-sm text-muted-foreground">Preview market — not live. Ghana remains the modelled corridor.</p>
      )}
      <AfricaMap />
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        <FilterChip href="/app/markets" active={!sp.market}>
          All
        </FilterChip>
        {markets.map((m) => (
          <FilterChip key={m.id} href={`/app/markets?market=${m.id}`} active={sp.market === m.id}>
            {m.name}
          </FilterChip>
        ))}
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
        {types.map((t) => (
          <FilterChip
            key={t}
            href={`/app/markets?type=${t}${sp.market ? `&market=${sp.market}` : ""}`}
            active={sp.type === t}
          >
            {t}
          </FilterChip>
        ))}
      </div>
      <ul className="mt-5 space-y-2">
        {assets.map((asset) => (
          <li key={asset.id}>
            <StockRow
              href={`/app/assets/${asset.id}`}
              symbol={asset.symbol}
              name={asset.name}
              subtitle={`${asset.symbol} · ${asset.exchange.name} · ${asset.assetType}`}
              price={formatMoney(asset.price, asset.currency)}
              change={asset.changePercent}
            />
            {asset.tradability !== "open" ? (
              <div className="-mt-1 mb-2 px-1">
                <StatusBadge status={asset.market.status} />
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </AppShell>
  );
}

function FilterChip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`whitespace-nowrap rounded-[10px] px-4 py-2 text-sm transition ${active ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}
    >
      {children}
    </Link>
  );
}
