import { z } from "zod";
import { apiRoute } from "@/lib/api";
import { prisma } from "@/lib/db";
import { createSession, hashPassword } from "@/services/auth";
import { recordAudit, track } from "@/services/audit";

export async function POST(request: Request) {
  return apiRoute(async () => {
    const body = z
      .object({
        email: z.string().email(),
        password: z.string().min(10),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        countryOfResidence: z.string().min(2),
        nationality: z.string().min(2),
        primaryCurrency: z.string().min(3),
      })
      .parse(await request.json());
    const user = await prisma.user.create({
      data: {
        email: body.email.toLowerCase(),
        passwordHash: await hashPassword(body.password),
        firstName: body.firstName,
        lastName: body.lastName,
        displayName: body.firstName,
        nationality: body.nationality,
        countryOfResidence: body.countryOfResidence,
        primaryCurrency: body.primaryCurrency,
        profile: { create: {} },
        securityProfile: { create: {} },
        taxProfile: { create: { taxResidence: body.countryOfResidence } },
        kycProfile: { create: { status: "pending", riskRating: "medium" } },
        privacyPreference: { create: {} },
        accounts: {
          create: {
            type: "investment",
            status: "active",
            baseCurrency: body.primaryCurrency,
            label: "Investment account",
          },
        },
      },
    });
    await prisma.watchlist.create({ data: { userId: user.id, name: "Default" } });
    await createSession(user);
    await recordAudit({ action: "USER_CREATED", entity: "user", entityId: user.id, actorId: user.id });
    await track("signup_completed", user.id);
    return { id: user.id };
  });
}
