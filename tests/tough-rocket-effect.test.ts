import { describe, expect, it } from "vitest";
import { ETOUGH_ROCKET_HEADER_GUARD_PORTED } from "../src/simulation/ToughRocketEffect";

describe("tough rocket effect", () => {
  it("adapts the etoughrocket.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/ToughRocketEffect");
    const secondImport = await import("../src/simulation/ToughRocketEffect");

    expect(ETOUGH_ROCKET_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ETOUGH_ROCKET_HEADER_GUARD_PORTED).toBe(
      firstImport.ETOUGH_ROCKET_HEADER_GUARD_PORTED,
    );
  });
});
