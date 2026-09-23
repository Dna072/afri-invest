"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { AfricaLogoMark, BrandWordmark } from "@/components/brand/logo-mark";
import { BOOT_STAGES, BRAND_TAGLINE, bootProgressAt, bootStageAt, elapsedForStage, type BootStageId } from "@/data/boot";

const BOOT_KEY = "ai-booted";
const BOOT_MS = 4000;

export function BootLoader() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [frozen, setFrozen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const force = params.has("boot");
    const freeze = Number(params.get("stage"));
    if (freeze >= 1 && freeze <= 4) {
      setElapsed(elapsedForStage(freeze, BOOT_MS));
      setFrozen(true);
      return;
    }
    if (!force && (window.sessionStorage.getItem(BOOT_KEY) || navigator.webdriver)) {
      setVisible(false);
      return;
    }
    if (reduced) {
      const id = window.setTimeout(() => {
        window.sessionStorage.setItem(BOOT_KEY, "1");
        setVisible(false);
      }, 240);
      return () => window.clearTimeout(id);
    }
    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const ms = now - started;
      setElapsed(ms);
      if (ms >= BOOT_MS) {
        window.sessionStorage.setItem(BOOT_KEY, "1");
        setVisible(false);
        return;
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [reduced]);

  const stage = bootStageAt(elapsed, BOOT_MS);
  const progress = bootProgressAt(elapsed, BOOT_MS);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.12 : 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="kente-ribbon absolute inset-x-0 top-0" aria-hidden />
          <BrandBootScreen stage={stage.id} label={stage.label} progress={progress} frozen={frozen} />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function BrandBootScreen({
  stage,
  label,
  progress,
  frozen = false,
}: {
  stage: BootStageId;
  label: string;
  progress: number;
  frozen?: boolean;
}) {
  return (
    <div className="flex w-full max-w-lg flex-col items-center px-6 text-center" role="status" aria-label={label}>
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="h-40 w-[12.25rem] md:h-48 md:w-[14.7rem]"
      >
        <AfricaLogoMark stage={stage} motion={frozen ? "static" : "assemble"} className="h-full w-full" />
      </motion.div>
      <BrandWordmark className="mt-6 text-3xl md:text-4xl" />
      <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{BRAND_TAGLINE}</p>
      <p className="mt-8 text-sm font-medium">{label}</p>
      <div className="mt-3 flex w-full max-w-xs items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,var(--ghana-green),var(--ghana-gold),var(--ghana-red))] transition-[width] duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="w-10 text-right text-xs tabular text-muted-foreground">{progress}%</span>
      </div>
      <ol className="relative mt-10 grid w-full grid-cols-4 gap-2 text-[11px]">
        <span
          className="absolute left-[12%] right-[12%] top-3 h-px bg-[linear-gradient(90deg,var(--ghana-green),var(--ghana-gold),var(--ghana-red))]"
          aria-hidden
        />
        {BOOT_STAGES.map((item) => {
          const active = item.id === stage;
          const done = item.id < stage;
          return (
            <li key={item.id} className={active ? "text-foreground" : "text-muted-foreground"}>
              <span
                className="relative z-10 mx-auto mb-2 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold"
                style={{
                  background: done || active ? "linear-gradient(135deg, var(--ghana-green), var(--ghana-gold), var(--ghana-red))" : "var(--card)",
                  color: done || active ? "#fff" : "inherit",
                  boxShadow: "0 0 0 4px var(--background)",
                }}
              >
                {item.id}
              </span>
              <p className="font-semibold uppercase tracking-[0.14em]">{item.step}</p>
              <p className="mt-1 hidden text-[10px] leading-snug sm:block">{item.hint}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
