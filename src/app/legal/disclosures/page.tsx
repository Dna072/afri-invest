import { PublicShell } from "@/components/chrome/public-shell";

export const metadata = { title: "Disclosures" };

export default function DisclosuresPage() {
  return (
    <PublicShell>
    <article className="mx-auto max-w-2xl px-4 py-12 leading-7">
      <h1 className="font-display text-4xl">Disclosures</h1>
      <p className="mt-6">Investment values can rise or fall. Investing involves risk and you may lose capital.</p>
      <p className="mt-4">This application is currently under development. It uses sandbox market data and mock providers. It is not a live brokerage, bank or licensed investment service.</p>
      <p className="mt-4">Educational content is not personalised financial advice.</p>
      <p className="mt-4">Africa Invest does not claim licences, partnerships, custody arrangements, regulatory approvals or security certifications that do not exist.</p>
    </article>
    </PublicShell>
  );
}
