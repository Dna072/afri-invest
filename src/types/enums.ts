export const CURRENCIES = ["GHS", "USD", "EUR", "GBP", "SEK", "NGN", "KES", "ZAR", "XOF"] as const;
export type CurrencyCode = (typeof CURRENCIES)[number];

export const ACTIVE_CURRENCIES = ["GHS", "USD", "EUR", "GBP", "SEK"] as const;

export const APP_ENVS = ["development", "test", "staging", "sandbox", "production"] as const;
export type AppEnv = (typeof APP_ENVS)[number];

export const ROLES = [
  "customer",
  "support",
  "operations",
  "compliance_analyst",
  "mlro",
  "finance",
  "admin",
  "super_admin",
  "auditor",
] as const;
export type Role = (typeof ROLES)[number];

export const PERMISSIONS = [
  "kyc.review",
  "aml.review",
  "ledger.view",
  "ledger.adjust",
  "withdrawal.approve",
  "regulatory.edit",
  "audit.view",
  "partner.manage",
  "customer.view",
  "orders.view",
  "payments.view",
  "feature_flags.manage",
  "demo.control",
  "complaints.manage",
  "incidents.manage",
  "analytics.view",
] as const;
export type Permission = (typeof PERMISSIONS)[number];

export const TRANSACTION_STATES = [
  "initiated",
  "pending",
  "processing",
  "completed",
  "failed",
  "reversed",
  "cancelled",
] as const;
export type TransactionState = (typeof TRANSACTION_STATES)[number];

export const ORDER_STATES = [
  "draft",
  "submitted",
  "accepted",
  "rejected",
  "partially_filled",
  "filled",
  "cancel_requested",
  "cancelled",
  "settlement_pending",
  "settled",
  "failed",
] as const;
export type OrderState = (typeof ORDER_STATES)[number];

export const FEATURE_FLAGS = [
  "ghana_equities",
  "ghana_treasuries",
  "funds",
  "ipo",
  "diaspora_funding",
  "fx",
  "auto_invest",
  "premium",
  "nigeria_market",
  "kenya_market",
  "south_africa_market",
  "brvm_market",
  "global_markets",
  "fractional_investing",
] as const;
export type FeatureFlagKey = (typeof FEATURE_FLAGS)[number];

export const FEATURE_STATUSES = ["disabled", "enabled", "beta", "pilot", "market-restricted"] as const;
export type FeatureStatus = (typeof FEATURE_STATUSES)[number];

export const ASSET_TYPES = ["equity", "bond", "treasury", "fund", "etf", "ipo"] as const;
export type AssetType = (typeof ASSET_TYPES)[number];

export const DIVIDEND_STATES = ["declared", "estimated", "payable", "received", "reinvested"] as const;

export const DATA_CLASSIFICATIONS = ["public", "internal", "confidential", "restricted"] as const;
