import { prisma } from "@/lib/db";
import { AppError } from "@/lib/errors";
import type { SessionUser } from "@/services/auth";

export async function getCustomerAccount(user: SessionUser) {
  const account = await prisma.account.findFirst({
    where: { userId: user.id, status: "active" },
  });
  if (!account) {
    const fallback = await prisma.account.findFirst({ where: { userId: user.id } });
    if (!fallback) throw new AppError("ACCOUNT_MISSING", "No investment account found.", 404);
    return fallback;
  }
  return account;
}

export function assertOwns(user: SessionUser, ownerId: string) {
  if (user.role === "customer" && user.id !== ownerId) {
    throw new AppError("FORBIDDEN", "You cannot access another customer's resources.", 403);
  }
}
