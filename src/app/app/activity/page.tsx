import { AppShell } from "@/components/chrome/app-shell";
import { StatusBadge } from "@/components/ui/money";
import { requireUser } from "@/services/auth";
import { getCustomerAccount } from "@/services/accounts";
import { prisma } from "@/lib/db";

export default async function ActivityPage() {
  const user = await requireUser();
  const account = await getCustomerAccount(user);
  const [tx, notes] = await Promise.all([
    prisma.transaction.findMany({ where: { accountId: account.id }, orderBy: { createdAt: "desc" }, take: 40 }),
    prisma.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 20 }),
  ]);
  return (
    <AppShell title="Activity">
      <h2 className="font-display text-2xl">Notifications</h2>
      <ul className="mt-3 space-y-2">
        {notes.map((n) => (
          <li key={n.id} className="rounded-2xl bg-card px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{n.category}</p>
            <p className="font-medium">{n.title}</p>
            <p className="text-sm text-muted-foreground">{n.body}</p>
          </li>
        ))}
      </ul>
      <h2 className="mt-8 font-display text-2xl">Transactions</h2>
      <ul className="mt-3 space-y-2">
        {tx.map((t) => (
          <li key={t.id} className="flex items-center justify-between rounded-2xl bg-card px-4 py-3">
            <div>
              <p>{t.description}</p>
              <p className="text-xs text-muted-foreground">{t.createdAt.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="tabular">{t.currency} {t.amount}</p>
              <StatusBadge status={t.status} />
            </div>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
