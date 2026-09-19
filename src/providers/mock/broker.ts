import { nanoid } from "nanoid";
import type { BrokerOrderRequest, BrokerOrderResult, BrokerProvider } from "@/providers/types";

const orders = new Map<string, BrokerOrderResult>();

export class MockBrokerProvider implements BrokerProvider {
  async placeOrder(input: BrokerOrderRequest): Promise<BrokerOrderResult> {
    const reject = input.symbol.includes("REJECT") || input.quantity === "0";
    const result: BrokerOrderResult = reject
      ? {
          providerRef: `brk_${nanoid(10)}`,
          status: "rejected",
          filledQuantity: "0",
          averagePrice: "0",
          reason: "Sandbox broker rejected the order for demonstration.",
        }
      : {
          providerRef: `brk_${nanoid(10)}`,
          status: "filled",
          filledQuantity: input.quantity,
          averagePrice: input.limitPrice ?? "0",
          reason: undefined,
        };
    orders.set(result.providerRef, result);
    return result;
  }

  async getOrder(providerRef: string) {
    const found = orders.get(providerRef);
    if (!found) {
      return {
        providerRef,
        status: "rejected" as const,
        filledQuantity: "0",
        averagePrice: "0",
        reason: "Unknown",
      };
    }
    return found;
  }

  async cancelOrder(providerRef: string) {
    const found = orders.get(providerRef);
    if (!found) return { status: "rejected" as const };
    found.status = "rejected";
    return { status: "cancelled" as const };
  }
}
