import { z } from "zod";
import { prisma } from "@/lib/db";
import { apiRoute } from "@/lib/api";

export async function POST(request: Request) {
  return apiRoute(async () => {
    const body = z
      .object({
        email: z.string().email(),
        country: z.string(),
        countryOfResidence: z.string(),
        investorType: z.string(),
        marketsInterested: z.array(z.string()).or(z.string()),
      })
      .parse(await request.json());
    const markets = Array.isArray(body.marketsInterested) ? body.marketsInterested.join(",") : body.marketsInterested;
    return prisma.waitlistEntry.create({
      data: { ...body, marketsInterested: markets },
    });
  });
}
