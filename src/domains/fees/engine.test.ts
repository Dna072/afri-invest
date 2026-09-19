import { describe, expect, it } from "vitest";
import { tradingFee } from "@/domains/fees/engine";
import { Money } from "@/lib/money";

describe("fees", () => {
  it("calculates bps on principal", () => {
    const quote = tradingFee(Money.from("5000", "GHS"), "50");
    expect(quote.total.toFixed()).toBe("25.00");
    expect(quote.grandTotal.toFixed()).toBe("5025.00");
  });
});
