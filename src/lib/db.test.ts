import { describe, expect, it } from "vitest";
import { withPoolLimits } from "./db";

describe("withPoolLimits", () => {
  it("leaves SQLite URLs unchanged", () => {
    expect(withPoolLimits("file:./dev.db")).toBe("file:./dev.db");
  });

  it("adds Cloud Run connection caps to Postgres URLs", () => {
    const url = withPoolLimits("postgresql://africa:secret@localhost/africa_invest?host=/cloudsql/p:r:i");
    expect(url).toContain("connection_limit=3");
    expect(url).toContain("pool_timeout=20");
    expect(url).toContain("host=%2Fcloudsql%2Fp%3Ar%3Ai");
  });

  it("does not override an explicit connection_limit", () => {
    const url = withPoolLimits("postgresql://africa:secret@localhost/africa_invest?connection_limit=2");
    expect(url).toContain("connection_limit=2");
    expect(url).not.toContain("connection_limit=3");
  });
});
