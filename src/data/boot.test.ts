import { describe, expect, it } from "vitest";
import { BOOT_STAGES, bootProgressAt, bootStageAt } from "./boot";

describe("boot stages", () => {
  it("walks the four logo shots", () => {
    expect(BOOT_STAGES).toHaveLength(4);
    expect(bootStageAt(0, 4000).label).toMatch(/ready/i);
    expect(bootStageAt(1600, 4000).label).toMatch(/markets/i);
    expect(bootStageAt(2800, 4000).label).toMatch(/opportunit/i);
    expect(bootStageAt(3900, 4000).label).toMatch(/almost/i);
    expect(bootProgressAt(4000, 4000)).toBeGreaterThanOrEqual(95);
  });
});
