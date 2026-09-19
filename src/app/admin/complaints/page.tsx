import { AdminShell } from "@/components/chrome/admin-shell";
import { prisma } from "@/lib/db";
import { StatusBadge } from "@/components/ui/money";

export default async function ComplaintsAdmin() {
  const rows = await prisma.complaint.findMany({ include: { messages: true } });
  return (
    <AdminShell title="Complaints">
      <div className="space-y-2">
        {rows.map((c) => (
          <article key={c.id} className="rounded-2xl bg-card p-4">
            <div className="flex justify-between">
              <p>{c.summary}</p>
              <StatusBadge status={c.status} />
            </div>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
