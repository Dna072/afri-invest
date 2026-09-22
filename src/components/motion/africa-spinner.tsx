"use client";

import { useId } from "react";
import { AFRICA_CLIP_PATH, AFRICA_COUNTRIES, AFRICA_VIEWBOX, countryByIso2 } from "@/data/africa";
import { cn } from "@/lib/cn";

export function AfricaSpinner({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const uid = useId().replace(/:/g, "");
  const sizes = { sm: "h-20 w-20", md: "h-32 w-32", lg: "h-52 w-52" };
  const stroke = `ghana-stroke-${uid}`;
  const fill = `ghana-fill-${uid}`;
  const clip = `africa-clip-${uid}`;
  const ghana = countryByIso2("GH");

  return (
    <div className={cn("relative", sizes[size], className)} role="status" aria-label="Loading">
      <svg viewBox="0 0 160 160" className="absolute inset-0 h-full w-full africa-ring">
        <defs>
          <linearGradient id={stroke} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--ghana-green)" />
            <stop offset="48%" stopColor="var(--ghana-gold)" />
            <stop offset="100%" stopColor="var(--ghana-red)" />
          </linearGradient>
        </defs>
        <circle
          cx="80"
          cy="80"
          r="74"
          fill="none"
          stroke={`url(#${stroke})`}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="150 330"
        />
      </svg>
      <svg viewBox={AFRICA_VIEWBOX} className="absolute inset-[10%] h-[80%] w-[80%]" aria-hidden>
        <defs>
          <linearGradient id={fill} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ghana-green)" />
            <stop offset="52%" stopColor="var(--ghana-gold)" />
            <stop offset="100%" stopColor="var(--ghana-red)" />
          </linearGradient>
          <clipPath id={clip}>
            <path d={AFRICA_CLIP_PATH} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clip})`}>
          <rect className="africa-liquid" x="0" y="0" width="400" height="430" fill={`url(#${fill})`} />
        </g>
        {AFRICA_COUNTRIES.map((country) => (
          <path
            key={country.iso2}
            d={country.path}
            fill={country.iso2 === "GH" ? "color-mix(in srgb, var(--ghana-gold) 55%, transparent)" : "none"}
            stroke={country.iso2 === "GH" ? "var(--ghana-gold)" : "color-mix(in srgb, var(--foreground) 14%, transparent)"}
            strokeWidth={country.iso2 === "GH" ? 1.6 : 0.45}
            strokeLinejoin="round"
          />
        ))}
        {ghana ? (
          <circle cx={ghana.cx} cy={ghana.cy} r="4.5" fill="var(--ghana-gold)" className="ghana-pulse" />
        ) : null}
      </svg>
    </div>
  );
}

export function AfricaLoader({
  label = "Loading African markets",
}: {
  label?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <AfricaSpinner size="lg" />
      <div>
        <p className="font-display text-2xl tracking-tight">Africa Invest</p>
        <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
