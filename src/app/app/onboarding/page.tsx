import { AppShell } from "@/components/chrome/app-shell";
import { Button } from "@/components/ui/button";
import { RESIDENCE_OPTIONS } from "@/data/africa";
import { requireUser } from "@/services/auth";

export default async function OnboardingPage() {
  const user = await requireUser();
  const questions: Array<[name: string, label: string, opts: string[]]> = [
    ["experience", "Investment experience", ["none", "some", "extensive"]],
    ["horizon", "How long do you plan to invest?", ["short", "medium", "long"]],
    ["objective", "What are you investing for?", ["preserve", "balance", "grow"]],
    ["riskTolerance", "How much risk can you accept?", ["low", "medium", "high"]],
    ["liquidityNeeds", "Will you need this money soon?", ["high", "medium", "low"]],
  ];
  return (
    <AppShell title="Finish setup">
      <ol className="mb-8 grid gap-3 md:grid-cols-3">
        {[
          ["1", "Verify identity", "KYC is required for every investor."],
          ["2", "Confirm tax residence", "Tax depends on where you live."],
          ["3", "Investor profile", "Helps us show suitable education."],
        ].map(([n, title, body]) => (
          <li key={n} className="rounded-xl bg-card p-4">
            <p className="font-display text-2xl text-accent">{n}</p>
            <p className="mt-1 font-semibold">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{body}</p>
          </li>
        ))}
      </ol>
      <form
        className="space-y-6"
        action={async (formData) => {
          "use server";
          const { requireUser: ru } = await import("@/services/auth");
          const { prisma: db } = await import("@/lib/db");
          const { riskBand } = await import("@/domains/wealth/calc");
          const current = await ru();
          const taxResidence = String(formData.get("taxResidence") || current.countryOfResidence);
          const input = {
            experience: String(formData.get("experience")),
            horizon: String(formData.get("horizon")),
            objective: String(formData.get("objective")),
            riskTolerance: String(formData.get("riskTolerance")),
            liquidityNeeds: String(formData.get("liquidityNeeds")),
          };
          const result = riskBand(input);
          await db.user.update({
            where: { id: current.id },
            data: { countryOfResidence: taxResidence },
          });
          await db.taxProfile.upsert({
            where: { userId: current.id },
            update: { taxResidence },
            create: { userId: current.id, taxResidence },
          });
          await db.kycProfile.upsert({
            where: { userId: current.id },
            update: { status: "in_review" },
            create: { userId: current.id, status: "in_review", riskRating: "medium" },
          });
          await db.investorProfile.upsert({
            where: { userId: current.id },
            update: { ...input, resultBand: result.band, completedAt: new Date(), isEducationalOnly: true },
            create: { userId: current.id, ...input, resultBand: result.band, completedAt: new Date(), isEducationalOnly: true },
          });
          const { redirect } = await import("next/navigation");
          redirect("/app/markets");
        }}
      >
        <section className="rounded-xl bg-card p-5">
          <h2 className="font-display text-2xl">1. Verify your identity</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Every Africa Invest user completes KYC. In this preview, confirming this step starts an identity review. You
            will not be asked for real documents.
          </p>
          <label className="mt-4 flex items-start gap-3 text-sm">
            <input type="checkbox" name="kycConfirm" required className="mt-1" />
            I understand identity verification is required before I can add money or buy stocks.
          </label>
        </section>
        <section className="rounded-xl bg-card p-5">
          <h2 className="font-display text-2xl">2. Tax residence</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Tax liabilities — withholding, capital gains and reporting — depend on the country where you live, not only
            the exchange you buy on.
          </p>
          <label className="mt-4 block text-sm">
            Country of residence
            <select name="taxResidence" defaultValue={user.countryOfResidence} className="field mt-1">
              {RESIDENCE_OPTIONS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        </section>
        <section className="rounded-xl bg-card p-5">
          <h2 className="font-display text-2xl">3. Investor profile</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This helps us show education. It is not personalised investment advice.
          </p>
          <div className="mt-4 space-y-4">
            {questions.map(([name, label, opts]) => (
              <label key={name} className="block text-sm">
                {label}
                <select name={name} className="field mt-1">
                  {opts.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </section>
        <Button type="submit" className="w-full">
          Continue to markets
        </Button>
      </form>
    </AppShell>
  );
}
