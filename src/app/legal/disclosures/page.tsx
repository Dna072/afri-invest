import { PublicShell } from "@/components/chrome/public-shell";

export const metadata = { title: "Disclosures" };

export default function DisclosuresPage() {
  return (
    <PublicShell>
    <article className="mx-auto max-w-2xl px-4 py-12 leading-7">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-2 font-display text-4xl">Disclosures</h1>
      <p className="mt-6">Investment values can rise or fall. Investing involves risk and you may lose capital.</p>
      <p className="mt-4">
        Africa Invest is under development. Prices and orders are illustrative. It is not a live brokerage, bank or
        licensed investment service.
      </p>
      <p className="mt-4">
        Every investor must complete KYC. Tax liabilities depend on your country of residence. Educational content is
        not personalised financial advice.
      </p>
      <p className="mt-4">
        We do not claim licences, partnerships, custody arrangements or regulatory approvals that do not exist.
      </p>
    </article>
    </PublicShell>
  );
}
