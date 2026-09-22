"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, LineChart, User, Wallet } from "lucide-react";
import { AccraClock } from "@/components/brand/accra-clock";
import { BrandMark } from "@/components/brand/mark";
import { ThemeMenu } from "@/components/theme/theme-menu";
import { cn } from "@/lib/cn";

const items = [
  { href: "/app", label: "Home", icon: Home },
  { href: "/app/markets", label: "Markets", icon: LineChart },
  { href: "/app/portfolio", label: "Portfolio", icon: Wallet },
  { href: "/app/activity", label: "Activity", icon: BookOpen },
  { href: "/app/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur md:hidden">
      <ul className="mx-auto grid max-w-lg grid-cols-5 px-2 pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => {
          const active = item.href === "/app" ? pathname === "/app" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 text-[11px]",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function SideNav() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-border bg-card/80 p-6 md:flex">
      <Link href="/app" className="block">
        <BrandMark />
      </Link>
      <p className="mt-2 text-xs text-muted-foreground">Invest today. A brighter Africa tomorrow.</p>
      <ul className="mt-8 space-y-1">
        {items.map((item) => {
          const active = item.href === "/app" ? pathname === "/app" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-[10px] px-3 text-sm transition",
                  active ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-auto space-y-3 pt-8">
        <ThemeMenu align="left" drop="up" />
        <AccraClock compact />
      </div>
    </aside>
  );
}
