import { describe, expect, it } from "vitest";
import {
  ETURRET_MISSILE_HEADER_GUARD_PORTED,
  renderTurretMissileEffect,
  TurretMissileEffectType,
  type TurretMissileEffectSpawn,
  type TurretMissileRenderState,
} from "../src/simulation/TurretMissileEffect";

type TurretMissileImage = {
  id: string;
  setAngle(angle: number): void;
  setSize(size: number): void;
};

describe("turret missile effect", () => {
  it("adapts the eturrentmissile.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/TurretMissileEffect");
    const secondImport = await import("../src/simulation/TurretMissileEffect");

    expect(ETURRET_MISSILE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ETURRET_MISSILE_HEADER_GUARD_PORTED).toBe(
      firstImport.ETURRET_MISSILE_HEADER_GUARD_PORTED,
    );
  });

  it("ports eturrent_missile as turret missile effect identifiers", () => {
    expect(TurretMissileEffectType.Light).toBe(0);
    expect(TurretMissileEffectType.Medium).toBe(1);
    expect(TurretMissileEffectType.Heavy).toBe(2);
    expect(TurretMissileEffectType.Gatling).toBe(3);
    expect(TurretMissileEffectType.Gun).toBe(4);
    expect(TurretMissileEffectType.Howitzer).toBe(5);
    expect(TurretMissileEffectType.MissileCannon).toBe(6);
    expect(TurretMissileEffectType.BuildingPiece0).toBe(7);
    expect(TurretMissileEffectType.BuildingPiece1).toBe(8);
    expect(TurretMissileEffectType.FortBuildingPiece0).toBe(9);
    expect(TurretMissileEffectType.FortBuildingPiece1).toBe(10);
    expect(TurretMissileEffectType.FortBuildingPiece2).toBe(11);
    expect(TurretMissileEffectType.FortBuildingPiece3).toBe(12);
    expect(TurretMissileEffectType.FortBuildingPiece4).toBe(13);
    expect(TurretMissileEffectType.Grenade).toBe(14);
  });

  it("ports ETurrentMissile spawn descriptors as browser effect data", () => {
    const spawn: TurretMissileEffectSpawn<{ now: number }> = {
      ztime: { now: 12 },
      startX: 20,
      startY: 30,
      targetX: 100,
      targetY: 120,
      offsetTime: 3.5,
      type: TurretMissileEffectType.Heavy,
      owner: 2,
    };

    expect(spawn).toEqual({
      ztime: { now: 12 },
      startX: 20,
      startY: 30,
      targetX: 100,
      targetY: 120,
      offsetTime: 3.5,
      type: TurretMissileEffectType.Heavy,
      owner: 2,
    });
  });

  it("replaces ETurrentMissile DoRender with transformed centered light debris", () => {
    const transforms: Array<[string, string, number]> = [];
    const state = createTurretMissileRenderState(transforms, {
      type: TurretMissileEffectType.Light,
      renderIndex: 3,
      angle: 42,
      size: 1.25,
    });

    expect(renderTurretMissileEffect(state, createTurretMissileRenderMap())).toEqual({
      surface: state.lightTurretImages[3],
      x: 140,
      y: 170,
      renderHit: false,
      aboutCenter: true,
    });
    expect(transforms).toEqual([
      ["light-3", "angle", 42],
      ["light-3", "size", 1.25],
    ]);
  });

  it("replaces ETurrentMissile DoRender with owner heavy debris", () => {
    const transforms: Array<[string, string, number]> = [];
    const state = createTurretMissileRenderState(transforms, {
      type: TurretMissileEffectType.Heavy,
      owner: 2,
      renderIndex: 5,
    });

    expect(renderTurretMissileEffect(state, createTurretMissileRenderMap())?.surface).toBe(
      state.heavyTurretImages[2]?.[5],
    );
    expect(transforms.map(([id]) => id)).toEqual(["heavy-2-5", "heavy-2-5"]);
  });

  it("replaces ETurrentMissile DoRender with wasted cannon debris", () => {
    const transforms: Array<[string, string, number]> = [];
    const state = createTurretMissileRenderState(transforms, {
      type: TurretMissileEffectType.Howitzer,
    });

    expect(renderTurretMissileEffect(state, createTurretMissileRenderMap())?.surface).toBe(
      state.howitzerWastedImage,
    );
    expect(transforms.map(([id]) => id)).toEqual([
      "howitzer-wasted",
      "howitzer-wasted",
    ]);
  });

  it("replaces ETurrentMissile DoRender with building and fort debris frames", () => {
    const transforms: Array<[string, string, number]> = [];
    const buildingState = createTurretMissileRenderState(transforms, {
      type: TurretMissileEffectType.BuildingPiece1,
      renderIndex: 4,
    });
    const fortState = createTurretMissileRenderState(transforms, {
      type: TurretMissileEffectType.FortBuildingPiece3,
      renderIndex: 6,
    });

    expect(
      renderTurretMissileEffect(buildingState, createTurretMissileRenderMap())
        ?.surface,
    ).toBe(buildingState.buildingPieceImages[1]?.[4]);
    expect(
      renderTurretMissileEffect(fortState, createTurretMissileRenderMap())?.surface,
    ).toBe(fortState.fortBuildingPieceImages[3]?.[6]);
  });

  it("replaces ETurrentMissile DoRender with grenade debris frames", () => {
    const transforms: Array<[string, string, number]> = [];
    const state = createTurretMissileRenderState(transforms, {
      type: TurretMissileEffectType.Grenade,
      renderIndex: 2,
    });

    expect(renderTurretMissileEffect(state, createTurretMissileRenderMap())?.surface).toBe(
      state.grenadeImages[2],
    );
  });

  it("replaces ETurrentMissile DoRender as no command when killed or missing", () => {
    const transforms: Array<[string, string, number]> = [];

    expect(
      renderTurretMissileEffect(
        createTurretMissileRenderState(transforms, { killme: true }),
        createTurretMissileRenderMap(),
      ),
    ).toBeNull();
    expect(
      renderTurretMissileEffect(
        createTurretMissileRenderState(transforms, {
          type: TurretMissileEffectType.Medium,
          mediumTurretImages: [],
        }),
        createTurretMissileRenderMap(),
      ),
    ).toBeNull();
    expect(
      renderTurretMissileEffect(
        createTurretMissileRenderState(transforms, { type: 99 }),
        createTurretMissileRenderMap(),
      ),
    ).toBeNull();
    expect(transforms).toEqual([]);
  });
});

