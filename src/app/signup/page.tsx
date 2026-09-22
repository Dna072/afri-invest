import Link from "next/link";
import { PublicShell } from "@/components/chrome/public-shell";
import { SignupForm } from "@/components/forms/signup-form";

export const metadata = { title: "Create account" };

export default function SignupPage() {
  return (
    <PublicShell>
      <div className="mx-auto flex max-w-md flex-col px-4 py-14">
        <p className="eyebrow">Sandbox onboarding</p>
        <h1 className="mt-2 font-display text-4xl">Open an account</h1>
        <p className="mt-2 text-sm text-muted-foreground">KYC is mocked. No real identity documents are stored.</p>
        <div className="mt-8">
          <SignupForm />
        </div>
        <p className="mt-6 text-sm">
          Already have access?{" "}
          <Link href="/login" className="font-medium text-primary underline">
            Sign in
          </Link>
        </p>
      </div>
    </PublicShell>
  );
}
