import { describe, expect, it } from "vitest";
import {
  FloodFillNode,
  lockList,
  type MapPathfindingTile,
  type PathFindingEngineReference,
  PathTileType,
  unlockList,
} from "../src/world/navigation/NavigationTypes";

describe("navigation types", () => {
  it("ports the pathfinding engine forward declaration as an opaque reference", () => {
    const engine = { nextThreadId: 1 };
    const acceptEngine = (
      value: PathFindingEngineReference,
    ): PathFindingEngineReference => value;

    expect(acceptEngine(engine)).toBe(engine);
  });

  it("ports flood-fill node construction", () => {
    expect(new FloodFillNode(3, 7)).toEqual({ x: 3, y: 7 });
  });

  it("ports pathfinding tile types", () => {
    expect(PathTileType.Normal).toBe(0);
    expect(PathTileType.Impassable).toBe(1);
    expect(PathTileType.Water).toBe(2);
    expect(PathTileType.Road).toBe(3);
    expect(PathTileType.Max).toBe(4);
  });

  it("allows list locking on the single simulation thread", () => {
    expect(() => lockList()).not.toThrow();
    expect(() => unlockList()).not.toThrow();
  });

  it("ports map pathfinding tile weights", () => {
    const tile: MapPathfindingTile = {
      sideWeight: 10,
      diagonalWeight: 14,
      passable: true,
    };

    expect(tile).toEqual({
      sideWeight: 10,
      diagonalWeight: 14,
      passable: true,
    });
  });
});