function createTurretMissileRenderState(
  transforms: Array<[string, string, number]>,
  overrides: Partial<TurretMissileRenderState<TurretMissileImage>> = {},
): TurretMissileRenderState<TurretMissileImage> {
  const makeImage = (id: string): TurretMissileImage => ({
    id,
    setAngle(angle: number) {
      transforms.push([id, "angle", angle]);
    },
    setSize(size: number) {
      transforms.push([id, "size", size]);
    },
  });

  return {
    killme: false,
    x: 140,
    y: 170,
    type: TurretMissileEffectType.Light,
    owner: 1,
    renderIndex: 0,
    angle: 30,
    size: 0.8,
    lightTurretImages: Array.from({ length: 8 }, (_, index) =>
      makeImage(`light-${index}`),
    ),
    mediumTurretImages: Array.from({ length: 8 }, (_, index) =>
      makeImage(`medium-${index}`),
    ),
    heavyTurretImages: Array.from({ length: 3 }, (_, team) =>
      Array.from({ length: 8 }, (_, index) => makeImage(`heavy-${team}-${index}`)),
    ),
    gatlingWastedImage: makeImage("gatling-wasted"),
    gunWastedImage: makeImage("gun-wasted"),
    howitzerWastedImage: makeImage("howitzer-wasted"),
    missileWastedImage: makeImage("missile-wasted"),
    buildingPieceImages: Array.from({ length: 2 }, (_, piece) =>
      Array.from({ length: 12 }, (_, index) =>
        makeImage(`building-${piece}-${index}`),
      ),
    ),
    fortBuildingPieceImages: Array.from({ length: 5 }, (_, piece) =>
      Array.from({ length: 12 }, (_, index) => makeImage(`fort-${piece}-${index}`)),
    ),
    grenadeImages: Array.from({ length: 4 }, (_, index) =>
      makeImage(`grenade-${index}`),
    ),
    ...overrides,
  };
}

function createTurretMissileRenderMap<TSurface>(): {
  renderZSurface(
    surface: TSurface,
    x: number,
    y: number,
    renderHit: boolean,
    aboutCenter: boolean,
  ): {
    surface: TSurface;
    x: number;
    y: number;
    renderHit: boolean;
    aboutCenter: boolean;
  };
} {
  return {
    renderZSurface(surface, x, y, renderHit, aboutCenter) {
      return { surface, x, y, renderHit, aboutCenter };
    },
  };
}
