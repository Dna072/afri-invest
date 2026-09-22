import { PublicShell } from "@/components/chrome/public-shell";

export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <PublicShell>
    <article className="mx-auto max-w-2xl px-4 py-12 leading-7">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-2 font-display text-4xl">Privacy</h1>
      <p className="mt-6">
        We collect the information needed to open an account, complete KYC and determine tax obligations based on your
        country of residence. You can ask for access, export or deletion where the law allows.
      </p>
      <p className="mt-4">Demo accounts use fictional personal data. Do not upload real identity documents.</p>
    </article>
    </PublicShell>
  );
}
