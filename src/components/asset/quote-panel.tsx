"use client";

import { useState } from "react";
import { PortfolioChart } from "@/components/charts/portfolio-chart";
import { SessionBadge } from "@/components/markets/session-badge";
import { SymbolAvatar } from "@/components/markets/symbol-avatar";
import { MoneyText, PriceChange, SandboxMark } from "@/components/ui/money";
import { cn } from "@/lib/cn";
import { compactAmount } from "@/lib/money";

const RANGES = [
  { id: "1W", take: 7 },
  { id: "1M", take: 20 },
  { id: "ALL", take: 999 },
] as const;

const TABS = ["Overview", "About", "Risk"] as const;

export type QuoteAsset = {
  name: string;
  symbol: string;
  exchangeName: string;
  currency: string;
  price: string;
  previousClose: string;
  changePercent: string;
  marketCap: string | null;
  dividendYield: string | null;
  week52High: string | null;
  week52Low: string | null;
  sector: string | null;
  description: string;
  riskCategory: string;
  marketStatus: string;
};

export function QuotePanel({
  asset,
  chart,
}: {
  asset: QuoteAsset;
  chart: Array<{ label: string; value: number }>;
}) {
  const [range, setRange] = useState<(typeof RANGES)[number]["id"]>("1M");
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const take = RANGES.find((r) => r.id === range)?.take ?? 20;
  const sliced = chart.slice(-take);

  const facts = [
    ["Prev close", asset.previousClose],
    ["Last", asset.price],
    asset.week52Low && asset.week52High ? ["52-week", `${asset.week52Low} – ${asset.week52High}`] : null,
    asset.marketCap ? ["Market cap", compactAmount(asset.marketCap)] : null,
    asset.dividendYield ? ["Div. yield", `${asset.dividendYield}%`] : null,
    asset.sector ? ["Sector", asset.sector] : null,
  ].filter(Boolean) as Array<[string, string]>;

  return (
    <div>
      <div className="flex flex-wrap items-start gap-4">
        <SymbolAvatar symbol={asset.symbol} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-2xl md:text-3xl">{asset.name}</h2>
            <span className="rounded-full bg-[color:var(--ghana-green)]/15 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[color:var(--ghana-green)]">
              {asset.exchangeName === "Ghana Stock Exchange" ? "GSE" : asset.exchangeName}
            </span>
            <SandboxMark />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {asset.symbol} · {asset.exchangeName} · {asset.currency}
          </p>
          <div className="mt-2">
            <SessionBadge />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-end gap-3">
        <MoneyText amount={asset.price} currency={asset.currency} size="xl" />
        <PriceChange value={asset.changePercent} variant="pill" />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {facts.map(([label, value]) => (
          <div key={label} className="rounded-xl bg-card px-4 py-3">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className="mt-1 tabular text-sm font-medium">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-card p-4">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRange(r.id)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition",
                range === r.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {r.id}
            </button>
          ))}
        </div>
        {sliced.length > 1 ? <PortfolioChart data={sliced} /> : <p className="py-8 text-center text-sm text-muted-foreground">No price history yet.</p>}
        <p className="mt-2 text-[11px] text-muted-foreground">Illustrative prices · not a live chart</p>
      </div>

      <div className="mt-6 border-b border-border">
        <div className="flex gap-1">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "relative px-4 py-2.5 text-sm font-semibold transition",
                tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
              {tab === t ? (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent" />
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 text-sm leading-6 text-muted-foreground">
        {tab === "Overview" ? (
          <div className="space-y-3">
            <p>
              {asset.symbol} is modelled on the {asset.exchangeName}. Status: {asset.marketStatus.replaceAll("_", " ")}.
              Prices are illustrative.
            </p>
            <p>{asset.description}</p>
          </div>
        ) : null}
        {tab === "About" ? <p>{asset.description}</p> : null}
        {tab === "Risk" ? (
          <p>
            Prices can fall. Currency moves can amplify gains and losses. This listing is educational — not a
            recommendation. Risk band: {asset.riskCategory}.
          </p>
        ) : null}
      </div>
    </div>
  );
}
