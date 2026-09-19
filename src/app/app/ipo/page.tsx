import { AppShell } from "@/components/chrome/app-shell";
import { prisma } from "@/lib/db";
import { StatusBadge } from "@/components/ui/money";

export default async function IpoPage() {
  const offers = await prisma.ipoOffer.findMany({ include: { asset: true } });
  return (
    <AppShell title="IPO">
      <p className="text-sm text-muted-foreground">Fictional offerings for workflow design. Not real subscriptions.</p>
      <ul className="mt-4 space-y-3">
        {offers.map((o) => (
          <li key={o.id} className="rounded-3xl bg-card p-5">
            <div className="flex justify-between">
              <h2 className="font-display text-2xl">{o.asset.name}</h2>
              <StatusBadge status={o.status} />
            </div>
            <p className="mt-2 text-sm">Offer {o.asset.currency} {o.offerPrice} · min {o.minimumInvestment}</p>
            <p className="mt-3 text-sm text-muted-foreground">{o.riskInformation}</p>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
