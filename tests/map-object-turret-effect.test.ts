import { describe, expect, it } from "vitest";
import { SoundEngineSound } from "../src/audio/AudioService";
import {
  EMAP_OBJECT_TURRENT_HEADER_GUARD_PORTED,
  endMapObjectTurrentExplosion,
  initMapObjectTurrentEffect,
  processMapObjectTurrentEffect,
  renderMapObjectTurrentEffect,
  type MapObjectTurrentEndExplosionSpawn,
  type MapObjectTurrentEffectSpawn,
  type MapObjectTurrentProcessState,
  type MapObjectTurrentRestrictedSoundCommand,
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

  it("ports EMapObjectTurrent EndExplosion null effect list guard", () => {
    expect(() =>
      endMapObjectTurrentExplosion(
        {
          ztime: { tick: 4 },
          targetX: 96,
          targetY: 128,
        },
        null,
        () => {
          throw new Error("randomInt should not be called without effect list");
        },
      ),
    ).not.toThrow();
  });

  it("ports EMapObjectTurrent EndExplosion as mushroom and unit-particle spawning", () => {
    const ztime = { tick: 7 };
    const effects: MapObjectTurrentEndExplosionSpawn<typeof ztime>[] = [];

    endMapObjectTurrentExplosion(
      {
        ztime,
        targetX: 96,
        targetY: 128,
      },
      effects,
      () => 7,
    );

    expect(effects).toHaveLength(18);
    expect(effects[0]).toEqual({
      kind: "toughMushroom",
      ztime,
      x: 96,
      y: 128,
      size: 1,
    });
    expect(effects.slice(1)).toEqual(
      Array.from({ length: 17 }, () => ({
        kind: "unitParticle",
        ztime,
        x: 96,
        y: 128,
        maxX: 65,
        maxY: 55,
      })),
    );
  });

  it("ports EMapObjectTurrent Process guard exit", () => {
    const state = createMapObjectTurrentProcessState({ killMe: true });
    const effects: MapObjectTurrentEndExplosionSpawn[] = [];
    const sounds: MapObjectTurrentRestrictedSoundCommand[] = [];

    processMapObjectTurrentEffect(state, 5, effects, sounds, () => {
      throw new Error("randomInt should not be called for killed effects");
    });

    expect(state.x).toBe(10);
    expect(state.y).toBe(20);
    expect(effects).toEqual([]);
    expect(sounds).toEqual([]);
  });

  it("ports EMapObjectTurrent Process as arcing movement and wrapped angle", () => {
    const state = createMapObjectTurrentProcessState({
      initTime: 2,
      finalTime: 6,
      sx: 10,
      sy: 20,
      dx: 5,
      dy: 8,
      rise: 2,
      dangle: -250,
    });

    processMapObjectTurrentEffect(state, 3.5, [], []);

    expect(state.killMe).toBe(false);
    expect(state.x).toBe(17.5);
    expect(state.y).toBeCloseTo(-11.875);
    expect(state.size).toBeCloseTo(3.0625);
    expect(state.angle).toBe(345);
  });

  it("ports EMapObjectTurrent Process impact as effects and restricted sound", () => {
    const ztime = { tick: 12 };
    const state = createMapObjectTurrentProcessState({
      ztime,
      finalTime: 6,
      targetX: 96,
      targetY: 128,
      impactSoundX: 101,
      impactSoundY: 133,
    });
    const effects: MapObjectTurrentEndExplosionSpawn<typeof ztime>[] = [];
    const sounds: MapObjectTurrentRestrictedSoundCommand[] = [];

    processMapObjectTurrentEffect(state, 6, effects, sounds, () => 0);

    expect(state.killMe).toBe(true);
    expect(effects).toHaveLength(11);
    expect(effects[0]).toEqual({
      kind: "toughMushroom",
      ztime,
      x: 96,
      y: 128,
      size: 1,
    });
    expect(effects[1]).toEqual({
      kind: "unitParticle",
      ztime,
      x: 96,
      y: 128,
      maxX: 65,
      maxY: 55,
    });
    expect(sounds).toEqual([
      {
        sound: SoundEngineSound.TurrentExplosionSnd,
        x: 101,
        y: 133,
      },
    ]);
  });
});

function createMapObjectTurrentProcessState<TTime = unknown>(
  overrides: Partial<MapObjectTurrentProcessState<TTime>> = {},
): MapObjectTurrentProcessState<TTime> {
  return {
    killMe: false,
    ztime: null,
    finalTime: 2,
    initTime: 0,
    x: 10,
    y: 20,
    sx: 10,
    sy: 20,
    dx: 30,
    dy: 40,
    size: 1,
    rise: 0.5,
    angle: 0,
    dangle: 120,
    impactSoundX: 30,
    impactSoundY: 40,
    targetX: 28,
    targetY: 36,
    ...overrides,
  };
}
