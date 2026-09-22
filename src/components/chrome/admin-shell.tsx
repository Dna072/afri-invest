"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeMenu } from "@/components/theme/theme-menu";
import { cn } from "@/lib/cn";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/kyc", label: "KYC" },
  { href: "/admin/aml", label: "AML" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/withdrawals", label: "Withdrawals" },
  { href: "/admin/ledger", label: "Ledger" },
  { href: "/admin/reconciliation", label: "Reconciliation" },
  { href: "/admin/partners", label: "Partners" },
  { href: "/admin/regulatory", label: "Regulatory" },
  { href: "/admin/complaints", label: "Complaints" },
  { href: "/admin/incidents", label: "Incidents" },
  { href: "/admin/audit", label: "Audit logs" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/flags", label: "Feature flags" },
  { href: "/admin/demo", label: "Demo controls" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminShell({ children, title }: { children: React.ReactNode; title: string }) {
  const pathname = usePathname();
  return (
    <div className="min-h-dvh">
      <div className="kente-ribbon" aria-hidden />
      <div className="min-h-[calc(100dvh-3px)] md:flex">
        <aside className="hidden w-64 shrink-0 border-r border-border bg-[color:var(--navy-card)] text-on-navy md:block">
          <div className="p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-accent">Operations</p>
            <p className="font-display text-2xl">Control</p>
          </div>
          <nav className="space-y-0.5 px-3 pb-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block rounded-xl px-3 py-2 text-sm",
                  pathname === link.href ? "bg-accent text-accent-foreground" : "hover:bg-white/10",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1">
          <div className="flex items-center gap-2 border-b border-border p-3 md:hidden">
            <div className="flex flex-1 gap-2 overflow-x-auto">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="whitespace-nowrap rounded-lg bg-card px-3 py-2 text-xs">
                  {link.label}
                </Link>
              ))}
            </div>
            <ThemeMenu compact />
          </div>
          <div className="flex items-center justify-between px-4 py-6 md:px-10">
            <h1 className="font-display text-3xl">{title}</h1>
            <div className="hidden md:block">
              <ThemeMenu />
            </div>
          </div>
          <div className="px-4 pb-8 md:px-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
