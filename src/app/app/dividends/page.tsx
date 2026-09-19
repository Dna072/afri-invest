import { AppShell } from "@/components/chrome/app-shell";
import { requireUser } from "@/services/auth";
import { getCustomerAccount } from "@/services/accounts";
import { prisma } from "@/lib/db";
import { StatusBadge } from "@/components/ui/money";

export default async function DividendsPage() {
  const user = await requireUser();
  const account = await getCustomerAccount(user);
  const rows = await prisma.dividend.findMany({ where: { accountId: account.id }, include: { asset: true } });
  return (
    <AppShell title="Dividends">
      <ul className="space-y-2">
        {rows.map((d) => (
          <li key={d.id} className="rounded-2xl bg-card px-4 py-3">
            <div className="flex justify-between">
              <p className="font-medium">{d.asset.name}</p>
              <StatusBadge status={d.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              Gross {d.grossAmount} · withholding {d.withholding} · net {d.netAmount} {d.currency}
            </p>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
