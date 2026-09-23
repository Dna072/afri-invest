"use client";

import { AnimatePresence, motion } from "framer-motion";
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
    const id = window.setTimeout(() => setOn(false), 1400);
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
      <AnimatePresence>
        {on ? (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[69] grid place-items-center bg-background/35 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden
          >
            <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-card/90 shadow-[var(--shadow-hover)]">
              <AfricaLogoMark motion="loop" className="h-24 w-24" />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
