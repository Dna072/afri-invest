"use client";

import { useMemo, useState } from "react";
import { tradingFee, fxFee } from "@/domains/fees/engine";
import { Money } from "@/lib/money";

export function FeeCalculator() {
  const [amount, setAmount] = useState("1000");
  const quote = useMemo(() => {
    const principal = Money.from(amount || "0", "USD");
    const t = tradingFee(principal);
    const f = fxFee(principal);
    return { t, f, total: t.grandTotal.add(f.total) };
  }, [amount]);
  return (
    <div className="rounded-3xl bg-card p-5">
      <p className="text-xs uppercase tracking-wide text-warning">Illustrative prototype pricing</p>
      <label className="mt-3 block text-sm">
        Investment USD
        <input value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 min-h-12 w-full rounded-2xl border px-4 tabular" />
      </label>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between"><dt>Trading fee</dt><dd className="tabular">{quote.t.total.toFixed()}</dd></div>
        <div className="flex justify-between"><dt>FX</dt><dd className="tabular">{quote.f.total.toFixed()}</dd></div>
        <div className="flex justify-between font-medium"><dt>Estimated total</dt><dd className="tabular">{quote.total.toFixed()}</dd></div>
      </dl>
    </div>
  );
}
