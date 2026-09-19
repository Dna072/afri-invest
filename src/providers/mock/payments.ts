import { nanoid } from "nanoid";
import type { PaymentIntent, PaymentProvider, PaymentStatus, PaymentTransaction, Payout } from "@/providers/types";

const store = new Map<string, PaymentIntent>();

export class MockPaymentProvider implements PaymentProvider {
  async createPaymentIntent(input: {
    amount: string;
    currency: PaymentIntent["currency"];
    method: string;
    idempotencyKey: string;
  }): Promise<PaymentIntent> {
    const existing = [...store.values()].find((p) => p.id === input.idempotencyKey);
    if (existing) return existing;
    const fail = input.method === "fail" || input.amount === "0";
    const intent: PaymentIntent = {
      id: `pay_${nanoid(12)}`,
      status: fail ? "failed" : "processing",
      amount: input.amount,
      currency: input.currency,
      method: input.method,
    };
    store.set(intent.id, intent);
    return intent;
  }

  async getPaymentStatus(id: string): Promise<PaymentStatus> {
    const found = store.get(id);
    return { id, status: found?.status ?? "failed" };
  }

  async createPayout(input: {
    amount: string;
    currency: PaymentIntent["currency"];
    destination: string;
    idempotencyKey: string;
  }): Promise<Payout> {
    return {
      id: `payout_${nanoid(12)}`,
      status: "processing",
      amount: input.amount,
      currency: input.currency,
    };
  }

  async getTransaction(id: string): Promise<PaymentTransaction> {
    const found = store.get(id);
    return {
      id,
      status: found?.status ?? "failed",
      amount: found?.amount ?? "0",
      currency: found?.currency ?? "GHS",
    };
  }

  complete(id: string) {
    const found = store.get(id);
    if (found) found.status = "completed";
  }

  fail(id: string) {
    const found = store.get(id);
    if (found) found.status = "failed";
  }

  reverse(id: string) {
    const found = store.get(id);
    if (found) found.status = "reversed";
  }
}
