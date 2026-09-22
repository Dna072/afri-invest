import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/chrome/public-shell";
import { PriceChange } from "@/components/ui/money";
import { Button } from "@/components/ui/button";
import { marketFromSlug, marketSlug, publicAsset } from "@/lib/markets-public";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ market: string; symbol: string }>;
}) {
  const { symbol } = await params;
  const asset = publicAsset(symbol);
  return { title: asset ? `How to buy ${asset.name}` : "Stock" };
}

export default async function PublicStockPage({
  params,
}: {
  params: Promise<{ market: string; symbol: string }>;
}) {
  const { market, symbol } = await params;
  const found = marketFromSlug(market);
  const asset = publicAsset(symbol);
  if (!found || !asset || asset.marketId !== found.id) notFound();
  const tradable = found.id === "ghana" && asset.tradability === "open";

  return (
    <PublicShell>
      <article className="mx-auto max-w-3xl px-4 py-14">
        <p className="text-sm text-muted-foreground">
          <Link href={`/stocks/${marketSlug(found.id)}`} className="hover:text-foreground">
            ← {found.name} stocks
          </Link>
        </p>
        <p className="eyebrow mt-6">{found.exchanges[0]?.name}</p>
        <h1 className="mt-2 font-display text-5xl">How to buy {asset.name} stock</h1>
        <p className="mt-4 text-lg text-muted-foreground">{asset.description}</p>
        <div className="mt-8 flex items-end justify-between rounded-xl bg-card p-5">
          <div>
            <p className="font-semibold">{asset.symbol}</p>
            <p className="text-sm text-muted-foreground">{asset.sector ?? asset.assetType}</p>
          </div>
          <div className="text-right">
            <p className="font-display text-3xl tabular">
              {asset.currency} {asset.price}
            </p>
            <PriceChange value={asset.changePercent} />
          </div>
        </div>
        <ol className="mt-10 grid gap-4">
          {[
            ["1", "Create an account", "Use your legal name and country of residence. Residence determines your tax obligations."],
            ["2", "Complete KYC", "Every investor verifies their identity before they can add money or buy shares."],
            ["3", "Add money", "Fund your account. If you convert currencies, the rate, fee and amount received are shown first."],
            ["4", tradable ? `Buy ${asset.symbol}` : "Join the waitlist", tradable ? `Place an order for ${asset.name} on the ${found.exchanges[0]?.name}.` : `${found.name} trading is not open yet. We will notify you when ${asset.symbol} can be bought.`],
          ].map(([n, title, body]) => (
            <li key={n} className="rounded-xl bg-card p-5">
              <p className="font-display text-2xl text-accent">{n}</p>
              <h2 className="mt-2 font-display text-2xl">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href={tradable ? "/signup" : "/waitlist"}>{tradable ? "Start investing" : "Get notified"}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/fees">See fees</Link>
          </Button>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          Prices are illustrative. This is not a live brokerage. Investment values can rise or fall.
        </p>
      </article>
    </PublicShell>
  );
}
