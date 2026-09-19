import { NextRequest } from "next/server";
import { z } from "zod";
import { apiRoute } from "@/lib/api";
import { loginDemoPersona, loginWithPassword } from "@/services/auth";

export async function POST(request: NextRequest) {
  return apiRoute(async () => {
    const body = await request.json();
    if (body.personaKey) {
      const parsed = z.object({ personaKey: z.string() }).parse(body);
      const user = await loginDemoPersona(parsed.personaKey);
      return { id: user.id, email: user.email, role: user.role };
    }
    const parsed = z.object({ email: z.string().email(), password: z.string().min(8) }).parse(body);
    const user = await loginWithPassword(parsed.email, parsed.password, {
      ip: request.headers.get("x-forwarded-for") ?? undefined,
    });
    return { id: user.id, email: user.email, role: user.role };
  });
}
