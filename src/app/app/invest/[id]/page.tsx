import { notFound } from "next/navigation";
import { AppShell } from "@/components/chrome/app-shell";
import { InvestForm } from "@/components/invest/invest-form";
import { prisma } from "@/lib/db";

export default async function InvestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const asset = await prisma.asset.findUnique({ where: { id } });
  if (!asset) notFound();
  return (
    <AppShell title={`Invest in ${asset.name}`}>
      <p className="text-sm text-muted-foreground">
        Review amount, fees and risk before confirming. The order engine posts to the ledger — the button does not edit balances.
      </p>
      <div className="mt-6">
        <InvestForm assetId={asset.id} currency={asset.currency} min={asset.minimumInvestment} />
      </div>
    </AppShell>
  );
}
