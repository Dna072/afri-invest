import { apiRoute } from "@/lib/api";
import { requireUser } from "@/services/auth";
import { can } from "@/lib/rbac";
import { AppError } from "@/lib/errors";
import { prisma } from "@/lib/db";

export async function GET() {
  return apiRoute(async () => {
    const user = await requireUser();
    if (!can(user.role, "customer.view") && user.role === "customer") {
      throw new AppError("FORBIDDEN", "Customers cannot list all users.", 403);
    }
    if (user.role === "customer") {
      throw new AppError("FORBIDDEN", "Staff only.", 403);
    }
    return prisma.user.findMany({
      take: 50,
      select: { id: true, email: true, displayName: true, role: true, countryOfResidence: true },
    });
  });
}
