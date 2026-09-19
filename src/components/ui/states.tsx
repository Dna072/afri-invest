export function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card/60 px-6 py-12 text-center">
      <p className="font-display text-2xl">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}

export function ErrorState({ title, meaning, action }: { title: string; meaning: string; action: string }) {
  return (
    <div className="rounded-3xl border border-destructive/20 bg-card px-6 py-8">
      <p className="font-medium text-destructive">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{meaning}</p>
      <p className="mt-3 text-sm">{action}</p>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-muted ${className ?? "h-24"}`} />;
}
