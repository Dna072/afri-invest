"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  APPEARANCE_KEY,
  PALETTE_KEY,
  applyTheme,
  readStoredAppearance,
  readStoredPalette,
  type Appearance,
  type Palette,
} from "@/lib/theme";

type ThemeContextValue = {
  appearance: Appearance;
  palette: Palette;
  setAppearance: (next: Appearance) => void;
  setPalette: (next: Palette) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [appearance, setAppearanceState] = useState<Appearance>("system");
  const [palette, setPaletteState] = useState<Palette>("forest");

  useEffect(() => {
    setAppearanceState(readStoredAppearance());
    setPaletteState(readStoredPalette());
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => applyTheme(appearance, palette, media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [appearance, palette]);

  const setAppearance = useCallback((next: Appearance) => {
    window.localStorage.setItem(APPEARANCE_KEY, next);
    setAppearanceState(next);
  }, []);

  const setPalette = useCallback((next: Palette) => {
    window.localStorage.setItem(PALETTE_KEY, next);
    setPaletteState(next);
  }, []);

  const value = useMemo(
    () => ({ appearance, palette, setAppearance, setPalette }),
    [appearance, palette, setAppearance, setPalette],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
