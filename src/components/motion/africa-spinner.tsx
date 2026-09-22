"use client";

import { useId } from "react";
import { AFRICA_PATH, MADAGASCAR_PATH } from "@/components/brand/africa-silhouette";
import { cn } from "@/lib/cn";

export function AfricaSpinner({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const uid = useId().replace(/:/g, "");
  const sizes = { sm: "h-16 w-16", md: "h-28 w-28", lg: "h-44 w-44" };
  const stroke = `ghana-stroke-${uid}`;
  const fill = `ghana-fill-${uid}`;
  const clip = `africa-clip-${uid}`;

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
          strokeDasharray="140 320"
        />
      </svg>
      <svg viewBox="0 0 280 360" className="absolute inset-[10%] h-[80%] w-[80%]">
        <defs>
          <linearGradient id={fill} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ghana-green)" />
            <stop offset="50%" stopColor="var(--ghana-gold)" />
            <stop offset="100%" stopColor="var(--ghana-red)" />
          </linearGradient>
          <clipPath id={clip}>
            <path d={AFRICA_PATH} />
            <path d={MADAGASCAR_PATH} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clip})`}>
          <rect className="africa-liquid" x="0" y="0" width="280" height="360" fill={`url(#${fill})`} />
        </g>
        <path
          d={AFRICA_PATH}
          fill="none"
          stroke={`url(#${stroke})`}
          strokeWidth="6"
          strokeLinejoin="round"
          className="africa-trace"
        />
        <path
          d={MADAGASCAR_PATH}
          fill="none"
          stroke="var(--ghana-gold)"
          strokeWidth="5"
          className="africa-trace"
        />
        <circle cx="92" cy="148" r="6" fill="var(--ghana-gold)" className="ghana-pulse" />
      </svg>
    </div>
  );
}

export function AfricaLoader({
  label = "Preparing your markets",
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
