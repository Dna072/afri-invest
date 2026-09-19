import { AdminShell } from "@/components/chrome/admin-shell";
import { env } from "@/lib/env";

export default function SettingsAdmin() {
  return (
    <AdminShell title="Settings">
      <dl className="space-y-3 text-sm">
        <div className="rounded-2xl bg-card p-4"><dt className="text-muted-foreground">APP_ENV</dt><dd>{env.APP_ENV}</dd></div>
        <div className="rounded-2xl bg-card p-4"><dt className="text-muted-foreground">Identity provider</dt><dd>{env.IDENTITY_PROVIDER}</dd></div>
        <div className="rounded-2xl bg-card p-4"><dt className="text-muted-foreground">Payment provider</dt><dd>{env.PAYMENT_PROVIDER}</dd></div>
        <div className="rounded-2xl bg-card p-4"><dt className="text-muted-foreground">Broker provider</dt><dd>{env.BROKER_PROVIDER}</dd></div>
      </dl>
    </AdminShell>
  );
}
