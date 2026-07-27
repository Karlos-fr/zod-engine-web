import { describe, expect, it } from "vitest";
import { ZOLISTS_HEADER_GUARD_PORTED } from "../src/simulation/ObjectLists";

describe("object lists", () => {
  it("adapts the zolists.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/ObjectLists");
    const secondImport = await import("../src/simulation/ObjectLists");

    expect(ZOLISTS_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZOLISTS_HEADER_GUARD_PORTED).toBe(
      firstImport.ZOLISTS_HEADER_GUARD_PORTED,
    );
  });
});
