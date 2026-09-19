import Link from "next/link";
import { WaitlistForm } from "@/components/forms/waitlist-form";

export const metadata = { title: "Waitlist" };

export default function WaitlistPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <Link href="/" className="text-sm underline">Back</Link>
      <h1 className="mt-4 font-display text-4xl">Join early access</h1>
      <div className="mt-8">
        <WaitlistForm />
      </div>
    </div>
  );
}
