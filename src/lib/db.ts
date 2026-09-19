import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/** Cap Prisma connections so Cloud Run instances cannot exhaust Cloud SQL. */
export function withPoolLimits(url: string, connectionLimit = process.env.DB_CONNECTION_LIMIT ?? "3") {
  if (!url.startsWith("postgres")) return url;
  const parsed = new URL(url);
  if (!parsed.searchParams.has("connection_limit")) {
    parsed.searchParams.set("connection_limit", connectionLimit);
  }
  if (!parsed.searchParams.has("pool_timeout")) {
    parsed.searchParams.set("pool_timeout", "20");
  }
  return parsed.toString();
}

const datasourceUrl = withPoolLimits(process.env.DATABASE_URL ?? "file:./dev.db");

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.APP_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: { db: { url: datasourceUrl } },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
