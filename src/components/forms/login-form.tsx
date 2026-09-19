"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const personas = [
  { key: "derrick", name: "Derrick", detail: "Ghanaian in Sweden · SEK" },
  { key: "ama", name: "Ama", detail: "Ghana resident · GHS" },
  { key: "kofi", name: "Kofi", detail: "Ghanaian in the UK · GBP" },
  { key: "chinedu", name: "Chinedu", detail: "Nigeria resident · NGN" },
  { key: "admin", name: "Abena", detail: "Operations admin" },
];

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("derrick@africainvest.demo");
  const [password, setPassword] = useState("AfricaInvest!demo");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(body: Record<string, string>) {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(json.error?.message ?? "Could not sign in.");
      return;
    }
    const next = params.get("next") || (body.personaKey === "admin" ? "/admin" : "/app");
    router.push(next);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          void submit({ email, password });
        }}
      >
        <label className="block text-sm">
          Email
          <input
            className="mt-1 min-h-12 w-full rounded-2xl border border-input bg-card px-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="username"
            required
          />
        </label>
        <label className="block text-sm">
          Password
          <input
            className="mt-1 min-h-12 w-full rounded-2xl border border-input bg-card px-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
            required
          />
        </label>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button className="w-full" disabled={loading} type="submit">
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Demo personas</p>
        <div className="mt-3 grid gap-2">
          {personas.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => void submit({ personaKey: p.key })}
              className="focus-ring rounded-2xl border border-border bg-card px-4 py-3 text-left"
            >
              <p className="font-medium">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.detail}</p>
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Demo password: AfricaInvest!demo · fictional data only</p>
      </div>
    </div>
  );
}
