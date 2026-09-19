"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        setLoading(true);
        const res = await fetch("/api/v1/auth/signup", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(Object.fromEntries(form.entries())),
        });
        const json = await res.json();
        setLoading(false);
        if (!res.ok) {
          setError(json.error?.message ?? "Could not create account.");
          return;
        }
        router.push("/app/onboarding");
        router.refresh();
      }}
    >
      <label className="block text-sm">
        First name
        <input name="firstName" required className="mt-1 min-h-12 w-full rounded-2xl border bg-card px-4" />
      </label>
      <label className="block text-sm">
        Last name
        <input name="lastName" required className="mt-1 min-h-12 w-full rounded-2xl border bg-card px-4" />
      </label>
      <label className="block text-sm">
        Email
        <input name="email" type="email" required className="mt-1 min-h-12 w-full rounded-2xl border bg-card px-4" />
      </label>
      <label className="block text-sm">
        Password
        <input name="password" type="password" minLength={10} required className="mt-1 min-h-12 w-full rounded-2xl border bg-card px-4" />
      </label>
      <label className="block text-sm">
        Country of residence
        <input name="countryOfResidence" defaultValue="Sweden" required className="mt-1 min-h-12 w-full rounded-2xl border bg-card px-4" />
      </label>
      <label className="block text-sm">
        Nationality
        <input name="nationality" defaultValue="Ghana" required className="mt-1 min-h-12 w-full rounded-2xl border bg-card px-4" />
      </label>
      <label className="block text-sm">
        Primary currency
        <select name="primaryCurrency" defaultValue="SEK" className="mt-1 min-h-12 w-full rounded-2xl border bg-card px-4">
          {["SEK", "GHS", "GBP", "EUR", "USD", "NGN"].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button className="w-full" disabled={loading} type="submit">
        {loading ? "Creating…" : "Create account"}
      </Button>
    </form>
  );
}
