import { describe, expect, it } from "vitest";
import {
  AFRICA_CLIP_PATH,
  AFRICA_COUNTRIES,
  countryByIso2,
  exchangeNote,
  formatPopulation,
  marketStatusLabel,
  taxResidenceNote,
} from "./africa";

describe("africa map data", () => {
  it("projects all 54 countries from the GeoJSON", () => {
    expect(AFRICA_COUNTRIES).toHaveLength(54);
    expect(AFRICA_CLIP_PATH.length).toBeGreaterThan(10_000);
  });

  it("marks Ghana as the pilot market with a usable path", () => {
    const ghana = countryByIso2("GH");
    expect(ghana?.name).toBe("Ghana");
    expect(ghana?.status).toBe("pilot");
    expect(ghana?.path.startsWith("M")).toBe(true);
    expect(exchangeNote("GH")).toMatch(/Ghana Stock Exchange/);
    expect(marketStatusLabel("pilot")).toBe("Pilot");
  });

  it("explains tax by country of residence", () => {
    expect(taxResidenceNote("Kenya")).toMatch(/Kenya/);
    expect(formatPopulation(27_499_924)).toBe("27m");
  });
});
