import { describe, expect, it } from "vitest";
import { angleFromLocation } from "../src/rendering/RenderingMath";

describe("rendering math", () => {
  it("replaces AngleFromLoc zero-vector handling", () => {
    expect(angleFromLocation(0, 0)).toBe(-1);
    expect(angleFromLocation(0.000001, -0.000001)).toBe(-1);
  });

  it("converts axis-aligned vectors to degrees", () => {
    expect(angleFromLocation(1, 0)).toBe(0);
    expect(angleFromLocation(0, 1)).toBe(90);
    expect(angleFromLocation(-1, 0)).toBe(180);
    expect(angleFromLocation(0, -1)).toBe(269);
  });
});
