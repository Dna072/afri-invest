import { nanoid } from "nanoid";
import Decimal from "decimal.js";
import type { CurrencyCode } from "@/types/enums";
import type { FXProvider, FxQuoteResult } from "@/providers/types";

export const SANDBOX_FX_RATES: Record<string, string> = {
  "SEK/GHS": "1.1640",
  "USD/GHS": "10.85",
  "EUR/GHS": "11.72",
  "GBP/GHS": "13.91",
  "NGN/GHS": "0.0072",
  "KES/GHS": "0.084",
  "ZAR/GHS": "0.62",
  "GHS/SEK": "0.8591",
  "GHS/USD": "0.0922",
  "GHS/EUR": "0.0853",
  "GHS/GBP": "0.0719",
};

export class MockFXProvider implements FXProvider {
  async getRate(base: CurrencyCode, quote: CurrencyCode) {
    if (base === quote) return { sourceRate: "1", asOf: new Date() };
    const direct = SANDBOX_FX_RATES[`${base}/${quote}`];
    if (direct) return { sourceRate: direct, asOf: new Date() };
    const inverse = SANDBOX_FX_RATES[`${quote}/${base}`];
    if (inverse) {
      return { sourceRate: new Decimal(1).div(inverse).toFixed(6), asOf: new Date() };
    }
    return { sourceRate: "1.0000", asOf: new Date() };
  }

  async createQuote(input: { base: CurrencyCode; quote: CurrencyCode; amount: string }): Promise<FxQuoteResult> {
    const rate = await this.getRate(input.base, input.quote);
    return {
      providerQuoteId: `fxq_${nanoid(12)}`,
      baseCurrency: input.base,
      quoteCurrency: input.quote,
      sourceRate: rate.sourceRate,
      expiresAt: new Date(Date.now() + 60_000),
    };
  }

  async executeQuote() {
    return { status: "completed" as const };
  }
}
