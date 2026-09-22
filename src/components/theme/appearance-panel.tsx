"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/provider";
import { cn } from "@/lib/cn";
import { PALETTE_META, PALETTES, type Appearance } from "@/lib/theme";

const appearances: Array<{ id: Appearance; label: string; hint: string; icon: typeof Sun }> = [
  { id: "light", label: "Light", hint: "Warm paper", icon: Sun },
  { id: "dark", label: "Dark", hint: "Night markets", icon: Moon },
  { id: "system", label: "System", hint: "Match the device", icon: Monitor },
];

export function AppearancePanel() {
  const { appearance, palette, setAppearance, setPalette } = useTheme();

  return (
    <section className="rounded-xl bg-card p-5">
      <p className="eyebrow">Appearance</p>
      <h2 className="mt-1 font-display text-2xl">Light, dark, and colour.</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Saved on this device. The Ghana ribbon and Accra clock stay. Midnight is the closest to a classic navy desk.
      </p>
      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        {appearances.map((item) => {
          const Icon = item.icon;
          const active = appearance === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setAppearance(item.id)}
              className={cn(
                "flex min-h-16 flex-col items-start justify-center rounded-lg px-3 py-2 text-left transition",
                active ? "bg-primary text-primary-foreground" : "bg-muted/70 hover:bg-muted",
              )}
            >
              <span className="flex items-center gap-2 text-sm font-semibold">
                <Icon size={16} />
                {item.label}
              </span>
              <span className={cn("text-[11px]", active ? "text-primary-foreground/75" : "text-muted-foreground")}>
                {item.hint}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {PALETTES.map((id) => {
          const meta = PALETTE_META[id];
          const active = palette === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setPalette(id)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-3 text-left transition",
                active ? "ring-2 ring-primary" : "bg-muted/50 hover:bg-muted",
              )}
            >
              <span className="flex h-8 overflow-hidden rounded-full ring-1 ring-border">
                {meta.swatch.map((c) => (
                  <span key={c} className="h-8 w-5" style={{ background: c }} />
                ))}
              </span>
              <span>
                <span className="block text-sm font-semibold">{meta.label}</span>
                <span className="text-[11px] text-muted-foreground">{meta.hint}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
