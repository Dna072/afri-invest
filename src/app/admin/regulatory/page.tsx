import { AdminShell } from "@/components/chrome/admin-shell";
import { prisma } from "@/lib/db";
import { StatusBadge } from "@/components/ui/money";
import { assessStage } from "@/domains/regulatory/gates";

export default async function RegulatoryPage() {
  const stages = await prisma.regulatoryStage.findMany({
    include: { requirements: { include: { evidence: true } } },
    orderBy: { sortOrder: "asc" },
  });
  return (
    <AdminShell title="Regulatory Control Tower">
      <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
        Planning records only. A stage cannot be marked passed while mandatory gates are incomplete, unless an audited override is recorded. No licence is represented as complete.
      </p>
      <div className="space-y-4">
        {stages.map((s) => {
          const gates = s.requirements.map((r) => ({
            id: r.id,
            label: r.requirement,
            mandatory: r.mandatory,
            complete: r.status === "passed" || r.status === "waived",
          }));
          const assessment = assessStage(gates);
          return (
            <article key={s.id} className="rounded-3xl bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl">{s.name}</h2>
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                </div>
                <StatusBadge status={s.status} />
              </div>
              <p className="mt-3 text-xs">Owner {s.owner} · Pass enabled: {assessment.canPass ? "yes" : "no"}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {s.requirements.map((r) => (
                  <li key={r.id} className="flex justify-between gap-3 rounded-2xl bg-muted/50 px-3 py-2">
                    <span>
                      {r.requirement} · {r.institution}
                      {r.notes ? <span className="block text-xs text-warning">{r.notes}</span> : null}
                    </span>
                    <StatusBadge status={r.status} />
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </AdminShell>
  );
}
