import { AppShell } from "@/components/chrome/app-shell";
import { FxForm } from "@/components/fx/fx-form";
import { requireUser } from "@/services/auth";

export default async function FxPage() {
  const user = await requireUser();
  return (
    <AppShell title="Convert">
      <p className="text-sm text-muted-foreground">
        Quotes show source rate, spread, platform fee and amount received. Sandbox rates. Quotes expire in 60 seconds.
      </p>
      <div className="mt-6 max-w-lg">
        <FxForm fromDefault={user.primaryCurrency} />
      </div>
    </AppShell>
  );
}
