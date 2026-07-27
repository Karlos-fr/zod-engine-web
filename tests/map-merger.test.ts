import { describe, expect, it } from "vitest";
import { MapMergeDirection } from "../src/world/MapMerger";

describe("map merger", () => {
  it("ports direction numeric values", () => {
    expect(MapMergeDirection.Vertical).toBe(0);
    expect(MapMergeDirection.Horizontal).toBe(1);
  });
});
