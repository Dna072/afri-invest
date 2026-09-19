import Link from "next/link";
import { AppShell } from "@/components/chrome/app-shell";
import { prisma } from "@/lib/db";

export default async function TreasuriesPage() {
  const bills = await prisma.asset.findMany({
    where: { assetType: { in: ["treasury", "bond"] } },
    include: { bondTerms: true },
  });
  return (
    <AppShell title="Treasuries">
      <p className="text-sm text-muted-foreground">Yields are indicative sandbox figures, not live auction results.</p>
      <ul className="mt-4 space-y-2">
        {bills.map((b) => (
          <li key={b.id}>
            <Link href={`/app/assets/${b.id}`} className="block rounded-2xl bg-card px-4 py-3">
              <p className="font-medium">{b.name}</p>
              <p className="text-sm text-muted-foreground">
                Indicative yield {b.bondTerms?.yieldPercent ?? "—"}% · {b.currency}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
