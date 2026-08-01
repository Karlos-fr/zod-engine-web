import { describe, expect, it } from "vitest";
import {
  EMAP_OBJECT_TURRENT_HEADER_GUARD_PORTED,
  initMapObjectTurrentEffect,
  type MapObjectTurrentEffectSpawn,
} from "../src/world/MapObjectTurretEffect";
import { MAP_ITEM_TYPE_COUNT } from "../src/world/WorldConstants";

describe("map object turret effect", () => {
  it("adapts the emapobjectturrent header guard to module boundaries", async () => {
    const firstImport = await import("../src/world/MapObjectTurretEffect");
    const secondImport = await import("../src/world/MapObjectTurretEffect");

    expect(EMAP_OBJECT_TURRENT_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.EMAP_OBJECT_TURRENT_HEADER_GUARD_PORTED).toBe(
      firstImport.EMAP_OBJECT_TURRENT_HEADER_GUARD_PORTED,
    );
  });

  it("ports EMapObjectTurrent Init as no-shadow map item image loading", () => {
    const loadedFilenames = Array.from({ length: MAP_ITEM_TYPE_COUNT }, () => "");
    const state = {
      objectImages: loadedFilenames.map((_, index) => ({
        loadBaseImage(filename: string) {
          loadedFilenames[index] = filename;
        },
      })),
      finishedInit: false,
    };

    initMapObjectTurrentEffect(state);

    expect(state.finishedInit).toBe(true);
    expect(loadedFilenames).toHaveLength(MAP_ITEM_TYPE_COUNT);
    expect(loadedFilenames[0]).toBe("assets/other/map_items/no_shadow0.png");
    expect(loadedFilenames[21]).toBe("assets/other/map_items/no_shadow21.png");
  });

  it("ports EMapObjectTurrent construction arguments as a spawn descriptor", () => {
    const ztime = { now: 45 };
    const spawn: MapObjectTurrentEffectSpawn<typeof ztime> = {
      ztime,
      startX: 12,
      startY: 24,
      targetX: 90,
      targetY: 120,
      offsetTime: 0.5,
      objectIndex: 3,
    };

    expect(spawn).toEqual({
      ztime,
      startX: 12,
      startY: 24,
      targetX: 90,
      targetY: 120,
      offsetTime: 0.5,
      objectIndex: 3,
    });
  });
});
