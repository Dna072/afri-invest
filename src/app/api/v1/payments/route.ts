import { z } from "zod";
import { apiRoute } from "@/lib/api";
import { requireUser } from "@/services/auth";
import { getCustomerAccount } from "@/services/accounts";
import { createDeposit } from "@/services/funding";
import type { CurrencyCode } from "@/types/enums";

export async function POST(request: Request) {
  return apiRoute(async () => {
    const user = await requireUser();
    const account = await getCustomerAccount(user);
    const body = z
      .object({
        amount: z.string(),
        currency: z.string(),
        method: z.string(),
        idempotencyKey: z.string().optional(),
      })
      .parse(await request.json());
    return createDeposit({
      accountId: account.id,
      userId: user.id,
      amount: body.amount,
      currency: body.currency as CurrencyCode,
      method: body.method,
      idempotencyKey: body.idempotencyKey,
    });
  });
}
