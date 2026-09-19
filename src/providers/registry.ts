import { env } from "@/lib/env";
import type {
  BrokerProvider,
  CustodyProvider,
  DocumentProvider,
  FXProvider,
  IdentityProvider,
  MarketDataProvider,
  NotificationProvider,
  PaymentProvider,
  TaxProvider,
} from "@/providers/types";
import { MockBrokerProvider } from "@/providers/mock/broker";
import { MockCustodyProvider } from "@/providers/mock/custody";
import { MockDocumentProvider } from "@/providers/mock/documents";
import { MockFXProvider } from "@/providers/mock/fx";
import { MockIdentityProvider } from "@/providers/mock/identity";
import { MockMarketDataProvider } from "@/providers/mock/market-data";
import { MockNotificationProvider } from "@/providers/mock/notifications";
import { MockPaymentProvider } from "@/providers/mock/payments";
import { MockTaxProvider } from "@/providers/mock/tax";

function resolve<T>(name: string, mock: () => T): T {
  if (name === "mock" || name === "sandbox") return mock();
  return mock();
}

export function getProviders() {
  return {
    identity: resolve(env.IDENTITY_PROVIDER, () => new MockIdentityProvider()) as IdentityProvider,
    payment: resolve(env.PAYMENT_PROVIDER, () => new MockPaymentProvider()) as PaymentProvider,
    fx: resolve(env.FX_PROVIDER, () => new MockFXProvider()) as FXProvider,
    broker: resolve(env.BROKER_PROVIDER, () => new MockBrokerProvider()) as BrokerProvider,
    custody: resolve(env.CUSTODY_PROVIDER, () => new MockCustodyProvider()) as CustodyProvider,
    marketData: resolve(env.MARKET_DATA_PROVIDER, () => new MockMarketDataProvider()) as MarketDataProvider,
    notifications: resolve(env.NOTIFICATION_PROVIDER, () => new MockNotificationProvider()) as NotificationProvider,
    documents: resolve(env.DOCUMENT_PROVIDER, () => new MockDocumentProvider()) as DocumentProvider,
    tax: resolve(env.TAX_PROVIDER, () => new MockTaxProvider()) as TaxProvider,
  };
}
