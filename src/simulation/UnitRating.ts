/**
 * Upstream: zunitrating.h
 */

import { MapObjectType } from "../world/MapFormat";
import { CannonType, RobotType, VehicleType } from "./SimulationConstants";

/**
 * Port of upstream `_ZUNITRATING_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: zunitrating.h:2
 */
export const ZUNITRATING_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `unit_cross_reference`.
 * Role: Classifies the expected outcome between two unit types.
 * Upstream: zunitrating.h:4-7
 */
export enum UnitCrossReference {
  WillDie = 0,
  Even = 1,
  WillKill = 2,
}

/**
 * Port of upstream `ZUnitRating::unit_cr`.
 * Role: Stores unit matchup outcomes by attacker object type/id and victim object type/id.
 * Upstream: zunitrating.h:16
 */
export type UnitCrossReferenceTable = number[][][][];

/**
 * Port of upstream `ZUnitRating` matchup table state used by `InsertCrossReference`.
 * Role: Holds the four-dimensional unit cross-reference matrix.
 * Upstream: zunitrating.h:16
 */
export type UnitRatingCrossReferenceState = {
  unitCrossReferences: UnitCrossReferenceTable;
};

export type UnitRatingCrossReferenceAllocationState = {
  unitCrossReferences: UnitCrossReferenceTable | null;
};

/**
 * Port of upstream `ZUnitRating::IsUnit`.
 * Role: Reports whether an object type and id identify a rated combat unit.
 * Upstream: zunitrating.cpp:121-137
 */
export function isUnitForRating(objectType: number, objectId: number): boolean {
  switch (objectType) {
    case MapObjectType.Cannon:
      return objectId >= 0 && objectId < CannonType.Max;
    case MapObjectType.Vehicle:
      return objectId >= 0 && objectId < VehicleType.Max;
    case MapObjectType.Robot:
      return objectId >= 0 && objectId < RobotType.Max;
    default:
      return false;
  }
}

function ensureUnitCrossReferenceBucket(
  table: UnitCrossReferenceTable,
  objectType: number,
  objectId: number,
  targetObjectType: number,
): number[] {
  table[objectType] ??= [];
  table[objectType][objectId] ??= [];
  table[objectType][objectId][targetObjectType] ??= [];

  return table[objectType][objectId][targetObjectType];
}

/**
 * Port of upstream `ZUnitRating::InitMallocUCR`.
 * Role: Allocates the unit matchup table and fills every matchup as even.
 * Upstream: zunitrating.cpp:17-53
 */
export function initUnitCrossReferenceTable(
  state: UnitRatingCrossReferenceAllocationState,
): void {
  if (state.unitCrossReferences) return;

  const maxObjectType =
    Math.max(MapObjectType.Cannon, MapObjectType.Vehicle, MapObjectType.Robot) +
    1;
  const maxObjectId = Math.max(CannonType.Max, VehicleType.Max, RobotType.Max);

  state.unitCrossReferences = Array.from({ length: maxObjectType }, () =>
    Array.from({ length: maxObjectId }, () =>
      Array.from({ length: maxObjectType }, () =>
        Array.from({ length: maxObjectId }, () => UnitCrossReference.Even),
      ),
    ),
  );
}

/**
 * Port of upstream `ZUnitRating::InsertCrossReference`.
 * Role: Stores a unit matchup result and its reversed counterpart.
 * Upstream: zunitrating.cpp:139-147
 */
export function insertUnitCrossReference(
  state: UnitRatingCrossReferenceState,
  attackerObjectType: number,
  attackerObjectId: number,
  victimObjectType: number,
  victimObjectId: number,
  crossReference: UnitCrossReference,
): void {
  ensureUnitCrossReferenceBucket(
    state.unitCrossReferences,
    attackerObjectType,
    attackerObjectId,
    victimObjectType,
  )[victimObjectId] = crossReference;

  let reverseCrossReference = crossReference;
  if (reverseCrossReference === UnitCrossReference.WillDie) {
    reverseCrossReference = UnitCrossReference.WillKill;
  } else if (reverseCrossReference === UnitCrossReference.WillKill) {
    reverseCrossReference = UnitCrossReference.WillDie;
  }

  ensureUnitCrossReferenceBucket(
    state.unitCrossReferences,
    victimObjectType,
    victimObjectId,
    attackerObjectType,
  )[attackerObjectId] = reverseCrossReference;
}

/**
 * Port of upstream `ZUnitRating::InitPopulateUCR`.
 * Role: Populates the default unit matchup table with losing matchups.
 * Upstream: zunitrating.cpp:55-119
 */
