import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/chrome/app-shell";
import { Button } from "@/components/ui/button";
import { requireUser, clearSession } from "@/services/auth";
import { prisma } from "@/lib/db";

export default async function ProfilePage() {
  const user = await requireUser();
  const full = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
    include: { investorProfile: true, taxProfile: true, securityProfile: true },
  });
  return (
    <AppShell title="Profile">
      <div className="space-y-3">
        {[
          ["Personal information", `${full.firstName} ${full.lastName}`],
          ["Country of residence", full.countryOfResidence],
          ["Nationality", full.nationality],
          ["Tax residency", full.taxProfile?.taxResidence ?? "—"],
          ["Investor profile", `${full.investorProfile?.resultBand ?? "Not completed"} · educational only`],
          ["Primary currency", full.primaryCurrency],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl bg-card px-4 py-3">
            <p className="text-xs text-muted-foreground">{k}</p>
            <p>{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-2">
        <Link href="/app/security" className="rounded-2xl bg-card px-4 py-3">Security</Link>
        <Link href="/app/documents" className="rounded-2xl bg-card px-4 py-3">Documents</Link>
        <Link href="/app/support" className="rounded-2xl bg-card px-4 py-3">Support</Link>
        <Link href="/fees" className="rounded-2xl bg-card px-4 py-3">Fees</Link>
        {user.role !== "customer" ? <Link href="/admin" className="rounded-2xl bg-card px-4 py-3">Operations console</Link> : null}
      </div>
      <form
        className="mt-8"
        action={async () => {
          "use server";
          await clearSession();
          redirect("/login");
        }}
      >
        <Button variant="outline" type="submit" className="w-full">Log out</Button>
      </form>
    </AppShell>
  );
}
