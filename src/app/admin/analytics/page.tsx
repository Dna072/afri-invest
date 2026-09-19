import { AdminShell } from "@/components/chrome/admin-shell";
import { prisma } from "@/lib/db";

export default async function AnalyticsAdmin() {
  const [signups, funded, waitlist] = await Promise.all([
    prisma.user.count(),
    prisma.currencyBalance.count(),
    prisma.waitlistEntry.findMany(),
  ]);
  const demand: Record<string, number> = {};
  for (const w of waitlist) {
    for (const m of w.marketsInterested.split(",")) {
      demand[m.trim()] = (demand[m.trim()] ?? 0) + 1;
    }
  }
  return (
    <AdminShell title="Analytics">
      <p className="mb-4 text-sm text-muted-foreground">Funnel uses application events where present. Waitlist demand below is labelled simulated / sample.</p>
      <div className="grid gap-3 md:grid-cols-3">
        <Card k="Signups" v={String(signups)} />
        <Card k="Funded-style balances" v={String(funded)} />
        <Card k="Waitlist entries" v={String(waitlist.length)} />
      </div>
      <h2 className="mt-8 font-display text-2xl">Market interest</h2>
      <p className="text-xs text-muted-foreground">Simulated user-interest data</p>
      <ul className="mt-3 space-y-2">
        {Object.entries(demand).map(([k, v]) => (
          <li key={k} className="flex justify-between rounded-2xl bg-card px-4 py-3">
            <span>{k}</span>
            <span>{v}</span>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}

function Card({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-2xl bg-card p-4">
      <p className="text-xs text-muted-foreground">{k}</p>
      <p className="font-display text-2xl">{v}</p>
    </div>
  );
}
