import { describe, expect, it } from "vitest";
import { PlanetType, TeamType } from "../src/simulation/SimulationConstants";
import {
  changeRockPalette,
  clearRockRender,
  createRockMapEffects,
  deathRockMapEffects,
  isRockDestroyableImpassable,
  OROCK_HEADER_GUARD_PORTED,
  rockCausesImpassAtCoord,
  processRockObject,
  setRockMapImpassables,
  setDefaultRockRender,
  setRockOwner,
  unsetRockMapImpassables,
} from "../src/simulation/RockObject";

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
