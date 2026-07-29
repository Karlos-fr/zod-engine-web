import { describe, expect, it } from "vitest";
import { createWaypointLineMarkers } from "../src/rendering/WaypointLineRendering";

describe("WaypointLineRendering", () => {
  it("builds SDL-style waypoint line marker rectangles", () => {
    expect(createWaypointLineMarkers(0, 0, 8, 0, 10, 10)).toEqual([
      { x: 0, y: 0, width: 2, height: 2, gray: 170 },
      { x: 4, y: 0, width: 2, height: 2, gray: 170 },
      { x: 8, y: 0, width: 2, height: 2, gray: 170 },
    ]);
  });

  it("applies waypoint animation offset and clips to the view", () => {
    expect(createWaypointLineMarkers(0, 0, 12, 0, 10, 9, 2)).toEqual([
      { x: 2, y: 0, width: 2, height: 2, gray: 170 },
      { x: 6, y: 0, width: 2, height: 2, gray: 170 },
    ]);
  });

  it("does not build markers for zero-length lines", () => {
    expect(createWaypointLineMarkers(5, 5, 5, 5, 10, 10)).toEqual([]);
  });
});
