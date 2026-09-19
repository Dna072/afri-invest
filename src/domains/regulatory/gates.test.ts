import { describe, expect, it } from "vitest";
import { assessStage, assertCanPass } from "@/domains/regulatory/gates";

describe("stage gates", () => {
  it("blocks pass when mandatory gates remain", () => {
    const gates = [
      { id: "1", label: "Broker identified", mandatory: true, complete: true },
      { id: "2", label: "Custody identified", mandatory: true, complete: false },
    ];
    expect(assessStage(gates).canPass).toBe(false);
    expect(assertCanPass(gates).allowed).toBe(false);
    expect(assertCanPass(gates, true).allowed).toBe(true);
  });
});
