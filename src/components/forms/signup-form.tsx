"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RESIDENCE_OPTIONS } from "@/data/africa";
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
        <input name="firstName" required className="field mt-1" />
      </label>
      <label className="block text-sm">
        Last name
        <input name="lastName" required className="field mt-1" />
      </label>
      <label className="block text-sm">
        Email
        <input name="email" type="email" required className="field mt-1" />
      </label>
      <label className="block text-sm">
        Password
        <input name="password" type="password" minLength={10} required className="field mt-1" />
      </label>
      <label className="block text-sm">
        Country of residence
        <select name="countryOfResidence" defaultValue="Ghana" required className="field mt-1">
          {RESIDENCE_OPTIONS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <span className="mt-1 block text-xs text-muted-foreground">
          Used for KYC and to determine your tax obligations.
        </span>
      </label>
      <label className="block text-sm">
        Nationality
        <select name="nationality" defaultValue="Ghana" required className="field mt-1">
          {RESIDENCE_OPTIONS.map((c) => (
            <option key={`n-${c}`}>{c}</option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        Primary currency
        <select name="primaryCurrency" defaultValue="GHS" className="field mt-1">
          {["GHS", "USD", "EUR", "GBP", "NGN", "KES", "ZAR", "SEK"].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <p className="text-xs text-muted-foreground">
        Next you will verify your identity. You cannot add money or buy stocks until KYC is complete.
      </p>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button className="w-full" disabled={loading} type="submit">
        {loading ? "Creating…" : "Create account"}
      </Button>
    </form>
  );
}
