"use client";

import { useMemo, useState } from "react";
import { futureValue, maturityValue } from "@/domains/wealth/calc";
import { tradingFee, fxFee } from "@/domains/fees/engine";
import { Money } from "@/lib/money";

export function Calculators() {
  const [initial, setInitial] = useState("1000");
  const [monthly, setMonthly] = useState("200");
  const [ret, setRet] = useState("8");
  const [years, setYears] = useState("10");
  const fv = useMemo(() => futureValue(initial, monthly, ret, Number(years)), [initial, monthly, ret, years]);
  const fee = tradingFee(Money.from("1000", "USD"));
  const fx = fxFee(Money.from("1000", "USD"));
  const maturity = maturityValue("1000", "24.5", 91);

  return (
    <>
      <p className="text-sm text-muted-foreground">Illustration only. Returns are not guaranteed.</p>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-card p-5">
          <h2 className="font-display text-2xl">Growth</h2>
          <Field label="Initial" value={initial} set={setInitial} />
          <Field label="Monthly" value={monthly} set={setMonthly} />
          <Field label="Expected annual return %" value={ret} set={setRet} />
          <Field label="Years" value={years} set={setYears} />
          <p className="mt-4 font-display text-3xl tabular">{fv}</p>
        </div>
        <div className="rounded-3xl bg-card p-5 space-y-3">
          <h2 className="font-display text-2xl">Fees & treasury</h2>
          <p>Illustrative trading fee on USD 1,000: {fee.total.toFixed()}</p>
          <p>Illustrative FX fee on USD 1,000: {fx.total.toFixed()}</p>
          <p>91-day T-bill maturity on 1,000 at 24.5%: {maturity}</p>
          <p className="text-xs text-muted-foreground">Illustrative prototype pricing.</p>
        </div>
      </div>
    </>
  );
}

function Field({ label, value, set }: { label: string; value: string; set: (v: string) => void }) {
  return (
    <label className="mt-3 block text-sm">
      {label}
      <input value={value} onChange={(e) => set(e.target.value)} className="mt-1 min-h-11 w-full rounded-2xl border px-3 tabular" />
    </label>
  );
}
