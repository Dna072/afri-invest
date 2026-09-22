import { PublicShell } from "@/components/chrome/public-shell";
import { WaitlistForm } from "@/components/forms/waitlist-form";

export const metadata = { title: "Waitlist" };

export default function WaitlistPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-lg px-4 py-16">
        <p className="eyebrow">Early access</p>
        <h1 className="mt-2 font-display text-4xl">Join the list</h1>
        <div className="mt-8">
          <WaitlistForm />
        </div>
      </div>
    </PublicShell>
  );
}
