import { apiRoute } from "@/lib/api";
import { requireUser } from "@/services/auth";

export async function GET() {
  return apiRoute(async () => requireUser());
}
