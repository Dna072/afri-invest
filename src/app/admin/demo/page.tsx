import { AdminShell } from "@/components/chrome/admin-shell";
import { DemoControls } from "@/components/admin/demo-controls";

export default function DemoAdmin() {
  return (
    <AdminShell title="Demo controls">
      <p className="mb-4 text-sm text-muted-foreground">
        Development and testing only. Disabled in production. Actions write through domain services, not UI balances.
      </p>
      <DemoControls />
    </AdminShell>
  );
}
