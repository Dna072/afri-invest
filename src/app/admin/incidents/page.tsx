import { AdminShell } from "@/components/chrome/admin-shell";
import { prisma } from "@/lib/db";
import { StatusBadge } from "@/components/ui/money";

export default async function IncidentsAdmin() {
  const rows = await prisma.incident.findMany({ include: { events: true, actions: true } });
  return (
    <AdminShell title="Incidents">
      <div className="space-y-2">
        {rows.map((i) => (
          <article key={i.id} className="rounded-2xl bg-card p-4">
            <div className="flex justify-between">
              <p>{i.title}</p>
              <StatusBadge status={i.status} />
            </div>
            <p className="text-sm text-muted-foreground">{i.severity} · {i.summary}</p>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
