import { describe, expect, it } from "vitest";
import {
  TurretMissileEffectType,
  type TurretMissileEffectSpawn,
} from "../src/simulation/TurretMissileEffect";
import {
  fireGrenadesObjectTurrentMissile,
  GRENADES_OBJECT_IMAGE_PATH,
  GRENADES_MISSILE_MAX_HORIZONTAL_SPREAD_PIXELS,
  GRENADES_MISSILE_MAX_VERTICAL_SPREAD_PIXELS,
  getGrenadesObjectAmount,
  initGrenadesObjectImage,
  OGRENADES_HEADER_GUARD_PORTED,
  processGrenadesObject,
  renderGrenadesObject,
  setGrenadesObjectAmount,
  setGrenadesObjectOwner,
} from "../src/simulation/GrenadesObject";

describe("grenades object", () => {
  it("adapts the ogrenades.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/GrenadesObject");
    const secondImport = await import("../src/simulation/GrenadesObject");

    expect(OGRENADES_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.OGRENADES_HEADER_GUARD_PORTED).toBe(
      firstImport.OGRENADES_HEADER_GUARD_PORTED,
    );
  });

  it("ports missile spread limits for spawned grenade missiles", () => {
    expect(GRENADES_MISSILE_MAX_HORIZONTAL_SPREAD_PIXELS).toBe(130);
    expect(GRENADES_MISSILE_MAX_VERTICAL_SPREAD_PIXELS).toBe(130);
  });

  it("ports SetGrenadeAmount as grenade pickup inventory assignment", () => {
    const state = { grenadeAmount: 0 };

    setGrenadesObjectAmount(state, 6);

    expect(state.grenadeAmount).toBe(6);
  });

  it("ports GetGrenadeAmount as grenade pickup inventory read", () => {
    const state = { grenadeAmount: 6 };

    expect(getGrenadesObjectAmount(state)).toBe(6);
  });

  it("ports OGrenades Init as grenade pickup image loading", () => {
    const state = { renderImage: null as { id: string } | null };
    const loadedPaths: string[] = [];

    initGrenadesObjectImage(state, (path) => {
      loadedPaths.push(path);
      return { id: path };
    });

    expect(loadedPaths).toEqual([GRENADES_OBJECT_IMAGE_PATH]);
    expect(state.renderImage).toEqual({ id: GRENADES_OBJECT_IMAGE_PATH });
  });

  it("replaces OGrenades DoRender with a shifted clipped blit command", () => {
    const baseSurface = { width: 16, height: 16 };
    const renderImage = {
      id: "grenades",
      getBaseSurface: () => baseSurface,
    };
    const calls: unknown[] = [];

    const command = renderGrenadesObject(
      {
        renderImage,
        position: { x: 48, y: 72 },
      },
      {
        getBlitInfo: (surface, x, y) => {
          calls.push({ surface, x, y });
          return {
            sourceX: 2,
            sourceY: 3,
            width: 12,
            height: 10,
            destinationX: 30,
            destinationY: 45,
          };
        },
      },
      7,
      -4,
    );

    expect(command).toEqual({
      renderImage,
      region: {
        sourceX: 2,
        sourceY: 3,
        width: 12,
        height: 10,
        destinationX: 37,
        destinationY: 41,
      },
    });
    expect(calls).toEqual([{ surface: baseSurface, x: 48, y: 72 }]);
  });

  it("replaces OGrenades DoRender as no command without image or visible blit", () => {
    const map = {
      getBlitInfo: () => {
        throw new Error("getBlitInfo should not be called without an image");
      },
    };

    expect(
      renderGrenadesObject(
        {
          renderImage: null,
          position: { x: 0, y: 0 },
        },
        map,
        0,
        0,
      ),
    ).toBeNull();

    expect(
      renderGrenadesObject(
        {
          renderImage: {
            getBaseSurface: () => null,
          },
          position: { x: 0, y: 0 },
        },
        {
          getBlitInfo: () => null,
        },
        0,
        0,
      ),
    ).toBeNull();
  });

  it("ports OGrenades Process as a no-op result", () => {
    expect(processGrenadesObject()).toBe(0);
  });

  it("ports OGrenades FireTurrentMissile as no effect without an effect list", () => {
    const state = {
      ztime: { tick: 12 },
      position: { x: 40, y: 60 },
    };

    expect(() =>
      fireGrenadesObjectTurrentMissile(state, null, 100, 120, 0.75),
    ).not.toThrow();
  });

  it("ports OGrenades FireTurrentMissile as an appended grenade missile spawn", () => {
    const ztime = { tick: 12 };
    const existing = {
      ztime: null,
      startX: 1,
      startY: 2,
      targetX: 3,
      targetY: 4,
      offsetTime: 5,
      type: TurretMissileEffectType.Heavy,
    };
    const effects: TurretMissileEffectSpawn<typeof ztime>[] = [existing];
    const state = {
      ztime,
      position: { x: 40, y: 60 },
    };

    fireGrenadesObjectTurrentMissile(state, effects, 100, 120, 0.75);

    expect(effects).toEqual([
      existing,
      {
        ztime,
        startX: 42,
        startY: 62,
        targetX: 100,
        targetY: 120,
        offsetTime: 0.75,
        type: TurretMissileEffectType.Grenade,
      },
    ]);
  });

  it("ports OGrenades SetOwner as an ownership no-op", () => {
    expect(setGrenadesObjectOwner(2)).toBeUndefined();
  });
});
