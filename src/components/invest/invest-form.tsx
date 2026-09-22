"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MoneyText } from "@/components/ui/money";

type Preview = {
  quantity: string;
  price: string;
  fees: { items: Array<{ name: string; amount: string; explanation: string }>; total: { amount?: string }; grandTotal: { amount?: string } };
  principal: { amount?: string };
};

export function InvestForm({ assetId, currency, min }: { assetId: string; currency: string; min: string }) {
  const router = useRouter();
  const [amount, setAmount] = useState("500");
  const [step, setStep] = useState<"amount" | "review" | "risk" | "done">("amount");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  async function loadPreview() {
    setError(null);
    const res = await fetch("/api/v1/orders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ assetId, amount, preview: true }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error?.message ?? "Could not price this order.");
      return;
    }
    setPreview(json.data);
    setStep("review");
  }

  const feeItems = useMemo(() => preview?.fees.items ?? [], [preview]);

  return (
    <div className="space-y-5">
      {step === "amount" ? (
        <>
          <label className="block text-sm">
            Investment amount ({currency})
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
              className="mt-2 min-h-14 w-full rounded-2xl border bg-card px-4 text-2xl tabular"
            />
          </label>
          <p className="text-xs text-muted-foreground">Minimum {min} {currency}. Illustrative pricing.</p>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button className="w-full sticky bottom-4" onClick={() => void loadPreview()}>
            Review order
          </Button>
        </>
      ) : null}
      {step === "review" && preview ? (
        <>
          <div className="rounded-3xl bg-card p-5 shadow-[var(--shadow-sm)] space-y-3">
            <Row label="Investment amount" value={`${currency} ${amount}`} />
            {feeItems.map((item) => (
              <Row key={item.name} label={item.name} value={`${currency} ${item.amount}`} hint={item.explanation} />
            ))}
            <Row label="Estimated quantity" value={preview.quantity} />
            <Row label="Estimated total" value={`${currency} ${amount}`} strong />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button className="w-full" onClick={() => setStep("risk")}>
            Continue to risk disclosure
          </Button>
        </>
      ) : null}
      {step === "risk" ? (
        <>
          <div className="rounded-3xl border border-border bg-card p-5 text-sm leading-6">
            <p>Investing involves risk. The value of this holding can fall as well as rise, and you may get back less than you invest. Currency conversion can add further risk for diaspora investors.</p>
            <p className="mt-3 text-muted-foreground">This is not personalised advice. Sandbox execution only — no live broker is connected.</p>
          </div>
          <Button
            className="w-full"
            onClick={async () => {
              setError(null);
              const res = await fetch("/api/v1/orders", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ assetId, amount }),
              });
              const json = await res.json();
              if (!res.ok) {
                setError(json.error?.message ?? "Order could not be submitted.");
                return;
              }
              setOrderId(json.data.id);
              setStep("done");
            }}
          >
            Confirm investment
          </Button>
        </>
      ) : null}
      {step === "done" ? (
        <div className="rounded-3xl bg-primary p-6 text-primary-foreground">
          <p className="text-xs uppercase tracking-[0.2em] text-accent">Order submitted</p>
          <p className="mt-2 font-display text-3xl">Your order has been placed.</p>
          <p className="mt-3 text-sm text-primary-foreground/80">Your portfolio has been updated. Order {orderId}</p>
          <Button className="mt-6" variant="gold" onClick={() => router.push("/app/portfolio")}>
            View portfolio
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function Row({ label, value, hint, strong }: { label: string; value: string; hint?: string; strong?: boolean }) {
  return (
    <div>
      <div className="flex justify-between gap-4 text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={strong ? "font-medium tabular" : "tabular"}>{value}</span>
      </div>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

void MoneyText;
