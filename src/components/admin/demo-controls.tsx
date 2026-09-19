"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const actions = [
  ["deposit", "Generate deposit"],
  ["fx", "Generate FX conversion"],
  ["order", "Generate order"],
  ["dividend", "Generate dividend"],
  ["payment_failure", "Generate payment failure"],
  ["kyc_review", "Generate KYC review"],
  ["aml_alert", "Generate AML alert"],
  ["reconciliation", "Generate reconciliation exception"],
];

export function DemoControls() {
  const [message, setMessage] = useState<string | null>(null);
  async function run(action: string) {
    const res = await fetch("/api/v1/admin/demo", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const json = await res.json();
    setMessage(res.ok ? `${action} ok` : json.error?.message ?? "Failed");
  }
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {actions.map(([id, label]) => (
        <Button key={id} variant="outline" onClick={() => void run(id)}>
          {label}
        </Button>
      ))}
      {message ? <p className="md:col-span-2 text-sm">{message}</p> : null}
    </div>
  );
}
