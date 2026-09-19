import { z } from "zod";

const schema = z.object({
  APP_ENV: z.enum(["development", "test", "staging", "sandbox", "production"]).default("development"),
  APP_URL: z.string().default("http://localhost:3000"),
  APP_NAME: z.string().default("Africa Invest"),
  DATABASE_URL: z.string().default("file:./dev.db"),
  SESSION_SECRET: z.string().min(16).default("replace-with-a-long-random-secret-at-least-32-chars"),
  IDENTITY_PROVIDER: z.string().default("mock"),
  PAYMENT_PROVIDER: z.string().default("mock"),
  FX_PROVIDER: z.string().default("mock"),
  BROKER_PROVIDER: z.string().default("mock"),
  CUSTODY_PROVIDER: z.string().default("mock"),
  MARKET_DATA_PROVIDER: z.string().default("mock"),
  NOTIFICATION_PROVIDER: z.string().default("mock"),
  DOCUMENT_PROVIDER: z.string().default("mock"),
  TAX_PROVIDER: z.string().default("mock"),
  ENABLE_DEMO_CONTROLS: z.string().default("true"),
  ENABLE_DEMO_LOGIN: z.string().default("true"),
  LOG_LEVEL: z.string().default("info"),
  GCS_BUCKET: z.string().optional(),
});

export const env = schema.parse({
  APP_ENV: process.env.APP_ENV,
  APP_URL: process.env.APP_URL,
  APP_NAME: process.env.APP_NAME,
  DATABASE_URL: process.env.DATABASE_URL,
  SESSION_SECRET: process.env.SESSION_SECRET,
  IDENTITY_PROVIDER: process.env.IDENTITY_PROVIDER,
  PAYMENT_PROVIDER: process.env.PAYMENT_PROVIDER,
  FX_PROVIDER: process.env.FX_PROVIDER,
  BROKER_PROVIDER: process.env.BROKER_PROVIDER,
  CUSTODY_PROVIDER: process.env.CUSTODY_PROVIDER,
  MARKET_DATA_PROVIDER: process.env.MARKET_DATA_PROVIDER,
  NOTIFICATION_PROVIDER: process.env.NOTIFICATION_PROVIDER,
  DOCUMENT_PROVIDER: process.env.DOCUMENT_PROVIDER,
  TAX_PROVIDER: process.env.TAX_PROVIDER,
  ENABLE_DEMO_CONTROLS: process.env.ENABLE_DEMO_CONTROLS,
  ENABLE_DEMO_LOGIN: process.env.ENABLE_DEMO_LOGIN,
  LOG_LEVEL: process.env.LOG_LEVEL,
  GCS_BUCKET: process.env.GCS_BUCKET,
});

export function isProduction() {
  return env.APP_ENV === "production";
}

export function demoControlsEnabled() {
  return env.ENABLE_DEMO_CONTROLS === "true" && env.APP_ENV !== "production";
}
