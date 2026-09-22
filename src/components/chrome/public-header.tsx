"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { AccraClock } from "@/components/brand/accra-clock";
import { BrandMark } from "@/components/brand/mark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const links = [
  { href: "/#markets", label: "Markets" },
  { href: "/#how", label: "How it works" },
  { href: "/fees", label: "Fees" },
  { href: "/investor-demo", label: "Product tour" },
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur transition-shadow duration-300",
        scrolled && "shadow-[0_8px_24px_rgba(18,36,28,0.08)]",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="focus-ring rounded-md">
          <BrandMark />
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-muted-foreground transition hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <AccraClock compact />
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">
              Open account <span aria-hidden>→</span>
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-1 md:hidden">
          <button
            type="button"
            className="focus-ring rounded-md p-2"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <div className="hidden items-center gap-2 md:flex lg:hidden">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Open account</Link>
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <div className="grid gap-1 px-4 py-3 text-sm">
              {links.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-2">
                  {l.label}
                </Link>
              ))}
              <Link href="/login" onClick={() => setOpen(false)} className="py-2">
                Sign in
              </Link>
              <Button asChild className="mt-1">
                <Link href="/signup">Open account</Link>
              </Button>
              <AccraClock className="py-2" />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
