"use client";

import { useMemo, useState } from "react";
import Decimal from "decimal.js";
import { Button } from "@/components/ui/button";

export function BusinessModel() {
  const [customers, setCustomers] = useState(10000);
  const [aum, setAum] = useState(50_000_000);
  const [trading, setTrading] = useState(2_000_000);
  const [fx, setFx] = useState(8_000_000);
  const subConv = 0.08;
  const subFee = 8;
  const b2b = 12;

  const out = useMemo(() => {
    const tradingRev = new Decimal(trading).times("0.005");
    const fxRev = new Decimal(fx).times("0.006");
    const aumRev = new Decimal(aum).times("0.004");
    const subRev = new Decimal(customers).times(subConv).times(subFee).times(12);
    const b2bRev = new Decimal(b2b).times(25000);
    const total = tradingRev.plus(fxRev).plus(aumRev).plus(subRev).plus(b2bRev);
    const cac = new Decimal(45);
    const opex = new Decimal(customers).times(12).plus(1_800_000);
    const contribution = total.minus(new Decimal(customers).times(cac).times(0.3));
    const ebitda = total.minus(opex);
    return { tradingRev, fxRev, aumRev, subRev, b2bRev, total, cac, opex, contribution, ebitda };
  }, [customers, aum, trading, fx, subConv, subFee, b2b]);

  return (
    <section className="rounded-[2rem] bg-card p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-warning">Illustrative financial model</p>
      <h2 className="mt-2 font-display text-3xl">Not company performance</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {[10000, 50000, 100000, 500000].map((n) => (
          <Button key={n} size="sm" variant={customers === n ? "primary" : "outline"} onClick={() => setCustomers(n)}>
            {n.toLocaleString()} customers
          </Button>
        ))}
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <Num label="Customers" value={customers} set={setCustomers} />
        <Num label="AUM" value={aum} set={setAum} />
        <Num label="Trading volume" value={trading} set={setTrading} />
        <Num label="FX volume" value={fx} set={setFx} />
      </div>
      <dl className="mt-6 grid gap-2 text-sm md:grid-cols-2">
        <Row k="Trading revenue" v={out.tradingRev} />
        <Row k="FX revenue" v={out.fxRev} />
        <Row k="AUM revenue" v={out.aumRev} />
        <Row k="Subscription revenue" v={out.subRev} />
        <Row k="B2B revenue" v={out.b2bRev} />
        <Row k="Total revenue" v={out.total} />
        <Row k="CAC (assumed)" v={out.cac} />
        <Row k="Operating costs" v={out.opex} />
        <Row k="Contribution" v={out.contribution} />
        <Row k="EBITDA" v={out.ebitda} />
      </dl>
      <p className="mt-4 text-xs text-muted-foreground">
        Subscription conversion {subConv} at {subFee}/mo · {b2b} B2B customers. Assumptions are editable in code, not presented as actuals.
      </p>
    </section>
  );
}

function Num({ label, value, set }: { label: string; value: number; set: (n: number) => void }) {
  return (
    <label className="text-sm">
      {label}
      <input
        type="number"
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        className="mt-1 min-h-11 w-full rounded-2xl border px-3 tabular"
      />
    </label>
  );
}

function Row({ k, v }: { k: string; v: Decimal }) {
  return (
    <div className="flex justify-between rounded-xl bg-muted/50 px-3 py-2">
      <dt>{k}</dt>
      <dd className="tabular">{v.toFixed(0)}</dd>
    </div>
  );
}
