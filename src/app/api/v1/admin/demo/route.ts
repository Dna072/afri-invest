import { z } from "zod";
import { apiRoute } from "@/lib/api";
import { requireUser } from "@/services/auth";
import { can } from "@/lib/rbac";
import { AppError } from "@/lib/errors";
import { demoControlsEnabled } from "@/lib/env";
import {
  advanceRegulatoryStage,
  generateAmlAlert,
  generateDeposit,
  generateDividend,
  generateFx,
  generateKycReview,
  generateOrder,
  generatePaymentFailure,
  generateReconciliationException,
} from "@/services/demo";
import { getCustomerAccount } from "@/services/accounts";
import { prisma } from "@/lib/db";
import type { CurrencyCode } from "@/types/enums";

export async function POST(request: Request) {
  return apiRoute(async () => {
    if (!demoControlsEnabled()) throw new AppError("DEMO_DISABLED", "Demo controls are off.", 403);
    const user = await requireUser();
    if (!can(user.role, "demo.control") && user.role === "customer") {
      // customers may run demo actions on their own account in development only
    }
    const body = z.object({ action: z.string(), payload: z.record(z.string(), z.string()).optional() }).parse(await request.json());
    const account = await getCustomerAccount(user);
    switch (body.action) {
      case "deposit":
        return generateDeposit(account.id, user.id, body.payload?.amount ?? "1000", (body.payload?.currency as CurrencyCode) ?? "SEK");
      case "fx":
        return generateFx(account.id, user.id, body.payload?.amount ?? "1000", "SEK", "GHS");
      case "order": {
        const asset = await prisma.asset.findFirstOrThrow({ where: { symbol: "MTNGH" } });
        return generateOrder(account.id, user.id, asset.id, body.payload?.amount ?? "200");
      }
      case "dividend": {
        const asset = await prisma.asset.findFirstOrThrow({ where: { symbol: "MTNGH" } });
        return generateDividend(account.id, user.id, asset.id);
      }
      case "payment_failure":
        return generatePaymentFailure(account.id, user.id);
      case "kyc_review":
        return generateKycReview(user.id);
      case "aml_alert":
        return generateAmlAlert(user.id);
      case "reconciliation":
        if (!can(user.role, "demo.control")) throw new AppError("FORBIDDEN", "Admin only.", 403);
        return generateReconciliationException();
      case "advance_stage":
        if (!can(user.role, "regulatory.edit")) throw new AppError("FORBIDDEN", "Admin only.", 403);
        return advanceRegulatoryStage(body.payload?.stageId ?? "s1", user.id, body.payload?.override === "true");
      default:
        throw new AppError("UNKNOWN_ACTION", "Unknown demo action.");
    }
  });
}
