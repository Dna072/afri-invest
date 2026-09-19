import { FeeCalculator } from "@/components/wealth/fee-page";

export const metadata = { title: "Fees" };

export default function FeesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-5xl">Fees, in daylight.</h1>
      <p className="mt-4 text-muted-foreground">
        Illustrative prototype pricing. Not a live fee schedule. The engine is configuration-driven so we never hide a number in a button handler.
      </p>
      <ul className="mt-8 space-y-3 text-sm">
        <li className="rounded-2xl bg-card p-4">Trading · 0.50% illustrative</li>
        <li className="rounded-2xl bg-card p-4">FX · 0.60% illustrative plus disclosed spread</li>
        <li className="rounded-2xl bg-card p-4">Withdrawals · 0 in this prototype configuration</li>
        <li className="rounded-2xl bg-card p-4">Premium subscription · architecture only, no live billing</li>
      </ul>
      <div className="mt-10">
        <FeeCalculator />
      </div>
    </div>
  );
}
