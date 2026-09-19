import { AdminShell } from "@/components/chrome/admin-shell";
import { prisma } from "@/lib/db";

export default async function AdminHome() {
  const [users, kyc, alerts, recon, complaints, incidents] = await Promise.all([
    prisma.user.count(),
    prisma.kycProfile.count({ where: { status: { not: "pass" } } }),
    prisma.amlAlert.count({ where: { status: { not: "closed" } } }),
    prisma.reconciliationItem.count({ where: { status: "mismatch" } }),
    prisma.complaint.count({ where: { status: { not: "closed" } } }),
    prisma.incident.count({ where: { status: { not: "closed" } } }),
  ]);
  const metrics = [
    ["Registered users", String(users)],
    ["Pending KYC", String(kyc)],
    ["AML alerts", String(alerts)],
    ["Reconciliation exceptions", String(recon)],
    ["Complaints", String(complaints)],
    ["Open incidents", String(incidents)],
    ["AUM", "Sandbox — derived from positions"],
    ["Revenue", "Sandbox fee events"],
  ];
  return (
    <AdminShell title="Dashboard">
      <p className="mb-4 text-sm text-muted-foreground">Metrics come from application data. Financial model figures elsewhere are labelled illustrative.</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(([k, v]) => (
          <div key={k} className="rounded-2xl bg-card p-4">
            <p className="text-xs text-muted-foreground">{k}</p>
            <p className="mt-1 font-display text-2xl">{v}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
