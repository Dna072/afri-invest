"use client";

import { useId } from "react";
import { AfricaLogoMark, BrandWordmark } from "@/components/brand/logo-mark";
import { cn } from "@/lib/cn";

function OrbitRing({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 120 120" className={cn("logo-orbit pointer-events-none absolute inset-[-18%]", className)} aria-hidden>
      <defs>
        <linearGradient id={`${uid}-orbit`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--ghana-green)" />
          <stop offset="50%" stopColor="var(--ghana-gold)" />
          <stop offset="100%" stopColor="var(--ghana-red)" />
        </linearGradient>
      </defs>
      <circle
        cx="60"
        cy="60"
        r="54"
        fill="none"
        stroke={`url(#${uid}-orbit)`}
        strokeWidth="3"
        strokeDasharray="18 10"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}

export function AfricaSpinner({
  className,
  size = "md",
  orbit = true,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  orbit?: boolean;
}) {
  const sizes = { sm: "h-16 w-[4.9rem]", md: "h-24 w-[7.35rem]", lg: "h-40 w-[12.25rem]" };

  return (
    <div className={cn("relative flex items-center justify-center", sizes[size], className)} role="status" aria-label="Loading">
      {orbit ? <OrbitRing /> : null}
      <AfricaLogoMark motion="loop" className="h-full w-full" />
    </div>
  );
}

export function AfricaLoader({
  label = "Connecting markets…",
}: {
  label?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <AfricaSpinner size="lg" />
      <div>
        <BrandWordmark className="text-2xl" />
        <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[50dvh] flex-col items-center justify-center gap-4">
      <AfricaSpinner size="lg" />
      <p className="text-sm text-muted-foreground">Connecting markets…</p>
    </div>
  );
}
