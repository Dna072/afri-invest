import Link from "next/link";
import { SignupForm } from "@/components/forms/signup-form";

export const metadata = { title: "Create account" };

export default function SignupPage() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-10">
      <h1 className="font-display text-4xl">Open an account</h1>
      <p className="mt-2 text-sm text-muted-foreground">Sandbox onboarding. KYC is mocked. No real identity documents are stored.</p>
      <div className="mt-8">
        <SignupForm />
      </div>
      <p className="mt-6 text-sm">
        Already have access? <Link href="/login" className="underline">Sign in</Link>
      </p>
    </div>
  );
}
