"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export function CountUp({
  value,
  prefix = "",
  decimals = 2,
  className,
}: {
  value: number;
  prefix?: string;
  decimals?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced) {
      setN(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const duration = 1100;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - p) ** 3;
      setN(value * eased);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, reduced]);

  return (
    <span className={cn("tabular", className)}>
      {prefix}
      {n.toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
    </span>
  );
}
