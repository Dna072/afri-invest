"use client";

import { useMemo, useState } from "react";
import {
  AFRICA_COUNTRIES,
  AFRICA_VIEWBOX,
  exchangeNote,
  formatPopulation,
  marketStatusLabel,
  taxResidenceNote,
  type MarketRollout,
} from "@/data/africa";
import { cn } from "@/lib/cn";

type Props = {
  usersByResidence: Array<{ country: string; count: number }>;
};

const STATUS_FILL: Record<MarketRollout, string> = {
  pilot: "var(--ghana-green)",
  coming_soon: "color-mix(in srgb, var(--ghana-gold) 70%, #8a6b14)",
  planned: "color-mix(in srgb, var(--primary) 50%, #2c4036)",
  watch: "color-mix(in srgb, #6d7f74 55%, #102018)",
};

export function AfricaReportMap({ usersByResidence }: Props) {
  const [iso, setIso] = useState("GH");
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const row of usersByResidence) {
      map.set(row.country.toLowerCase(), row.count);
    }
    return map;
  }, [usersByResidence]);

  const country = AFRICA_COUNTRIES.find((c) => c.iso2 === iso) ?? AFRICA_COUNTRIES[0];
  const investors = counts.get(country.name.toLowerCase()) ?? 0;

  return (
    <section className="overflow-hidden rounded-xl bg-[color:var(--navy-card)] text-on-navy">
      <div className="grid gap-0 lg:grid-cols-[1.4fr_1fr]">
        <svg viewBox={AFRICA_VIEWBOX} className="h-[26rem] w-full lg:h-[32rem]" role="img" aria-label="Africa administrative map">
          {AFRICA_COUNTRIES.map((c) => (
            <path
              key={c.iso2}
              d={c.path}
              fill={iso === c.iso2 ? "var(--ghana-gold)" : STATUS_FILL[c.status]}
              stroke="color-mix(in srgb, var(--on-navy) 32%, transparent)"
              strokeWidth={c.iso2 === "GH" ? 1.6 : 0.55}
              className="cursor-pointer"
              onClick={() => setIso(c.iso2)}
            >
              <title>{c.name}</title>
            </path>
          ))}
        </svg>
        <div className="border-t border-white/10 p-5 lg:border-l lg:border-t-0">
          <p className="eyebrow text-accent">Country report</p>
          <h2 className="mt-2 font-display text-3xl">{country.name}</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <Row label="ISO" value={`${country.iso2} · ${country.iso3}`} />
            <Row label="Population" value={formatPopulation(country.population)} />
            <Row label="Market status" value={marketStatusLabel(country.status)} />
            <Row label="Exchange" value={exchangeNote(country.iso2)} />
            <Row label="Registered users" value={String(investors)} />
          </dl>
          <p className="mt-4 text-sm text-on-navy/75">{taxResidenceNote(country.name)}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-[11px]">
            {(
              [
                ["pilot", "Pilot"],
                ["coming_soon", "Coming soon"],
                ["planned", "Planned"],
                ["watch", "Watching"],
              ] as const
            ).map(([key, label]) => (
              <span key={key} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-1">
                <span className="h-2 w-2 rounded-full" style={{ background: STATUS_FILL[key] }} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="max-h-80 overflow-auto border-t border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-[color:var(--navy-card)] text-xs uppercase tracking-wide text-on-navy/60">
            <tr>
              <th className="px-4 py-2 font-medium">Country</th>
              <th className="px-4 py-2 font-medium">ISO</th>
              <th className="px-4 py-2 font-medium">Population</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Users</th>
            </tr>
          </thead>
          <tbody>
            {AFRICA_COUNTRIES.map((c) => (
              <tr
                key={c.iso2}
                className={cn("cursor-pointer border-t border-white/5 hover:bg-white/5", iso === c.iso2 && "bg-white/10")}
                onClick={() => setIso(c.iso2)}
              >
                <td className="px-4 py-2">{c.name}</td>
                <td className="px-4 py-2">{c.iso2}</td>
                <td className="px-4 py-2">{formatPopulation(c.population)}</td>
                <td className="px-4 py-2">{marketStatusLabel(c.status)}</td>
                <td className="px-4 py-2">{counts.get(c.name.toLowerCase()) ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-on-navy/60">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}
