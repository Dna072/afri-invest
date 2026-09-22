import { PublicShell } from "@/components/chrome/public-shell";

export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <PublicShell>
    <article className="mx-auto max-w-2xl px-4 py-12 leading-7">
      <h1 className="font-display text-4xl">Privacy</h1>
      <p className="mt-6">
        The architecture supports consent, purpose limitation, retention, access, export and deletion where legally permitted. Ghana data protection and GDPR concepts are modelled; this page is not a filed privacy notice.
      </p>
      <p className="mt-4">Demo accounts use entirely fictional personal data. Do not enter real identity documents.</p>
    </article>
    </PublicShell>
  );
}
