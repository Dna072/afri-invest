import { cn } from "@/lib/cn";

/** Simplified Africa + Madagascar silhouette (decorative, not a map). */
export const AFRICA_PATH =
  "M178 22c28 4 52 22 62 48 18 8 42 22 46 46 6 28-12 50-24 72 18 22 38 48 26 78-10 24-42 32-58 54 8 26 6 56-18 74-24 18-58 14-84 2-22 18-56 22-82-2-24-22-22-62-8-88-28-18-46-52-28-84 12-22 46-28 62-50-16-24-6-56 18-74 18-22 50-28 72-18 6-8 18-10 28-8z";

export const MADAGASCAR_PATH = "M268 168c8 4 14 16 12 28-2 14-12 24-22 30-8-10-8-24-4-36 4-10 8-18 14-22z";

export function AfricaSilhouette({
  className,
  fill = "currentColor",
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg viewBox="0 0 320 400" className={cn("overflow-visible", className)} aria-hidden>
      <path d={AFRICA_PATH} fill={fill} />
      <path d={MADAGASCAR_PATH} fill={fill} />
    </svg>
  );
}
