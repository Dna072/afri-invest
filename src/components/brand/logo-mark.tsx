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
  "M52.33 6.00L47.33 9.00L29.00 27.33L26.00 33.33L25.00 45.33L36.00 60.33L39.33 62.67L57.00 60.67L63.67 64.00L66.00 66.67L66.00 75.33L72.00 82.33L72.67 61.67L76.67 58.67L78.67 60.00L79.00 83.00L74.00 94.33L74.67 97.67L73.00 99.33L73.00 103.33L79.00 112.67L80.00 122.33L84.67 128.00L89.00 139.33L92.33 142.67L108.33 142.67L116.67 134.33L119.00 126.00L122.67 123.33L123.67 112.67L129.67 105.33L131.67 101.33L131.67 97.33L109.67 99.00L108.00 97.00L129.33 85.67L146.00 70.00L147.67 71.00L149.00 76.33L150.67 77.33L155.67 51.33L136.00 58.33L136.33 59.67L143.67 62.00L145.00 64.00L143.67 66.67L130.67 79.67L116.67 88.67L98.67 96.00L97.00 94.67L98.00 93.00L110.33 88.67L116.33 84.67L124.67 76.33L134.67 62.33L130.00 58.00L141.33 53.00L130.00 39.67L125.67 31.00L123.67 23.33L121.33 21.00L107.33 18.00L95.67 19.00L89.00 15.67L86.00 12.67L86.67 6.33L85.33 4.00L81.33 3.00L70.33 3.00L59.00 6.00Z";

export const MADAGASCAR_LOGO_PATH =
  "M155.33 96.00L151.33 96.00L145.67 101.67L140.00 104.33L136.00 118.33L136.00 124.33L138.33 127.67L142.33 127.67L147.67 122.33L155.67 102.33Z";

export const AFRICA_LOGO_VIEWBOX = "0 0 183 150";

/** Growth arrow that rides the gold band and continues past the Horn. */
export const AFRICA_ARROW_PATH = "M64 99C88 92 112 78 132 58C144 46 156 32 168 20";
export const AFRICA_ARROW_HEAD = "M160 26L176 10L164 34Z";

export type LogoMotion = "static" | "assemble" | "loop";

const STAGE_REVEAL: Record<BootStageId, number> = {
  1: 34,
  2: 52,
  3: 74,
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
        width="183"
        height="150"
        style={animated ? undefined : { clipPath: `inset(0 0 ${100 - reveal}% 0)` }}
        opacity={stage === 1 && !animated ? 0.72 : 1}
      />
      {motionMode === "loop" ? (
        <rect
          className="logo-shine"
          x="-20"
          y="0"
          width="60"
          height="150"
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
