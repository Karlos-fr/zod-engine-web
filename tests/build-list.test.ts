import { describe, expect, it } from "vitest";
import { ZBUILD_LIST_HEADER_GUARD_PORTED } from "../src/simulation/entities/BuildList";

describe("build list", () => {
  it("adapts the zbuildlist.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/entities/BuildList");
    const secondImport = await import("../src/simulation/entities/BuildList");

    expect(ZBUILD_LIST_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZBUILD_LIST_HEADER_GUARD_PORTED).toBe(
      firstImport.ZBUILD_LIST_HEADER_GUARD_PORTED,
    );
  });
});
