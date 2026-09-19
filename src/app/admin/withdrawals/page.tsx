import { AdminShell } from "@/components/chrome/admin-shell";
import { prisma } from "@/lib/db";
import { StatusBadge } from "@/components/ui/money";

export default async function WithdrawalsAdmin() {
  const rows = await prisma.withdrawal.findMany({ take: 40, orderBy: { createdAt: "desc" } });
  return (
    <AdminShell title="Withdrawals">
      <div className="space-y-2">
        {rows.map((w) => (
          <article key={w.id} className="rounded-2xl bg-card p-4 text-sm">
            <div className="flex justify-between">
              <p>{w.currency} {w.amount} → {w.destinationLabel}</p>
              <StatusBadge status={w.status} />
            </div>
            {w.requiresApproval ? <p className="text-xs text-warning">Maker-checker required</p> : null}
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
