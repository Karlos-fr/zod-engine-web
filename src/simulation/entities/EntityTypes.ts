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
 * Port of upstream `ZPath_Finding_AStar::pf_point` reference.
 * Role: Stores one pathfinding point queued for waypoint movement.
 * Upstream: zobject.h:119
 */
export type WaypointPathPoint = {
  x: number;
  y: number;
};

/**
 * Port of upstream `waypoint_information`.
 * Role: Stores the active waypoint movement and pathfinding state for an entity.
 * Upstream: zobject.h:104-152
 */
export class WaypointInformation {
  stage = 0;
  x = 0;
  y = 0;
  sx = 0;
  sy = 0;
  adx = 0;
  ady = 0;
  craneExitX = 0;
  craneExitY = 0;
  agroCenterX = 0;
  agroCenterY = 0;
  fortExitX = 0;
  fortExitY = 0;
  initAttackX = 0;
  initAttackY = 0;
  pathFindingId = 0;
  gotPathfindingResponse = false;
  pathfindingPointList: WaypointPathPoint[] = [];

  clear(): void {
    this.stage = 0;
    this.x = 0;
    this.y = 0;
    this.sx = 0;
    this.sy = 0;
    this.adx = 0;
    this.ady = 0;
    this.craneExitX = 0;
    this.craneExitY = 0;
    this.agroCenterX = 0;
    this.agroCenterY = 0;
    this.fortExitX = 0;
    this.fortExitY = 0;
    this.initAttackX = 0;
    this.initAttackY = 0;
    this.pathFindingId = 0;
    this.gotPathfindingResponse = false;
    this.pathfindingPointList.length = 0;
  }
}

/**
 * Port of upstream `waypoint`.
 * Role: Stores one queued movement or interaction order for an entity.
 * Upstream: zobject.h:157-195
 */
export class Waypoint {
  mode = -1;
  refId = -1;
  x = 0;
  y = 0;
  attackTo = false;
  playerGiven = false;

  clear(): void {
    this.mode = -1;
    this.refId = -1;
    this.x = 0;
    this.y = 0;
    this.attackTo = false;
    this.playerGiven = false;
  }

  equals(other: Waypoint): boolean {
    return (
      other.mode === this.mode &&
      other.refId === this.refId &&
      other.x === this.x &&
      other.y === this.y &&
      other.attackTo === this.attackTo &&
      other.playerGiven === this.playerGiven
    );
  }

  notEquals(other: Waypoint): boolean {
    return !this.equals(other);
  }
}

/**
 * Port of upstream `server_flag`.
 * Role: Stores per-entity network update flags and payload values.
 * Upstream: zobject.h:219-289
 */
export class ServerFlag {
  updatedLocation = false;
  updatedVelocity = false;
  updatedWaypoints = false;
  updatedAttackObject = false;
  updatedAttackObjectHealth = false;
  updatedAttackObjectDriverHealth = false;
  updatedOpenLid = false;
  firedMissile = false;
  missileX = 0;
  missileY = 0;
  enteredTargetRefId = -1;
  buildUnit = false;
  bot = 0;
  buildingObjectId = 0;
  autoRepair = false;
  setCraneAnim = false;
  craneAnimOn = false;
  craneRepairRefId = -1;
  enteredRepairBuildingRefId = -1;
  repairUnit = false;
  robotObjectType = 0;
  robotObjectId = 0;
  repairDriverType = 0;
  repairDriverInfo: DriverInfo[] = [];
  repairWaypointList: Waypoint[] = [];
  recheckLidStatus = false;
  destroyFortBuildingRefId = -1;
  updatedGrenadeAmount = false;
  updatedLeaderGrenadeAmount = false;
  deleteGrenadeBoxRefId = -1;
  doPickupGrenadeAnim = false;
  portraitAnimRefId = -1;
  portraitAnimValue = -1;

  clear(): void {
    this.updatedLocation = false;
    this.updatedVelocity = false;
    this.updatedWaypoints = false;
    this.updatedAttackObject = false;
    this.updatedAttackObjectHealth = false;
    this.updatedAttackObjectDriverHealth = false;
    this.updatedOpenLid = false;
    this.firedMissile = false;
    this.buildUnit = false;
    this.enteredTargetRefId = -1;
    this.autoRepair = false;
    this.setCraneAnim = false;
    this.craneAnimOn = false;
    this.craneRepairRefId = -1;
    this.enteredRepairBuildingRefId = -1;
    this.repairUnit = false;
    this.destroyFortBuildingRefId = -1;
    this.updatedGrenadeAmount = false;
    this.updatedLeaderGrenadeAmount = false;
    this.deleteGrenadeBoxRefId = -1;
    this.doPickupGrenadeAnim = false;
    this.portraitAnimRefId = -1;
    this.portraitAnimValue = -1;
  }
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
