"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { AfricaLoader } from "@/components/motion/africa-spinner";

const BOOT_KEY = "ai-booted";

export function BootLoader() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (window.sessionStorage.getItem(BOOT_KEY)) {
      setVisible(false);
      return;
    }
    const ms = reduced ? 200 : 1700;
    const id = window.setTimeout(() => {
      window.sessionStorage.setItem(BOOT_KEY, "1");
      setVisible(false);
    }, ms);
    return () => window.clearTimeout(id);
  }, [reduced]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-background/95 backdrop-blur-md"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.12 : 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="kente-ribbon absolute inset-x-0 top-0" aria-hidden />
          <AfricaLoader />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
