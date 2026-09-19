import { describe, expect, it } from "vitest";
import { summarisePortfolio } from "@/domains/portfolio/calc";
import { Money } from "@/lib/money";

describe("portfolio", () => {
  it("derives value from positions and cash", () => {
    const summary = summarisePortfolio(
      [
        {
          assetId: "1",
          symbol: "MTNGH",
          name: "MTN",
          quantity: "10",
          averageCost: "3",
          costBasis: "30",
          currentPrice: "3.42",
          currency: "GHS",
        },
      ],
      [{ currency: "GHS", amount: "5" }],
      "GHS",
      (m) => m,
    );
    expect(summary.holdingsValue.toFixed()).toBe("34.20");
    expect(summary.total.toFixed()).toBe("39.20");
    expect(summary.cashValue.eq(Money.from("5", "GHS"))).toBe(true);
  });
});
