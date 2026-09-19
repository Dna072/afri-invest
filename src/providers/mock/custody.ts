import type { CustodyProvider } from "@/providers/types";

export class MockCustodyProvider implements CustodyProvider {
  async getPositions() {
    return [];
  }

  async getCash() {
    return "0";
  }
}
