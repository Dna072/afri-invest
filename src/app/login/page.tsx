import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-10">
      <p className="text-xs uppercase tracking-[0.25em]">Africa Invest</p>
      <h1 className="mt-2 font-display text-4xl">Enter the product</h1>
      <p className="mt-2 text-sm text-muted-foreground">Use a demo persona to walk the Sweden → Ghana journey in minutes.</p>
      <div className="mt-8">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
      <p className="mt-6 text-sm">
        New here? <Link href="/signup" className="underline">Create an account</Link>
      </p>
    </div>
  );
}
