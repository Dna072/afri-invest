import { AppShell } from "@/components/chrome/app-shell";
import { FundingForm, WithdrawForm } from "@/components/funding/funding-forms";
import { requireUser } from "@/services/auth";
import { getCustomerAccount } from "@/services/accounts";
import { prisma } from "@/lib/db";
import { StatusBadge } from "@/components/ui/money";

export default async function FundingPage() {
  const user = await requireUser();
  const account = await getCustomerAccount(user);
  const history = await prisma.payment.findMany({ where: { accountId: account.id }, orderBy: { createdAt: "desc" }, take: 10 });
  return (
    <AppShell title="Funding">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl">Add money</h2>
          <p className="mt-1 text-sm text-muted-foreground">Methods shown reflect configuration, not a live PSP.</p>
          <div className="mt-4">
            <FundingForm currency={user.primaryCurrency} />
          </div>
        </div>
        <div>
          <h2 className="font-display text-2xl">Withdraw</h2>
          <div className="mt-4">
            <WithdrawForm currency={user.primaryCurrency} />
          </div>
        </div>
      </div>
      <h2 className="mt-10 font-display text-2xl">History</h2>
      <ul className="mt-3 space-y-2">
        {history.map((p) => (
          <li key={p.id} className="flex justify-between rounded-2xl bg-card px-4 py-3">
            <span>{p.method} · {p.currency} {p.amount}</span>
            <StatusBadge status={p.status} />
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
