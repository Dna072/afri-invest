import { AdminShell } from "@/components/chrome/admin-shell";
import { prisma } from "@/lib/db";
import { StatusBadge } from "@/components/ui/money";

export default async function PaymentsAdmin() {
  const rows = await prisma.payment.findMany({ take: 40, orderBy: { createdAt: "desc" } });
  return (
    <AdminShell title="Payments">
      <div className="space-y-2">
        {rows.map((p) => (
          <article key={p.id} className="flex justify-between rounded-2xl bg-card p-4 text-sm">
            <span>{p.method} · {p.currency} {p.amount}</span>
            <StatusBadge status={p.status} />
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
