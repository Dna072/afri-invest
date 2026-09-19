import { redirect } from "next/navigation";
import { readSession } from "@/services/auth";

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const user = await readSession();
  if (!user) redirect("/login");
  return children;
}
