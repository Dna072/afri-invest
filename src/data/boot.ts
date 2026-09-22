export const BRAND_TAGLINE = "Invest today. A brighter Africa tomorrow.";

export const BOOT_STAGES = [
  {
    id: 1,
    label: "Getting things ready…",
    progress: 20,
    step: "Explore",
    hint: "A continent of potential",
  },
  {
    id: 2,
    label: "Connecting markets…",
    progress: 40,
    step: "Connect",
    hint: "People, markets, ideas",
  },
  {
    id: 3,
    label: "Unlocking opportunities…",
    progress: 70,
    step: "Grow",
    hint: "Invest in real opportunities",
  },
  {
    id: 4,
    label: "Almost there…",
    progress: 95,
    step: "Impact",
    hint: "A brighter tomorrow",
  },
] as const;

export type BootStageId = (typeof BOOT_STAGES)[number]["id"];

export function bootStageAt(ms: number, totalMs: number) {
  const t = Math.min(1, Math.max(0, ms / totalMs));
  if (t < 0.22) return BOOT_STAGES[0];
  if (t < 0.48) return BOOT_STAGES[1];
  if (t < 0.74) return BOOT_STAGES[2];
  return BOOT_STAGES[3];
}

export function bootProgressAt(ms: number, totalMs: number) {
  const t = Math.min(1, Math.max(0, ms / totalMs));
  return Math.round(8 + t * 90);
}
