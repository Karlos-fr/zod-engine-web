import { describe, expect, it } from "vitest";
import {
  isRockDestroyableImpassable,
  OROCK_HEADER_GUARD_PORTED,
} from "../src/simulation/RockObject";

describe("rock object", () => {
  it("adapts the orock.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/RockObject");
    const secondImport = await import("../src/simulation/RockObject");

    expect(OROCK_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.OROCK_HEADER_GUARD_PORTED).toBe(
      firstImport.OROCK_HEADER_GUARD_PORTED,
    );
  });

  it("ports IsDestroyableImpass as a destroyable rock impassable marker", () => {
    expect(isRockDestroyableImpassable()).toBe(true);
  });
});
