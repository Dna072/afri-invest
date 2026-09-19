import { AdminShell } from "@/components/chrome/admin-shell";
import { prisma } from "@/lib/db";
import { StatusBadge } from "@/components/ui/money";

export default async function OrdersAdmin() {
  const rows = await prisma.order.findMany({ include: { asset: true }, take: 40, orderBy: { createdAt: "desc" } });
  return (
    <AdminShell title="Orders">
      <div className="space-y-2">
        {rows.map((o) => (
          <article key={o.id} className="rounded-2xl bg-card p-4 text-sm">
            <div className="flex justify-between">
              <p>{o.asset.symbol} · {o.currency} {o.estimatedValue}</p>
              <StatusBadge status={o.status} />
            </div>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
