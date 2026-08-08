import { describe, expect, it } from "vitest";
import { PlanetType, TeamType } from "../src/simulation/SimulationConstants";
import {
  changeRockPalette,
  clearRockRender,
  createRockMapEffects,
  deathRockMapEffects,
  doRockDeathEffect,
  isRockDestroyableImpassable,
  OROCK_HEADER_GUARD_PORTED,
  preRenderRockObject,
  renderRockObject,
  rockCausesImpassAtCoord,
  processRockObject,
  setRockMapImpassables,
  setDefaultRockRender,
  setRockOwner,
  unsetRockMapImpassables,
} from "../src/simulation/RockObject";
import { RockParticleType } from "../src/simulation/RockParticleEffect";

describe("rock object", () => {
  it("adapts the orock.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/RockObject");
    const secondImport = await import("../src/simulation/RockObject");

    expect(OROCK_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.OROCK_HEADER_GUARD_PORTED).toBe(
      firstImport.OROCK_HEADER_GUARD_PORTED,
    );
  });

  it("ports IsDestroyableImpass as a destroyable rock impassable marker", () => {
    expect(isRockDestroyableImpassable()).toBe(true);
  });

  it("ports ORock ChangePalette as palette assignment", () => {
    const state = { palette: PlanetType.Desert };

    changeRockPalette(state, PlanetType.Arctic);

    expect(state.palette).toBe(PlanetType.Arctic);
  });

  it("ports ORock CausesImpassAtCoord as shifted coordinate equality", () => {
    const state = { x: 64, y: 80 };

    expect(rockCausesImpassAtCoord(state, 64, 112)).toBe(true);
    expect(rockCausesImpassAtCoord(state, 64, 80)).toBe(false);
    expect(rockCausesImpassAtCoord(state, 63, 112)).toBe(false);
  });

  it("ports ORock SetMapImpassables as lower tile impassable marking", () => {
    const calls: Array<[number, number, boolean, boolean]> = [];

    setRockMapImpassables(
      { x: 39, y: 50 },
      {
        setImpassable(tileX, tileY, impassable, destroyable) {
          calls.push([tileX, tileY, impassable, destroyable]);
        },
      },
    );

    expect(calls).toEqual([[2, 5, true, true]]);
  });

  it("ports ORock UnSetMapImpassables as lower tile impassable clearing", () => {
    const calls: Array<[number, number, boolean, boolean]> = [];

    unsetRockMapImpassables(
      { x: 47, y: 65 },
      {
        setImpassable(tileX, tileY, impassable, destroyable) {
          calls.push([tileX, tileY, impassable, destroyable]);
        },
      },
    );

    expect(calls).toEqual([[2, 6, false, true]]);
  });

  it("ports ORock SetOwner as null-team ownership", () => {
    const state = { owner: TeamType.Red };

    setRockOwner(state);

    expect(state.owner).toBe(TeamType.Null);
  });

  it("ports ORock Process as a successful no-op tick", () => {
    expect(processRockObject()).toBe(1);
  });

  it("ports ORock DoDeathEffect null effect list guard", () => {
    expect(() =>
      doRockDeathEffect(
        { ztime: { now: 1 }, x: 20, y: 30, palette: PlanetType.Desert },
        null,
        true,
        true,
        () => {
          throw new Error("randomInt should not be called");
        },
      ),
    ).not.toThrow();
  });

  it("ports ORock DoDeathEffect as rock debris effect spawning", () => {
    const ztime = { now: 1 };
    const effects: Parameters<typeof doRockDeathEffect<typeof ztime>>[1] = [];
    const randomValues = [5, 2, 1];

    doRockDeathEffect(
      { ztime, x: 20, y: 30, palette: PlanetType.Volcanic },
      effects,
      false,
      false,
      () => randomValues.shift() ?? 0,
    );

    expect(effects).toHaveLength(24);
    expect(effects.slice(0, 17)).toEqual(
      Array.from({ length: 17 }, () => ({
        ztime,
        x: 20,
        y: 30,
        palette: PlanetType.Volcanic,
        particleType: RockParticleType.Small,
        maxX: 80,
        maxY: 60,
      })),
    );
    expect(effects.slice(17, 23)).toEqual(
      Array.from({ length: 6 }, () => ({
        ztime,
        x: 20,
        y: 30,
        palette: PlanetType.Volcanic,
        particleType: RockParticleType.Mid,
        maxX: 40,
        maxY: 40,
      })),
    );
    expect(effects[23]).toEqual({
      ztime,
      x: 20,
      y: 30,
      palette: PlanetType.Volcanic,
      maxX: 140,
      maxY: 140,
    });
  });

  it("replaces ORock ClearRender as clearing the 2 by 3 render cache", () => {
    const state = {
      renderImages: [
        ["a0", "a1", "a2", "kept-a"],
        ["b0", "b1", "b2", "kept-b"],
        ["kept-c"],
      ],
    };

    clearRockRender(state);

    expect(state.renderImages).toEqual([
      [null, null, null, "kept-a"],
      [null, null, null, "kept-b"],
      ["kept-c"],
    ]);
  });

  it("replaces ORock SetDefaultRender as default palette render images", () => {
    const state = {
      palette: PlanetType.Arctic,
      renderImages: [
        ["old-a0", "old-a1", "old-a2"],
        ["old-b0", "old-b1", "old-b2"],
      ],
    };
    const graphics = {
      verticalDownTop: ["desert-top", "volcanic-top", "arctic-top"],
      singleMidUnder: ["desert-mid", "volcanic-mid", "arctic-mid"],
      singleBottomUnder: ["desert-bottom", "volcanic-bottom", "arctic-bottom"],
    };

    setDefaultRockRender(state, graphics);

    expect(state.renderImages).toEqual([
      ["arctic-top", "arctic-mid", "arctic-bottom"],
      [null, null, null],
    ]);
  });

  it("replaces ORock DoPreRender with shifted clipped shadow blit commands", () => {
    type BaseSurface = { width: number; height: number };
    type Image = { id: string; getBaseSurface(): BaseSurface | null };

    const shadow0: Image = {
      id: "shadow-0",
      getBaseSurface: () => ({ width: 16, height: 16 }),
    };
    const shadow1: Image = {
      id: "shadow-1",
      getBaseSurface: () => ({ width: 16, height: 16 }),
    };
    const calls: Array<[BaseSurface | null, number, number]> = [];
    const state = {
      x: 40,
      y: 60,
      renderImages: [
        [],
        [shadow0, null, shadow1],
      ],
    };

    const commands = preRenderRockObject(
      state,
      {
        getBlitInfo(surface, x, y) {
          calls.push([surface, x, y]);
          return {
            sourceX: 1,
            sourceY: 2,
            width: 10,
            height: 11,
            destinationX: x - 30,
            destinationY: y - 40,
          };
        },
      },
      7,
      9,
    );

    expect(calls.map(([, x, y]) => [x, y])).toEqual([
      [56, 60],
      [56, 92],
    ]);
    expect(commands).toEqual([
      {
        renderImage: shadow0,
        region: {
          sourceX: 1,
          sourceY: 2,
          width: 10,
          height: 11,
          destinationX: 33,
          destinationY: 29,
        },
      },
      {
        renderImage: shadow1,
        region: {
          sourceX: 1,
          sourceY: 2,
          width: 10,
          height: 11,
          destinationX: 33,
          destinationY: 61,
        },
      },
    ]);
  });

  it("replaces ORock DoPreRender by skipping missing or invisible shadows", () => {
    const state = {
      x: 40,
      y: 60,
      renderImages: [
        [],
        [
          {
            getBaseSurface: () => null,
          },
        ],
      ],
    };

    expect(
      preRenderRockObject(
        state,
        {
          getBlitInfo() {
            return null;
          },
        },
        0,
        0,
      ),
    ).toEqual([]);
  });

  it("replaces ORock DoRender with shifted clipped body blit commands", () => {
    type BaseSurface = { width: number; height: number };
    type Image = { id: string; getBaseSurface(): BaseSurface | null };

    const body0: Image = {
      id: "body-0",
      getBaseSurface: () => ({ width: 16, height: 16 }),
    };
    const body1: Image = {
      id: "body-1",
      getBaseSurface: () => ({ width: 16, height: 16 }),
    };
    const calls: Array<[BaseSurface | null, number, number]> = [];
    const state = {
      x: 40,
      y: 60,
      renderImages: [
        [body0, null, body1],
        [],
      ],
    };

    const commands = renderRockObject(
      state,
      {
        getBlitInfo(surface, x, y) {
          calls.push([surface, x, y]);
          return {
            sourceX: 2,
            sourceY: 3,
            width: 12,
            height: 13,
            destinationX: x - 25,
            destinationY: y - 35,
          };
        },
      },
      5,
      6,
    );

    expect(calls.map(([, x, y]) => [x, y])).toEqual([
      [40, 60],
      [40, 92],
    ]);
    expect(commands).toEqual([
      {
        renderImage: body0,
        region: {
          sourceX: 2,
          sourceY: 3,
          width: 12,
          height: 13,
          destinationX: 20,
          destinationY: 31,
        },
      },
      {
        renderImage: body1,
        region: {
          sourceX: 2,
          sourceY: 3,
          width: 12,
          height: 13,
          destinationX: 20,
          destinationY: 63,
        },
      },
    ]);
  });

  it("replaces ORock DoRender by skipping missing or invisible body images", () => {
    const state = {
      x: 40,
      y: 60,
      renderImages: [
        [
          {
            getBaseSurface: () => null,
          },
        ],
        [],
      ],
    };

    expect(
      renderRockObject(
        state,
        {
          getBlitInfo() {
            return null;
          },
        },
        0,
        0,
      ),
    ).toEqual([]);
  });

  it("ports ORock CreationMapEffects as a map creation no-op hook", () => {
    const mapState = { effects: ["existing"], changed: false };

    createRockMapEffects(mapState);

    expect(mapState).toEqual({ effects: ["existing"], changed: false });
  });

  it("ports ORock DeathMapEffects guard exits before stamping", () => {
    const rockDestroyedImages = [["d0", "d1", "d2", "d3", "d4", "d5"]];
    const stamps: Array<[number, number, string | null, boolean, boolean]> = [];
    const map = {
      width: 4,
      height: 4,
      coordStamped() {
        return false;
      },
      permStamp(
        x: number,
        y: number,
        surface: string | null,
        markStamped: boolean,
        fullRenderSurfaceAvailable: boolean,
      ) {
        stamps.push([x, y, surface, markStamped, fullRenderSurfaceAvailable]);
      },
    };

    deathRockMapEffects(
      { x: -1, y: 16, palette: PlanetType.Desert },
      map,
      rockDestroyedImages,
    );
    deathRockMapEffects(
      { x: 0, y: -48, palette: PlanetType.Desert },
      map,
      rockDestroyedImages,
    );
    deathRockMapEffects(
      { x: 49, y: 16, palette: PlanetType.Desert },
      map,
      rockDestroyedImages,
    );
    deathRockMapEffects(
      { x: 0, y: 49, palette: PlanetType.Desert },
      map,
      rockDestroyedImages,
    );

    expect(stamps).toEqual([]);
  });

  it("ports ORock DeathMapEffects as no stamp when the destination is already stamped", () => {
    const coordChecks: Array<[number, number]> = [];
    const stamps: unknown[] = [];

    deathRockMapEffects(
      { x: 16, y: 0, palette: PlanetType.Desert },
      {
        width: 4,
        height: 4,
        coordStamped(x, y) {
          coordChecks.push([x, y]);
          return true;
        },
        permStamp() {
          stamps.push("stamp");
        },
      },
      [["d0", "d1", "d2", "d3", "d4", "d5"]],
    );

    expect(coordChecks).toEqual([[16, 32]]);
    expect(stamps).toEqual([]);
  });

  it("ports ORock DeathMapEffects as destroyed-rock permanent stamp", () => {
    const stamps: Array<[number, number, string | null, boolean, boolean]> = [];
    const rockDestroyedImages = [
      ["desert-0", "desert-1", "desert-2", "desert-3", "desert-4", "desert-5"],
      [
        "volcanic-0",
        "volcanic-1",
        "volcanic-2",
        "volcanic-3",
        "volcanic-4",
        "volcanic-5",
      ],
    ];

    deathRockMapEffects(
      { x: 16, y: 0, palette: PlanetType.Volcanic },
      {
        width: 4,
        height: 4,
        coordStamped() {
          return false;
        },
        permStamp(x, y, surface, markStamped, fullRenderSurfaceAvailable) {
          stamps.push([x, y, surface, markStamped, fullRenderSurfaceAvailable]);
        },
      },
      rockDestroyedImages,
      () => 8,
      false,
    );

    expect(stamps).toEqual([[16, 32, "volcanic-2", false, false]]);
  });
});
