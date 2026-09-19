import { AdminShell } from "@/components/chrome/admin-shell";
import { prisma } from "@/lib/db";
import { StatusBadge } from "@/components/ui/money";

export default async function AmlAdmin() {
  const rows = await prisma.amlCase.findMany({ include: { alert: true, notes: true }, take: 40 });
  return (
    <AdminShell title="AML">
      <div className="space-y-2">
        {rows.map((c) => (
          <article key={c.id} className="rounded-2xl bg-card p-4">
            <div className="flex justify-between">
              <p>{c.alert.title}</p>
              <StatusBadge status={c.status} />
            </div>
            <p className="text-sm text-muted-foreground">{c.alert.details} · {c.riskLevel}</p>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
