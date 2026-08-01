/**
 * Upstream: zbuildlist.h
 */
import type { ZSettings } from "../../data/ZSettingsData";
import {
  BuildingType,
  CannonType,
  MAX_BUILDING_LEVELS,
  RobotType,
  VehicleType,
} from "../SimulationConstants";
import { MapObjectType } from "../../world/MapFormat";

/**
 * Port of upstream `_ZBUILDLIST_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: zbuildlist.h:2
 */
export const ZBUILD_LIST_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `buildlist_object`.
 * Role: Stores an object type and object id entry in a building production list.
 * Upstream: zbuildlist.h:12-25
 */
export class BuildListObject {
  ot: number;
  oid: number;

  constructor(ot?: number, oid?: number) {
    if (ot === undefined || oid === undefined) {
      this.ot = 0;
      this.oid = 0;
      return;
    }

    this.ot = ot;
    this.oid = oid;
  }

  /**
   * Port of upstream `buildlist_object::clear`.
   * Role: Resets the build-list object type and object id to defaults.
   * Upstream: zbuildlist.h:18-22
   */
  clear(): void {
    this.ot = 0;
    this.oid = 0;
  }
}

/**
 * Port of upstream `ZBuildList::GetFirstUnitInBuildList` output.
 * Role: Reports whether a build-list entry exists and carries its object type/id.
 * Upstream: zbuildlist.cpp:226-236
 */
export type BuildListFirstUnitResult = {
  hasUnit: boolean;
  objectType: number;
  objectId: number;
};

export type BuildListUnitSettingsSource = {
  getUnitSettings(objectType: number, objectId: number): { buildTime: number };
};

type BuildListDefaultEntry = readonly [objectType: number, objectId: number];

const FORT_FRONT_DEFAULTS: readonly (readonly BuildListDefaultEntry[])[] = [
  [
    [MapObjectType.Robot, RobotType.Grunt],
    [MapObjectType.Vehicle, VehicleType.Jeep],
    [MapObjectType.Vehicle, VehicleType.Crane],
    [MapObjectType.Cannon, CannonType.Gatling],
  ],
  [
    [MapObjectType.Robot, RobotType.Grunt],
    [MapObjectType.Robot, RobotType.Psycho],
    [MapObjectType.Vehicle, VehicleType.Jeep],
    [MapObjectType.Vehicle, VehicleType.Light],
    [MapObjectType.Vehicle, VehicleType.Crane],
    [MapObjectType.Cannon, CannonType.Gatling],
    [MapObjectType.Cannon, CannonType.Gun],
  ],
  [
    [MapObjectType.Robot, RobotType.Grunt],
    [MapObjectType.Robot, RobotType.Psycho],
    [MapObjectType.Robot, RobotType.Sniper],
    [MapObjectType.Robot, RobotType.Tough],
    [MapObjectType.Vehicle, VehicleType.Jeep],
    [MapObjectType.Vehicle, VehicleType.Light],
    [MapObjectType.Vehicle, VehicleType.Medium],
    [MapObjectType.Vehicle, VehicleType.Crane],
    [MapObjectType.Cannon, CannonType.Gatling],
    [MapObjectType.Cannon, CannonType.Gun],
    [MapObjectType.Cannon, CannonType.Howitzer],
  ],
  [
    [MapObjectType.Robot, RobotType.Grunt],
    [MapObjectType.Robot, RobotType.Psycho],
    [MapObjectType.Robot, RobotType.Sniper],
    [MapObjectType.Robot, RobotType.Tough],
    [MapObjectType.Robot, RobotType.Pyro],
    [MapObjectType.Vehicle, VehicleType.Jeep],
    [MapObjectType.Vehicle, VehicleType.Light],
    [MapObjectType.Vehicle, VehicleType.Medium],
    [MapObjectType.Vehicle, VehicleType.Apc],
    [MapObjectType.Vehicle, VehicleType.Crane],
    [MapObjectType.Cannon, CannonType.Gatling],
    [MapObjectType.Cannon, CannonType.Gun],
    [MapObjectType.Cannon, CannonType.Howitzer],
  ],
  [
    [MapObjectType.Robot, RobotType.Grunt],
    [MapObjectType.Robot, RobotType.Psycho],
    [MapObjectType.Robot, RobotType.Sniper],
    [MapObjectType.Robot, RobotType.Tough],
    [MapObjectType.Robot, RobotType.Pyro],
    [MapObjectType.Robot, RobotType.Laser],
    [MapObjectType.Vehicle, VehicleType.Jeep],
    [MapObjectType.Vehicle, VehicleType.Light],
    [MapObjectType.Vehicle, VehicleType.Medium],
    [MapObjectType.Vehicle, VehicleType.Heavy],
    [MapObjectType.Vehicle, VehicleType.Apc],
    [MapObjectType.Vehicle, VehicleType.Crane],
    [MapObjectType.Cannon, CannonType.Gatling],
    [MapObjectType.Cannon, CannonType.Gun],
    [MapObjectType.Cannon, CannonType.Howitzer],
    [MapObjectType.Cannon, CannonType.MissileCannon],
  ],
  [
    [MapObjectType.Robot, RobotType.Grunt],
    [MapObjectType.Robot, RobotType.Psycho],
    [MapObjectType.Robot, RobotType.Sniper],
    [MapObjectType.Robot, RobotType.Tough],
    [MapObjectType.Robot, RobotType.Pyro],
    [MapObjectType.Robot, RobotType.Laser],
    [MapObjectType.Vehicle, VehicleType.Jeep],
    [MapObjectType.Vehicle, VehicleType.Light],
    [MapObjectType.Vehicle, VehicleType.Medium],
    [MapObjectType.Vehicle, VehicleType.Heavy],
    [MapObjectType.Vehicle, VehicleType.Apc],
    [MapObjectType.Vehicle, VehicleType.MissileLauncher],
    [MapObjectType.Vehicle, VehicleType.Crane],
    [MapObjectType.Cannon, CannonType.Gatling],
    [MapObjectType.Cannon, CannonType.Gun],
    [MapObjectType.Cannon, CannonType.Howitzer],
    [MapObjectType.Cannon, CannonType.MissileCannon],
  ],
];

