import Link from "next/link";
import { BrandMark } from "@/components/brand/mark";

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <BrandMark />
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            One account for Africans everywhere. Ghana first. Sandbox market data. Not a live brokerage.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">From Accra · hours in Africa/Accra</p>
        </div>
        <div className="text-sm">
          <p className="eyebrow">Product</p>
          <ul className="mt-3 grid gap-2">
            <li>
              <Link href="/#markets">Markets</Link>
            </li>
            <li>
              <Link href="/fees">Fees</Link>
            </li>
            <li>
              <Link href="/investor-demo">Product tour</Link>
            </li>
            <li>
              <Link href="/waitlist">Waitlist</Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="eyebrow">Legal</p>
          <ul className="mt-3 grid gap-2">
            <li>
              <Link href="/legal/disclosures">Disclosures</Link>
            </li>
            <li>
              <Link href="/legal/privacy">Privacy</Link>
            </li>
            <li>
              <Link href="/legal/terms">Terms</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border px-4 py-4 text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-3">
          <span>© Africa Invest. Under development.</span>
          <span className="ml-auto">Illustrative sandbox prices · no licence claimed</span>
        </div>
      </div>
    </footer>
  );
}
