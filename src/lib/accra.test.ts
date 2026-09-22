import { describe, expect, it } from "vitest";
import { getAccraClock } from "./accra";

describe("getAccraClock", () => {
  it("marks a Wednesday mid-session as inside Accra hours", () => {
    // 2026-09-16 12:00 UTC = Wednesday 12:00 Accra
    const clock = getAccraClock(new Date("2026-09-16T12:00:00Z"));
    expect(clock.isWeekday).toBe(true);
    expect(clock.insideHours).toBe(true);
    expect(clock.time).toBe("12:00");
  });

  it("marks Sunday as after hours", () => {
    const clock = getAccraClock(new Date("2026-09-20T12:00:00Z"));
    expect(clock.isWeekday).toBe(false);
    expect(clock.insideHours).toBe(false);
  });

  it("marks 08:00 Accra as before the modelled GSE open", () => {
    const clock = getAccraClock(new Date("2026-09-16T08:00:00Z"));
    expect(clock.insideHours).toBe(false);
    expect(clock.label).toBe("Outside Accra hours");
  });
});
