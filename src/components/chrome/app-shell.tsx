import Link from "next/link";
import { Bell } from "lucide-react";
import { BottomNav, SideNav } from "@/components/chrome/nav";

export function AppShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-6xl">
      <SideNav />
      <div className="flex min-h-dvh flex-1 flex-col pb-20 md:pb-0">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/70 bg-background/80 px-4 py-3 backdrop-blur md:px-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Africa Invest</p>
            <h1 className="font-display text-xl md:text-2xl">{title ?? "Home"}</h1>
          </div>
          <Link href="/app/activity" className="focus-ring flex h-11 w-11 items-center justify-center rounded-full bg-card">
            <Bell size={18} />
            <span className="sr-only">Notifications</span>
          </Link>
        </header>
        <main className="flex-1 px-4 py-5 md:px-8 md:py-8">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
