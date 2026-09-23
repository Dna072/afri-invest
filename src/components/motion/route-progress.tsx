"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AfricaLogoMark } from "@/components/brand/logo-mark";
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
    const id = window.setTimeout(() => setOn(false), 900);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return (
    <>
      <div
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px] overflow-hidden",
          on ? "opacity-100" : "opacity-0",
        )}
        aria-hidden
      >
        <div className={cn("h-full w-full origin-left ghana-progress", on && "ghana-progress-run")} />
      </div>
      {on ? (
        <div className="pointer-events-none fixed inset-0 z-[69] grid place-items-center" aria-hidden>
          <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-background/80 shadow-[var(--shadow-hover)] backdrop-blur-md">
            <AfricaLogoMark motion="loop" className="h-20 w-20" />
          </div>
        </div>
      ) : null}
    </>
  );
}
