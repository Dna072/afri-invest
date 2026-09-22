import { PublicShell } from "@/components/chrome/public-shell";
import { FeeCalculator } from "@/components/wealth/fee-page";

export const metadata = { title: "Fees" };

export default function FeesPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-3xl px-4 py-14">
        <p className="eyebrow">Transparent by default</p>
        <h1 className="mt-2 font-display text-5xl">Fees, in daylight.</h1>
        <p className="mt-4 text-muted-foreground">
          Illustrative prototype pricing. Not a live fee schedule. The engine is configuration-driven so we never hide a number in a button handler.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {[
            ["Trading", "0.50% illustrative"],
            ["FX", "0.60% plus disclosed spread"],
            ["Withdrawals", "0 in this prototype"],
            ["Premium", "Architecture only, no billing"],
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
