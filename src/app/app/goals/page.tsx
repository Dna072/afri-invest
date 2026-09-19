import { AppShell } from "@/components/chrome/app-shell";
import { requireUser } from "@/services/auth";
import { prisma } from "@/lib/db";

export default async function GoalsPage() {
  const user = await requireUser();
  const goals = await prisma.investmentGoal.findMany({ where: { userId: user.id } });
  return (
    <AppShell title="Goals">
      <ul className="space-y-4">
        {goals.map((g) => {
          const pct = Math.min(100, (Number(g.currentAmount) / Number(g.targetAmount)) * 100);
          return (
            <li key={g.id} className="rounded-3xl bg-card p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{g.type}</p>
              <h2 className="font-display text-2xl">{g.name}</h2>
              <p className="mt-2 tabular">{g.currency} {g.currentAmount} of {g.targetAmount}</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{pct.toFixed(0)}% · monthly {g.monthlyContribution}</p>
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}
