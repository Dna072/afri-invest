import { AfricaReportMap } from "@/components/admin/africa-report-map";
import { AdminShell } from "@/components/chrome/admin-shell";
import { prisma } from "@/lib/db";

export default async function AdminHome() {
  const [users, kyc, alerts, recon, complaints, incidents, residences] = await Promise.all([
    prisma.user.count(),
    prisma.kycProfile.count({ where: { status: { not: "pass" } } }),
    prisma.amlAlert.count({ where: { status: { not: "closed" } } }),
    prisma.reconciliationItem.count({ where: { status: "mismatch" } }),
    prisma.complaint.count({ where: { status: { not: "closed" } } }),
    prisma.incident.count({ where: { status: { not: "closed" } } }),
    prisma.user.groupBy({
      by: ["countryOfResidence"],
      _count: { _all: true },
    }),
  ]);
  const metrics = [
    ["Registered users", String(users)],
    ["Pending KYC", String(kyc)],
    ["AML alerts", String(alerts)],
    ["Reconciliation exceptions", String(recon)],
    ["Complaints", String(complaints)],
    ["Open incidents", String(incidents)],
    ["AUM", "Derived from positions"],
    ["Revenue", "Fee events"],
  ];
  return (
    <AdminShell title="Dashboard">
      <p className="mb-4 text-sm text-muted-foreground">
        Country reporting uses the Africa GeoJSON layer. KYC is required for every investor. Tax obligations follow country
        of residence.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(([k, v]) => (
          <div key={k} className="rounded-xl bg-card p-4">
            <p className="text-xs text-muted-foreground">{k}</p>
            <p className="mt-1 font-display text-2xl">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="font-display text-2xl">African market coverage</h2>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">
          Ghana is the pilot. Other exchanges are marked coming soon or planned. Click a country for population, exchange
          status and registered users by residence.
        </p>
        <AfricaReportMap
          usersByResidence={residences.map((row) => ({
            country: row.countryOfResidence,
            count: row._count._all,
          }))}
        />
      </div>
    </AdminShell>
  );
}
