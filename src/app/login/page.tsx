import { Suspense } from "react";
import Link from "next/link";
import { PublicShell } from "@/components/chrome/public-shell";
import { LoginForm } from "@/components/forms/login-form";
import { SessionBadge } from "@/components/markets/session-badge";
import { PriceChange } from "@/components/ui/money";
import { ASSET_SEED } from "@/mock/catalog";

export const metadata = { title: "Sign in" };

const preview = ASSET_SEED.filter((a) => a.marketId === "ghana" && a.assetType === "equity").slice(0, 5);

export default function LoginPage() {
  return (
    <PublicShell>
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-14 md:grid-cols-2">
        <div className="mx-auto w-full max-w-md md:mx-0">
          <p className="eyebrow">Africa Invest</p>
          <h1 className="mt-2 font-display text-4xl">Sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Continue to your account, or try a demo profile to walk the investing flow.
          </p>
          <div className="mt-8">
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>
          <p className="mt-6 text-sm">
            New here?{" "}
            <Link href="/signup" className="font-medium text-primary underline">
              Start investing
            </Link>
          </p>
        </div>
        <aside className="hidden md:block">
          <div className="lift rounded-xl bg-[color:var(--navy-card)] p-6 text-on-navy">
            <div className="flex items-center justify-between">
              <p className="eyebrow text-accent">Ghana Stock Exchange</p>
              <SessionBadge className="bg-white/10 text-on-navy" />
            </div>
            <p className="mt-3 font-display text-3xl">Ghana names you can explore.</p>
            <p className="mt-2 text-sm text-on-navy/70">Illustrative quotes from the Ghana pilot.</p>
            <ul className="mt-6 divide-y divide-white/10">
              {preview.map((asset) => (
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
        </aside>
      </div>
    </PublicShell>
  );
}
