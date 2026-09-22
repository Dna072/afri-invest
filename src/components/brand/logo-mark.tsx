"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";
import type { BootStageId } from "@/data/boot";

/** Smooth Africa + Madagascar matching the brand sheet, in the GeoJSON projection. */
export const AFRICA_LOGO_PATH =
  "M92 26C128 4 172 8 198 26C228 10 262 24 274 52C286 70 278 88 266 102C298 110 338 128 348 158C344 178 318 192 304 214C296 248 304 290 288 332C272 376 240 412 196 418C156 422 136 392 132 356C116 328 110 288 104 248C68 232 38 198 46 162C26 142 20 112 44 94C28 78 34 52 58 40C70 30 82 26 92 26Z";

export const MADAGASCAR_LOGO_PATH =
  "M332 252C350 260 354 296 338 322C322 336 306 326 304 300C304 274 316 250 332 252Z";

const BANDS: Record<BootStageId, Array<[string, string]>> = {
  1: [
    ["0%", "#d9d6d0"],
    ["100%", "#d9d6d0"],
  ],
  2: [
    ["0%", "#0b6b35"],
    ["48%", "#3fa33a"],
    ["48%", "#e0b31a"],
    ["100%", "#e0b31a"],
  ],
  3: [
    ["0%", "#0b6b35"],
    ["34%", "#3fa33a"],
    ["34%", "#e0b31a"],
    ["66%", "#e0b31a"],
    ["66%", "#e07a14"],
    ["100%", "#e07a14"],
  ],
  4: [
    ["0%", "#0b6b35"],
    ["22%", "#1f8a38"],
    ["22%", "#4aae3a"],
    ["42%", "#4aae3a"],
    ["42%", "#e0b31a"],
    ["62%", "#e0b31a"],
    ["62%", "#e07a14"],
    ["82%", "#e07a14"],
    ["82%", "#c94a16"],
    ["100%", "#c94a16"],
  ],
};

export function AfricaLogoMark({
  stage = 4,
  className,
  title,
}: {
  stage?: BootStageId;
  className?: string;
  title?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const showChart = stage === 4;

  return (
    <svg viewBox="0 0 400 430" className={cn("overflow-visible", className)} role="img" aria-hidden={!title}>
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id={`${uid}-fill`} x1="8%" y1="0%" x2="92%" y2="100%">
          {BANDS[stage].map(([offset, color], i) => (
            <stop key={`${offset}-${i}`} offset={offset} stopColor={color} />
          ))}
        </linearGradient>
        <clipPath id={`${uid}-clip`}>
          <path d={AFRICA_LOGO_PATH} />
          <path d={MADAGASCAR_LOGO_PATH} />
        </clipPath>
      </defs>
      <path d={AFRICA_LOGO_PATH} fill={`url(#${uid}-fill)`} />
      <path d={MADAGASCAR_LOGO_PATH} fill={stage === 1 ? "#d9d6d0" : stage === 2 ? "#e0b31a" : "#e07a14"} />
      {showChart ? (
        <g clipPath={`url(#${uid}-clip)`} fill="#f7f3e8">
          <rect x="156" y="148" width="16" height="52" rx="2" />
          <rect x="180" y="124" width="16" height="76" rx="2" />
          <rect x="204" y="96" width="16" height="104" rx="2" />
          <path
            d="M148 214C176 200 214 168 248 128"
            fill="none"
            stroke="#f7f3e8"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path d="M236 118 L268 104 L250 136 Z" />
        </g>
      ) : null}
    </svg>
  );
}

export function BrandWordmark({
  className,
  stacked = false,
}: {
  className?: string;
  stacked?: boolean;
}) {
  return (
    <span
      className={cn(
        "font-display tracking-[0.12em] uppercase",
        stacked ? "flex flex-col items-center leading-none" : "inline-flex items-baseline gap-[0.35em]",
        className,
      )}
    >
      <span>Africa</span>
      <span className="text-accent">Invest</span>
    </span>
  );
}
