import { AppShell } from "@/components/chrome/app-shell";
import { requireUser } from "@/services/auth";
import { prisma } from "@/lib/db";

export default async function DocumentsPage() {
  const user = await requireUser();
  const docs = await prisma.document.findMany({ where: { userId: user.id } });
  return (
    <AppShell title="Documents">
      <p className="text-sm text-muted-foreground">Metadata only in MVP. Designed for future secure object storage.</p>
      <ul className="mt-4 space-y-2">
        {docs.map((d) => (
          <li key={d.id} className="rounded-2xl bg-card px-4 py-3">
            <p className="font-medium">{d.title}</p>
            <p className="text-xs text-muted-foreground">{d.type} · {d.status}</p>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
