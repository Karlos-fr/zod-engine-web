import { describe, expect, it } from "vitest";
import { ETOUGH_MUSHROOM_HEADER_GUARD_PORTED } from "../src/simulation/ToughMushroomEffect";

describe("tough mushroom effect", () => {
  it("adapts the etoughmushroom.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/ToughMushroomEffect");
    const secondImport = await import("../src/simulation/ToughMushroomEffect");

    expect(ETOUGH_MUSHROOM_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ETOUGH_MUSHROOM_HEADER_GUARD_PORTED).toBe(
      firstImport.ETOUGH_MUSHROOM_HEADER_GUARD_PORTED,
    );
  });
});