const ROBOT_FACTORY_DEFAULTS: readonly (readonly BuildListDefaultEntry[])[] = [
  [
    [MapObjectType.Robot, RobotType.Grunt],
    [MapObjectType.Cannon, CannonType.Gatling],
  ],
  [
    [MapObjectType.Robot, RobotType.Grunt],
    [MapObjectType.Robot, RobotType.Psycho],
    [MapObjectType.Cannon, CannonType.Gatling],
  ],
  [
    [MapObjectType.Robot, RobotType.Grunt],
    [MapObjectType.Robot, RobotType.Psycho],
    [MapObjectType.Robot, RobotType.Sniper],
    [MapObjectType.Robot, RobotType.Tough],
    [MapObjectType.Cannon, CannonType.Gatling],
    [MapObjectType.Cannon, CannonType.Gun],
  ],
  [
    [MapObjectType.Robot, RobotType.Grunt],
    [MapObjectType.Robot, RobotType.Psycho],
    [MapObjectType.Robot, RobotType.Sniper],
    [MapObjectType.Robot, RobotType.Tough],
    [MapObjectType.Robot, RobotType.Pyro],
    [MapObjectType.Cannon, CannonType.Gatling],
    [MapObjectType.Cannon, CannonType.Gun],
    [MapObjectType.Cannon, CannonType.Howitzer],
  ],
  [
    [MapObjectType.Robot, RobotType.Grunt],
    [MapObjectType.Robot, RobotType.Psycho],
    [MapObjectType.Robot, RobotType.Sniper],
    [MapObjectType.Robot, RobotType.Tough],
    [MapObjectType.Robot, RobotType.Pyro],
    [MapObjectType.Robot, RobotType.Laser],
    [MapObjectType.Cannon, CannonType.Gatling],
    [MapObjectType.Cannon, CannonType.Gun],
    [MapObjectType.Cannon, CannonType.Howitzer],
  ],
  [
    [MapObjectType.Robot, RobotType.Grunt],
    [MapObjectType.Robot, RobotType.Psycho],
    [MapObjectType.Robot, RobotType.Sniper],
    [MapObjectType.Robot, RobotType.Tough],
    [MapObjectType.Robot, RobotType.Pyro],
    [MapObjectType.Robot, RobotType.Laser],
    [MapObjectType.Cannon, CannonType.Gatling],
    [MapObjectType.Cannon, CannonType.Gun],
    [MapObjectType.Cannon, CannonType.Howitzer],
    [MapObjectType.Cannon, CannonType.MissileCannon],
  ],
];

