import { describe, expect, it } from "vitest";
import { OROCKETS_HEADER_GUARD_PORTED } from "../src/simulation/RocketsObject";

describe("rockets object", () => {
  it("adapts the orockets.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/RocketsObject");
    const secondImport = await import("../src/simulation/RocketsObject");

    expect(OROCKETS_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.OROCKETS_HEADER_GUARD_PORTED).toBe(
      firstImport.OROCKETS_HEADER_GUARD_PORTED,
    );
  });
});
