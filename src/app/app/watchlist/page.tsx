import Link from "next/link";
import { AppShell } from "@/components/chrome/app-shell";
import { prisma } from "@/lib/db";
import { requireUser } from "@/services/auth";
import { MoneyText } from "@/components/ui/money";

export default async function WatchlistPage() {
  const user = await requireUser();
  const items = await prisma.watchlistItem.findMany({
    where: { watchlist: { userId: user.id } },
    include: { asset: true },
    orderBy: { sortOrder: "asc" },
  });
  return (
    <AppShell title="Watchlist">
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i.id}>
            <Link href={`/app/assets/${i.assetId}`} className="flex justify-between rounded-2xl bg-card px-4 py-3">
              <span>{i.asset.name}</span>
              <MoneyText amount={i.asset.price} currency={i.asset.currency} />
            </Link>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
