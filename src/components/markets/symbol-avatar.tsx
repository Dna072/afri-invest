import { cn } from "@/lib/cn";

const PALETTE = ["#12382c", "#1d5d68", "#8a4634", "#3d4f2f", "#6b4f1d", "#2c4a3e", "#4a3a28"];

export function colorForSymbol(symbol: string) {
  let h = 0;
  for (const c of symbol) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export function SymbolAvatar({
  symbol,
  className,
  size = "md",
}: {
  symbol: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = { sm: "h-9 w-9 text-[10px]", md: "h-11 w-11 text-xs", lg: "h-14 w-14 text-sm" };
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-bold tracking-wide text-[#f7f2e6]",
        sizes[size],
        className,
      )}
      style={{ background: colorForSymbol(symbol) }}
      aria-hidden
    >
      {symbol.slice(0, 3)}
    </span>
  );
}
