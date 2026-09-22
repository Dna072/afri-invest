"use client";

import { useMemo, useState } from "react";
import {
  AFRICA_COUNTRIES,
  AFRICA_VIEWBOX,
  exchangeNote,
  formatPopulation,
  marketStatusLabel,
  type AfricaCountry,
} from "@/data/africa";
import { cn } from "@/lib/cn";

const FOCUS = ["GH", "NG", "KE", "ZA", "CI"] as const;

function fillFor(country: AfricaCountry, selected?: string) {
  if (country.iso2 === selected) return "var(--ghana-gold)";
  if (country.status === "pilot") return "var(--ghana-green)";
  if (country.status === "coming_soon") return "color-mix(in srgb, var(--accent) 55%, var(--navy-card))";
  if (country.status === "planned") return "color-mix(in srgb, var(--primary) 42%, var(--navy-card))";
  return "color-mix(in srgb, var(--navy-card) 55%, #3d5348)";
}

export function AfricaMap({
  onSelect,
  selectedIso,
}: {
  onSelect?: (iso2: string) => void;
  selectedIso?: string;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const [picked, setPicked] = useState(selectedIso ?? "GH");
  const active = hover ?? selectedIso ?? picked;
  const country = useMemo(
    () => AFRICA_COUNTRIES.find((c) => c.iso2 === active) ?? AFRICA_COUNTRIES.find((c) => c.iso2 === "GH"),
    [active],
  );

  return (
    <div className="relative overflow-hidden rounded-xl bg-[color:var(--navy-card)] text-on-navy">
      <svg viewBox={AFRICA_VIEWBOX} className="h-[22rem] w-full md:h-[28rem]" role="img" aria-label="Map of African markets">
        {AFRICA_COUNTRIES.map((c) => (
          <path
            key={c.iso2}
            d={c.path}
            fill={fillFor(c, hover ?? selectedIso ?? picked)}
            stroke="color-mix(in srgb, var(--on-navy) 22%, transparent)"
            strokeWidth={c.iso2 === "GH" ? 1.4 : 0.45}
            className="cursor-pointer transition-colors duration-200"
            onMouseEnter={() => setHover(c.iso2)}
            onMouseLeave={() => setHover(null)}
            onClick={() => {
              setPicked(c.iso2);
              onSelect?.(c.iso2);
            }}
          >
            <title>{`${c.name} · ${marketStatusLabel(c.status)}`}</title>
          </path>
        ))}
      </svg>
      {country ? (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-accent">{marketStatusLabel(country.status)}</p>
          <p className="mt-1 font-display text-2xl">{country.name}</p>
          <p className="mt-1 text-sm text-on-navy/75">
            {exchangeNote(country.iso2)} · pop. {formatPopulation(country.population)}
          </p>
        </div>
      ) : null}
      <div className="grid gap-2 border-t border-white/10 p-4 sm:grid-cols-5">
        {FOCUS.map((iso) => {
          const c = AFRICA_COUNTRIES.find((item) => item.iso2 === iso);
          if (!c) return null;
          return (
            <button
              key={iso}
              type="button"
              onClick={() => {
                setPicked(c.iso2);
                onSelect?.(c.iso2);
              }}
              className={cn(
                "rounded-lg px-3 py-2 text-left text-sm transition hover:-translate-y-0.5",
                (hover ?? selectedIso ?? picked) === iso ? "bg-white/20" : "bg-black/25",
              )}
            >
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-on-navy/70">{marketStatusLabel(c.status)}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
