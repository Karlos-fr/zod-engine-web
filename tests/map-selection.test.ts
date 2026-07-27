import { describe, expect, it } from "vitest";
import { GMM_SELECT_MAP_HEADER_GUARD_PORTED } from "../src/world/MapSelection";

describe("map selection", () => {
  it("adapts the gmm_select_map header guard to module boundaries", async () => {
    const firstImport = await import("../src/world/MapSelection");
    const secondImport = await import("../src/world/MapSelection");

    expect(GMM_SELECT_MAP_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.GMM_SELECT_MAP_HEADER_GUARD_PORTED).toBe(
      firstImport.GMM_SELECT_MAP_HEADER_GUARD_PORTED,
    );
  });
});
