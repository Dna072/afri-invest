import { describe, expect, it } from "vitest";
import { assertLedgerBalanced } from "@/domains/ledger/invariants";

describe("ledger invariants", () => {
  it("accepts balanced multi-currency journals", () => {
    expect(() =>
      assertLedgerBalanced([
        { accountCode: "a", direction: "debit", amount: "100", currency: "SEK" },
        { accountCode: "b", direction: "credit", amount: "100", currency: "SEK" },
        { accountCode: "c", direction: "debit", amount: "80", currency: "GHS" },
        { accountCode: "d", direction: "credit", amount: "80", currency: "GHS" },
      ]),
    ).not.toThrow();
  });

  it("rejects unbalanced journals", () => {
    expect(() =>
      assertLedgerBalanced([
        { accountCode: "a", direction: "debit", amount: "100", currency: "GHS" },
        { accountCode: "b", direction: "credit", amount: "90", currency: "GHS" },
      ]),
    ).toThrow(/unbalanced/i);
  });
});
