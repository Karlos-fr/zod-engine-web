import { describe, expect, it } from "vitest";
import { createEmptyMapBasics, resetMapBasics } from "../src/world/MapBasics";

describe("MapBasics", () => {
  it("matches the upstream map_basics clear defaults", () => {
    expect(createEmptyMapBasics()).toEqual({
      width: 0,
      height: 0,
      name: "",
      playerCount: 0,
      objectCount: 0,
      terrainType: 0,
      zoneCount: 0,
    });
  });

  it("can reset an existing basics object", () => {
    const basics = {
      width: 64,
      height: 64,
      name: "example",
      playerCount: 4,
      objectCount: 12,
      terrainType: 2,
      zoneCount: 8,
    };

    resetMapBasics(basics);

    expect(basics).toEqual(createEmptyMapBasics());
  });
});
