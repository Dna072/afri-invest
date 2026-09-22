"use client";

import { useEffect, useState } from "react";
import { getAccraClock } from "@/lib/accra";
import { cn } from "@/lib/cn";

export function AccraClock({ className, compact = false }: { className?: string; compact?: boolean }) {
  const [clock, setClock] = useState(() => getAccraClock());

  useEffect(() => {
    const id = window.setInterval(() => setClock(getAccraClock()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={cn("inline-flex items-center gap-1.5 tabular text-xs text-muted-foreground", className)}>
      <span className="relative flex h-1.5 w-1.5">
        <span
          className={cn(
            "absolute inline-flex h-full w-full rounded-full opacity-60",
            clock.insideHours ? "animate-ping bg-[color:var(--ghana-green)]" : "bg-muted-foreground",
          )}
        />
        <span
          className={cn(
            "relative inline-flex h-1.5 w-1.5 rounded-full",
            clock.insideHours ? "bg-[color:var(--ghana-green)]" : "bg-muted-foreground",
          )}
        />
      </span>
      {compact ? (
        <span>Accra {clock.time}</span>
      ) : (
        <span>
          Accra {clock.time} GMT · {clock.label}
        </span>
      )}
    </span>
  );
}
