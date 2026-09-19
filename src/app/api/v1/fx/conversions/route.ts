import { z } from "zod";
import { apiRoute } from "@/lib/api";
import { requireUser } from "@/services/auth";
import { getCustomerAccount } from "@/services/accounts";
import { createFxQuote, executeFxQuote } from "@/services/fx";
import type { CurrencyCode } from "@/types/enums";

export async function POST(request: Request) {
  return apiRoute(async () => {
    const user = await requireUser();
    const account = await getCustomerAccount(user);
    const body = z
      .object({
        from: z.string(),
        to: z.string(),
        amount: z.string(),
      })
      .parse(await request.json());
    return createFxQuote({
      accountId: account.id,
      from: body.from as CurrencyCode,
      to: body.to as CurrencyCode,
      amount: body.amount,
    });
  });
}

export async function PUT(request: Request) {
  return apiRoute(async () => {
    const user = await requireUser();
    const body = z.object({ quoteId: z.string(), idempotencyKey: z.string().optional() }).parse(await request.json());
    return executeFxQuote({ quoteId: body.quoteId, userId: user.id, idempotencyKey: body.idempotencyKey });
  });
}
