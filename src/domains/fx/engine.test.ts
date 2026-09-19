import { describe, expect, it } from "vitest";
import { quoteFx } from "@/domains/fx/engine";

describe("fx", () => {
  it("discloses fee and received amount", () => {
    const q = quoteFx({ from: "SEK", to: "GHS", amount: "5000", sourceRate: "1.164" });
    expect(q.platformFee.isPositive()).toBe(true);
    expect(q.amountReceived.currency).toBe("GHS");
    expect(q.debitTotal.gt(q.customerAmount)).toBe(true);
  });
});
