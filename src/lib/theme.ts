export const APPEARANCES = ["light", "dark", "system"] as const;
export type Appearance = (typeof APPEARANCES)[number];

export const PALETTES = ["forest", "ocean", "sahel", "gold", "midnight"] as const;
export type Palette = (typeof PALETTES)[number];

export const PALETTE_META: Record<
  Palette,
  { label: string; hint: string; swatch: [string, string, string] }
> = {
  forest: { label: "Forest", hint: "Ghana green", swatch: ["#12382c", "#c9a24a", "#f4f1ea"] },
  ocean: { label: "Atlantic", hint: "Coastal teal", swatch: ["#1a5560", "#c9a24a", "#eef3f4"] },
  sahel: { label: "Sahel", hint: "Terracotta", swatch: ["#8b3e2f", "#d4a04a", "#f6efe6"] },
  gold: { label: "Gold", hint: "Warm luxe", swatch: ["#4a3c1c", "#c9a24a", "#f8f4e8"] },
  midnight: { label: "Midnight", hint: "Deep navy", swatch: ["#1a2744", "#c9a24a", "#f4f6fa"] },
};

export const APPEARANCE_KEY = "ai-appearance";
export const PALETTE_KEY = "ai-palette";

export function isAppearance(value: string | null): value is Appearance {
  return APPEARANCES.includes(value as Appearance);
}

export function isPalette(value: string | null): value is Palette {
  return PALETTES.includes(value as Palette);
}

export function resolveDark(appearance: Appearance, prefersDark: boolean) {
  return appearance === "dark" || (appearance === "system" && prefersDark);
}

export function readStoredAppearance(): Appearance {
  if (typeof window === "undefined") return "system";
  const raw = window.localStorage.getItem(APPEARANCE_KEY);
  return isAppearance(raw) ? raw : "system";
}

export function readStoredPalette(): Palette {
  if (typeof window === "undefined") return "forest";
  const raw = window.localStorage.getItem(PALETTE_KEY);
  return isPalette(raw) ? raw : "forest";
}

export function applyTheme(appearance: Appearance, palette: Palette, prefersDark = false) {
  const root = document.documentElement;
  const dark = resolveDark(appearance, prefersDark);
  root.classList.toggle("dark", dark);
  root.setAttribute("data-palette", palette);
  root.style.colorScheme = dark ? "dark" : "light";
  const themeColor = dark ? "#0b1410" : palette === "midnight" ? "#1a2744" : "#12382c";
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", themeColor);
}

export const THEME_BOOT = `(function(){try{var t=localStorage.getItem("${APPEARANCE_KEY}")||"system";var p=localStorage.getItem("${PALETTE_KEY}")||"forest";var dark=t==="dark"||(t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.classList.toggle("dark",dark);r.setAttribute("data-palette",p);r.style.colorScheme=dark?"dark":"light";}catch(e){}})();`;
