import { MarketTicker } from "@/components/chrome/market-ticker";
import { PublicFooter } from "@/components/chrome/public-footer";
import { PublicHeader } from "@/components/chrome/public-header";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <div className="kente-ribbon" aria-hidden />
      <MarketTicker />
      <PublicHeader />
      {children}
      <PublicFooter />
    </div>
  );
}
