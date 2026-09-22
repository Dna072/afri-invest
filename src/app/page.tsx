import Link from "next/link";
import { Globe2, ShieldCheck, Receipt, Landmark } from "lucide-react";
import { PublicShell } from "@/components/chrome/public-shell";
import { WaitlistForm } from "@/components/forms/waitlist-form";
import { AfricaMap } from "@/components/markets/africa-map";
import { SessionBadge } from "@/components/markets/session-badge";
import { StockRow } from "@/components/markets/stock-row";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { PriceChange } from "@/components/ui/money";
import { ASSET_SEED, MARKET_SEED } from "@/mock/catalog";

const featured = ASSET_SEED.filter((a) => a.marketId === "ghana" && a.assetType === "equity").slice(0, 6);

const faqs = [
  [
    "Is Africa Invest a live brokerage?",
    "Not yet. The product is under development. You can walk the full investing flow with illustrative prices. We do not claim a live brokerage licence.",
  ],
  [
    "Why start with Ghana?",
    "We are a platform for investors everywhere. Ghana is the first market we are piloting. After Ghana we expand to other African exchanges, then offer global stocks to African investors.",
  ],
  [
    "Do I need KYC?",
    "Yes. Every investor completes identity verification before they can add money or buy securities. This is required for all users, wherever you live.",
  ],
  [
    "How are taxes handled?",
    "Tax liabilities follow your country of residence. We collect residence so we can show withholding, capital-gains and reporting rules that apply to you.",
  ],
  [
    "What can I buy?",
    "African stocks, ETFs, funds and government securities. Ghana listings are available to explore today. Other African exchanges and global stocks are next.",
  ],
];

