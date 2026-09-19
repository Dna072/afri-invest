import Decimal from "decimal.js";
import type { TaxProvider } from "@/providers/types";

export class MockTaxProvider implements TaxProvider {
  async estimateWithholding(input: { country: string; amount: string }) {
    const rate = input.country === "GH" ? "0.08" : "0.15";
    const withholding = new Decimal(input.amount).times(rate).toFixed(2);
    return { withholding };
  }
}
