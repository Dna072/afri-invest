"use client";

import { useEffect, useState } from "react";
import { getAccraClock } from "@/lib/accra";
import { cn } from "@/lib/cn";

export function SessionBadge({ className }: { className?: string }) {
  const [clock, setClock] = useState(() => getAccraClock());

  useEffect(() => {
    const id = window.setInterval(() => setClock(getAccraClock()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        clock.insideHours ? "bg-[color:var(--ghana-green)]/15 text-[color:var(--ghana-green)]" : "bg-muted text-muted-foreground",
        className,
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", clock.insideHours ? "bg-[color:var(--ghana-green)]" : "bg-muted-foreground")}
      />
      {clock.insideHours ? "GSE open" : "GSE closed"} · 09:30–15:00 GMT
    </span>
  );
}
