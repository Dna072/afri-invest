import { cn } from "@/lib/cn";
import { formatMoney, formatSignedPercent } from "@/lib/money";

export function MoneyText({
  amount,
  currency,
  className,
  size = "md",
}: {
  amount: string | number;
  currency: string;
  className?: string;
  size?: "sm" | "md" | "xl";
}) {
  const sizes = { sm: "text-sm", md: "text-base", xl: "text-4xl md:text-5xl" };
  return (
    <span className={cn("tabular font-medium tracking-tight", sizes[size], className)}>
      {formatMoney(amount, currency)}
    </span>
  );
}

export function PriceChange({
  value,
  className,
  variant = "text",
}: {
  value: string | number;
  className?: string;
  variant?: "text" | "pill";
}) {
  const n = Number(value);
  const positive = n >= 0;
  return (
    <span
      className={cn(
        "tabular text-sm font-medium",
        variant === "pill" && "inline-flex rounded-full px-2 py-0.5 text-xs",
        positive ? "text-success" : "text-destructive",
        variant === "pill" && (positive ? "bg-success/10" : "bg-destructive/10"),
        className,
      )}
    >
      {formatSignedPercent(value)}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    completed: "bg-success/10 text-success",
    settled: "bg-success/10 text-success",
    pass: "bg-success/10 text-success",
    passed: "bg-success/10 text-success",
    active: "bg-success/10 text-success",
    matched: "bg-success/10 text-success",
    pending: "bg-warning/10 text-warning",
    processing: "bg-warning/10 text-warning",
    review: "bg-warning/10 text-warning",
    investigating: "bg-warning/10 text-warning",
    in_progress: "bg-warning/10 text-warning",
    failed: "bg-destructive/10 text-destructive",
    rejected: "bg-destructive/10 text-destructive",
    mismatch: "bg-destructive/10 text-destructive",
    coming_soon: "bg-muted text-muted-foreground",
    disabled: "bg-muted text-muted-foreground",
    not_started: "bg-muted text-muted-foreground",
  };
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs capitalize", map[status] ?? "bg-muted text-muted-foreground")}>
      {status.replaceAll("_", " ")}
    </span>
  );
}

export function SandboxMark() {
  return (
    <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent-foreground">
      Sandbox
    </span>
  );
}
