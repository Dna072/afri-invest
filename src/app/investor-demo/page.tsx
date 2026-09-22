import Link from "next/link";
import { PublicShell } from "@/components/chrome/public-shell";
import { Reveal } from "@/components/motion/reveal";
import { BusinessModel } from "@/components/investor/business-model";

export const metadata = { title: "Product tour" };

export default function InvestorDemoPage() {
  return (
    <PublicShell>
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Reveal>
      <p className="eyebrow">Product tour</p>
      <h1 className="mt-2 font-display text-5xl">The investing flow, in one sitting.</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Walk the same path a customer uses: account, KYC, funding, then buy African stocks. Prices are illustrative. This
        is not a live brokerage.
      </p>
      </Reveal>
      <ol className="mt-10 space-y-8">
        <Step n="01" title="The problem">
          Africans at home and abroad want a single place to buy stocks and ETFs on African exchanges — and later, global
          stocks — without opening a new broker in every country.
        </Step>
        <Step n="02" title="The product">
          One investment account. KYC for every user. Tax based on country of residence. African market access starting
          with Ghana, then other exchanges, then global stocks.
        </Step>
        <Step n="03" title="Try it">
          Open <Link href="/login" className="underline">the app with a demo profile</Link> to see a Ghana portfolio,
          place an order and convert currency.
        </Step>
        <Step n="04" title="The customer path">
          Create account → verify identity → add money → buy a Ghana stock or ETF. Other African exchanges are listed as
          coming soon.
        </Step>
        <Step n="05" title="Markets">
          Ghana is the pilot. Nigeria, Kenya, South Africa and the BRVM follow. Global stocks for African investors are
          planned, not live.
        </Step>
        <Step n="06" title="Fees">
          Trading and FX costs are shown before you confirm. The calculator on the fees page is labelled illustrative.
        </Step>
        <Step n="07" title="Compliance">
          KYC, AML, tax residence and audit sit in the operations console. Stages cannot skip mandatory checks.
        </Step>
        <Step n="08" title="What is not claimed">
          No live licence, no live market data, no live custody. The walkthrough is the product under development.
        </Step>
      </ol>
      <div className="mt-12">
        <BusinessModel />
      </div>
    </div>
    </PublicShell>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <li className="grid gap-2 md:grid-cols-[5rem_1fr]">
      <span className="font-display text-3xl text-accent">{n}</span>
      <div>
        <h2 className="font-display text-3xl">{title}</h2>
        <p className="mt-2 text-muted-foreground">{children}</p>
      </div>
    </li>
  );
}
