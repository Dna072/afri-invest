import { AdminShell } from "@/components/chrome/admin-shell";
import { prisma } from "@/lib/db";
import { StatusBadge } from "@/components/ui/money";

export default async function KycAdmin() {
  const rows = await prisma.kycProfile.findMany({ include: { user: true, sessions: { include: { checks: true } } }, take: 40 });
  return (
    <AdminShell title="KYC">
      <p className="mb-4 text-sm text-muted-foreground">Mock identity provider. Reviews generate audit records.</p>
      <div className="space-y-2">
        {rows.map((k) => (
          <article key={k.id} className="rounded-2xl bg-card p-4">
            <div className="flex justify-between">
              <p>{k.user.displayName}</p>
              <StatusBadge status={k.status} />
            </div>
            <p className="text-xs text-muted-foreground">Risk {k.riskRating} · checks {k.sessions[0]?.checks.map((c) => c.category).join(", ") || "none"}</p>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
