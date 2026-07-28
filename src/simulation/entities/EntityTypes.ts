/**
 * Upstream: zobject.h
 */

declare const zPortraitReferenceBrand: unique symbol;

/**
 * Port of upstream `ZPortrait` forward declaration.
 * Role: Provides a typed reference to the portrait subsystem without requiring the full portrait class definition.
 * Upstream: zobject.h:58
 */
export type ZPortraitReference = {
  readonly [zPortraitReferenceBrand]: "ZPortrait";
};

/**
 * Port of upstream `unit_repair_wp_stage`.
 * Role: Tracks the state machine for a unit entering, using, and leaving repair.
 * Upstream: zobject.h:89-92
 */
export enum UnitRepairWaypointStage {
  GoToEntrance = 0,
  EnterBuilding = 1,
  ExitBuilding = 2,
  Wait = 3,
}

/**
 * Port of upstream `object_mode`.
 * Role: Identifies the current animation or behavior mode of an entity.
 * Upstream: zobject.h:68-75
 */
export enum ObjectMode {
  Null = 0,
  JustPlaced = 1,
  Rotating = 2,
  Stationary = 3,
  RobotWalking = 4,
  RobotStanding = 5,
  RobotCigarette = 6,
  RobotFullScan = 7,
  RobotHeadStretch = 8,
  RobotBeer = 9,
  RobotAttacking = 10,
  RobotPickupUpGrenades = 11,
  RobotPickupDownGrenades = 12,
  CannonAttacking = 13,
  Max = 14,
}

/**
 * Port of upstream `enter_fort_wp_stage`.
 * Role: Tracks the waypoint state for entering and leaving a fort.
 * Upstream: zobject.h:99-102
 */
export enum EnterFortWaypointStage {
  GoToEntrance = 0,
  EnterBuilding = 1,
  ExitBuilding = 2,
}

/**
 * Port of upstream `agro_wp_stage`.
 * Role: Tracks whether an aggressive waypoint is attacking or returning.
 * Upstream: zobject.h:94-97
 */
export enum AggroWaypointStage {
  Attack = 0,
  Return = 1,
}

/**
 * Port of upstream `crane_repair_wp_stage`.
 * Role: Tracks the waypoint state for a crane repair interaction.
 * Upstream: zobject.h:84-87
 */
export enum CraneRepairWaypointStage {
  GoToEntrance = 0,
  EnterBuilding = 1,
  ExitBuilding = 2,
}

/**
 * Port of upstream `waypoint_mode`.
 * Role: Identifies the order type currently assigned to an entity waypoint.
 * Upstream: zobject.h:77-82
 */
export enum WaypointMode {
  Move = 0,
  Enter = 1,
  Attack = 2,
  ForceMove = 3,
  CraneRepair = 4,
  UnitRepair = 5,
  Aggro = 6,
  EnterFort = 7,
  Dodge = 8,
  PickupGrenades = 9,
  Max = 10,
}

/**
 * Port of upstream `driver_info_s`.
 * Role: Stores driver combat state for vehicles that can contain drivers.
 * Upstream: zobject.h:209-213
 */
export type DriverInfo = {
  health: number;
  nextAttackTime: number;
};

/**
 * Port of upstream `fire_missile_info`.
 * Role: Stores delayed missile launch offsets relative to an entity.
 * Upstream: zobject.h:203-207
 */
export type FireMissileInfo = {
  offsetTime: number;
  x: number;
  y: number;
};

/**
 * Port of upstream `object_location`.
 * Role: Stores tile coordinates plus fractional deltas for entity placement.
 * Upstream: zobject.h:197-201
 */
export type ObjectLocation = {
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
};
