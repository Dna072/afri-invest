import { describe, expect, it } from "vitest";
import { Money, compactAmount, formatMoney } from "@/lib/money";

describe("Money", () => {
  it("never uses floating-point addition", () => {
    const a = Money.from("0.10", "GHS");
    const b = Money.from("0.20", "GHS");
    expect(a.add(b).toFixed()).toBe("0.30");
  });

  it("rejects currency mismatch", () => {
    expect(() => Money.from("1", "GHS").add(Money.from("1", "SEK"))).toThrow(/mismatch/);
  });
});

describe("formatMoney", () => {
  it("renders GHS with the cedi mark", () => {
    expect(formatMoney("84240.32", "GHS")).toContain("84,240.32");
    expect(formatMoney("84240.32", "GHS")).toMatch(/GH₵/);
  });
});

describe("compactAmount", () => {
  it("shortens large market-cap figures", () => {
    expect(compactAmount("1800000000")).toBe("1.8bn");
  });
});
