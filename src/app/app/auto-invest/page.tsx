import { AppShell } from "@/components/chrome/app-shell";
import { StatusBadge } from "@/components/ui/money";
import { requireUser } from "@/services/auth";
import { getCustomerAccount } from "@/services/accounts";
import { prisma } from "@/lib/db";

export default async function AutoInvestPage() {
  const user = await requireUser();
  const account = await getCustomerAccount(user);
  const plans = await prisma.autoInvestPlan.findMany({ where: { accountId: account.id } });
  return (
    <AppShell title="Auto Invest">
      <p className="text-sm text-muted-foreground">
        Recurring plans are domain objects ready for scheduled payments. Execution is not live.
      </p>
      <ul className="mt-6 space-y-3">
        {plans.map((p) => {
          const alloc = JSON.parse(p.allocationJson) as Array<{ label: string; percent: number }>;
          return (
            <li key={p.id} className="rounded-3xl bg-card p-5">
              <div className="flex justify-between">
                <h2 className="font-display text-2xl">{p.name}</h2>
                <StatusBadge status={p.status} />
              </div>
              <p className="mt-2 text-sm">{p.fundingCurrency} {p.amount} · {p.schedule}</p>
              <ul className="mt-3 text-sm text-muted-foreground">
                {alloc.map((a) => (
                  <li key={a.label}>{a.percent}% {a.label}</li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}
