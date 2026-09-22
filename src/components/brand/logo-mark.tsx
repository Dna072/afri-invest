"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";
import type { BootStageId } from "@/data/boot";

/**
 * Continent silhouette traced from the attached Africa outline artwork
 * (not GeoJSON). Styled to match the Africa Invest brand mark.
 */
export const AFRICA_LOGO_PATH =
  "M77.58 6.98L76.09 7.55L71.18 6.89L68.35 8.08L66.89 7.61L58.35 8.59L55.37 10.50L52.12 11.27L49.86 12.94L44.05 12.55L42.18 11.12L40.33 11.12L37.56 16.36L32.62 19.55L30.98 21.45L30.09 24.82L30.45 29.13L25.00 34.34L23.21 34.34L21.16 35.42L19.52 38.63L17.05 40.87L15.74 45.18L13.09 48.28L12.02 51.94L10.47 53.79L10.14 56.14L12.02 58.02L12.26 67.99L11.39 69.00L11.04 72.34L9.34 74.75L8.27 75.16L10.02 76.65L10.74 78.38L9.87 80.70L11.78 85.20L13.92 85.29L16.10 87.43L16.10 88.86L18.48 90.56L19.82 92.79L20.32 96.16L22.23 98.66L23.54 98.78L31.22 105.50L33.93 106.99L41.20 104.19L44.95 104.16L50.19 105.74L58.64 101.60L66.92 101.04L70.79 106.99L73.89 106.87L77.94 105.59L81.48 110.18L80.41 118.07L78.53 123.67L86.93 134.68L90.59 145.82L89.49 148.02L91.84 152.93L91.81 156.30L88.42 160.74L86.33 168.33L86.42 174.76L88.63 178.30L91.13 185.21L92.82 187.47L93.15 194.38L95.30 204.15L97.62 207.03L101.94 216.09L102.08 217.84L101.07 219.18L101.55 223.11L104.67 226.00L105.87 225.88L111.55 223.17L120.96 222.99L121.53 222.22L126.77 220.43L133.32 214.27L136.38 208.91L139.00 207.12L141.18 199.44L139.63 198.94L141.18 196.94L147.55 194.05L148.68 191.79L148.03 191.19L149.07 186.64L148.47 187.03L146.57 181.55L146.98 180.12L154.90 173.09L158.48 171.31L160.44 171.31L163.95 165.68L163.24 151.42L162.08 150.25L160.26 145.82L161.16 140.73L159.28 139.30L159.07 138.08L160.23 134.59L163.00 130.07L163.33 127.86L164.67 127.42L167.02 125.04L169.73 120.57L174.11 116.22L178.75 112.95L183.22 106.99L184.23 106.55L187.77 99.73L190.48 92.46L191.73 84.04L190.87 83.08L186.88 85.05L173.99 88.47L171.52 87.52L171.52 85.50L169.64 84.37L170.95 82.67L170.39 81.42L159.40 71.23L158.65 68.08L156.84 64.98L154.16 62.81L151.96 51.91L151.18 51.91L148.29 49.26L147.94 48.22L148.80 47.06L144.21 40.57L140.46 33.30L143.47 36.22L145.58 30.36L142.96 24.64L142.22 25.83L140.94 25.77L138.41 25.00L137.46 25.35L136.09 23.66L133.11 23.83L129.68 26.07L124.27 24.16L119.68 23.83L118.79 22.73L116.38 22.55L112.98 20.53L108.22 19.46L105.54 21.75L106.55 25.77L104.61 28.00L98.60 25.11L96.67 25.11L95.62 24.46L94.19 21.51L91.96 20.41L83.71 18.95L82.73 17.31L81.06 16.72L80.97 15.62L82.70 14.34L82.17 9.22L83.65 7.31L83.24 6.80L81.00 8.11L81.00 6.21L79.43 6.00L77.58 6.98Z";

export const MADAGASCAR_LOGO_PATH =
  "M185.66 157.31L185.21 159.87L183.99 161.48L182.62 161.48L182.77 162.97L181.82 164.19L177.74 167.73L173.18 168.92L172.14 171.75L171.37 172.41L171.40 175.68L172.59 179.17L172.41 180.45L170.62 183.87L168.90 184.91L168.57 187.71L169.52 191.37L169.73 195.42L170.21 196.32L171.34 196.32L173.60 197.74L178.69 195.42L187.42 170.59L187.21 167.05L187.71 166.42L188.34 168.95L189.38 166.60L188.76 160.94L187.74 157.79L186.29 156.27L185.66 157.31Z";

export const AFRICA_LOGO_VIEWBOX = "0 0 200 232";

const BANDS: Record<BootStageId, Array<[string, string]>> = {
  1: [
    ["0%", "#d8d5d0"],
    ["100%", "#d8d5d0"],
  ],
  2: [
    ["0%", "#0b6b35"],
    ["46%", "#3f9f36"],
    ["46%", "#e0b31a"],
    ["100%", "#e0b31a"],
  ],
  3: [
    ["0%", "#0b6b35"],
    ["32%", "#3f9f36"],
    ["32%", "#e0b31a"],
    ["64%", "#e0b31a"],
    ["64%", "#e07a14"],
    ["100%", "#e07a14"],
  ],
  4: [
    ["0%", "#0b6b35"],
    ["20%", "#0b6b35"],
    ["20%", "#3f9f36"],
    ["40%", "#3f9f36"],
    ["40%", "#e0b31a"],
    ["60%", "#e0b31a"],
    ["60%", "#e07a14"],
    ["80%", "#e07a14"],
    ["80%", "#c44512"],
    ["100%", "#c44512"],
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
  const madagascarFill = stage === 1 ? "#d8d5d0" : stage === 2 ? "#e0b31a" : "#e07a14";

  return (
    <svg viewBox={AFRICA_LOGO_VIEWBOX} className={cn("overflow-visible", className)} role="img" aria-hidden={!title}>
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id={`${uid}-fill`} x1="10%" y1="0%" x2="90%" y2="100%">
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
      <path d={MADAGASCAR_LOGO_PATH} fill={madagascarFill} />
      {showChart ? (
        <g clipPath={`url(#${uid}-clip)`}>
          <rect x="82" y="80" width="8" height="28" rx="1.2" fill="#f4efe4" />
          <rect x="94" y="66" width="8" height="42" rx="1.2" fill="#f4efe4" />
          <rect x="106" y="50" width="8" height="58" rx="1.2" fill="#f4efe4" />
          <path
            d="M70 122C90 112 118 88 142 58"
            fill="none"
            stroke="#f4efe4"
            strokeWidth="5.4"
            strokeLinecap="round"
          />
          <path d="M132 52 L152 46 L138 70 Z" fill="#f4efe4" />
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
