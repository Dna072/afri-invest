import { prisma } from "@/lib/db";
import { apiRoute } from "@/lib/api";

export async function GET() {
  return apiRoute(async () => {
    const markets = await prisma.market.findMany({ include: { exchanges: true } });
    const assets = await prisma.asset.findMany({ include: { market: true, exchange: true, bondTerms: true } });
    return { markets, assets };
  });
}
