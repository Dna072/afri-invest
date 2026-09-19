import Link from "next/link";
import { WaitlistForm } from "@/components/forms/waitlist-form";
import { AfricaMap } from "@/components/markets/africa-map";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <Link href="/" className="font-display text-2xl">
          Africa Invest
        </Link>
        <div className="flex gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Join</Link>
          </Button>
        </div>
      </header>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-6 md:grid-cols-2 md:pt-16">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-accent-foreground">Africa Invest</p>
          <h1 className="mt-3 font-display text-5xl leading-[1.05] md:text-7xl">Invest in Africa from anywhere.</h1>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">
            One investment account designed to connect Africans and the global African diaspora with African capital markets.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/login">Explore the Product</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#waitlist">Join the Waitlist</Link>
            </Button>
          </div>
          <p className="mt-6 max-w-md text-xs text-muted-foreground">
            The product is under development. Market data is sandbox. This is not a live brokerage and no licence is claimed.
          </p>
        </div>
        <div className="rounded-[2rem] bg-card p-4 shadow-[var(--shadow)]">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Diaspora corridor</p>
          <p className="mt-2 font-display text-4xl">SEK → GHS → Ghana</p>
          <ol className="mt-6 space-y-3 text-sm">
            {["Earn in Sweden", "Convert with a transparent FX quote", "Invest on the Ghana market", "Hold one portfolio"].map((step, i) => (
              <li key={step} className="flex gap-3 rounded-2xl bg-muted/60 px-4 py-3">
                <span className="tabular text-accent-foreground">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="font-display text-4xl">Discover African markets</h2>
        <p className="mt-2 max-w-xl text-muted-foreground">Ghana is modelled first. Nigeria, Kenya, South Africa and BRVM are architected, not live.</p>
        <div className="mt-8">
          <AfricaMap />
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-3">
        {[
          ["Built for the diaspora", "Fund from SEK, GBP, EUR or USD, then invest into African markets without needing to understand the plumbing."],
          ["One portfolio", "Cash, equities, treasuries and funds sit on a double-entry ledger. Balances are not a single number on a user row."],
          ["Transparent fees", "Every quote shows the rate, spread, fee and amount received. Illustrative prototype pricing only."],
        ].map(([title, body]) => (
          <article key={title} className="rounded-3xl bg-card p-6">
            <h3 className="font-display text-2xl">{title}</h3>
            <p className="mt-3 text-sm text-muted-foreground">{body}</p>
          </article>
        ))}
      </section>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-[2rem] bg-primary px-6 py-10 text-primary-foreground md:px-12">
          <p className="text-xs uppercase tracking-[0.2em] text-accent">Long-term wealth</p>
          <h2 className="mt-2 font-display text-4xl">Global markets, coming soon.</h2>
          <p className="mt-4 max-w-2xl text-primary-foreground/80">
            US stocks, European markets and global ETFs will require additional regulatory, brokerage, tax and operational infrastructure. We will not pretend they are live.
          </p>
        </div>
      </section>
      <section id="waitlist" className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-2">
        <div>
          <h2 className="font-display text-4xl">Join the early access list</h2>
          <p className="mt-3 text-muted-foreground">Tell us where you live and which markets you care about. Stored as development/mock persistence.</p>
        </div>
        <WaitlistForm />
      </section>
      <footer className="border-t border-border px-4 py-8 text-sm text-muted-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-4">
          <Link href="/legal/disclosures">Disclosures</Link>
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/fees">Fees</Link>
          <Link href="/investor-demo">Investor demo</Link>
          <span className="ml-auto">© Africa Invest. Under development.</span>
        </div>
      </footer>
    </div>
  );
}

