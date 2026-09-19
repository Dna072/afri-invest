import Link from "next/link";
import { redirect } from "next/navigation";
import { readSession } from "@/services/auth";
import { isStaff } from "@/lib/rbac";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await readSession();
  if (!user) redirect("/login");
  if (!isStaff(user.role) && user.personaKey !== "admin") {
    redirect("/app");
  }
  return (
    <div>
      <div className="border-b border-border bg-primary px-4 py-2 text-xs text-primary-foreground">
        Operations · sandbox · <Link href="/app" className="underline">Customer app</Link>
      </div>
      {children}
    </div>
  );
}
