import { cn } from "@/lib/cn";

/** Decorative Africa + Madagascar — recognisable outline, not a gazetteer. */
export const AFRICA_PATH =
  "M118 20c42-12 86 6 96 48c26 8 48 38 32 74c32 22 42 70 8 96c14 38-8 84-50 98c-22 24-64 26-86-2c-28 16-64 0-72-40c-30-18-28-62 4-84c-30-24-18-66 18-78c-16-34 8-74 44-78c-4-16-2-28 6-34z";

export const MADAGASCAR_PATH =
  "M236 188c16 8 22 40 8 64c-14 14-32 6-34-16c0-24 12-42 26-48z";

export function AfricaSilhouette({
  className,
  fill = "currentColor",
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg viewBox="0 0 280 360" className={cn("overflow-visible", className)} aria-hidden>
      <path d={AFRICA_PATH} fill={fill} />
      <path d={MADAGASCAR_PATH} fill={fill} />
    </svg>
  );
}