const VEHICLE_FACTORY_DEFAULTS: readonly (readonly BuildListDefaultEntry[])[] = [
  [
    [MapObjectType.Vehicle, VehicleType.Jeep],
    [MapObjectType.Cannon, CannonType.Gatling],
  ],
  [
    [MapObjectType.Vehicle, VehicleType.Jeep],
    [MapObjectType.Vehicle, VehicleType.Light],
    [MapObjectType.Cannon, CannonType.Gatling],
    [MapObjectType.Cannon, CannonType.Gun],
  ],
  [
    [MapObjectType.Vehicle, VehicleType.Jeep],
    [MapObjectType.Vehicle, VehicleType.Light],
    [MapObjectType.Vehicle, VehicleType.Medium],
    [MapObjectType.Cannon, CannonType.Gatling],
    [MapObjectType.Cannon, CannonType.Gun],
  ],
  [
    [MapObjectType.Vehicle, VehicleType.Jeep],
    [MapObjectType.Vehicle, VehicleType.Light],
    [MapObjectType.Vehicle, VehicleType.Medium],
    [MapObjectType.Vehicle, VehicleType.Apc],
    [MapObjectType.Cannon, CannonType.Gatling],
    [MapObjectType.Cannon, CannonType.Gun],
    [MapObjectType.Cannon, CannonType.Howitzer],
  ],
  [
    [MapObjectType.Vehicle, VehicleType.Jeep],
    [MapObjectType.Vehicle, VehicleType.Light],
    [MapObjectType.Vehicle, VehicleType.Medium],
    [MapObjectType.Vehicle, VehicleType.Heavy],
    [MapObjectType.Vehicle, VehicleType.Apc],
    [MapObjectType.Cannon, CannonType.Gatling],
    [MapObjectType.Cannon, CannonType.Gun],
    [MapObjectType.Cannon, CannonType.Howitzer],
  ],
  [
    [MapObjectType.Vehicle, VehicleType.Jeep],
    [MapObjectType.Vehicle, VehicleType.Light],
    [MapObjectType.Vehicle, VehicleType.Medium],
    [MapObjectType.Vehicle, VehicleType.Heavy],
    [MapObjectType.Vehicle, VehicleType.Apc],
    [MapObjectType.Vehicle, VehicleType.MissileLauncher],
    [MapObjectType.Cannon, CannonType.Gatling],
    [MapObjectType.Cannon, CannonType.Gun],
    [MapObjectType.Cannon, CannonType.Howitzer],
    [MapObjectType.Cannon, CannonType.MissileCannon],
  ],
];

const BUILD_LIST_DEFAULTS: ReadonlyMap<
  BuildingType,
  readonly (readonly BuildListDefaultEntry[])[]
> = new Map([
  [BuildingType.FortFront, FORT_FRONT_DEFAULTS],
  [BuildingType.RobotFactory, ROBOT_FACTORY_DEFAULTS],
  [BuildingType.VehicleFactory, VEHICLE_FACTORY_DEFAULTS],
]);

/**
 * Port of upstream `ZBuildList`.
 * Role: Stores production-list data and its global settings dependency.
 * Upstream: zbuildlist.h:27-44
 */
export class BuildList {
  zsettings: (ZSettings & Partial<BuildListUnitSettingsSource>) | null = null;
  buildlistData: BuildListObject[][][];

