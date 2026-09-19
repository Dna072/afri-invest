import { AdminShell } from "@/components/chrome/admin-shell";
import { prisma } from "@/lib/db";
import { StatusBadge } from "@/components/ui/money";

export default async function PartnersAdmin() {
  const rows = await prisma.partner.findMany({ include: { contacts: true, integrations: true } });
  return (
    <AdminShell title="Partners">
      <p className="mb-4 text-sm text-muted-foreground">Candidates only. No live partnerships are claimed.</p>
      <div className="space-y-2">
        {rows.map((p) => (
          <article key={p.id} className="rounded-2xl bg-card p-4">
            <div className="flex justify-between">
              <p className="font-medium">{p.company}</p>
              <StatusBadge status={p.status} />
            </div>
            <p className="text-sm text-muted-foreground">{p.category} · {p.market}</p>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
