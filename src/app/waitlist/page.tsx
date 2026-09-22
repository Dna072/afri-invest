import { PublicShell } from "@/components/chrome/public-shell";
import { WaitlistForm } from "@/components/forms/waitlist-form";

export const metadata = { title: "Early access" };

export default function WaitlistPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-lg px-4 py-16">
        <p className="eyebrow">Early access</p>
        <h1 className="mt-2 font-display text-4xl">Get notified</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Tell us where you live so we can plan KYC and tax coverage for your country.
        </p>
        <div className="mt-8">
          <WaitlistForm />
        </div>
      </div>
    </PublicShell>
  );
}
