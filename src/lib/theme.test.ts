import { describe, expect, it } from "vitest";
import { isAppearance, isPalette, resolveDark } from "./theme";

describe("theme", () => {
  it("accepts stored appearance and palette values", () => {
    expect(isAppearance("dark")).toBe(true);
    expect(isAppearance("neon")).toBe(false);
    expect(isPalette("forest")).toBe(true);
    expect(isPalette("pink")).toBe(false);
  });

  it("resolves system appearance from the OS preference", () => {
    expect(resolveDark("light", true)).toBe(false);
    expect(resolveDark("dark", false)).toBe(true);
    expect(resolveDark("system", true)).toBe(true);
    expect(resolveDark("system", false)).toBe(false);
  });
});
