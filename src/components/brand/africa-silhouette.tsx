import { cn } from "@/lib/cn";

/** Map-like Africa + Madagascar (decorative). */
export const AFRICA_PATH =
  "M72 10 108 16 122 42 118 68 138 84 148 116 132 136 146 158 136 190 110 210 96 232 72 226 58 236 40 214 32 182 42 156 22 134 28 102 48 90 38 58 52 28Z";

export const MADAGASCAR_PATH = "M152 148 164 154 166 180 154 196 142 178Z";

export function AfricaSilhouette({
  className,
  fill = "currentColor",
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg viewBox="0 0 180 250" className={cn("overflow-visible", className)} aria-hidden>
      <path d={AFRICA_PATH} fill={fill} />
      <path d={MADAGASCAR_PATH} fill={fill} />
    </svg>
  );
}
