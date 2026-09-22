import Link from "next/link";
import { PublicShell } from "@/components/chrome/public-shell";
import { Reveal } from "@/components/motion/reveal";
import { BusinessModel } from "@/components/investor/business-model";

export const metadata = { title: "Investor demo" };

export default function InvestorDemoPage() {
  return (
    <PublicShell>
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Reveal>
      <p className="eyebrow">Product tour</p>
      <h1 className="mt-2 font-display text-5xl">The product, in one sitting.</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        This is a guided walkthrough for prospective investors. It is the product, not a slide deck. Sandbox data throughout.
      </p>
      </Reveal>
      <ol className="mt-10 space-y-8">
        <Step n="01" title="Problem">
          Africans at home and abroad lack a single, trustworthy way to invest across African public markets. Diaspora capital often sits in European current accounts while Ghanaian (and later Nigerian, Kenyan, South African) markets remain operationally distant.
        </Step>
        <Step n="02" title="Solution">
          One investment account. Multi-currency funding. Explicit FX. African market access starting with Ghana. A ledger, not a fake balance field.
        </Step>
        <Step n="03" title="Product">
          Open <Link href="/login" className="underline">the customer app as Derrick</Link> — Ghanaian living in Sweden, SEK on the left, Ghana portfolio on the right.
        </Step>
        <Step n="04" title="Diaspora experience">
          SEK → FX quote (rate, spread, fee, amount received) → GHS → Ghana stock or treasury. The customer never needs to name the broker, custodian or PSP.
        </Step>
        <Step n="05" title="African market access">
          Ghana is modelled. Nigeria, Kenya, South Africa and BRVM are discoverable and marked coming soon. Adding a market is configuration plus providers.
        </Step>
        <Step n="06" title="Business model">
          Transparent trading, FX, platform/AUM, subscriptions and future B2B APIs. No dark patterns. The simulator below is labelled illustrative.
        </Step>
        <Step n="07" title="Regulatory roadmap">
          Open the <Link href="/admin/regulatory" className="underline">Control Tower</Link>. Stages cannot pass with open mandatory gates. Classification is marked Needs Legal Review where uncertain.
        </Step>
        <Step n="08" title="Operational architecture">
          Ledger, reconciliation, KYC/AML, audit, incidents, complaints, partner CRM — all first-class, with mock providers behind interfaces.
        </Step>
        <Step n="09" title="Expansion">
          Ghana → additional African markets → global markets via a future GlobalBrokerProvider. Not hardcoded to one vendor.
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
