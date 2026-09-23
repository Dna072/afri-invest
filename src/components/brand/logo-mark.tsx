"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";
import type { BootStageId } from "@/data/boot";

/**
 * Continent mark is the attached Africa Invest artwork. GeoJSON is not used
 * here — maps and admin reporting own that file.
 */
export const AFRICA_LOGO_ART = "/brand/africa-invest-mark.png";

export const AFRICA_LOGO_PATH =
  "M108.50 17.00L80.00 49.00L63.50 62.50L58.00 73.50L57.00 96.00L66.00 109.50L68.50 117.00L78.00 125.50L80.50 133.50L89.00 135.50L122.00 131.50L131.50 137.50L141.00 140.50L146.00 145.50L145.00 161.00L148.00 167.00L151.50 168.50L155.00 167.50L156.50 165.00L156.50 132.50L161.50 127.50L167.50 125.50L180.00 127.50L181.50 125.00L181.50 109.50L186.50 104.50L195.00 103.50L202.00 108.50L202.00 167.00L190.00 177.00L177.00 179.50L176.00 186.00L165.00 201.50L166.00 206.00L172.00 210.50L172.00 214.00L168.00 218.00L162.00 219.50L161.00 226.00L174.00 250.50L175.00 270.00L195.00 302.50L195.00 307.00L201.50 310.50L226.00 310.50L235.00 307.50L248.00 294.00L255.50 277.50L265.50 268.00L267.50 243.50L280.00 231.00L284.50 224.00L285.50 194.50L291.50 179.50L315.50 155.50L321.00 155.50L325.50 158.00L327.50 132.50L335.50 125.00L332.50 116.50L311.00 124.00L307.50 123.00L303.50 119.00L304.50 111.50L272.50 65.00L267.50 55.00L266.00 47.00L261.00 45.00L249.50 45.00L240.00 42.00L221.50 42.00L215.50 44.00L194.50 35.00L185.50 25.00L186.50 13.50L183.00 10.00L150.50 9.00L130.00 15.00L117.50 14.00Z";

export const MADAGASCAR_LOGO_PATH =
  "M336.00 210.00L331.50 211.00L322.00 222.00L308.50 229.50L306.00 234.50L305.00 246.00L298.00 259.50L298.00 269.00L300.50 276.00L311.00 277.50L318.00 272.00L330.50 244.00L331.50 237.50L336.50 230.00L338.50 216.50Z";

export const AFRICA_LOGO_VIEWBOX = "0 0 400 328";

/** Growth arrow that rides the gold ribbon and continues past the Horn. */
export const AFRICA_ARROW_PATH = "M128 196C172 182 214 158 252 130C282 110 312 86 344 58";
export const AFRICA_ARROW_HEAD = "M328 70L362 42L336 88Z";

export type LogoMotion = "static" | "assemble" | "loop";

const STAGE_REVEAL: Record<BootStageId, number> = {
  1: 34,
  2: 55,
  3: 78,
  4: 100,
};

export function AfricaLogoMark({
  stage = 4,
  motion: motionMode = "static",
  className,
  title,
}: {
  stage?: BootStageId;
  motion?: LogoMotion;
  className?: string;
  title?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const animated = motionMode !== "static";
  const reveal = animated ? 100 : STAGE_REVEAL[stage];

  return (
    <svg
      viewBox={AFRICA_LOGO_VIEWBOX}
      className={cn("overflow-visible", animated && `logo-${motionMode}`, className)}
      role="img"
      aria-hidden={!title}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id={`${uid}-shine`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="45%" stopColor="#fff" stopOpacity="0" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="55%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${uid}-clip`}>
          <path d={AFRICA_LOGO_PATH} />
          <path d={MADAGASCAR_LOGO_PATH} />
        </clipPath>
      </defs>
      <image
        className="logo-art logo-land"
        href={AFRICA_LOGO_ART}
        x="0"
        y="0"
        width="400"
        height="328"
        style={animated ? undefined : { clipPath: `inset(0 0 ${100 - reveal}% 0)` }}
        opacity={stage === 1 && !animated ? 0.72 : 1}
      />
      {motionMode === "loop" ? (
        <rect
          className="logo-shine"
          x="-40"
          y="0"
          width="120"
          height="328"
          fill={`url(#${uid}-shine)`}
          clipPath={`url(#${uid}-clip)`}
          pointerEvents="none"
        />
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
