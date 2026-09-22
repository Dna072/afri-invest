import Link from "next/link";
import { PublicShell } from "@/components/chrome/public-shell";
import { WaitlistForm } from "@/components/forms/waitlist-form";
import { AfricaMap } from "@/components/markets/africa-map";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { PriceChange } from "@/components/ui/money";
import { ASSET_SEED, MARKET_SEED } from "@/mock/catalog";

const featured = ASSET_SEED.filter((a) => a.marketId === "ghana" && a.assetType === "equity").slice(0, 6);

export default function LandingPage() {
  return (
    <PublicShell>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-10 md:grid-cols-2 md:pt-16">
        <Reveal>
          <p className="eyebrow text-accent-foreground">Ghana first · diaspora ready</p>
          <h1 className="mt-3 font-display text-5xl leading-[1.05] md:text-6xl">
            Invest in <span className="text-[color:var(--accent)]">African</span> markets from anywhere.
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">
            One account. Transparent FX. Ghana equities and bills in the sandbox today — other exchanges architected, not pretended.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/login">
                Explore the product <span aria-hidden>→</span>
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#waitlist">Join the waitlist</Link>
            </Button>
          </div>
          <p className="mt-6 max-w-md text-xs text-muted-foreground">
            Under development. Sandbox prices. Not a live brokerage. No licence is claimed.
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="lift rounded-[1.25rem] bg-[color:var(--navy-card)] p-6 text-primary-foreground">
            <p className="eyebrow text-accent">Portfolio preview</p>
            <p className="mt-3 font-display text-4xl tabular">GH₵ 84,240.32</p>
            <p className="mt-1 text-sm text-primary-foreground/70">
              Ghana positions + GHS cash · <PriceChange value="4.82" className="text-accent" /> sandbox
            </p>
            <div className="mt-6">
              <p className="eyebrow">Ghana stocks today</p>
              <ul className="mt-3 divide-y divide-white/10">
                {featured.slice(0, 4).map((asset) => (
                  <li key={asset.symbol} className="flex items-center justify-between py-2.5 text-sm">
                    <div>
                      <p className="font-semibold">{asset.symbol}</p>
                      <p className="text-xs text-primary-foreground/55">{asset.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="tabular">GH₵ {asset.price}</p>
                      <PriceChange value={asset.changePercent} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="border-y border-border bg-card/60">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-4">
          {[
            ["1", "Live market modelled", "Ghana / GSE sandbox"],
            ["4", "Exchanges architected", "NGX · NSE · JSE · BRVM"],
            ["GHS", "Local execution", "SEK · GBP · USD funding"],
            ["Accra", "Clock we keep", "Africa/Accra hours"],
          ].map(([stat, label, hint], i) => (
            <Reveal key={label} delay={i * 0.05}>
              <p className="font-display text-4xl">{stat}</p>
              <p className="mt-1 text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground">{hint}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="markets" className="mx-auto max-w-6xl px-4 py-16">
        <Reveal>
          <p className="eyebrow">Featured Ghana listings</p>
          <h2 className="mt-2 font-display text-4xl">GSE names, in daylight.</h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Illustrative sandbox quotes. MTN Ghana, GCB, Fan Milk and more — the same list Derrick sees after sign-in.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {featured.map((asset, i) => (
            <Reveal key={asset.symbol} delay={i * 0.04}>
              <Link href="/login" className="lift flex items-center justify-between rounded-xl bg-card px-4 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-xs font-bold">
                    {asset.symbol.slice(0, 3)}
                  </span>
                  <div>
                    <p className="font-semibold">{asset.name}</p>
                    <p className="text-xs text-muted-foreground">{asset.symbol} · GSE · {asset.sector}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="tabular font-medium">GH₵ {asset.price}</p>
                  <PriceChange value={asset.changePercent} />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <Reveal>
          <h2 className="font-display text-4xl">Discover African markets</h2>
          <p className="mt-2 max-w-xl text-muted-foreground">Ghana is modelled first. The rest are marked honestly as coming soon.</p>
        </Reveal>
        <div className="mt-8">
          <AfricaMap />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-5">
          {MARKET_SEED.map((m) => (
            <div key={m.id} className="rounded-xl bg-card px-4 py-4 text-sm">
              <p className="font-semibold">{m.exchanges[0]?.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{m.country} · {m.currency}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="bg-[color:var(--navy-card)] text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <Reveal>
            <p className="eyebrow text-accent">How it works</p>
            <h2 className="mt-2 font-display text-4xl">SEK → GHS → Ghana, without the mystery.</h2>
          </Reveal>
          <ol className="mt-10 grid gap-4 md:grid-cols-4">
            {[
              ["01", "Open an account", "Demo personas or a sandbox signup. KYC is mocked."],
              ["02", "Fund in your currency", "SEK, GBP, EUR, USD or GHS. Ledger-backed cash."],
              ["03", "Convert with a quote", "Rate, spread, fee and amount received. Quotes expire."],
              ["04", "Invest on GSE", "Equities, bills and funds in the Ghana sandbox."],
            ].map(([n, title, body], i) => (
              <Reveal key={n} delay={i * 0.06}>
                <li className="rounded-xl bg-white/5 p-5">
                  <p className="font-display text-3xl text-accent">{n}</p>
                  <p className="mt-3 font-semibold">{title}</p>
                  <p className="mt-2 text-sm text-primary-foreground/70">{body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-3">
        {[
          ["Built for the diaspora", "Fund from SEK, GBP, EUR or USD, then invest into African markets without naming the plumbing."],
          ["A ledger, not a number", "Cash, equities, treasuries and funds sit on double-entry books. Balances are not a field on a user row."],
          ["Fees in daylight", "Every quote shows the rate, spread, fee and amount received. Illustrative prototype pricing only."],
        ].map(([title, body], i) => (
          <Reveal key={title} delay={i * 0.06}>
            <article className="lift h-full rounded-xl bg-card p-6">
              <h3 className="font-display text-2xl">{title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{body}</p>
            </article>
          </Reveal>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="rounded-[1.25rem] bg-primary px-6 py-10 text-primary-foreground md:px-12">
          <p className="eyebrow text-accent">Long-term wealth</p>
          <h2 className="mt-2 font-display text-4xl">Global markets, coming soon.</h2>
          <p className="mt-4 max-w-2xl text-primary-foreground/80">
            US stocks, European markets and global ETFs need extra regulatory, brokerage and tax work. We will not pretend they are live.
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
    </PublicShell>
  );
}
