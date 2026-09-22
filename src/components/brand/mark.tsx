import { cn } from "@/lib/cn";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg viewBox="0 0 28 28" className="h-7 w-7" aria-hidden>
        <circle cx="14" cy="14" r="13" fill="var(--navy-card)" />
        <path d="M8 16c3-7 9-7 12 0" fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M9.5 12.5c2.2-3.4 6.8-3.4 9 0" fill="none" stroke="var(--ghana-gold)" strokeWidth="1.1" strokeLinecap="round" />
        <circle cx="14" cy="17.5" r="1.4" fill="var(--ghana-red)" />
      </svg>
      <span className="font-display text-xl tracking-tight">Africa Invest</span>
    </span>
  );
}
