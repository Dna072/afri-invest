import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { AFRICA_CLIP_PATH } from "@/data/africa";
import { AFRICA_ARROW_PATH, AFRICA_LOGO_PATH, AFRICA_LOGO_VIEWBOX, MADAGASCAR_LOGO_PATH } from "./logo-mark";

describe("Africa Invest logo mark", () => {
  it("uses the supplied SVG mark, not GeoJSON", () => {
    const source = readFileSync(new URL("./logo-mark.tsx", import.meta.url), "utf8");

    expect(source).not.toMatch(/from ["']@\/data\/africa["']/);
    expect(source).not.toMatch(/africa-countries\.json|AFRICA_CLIP_PATH/);
    expect(AFRICA_LOGO_VIEWBOX).toBe("0 0 216 232");
    expect(AFRICA_LOGO_PATH.startsWith("M77.58")).toBe(true);
    expect(MADAGASCAR_LOGO_PATH.startsWith("M185.66")).toBe(true);
    expect(AFRICA_ARROW_PATH.startsWith("M66 136")).toBe(true);
    expect(source).toMatch(/#2f9e3a|#1e7a2c|#7ed957/);
    expect(AFRICA_LOGO_PATH).not.toEqual(AFRICA_CLIP_PATH);
    expect(AFRICA_LOGO_PATH).not.toMatch(/M92 26C128 4/);
    expect(AFRICA_LOGO_PATH.length).toBeGreaterThan(800);
    expect(AFRICA_LOGO_PATH.length).toBeLessThan(5_000);
    expect(AFRICA_CLIP_PATH.length).toBeGreaterThan(10_000);
  });
});
