import { describe, expect, it } from "vitest";
import {
  CRAWL_DISTANCE,
  TICKS_UNTIL_PATHFINDING_PAUSE,
} from "../src/world/navigation/NavigationConstants";

describe("navigation constants", () => {
  it("ports the cooperative pathfinding pause interval", () => {
    expect(TICKS_UNTIL_PATHFINDING_PAUSE).toBe(90);
  });

  it("ports the pathfinding crawl distance", () => {
    expect(CRAWL_DISTANCE).toBe(4);
  });
});
