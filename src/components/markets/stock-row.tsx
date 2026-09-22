import Link from "next/link";
import { SymbolAvatar } from "@/components/markets/symbol-avatar";
import { PriceChange } from "@/components/ui/money";
import { cn } from "@/lib/cn";

export function StockRow({
  href,
  symbol,
  name,
  subtitle,
  price,
  change,
  className,
  dark = false,
}: {
  href: string;
  symbol: string;
  name: string;
  subtitle: string;
  price: string;
  change: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "lift flex items-center gap-3 rounded-xl px-4 py-3.5",
        dark ? "bg-white/5 hover:bg-white/8" : "bg-card",
        className,
      )}
    >
      <SymbolAvatar symbol={symbol} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{name}</p>
        <p className={cn("truncate text-xs", dark ? "text-on-navy/55" : "text-muted-foreground")}>
          {subtitle}
        </p>
      </div>
      <div className="text-right">
        <p className="tabular font-medium">{price}</p>
        <PriceChange value={change} variant="pill" />
      </div>
    </Link>
  );
}
