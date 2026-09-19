"use server";

import { prisma } from "@/lib/db";
import { requireUser } from "@/services/auth";

export async function toggleWatchlist(assetId: string) {
  const user = await requireUser();
  const list = await prisma.watchlist.findFirstOrThrow({ where: { userId: user.id } });
  const existing = await prisma.watchlistItem.findUnique({
    where: { watchlistId_assetId: { watchlistId: list.id, assetId } },
  });
  if (existing) await prisma.watchlistItem.delete({ where: { id: existing.id } });
  else await prisma.watchlistItem.create({ data: { watchlistId: list.id, assetId } });
}
