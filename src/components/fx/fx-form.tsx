"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function FxForm({ fromDefault }: { fromDefault: string }) {
  const [from, setFrom] = useState(fromDefault);
  const [to, setTo] = useState("GHS");
  const [amount, setAmount] = useState("5000");
  const [quote, setQuote] = useState<{
    row: { id: string; sourceRate: string; platformFee: string; spread: string; amountReceived: string; expiresAt: string };
    quoted: { disclaimer: string; customerRate: string };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const currencies = ["SEK", "USD", "EUR", "GBP", "GHS", "NGN"];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm">
          From
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1 min-h-12 w-full rounded-2xl border bg-card px-3">
            {currencies.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className="text-sm">
          To
          <select value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 min-h-12 w-full rounded-2xl border bg-card px-3">
            {currencies.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
      </div>
      <label className="text-sm block">
        Amount
        <input value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 min-h-14 w-full rounded-2xl border bg-card px-4 text-2xl tabular" />
      </label>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button
        className="w-full"
        variant="outline"
        onClick={async () => {
          setError(null);
          const res = await fetch("/api/v1/fx/conversions", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ from, to, amount }),
          });
          const json = await res.json();
          if (!res.ok) {
            setError(json.error?.message ?? "Quote failed.");
            return;
          }
          setQuote(json.data);
        }}
      >
        Get quote
      </Button>
      {quote ? (
        <div className="rounded-3xl bg-card p-5 space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Sandbox FX quote</p>
          <p>Source rate {quote.row.sourceRate}</p>
          <p>Customer rate {quote.quoted.customerRate}</p>
          <p>Spread {from} {quote.row.spread}</p>
          <p>Platform fee {from} {quote.row.platformFee}</p>
          <p className="font-display text-3xl tabular">{to} {quote.row.amountReceived}</p>
          <p className="text-xs text-muted-foreground">{quote.quoted.disclaimer}</p>
          <Button
            className="mt-3 w-full"
            onClick={async () => {
              const res = await fetch("/api/v1/fx/conversions", {
                method: "PUT",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ quoteId: quote.row.id }),
              });
              const json = await res.json();
              if (!res.ok) {
                setError(json.error?.message ?? "Conversion failed.");
                return;
              }
              setDone(true);
            }}
          >
            Convert
          </Button>
        </div>
      ) : null}
      {done ? <p className="rounded-2xl bg-success/10 p-4 text-success">Conversion complete. Ledger updated in both currencies.</p> : null}
    </div>
  );
}
