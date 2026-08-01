import { describe, expect, it } from "vitest";
import { ZSettings } from "../src/data/ZSettingsData";
import {
  BuildingType,
  CannonType,
  MAX_BUILDING_LEVELS,
  RobotType,
  VehicleType,
} from "../src/simulation/SimulationConstants";
import { MapObjectType } from "../src/world/MapFormat";
import {
  BuildList,
  BuildListObject,
  ZBUILD_LIST_HEADER_GUARD_PORTED,
} from "../src/simulation/entities/BuildList";

describe("build list", () => {
  it("adapts the zbuildlist.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/entities/BuildList");
    const secondImport = await import("../src/simulation/entities/BuildList");

    expect(ZBUILD_LIST_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZBUILD_LIST_HEADER_GUARD_PORTED).toBe(
      firstImport.ZBUILD_LIST_HEADER_GUARD_PORTED,
    );
  });

  it("ports buildlist_object default construction", () => {
    expect(new BuildListObject()).toEqual({
      ot: 0,
      oid: 0,
    });
  });

  it("ports buildlist_object configured construction", () => {
    expect(new BuildListObject(1, 4)).toEqual({
      ot: 1,
      oid: 4,
    });
  });

  it("ports buildlist_object clear as object type and id reset", () => {
    const buildListObject = new BuildListObject(1, 4);

    buildListObject.clear();

    expect(buildListObject).toEqual({
      ot: 0,
      oid: 0,
    });
  });

  it("ports ZBuildList construction as empty production tables and null settings", () => {
    const buildList = new BuildList();

    expect(buildList.zsettings).toBeNull();
    expect(buildList.buildlistData).toHaveLength(BuildingType.Max);
    expect(buildList.buildlistData[BuildingType.FortFront]).toHaveLength(
      MAX_BUILDING_LEVELS,
    );
    expect(buildList.buildlistData[BuildingType.FortFront][0]).toEqual([]);
    expect(
      buildList.buildlistData[BuildingType.VehicleFactory][MAX_BUILDING_LEVELS - 1],
    ).toEqual([]);
  });

  it("ports ZBuildList SetZSettings as settings dependency assignment", () => {
    const buildList = new BuildList();
    const settings = new ZSettings();

    expect(buildList.zsettings).toBeNull();

    buildList.setZSettings(settings);
    expect(buildList.zsettings).toBe(settings);

    buildList.setZSettings(null);
    expect(buildList.zsettings).toBeNull();
  });

  it("ports ZBuildList ClearData as clearing every building type and level entry", () => {
    const buildList = new BuildList();

    expect(buildList.buildlistData).toHaveLength(BuildingType.Max);
    expect(buildList.buildlistData[0]).toHaveLength(MAX_BUILDING_LEVELS);

    const firstList = buildList.buildlistData[0][0];
    const lastList =
      buildList.buildlistData[BuildingType.Max - 1][MAX_BUILDING_LEVELS - 1];
    firstList.push(new BuildListObject(1, 2));
    lastList.push(new BuildListObject(3, 4));

    buildList.clearData();

    expect(firstList).toEqual([]);
    expect(lastList).toEqual([]);
    expect(buildList.buildlistData[0][0]).toBe(firstList);
    expect(
      buildList.buildlistData[BuildingType.Max - 1][MAX_BUILDING_LEVELS - 1],
    ).toBe(lastList);
  });

  it("ports ZBuildList LoadDefaults as default production table loading", () => {
    const buildList = new BuildList();
    buildList.buildlistData[BuildingType.FortFront][0].push(
      new BuildListObject(99, 99),
    );

    buildList.loadDefaults();

    expect(buildList.buildlistData[BuildingType.FortFront][0]).toEqual([
      new BuildListObject(MapObjectType.Robot, RobotType.Grunt),
      new BuildListObject(MapObjectType.Vehicle, VehicleType.Jeep),
      new BuildListObject(MapObjectType.Vehicle, VehicleType.Crane),
      new BuildListObject(MapObjectType.Cannon, CannonType.Gatling),
    ]);
    expect(buildList.buildlistData[BuildingType.RobotFactory][5]).toEqual([
      new BuildListObject(MapObjectType.Robot, RobotType.Grunt),
      new BuildListObject(MapObjectType.Robot, RobotType.Psycho),
      new BuildListObject(MapObjectType.Robot, RobotType.Sniper),
      new BuildListObject(MapObjectType.Robot, RobotType.Tough),
      new BuildListObject(MapObjectType.Robot, RobotType.Pyro),
      new BuildListObject(MapObjectType.Robot, RobotType.Laser),
      new BuildListObject(MapObjectType.Cannon, CannonType.Gatling),
      new BuildListObject(MapObjectType.Cannon, CannonType.Gun),
      new BuildListObject(MapObjectType.Cannon, CannonType.Howitzer),
      new BuildListObject(MapObjectType.Cannon, CannonType.MissileCannon),
    ]);
    expect(buildList.buildlistData[BuildingType.VehicleFactory][5]).toEqual([
      new BuildListObject(MapObjectType.Vehicle, VehicleType.Jeep),
      new BuildListObject(MapObjectType.Vehicle, VehicleType.Light),
      new BuildListObject(MapObjectType.Vehicle, VehicleType.Medium),
      new BuildListObject(MapObjectType.Vehicle, VehicleType.Heavy),
      new BuildListObject(MapObjectType.Vehicle, VehicleType.Apc),
      new BuildListObject(MapObjectType.Vehicle, VehicleType.MissileLauncher),
      new BuildListObject(MapObjectType.Cannon, CannonType.Gatling),
      new BuildListObject(MapObjectType.Cannon, CannonType.Gun),
      new BuildListObject(MapObjectType.Cannon, CannonType.Howitzer),
      new BuildListObject(MapObjectType.Cannon, CannonType.MissileCannon),
    ]);
    expect(buildList.getFirstUnitInBuildList(BuildingType.FortBack, 0)).toEqual({
      hasUnit: true,
      objectType: MapObjectType.Robot,
      objectId: RobotType.Grunt,
    });
  });

  it("ports ZBuildList GetFirstUnitInBuildList as first entry lookup", () => {
    const buildList = new BuildList();

    expect(
      buildList.getFirstUnitInBuildList(BuildingType.RobotFactory, 2),
    ).toEqual({
      hasUnit: false,
      objectType: 0,
      objectId: 0,
    });

    buildList.buildlistData[BuildingType.FortFront][1].push(
      new BuildListObject(3, 7),
      new BuildListObject(4, 8),
    );

    expect(buildList.getFirstUnitInBuildList(BuildingType.FortFront, 1)).toEqual(
      {
        hasUnit: true,
        objectType: 3,
        objectId: 7,
      },
    );
    expect(buildList.getFirstUnitInBuildList(BuildingType.FortBack, 1)).toEqual({
      hasUnit: true,
      objectType: 3,
      objectId: 7,
    });
    expect(buildList.getFirstUnitInBuildList(-1, -1)).toEqual({
      hasUnit: false,
      objectType: 0,
      objectId: 0,
    });
  });

  it("ports ZBuildList UnitInBuildList as entry membership lookup", () => {
    const buildList = new BuildList();
    buildList.buildlistData[BuildingType.VehicleFactory][2].push(
      new BuildListObject(2, 4),
      new BuildListObject(3, 5),
    );

    expect(buildList.unitInBuildList(BuildingType.VehicleFactory, 2, 2, 4)).toBe(
      true,
    );
    expect(buildList.unitInBuildList(BuildingType.VehicleFactory, 2, 2, 5)).toBe(
      false,
    );
    expect(buildList.unitInBuildList(BuildingType.FortBack, 2, 2, 4)).toBe(
      false,
    );
  });

  it("ports ZBuildList UnitBuildTime as fallback when settings are absent", () => {
    const buildList = new BuildList();
    const messages: string[] = [];

    expect(buildList.unitBuildTime(2, 4, (message) => messages.push(message))).toBe(5);
    expect(messages).toEqual(["ZBuildList::UnitBuildTime:zsettings not set"]);
  });

  it("ports ZBuildList UnitBuildTime as configured unit settings lookup", () => {
    const buildList = new BuildList();
    const calls: Array<[number, number]> = [];
    buildList.zsettings = {
      getUnitSettings(objectType: number, objectId: number): { buildTime: number } {
        calls.push([objectType, objectId]);
        return { buildTime: 42 };
      },
    } as typeof buildList.zsettings;

    expect(buildList.unitBuildTime(3, 7)).toBe(42);
    expect(calls).toEqual([[3, 7]]);
  });
});
