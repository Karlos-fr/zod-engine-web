import { describe, expect, it, vi } from "vitest";
import { GameMap } from "../src/world/GameMap";

describe("GameMap", () => {
  it("ports ZMap::RebuildRegions as a pathfinding-region rebuild delegate", () => {
    const rebuildRegions = vi.fn();
    const setImpassable = vi.fn();
    const withinImpassable = vi.fn(() => ({ within: false, stopX: 0, stopY: 0 }));
    const map = new GameMap({
      width: 1,
      height: 1,
      tiles: [{ terrain: "plain" }],
      pathFinder: { rebuildRegions, setImpassable, withinImpassable },
    });

    map.rebuildRegions();

    expect(rebuildRegions).toHaveBeenCalledOnce();
  });

  it("ports ZMap::WithinImpassable as a pathfinding-area query delegate", () => {
    const result = { within: true, stopX: 4, stopY: 5 };
    const rebuildRegions = vi.fn();
    const setImpassable = vi.fn();
    const withinImpassable = vi.fn(() => result);
    const map = new GameMap({
      width: 8,
      height: 8,
      tiles: Array.from({ length: 64 }, () => ({ terrain: "plain" })),
      pathFinder: { rebuildRegions, setImpassable, withinImpassable },
    });

    expect(map.withinImpassable(1, 2, 3, 4, true)).toBe(result);
    expect(withinImpassable).toHaveBeenCalledWith(1, 2, 3, 4, true);
  });

  it("ports ZMap::SetImpassable as a pathfinding blockage update delegate", () => {
    const rebuildRegions = vi.fn();
    const setImpassable = vi.fn();
    const withinImpassable = vi.fn(() => ({ within: false, stopX: 0, stopY: 0 }));
    const map = new GameMap({
      width: 2,
      height: 2,
      tiles: Array.from({ length: 4 }, () => ({ terrain: "plain" })),
      pathFinder: { rebuildRegions, setImpassable, withinImpassable },
    });

    map.setImpassable(1, 2);
    map.setImpassable(3, 4, false, true);

    expect(setImpassable).toHaveBeenNthCalledWith(1, 1, 2, true, false);
    expect(setImpassable).toHaveBeenNthCalledWith(2, 3, 4, false, true);
  });
});
