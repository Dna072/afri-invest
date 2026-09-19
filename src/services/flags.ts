import { prisma } from "@/lib/db";
import type { FeatureFlagKey, FeatureStatus } from "@/types/enums";

export async function getFlag(key: FeatureFlagKey): Promise<FeatureStatus> {
  const row = await prisma.featureFlag.findUnique({ where: { key } });
  return (row?.status as FeatureStatus) ?? "disabled";
}

export async function isEnabled(key: FeatureFlagKey) {
  const status = await getFlag(key);
  return status === "enabled" || status === "beta" || status === "pilot";
}

export async function getAllFlags() {
  return prisma.featureFlag.findMany({ orderBy: { key: "asc" } });
}
