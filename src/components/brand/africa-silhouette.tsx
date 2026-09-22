import { AFRICA_CLIP_PATH, AFRICA_COUNTRIES, AFRICA_VIEWBOX, countryByIso2 } from "@/data/africa";
import { cn } from "@/lib/cn";

export const AFRICA_PATH = AFRICA_CLIP_PATH;
export const MADAGASCAR_PATH = countryByIso2("MG")?.path ?? "";

export function AfricaSilhouette({
  className,
  fill = "currentColor",
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg viewBox={AFRICA_VIEWBOX} className={cn("overflow-visible", className)} aria-hidden>
      {AFRICA_COUNTRIES.map((country) => (
        <path key={country.iso2} d={country.path} fill={fill} />
      ))}
    </svg>
  );
}
