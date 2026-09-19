import { AdminShell } from "@/components/chrome/admin-shell";
import { prisma } from "@/lib/db";
import { StatusBadge } from "@/components/ui/money";

export default async function FlagsAdmin() {
  const flags = await prisma.featureFlag.findMany({ orderBy: { key: "asc" } });
  return (
    <AdminShell title="Feature flags">
      <div className="space-y-2">
        {flags.map((f) => (
          <article key={f.id} className="flex items-center justify-between rounded-2xl bg-card p-4">
            <div>
              <p className="font-medium">{f.key}</p>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </div>
            <StatusBadge status={f.status} />
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
