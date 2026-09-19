import type { MarketDataProvider, MarketQuote } from "@/providers/types";

export class MockMarketDataProvider implements MarketDataProvider {
  async getQuote(symbol: string): Promise<MarketQuote> {
    return { symbol, price: "0", changePercent: "0", asOf: new Date() };
  }

  async getHistory() {
    return [];
  }

  async getMarketStatus() {
    return { open: true };
  }

  async getCorporateActions() {
    return [];
  }
}
