import { AppShell } from "@/components/chrome/app-shell";
import { requireUser } from "@/services/auth";
import { prisma } from "@/lib/db";

export default async function SupportPage() {
  const user = await requireUser();
  const tickets = await prisma.supportTicket.findMany({ where: { userId: user.id } });
  return (
    <AppShell title="Support">
      <div className="grid gap-4 md:grid-cols-2">
        {["Getting Started", "Funding", "Investing", "Withdrawals", "Security", "Fees"].map((c) => (
          <div key={c} className="rounded-2xl bg-card p-4">
            <p className="font-medium">{c}</p>
            <p className="text-sm text-muted-foreground">Help centre article stub for {c.toLowerCase()}.</p>
          </div>
        ))}
      </div>
      <h2 className="mt-8 font-display text-2xl">Tickets</h2>
      <ul className="mt-3 space-y-2">
        {tickets.map((t) => (
          <li key={t.id} className="rounded-2xl bg-card px-4 py-3">
            {t.subject} · {t.status}
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
