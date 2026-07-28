import { describe, expect, it } from "vitest";
import {
  ETOUGH_ROCKET_HEADER_GUARD_PORTED,
  calcToughRocketTimeD,
  calcToughRocketTimeD2,
} from "../src/simulation/ToughRocketEffect";

describe("tough rocket effect", () => {
  it("adapts the etoughrocket.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/ToughRocketEffect");
    const secondImport = await import("../src/simulation/ToughRocketEffect");

    expect(ETOUGH_ROCKET_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ETOUGH_ROCKET_HEADER_GUARD_PORTED).toBe(
      firstImport.ETOUGH_ROCKET_HEADER_GUARD_PORTED,
    );
  });

  it("ports etoughrocket.cpp timing thresholds from missile speed", () => {
    expect(calcToughRocketTimeD(250)).toBe(0.024);
    expect(calcToughRocketTimeD2(250)).toBe(0.032);
  });
});
