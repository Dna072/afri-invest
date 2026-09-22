"use client";

import { AfricaLogoMark } from "@/components/brand/logo-mark";
import { cn } from "@/lib/cn";

export function AfricaSpinner({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-16 w-16", md: "h-24 w-24", lg: "h-40 w-40" };

  return (
    <div className={cn("relative flex flex-col items-center", sizes[size], className)} role="status" aria-label="Loading">
      <AfricaLogoMark stage={4} className="h-full w-full africa-logo-breathe" />
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
        <p className="font-display text-2xl tracking-[0.12em] uppercase">
          Africa <span className="text-accent">Invest</span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
