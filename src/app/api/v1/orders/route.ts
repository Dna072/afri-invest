import { z } from "zod";
import { apiRoute } from "@/lib/api";
import { requireUser } from "@/services/auth";
import { getCustomerAccount } from "@/services/accounts";
import { createOrder, previewOrder } from "@/services/orders";

export async function POST(request: Request) {
  return apiRoute(async () => {
    const user = await requireUser();
    const account = await getCustomerAccount(user);
    const body = z
      .object({
        assetId: z.string(),
        amount: z.string(),
        preview: z.boolean().optional(),
        idempotencyKey: z.string().optional(),
      })
      .parse(await request.json());
    if (body.preview) return previewOrder({ assetId: body.assetId, amount: body.amount });
    return createOrder({
      accountId: account.id,
      userId: user.id,
      assetId: body.assetId,
      amount: body.amount,
      idempotencyKey: body.idempotencyKey,
    });
  });
}
