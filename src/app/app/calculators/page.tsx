import { AppShell } from "@/components/chrome/app-shell";
import { Calculators } from "@/components/wealth/calculators";

export default function CalculatorsPage() {
  return (
    <AppShell title="Calculators">
      <Calculators />
    </AppShell>
  );
}
