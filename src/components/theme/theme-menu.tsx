"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/provider";
import { cn } from "@/lib/cn";
import { PALETTE_META, PALETTES, type Appearance } from "@/lib/theme";

const appearances: Array<{ id: Appearance; label: string; icon: typeof Sun }> = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Monitor },
];

export function ThemeMenu({
  compact = false,
  align = "right",
  drop = "down",
}: {
  compact?: boolean;
  align?: "left" | "right";
  drop?: "up" | "down";
}) {
  const { appearance, palette, setAppearance, setPalette } = useTheme();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const ActiveIcon = appearance === "dark" ? Moon : appearance === "light" ? Sun : Monitor;

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        className={cn(
          "focus-ring inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition hover:bg-muted",
          open && "bg-muted",
        )}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={labelId}
        aria-label="Appearance and colour theme"
        onClick={() => setOpen((v) => !v)}
      >
        <ActiveIcon size={18} />
      </button>
      {open ? (
        <div
          id={labelId}
          role="dialog"
          aria-label="Theme"
          className={cn(
            "absolute z-50 w-64 rounded-xl border border-border bg-card p-3 shadow-[var(--shadow-hover)]",
            align === "right" ? "right-0" : "left-0",
            drop === "down" ? "top-full mt-2" : "bottom-full mb-2",
          )}
        >
          <p className="eyebrow">Appearance</p>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {appearances.map((item) => {
              const Icon = item.icon;
              const active = appearance === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAppearance(item.id)}
                  className={cn(
                    "flex min-h-10 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-medium transition",
                    active ? "bg-primary text-primary-foreground" : "bg-muted/70 hover:bg-muted",
                  )}
                >
                  <Icon size={14} />
                  {item.label}
                </button>
              );
            })}
          </div>
          <p className="eyebrow mt-3">Colour</p>
          <ul className="mt-2 grid gap-1">
            {PALETTES.map((id) => {
              const meta = PALETTE_META[id];
              const active = palette === id;
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => setPalette(id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition",
                      active ? "bg-muted" : "hover:bg-muted/70",
                    )}
                  >
                    <span className="flex h-6 overflow-hidden rounded-full ring-1 ring-border">
                      {meta.swatch.map((c) => (
                        <span key={c} className="h-6 w-3.5" style={{ background: c }} />
                      ))}
                    </span>
                    <span className="flex-1">
                      <span className="block font-medium leading-none">{meta.label}</span>
                      <span className="text-[11px] text-muted-foreground">{meta.hint}</span>
                    </span>
                    {active ? <span className="text-[11px] text-accent">On</span> : null}
                  </button>
                </li>
              );
            })}
          </ul>
          {!compact ? (
            <p className="mt-2 text-[11px] text-muted-foreground">Saved on this device. Ghana ribbon stays.</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
