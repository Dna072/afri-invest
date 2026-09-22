import { PublicShell } from "@/components/chrome/public-shell";

export const metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <PublicShell>
    <article className="mx-auto max-w-2xl px-4 py-12 leading-7">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-2 font-display text-4xl">Terms</h1>
      <p className="mt-6">
        This preview does not create a customer agreement for live investment services. When the brokerage is licensed
        and live, you will be asked to accept the then-current terms before you can fund or trade.
      </p>
    </article>
    </PublicShell>
  );
}
