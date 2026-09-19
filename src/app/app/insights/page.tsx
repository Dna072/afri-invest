import { AppShell } from "@/components/chrome/app-shell";
import { requireUser } from "@/services/auth";
import { getCustomerAccount } from "@/services/accounts";
import { getPortfolio } from "@/services/portfolio";

export default async function InsightsPage() {
  const user = await requireUser();
  const account = await getCustomerAccount(user);
  const portfolio = await getPortfolio(account.id, "GHS");
  const ghanaHeavy = portfolio.byCountry.find((c) => c.key === "Ghana" && Number(c.percent) > 60);
  return (
    <AppShell title="Insights">
      <p className="text-sm text-muted-foreground">
        Educational / analytical observations. Not personalised investment recommendations or regulated advice.
      </p>
      <ul className="mt-6 space-y-3">
        {ghanaHeavy ? (
          <li className="rounded-3xl bg-card p-5">Your portfolio is heavily concentrated in Ghanaian equities and cash. That is a description of current holdings, not a recommendation to change them.</li>
        ) : (
          <li className="rounded-3xl bg-card p-5">Holdings span more than one country in this view.</li>
        )}
        <li className="rounded-3xl bg-card p-5">Your recurring contribution increased over the last three months — based on the seeded Auto Invest plan, not live bank data.</li>
      </ul>
    </AppShell>
  );
}
