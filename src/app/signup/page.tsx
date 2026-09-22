import Link from "next/link";
import { PublicShell } from "@/components/chrome/public-shell";
import { SignupForm } from "@/components/forms/signup-form";

export const metadata = { title: "Start investing" };

export default function SignupPage() {
  return (
    <PublicShell>
      <div className="mx-auto flex max-w-md flex-col px-4 py-14">
        <p className="eyebrow">Create your account</p>
        <h1 className="mt-2 font-display text-4xl">Start investing</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          KYC is required for every investor. Your country of residence is used to show the tax rules that apply to you.
        </p>
        <div className="mt-8">
          <SignupForm />
        </div>
        <p className="mt-6 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary underline">
            Sign in
          </Link>
        </p>
      </div>
    </PublicShell>
  );
}
