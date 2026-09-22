import Link from "next/link";
import { AccraClock } from "@/components/brand/accra-clock";
import { BrandMark } from "@/components/brand/mark";
import { Button } from "@/components/ui/button";

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1.6fr_1fr_1fr]">
        <div>
          <BrandMark />
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            One account for African stocks, ETFs and, next, global markets. Piloting in Ghana first. KYC required for
            every investor.
          </p>
          <div className="mt-4">
            <AccraClock />
          </div>
          <Button asChild size="sm" className="mt-5">
            <Link href="/signup">Start investing</Link>
          </Button>
        </div>
        <div className="text-sm">
          <p className="eyebrow">Product</p>
          <ul className="mt-3 grid gap-2">
            <li>
              <Link href="/stocks">African stocks</Link>
            </li>
            <li>
              <Link href="/fees">Fees</Link>
            </li>
            <li>
              <Link href="/#how">How it works</Link>
            </li>
            <li>
              <Link href="/waitlist">Early access</Link>
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
          <span>© Africa Invest. Under development. Not a live brokerage.</span>
          <span className="ml-auto">Illustrative prices · KYC required</span>
        </div>
      </div>
    </footer>
  );
}