export default function LandingPage() {
  return (
    <PublicShell>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-10 md:grid-cols-2 md:pt-16">
        <Reveal>
          <p className="eyebrow">Stocks · ETFs · African exchanges</p>
          <h1 className="mt-3 font-display text-5xl leading-[1.05] md:text-6xl">
            Invest in <span className="text-[color:var(--accent)]">African</span> stocks from one account.
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">
            Buy shares and ETFs on African exchanges. We are piloting in Ghana first, then expanding across Africa — and
            adding global stocks for African investors.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/signup">
                Start investing <span aria-hidden>→</span>
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/stocks">Explore African stocks</Link>
            </Button>
          </div>
          <p className="mt-6 max-w-md text-xs text-muted-foreground">
            Under development. Not a live brokerage. KYC required for every investor.
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="lift rounded-xl bg-[color:var(--navy-card)] p-6 text-on-navy">
            <div className="flex items-center justify-between gap-3">
              <p className="eyebrow text-accent">Portfolio preview</p>
              <SessionBadge className="bg-white/10 text-on-navy" />
            </div>
            <p className="mt-3 font-display text-4xl">
              <CountUp value={84240.32} prefix="GH₵ " />
            </p>
            <p className="mt-1 text-sm text-on-navy/70">
              Ghana positions + cash · <PriceChange value="4.82" className="text-accent" /> illustrative
            </p>
            <div className="mt-6">
              <p className="eyebrow">Ghana stocks today</p>
              <ul className="mt-3 divide-y divide-white/10">
                {featured.slice(0, 4).map((asset) => (
                  <li key={asset.symbol} className="flex items-center justify-between py-2.5 text-sm">
                    <div>
                      <p className="font-semibold">{asset.symbol}</p>
                      <p className="text-xs text-on-navy/55">{asset.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="tabular">GH₵ {asset.price}</p>
                      <PriceChange value={asset.changePercent} variant="pill" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-6">
        <div className="rounded-xl border border-border bg-card p-5 md:p-6">
          <p className="eyebrow">Direct answer</p>
          <h2 className="mt-2 font-display text-2xl">How do I buy African stocks?</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Create an account, complete KYC, add money, then place an order. Ghana is the first market you can walk
            through today. Other African exchanges and global stocks follow.
          </p>
        </div>
      </section>

      <section className="border-y border-border bg-card/60">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-4">
          {[
            ["1", "Pilot market", "Ghana Stock Exchange"],
            ["5+", "African exchanges", "NGX · NSE · JSE · BRVM next"],
            ["KYC", "Required for all", "Identity check before you invest"],
            ["Tax", "By residence", "Shown before you buy"],
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
          <h2 className="mt-2 font-display text-4xl">Buy Ghana stocks first.</h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            MTN Ghana, GCB, Fan Milk and other GSE names. Prices are illustrative while the Ghana pilot is under
            development.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {featured.map((asset, i) => (
            <Reveal key={asset.symbol} delay={i * 0.04}>
              <StockRow
                href={`/stocks/ghana/${asset.symbol.toLowerCase()}`}
                symbol={asset.symbol}
                name={asset.name}
                subtitle={`${asset.symbol} · GSE · ${asset.sector}`}
                price={`GH₵ ${asset.price}`}
                change={asset.changePercent}
              />
            </Reveal>
          ))}
        </div>
        <div className="mt-6">
          <Button asChild variant="outline">
            <Link href="/stocks">See all African stocks</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <Reveal>
          <h2 className="font-display text-4xl">African markets, then global.</h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Ghana is live to explore. Nigeria, Kenya, South Africa and the BRVM are next. Global stocks for African
            investors come after that.
          </p>
        </Reveal>
        <div className="mt-8">
          <AfricaMap />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {MARKET_SEED.map((m) => (
            <Link key={m.id} href={`/stocks/${m.id.replace("_", "-")}`} className="lift rounded-xl bg-card px-4 py-4 text-sm">
              <p className="font-semibold">{m.exchanges[0]?.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {m.country} · {m.currency}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section id="how" className="bg-[color:var(--navy-card)] text-on-navy">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <Reveal>
            <p className="eyebrow text-accent">How it works</p>
            <h2 className="mt-2 font-display text-4xl">Start investing in four steps.</h2>
          </Reveal>
          <ol className="mt-10 grid gap-4 md:grid-cols-4">
            {[
              ["01", "Create an account", "Tell us who you are and where you live. Residence drives tax."],
              ["02", "Verify your identity", "KYC is required for every investor before you can add money."],
              ["03", "Add money", "Fund in the currency you already use. FX is shown before you convert."],
              ["04", "Buy stocks and ETFs", "Start with Ghana. Other African exchanges and global stocks follow."],
            ].map(([n, title, body], i) => (
              <Reveal key={n} delay={i * 0.06}>
                <li className="rounded-xl bg-white/5 p-5 transition hover:-translate-y-1 hover:bg-white/8">
                  <p className="font-display text-3xl text-accent">{n}</p>
                  <p className="mt-3 font-semibold">{title}</p>
                  <p className="mt-2 text-sm text-on-navy/70">{body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <Reveal>
          <p className="eyebrow">Built for investors</p>
          <h2 className="mt-2 font-display text-4xl">Clear rules before you buy.</h2>
        </Reveal>
        <div className="mt-8 grid gap-3 md:grid-cols-4">
          {(
            [
              [ShieldCheck, "KYC for every user", "Identity verification is required. No shortcuts, wherever you live."],
              [Receipt, "Tax by residence", "We use your country of residence to surface the tax rules that apply to you."],
              [Landmark, "African exchanges first", "Ghana now. Nigeria, Kenya, South Africa and BRVM next."],
              [Globe2, "Global stocks next", "US and European shares for African investors, once the rails are ready."],
            ] as const
          ).map(([Icon, title, body], i) => (
            <Reveal key={title} delay={i * 0.05}>
              <article className="lift h-full rounded-xl bg-card p-5">
                <Icon className="h-5 w-5 text-accent" />
                <h3 className="mt-3 font-display text-xl">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="rounded-xl bg-primary px-6 py-10 text-primary-foreground md:px-12">
          <p className="eyebrow text-accent">Coming next</p>
          <h2 className="mt-2 font-display text-4xl">Global stocks for African investors.</h2>
          <p className="mt-4 max-w-2xl text-primary-foreground/80">
            After African exchanges, you will be able to buy US and European stocks and ETFs from the same account. That
            offering is not live yet.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <Reveal>
          <p className="eyebrow">Questions</p>
          <h2 className="mt-2 font-display text-4xl">Straight answers.</h2>
        </Reveal>
        <div className="mt-8 grid gap-3">
          {faqs.map(([q, a]) => (
            <details key={q} className="faq-item">
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="waitlist" className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-2">
        <div>
          <h2 className="font-display text-4xl">Get early access</h2>
          <p className="mt-3 text-muted-foreground">
            Tell us where you live and which markets you want. We use residence to plan KYC and tax coverage.
          </p>
        </div>
        <WaitlistForm />
      </section>
    </PublicShell>
  );
}
