import { describe, expect, it } from "vitest";
import {
  CannonType,
  RobotType,
  VehicleType,
} from "../src/simulation/SimulationConstants";
import {
  crossReferenceUnits,
  initUnitCrossReferenceTable,
  initUnitRating,
  insertUnitCrossReference,
  isUnitForRating,
  populateUnitCrossReferenceTable,
  UnitCrossReference,
  type UnitCrossReferenceTable,
  ZUNITRATING_HEADER_GUARD_PORTED,
} from "../src/simulation/UnitRating";
import { MapObjectType } from "../src/world/MapFormat";

describe("unit rating", () => {
  it("adapts the zunitrating.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/UnitRating");
    const secondImport = await import("../src/simulation/UnitRating");

    expect(ZUNITRATING_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZUNITRATING_HEADER_GUARD_PORTED).toBe(
      firstImport.ZUNITRATING_HEADER_GUARD_PORTED,
    );
  });

  it("ports unit cross-reference outcomes", () => {
    expect(UnitCrossReference.WillDie).toBe(0);
    expect(UnitCrossReference.Even).toBe(1);
    expect(UnitCrossReference.WillKill).toBe(2);
  });

  it("ports ZUnitRating::IsUnit as cannon, vehicle, and robot bounds checks", () => {
    expect(isUnitForRating(MapObjectType.Cannon, CannonType.Gun)).toBe(true);
    expect(isUnitForRating(MapObjectType.Vehicle, VehicleType.Jeep)).toBe(true);
    expect(isUnitForRating(MapObjectType.Robot, RobotType.Grunt)).toBe(true);

    expect(isUnitForRating(MapObjectType.Cannon, -1)).toBe(false);
    expect(isUnitForRating(MapObjectType.Cannon, CannonType.Max)).toBe(false);
    expect(isUnitForRating(MapObjectType.Vehicle, VehicleType.Max)).toBe(false);
    expect(isUnitForRating(MapObjectType.Robot, RobotType.Max)).toBe(false);
    expect(isUnitForRating(MapObjectType.Building, 0)).toBe(false);
  });

  it("ports ZUnitRating::InitMallocUCR as even-filled matchup table allocation", () => {
    const state: { unitCrossReferences: UnitCrossReferenceTable | null } = {
      unitCrossReferences: null,
    };

    initUnitCrossReferenceTable(state);

    expect(state.unitCrossReferences?.length).toBe(MapObjectType.Robot + 1);
    expect(state.unitCrossReferences?.[0].length).toBe(VehicleType.Max);
    expect(state.unitCrossReferences?.[0][0].length).toBe(
      MapObjectType.Robot + 1,
    );
    expect(state.unitCrossReferences?.[0][0][0].length).toBe(VehicleType.Max);
    expect(
      state.unitCrossReferences?.[MapObjectType.Robot][RobotType.Laser][
        MapObjectType.Vehicle
      ][VehicleType.Crane],
    ).toBe(UnitCrossReference.Even);

    const existingTable = state.unitCrossReferences;
    initUnitCrossReferenceTable(state);

    expect(state.unitCrossReferences).toBe(existingTable);
  });

  it("ports ZUnitRating::InsertCrossReference as forward and reversed matchup writes", () => {
    const state = { unitCrossReferences: [] };

    insertUnitCrossReference(
      state,
      1,
      2,
      3,
      4,
      UnitCrossReference.WillDie,
    );

    expect(state.unitCrossReferences[1][2][3][4]).toBe(
      UnitCrossReference.WillDie,
    );
    expect(state.unitCrossReferences[3][4][1][2]).toBe(
      UnitCrossReference.WillKill,
    );

    insertUnitCrossReference(
      state,
      5,
      6,
      7,
      8,
      UnitCrossReference.WillKill,
    );

    expect(state.unitCrossReferences[5][6][7][8]).toBe(
      UnitCrossReference.WillKill,
    );
    expect(state.unitCrossReferences[7][8][5][6]).toBe(
      UnitCrossReference.WillDie,
    );
  });

  it("ports ZUnitRating::InsertCrossReference as symmetric Even matchup writes", () => {
    const state = { unitCrossReferences: [] };

    insertUnitCrossReference(
      state,
      0,
      1,
      2,
      3,
      UnitCrossReference.Even,
    );

    expect(state.unitCrossReferences[0][1][2][3]).toBe(UnitCrossReference.Even);
    expect(state.unitCrossReferences[2][3][0][1]).toBe(UnitCrossReference.Even);
  });

  it("ports ZUnitRating::InitPopulateUCR as default losing matchups", () => {
    const state = { unitCrossReferences: null };

    populateUnitCrossReferenceTable(state);

    expect(
      crossReferenceUnits(
        state,
        MapObjectType.Robot,
        RobotType.Grunt,
        MapObjectType.Vehicle,
        VehicleType.Heavy,
      ),
    ).toBe(UnitCrossReference.WillDie);
    expect(
      crossReferenceUnits(
        state,
        MapObjectType.Vehicle,
        VehicleType.Heavy,
        MapObjectType.Robot,
        RobotType.Grunt,
      ),
    ).toBe(UnitCrossReference.WillKill);
    expect(
      crossReferenceUnits(
        state,
        MapObjectType.Vehicle,
        VehicleType.Jeep,
        MapObjectType.Cannon,
        CannonType.Howitzer,
      ),
    ).toBe(UnitCrossReference.WillDie);
    expect(
      crossReferenceUnits(
        state,
        MapObjectType.Robot,
        RobotType.Laser,
        MapObjectType.Vehicle,
        VehicleType.MissileLauncher,
      ),
    ).toBe(UnitCrossReference.WillDie);
    expect(
      crossReferenceUnits(
        state,
        MapObjectType.Vehicle,
        VehicleType.Crane,
        MapObjectType.Robot,
        RobotType.Grunt,
      ),
    ).toBe(UnitCrossReference.Even);
  });

  it("ports ZUnitRating::Init as default rating initialization", () => {
    const state = { unitCrossReferences: null };

    initUnitRating(state);

    expect(state.unitCrossReferences).not.toBeNull();
    expect(
      crossReferenceUnits(
        state,
        MapObjectType.Robot,
        RobotType.Grunt,
        MapObjectType.Robot,
        RobotType.Psycho,
      ),
    ).toBe(UnitCrossReference.WillDie);
  });

  it("ports ZUnitRating::CrossReference as guarded matchup lookup", () => {
    const state = { unitCrossReferences: [] };

    expect(
      crossReferenceUnits(
        { unitCrossReferences: null },
        MapObjectType.Robot,
        RobotType.Grunt,
        MapObjectType.Vehicle,
        VehicleType.Jeep,
      ),
    ).toBe(UnitCrossReference.Even);

    insertUnitCrossReference(
      state,
      MapObjectType.Robot,
      RobotType.Grunt,
      MapObjectType.Vehicle,
      VehicleType.Jeep,
      UnitCrossReference.WillKill,
    );

    expect(
      crossReferenceUnits(
        state,
        MapObjectType.Robot,
        RobotType.Grunt,
        MapObjectType.Vehicle,
        VehicleType.Jeep,
      ),
    ).toBe(UnitCrossReference.WillKill);
    expect(
      crossReferenceUnits(
        state,
        MapObjectType.Building,
        0,
        MapObjectType.Vehicle,
        VehicleType.Jeep,
      ),
    ).toBe(UnitCrossReference.Even);
    expect(
      crossReferenceUnits(
        state,
        MapObjectType.Robot,
        RobotType.Grunt,
        MapObjectType.Vehicle,
        VehicleType.Max,
      ),
    ).toBe(UnitCrossReference.Even);
  });
});
