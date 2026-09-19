import { describe, expect, it } from "vitest";
import { can } from "@/lib/rbac";
import { canTransitionOrder } from "@/domains/ledger/invariants";

describe("authorization and orders", () => {
  it("does not grant ledger.adjust to customers", () => {
    expect(can("customer", "ledger.adjust")).toBe(false);
    expect(can("super_admin", "ledger.adjust")).toBe(true);
  });

  it("enforces order state machine", () => {
    expect(canTransitionOrder("submitted", "accepted")).toBe(true);
    expect(canTransitionOrder("settled", "submitted")).toBe(false);
  });
});
