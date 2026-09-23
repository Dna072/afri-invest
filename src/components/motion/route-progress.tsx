"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export function RouteProgress() {
  const pathname = usePathname();
  const first = useRef(true);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setOn(true);
    const id = window.setTimeout(() => setOn(false), 720);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px] overflow-hidden",
        on ? "opacity-100" : "opacity-0",
      )}
      aria-hidden
    >
      <div className={cn("h-full w-full origin-left ghana-progress", on && "ghana-progress-run")} />
    </div>
  );
}