  constructor() {
    this.buildlistData = Array.from({ length: BuildingType.Max }, () =>
      Array.from({ length: MAX_BUILDING_LEVELS }, () => []),
    );
  }

  /**
   * Port of upstream `ZBuildList::SetZSettings`.
   * Role: Stores the global settings dependency used by build-list calculations.
   * Upstream: zbuildlist.cpp:8-11
   */
  setZSettings(zsettings: ZSettings | null): void {
    this.zsettings = zsettings;
  }

  /**
   * Port of upstream `ZBuildList::ClearData`.
   * Role: Clears every building type and level entry in the production list.
   * Upstream: zbuildlist.cpp:13-20
   */
  clearData(): void {
    for (let i = 0; i < BuildingType.Max; i += 1) {
      for (let j = 0; j < MAX_BUILDING_LEVELS; j += 1) {
        this.buildlistData[i]?.[j]?.splice(0);
      }
    }
  }

  /**
   * Port of upstream `ZBuildList::LoadDefaults`.
   * Role: Loads the default production entries for fort, robot factory, and vehicle factory levels.
   * Upstream: zbuildlist.cpp:22-204
   */
  loadDefaults(): void {
    this.clearData();

    for (const [buildingType, levelDefaults] of BUILD_LIST_DEFAULTS) {
      for (let level = 0; level < levelDefaults.length; level += 1) {
        const buildList = this.buildlistData[buildingType]?.[level];
        if (!buildList) continue;

        for (const [objectType, objectId] of levelDefaults[level]) {
          buildList.push(new BuildListObject(objectType, objectId));
        }
      }
    }
  }

  /**
   * Adapted upstream `ZBuildList::GetBuildList` dependency.
   * Role: Returns the normalized build-list bucket for a building type and level.
   * Upstream: zbuildlist.cpp:206-224
   */
  getBuildList(buildingType: number, level: number): BuildListObject[] {
    let normalizedBuildingType = buildingType;
    let normalizedLevel = level;

    if (normalizedBuildingType >= BuildingType.Max || normalizedBuildingType < 0) {
      normalizedBuildingType = 0;
    }

    if (normalizedLevel >= MAX_BUILDING_LEVELS || normalizedLevel < 0) {
      normalizedLevel = 0;
    }

    if (normalizedBuildingType === BuildingType.FortBack) {
      normalizedBuildingType = BuildingType.FortFront;
    }

    return this.buildlistData[normalizedBuildingType][normalizedLevel];
  }

  /**
   * Port of upstream `ZBuildList::GetFirstUnitInBuildList`.
   * Role: Returns the first production entry for a building type and level.
   * Upstream: zbuildlist.cpp:226-236
   */
  getFirstUnitInBuildList(
    buildingType: number,
    level: number,
  ): BuildListFirstUnitResult {
    const buildList = this.getBuildList(buildingType, level);

    if (!buildList.length) {
      return { hasUnit: false, objectType: 0, objectId: 0 };
    }

    return {
      hasUnit: true,
      objectType: buildList[0].ot,
      objectId: buildList[0].oid,
    };
  }

  /**
   * Port of upstream `ZBuildList::UnitInBuildList`.
   * Role: Reports whether a production entry exists for a building type and level.
   * Upstream: zbuildlist.cpp:238-248
   */
  unitInBuildList(
    buildingType: number,
    level: number,
    objectType: number,
    objectId: number,
  ): boolean {
    const buildList = this.getBuildList(buildingType, level);

    return buildList.some(
      (entry) => entry.ot === objectType && entry.oid === objectId,
    );
  }

  /**
   * Port of upstream `ZBuildList::UnitBuildTime`.
   * Role: Reads the configured build time for an object type/id, or falls back when settings are absent.
   * Upstream: zbuildlist.cpp:250-331
   */
  unitBuildTime(
    objectType: number,
    objectId: number,
    log: (message: string) => void = (): void => undefined,
  ): number {
    if (!this.zsettings?.getUnitSettings) {
      log("ZBuildList::UnitBuildTime:zsettings not set");
      return 5;
    }

    return this.zsettings.getUnitSettings(objectType, objectId).buildTime;
  }
}
