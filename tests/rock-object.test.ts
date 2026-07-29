import { describe, expect, it } from "vitest";
import { PlanetType, TeamType } from "../src/simulation/SimulationConstants";
import {
  changeRockPalette,
  createRockMapEffects,
  isRockDestroyableImpassable,
  OROCK_HEADER_GUARD_PORTED,
  rockCausesImpassAtCoord,
  processRockObject,
  setRockMapImpassables,
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

  it("ports ORock CreationMapEffects as a map creation no-op hook", () => {
    const mapState = { effects: ["existing"], changed: false };

    createRockMapEffects(mapState);

    expect(mapState).toEqual({ effects: ["existing"], changed: false });
  });
});
