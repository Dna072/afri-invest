import type { CurrencyCode } from "@/types/enums";

export interface IdentityCheckInput {
  userId: string;
  firstName: string;
  lastName: string;
  country: string;
}

export interface VerificationResult {
  sessionId: string;
  status: "pass" | "review" | "fail";
  checks: Array<{ category: string; result: "PASS" | "REVIEW" | "FAIL"; notes?: string }>;
}

export interface IdentityProvider {
  startVerification(input: IdentityCheckInput): Promise<VerificationResult>;
  getSession(sessionId: string): Promise<VerificationResult>;
}

export interface PaymentIntent {
  id: string;
  status: "initiated" | "pending" | "processing" | "completed" | "failed" | "reversed";
  amount: string;
  currency: CurrencyCode;
  method: string;
}

export interface PaymentStatus {
  id: string;
  status: PaymentIntent["status"];
}

export interface Payout {
  id: string;
  status: PaymentIntent["status"];
  amount: string;
  currency: CurrencyCode;
}

export interface PaymentTransaction {
  id: string;
  status: PaymentIntent["status"];
  amount: string;
  currency: CurrencyCode;
}

export interface PaymentProvider {
  createPaymentIntent(input: {
    amount: string;
    currency: CurrencyCode;
    method: string;
    idempotencyKey: string;
    metadata?: Record<string, string>;
  }): Promise<PaymentIntent>;
  getPaymentStatus(id: string): Promise<PaymentStatus>;
  createPayout(input: {
    amount: string;
    currency: CurrencyCode;
    destination: string;
    idempotencyKey: string;
  }): Promise<Payout>;
  getTransaction(id: string): Promise<PaymentTransaction>;
}

export interface FxQuoteResult {
  providerQuoteId: string;
  baseCurrency: CurrencyCode;
  quoteCurrency: CurrencyCode;
  sourceRate: string;
  expiresAt: Date;
}

export interface FXProvider {
  getRate(base: CurrencyCode, quote: CurrencyCode): Promise<{ sourceRate: string; asOf: Date }>;
  createQuote(input: {
    base: CurrencyCode;
    quote: CurrencyCode;
    amount: string;
  }): Promise<FxQuoteResult>;
  executeQuote(providerQuoteId: string): Promise<{ status: "completed" | "failed" }>;
}

export interface BrokerOrderRequest {
  accountRef: string;
  symbol: string;
  side: "buy" | "sell";
  quantity: string;
  orderType: "market" | "limit";
  limitPrice?: string;
  idempotencyKey: string;
}

export interface BrokerOrderResult {
  providerRef: string;
  status: "accepted" | "rejected" | "filled" | "partially_filled";
  filledQuantity: string;
  averagePrice: string;
  reason?: string;
}

export interface BrokerProvider {
  placeOrder(input: BrokerOrderRequest): Promise<BrokerOrderResult>;
  getOrder(providerRef: string): Promise<BrokerOrderResult>;
  cancelOrder(providerRef: string): Promise<{ status: "cancelled" | "rejected" }>;
}

export interface CustodyPosition {
  symbol: string;
  quantity: string;
}

export interface CustodyProvider {
  getPositions(accountRef: string): Promise<CustodyPosition[]>;
  getCash(accountRef: string, currency: CurrencyCode): Promise<string>;
}

export interface MarketQuote {
  symbol: string;
  price: string;
  changePercent: string;
  asOf: Date;
}

export interface MarketDataProvider {
  getQuote(symbol: string): Promise<MarketQuote>;
  getHistory(symbol: string, range: string): Promise<Array<{ ts: Date; close: string }>>;
  getMarketStatus(marketId: string): Promise<{ open: boolean; nextOpen?: Date }>;
  getCorporateActions(symbol: string): Promise<Array<{ type: string; description: string }>>;
}

export interface NotificationMessage {
  userId: string;
  channel: "in_app" | "email" | "push" | "sms";
  title: string;
  body: string;
  category: string;
}

export interface NotificationProvider {
  send(message: NotificationMessage): Promise<{ id: string; status: "queued" | "sent" }>;
}

export interface DocumentProvider {
  store(input: { key: string; contentType: string; body: string }): Promise<{ storageKey: string }>;
  get(storageKey: string): Promise<{ body: string; contentType: string }>;
}

export interface TaxProvider {
  estimateWithholding(input: {
    country: string;
    amount: string;
    currency: CurrencyCode;
  }): Promise<{ withholding: string }>;
}

export interface GlobalBrokerProvider {
  openAccount(input: { userId: string }): Promise<{ accountRef: string }>;
  placeOrder(input: BrokerOrderRequest): Promise<BrokerOrderResult>;
  getPositions(accountRef: string): Promise<CustodyPosition[]>;
}
