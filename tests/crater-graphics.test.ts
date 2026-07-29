import { describe, expect, it } from "vitest";
import {
  craterExists,
  MAX_KNOWN_CRATERS_PER_TYPE,
  MAX_KNOWN_CRATER_TYPES,
} from "../src/world/CraterGraphics";

describe("crater graphics", () => {
  it("ports the maximum number of known crater types", () => {
    expect(MAX_KNOWN_CRATER_TYPES).toBe(7);
  });

  it("ports the maximum number of crater variants per type", () => {
    expect(MAX_KNOWN_CRATERS_PER_TYPE).toBe(7);
  });

  it("ports ZMapCraterGraphics::CraterExists as bounded small and large count lookup", () => {
    const state = {
      craterSmallCounts: [
        [0, 2, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
      ],
      craterLargeCounts: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 3, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
      ],
    };

    expect(craterExists(state, true, 0, 1)).toBe(true);
    expect(craterExists(state, false, 1, 2)).toBe(true);
    expect(craterExists(state, true, 0, 0)).toBe(false);
    expect(craterExists(state, false, 0, 1)).toBe(false);
    expect(craterExists(state, true, -1, 1)).toBe(false);
    expect(craterExists(state, true, 5, 1)).toBe(false);
    expect(craterExists(state, true, 0, -1)).toBe(false);
    expect(craterExists(state, true, 0, MAX_KNOWN_CRATER_TYPES)).toBe(false);
  });
});
