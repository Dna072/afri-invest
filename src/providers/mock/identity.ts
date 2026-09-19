import { nanoid } from "nanoid";
import type { IdentityCheckInput, IdentityProvider, VerificationResult } from "@/providers/types";

const sessions = new Map<string, VerificationResult>();

export class MockIdentityProvider implements IdentityProvider {
  async startVerification(input: IdentityCheckInput): Promise<VerificationResult> {
    const sessionId = `kyc_${nanoid(10)}`;
    const fail = input.lastName.toLowerCase().includes("fail");
    const review = input.lastName.toLowerCase().includes("review");
    const status = fail ? "fail" : review ? "review" : "pass";
    const result: VerificationResult = {
      sessionId,
      status,
      checks: [
        { category: "identity", result: fail ? "FAIL" : "PASS" },
        { category: "address", result: "PASS" },
        { category: "pep", result: review ? "REVIEW" : "PASS" },
        { category: "sanctions", result: fail ? "FAIL" : "PASS" },
        { category: "risk", result: review ? "REVIEW" : "PASS" },
      ],
    };
    sessions.set(sessionId, result);
    return result;
  }

  async getSession(sessionId: string): Promise<VerificationResult> {
    const found = sessions.get(sessionId);
    if (!found) {
      return { sessionId, status: "review", checks: [] };
    }
    return found;
  }
}
