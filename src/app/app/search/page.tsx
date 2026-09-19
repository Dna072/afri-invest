import Link from "next/link";
import { AppShell } from "@/components/chrome/app-shell";
import { prisma } from "@/lib/db";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const assets = q
    ? await prisma.asset.findMany({
        where: { OR: [{ name: { contains: q } }, { symbol: { contains: q } }] },
        take: 20,
      })
    : [];
  return (
    <AppShell title="Search">
      <form>
        <input name="q" defaultValue={q} placeholder="Assets, markets, education" className="min-h-12 w-full rounded-2xl border bg-card px-4" />
      </form>
      <ul className="mt-4 space-y-2">
        {assets.map((a) => (
          <li key={a.id}>
            <Link href={`/app/assets/${a.id}`} className="block rounded-2xl bg-card px-4 py-3">
              {a.symbol} · {a.name}
            </Link>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
