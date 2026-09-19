import { prisma } from "@/lib/db";
import { requestId } from "@/lib/ids";

export async function recordAudit(input: {
  action: string;
  entity: string;
  entityId?: string;
  actorId?: string;
  result?: string;
  ip?: string;
  device?: string;
  metadata?: Record<string, unknown>;
}) {
  await prisma.auditEvent.create({
    data: {
      action: input.action,
      entity: input.entity,
      entityId: input.entityId,
      actorId: input.actorId,
      result: input.result ?? "success",
      ip: input.ip,
      device: input.device,
      requestId: requestId(),
      metadata: JSON.stringify(input.metadata ?? {}),
    },
  });
}

export async function emitDomainEvent(type: string, payload: Record<string, unknown>) {
  await prisma.domainEvent.create({
    data: { type, payload: JSON.stringify(payload), status: "processed", processedAt: new Date() },
  });
}

export async function track(name: string, userId?: string, properties?: Record<string, unknown>) {
  await prisma.analyticsEvent.create({
    data: { name, userId, properties: JSON.stringify(properties ?? {}) },
  });
}
