import { describe, expect, it } from "vitest";
import {
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
});
