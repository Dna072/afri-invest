import { AdminShell } from "@/components/chrome/admin-shell";
import { prisma } from "@/lib/db";

export default async function LedgerAdmin() {
  const txns = await prisma.ledgerTransaction.findMany({
    include: { entries: { include: { ledgerAccount: true } } },
    take: 30,
    orderBy: { createdAt: "desc" },
  });
  return (
    <AdminShell title="Ledger">
      <p className="mb-4 text-sm text-muted-foreground">Source of truth for cash. Every journal is balanced per currency.</p>
      <div className="space-y-3">
        {txns.map((t) => (
          <article key={t.id} className="rounded-2xl bg-card p-4 text-sm">
            <p className="font-medium">{t.type} · {t.description}</p>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              {t.entries.map((e) => (
                <li key={e.id} className="flex justify-between">
                  <span>{e.direction} {e.ledgerAccount.code}</span>
                  <span className="tabular">{e.currency} {e.amount}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
