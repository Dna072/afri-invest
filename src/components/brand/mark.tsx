import { AfricaLogoMark, BrandWordmark } from "@/components/brand/logo-mark";
import { cn } from "@/lib/cn";

export function BrandMark({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <AfricaLogoMark stage={4} className={compact ? "h-7 w-9" : "h-8 w-10"} title="Africa Invest" />
      <BrandWordmark className={compact ? "text-base" : "text-lg"} />
    </span>
  );
}
