import { AdminShell } from "@/components/chrome/admin-shell";
import { prisma } from "@/lib/db";
import { StatusBadge } from "@/components/ui/money";

export default async function CustomersAdmin() {
  const customers = await prisma.user.findMany({ take: 40, orderBy: { createdAt: "desc" }, include: { kycProfile: true } });
  return (
    <AdminShell title="Customers">
      <div className="space-y-2">
        {customers.map((u) => (
          <article key={u.id} className="rounded-2xl bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium">{u.displayName} · {u.email}</p>
                <p className="text-xs text-muted-foreground">{u.countryOfResidence} · {u.primaryCurrency} · {u.role}</p>
              </div>
              <StatusBadge status={u.kycProfile?.status ?? "unknown"} />
            </div>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
