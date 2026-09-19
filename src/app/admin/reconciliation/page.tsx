import { AdminShell } from "@/components/chrome/admin-shell";
import { prisma } from "@/lib/db";
import { StatusBadge } from "@/components/ui/money";

export default async function ReconAdmin() {
  const rows = await prisma.reconciliationItem.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <AdminShell title="Reconciliation">
      <div className="space-y-2">
        {rows.map((r) => (
          <article key={r.id} className="rounded-2xl bg-card p-4 text-sm">
            <div className="flex justify-between">
              <p>{r.sourceA} {r.amountA} vs {r.sourceB} {r.amountB}</p>
              <StatusBadge status={r.status} />
            </div>
            <p className="text-muted-foreground">Difference {r.currency} {r.difference}</p>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
