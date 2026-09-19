import { AppShell } from "@/components/chrome/app-shell";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/services/auth";

export default async function OnboardingPage() {
  await requireUser();
  const questions: Array<[name: string, label: string, opts: string[]]> = [
    ["experience", "Investment experience", ["none", "some", "extensive"]],
    ["horizon", "Horizon", ["short", "medium", "long"]],
    ["objective", "Objective", ["preserve", "balance", "grow"]],
    ["riskTolerance", "Risk tolerance", ["low", "medium", "high"]],
    ["liquidityNeeds", "Liquidity needs", ["high", "medium", "low"]],
  ];
  return (
    <AppShell title="Investor profile">
      <p className="text-sm text-muted-foreground">
        This educational profile is not a regulated suitability or appropriateness assessment.
      </p>
      <form
        className="mt-6 space-y-4"
        action={async (formData) => {
          "use server";
          const { requireUser: ru } = await import("@/services/auth");
          const { prisma: db } = await import("@/lib/db");
          const { riskBand } = await import("@/domains/wealth/calc");
          const user = await ru();
          const input = {
            experience: String(formData.get("experience")),
            horizon: String(formData.get("horizon")),
            objective: String(formData.get("objective")),
            riskTolerance: String(formData.get("riskTolerance")),
            liquidityNeeds: String(formData.get("liquidityNeeds")),
          };
          const result = riskBand(input);
          await db.investorProfile.upsert({
            where: { userId: user.id },
            update: { ...input, resultBand: result.band, completedAt: new Date(), isEducationalOnly: true },
            create: { userId: user.id, ...input, resultBand: result.band, completedAt: new Date(), isEducationalOnly: true },
          });
        }}
      >
        {questions.map(([name, label, opts]) => (
          <label key={name} className="block text-sm">
            {label}
            <select name={name} className="mt-1 min-h-12 w-full rounded-2xl border bg-card px-3">
              {opts.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
        ))}
        <Button type="submit" className="w-full">Save educational profile</Button>
      </form>
    </AppShell>
  );
}
