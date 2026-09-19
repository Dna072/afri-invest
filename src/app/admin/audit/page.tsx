import { AdminShell } from "@/components/chrome/admin-shell";
import { prisma } from "@/lib/db";

export default async function AuditAdmin() {
  const rows = await prisma.auditEvent.findMany({ take: 50, orderBy: { createdAt: "desc" } });
  return (
    <AdminShell title="Audit logs">
      <div className="space-y-2">
        {rows.map((e) => (
          <article key={e.id} className="rounded-2xl bg-card p-4 text-sm">
            <p className="font-medium">{e.action}</p>
            <p className="text-muted-foreground">{e.entity} {e.entityId} · {e.result} · {e.createdAt.toISOString()}</p>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
