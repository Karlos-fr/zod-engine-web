import { describe, expect, it } from "vitest";
import {
  EMAP_OBJECT_TURRENT_HEADER_GUARD_PORTED,
  initMapObjectTurrentEffect,
  renderMapObjectTurrentEffect,
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

  it("replaces EMapObjectTurrent DoRender with transformed centered object command", () => {
    const transforms: Array<[string, number]> = [];
    const objectImages = Array.from({ length: MAP_ITEM_TYPE_COUNT }, (_value, index) => ({
      id: `map-object-${index}`,
      setAngle: (angle: number) => transforms.push(["angle", angle]),
      setSize: (size: number) => transforms.push(["size", size]),
    }));
    const calls: unknown[] = [];

    const command = renderMapObjectTurrentEffect(
      {
        killMe: false,
        x: 120,
        y: 160,
        objectIndex: 5,
        angle: 42,
        size: 1.25,
        objectImages,
      },
      {
        renderZSurface: (surface, x, y, renderHit, aboutCenter) => {
          calls.push({ surface, x, y, renderHit, aboutCenter });
          return {
            surface,
            x: x - 20,
            y: y - 28,
            renderHit,
            aboutCenter,
          };
        },
      },
    );

    expect(command).toEqual({
      surface: objectImages[5],
      x: 100,
      y: 132,
      renderHit: false,
      aboutCenter: true,
    });
    expect(transforms).toEqual([
      ["angle", 42],
      ["size", 1.25],
    ]);
    expect(calls).toEqual([
      {
        surface: objectImages[5],
        x: 120,
        y: 160,
        renderHit: false,
        aboutCenter: true,
      },
    ]);
  });

  it("replaces EMapObjectTurrent DoRender as no command for killed or missing image", () => {
    const objectImages = [{ setAngle: () => undefined, setSize: () => undefined }];
    const zmap = {
      renderZSurface: () => {
        throw new Error("renderZSurface should not be called");
      },
    };

    expect(
      renderMapObjectTurrentEffect(
        {
          killMe: true,
          x: 0,
          y: 0,
          objectIndex: 0,
          angle: 0,
          size: 1,
          objectImages,
        },
        zmap,
      ),
    ).toBeNull();
    expect(
      renderMapObjectTurrentEffect(
        {
          killMe: false,
          x: 0,
          y: 0,
          objectIndex: 99,
          angle: 0,
          size: 1,
          objectImages,
        },
        zmap,
      ),
    ).toBeNull();
  });
});
