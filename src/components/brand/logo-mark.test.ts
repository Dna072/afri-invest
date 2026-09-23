import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { AFRICA_CLIP_PATH } from "@/data/africa";
import {
  AFRICA_ARROW_PATH,
  AFRICA_LOGO_ART,
  AFRICA_LOGO_PATH,
  AFRICA_LOGO_VIEWBOX,
  MADAGASCAR_LOGO_PATH,
} from "./logo-mark";

describe("Africa Invest logo mark", () => {
  it("uses the attached artwork, not GeoJSON", () => {
    const source = readFileSync(new URL("./logo-mark.tsx", import.meta.url), "utf8");

    expect(source).not.toMatch(/from ["']@\/data\/africa["']/);
    expect(source).not.toMatch(/africa-countries\.json|AFRICA_CLIP_PATH/);
    expect(AFRICA_LOGO_VIEWBOX).toBe("0 0 183 150");
    expect(AFRICA_LOGO_ART).toBe("/brand/africa-invest-mark.png");
    expect(AFRICA_LOGO_PATH.startsWith("M52.33")).toBe(true);
    expect(MADAGASCAR_LOGO_PATH.startsWith("M155.33")).toBe(true);
    expect(AFRICA_ARROW_PATH.startsWith("M64 99")).toBe(true);
    expect(AFRICA_LOGO_PATH).not.toEqual(AFRICA_CLIP_PATH);
    expect(AFRICA_LOGO_PATH).not.toMatch(/M92 26C128 4/);
    expect(AFRICA_LOGO_PATH.length).toBeGreaterThan(400);
    expect(AFRICA_LOGO_PATH.length).toBeLessThan(5_000);
    expect(AFRICA_CLIP_PATH.length).toBeGreaterThan(10_000);
  });
});
