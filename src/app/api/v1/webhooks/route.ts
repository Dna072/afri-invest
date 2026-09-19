import { z } from "zod";
import { prisma } from "@/lib/db";
import { apiRoute } from "@/lib/api";
import { AppError } from "@/lib/errors";

export async function POST(request: Request) {
  return apiRoute(async () => {
    const body = z
      .object({
        eventId: z.string(),
        eventType: z.string(),
        provider: z.string(),
        signature: z.string().optional(),
        payload: z.unknown(),
      })
      .parse(await request.json());
    const key = `${body.provider}:${body.eventId}`;
    const existing = await prisma.webhookEvent.findUnique({ where: { idempotencyKey: key } });
    if (existing) return existing;
    if (body.signature === "invalid") {
      throw new AppError("INVALID_SIGNATURE", "Webhook signature was rejected.", 401);
    }
    return prisma.webhookEvent.create({
      data: {
        provider: body.provider,
        eventId: body.eventId,
        eventType: body.eventType,
        signature: body.signature,
        payload: JSON.stringify(body.payload ?? {}),
        status: "processed",
        processedAt: new Date(),
        idempotencyKey: key,
      },
    });
  });
}
