import { describe, expect, it } from "vitest";
import { getCenterCoordinates } from "../src/simulation/entities/EntityGeometry";

describe("entity geometry", () => {
  it("returns the entity center coordinates", () => {
    expect(getCenterCoordinates(12, 34)).toEqual({ x: 12, y: 34 });
  });
});
