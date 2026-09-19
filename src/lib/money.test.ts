import { describe, expect, it } from "vitest";
import { Money } from "@/lib/money";

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
