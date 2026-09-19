import { AppShell } from "@/components/chrome/app-shell";
import { requireUser } from "@/services/auth";
import { prisma } from "@/lib/db";

export default async function SecurityPage() {
  const user = await requireUser();
  const [sessions, devices, events] = await Promise.all([
    prisma.session.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.device.findMany({ where: { userId: user.id } }),
    prisma.auditEvent.findMany({ where: { actorId: user.id }, orderBy: { createdAt: "desc" }, take: 8 }),
  ]);
  return (
    <AppShell title="Security">
      <p className="text-sm text-muted-foreground">MFA, passkeys and biometrics are architected. Demo accounts use password plus httpOnly session cookies.</p>
      <div className="mt-6 rounded-3xl bg-card p-5">
        <h2 className="font-medium">Sessions</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {sessions.map((s) => (
            <li key={s.id}>{s.userAgent ?? "Browser session"} · expires {s.expiresAt.toLocaleDateString()}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4 rounded-3xl bg-card p-5">
        <h2 className="font-medium">Devices</h2>
        <p className="text-sm text-muted-foreground">{devices.length ? `${devices.length} devices` : "No named devices yet."}</p>
      </div>
      <div className="mt-4 rounded-3xl bg-card p-5">
        <h2 className="font-medium">Security events</h2>
        <ul className="mt-3 space-y-1 text-sm">
          {events.map((e) => (
            <li key={e.id}>{e.action} · {e.createdAt.toLocaleString()}</li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}
