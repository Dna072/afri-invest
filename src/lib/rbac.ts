import type { Permission, Role } from "@/types/enums";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  customer: [],
  support: ["customer.view", "complaints.manage", "audit.view"],
  operations: [
    "customer.view",
    "orders.view",
    "payments.view",
    "ledger.view",
    "withdrawal.approve",
    "complaints.manage",
    "incidents.manage",
  ],
  compliance_analyst: ["customer.view", "kyc.review", "aml.review", "audit.view"],
  mlro: ["customer.view", "kyc.review", "aml.review", "audit.view", "regulatory.edit"],
  finance: ["ledger.view", "payments.view", "analytics.view", "audit.view"],
  admin: [
    "kyc.review",
    "aml.review",
    "ledger.view",
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
  ],
  super_admin: [
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
  ],
  auditor: ["ledger.view", "audit.view", "analytics.view", "customer.view"],
};

export function can(role: Role, permission: Permission) {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function assertCan(role: Role, permission: Permission) {
  if (!can(role, permission)) {
    const error = new Error("Forbidden");
    (error as Error & { code: string; status: number }).code = "FORBIDDEN";
    (error as Error & { code: string; status: number }).status = 403;
    throw error;
  }
}

export function isStaff(role: Role) {
  return role !== "customer";
}
