"use client";

import { useState } from "react";
import { RESIDENCE_OPTIONS } from "@/data/africa";
import { Button } from "@/components/ui/button";

export function WaitlistForm() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (done) {
    return <p className="rounded-xl bg-card p-6">You’re on the list. We’ll only use this for product updates.</p>;
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
      <input name="email" type="email" required placeholder="Email" className="field" />
      <label className="text-sm">
        Nationality
        <select name="country" required defaultValue="Ghana" className="field mt-1">
          {RESIDENCE_OPTIONS.map((c) => (
            <option key={`n-${c}`}>{c}</option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        Country of residence
        <select name="countryOfResidence" required defaultValue="Ghana" className="field mt-1">
          {RESIDENCE_OPTIONS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <select name="investorType" className="field">
        <option value="resident">I live in Africa</option>
        <option value="diaspora">I live outside Africa</option>
        <option value="institution">Institution</option>
      </select>
      <input
        name="marketsInterested"
        defaultValue="Ghana, Global"
        placeholder="Markets you want (Ghana, Nigeria, Global…)"
        className="field"
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit">Get early access</Button>
    </form>
  );
}
