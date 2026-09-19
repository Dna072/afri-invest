import { apiRoute } from "@/lib/api";
import { requireUser } from "@/services/auth";
import { getCustomerAccount } from "@/services/accounts";
import { getPortfolio } from "@/services/portfolio";
import type { CurrencyCode } from "@/types/enums";

export async function GET() {
  return apiRoute(async () => {
    const user = await requireUser();
    const account = await getCustomerAccount(user);
    const reporting = (user.personaKey === "derrick" ? "GHS" : user.primaryCurrency) as CurrencyCode;
    return getPortfolio(account.id, reporting);
  });
}
