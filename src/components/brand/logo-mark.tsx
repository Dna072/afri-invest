"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";
import type { BootStageId } from "@/data/boot";

/** Smooth Africa + Madagascar matching the brand sheet, in the GeoJSON projection. */
export const AFRICA_LOGO_PATH =
  "M76 38C98 12 142 6 172 16C196 6 232 14 258 38C272 54 278 74 270 94C292 102 322 122 332 148C330 168 312 188 298 214C290 246 296 286 318 312C298 348 268 396 226 412C184 424 152 400 142 366C122 354 108 316 102 274C68 254 40 216 38 176C24 150 28 122 48 110C36 90 40 62 60 46C68 40 72 38 76 38Z";

export const MADAGASCAR_LOGO_PATH =
  "M328 248C342 254 348 280 340 306C328 324 310 320 306 298C304 274 314 250 328 248Z";

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
