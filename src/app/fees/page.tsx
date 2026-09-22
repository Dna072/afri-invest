import { PublicShell } from "@/components/chrome/public-shell";
import { FeeCalculator } from "@/components/wealth/fee-page";

export const metadata = { title: "Fees" };

export default function FeesPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-3xl px-4 py-14">
        <p className="eyebrow">Fees</p>
        <h1 className="mt-2 font-display text-5xl">What you pay, before you buy.</h1>
        <p className="mt-4 text-muted-foreground">
          You see trading and FX costs before you confirm an order. Figures below are illustrative while the product is
          under development — not a live fee schedule.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {[
            ["Trading", "0.50% illustrative commission on equity and ETF orders"],
            ["FX", "0.60% plus the spread shown on the quote"],
            ["Withdrawals", "No withdrawal fee in this preview"],
            ["Custody", "No monthly custody fee while we pilot Ghana"],
          ].map(([title, body]) => (
            <li key={title} className="lift rounded-xl bg-card p-5">
              <p className="font-semibold">{title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <FeeCalculator />
        </div>
      </div>
    </PublicShell>
  );
}