export function populateUnitCrossReferenceTable(
  state: UnitRatingCrossReferenceAllocationState,
): void {
  initUnitCrossReferenceTable(state);
  if (!state.unitCrossReferences) return;

  const ratingState = { unitCrossReferences: state.unitCrossReferences };
  const willDie = UnitCrossReference.WillDie;

  insertUnitCrossReference(
    ratingState,
    MapObjectType.Robot,
    RobotType.Grunt,
    MapObjectType.Robot,
    RobotType.Psycho,
    willDie,
  );
  insertUnitCrossReference(
    ratingState,
    MapObjectType.Robot,
    RobotType.Grunt,
    MapObjectType.Robot,
    RobotType.Sniper,
    willDie,
  );
  insertUnitCrossReference(
    ratingState,
    MapObjectType.Robot,
    RobotType.Grunt,
    MapObjectType.Robot,
    RobotType.Tough,
    willDie,
  );
  insertUnitCrossReference(
    ratingState,
    MapObjectType.Robot,
    RobotType.Grunt,
    MapObjectType.Robot,
    RobotType.Pyro,
    willDie,
  );
  insertUnitCrossReference(
    ratingState,
    MapObjectType.Robot,
    RobotType.Grunt,
    MapObjectType.Robot,
    RobotType.Laser,
    willDie,
  );

  for (const cannonType of [
    CannonType.Gatling,
    CannonType.Gun,
    CannonType.Howitzer,
    CannonType.MissileCannon,
  ]) {
    insertUnitCrossReference(
      ratingState,
      MapObjectType.Robot,
      RobotType.Grunt,
      MapObjectType.Cannon,
      cannonType,
      willDie,
    );
  }

  for (const vehicleType of [
    VehicleType.Jeep,
    VehicleType.Light,
    VehicleType.Medium,
    VehicleType.Heavy,
    VehicleType.MissileLauncher,
  ]) {
    insertUnitCrossReference(
      ratingState,
      MapObjectType.Robot,
      RobotType.Grunt,
      MapObjectType.Vehicle,
      vehicleType,
      willDie,
    );
  }

  for (const matchup of [
    [RobotType.Psycho, MapObjectType.Robot, RobotType.Tough],
    [RobotType.Psycho, MapObjectType.Robot, RobotType.Pyro],
    [RobotType.Psycho, MapObjectType.Robot, RobotType.Laser],
    [RobotType.Psycho, MapObjectType.Cannon, CannonType.MissileCannon],
    [RobotType.Psycho, MapObjectType.Vehicle, VehicleType.Medium],
    [RobotType.Psycho, MapObjectType.Vehicle, VehicleType.Heavy],
    [RobotType.Psycho, MapObjectType.Vehicle, VehicleType.MissileLauncher],
    [RobotType.Sniper, MapObjectType.Robot, RobotType.Tough],
    [RobotType.Sniper, MapObjectType.Robot, RobotType.Pyro],
    [RobotType.Sniper, MapObjectType.Robot, RobotType.Laser],
    [RobotType.Sniper, MapObjectType.Cannon, CannonType.MissileCannon],
    [RobotType.Sniper, MapObjectType.Vehicle, VehicleType.MissileLauncher],
    [RobotType.Tough, MapObjectType.Cannon, CannonType.MissileCannon],
    [RobotType.Tough, MapObjectType.Vehicle, VehicleType.MissileLauncher],
    [RobotType.Pyro, MapObjectType.Cannon, CannonType.MissileCannon],
    [RobotType.Pyro, MapObjectType.Vehicle, VehicleType.MissileLauncher],
    [RobotType.Laser, MapObjectType.Cannon, CannonType.MissileCannon],
    [RobotType.Laser, MapObjectType.Vehicle, VehicleType.MissileLauncher],
  ] as const) {
    insertUnitCrossReference(
      ratingState,
      MapObjectType.Robot,
      matchup[0],
      matchup[1],
      matchup[2],
      willDie,
    );
  }

  for (const matchup of [
    [VehicleType.Jeep, MapObjectType.Robot, RobotType.Tough],
    [VehicleType.Jeep, MapObjectType.Robot, RobotType.Pyro],
    [VehicleType.Jeep, MapObjectType.Robot, RobotType.Laser],
    [VehicleType.Jeep, MapObjectType.Cannon, CannonType.Gun],
    [VehicleType.Jeep, MapObjectType.Cannon, CannonType.Howitzer],
    [VehicleType.Jeep, MapObjectType.Cannon, CannonType.MissileCannon],
    [VehicleType.Jeep, MapObjectType.Vehicle, VehicleType.Light],
    [VehicleType.Jeep, MapObjectType.Vehicle, VehicleType.Medium],
    [VehicleType.Jeep, MapObjectType.Vehicle, VehicleType.Heavy],
    [VehicleType.Jeep, MapObjectType.Vehicle, VehicleType.MissileLauncher],
    [VehicleType.Light, MapObjectType.Cannon, CannonType.MissileCannon],
    [VehicleType.Light, MapObjectType.Vehicle, VehicleType.MissileLauncher],
    [VehicleType.Medium, MapObjectType.Vehicle, VehicleType.MissileLauncher],
    [VehicleType.MissileLauncher, MapObjectType.Cannon, CannonType.Howitzer],
  ] as const) {
    insertUnitCrossReference(
      ratingState,
      MapObjectType.Vehicle,
      matchup[0],
      matchup[1],
      matchup[2],
      willDie,
    );
  }
}

/**
 * Port of upstream `ZUnitRating::Init`.
 * Role: Initializes the default unit matchup ratings.
 * Upstream: zunitrating.cpp:12-15
 */
export function initUnitRating(
  state: UnitRatingCrossReferenceAllocationState,
): void {
  populateUnitCrossReferenceTable(state);
}

/**
 * Port of upstream `ZUnitRating::CrossReference`.
 * Role: Returns the rated combat outcome between two unit identifiers.
 * Upstream: zunitrating.cpp:149-157
 */
export function crossReferenceUnits(
  state: { unitCrossReferences: UnitCrossReferenceTable | null },
  attackerObjectType: number,
  attackerObjectId: number,
  victimObjectType: number,
  victimObjectId: number,
): UnitCrossReference {
  if (!state.unitCrossReferences) return UnitCrossReference.Even;

  if (!isUnitForRating(attackerObjectType, attackerObjectId)) {
    return UnitCrossReference.Even;
  }
  if (!isUnitForRating(victimObjectType, victimObjectId)) {
    return UnitCrossReference.Even;
  }

  return (
    state.unitCrossReferences[attackerObjectType]?.[attackerObjectId]?.[
      victimObjectType
    ]?.[victimObjectId] ?? UnitCrossReference.Even
  );
}
