import { apiRoute } from "@/lib/api";
import { clearSession } from "@/services/auth";

export async function POST() {
  return apiRoute(async () => {
    await clearSession();
    return { ok: true };
  });
}
