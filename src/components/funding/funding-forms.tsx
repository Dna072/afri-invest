"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function FundingForm({ currency }: { currency: string }) {
  const [amount, setAmount] = useState("1000");
  const [method, setMethod] = useState("international_transfer");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        const res = await fetch("/api/v1/payments", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ amount, currency, method }),
        });
        const json = await res.json();
        if (!res.ok) {
          setError(json.error?.message ?? "Payment could not be started.");
          return;
        }
        setMessage(`Deposit ${json.data.status}. Your ledger is the source of truth for the new balance.`);
      }}
    >
      <label className="block text-sm">
        Amount ({currency})
        <input value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 min-h-14 w-full rounded-2xl border bg-card px-4 text-2xl tabular" />
      </label>
      <label className="block text-sm">
        Method
        <select value={method} onChange={(e) => setMethod(e.target.value)} className="mt-1 min-h-12 w-full rounded-2xl border bg-card px-3">
          <option value="international_transfer">International transfer</option>
          <option value="bank_transfer">Bank transfer</option>
          <option value="mobile_money">Mobile money (Ghana)</option>
          <option value="card">Card (not live)</option>
        </select>
      </label>
      <p className="text-xs text-muted-foreground">Availability is configuration-based. No production payment provider is connected.</p>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {message ? <p className="text-sm text-success">{message}</p> : null}
      <Button className="w-full" type="submit">Add money</Button>
    </form>
  );
}

export function WithdrawForm({ currency }: { currency: string }) {
  const [amount, setAmount] = useState("200");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const res = await fetch("/api/v1/withdrawals", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            amount,
            currency,
            destination: "bank_se_demo",
            destinationLabel: "Demo SEK account",
          }),
        });
        const json = await res.json();
        if (!res.ok) {
          setError(json.error?.message ?? "Withdrawal could not be created.");
          return;
        }
        setMessage(`Withdrawal ${json.data.status}. Large withdrawals require maker-checker approval.`);
      }}
    >
      <label className="block text-sm">
        Amount ({currency})
        <input value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 min-h-12 w-full rounded-2xl border bg-card px-4 tabular" />
      </label>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {message ? <p className="text-sm">{message}</p> : null}
      <Button className="w-full" variant="outline" type="submit">Review withdrawal</Button>
    </form>
  );
}
