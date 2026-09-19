"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function WaitlistForm() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (done) {
    return <p className="rounded-2xl bg-card p-6">You’re on the early access list. We’ll only use this for product updates.</p>;
  }
  return (
    <form
      className="grid gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const res = await fetch("/api/v1/waitlist", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            email: form.get("email"),
            country: form.get("country"),
            countryOfResidence: form.get("countryOfResidence"),
            investorType: form.get("investorType"),
            marketsInterested: String(form.get("marketsInterested") ?? "Ghana").split(","),
          }),
        });
        if (!res.ok) {
          setError("Could not join the list.");
          return;
        }
        setDone(true);
      }}
    >
      <input name="email" type="email" required placeholder="Email" className="min-h-12 rounded-2xl border bg-card px-4" />
      <input name="country" required placeholder="Nationality / home country" className="min-h-12 rounded-2xl border bg-card px-4" />
      <input name="countryOfResidence" required placeholder="Country of residence" className="min-h-12 rounded-2xl border bg-card px-4" />
      <select name="investorType" className="min-h-12 rounded-2xl border bg-card px-4">
        <option value="diaspora">Diaspora</option>
        <option value="resident">Resident</option>
        <option value="institution">Institution</option>
      </select>
      <input name="marketsInterested" defaultValue="Ghana" placeholder="Markets (comma separated)" className="min-h-12 rounded-2xl border bg-card px-4" />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit">Join the waitlist</Button>
    </form>
  );
}
