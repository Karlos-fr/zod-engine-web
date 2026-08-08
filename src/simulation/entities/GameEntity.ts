/**
 * Upstream: zobject.h
 */

import type { Vector2 } from "../../world/Vector2";
import type { GameMap } from "../../world/GameMap";
import { ZSettings, ZUnitSettings } from "../../data/ZSettingsData";
import { MAP_ITEM_TYPE_COUNT } from "../../world/WorldConstants";
import { MapObjectType, type MapZoneInfo } from "../../world/MapFormat";
import { CursorType } from "../../input/CursorTiming";
import {
  CraneRepairWaypointStage,
  EnterFortWaypointStage,
  UnitRepairWaypointStage,
  Waypoint,
  WaypointInformation,
  WaypointMode,
  ServerFlag,
  type DriverInfo,
  type ObjectLocation,
} from "./EntityTypes";
import type { DamageMissile } from "../ProjectileConstants";
import {
  BuildingType,
  CannonType,
  ItemType,
  MAX_UNIT_HEALTH,
  PI,
  RobotType,
  TeamType,
  VehicleType,
} from "../SimulationConstants";
import { isZero, pointsWithinDistance } from "../Common";
import { MIN_STAMINA, Z_EPSILON } from "./EntityConstants";
import type {
  AttackObjectPacket,
  ObjectTeamPacket,
  RepairBuildingAnimPacket,
  SetBuildingStatePacket,
} from "../EventHandler";
import type { PathFindingResponse } from "../../world/navigation/PathFindingEngine";
import type { BuildList } from "./BuildList";
import { PortraitAnimationType } from "../PortraitAnimation";

/**
 * Port of upstream `CreateBuildingQueueData` output.
 * Role: Carries serialized building queue data for network updates.
 * Upstream: zobject.h:523
 */
export type BuildingQueueData = {
  data: Uint8Array | null;
  size: number;
};

/**
 * Port of upstream `CreateBuildingStateData` output.
 * Role: Carries serialized building state data for network updates.
 * Upstream: zobject.h:522
 */
export type BuildingStateData = {
  data: Uint8Array | null;
  size: number;
};

/**
 * Port of upstream `CreateRepairAnimData` output.
 * Role: Carries serialized repair animation data for network updates.
 * Upstream: zobject.h:531
 */
export type RepairAnimData = {
  data: RepairBuildingAnimPacket | Uint8Array | null;
  size: number;
};

export type RepairUnitOutput = {
  time: number;
  objectType: number;
  objectId: number;
  driverType: number;
  driverInfo: DriverInfo[];
  waypointList: Waypoint[];
};

/**
 * Port of upstream `CreateBuiltCannonData` output.
 * Role: Carries serialized built-cannon data for network updates.
 * Upstream: zobject.h:529
 */
export type BuiltCannonData = {
  data: Uint8Array | null;
  size: number;
};

export type BuildUnitResult = {
  hasUnit: boolean;
  objectType: number;
  objectId: number;
};

export type ObjectIdResult = {
  objectType: number;
  objectId: number;
};

/**
 * Port of upstream `CreateLocationData` output.
 * Role: Carries an entity reference id and serialized object location state.
 * Upstream: zobject.cpp:3759-3766
 */
export type LocationData = {
  refId: number;
  location: ObjectLocation;
  size: number;
};

/**
 * Port of upstream `CreateAttackObjectData` output.
 * Role: Carries serialized attack-target reference data for network updates.
 * Upstream: zobject.cpp:3768-3782
 */
export type AttackObjectData = {
  packet: AttackObjectPacket;
  size: number;
};

/**
 * Port of upstream `CreateTeamData` output.
 * Role: Carries object owner and driver assignment data for network updates.
 * Upstream: zobject.cpp:4410-4430
 */
export type TeamData = {
  packet: ObjectTeamPacket;
  driverInfo: DriverInfo[];
  size: number;
};

export type GroupInfoPacket = {
  refId: number;
  leaderRefId: number;
  minionRefIds: number[];
};

/**
 * Port of upstream `CreateGroupInfoData` output.
 * Role: Carries serialized robot group relationship data for network updates.
 * Upstream: zobject.cpp:4373-4408
 */
export type GroupInfoData = {
  packet: GroupInfoPacket | null;
  size: number;
};

export type GroupTag = {
  label: string;
  color: {
    r: number;
    g: number;
    b: number;
  };
};

export type CraneEntrance = {
  canEnter: boolean;
  x: number;
  y: number;
  exitX: number;
  exitY: number;
};

export type CraneCenter = {
  hasCenter: boolean;
  x: number;
  y: number;
};

export type RepairCenter = {
  hasCenter: boolean;
  x: number;
  y: number;
};

export type RepairEntrance = {
  x: number;
  y: number;
};

export type BuildingCreationMovePoint = {
  hasPoint: boolean;
  x: number;
  y: number;
};

export type BuildingCreationPoint = {
  hasPoint: boolean;
  x: number;
  y: number;
};

export type EntitySettingsReference = {
  autoGrabVehicleDistance: number;
  autoGrabFlagDistance: number;
};

export type ObjectRenderDepthReference = {
  position: Pick<Vector2, "y">;
  pixelHeight: number;
};

export type EntityBuildListReference = Pick<BuildList, "getFirstUnitInBuildList">;

export type EntityConnectedZoneMap = {
  getZone(x: number, y: number): MapZoneInfo | null;
};

export type EntityWalkSpeedMap = {
  getTileWalkSpeed(x: number, y: number): number;
};

export type EntityEngageBarrierMap = {
  engageBarrierBetweenCoords(x1: number, y1: number, x2: number, y2: number): boolean;
};

export type EntityPortraitAnimationTarget = {
  startAnim(animation: PortraitAnimationType): void;
};

/**
 * Port of upstream `sort_objects_func`.
 * Role: Orders objects by their bottom pixel coordinate for render depth sorting.
 * Upstream: zobject.cpp:4817-4820
 */
export function isObjectBeforeByRenderDepth(
  left: ObjectRenderDepthReference,
  right: ObjectRenderDepthReference,
): boolean {
  return left.position.y + left.pixelHeight < right.position.y + right.pixelHeight;
}

const EMPTY_UNIT_SETTINGS = new ZUnitSettings();

function buildingHealthSetting(zsettings: ZSettings, objectId: number): number {
  switch (objectId) {
    case BuildingType.FortFront:
    case BuildingType.FortBack:
      return zsettings.fortBuildingHealth;
    case BuildingType.Radar:
      return zsettings.radarBuildingHealth;
    case BuildingType.Repair:
      return zsettings.repairBuildingHealth;
    case BuildingType.RobotFactory:
      return zsettings.robotBuildingHealth;
    case BuildingType.VehicleFactory:
      return zsettings.vehicleBuildingHealth;
    case BuildingType.BridgeVertical:
    case BuildingType.BridgeHorizontal:
      return zsettings.bridgeBuildingHealth;
    default:
      return 0;
  }
}

function mapItemHealthSetting(zsettings: ZSettings, objectId: number): number {
  switch (objectId) {
    case ItemType.Rock:
      return zsettings.rockItemHealth;
    case ItemType.Grenades:
      return zsettings.grenadesItemHealth;
    case ItemType.Rockets:
      return zsettings.rocketsItemHealth;
    case ItemType.Hut:
      return zsettings.hutItemHealth;
    default:
      if (
        objectId >= ItemType.Map0 &&
        objectId < ItemType.Map0 + MAP_ITEM_TYPE_COUNT
      ) {
        return zsettings.mapItemHealth;
      }
      return 0;
  }
}

function unitSettingsForTypeId(
  zsettings: ZSettings,
  objectType: number,
  objectId: number,
): ZUnitSettings {
  if (objectType === MapObjectType.Cannon && objectId < CannonType.Max) {
    return zsettings.cannonSettings[objectId];
  }
  if (objectType === MapObjectType.Vehicle && objectId < VehicleType.Max) {
    return zsettings.vehicleSettings[objectId];
  }
  if (objectType === MapObjectType.Robot && objectId < RobotType.Max) {
    return zsettings.robotSettings[objectId];
  }
  return EMPTY_UNIT_SETTINGS;
}

function hasEngageBarrierMap(
  zmap: GameMap | null,
): zmap is GameMap & EntityEngageBarrierMap {
  return (
    zmap !== null &&
    typeof (zmap as Partial<EntityEngageBarrierMap>).engageBarrierBetweenCoords ===
      "function"
  );
}

/**
 * Port of upstream `ZObject::SetHealth` call target for health-percent updates.
 * Role: Applies a concrete health value to an entity after percentage conversion.
 * Upstream: zobject.cpp:309
 */
export type EntityHealthSetter<TMap> = {
  setHealth(health: number, map: TMap): void;
};

/**
 * Port of upstream `ZObject::SetHealthPercent` mutable fields.
 * Role: Holds initial health percentage and maximum health for percent-based health updates.
 * Upstream: zobject.cpp:303-309
 */
export type EntityHealthPercentState<TMap> = EntityHealthSetter<TMap> & {
  initialHealthPercent: number;
  maxHealth: number;
};

/**
 * Port of upstream `ZObject::SetHealthPercent`.
 * Role: Clamps the initial health percentage and applies proportional health.
 * Upstream: zobject.cpp:301-310
 */
export function setEntityHealthPercent<TMap>(
  entity: EntityHealthPercentState<TMap>,
  healthPercent: number,
  map: TMap,
): void {
  const clampedHealthPercent = Math.max(0, Math.min(100, healthPercent));

  entity.initialHealthPercent = clampedHealthPercent;
  entity.setHealth((clampedHealthPercent * entity.maxHealth) / 100, map);
}

/**
 * Browser simulation entity containing the subset of `ZObject` behavior already ported.
 * Role: Owns mutable runtime state for an object in the simulation world.
 * Upstream: zobject.h
 */
export class GameEntity {
  static damageMissileList: DamageMissile[] | null = null;
  static unitLimitReachedList: boolean[] | null = null;
  static groupTags: GroupTag[] = [];

  readonly id: string;
  readonly kind: string;
  objectName = "";
  objectType = 0;
  objectId = 0;
  refId: number;
  position: Vector2;
  direction = 0;
  lastLocation: Vector2;
  lastLocationSetTime = 0;
  locationDeltaX = 0;
  locationDeltaY = 0;
  xOver = 0;
  yOver = 0;
  centerX = 0;
  centerY = 0;
  settings: EntitySettingsReference;
  target: Vector2 | null = null;
  zmap: GameMap | null = null;
  buildList: EntityBuildListReference | null = null;
  attackObject: GameEntity | null = null;
  connectedZone: MapZoneInfo | null = null;
  aiList: GameEntity[] = [];
  leaderObject: GameEntity | null = null;
  minionList: Array<GameEntity | null> = [];
  groupNumber = -1;
  selectableFlag = false;
  canSnipeFlag = false;
  canBeSnipedFlag = false;
  driverType = 0;
  driverInfo: DriverInfo[] = [];
  speedTilesPerSecond = 2;
  moveSpeed = 0;
  realMoveSpeed = 0;
  aiLastSetBuildTime = 0;
  initialHealthPercent = 0;
  health = 0;
  maxHealth = 0;
  attackRadius = 0;
  missileSpeed = 0;
  damage = 0;
  damageChance = 0;
  damageRadius = 0;
  snipeChance = 0;
  damageIntTime = 0;
  lastDamagedByFireTime = 0;
  lastDamagedByMissileTime = 0;
  isRunning = false;
  maxStamina = 0;
  stamina = 0;
  hasLidFlag = false;
  justLeftCannon = false;
  canBeDestroyedFlag = true;
  hasExplosivesFlag = false;
  attackedByExplosivesFlag = false;
  destroyed = false;
  processedDeath = false;
  dontStampFlag = false;
  killMeFlag = false;
  killMeTime = 0;
  doHitEffectFlag = false;
  doDriverHitEffectFlag = false;
  doAutoRepair = false;
  nextAutoRepairTime = 0;
  renderDeathTime = 0;
  showWaypointsFlag = false;
  waypointCursorType = CursorType.Placed;
  width = 0;
  height = 0;
  pixelWidth = 0;
  pixelHeight = 0;
  waypointList: Waypoint[] = [];
  currentWaypointInfo = new WaypointInformation();
  currentWaypoint = new Waypoint();
  lastWaypoint = new Waypoint();
  serverFlags = new ServerFlag();
  owner: TeamType;

  constructor(options: {
    id: string;
    kind: string;
    position: Vector2;
    owner?: TeamType;
    refId?: number;
    objectType?: number;
    objectId?: number;
    settings?: EntitySettingsReference;
  }) {
    this.id = options.id;
    this.kind = options.kind;
    this.objectType = options.objectType ?? 0;
    this.objectId = options.objectId ?? 0;
    this.refId = options.refId ?? 0;
    this.position = { ...options.position };
    this.lastLocation = { ...options.position };
    this.settings = options.settings ?? {
      autoGrabVehicleDistance: 0,
      autoGrabFlagDistance: 0,
    };
    this.owner = options.owner ?? TeamType.Null;
  }

  issueMoveOrder(target: Vector2): void {
    this.target = { ...target };
  }

  /**
   * Port of upstream `ZObject::PlaySelectedWav`.
   * Role: Provides the base selection sound hook for object subclasses.
   * Upstream: zobject.cpp:391-398
   */
  playSelectedWav(): void {}

  /**
   * Port of upstream `ZObject::PlaySelectedAnim`.
   * Role: Starts one of the standard selection portrait animations.
   * Upstream: zobject.cpp:400-409
   */
  playSelectedAnim(
    portrait: EntityPortraitAnimationTarget,
    randomInt: () => number = () => Math.floor(Math.random() * 2147483647),
  ): void {
    switch (Math.trunc(randomInt()) % 4) {
      case 0:
        portrait.startAnim(PortraitAnimationType.YesSir);
        break;
      case 1:
        portrait.startAnim(PortraitAnimationType.YesSir3);
        break;
      case 2:
        portrait.startAnim(PortraitAnimationType.UnitReporting1);
        break;
      case 3:
        portrait.startAnim(PortraitAnimationType.UnitReporting2);
        break;
    }
  }

  /**
   * Port of upstream `ZObject::PlayAcknowledgeWav`.
   * Role: Base acknowledge sound hook; upstream base leaves audio playback disabled.
   * Upstream: zobject.cpp:411-418
   */
  playAcknowledgeWav(): void {}

  /**
   * Port of upstream `ZObject::PlayAcknowledgeAnim`.
   * Role: Starts a command acknowledgement or refusal portrait animation.
   * Upstream: zobject.cpp:420-449
   */
  playAcknowledgeAnim(
    portrait: EntityPortraitAnimationTarget,
    noWay: boolean,
    randomInt: () => number = () => Math.floor(Math.random() * 2147483647),
  ): void {
    if (noWay) {
      switch (Math.trunc(randomInt()) % 3) {
        case 0:
          portrait.startAnim(PortraitAnimationType.ForgetIt);
          break;
        case 1:
          portrait.startAnim(PortraitAnimationType.GetOuttaHere);
          break;
        case 2:
          portrait.startAnim(PortraitAnimationType.NoWay);
          break;
      }
      return;
    }

    switch (Math.trunc(randomInt()) % 12) {
      case 0:
        portrait.startAnim(PortraitAnimationType.WereOnOurWay);
        break;
      case 1:
        portrait.startAnim(PortraitAnimationType.HereWeGo);
        break;
      case 2:
        portrait.startAnim(PortraitAnimationType.YouveGotIt);
        break;
      case 3:
        portrait.startAnim(PortraitAnimationType.MovingIn);
        break;
      case 4:
        portrait.startAnim(PortraitAnimationType.Okay);
        break;
      case 5:
        portrait.startAnim(PortraitAnimationType.Alright);
        break;
      case 6:
        portrait.startAnim(PortraitAnimationType.NoProblem);
        break;
      case 7:
        portrait.startAnim(PortraitAnimationType.OverNOut);
        break;
      case 8:
        portrait.startAnim(PortraitAnimationType.Affirmative);
        break;
      case 9:
        portrait.startAnim(PortraitAnimationType.GoingIn);
        break;
      case 10:
        portrait.startAnim(PortraitAnimationType.LetsDoIt);
        break;
      case 11:
        portrait.startAnim(PortraitAnimationType.LetsGetEm);
        break;
    }
  }

  /**
   * Port of upstream `ZObject::FireMissile`.
   * Role: Provides the base missile firing hook for combat-capable objects.
   * Upstream: zobject.cpp:266-269
   */
  fireMissile(x: number, y: number): void {
    void x;
    void y;
  }

  /**
   * Port of upstream `ZObject::FireTurrentMissile`.
   * Role: Base hook for turret missile effects; unsupported entities ignore it.
   * Upstream: zobject.cpp:4095-4098
   */
  fireTurrentMissile(x: number, y: number, offsetTime: number): void {
    void x;
    void y;
    void offsetTime;
  }

  /**
   * Port of upstream `ZObject::EstimateMissileTarget`.
   * Role: Predicts the intercept point for a moving target using this entity's missile speed.
   * Upstream: zobject.cpp:1860-1988
   */
  estimateMissileTarget(target: GameEntity): Vector2 | null {
    if (this.missileSpeed <= 0) {
      return null;
    }

    if (isZero(target.locationDeltaX) && isZero(target.locationDeltaY)) {
      return null;
    }

    const dx = target.locationDeltaX;
    const dy = target.locationDeltaY;
    const xo = target.centerX;
    const yo = target.centerY;
    const x2o = this.centerX;
    const y2o = this.centerY;
    const cu = yo - y2o;
    const cd = xo - x2o;

    const a = cu * cu + cd * cd;
    const b = 2 * cu * cd * dy - 2 * cu * cu * dx;
    const c =
      cd * cd * dy * dy -
      2 * cu * cd * dx +
      cu * cu * dx * dx -
      cd * cd * this.missileSpeed * this.missileSpeed;
    const determinant = b * b - 4 * a * c;

    if (determinant <= 0.00001 || isZero(a)) {
      return null;
    }

    const determinantRoot = Math.sqrt(determinant);
    let dx2 = (-b - determinantRoot) / (2 * a);
    let dy2Guts = this.missileSpeed * this.missileSpeed - dx2 * dx2;

    if (dy2Guts <= 0.00001) {
      dx2 = (-b + determinantRoot) / (2 * a);
      dy2Guts = this.missileSpeed * this.missileSpeed - dx2 * dx2;

      if (dy2Guts <= 0.00001) {
        return null;
      }
    }

    let dy2 = Math.sqrt(dy2Guts);
    let dd = dx - dx2;
    let t: number;

    if (!isZero(dd)) {
      t = -cd / dd;
    } else {
      dd = dy - dy2;
      if (!isZero(dd)) {
        t = -cu / dd;
      } else {
        return null;
      }
    }

    if (t < 0) {
      dx2 = (-b + determinantRoot) / (2 * a);
      dy2Guts = this.missileSpeed * this.missileSpeed - dx2 * dx2;

      if (dy2Guts <= 0.00001) {
        return null;
      }

      dy2 = Math.sqrt(dy2Guts);
      dd = dx - dx2;

      if (!isZero(dd)) {
        t = -cd / dd;
      } else {
        dd = dy - dy2;
        if (!isZero(dd)) {
          t = -cu / dd;
        } else {
          return null;
        }
      }

      if (t < 0) {
        return null;
      }
    }

    return {
      x: Math.trunc(dx * t + xo),
      y: Math.trunc(dy * t + yo),
    };
  }

  /**
   * Port of upstream `ZObject::Process`.
   * Role: Provides the base per-tick processing hook for object subclasses.
   * Upstream: zobject.cpp:1023-1027
   */
  process(): number {
    return 0;
  }

  /**
   * Port of upstream `ZObject::AttemptStartRun`.
   * Role: Starts running when stamina and the upstream random gate allow it.
   * Upstream: zobject.cpp:2093-2105
   */
  attemptStartRun(
    randomInt: () => number = () => Math.floor(Math.random() * 2147483647),
  ): void {
    if (this.isRunning) {
      return;
    }

    if (Math.trunc(randomInt()) % 5 === 0) {
      return;
    }

    if (this.stamina < MIN_STAMINA) {
      return;
    }

    this.isRunning = true;
  }

  /**
   * Port of upstream `AttemptStartRun`.
   * Role: Starts running toward a target only when current stamina can reach it.
   * Upstream: zobject.h:555
   */
  attemptStartRunTo(
    x: number,
    y: number,
    randomInt: () => number = () => Math.floor(Math.random() * 2147483647),
  ): void {
    if (this.canReachTargetRunning(x, y)) {
      this.attemptStartRun(randomInt);
    }
  }

  /**
   * Port of upstream `ZObject::ProcessRunStamina`.
   * Role: Drains stamina while running and recharges it while not running.
   * Upstream: zobject.cpp:2073-2091
   */
  processRunStamina(timeDifference: number, runRechargeRate: number): void {
    if (this.isRunning) {
      this.stamina -= timeDifference;

      if (this.stamina < 0) {
        this.stamina = 0;
        this.isRunning = false;
      }
      return;
    }

    this.stamina += timeDifference * runRechargeRate;

    if (this.stamina > this.maxStamina) {
      this.stamina = this.maxStamina;
    }
  }

  /**
   * Port of upstream `ZObject::SetTarget`.
   * Role: Stores the current movement target and absolute travel offsets.
   * Upstream: zobject.cpp:3408-3421
   */
  setTarget(x: number, y: number): void {
    this.currentWaypointInfo.x = x;
    this.currentWaypointInfo.y = y;
    this.currentWaypointInfo.sx = this.centerX;
    this.currentWaypointInfo.sy = this.centerY;
    this.currentWaypointInfo.adx = Math.abs(this.currentWaypointInfo.x - this.currentWaypointInfo.sx);
    this.currentWaypointInfo.ady = Math.abs(this.currentWaypointInfo.y - this.currentWaypointInfo.sy);
  }

  /**
   * Port of upstream `ZObject::SetTarget`.
   * Role: Sets the movement target from the current waypoint information.
   * Upstream: zobject.h:511
   */
  setTargetFromCurrentWaypoint(): void {
    this.setTarget(this.currentWaypointInfo.x, this.currentWaypointInfo.y);
  }

  /**
   * Port of upstream `ZObject::ReachedTarget`.
   * Role: Checks whether movement has reached or passed the current waypoint target.
   * Upstream: zobject.cpp:3423-3473
   */
  reachedTarget(): boolean {
    if (
      this.centerX === this.currentWaypointInfo.x &&
      this.centerY === this.currentWaypointInfo.y
    ) {
      this.xOver = 0;
      this.yOver = 0;
      return true;
    }

    if (
      Math.abs(this.centerX - this.currentWaypointInfo.sx) >=
        this.currentWaypointInfo.adx &&
      Math.abs(this.centerY - this.currentWaypointInfo.sy) >=
        this.currentWaypointInfo.ady
    ) {
      this.position.x = this.currentWaypointInfo.x - (this.pixelWidth >> 1);
      this.position.y = this.currentWaypointInfo.y - (this.pixelHeight >> 1);
      this.centerX = this.currentWaypointInfo.x;
      this.centerY = this.currentWaypointInfo.y;
      this.xOver = 0;
      this.yOver = 0;
      return true;
    }

    return false;
  }

  /**
   * Port of upstream `SetLastSetAIBuildTime`.
   * Role: Records when AI production timing was last updated for this entity.
   * Upstream: zobject.h:563
   */
  setLastAiBuildTime(value: number): void {
    this.aiLastSetBuildTime = value;
  }

  /**
   * Port of upstream `GetLastSetAIBuildTime`.
   * Role: Reads the entity's last AI production timing update.
   * Upstream: zobject.h:562
   */
  getLastAiBuildTime(): number {
    return this.aiLastSetBuildTime;
  }

  /**
   * Port of upstream `GetInitialHealthPercent`.
   * Role: Reports the entity health percentage captured at spawn or load time.
   * Upstream: zobject.h:433
   */
  getInitialHealthPercent(): number {
    return this.initialHealthPercent;
  }

  /**
   * Port of upstream `ZObject::GetHealth`.
   * Role: Reports the entity's current health.
   * Upstream: zobject.cpp:291-294
   */
  getHealth(): number {
    return this.health;
  }

  /**
   * Port of upstream `ZObject::DoReviveEffect`.
   * Role: Base hook for revive effects when health changes from dead to alive.
   * Upstream: zobject.cpp:261-264
   */
  doReviveEffect(
    currentTime?: number,
    effectList?: unknown,
    randomInt?: (maxExclusive: number) => number,
  ): void {
    void currentTime;
    void effectList;
    void randomInt;
  }

  /**
   * Port of upstream `ZObject::GetMaxHealth`.
   * Role: Reports the maximum health configured for this entity.
   * Upstream: zobject.cpp:296-299
   */
  getMaxHealth(): number {
    return this.maxHealth;
  }

  /**
   * Port of upstream `ZObject::RecalcBuildTime`.
   * Role: Reports whether this entity recalculated production build timing.
   * Upstream: zobject.cpp:4496-4499
   */
  recalcBuildTime(): boolean {
    return false;
  }

  /**
   * Port of upstream `ZObject::ResetBuildTime`.
   * Role: Base hook for resetting production timing after zone ownership changes.
   * Upstream: zobject.cpp:4491-4494
   */
  resetBuildTime(zoneOwnage: number): boolean {
    void zoneOwnage;
    return false;
  }

  /**
   * Port of upstream `GetCords`.
   * Role: Returns the entity's current world coordinates.
   * Upstream: zobject.h:407
   */
  getCoordinates(): Vector2 {
    return { ...this.position };
  }

  /**
   * Port of upstream `ZObject::SetDirection`.
   * Role: Stores the object's current facing direction.
   * Upstream: zobject.cpp:968-971
   */
  setDirection(direction: number): void {
    this.direction = direction;
  }

  /**
   * Port of upstream `ZObject::DirectionFromLoc`.
   * Role: Converts a movement vector into the object's eight-way facing direction.
   * Upstream: zobject.cpp:3834-3864
   */
  directionFromLocation(deltaX: number, deltaY: number): number {
    if (isZero(deltaX) && isZero(deltaY)) {
      return -1;
    }

    let angle = Math.atan2(deltaY, deltaX);
    if (angle < 0) {
      angle += Math.PI + Math.PI;
    }
    angle += (Math.PI * 1) / 8;

    if (angle < Math.PI / 4) return 0;
    if (angle < Math.PI / 2) return 7;
    if (angle < (Math.PI * 3) / 4) return 6;
    if (angle < Math.PI) return 5;
    if (angle < (5 * Math.PI) / 4) return 4;
    if (angle < (6 * Math.PI) / 4) return 3;
    if (angle < (7 * Math.PI) / 4) return 2;
    if (angle < 2 * Math.PI) return 1;
    return 0;
  }

  /**
   * Port of upstream `ZObject::RecalcDirection`.
   * Role: Refreshes the object's facing direction from current movement velocity.
   * Upstream: zobject.cpp:3823-3832
   */
  recalcDirection(): void {
    const newDirection = this.directionFromLocation(
      this.locationDeltaX,
      this.locationDeltaY,
    );

    if (newDirection !== -1) {
      this.direction = newDirection;
    }
  }

  /**
   * Port of upstream `ZObject::DistanceFromCoords`.
   * Role: Measures distance from this entity's location to a world coordinate.
   * Upstream: zobject.cpp:911-919
   */
  distanceFromCoordinates(x: number, y: number): number {
    const dx = this.position.x - x;
    const dy = this.position.y - y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Port of upstream `ZObject::DistanceFromObject`.
   * Role: Measures center-to-center distance between two objects.
   * Upstream: zobject.cpp:921-931
   */
  distanceFromObject(object: GameEntity): number {
    const dx = this.centerX - object.centerX;
    const dy = this.centerY - object.centerY;

    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Port of upstream `ZObject::NearestObjectFromList`.
   * Role: Finds the object with the shortest center-to-center distance from this object.
   * Upstream: zobject.cpp:3922-3943
   */
  nearestObjectFromList(objectList: GameEntity[]): GameEntity | null {
    if (!objectList.length) {
      return null;
    }

    let objectChoice = objectList[0];
    let leastDistance = this.distanceFromObject(objectChoice);

    for (let i = 1; i < objectList.length; i += 1) {
      const object = objectList[i];
      const thisDistance = this.distanceFromObject(object);

      if (thisDistance < leastDistance) {
        leastDistance = thisDistance;
        objectChoice = object;
      }
    }

    return objectChoice;
  }

  /**
   * Port of upstream `ZObject::NearestObjectToCoords`.
   * Role: Finds the object with the shortest distance from its coordinates to a point.
   * Upstream: zobject.cpp:3958-3980
   */
  nearestObjectToCoordinates(
    objectList: GameEntity[],
    x: number,
    y: number,
  ): GameEntity | null {
    if (!objectList.length) {
      return null;
    }

    let objectChoice = objectList[0];
    let leastDistance = objectChoice.distanceFromCoordinates(x, y);

    for (const object of objectList) {
      const thisDistance = object.distanceFromCoordinates(x, y);

      if (thisDistance < leastDistance) {
        leastDistance = thisDistance;
        objectChoice = object;
      }
    }

    return objectChoice;
  }

  /**
   * Port of upstream `ZObject::NearestSelectableObject`.
   * Role: Finds the nearest non-minion object of a type owned by a team.
   * Upstream: zobject.cpp:3996-4035
   */
  nearestSelectableObject(
    objectList: Array<GameEntity | null>,
    unitType: number,
    onlyTeam: TeamType,
    x: number,
    y: number,
  ): GameEntity | null {
    let objectChoice: GameEntity | null = null;
    let leastDistance = 0;

    for (const object of objectList) {
      if (!object) continue;
      if (object.getOwner() !== onlyTeam) continue;
      if (object.isMinion()) continue;

      const objectId = object.getObjectId();
      if (objectId.objectType !== unitType) continue;

      if (!objectChoice) {
        objectChoice = object;
        leastDistance = objectChoice.distanceFromCoordinates(x, y);
        continue;
      }

      const thisDistance = object.distanceFromCoordinates(x, y);
      if (thisDistance < leastDistance) {
        objectChoice = object;
        leastDistance = thisDistance;
      }
    }

    return objectChoice;
  }

  /**
   * Port of upstream `ZObject::NextSelectableObjectAboveID`.
   * Role: Finds the first selectable entity above a minimum reference id.
   * Upstream: zobject.cpp:4037-4054
   */
  nextSelectableObjectAboveId(
    objectList: Array<GameEntity | null>,
    unitType: number,
    onlyTeam: TeamType,
    minRefId: number,
  ): GameEntity | null {
    for (const object of objectList) {
      if (!object) continue;
      if (object.getRefId() <= minRefId) continue;
      if (object.getOwner() !== onlyTeam) continue;
      if (object.isMinion()) continue;

      const objectId = object.getObjectId();
      if (objectId.objectType !== unitType) continue;

      return object;
    }

    return null;
  }

  /**
   * Port of upstream `ZObject::SetCords`.
   * Role: Sets world coordinates and refreshes cached center coordinates.
   * Upstream: zobject.cpp:973-983
   */
  setCoordinates(x: number, y: number): void {
    this.position = { x, y };
    this.centerX = x + (this.pixelWidth >> 1);
    this.centerY = y + (this.pixelHeight >> 1);
  }

  /**
   * Port of upstream `ZObject::SetLoc`.
   * Role: Applies an object location update and refreshes movement and center caches.
   * Upstream: zobject.cpp:3784-3805
   */
  setLocation(location: ObjectLocation, theTime: number): void {
    const deltaChanged =
      location.deltaX !== this.locationDeltaX ||
      location.deltaY !== this.locationDeltaY;

    this.position = { x: location.x, y: location.y };
    this.locationDeltaX = location.deltaX;
    this.locationDeltaY = location.deltaY;

    if (deltaChanged) {
      this.recalcDirection();
    }

    this.lastLocation = { ...this.position };
    this.lastLocationSetTime = theTime;
    this.centerX = this.position.x + (this.pixelWidth >> 1);
    this.centerY = this.position.y + (this.pixelHeight >> 1);
  }

  /**
   * Port of upstream `ZObject::SmoothMove`.
   * Role: Estimates the entity's current pixel position from its last known location and velocity.
   * Upstream: zobject.cpp:3807-3821
   */
  smoothMove(theTime: number): void {
    if (!isZero(this.locationDeltaX)) {
      this.position.x =
        this.lastLocation.x +
        Math.floor(this.locationDeltaX * (theTime - this.lastLocationSetTime));
    }

    if (!isZero(this.locationDeltaY)) {
      this.position.y =
        this.lastLocation.y +
        Math.floor(this.locationDeltaY * (theTime - this.lastLocationSetTime));
    }

    this.centerX = this.position.x + (this.pixelWidth >> 1);
    this.centerY = this.position.y + (this.pixelHeight >> 1);
  }

  /**
   * Port of upstream `ZObject::CanMove`.
   * Role: Reports whether this entity has non-zero movement speed.
   * Upstream: zobject.cpp:4777-4780
   */
  canMove(): boolean {
    return Boolean(this.speedTilesPerSecond);
  }

  /**
   * Port of upstream `ZObject::HasProcessedDeath`.
   * Role: Reports whether this entity's death handling has already run.
   * Upstream: zobject.cpp:4723-4726
   */
  hasProcessedDeath(): boolean {
    return this.processedDeath;
  }

  /**
   * Port of upstream `ZObject::SetHasProcessedDeath`.
   * Role: Stores whether this entity's death handling has already run.
   * Upstream: zobject.cpp:4728-4731
   */
  setHasProcessedDeath(processedDeath: boolean): void {
    this.processedDeath = processedDeath;
  }

  /**
   * Port of upstream `ZObject::CanOverwriteWP`.
   * Role: Reports whether the active waypoint can be replaced by a new order.
   * Upstream: zobject.cpp:3359-3389
   */
  canOverwriteWaypoint(): boolean {
    if (!this.waypointList.length) {
      return true;
    }

    const [waypoint] = this.waypointList;

    switch (waypoint.mode) {
      case WaypointMode.ForceMove:
        return false;
      case WaypointMode.CraneRepair:
        return this.currentWaypointInfo.stage === CraneRepairWaypointStage.GoToEntrance;
      case WaypointMode.UnitRepair:
        return (
          this.currentWaypointInfo.stage === UnitRepairWaypointStage.GoToEntrance ||
          this.currentWaypointInfo.stage === UnitRepairWaypointStage.Wait
        );
      case WaypointMode.EnterFort:
        return this.currentWaypointInfo.stage === EnterFortWaypointStage.GoToEntrance;
      default:
        return true;
    }
  }

  /**
   * Port of upstream `ZObject::KillWP`.
   * Role: Removes a queued waypoint and clears movement tied to the previous waypoint.
   * Upstream: zobject.cpp:3346-3357
   */
  killWaypoint(index: number): void {
    this.serverFlags.updatedWaypoints = true;
    this.waypointList.splice(index, 1);

    this.stopMove();
    this.lastWaypoint.clear();
  }

  /**
   * Port of upstream `ZObject::CanSetWaypoints`.
   * Role: Reports whether this base entity accepts waypoint orders.
   * Upstream: zobject.cpp:4772-4775
   */
  canSetWaypoints(): boolean {
    return false;
  }

  /**
   * Port of upstream `ZObject::ShowWaypoints`.
   * Role: Enables temporary waypoint rendering and selects the cursor for the last waypoint.
   * Upstream: zobject.cpp:1073-1116
   */
  showWaypoints(theTime: number): void {
    this.renderDeathTime = theTime + 3.0;
    this.showWaypointsFlag = true;

    const lastWaypoint = this.waypointList[this.waypointList.length - 1];

    if (!lastWaypoint) {
      this.waypointCursorType = CursorType.Placed;
      return;
    }

    switch (lastWaypoint.mode) {
      case WaypointMode.Move:
      case WaypointMode.ForceMove:
      case WaypointMode.EnterFort:
      case WaypointMode.Dodge:
        this.waypointCursorType = CursorType.Placed;
        break;
      case WaypointMode.PickupGrenades:
        this.waypointCursorType = CursorType.Grabbed;
        break;
      case WaypointMode.Enter:
        this.waypointCursorType = CursorType.Entered;
        break;
      case WaypointMode.Attack:
      case WaypointMode.Aggro:
        this.waypointCursorType = CursorType.Attacked;
        break;
      case WaypointMode.CraneRepair:
      case WaypointMode.UnitRepair:
        this.waypointCursorType = CursorType.Repaired;
        break;
      default:
        this.waypointCursorType = CursorType.Placed;
        break;
    }
  }

  /**
   * Port of upstream `ZObject::IsMoving`.
   * Role: Reports whether the object's location delta is outside the stopped epsilon.
   * Upstream: zobject.cpp:1601-1606
   */
  isMoving(): boolean {
    return !(
      this.locationDeltaX > -Z_EPSILON &&
      this.locationDeltaX < Z_EPSILON &&
      this.locationDeltaY > -Z_EPSILON &&
      this.locationDeltaY < Z_EPSILON
    );
  }

  /**
   * Port of upstream `ZObject::StopMove`.
   * Role: Stops active movement and marks velocity for network update.
   * Upstream: zobject.cpp:3391-3406
   */
  stopMove(): boolean {
    if (!this.isMoving()) {
      return false;
    }

    this.locationDeltaX = 0;
    this.locationDeltaY = 0;
    this.serverFlags.updatedVelocity = true;

    return true;
  }

  /**
   * Port of upstream `ZObject::SpeedOffsetPercent`.
   * Role: Measures current movement speed as a fraction of base movement speed.
   * Upstream: zobject.cpp:4501-4507
   */
  speedOffsetPercent(): number {
    if (!this.moveSpeed) return 1.0;
    if (!this.isMoving()) return 1.0;

    return (
      Math.sqrt(
        this.locationDeltaX * this.locationDeltaX +
          this.locationDeltaY * this.locationDeltaY,
      ) / this.moveSpeed
    );
  }

  /**
   * Port of upstream `SpeedOffsetPercentInv`.
   * Role: Returns the inverse of the current movement speed fraction.
   * Upstream: zobject.h:480
   */
  speedOffsetPercentInv(): number {
    return 1.0 / this.speedOffsetPercent();
  }

  /**
   * Port of upstream `ZObject::InitRealMoveSpeed`.
   * Role: Initializes terrain-adjusted movement speed at the entity center.
   * Upstream: zobject.cpp:237-244
   */
  initRealMoveSpeed(tmap: EntityWalkSpeedMap): void {
    this.realMoveSpeed =
      this.moveSpeed * tmap.getTileWalkSpeed(this.centerX, this.centerY);
  }

  /**
   * Port of upstream `ZObject::CanReachTargetRunning`.
   * Role: Estimates whether current stamina can cover the distance to a target.
   * Upstream: zobject.cpp:2063-2071
   */
  canReachTargetRunning(x: number, y: number): boolean {
    return pointsWithinDistance(
      this.centerX,
      this.centerY,
      x,
      y,
      this.moveSpeed * this.stamina,
    );
  }

  /**
   * Port of upstream `ZObject::SetVelocity`.
   * Role: Updates movement velocity toward the current waypoint target.
   * Upstream: zobject.cpp:3570-3660
   */
  setVelocity(targetObject: GameEntity | null = null): void {
    void targetObject;

    const oldDeltaX = this.locationDeltaX;
    const oldDeltaY = this.locationDeltaY;

    if (this.waypointList.length) {
      this.locationDeltaX = this.currentWaypointInfo.x - this.centerX;
      this.locationDeltaY = this.currentWaypointInfo.y - this.centerY;

      if (!isZero(this.locationDeltaX) || !isZero(this.locationDeltaY)) {
        const magnitude = Math.sqrt(
          this.locationDeltaX * this.locationDeltaX +
            this.locationDeltaY * this.locationDeltaY,
        );

        this.locationDeltaX = (this.locationDeltaX / magnitude) * this.realMoveSpeed;
        this.locationDeltaY = (this.locationDeltaY / magnitude) * this.realMoveSpeed;
      }
    } else {
      this.stopMove();
    }

    if (Math.abs(this.locationDeltaX - oldDeltaX) < 0.1) {
      this.locationDeltaX = oldDeltaX;
    }

    if (Math.abs(this.locationDeltaY - oldDeltaY) < 0.1) {
      this.locationDeltaY = oldDeltaY;
    }

    if (this.locationDeltaX !== oldDeltaX || this.locationDeltaY !== oldDeltaY) {
      this.serverFlags.updatedVelocity = true;
    }
  }

  /**
   * Port of upstream `ZObject::PostPathFindingResult`.
   * Role: Applies a completed pathfinding response to the active waypoint.
   * Upstream: zobject.cpp:4794-4815
   */
  postPathFindingResult(response: PathFindingResponse | null): void {
    if (!response) return;
    if (response.threadId !== this.currentWaypointInfo.pathFindingId) return;

    this.currentWaypointInfo.gotPathfindingResponse = true;
    this.currentWaypointInfo.pathfindingPointList =
      response.pathFindingPointList.map((point) => ({ ...point }));
    this.currentWaypointInfo.pathFindingId = 0;

    const [nextPoint] = this.currentWaypointInfo.pathfindingPointList;
    if (!nextPoint) return;

    this.setTarget(nextPoint.x, nextPoint.y);
    this.setVelocity();
    this.currentWaypointInfo.pathfindingPointList.shift();
  }

  /**
   * Port of upstream `ZObject::DodgeMissile`.
   * Role: Queues or updates a dodge waypoint away from an incoming missile threat.
   * Upstream: zobject.cpp:3662-3719
   */
  dodgeMissile(
    tx: number,
    ty: number,
    timeTillExplode: number,
    zsettings: Pick<ZSettings, "runUnitSpeed"> = { runUnitSpeed: 1 },
    randomInt: () => number = () => Math.floor(Math.random() * 2147483647),
  ): boolean {
    void tx;
    void ty;

    if (!this.canOverwriteWaypoint()) return false;
    if (this.moveSpeed <= 0) return false;
    if (this.realMoveSpeed <= 0) return false;
    if (this.objectType === MapObjectType.Robot && this.attackObject) return false;
    if (this.owner === TeamType.Null) return false;

    let distance = timeTillExplode * this.realMoveSpeed;
    if (timeTillExplode <= this.stamina) {
      distance *= zsettings.runUnitSpeed;
    }

    let minimumMoveDistance = Math.trunc((distance * 2.0) / 4.0);
    const fixedMoveDistance = Math.trunc((distance * 4.0) / 4.0);
    if (minimumMoveDistance <= 0) minimumMoveDistance = 1;

    const moveDistance =
      fixedMoveDistance + (Math.trunc(randomInt()) % minimumMoveDistance);
    const angleRandom = Math.trunc(randomInt()) % 1000;
    const theta = (2 * PI) * (1000.0 / angleRandom);
    const x = Math.trunc(this.centerX + moveDistance * Math.cos(theta));
    const y = Math.trunc(this.centerY + moveDistance * Math.sin(theta));

    if (this.waypointList.length && this.waypointList[0].mode === WaypointMode.Dodge) {
      this.waypointList[0].x = x;
      this.waypointList[0].y = y;
    } else {
      const dodgeWaypoint = new Waypoint();
      dodgeWaypoint.mode = WaypointMode.Dodge;
      dodgeWaypoint.refId = -1;
      dodgeWaypoint.x = x;
      dodgeWaypoint.y = y;
      this.waypointList.unshift(dodgeWaypoint);
    }

    return true;
  }

  /**
   * Port of upstream `GetAttackRadius`.
   * Role: Reports the attack radius for targeting and weapon checks.
   * Upstream: zobject.h:446
   */
  getAttackRadius(): number {
    return this.attackRadius;
  }

  /**
   * Port of upstream `ZObject::GetHoverName`.
   * Role: Returns the hover label for a producible combat object type.
   * Upstream: zobject.cpp:517-556
   */
  getHoverName(objectType: number, objectId: number): string {
    switch (objectType) {
      case MapObjectType.Cannon:
        switch (objectId) {
          case CannonType.Gatling:
            return "Gatling";
          case CannonType.Gun:
            return "Gun";
          case CannonType.Howitzer:
            return "Howitzer";
          case CannonType.MissileCannon:
            return "Missile";
        }
        break;
      case MapObjectType.Vehicle:
        switch (objectId) {
          case VehicleType.Jeep:
            return "Jeep";
          case VehicleType.Light:
            return "Light";
          case VehicleType.Medium:
            return "Medium";
          case VehicleType.Heavy:
            return "Heavy";
          case VehicleType.Apc:
            return "APC";
          case VehicleType.MissileLauncher:
            return "M Missile";
          case VehicleType.Crane:
            return "Crane";
        }
        break;
      case MapObjectType.Robot:
        switch (objectId) {
          case RobotType.Grunt:
            return "Grunt";
          case RobotType.Psycho:
            return "Psychos";
          case RobotType.Sniper:
            return "Sniper";
          case RobotType.Tough:
            return "Tough";
          case RobotType.Pyro:
            return "Pyros";
          case RobotType.Laser:
            return "Laser";
        }
        break;
    }

    return "";
  }

  /**
   * Port of upstream `ZObject::GetObjectName`.
   * Role: Returns this entity's configured object name.
   * Upstream: zobject.cpp:963-966
   */
  getObjectName(): string {
    return this.objectName;
  }

  /**
   * Port of upstream `ZObject::GetObjectID`.
   * Role: Returns this entity's object type and object id pair.
   * Upstream: zobject.cpp:1431-1435
   */
  getObjectId(): ObjectIdResult {
    return {
      objectType: this.objectType,
      objectId: this.objectId,
    };
  }

  /**
   * Port of upstream `ZObject::InitTypeId`.
   * Role: Initializes object identity and base stats from game settings.
   * Upstream: zobject.cpp:122-199
   */
  initTypeId(objectType: number, objectId: number, zsettings?: ZSettings): void {
    this.objectType = objectType;
    this.objectId = objectId;

    if (!zsettings) {
      return;
    }

    if (objectType === MapObjectType.Building) {
      this.maxHealth =
        buildingHealthSetting(zsettings, objectId) * MAX_UNIT_HEALTH;
    } else if (objectType === MapObjectType.MapItem) {
      this.maxHealth = mapItemHealthSetting(zsettings, objectId) * MAX_UNIT_HEALTH;
    } else {
      const unitSettings = unitSettingsForTypeId(zsettings, objectType, objectId);

      this.moveSpeed = unitSettings.moveSpeed;
      this.attackRadius = unitSettings.attackRadius;
      this.damage = unitSettings.attackDamage * MAX_UNIT_HEALTH;
      this.damageChance = unitSettings.attackDamageChance;
      this.damageRadius = unitSettings.attackDamageRadius;
      this.missileSpeed = unitSettings.attackMissileSpeed;
      this.snipeChance = unitSettings.attackSnipeChance;
      this.damageIntTime = unitSettings.attackSpeed;
      this.maxHealth = unitSettings.health * MAX_UNIT_HEALTH;
      this.maxStamina = unitSettings.maxRunTime;
    }

    this.health = this.maxHealth;
    this.stamina = this.maxStamina;
  }

  /**
   * Port of upstream `ZObject::SetRefID`.
   * Role: Stores this entity's network/reference id.
   * Upstream: zobject.cpp:461-464
   */
  setRefId(id: number): void {
    this.refId = id;
  }

  /**
   * Port of upstream `ZObject::GetRefID`.
   * Role: Returns this entity's network/reference id.
   * Upstream: zobject.cpp:466-469
   */
  getRefId(): number {
    return this.refId;
  }

  /**
   * Port of upstream `ZObject::GetAttackObject`.
   * Role: Returns the entity currently targeted for attack.
   * Upstream: zobject.cpp:3917-3920
   */
  getAttackObject(): GameEntity | null {
    return this.attackObject;
  }

  /**
   * Port of upstream `ZObject::SetAttackObject`.
   * Role: Stores the entity currently targeted for attack.
   * Upstream: zobject.cpp:3912-3915
   */
  setAttackObject(object: GameEntity | null): void {
    this.attackObject = object;
  }

  /**
   * Port of upstream `ZObject::Engage`.
   * Role: Assigns a new attack target, marks the attack target update, and requests lid opening when exposed.
   * Upstream: zobject.cpp:1564-1583
   */
  engage(attackObject: GameEntity | null): void {
    if (!attackObject) {
      this.disengage();
      return;
    }

    if (this.attackObject !== attackObject) {
      this.attackObject = attackObject;
      this.serverFlags.updatedAttackObject = true;

      if (attackObject.canSnipe()) {
        this.signalLidShouldOpen();
      }
    }
  }

  /**
   * Port of upstream `ZObject::Disengage`.
   * Role: Clears the current attack object, marks the attack target update, and schedules lid closure.
   * Upstream: zobject.cpp:1585-1599
   */
  disengage(): boolean {
    if (!this.attackObject) return false;

    this.attackObject = null;
    this.serverFlags.updatedAttackObject = true;
    this.signalLidShouldClose();

    return true;
  }

  /**
   * Port of upstream `GetAIList`.
   * Role: Returns the AI relationship list for this entity.
   * Upstream: zobject.h:559
   */
  getAiList(): GameEntity[] {
    return this.aiList;
  }

  /**
   * Port of upstream `AddToAIList`.
   * Role: Adds a bidirectional AI relationship between this entity and another object.
   * Upstream: zobject.h:561
   */
  addToAiList(object: GameEntity): void {
    this.aiList.push(object);
    object.getAiList().push(this);
  }

  /**
   * Port of upstream `ZObject::CreateAttackObjectData`.
   * Role: Creates serialized attack-target reference data for this entity.
   * Upstream: zobject.cpp:3768-3782
   */
  createAttackObjectData(): AttackObjectData {
    return {
      packet: {
        refId: this.refId,
        attackObjectRefId: this.attackObject ? this.attackObject.refId : -1,
      },
      size: 8,
    };
  }

  /**
   * Port of upstream `ZObject::CreateTeamData`.
   * Role: Creates serialized team ownership and driver data for this entity.
   * Upstream: zobject.cpp:4410-4430
   */
  createTeamData(): TeamData {
    return {
      packet: {
        refId: this.refId,
        owner: this.owner,
        driverType: this.driverType,
        driverAmount: this.driverInfo.length,
      },
      driverInfo: this.driverInfo.map((driver) => ({ ...driver })),
      size: 7 + this.driverInfo.length * 12,
    };
  }

  /**
   * Port of upstream `ZObject::GetDamagedByFireTime`.
   * Role: Reads when this entity was last damaged by fire.
   * Upstream: zobject.cpp:4757-4760
   */
  getDamagedByFireTime(): number {
    return this.lastDamagedByFireTime;
  }

  /**
   * Port of upstream `ZObject::SetDamagedByFireTime`.
   * Role: Records when this entity was last damaged by fire.
   * Upstream: zobject.cpp:4747-4750
   */
  setDamagedByFireTime(theTime: number): void {
    this.lastDamagedByFireTime = theTime;
  }

  /**
   * Port of upstream `ZObject::GetDamagedByMissileTime`.
   * Role: Reads when this entity was last damaged by a missile.
   * Upstream: zobject.cpp:4762-4765
   */
  getDamagedByMissileTime(): number {
    return this.lastDamagedByMissileTime;
  }

  /**
   * Port of upstream `ZObject::SetDamagedByMissileTime`.
   * Role: Records when this entity was last damaged by a missile.
   * Upstream: zobject.cpp:4752-4755
   */
  setDamagedByMissileTime(theTime: number): void {
    this.lastDamagedByMissileTime = theTime;
  }

  /**
   * Port of upstream `ZObject::WithinAutoEnterRadius`.
   * Role: Checks whether a point is close enough to auto-enter this entity.
   * Upstream: zobject.cpp:813-820
   */
  withinAutoEnterRadius(objectX: number, objectY: number): boolean {
    return pointsWithinDistance(
      this.centerX,
      this.centerY,
      objectX,
      objectY,
      this.settings.autoGrabVehicleDistance,
    );
  }

  /**
   * Port of upstream `ZObject::WithinAutoGrabFlagRadius`.
   * Role: Checks whether a point is close enough for this entity to auto-grab a flag.
   * Upstream: zobject.cpp:822-829
   */
  withinAutoGrabFlagRadius(objectX: number, objectY: number): boolean {
    return pointsWithinDistance(
      this.centerX,
      this.centerY,
      objectX,
      objectY,
      this.settings.autoGrabFlagDistance,
    );
  }

  /**
   * Port of upstream `ZObject::WithinAttackRadius`.
   * Role: Checks whether a coordinate is inside this entity's attack radius.
   * Upstream: zobject.cpp:872-878
   */
  withinAttackRadius(objectX: number, objectY: number): boolean {
    return pointsWithinDistance(
      this.centerX,
      this.centerY,
      objectX,
      objectY,
      this.attackRadius,
    );
  }

  /**
   * Port of upstream `ZObject::WithinAttackRadius`.
   * Role: Checks whether an object can be attacked, including barrier line-of-fire blocking.
   * Upstream: zobject.cpp:856-870
   */
  withinAttackRadiusObject(object: GameEntity | null): boolean {
    if (object === null) return false;

    if (!this.withinAttackRadius(object.centerX, object.centerY)) return false;

    if (
      !object.isDestroyableImpassable() &&
      hasEngageBarrierMap(this.zmap) &&
      this.zmap.engageBarrierBetweenCoords(
        this.centerX,
        this.centerY,
        object.centerX,
        object.centerY,
      )
    ) {
      return false;
    }

    return true;
  }

  /**
   * Port of upstream `ZObject::WithinAgroRadius`.
   * Role: Checks whether coordinates are within attack radius plus global aggro distance.
   * Upstream: zobject.cpp:847-854
   */
  withinAgroRadius(objectX: number, objectY: number, agroDistance = 0): boolean {
    return pointsWithinDistance(
      this.centerX,
      this.centerY,
      objectX,
      objectY,
      this.attackRadius + agroDistance,
    );
  }

  /**
   * Port of upstream `ZObject::WithinAgroRadius`.
   * Role: Checks whether an object is inside aggro radius, including barrier line-of-fire blocking.
   * Upstream: zobject.cpp:831-845
   */
  withinAgroRadiusObject(object: GameEntity | null, agroDistance = 0): boolean {
    if (object === null) return false;

    if (!this.withinAgroRadius(object.centerX, object.centerY, agroDistance)) {
      return false;
    }

    if (
      !object.isDestroyableImpassable() &&
      hasEngageBarrierMap(this.zmap) &&
      this.zmap.engageBarrierBetweenCoords(
        this.centerX,
        this.centerY,
        object.centerX,
        object.centerY,
      )
    ) {
      return false;
    }

    return true;
  }

  /**
   * Port of upstream `ZObject::WithinAttackRadiusOf`.
   * Role: Checks whether any other object in a list can attack a coordinate.
   * Upstream: zobject.cpp:880-889
   */
  withinAttackRadiusOf(
    avoidList: Array<GameEntity | null>,
    objectX: number,
    objectY: number,
  ): boolean {
    for (const object of avoidList) {
      if (object && object !== this && object.withinAttackRadius(objectX, objectY)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Port of upstream `ZObject::WithinSelection`.
   * Role: Checks whether this entity's pixel bounds overlap a map selection rectangle.
   * Upstream: zobject.cpp:945-956
   */
  withinSelection(selection: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  }): boolean {
    const x = this.position.x;
    const y = this.position.y;

    if (selection.left >= x + this.pixelWidth) return false;
    if (selection.right <= x) return false;
    if (selection.top >= y + this.pixelHeight) return false;
    if (selection.bottom <= y) return false;

    return true;
  }

  /**
   * Port of upstream `ZObject::IntersectsObject`.
   * Role: Checks whether this entity's pixel bounds overlap another object's bounds.
   * Upstream: zobject.cpp:933-943
   */
  intersectsObject(object: GameEntity): boolean {
    const x = this.position.x;
    const y = this.position.y;

    if (object.position.x >= x + this.pixelWidth) return false;
    if (object.position.x + object.pixelWidth <= x) return false;
    if (object.position.y >= y + this.pixelHeight) return false;
    if (object.position.y + object.pixelHeight <= y) return false;

    return true;
  }

  /**
   * Port of upstream `ZObject::CannonNotPlacable`.
   * Role: Reports whether this base entity blocks cannon placement in a map rectangle.
   * Upstream: zobject.cpp:958-961
   */
  cannonNotPlacable(selection: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  }): boolean {
    return this.withinSelection(selection);
  }

  /**
   * Port of upstream `ZObject::UnderCursor`.
   * Role: Checks whether a map cursor coordinate lies inside this entity's pixel bounds.
   * Upstream: zobject.cpp:899-909
   */
  underCursor(mapX: number, mapY: number): boolean {
    if (mapX < this.position.x) return false;
    if (mapY < this.position.y) return false;
    if (mapX > this.position.x + this.pixelWidth) return false;
    if (mapY > this.position.y + this.pixelHeight) return false;

    return true;
  }

  /**
   * Port of upstream `UnderCursorCanAttack`.
   * Role: Reports whether this base entity allows attack targeting under the cursor.
   * Upstream: zobject.h:423
   */
  underCursorCanAttack(mapX: number, mapY: number): boolean {
    void mapX;
    void mapY;
    return true;
  }

  /**
   * Port of upstream `ZObject::CanAttack`.
   * Role: Reports whether this entity has attack damage and is not destroyed.
   * Upstream: zobject.cpp:4521-4524
   */
  canAttack(): boolean {
    return Boolean(this.damage) && !this.isDestroyed();
  }

  /**
   * Port of upstream `ZObject::CanAttackObject`.
   * Role: Checks team, destruction, attack ability, and explosive-only target rules.
   * Upstream: zobject.cpp:4782-4792
   */
  canAttackObject(object: GameEntity | null): boolean {
    if (!object) return false;
    if (!this.canAttack()) return false;
    if (object.isDestroyed()) return false;
    if (this.owner === object.getOwner()) return false;
    if (!this.hasExplosives() && object.attackedOnlyByExplosives()) return false;

    return true;
  }

  /**
   * Port of upstream `UnderCursorFortCanEnter`.
   * Role: Reports whether this base entity allows fort-entry targeting under the cursor.
   * Upstream: zobject.h:424
   */
  underCursorFortCanEnter(mapX: number, mapY: number): boolean {
    void mapX;
    void mapY;
    return false;
  }

  /**
   * Port of upstream `ZObject::CanEnterFort`.
   * Role: Reports whether this base entity can enter a fort for a team.
   * Upstream: zobject.cpp:4767-4770
   */
  canEnterFort(team: TeamType): boolean {
    void team;
    return false;
  }

  /**
   * Port of upstream `ZObject::CanBeEntered`.
   * Role: Checks whether an unowned, intact vehicle or cannon can be entered.
   * Upstream: zobject.cpp:4738-4745
   */
  canBeEntered(): boolean {
    if (this.owner !== TeamType.Null) return false;
    if (this.isDestroyed()) return false;
    if (
      this.objectType !== MapObjectType.Vehicle &&
      this.objectType !== MapObjectType.Cannon
    ) {
      return false;
    }

    return true;
  }

  /**
   * Port of upstream `GetGrenadeAmount`.
   * Role: Reports the grenade inventory available to this base entity.
   * Upstream: zobject.h:396
   */
  getGrenadeAmount(): number {
    return 0;
  }

  /**
   * Port of upstream `SetGrenadeAmount`.
   * Role: Default hook for updating grenade inventory on entities that support it.
   * Upstream: zobject.h:395
   */
  setGrenadeAmount(grenadeAmount: number): void {
    void grenadeAmount;
  }

  /**
   * Port of upstream `CanHaveGrenades`.
   * Role: Reports whether this base entity can carry grenade inventory.
   * Upstream: zobject.h:394
   */
  canHaveGrenades(): boolean {
    return false;
  }

  /**
   * Port of upstream `CanPickupGrenades`.
   * Role: Reports whether this base entity can pick up grenade inventory.
   * Upstream: zobject.h:393
   */
  canPickupGrenades(): boolean {
    return false;
  }

  /**
   * Port of upstream `CanThrowGrenades`.
   * Role: Reports whether this base entity can use grenade attacks.
   * Upstream: zobject.h:397
   */
  canThrowGrenades(): boolean {
    return false;
  }

  /**
   * Port of upstream `ZObject::HasExplosives`.
   * Role: Reports whether this entity or its group leader can provide explosive attacks.
   * Upstream: zobject.cpp:4526-4534
   */
  hasExplosives(): boolean {
    if (this.hasExplosivesFlag) return true;
    if (this.getGrenadeAmount()) return true;

    const groupLeader = this.getGroupLeader();
    return Boolean(groupLeader && groupLeader.getGrenadeAmount());
  }

  /**
   * Port of upstream `ZObject::AttackedOnlyByExplosives`.
   * Role: Reports whether this entity can only be damaged by explosive attacks.
   * Upstream: zobject.cpp:4536-4539
   */
  attackedOnlyByExplosives(): boolean {
    return this.attackedByExplosivesFlag;
  }

  /**
   * Port of upstream `DoPickupGrenadeAnim`.
   * Role: Default hook for entities that animate grenade pickups.
   * Upstream: zobject.h:398
   */
  doPickupGrenadeAnim(): void {}

  /**
   * Port of upstream `TryDropTracks`.
   * Role: Default hook for entities that leave track effects while moving.
   * Upstream: zobject.h:400
   */
  tryDropTracks(): void {}

  /**
   * Port of upstream `ShowDamaged`.
   * Role: Reports whether this entity should use damaged movement behavior.
   * Upstream: zobject.h:553
   */
  showDamaged(): boolean {
    return false;
  }

  /**
   * Port of upstream `ZObject::RunSpeed`.
   * Role: Returns the running speed multiplier when this entity or its leader is running and undamaged.
   * Upstream: zobject.cpp:2055-2061
   */
  runSpeed(
    zsettings: Pick<ZSettings, "runUnitSpeed"> = { runUnitSpeed: 1 },
  ): number {
    if (this.leaderObject) {
      return this.leaderObject.isRunning && !this.showDamaged()
        ? zsettings.runUnitSpeed
        : 1.0;
    }

    return this.isRunning && !this.showDamaged()
      ? zsettings.runUnitSpeed
      : 1.0;
  }

  /**
   * Port of upstream `ZObject::DamagedSpeed`.
   * Role: Returns the movement speed multiplier for damaged health states.
   * Upstream: zobject.cpp:2047-2053
   */
  damagedSpeed(
    zsettings: Pick<
      ZSettings,
      "partiallyDamagedUnitSpeed" | "damagedUnitSpeed"
    > = {
      partiallyDamagedUnitSpeed: 1,
      damagedUnitSpeed: 1,
    },
  ): number {
    if (this.showPartiallyDamaged()) return zsettings.partiallyDamagedUnitSpeed;
    if (this.showDamaged()) return zsettings.damagedUnitSpeed;

    return 1.0;
  }

  /**
   * Port of upstream `ShowPartiallyDamaged`.
   * Role: Reports whether this entity should use partially damaged movement behavior.
   * Upstream: zobject.h:554
   */
  showPartiallyDamaged(): boolean {
    return false;
  }

  /**
   * Port of upstream `IsDestroyableImpass`.
   * Role: Reports whether this base entity is a destroyable impassable barrier.
   * Upstream: zobject.h:548
   */
  isDestroyableImpassable(): boolean {
    return false;
  }

  /**
   * Port of upstream `CausesImpassAtCoord`.
   * Role: Reports whether this base entity makes a coordinate impassable.
   * Upstream: zobject.h:549
   */
  causesImpassAtCoord(x: number, y: number): boolean {
    void x;
    void y;
    return false;
  }

  /**
   * Port of upstream `ProducesUnits`.
   * Role: Reports whether this base entity can produce units.
   * Upstream: zobject.h:403
   */
  producesUnits(): boolean {
    return false;
  }

  /**
   * Port of upstream `CanSetRallypoints`.
   * Role: Reports whether this base entity can set rally points.
   * Upstream: zobject.h:391
   */
  canSetRallypoints(): boolean {
    return false;
  }

  /**
   * Port of upstream `AddBuildingQueue`.
   * Role: Attempts to add a unit entry to this base entity's production queue.
   * Upstream: zobject.h:401
   */
  addBuildingQueue(
    objectType: number,
    objectId: number,
    pushToFront = true,
  ): boolean {
    void objectType;
    void objectId;
    void pushToFront;
    return false;
  }

  /**
   * Port of upstream `CancelBuildingQueue`.
   * Role: Attempts to cancel a unit entry from this base entity's production queue.
   * Upstream: zobject.h:402
   */
  cancelBuildingQueue(index: number, objectType: number, objectId: number): boolean {
    void index;
    void objectType;
    void objectId;
    return false;
  }

  /**
   * Port of upstream `CreateBuildingQueueData`.
   * Role: Creates serialized building queue data for this base entity.
   * Upstream: zobject.h:523
   */
  createBuildingQueueData(): BuildingQueueData {
    return { data: null, size: 0 };
  }

  /**
   * Port of upstream `ProcessBuildingQueueData`.
   * Role: Processes serialized building queue data for this base entity.
   * Upstream: zobject.h:524
   */
  processBuildingQueueData(data: Uint8Array | null, size: number): void {
    void data;
    void size;
  }

  /**
   * Port of upstream `CreateBuildingStateData`.
   * Role: Creates serialized building state data for this base entity.
   * Upstream: zobject.h:522
   */
  createBuildingStateData(): BuildingStateData {
    return { data: null, size: 0 };
  }

  /**
   * Port of upstream `ZObject::GetBuildState`.
   * Role: Reports this base entity's building production state.
   * Upstream: zobject.cpp:4279-4282
   */
  getBuildState(): number {
    return -1;
  }

  /**
   * Port of upstream `ZObject::ProcessSetBuildingStateData`.
   * Role: Processes serialized building state data for this base entity.
   * Upstream: zobject.cpp:4110-4113
   */
  processSetBuildingStateData(
    data: SetBuildingStatePacket | Uint8Array | null,
    size: number,
  ): void {
    void data;
    void size;
  }

  /**
   * Port of upstream `CreateRepairAnimData`.
   * Role: Creates serialized repair animation data for this base entity.
   * Upstream: zobject.h:531
   */
  createRepairAnimData(playSound = true): RepairAnimData {
    void playSound;
    return { data: null, size: 0 };
  }

  /**
   * Port of upstream `ZObject::DoRepairBuildingAnim`.
   * Role: Hook for toggling repair-building animation state on repair-capable entities.
   * Upstream: zobject.cpp:4683-4686
   */
  doRepairBuildingAnim(on: boolean, remainingTime: number): void {
    void on;
    void remainingTime;
  }

  /**
   * Port of upstream `ZObject::CanBeRepaired`.
   * Role: Reports whether this base entity can be repaired by repair logic.
   * Upstream: zobject.cpp:4653-4656
   */
  canBeRepaired(): boolean {
    return false;
  }

  /**
   * Port of upstream `ZObject::CanBeRepairedByCrane`.
   * Role: Checks whether a destroyed non-fort building can be crane-repaired by a team.
   * Upstream: zobject.cpp:4509-4519
   */
  canBeRepairedByCrane(repairersTeam: TeamType): boolean {
    if (this.objectType !== MapObjectType.Building) return false;
    if (this.objectId === BuildingType.FortFront) return false;
    if (this.objectId === BuildingType.FortBack) return false;
    if (this.owner !== TeamType.Null && repairersTeam !== this.owner) return false;
    if (!this.isDestroyed()) return false;

    return true;
  }

  /**
   * Port of upstream `ZObject::RepairingAUnit`.
   * Role: Reports whether this base entity is currently repairing a unit.
   * Upstream: zobject.cpp:4663-4666
   */
  repairingAUnit(): boolean {
    return false;
  }

  /**
   * Port of upstream `ZObject::CanRepairUnit`.
   * Role: Reports whether this base entity can repair a unit for a team.
   * Upstream: zobject.cpp:4658-4661
   */
  canRepairUnit(unitsTeam: TeamType): boolean {
    void unitsTeam;
    return false;
  }

  /**
   * Port of upstream `ZObject::SetRepairUnit`.
   * Role: Provides the base repair assignment hook for repair-capable subclasses.
   * Upstream: zobject.cpp:4668-4671
   */
  setRepairUnit(unitObject: GameEntity | null): boolean {
    void unitObject;
    return false;
  }

  /**
   * Port of upstream `ZObject::RepairUnit`.
   * Role: Base hook for completing unit repair output; unsupported by default.
   * Upstream: zobject.cpp:4688-4691
   */
  repairUnit(output: RepairUnitOutput): boolean {
    void output;
    return false;
  }

  /**
   * Browser-side replacement for upstream `ZObject::SetupRockRender`.
   * Role: Base hook for preparing rock render occupancy data.
   * Upstream: zobject.cpp:4471-4474
   */
  setupRockRender(
    rockList: boolean[][],
    mapWidth: number,
    mapHeight: number,
  ): void {
    void rockList;
    void mapWidth;
    void mapHeight;
  }

  /**
   * Port of upstream `ZObject::GetRepairEntrance`.
   * Role: Base hook for reporting a unit repair entrance; unsupported by default.
   * Upstream: zobject.cpp:4638-4641
   */
  getRepairEntrance(): RepairEntrance | null {
    return null;
  }

  /**
   * Port of upstream `ZObject::StopAutoRepair`.
   * Role: Disables automatic repair behavior for this object.
   * Upstream: zobject.cpp:4274-4277
   */
  stopAutoRepair(): void {
    this.doAutoRepair = false;
  }

  /**
   * Port of upstream `ZObject::ProcessKillObject`.
   * Role: Schedules automatic repair for destroyed non-fort buildings and stops production.
   * Upstream: zobject.cpp:2220-2236
   */
  processKillObject(
    theTime: number,
    zsettings: Pick<
      ZSettings,
      "buildingAutoRepairTime" | "buildingAutoRepairRandomAdditionalTime"
    >,
    randomInt: () => number = () => Math.floor(Math.random() * 2147483647),
  ): void {
    if (
      this.objectType === MapObjectType.Building &&
      this.objectId !== BuildingType.FortFront &&
      this.objectId !== BuildingType.FortBack
    ) {
      this.doAutoRepair = true;
      this.nextAutoRepairTime = theTime + zsettings.buildingAutoRepairTime;

      if (zsettings.buildingAutoRepairRandomAdditionalTime > 0) {
        this.nextAutoRepairTime +=
          Math.trunc(randomInt()) %
          (zsettings.buildingAutoRepairRandomAdditionalTime + 1);
      }
    }

    if (this.producesUnits()) this.stopBuildingProduction();
  }

  /**
   * Port of upstream `ZObject::GetExtraLinks`.
   * Role: Reports extra bridge/link connections for this base entity.
   * Upstream: zobject.cpp:4618-4621
   */
  getExtraLinks(): number {
    return 0;
  }

  /**
   * Port of upstream `ZObject::GetLidState`.
   * Role: Reports whether this base entity currently has an open lid state.
   * Upstream: zobject.cpp:4673-4676
   */
  getLidState(): boolean {
    return false;
  }

  /**
   * Port of upstream `ZObject::SetLidState`.
   * Role: Base hook for lid-open state updates; unsupported entities ignore it.
   * Upstream: zobject.cpp:4678-4681
   */
  setLidState(lidOpen: boolean): void {
    void lidOpen;
  }

  /**
   * Port of upstream `ZObject::SignalLidShouldOpen`.
   * Role: Base hook for requesting lid opening; unsupported entities ignore it.
   * Upstream: zobject.cpp:4698-4701
   */
  signalLidShouldOpen(): void {}

  /**
   * Port of upstream `ZObject::SignalLidShouldClose`.
   * Role: Base hook for requesting lid closure; unsupported entities ignore it.
   * Upstream: zobject.cpp:4703-4706
   */
  signalLidShouldClose(): void {}

  /**
   * Port of upstream `ZObject::HasLid`.
   * Role: Reports whether this entity supports a lid overlay.
   * Upstream: zobject.cpp:4718-4721
   */
  hasLid(): boolean {
    return this.hasLidFlag;
  }

  /**
   * Port of upstream `ZObject::GetCraneEntrance`.
   * Role: Reports the crane entrance and exit coordinates for repair-capable entities.
   * Upstream: zobject.cpp:4628-4631
   */
  getCraneEntrance(): CraneEntrance {
    return {
      canEnter: false,
      x: 0,
      y: 0,
      exitX: 0,
      exitY: 0,
    };
  }

  /**
   * Port of upstream `ZObject::GetCraneCenter`.
   * Role: Reports no crane interaction center for the base entity.
   * Upstream: zobject.cpp:4633-4636
   */
  getCraneCenter(): CraneCenter {
    return {
      hasCenter: false,
      x: 0,
      y: 0,
    };
  }

  /**
   * Port of upstream `ZObject::GetRepairCenter`.
   * Role: Reports no repair interaction center for the base entity.
   * Upstream: zobject.cpp:4643-4646
   */
  getRepairCenter(): RepairCenter {
    return {
      hasCenter: false,
      x: 0,
      y: 0,
    };
  }

  /**
   * Port of upstream `ZObject::DoCraneAnim`.
   * Role: Hook for toggling crane animation on crane-capable entities.
   * Upstream: zobject.cpp:4648-4651
   */
  doCraneAnim(on: boolean, repairObject: GameEntity | null = null): void {
    void on;
    void repairObject;
  }

  /**
   * Port of upstream `ZObject::DoHitEffect`.
   * Role: Schedules the generic hit visual effect for this entity.
   * Upstream: zobject.cpp:4623-4626
   */
  doHitEffect(): void {
    this.doHitEffectFlag = true;
  }

  /**
   * Port of upstream `ZObject::DoDeathEffect`.
   * Role: Provides the base death effect hook for object subclasses.
   * Upstream: zobject.cpp:256-259
   */
  doDeathEffect(
    doFireDeath: boolean,
    doMissileDeath: boolean,
    effectList?: unknown,
    randomInt?: (maxExclusive: number) => number,
  ): void {
    void doFireDeath;
    void doMissileDeath;
    void effectList;
    void randomInt;
  }

  /**
   * Port of upstream `ZObject::DoDriverHitEffect`.
   * Role: Schedules the driver-hit visual effect for this entity.
   * Upstream: zobject.cpp:4733-4736
   */
  doDriverHitEffect(): void {
    this.doDriverHitEffectFlag = true;
  }

  /**
   * Port of upstream `ZObject::GetBuildingCreationMovePoint`.
   * Role: Reports where newly-created building units should move after spawn.
   * Upstream: zobject.cpp:4120-4123
   */
  getBuildingCreationMovePoint(): BuildingCreationMovePoint {
    return {
      hasPoint: false,
      x: 0,
      y: 0,
    };
  }

  /**
   * Port of upstream `ZObject::GetBuildingCreationPoint`.
   * Role: Reports no unit creation point for this base entity.
   * Upstream: zobject.cpp:4115-4118
   */
  getBuildingCreationPoint(): BuildingCreationPoint {
    return {
      hasPoint: false,
      x: 0,
      y: 0,
    };
  }

  /**
   * Port of upstream `ZObject::SetLevel`.
   * Role: Base entity hook for changing upgrade or production level.
   * Upstream: zobject.cpp:4216-4219
   */
  setLevel(level: number): void {
    void level;
  }

  /**
   * Port of upstream `ZObject::GetLevel`.
   * Role: Reports this base entity's upgrade or production level.
   * Upstream: zobject.cpp:4221-4224
   */
  getLevel(): number {
    return 0;
  }

  /**
   * Port of upstream `ZObject::Selectable`.
   * Role: Reports whether this entity can be selected, excluding minions led by another object.
   * Upstream: zobject.cpp:891-897
   */
  selectable(): boolean {
    if (this.leaderObject) {
      return false;
    }

    return this.selectableFlag;
  }

  /**
   * Port of upstream `ZObject::IsApartOfAGroup`.
   * Role: Reports whether this entity has a leader or currently leads minions.
   * Upstream: zobject.cpp:4354-4357
   */
  isApartOfAGroup(): boolean {
    return Boolean(this.leaderObject) || this.minionList.length > 0;
  }

  /**
   * Port of upstream `ZObject::IsMinion`.
   * Role: Reports whether this entity currently follows a group leader.
   * Upstream: zobject.cpp:4349-4352
   */
  isMinion(): boolean {
    return Boolean(this.leaderObject);
  }

  /**
   * Port of upstream `ZObject::SetGroup`.
   * Role: Assigns this entity to a quick-selection group number.
   * Upstream: zobject.cpp:386-389
   */
  setGroup(groupNumber: number): void {
    this.groupNumber = groupNumber;
  }

  /**
   * Port of upstream `ZObject::AddGroupMinion`.
   * Role: Adds another entity to this entity's group minion list.
   * Upstream: zobject.cpp:4304-4310
   */
  addGroupMinion(obj: GameEntity | null): void {
    if (!obj) return;
    if (obj === this) return;

    this.minionList.push(obj);
  }

  /**
   * Port of upstream `ZObject::RemoveGroupMinion`.
   * Role: Removes null minion slots and every matching minion reference.
   * Upstream: zobject.cpp:4312-4321
   */
  removeGroupMinion(obj: GameEntity | null): void {
    for (let i = this.minionList.length - 1; i >= 0; i -= 1) {
      const minion = this.minionList[i];
      if (!minion || minion === obj) {
        this.minionList.splice(i, 1);
      }
    }
  }

  /**
   * Port of upstream `ZObject::CloneMinionWayPoints`.
   * Role: Copies this entity's waypoints and cannon-exit state to its minions.
   * Upstream: zobject.cpp:4359-4371
   */
  cloneMinionWaypoints(): void {
    const waypointList = this.waypointList.map((waypoint) => {
      const clone = new Waypoint();
      clone.mode = waypoint.mode;
      clone.refId = waypoint.refId;
      clone.x = waypoint.x;
      clone.y = waypoint.y;
      clone.attackTo = waypoint.attackTo;
      clone.playerGiven = waypoint.playerGiven;
      return clone;
    });

    for (const minion of this.minionList) {
      if (!minion) {
        continue;
      }

      minion.waypointList = waypointList.map((waypoint) => {
        const clone = new Waypoint();
        clone.mode = waypoint.mode;
        clone.refId = waypoint.refId;
        clone.x = waypoint.x;
        clone.y = waypoint.y;
        clone.attackTo = waypoint.attackTo;
        clone.playerGiven = waypoint.playerGiven;
        return clone;
      });
      minion.setVelocity();
      minion.setJustLeftCannon(this.justLeftCannon);
    }
  }

  /**
   * Port of upstream `ZObject::GetGroupLeader`.
   * Role: Returns this entity's group leader, when it is a minion.
   * Upstream: zobject.cpp:4328-4331
   */
  getGroupLeader(): GameEntity | null {
    return this.leaderObject;
  }

  /**
   * Port of upstream `ZObject::SetGroupLeader`.
   * Role: Stores this entity's group leader, ignoring self-leadership.
   * Upstream: zobject.cpp:4333-4341
   */
  setGroupLeader(obj: GameEntity | null): void {
    if (obj === this) return;

    this.leaderObject = obj;
  }

  /**
   * Port of upstream `ZObject::ClearGroupInfo`.
   * Role: Clears this entity's leader and minion group relationships.
   * Upstream: zobject.cpp:4343-4347
   */
  clearGroupInfo(): void {
    this.minionList.length = 0;
    this.leaderObject = null;
  }

  /**
   * Port of upstream `ZObject::CreateGroupInfoData`.
   * Role: Creates serialized robot group relationship data for network updates.
   * Upstream: zobject.cpp:4373-4408
   */
  createGroupInfoData(): GroupInfoData {
    if (this.objectType !== MapObjectType.Robot) {
      return { packet: null, size: 0 };
    }

    return {
      packet: {
        refId: this.refId,
        leaderRefId: this.leaderObject ? this.leaderObject.getRefId() : -1,
        minionRefIds: this.minionList.map((minion) =>
          minion ? minion.getRefId() : -1,
        ),
      },
      size: 12 + 4 * this.minionList.length,
    };
  }

  /**
   * Port of upstream `ZObject::ProcessGroupInfoData`.
   * Role: Applies serialized group leader and minion references to this entity.
   * Upstream: zobject.cpp:4432-4469
   */
  processGroupInfoData(
    packet: GroupInfoPacket | null,
    size: number,
    objectList: GameEntity[],
  ): void {
    if (size < 12 || !packet) {
      return;
    }

    if (packet.refId !== this.refId) {
      return;
    }

    if (size !== 12 + 4 * packet.minionRefIds.length) {
      return;
    }

    this.clearGroupInfo();
    this.leaderObject = GameEntity.getObjectFromId(packet.leaderRefId, objectList);

    for (const minionRefId of packet.minionRefIds) {
      const minion = GameEntity.getObjectFromId(minionRefId, objectList);

      if (minion) {
        this.minionList.push(minion);
      }
    }
  }

  /**
   * Port of upstream `ZObject::CanBeSniped`.
   * Role: Reports whether this entity has a snipeable driver.
   * Upstream: zobject.cpp:4708-4711
   */
  canBeSniped(): boolean {
    return this.canBeSnipedFlag && this.driverInfo.length > 0;
  }

  /**
   * Port of upstream `ZObject::CanSnipe`.
   * Role: Reports whether this entity can perform sniper attacks.
   * Upstream: zobject.cpp:4713-4716
   */
  canSnipe(): boolean {
    return this.canSnipeFlag;
  }

  /**
   * Port of upstream `ZObject::CanEjectDrivers`.
   * Role: Reports whether this base entity can eject drivers.
   * Upstream: zobject.cpp:4597-4600
   */
  canEjectDrivers(): boolean {
    return false;
  }

  /**
   * Port of upstream `ZObject::AddDriver`.
   * Role: Adds driver combat state and resets driver damage tracking.
   * Upstream: zobject.cpp:4552-4569
   */
  addDriver(driver: number | DriverInfo): void {
    const newDriver =
      typeof driver === "number"
        ? { health: driver, nextAttackTime: 0 }
        : { ...driver, nextAttackTime: 0 };

    this.driverInfo.push(newDriver);
    this.resetDamageInfo();
  }

  /**
   * Port of upstream `ZObject::ClearDrivers`.
   * Role: Removes all drivers and refreshes driver-based damage state.
   * Upstream: zobject.cpp:4576-4582
   */
  clearDrivers(): void {
    this.driverInfo.splice(0);
    this.resetDamageInfo();
  }

  /**
   * Port of upstream `ZObject::DamageDriverHealth`.
   * Role: Damages the first driver and neutralizes the entity when that driver dies.
   * Upstream: zobject.cpp:337-362
   */
  damageDriverHealth(damageAmount: number): number {
    const driver = this.driverInfo[0];

    if (!driver) return 0;
    if (driver.health <= 0) return 0;

    driver.health -= damageAmount;

    if (driver.health <= 0) {
      this.clearDrivers();
      this.setOwner(TeamType.Null);
    }

    return 1;
  }

  /**
   * Port of upstream `ZObject::SetInitialDrivers`.
   * Role: Resets driver state to the default grunt driver type.
   * Upstream: zobject.cpp:4602-4606
   */
  setInitialDrivers(): void {
    this.driverType = RobotType.Grunt;
    this.clearDrivers();
  }

  /**
   * Port of upstream `ZObject::SetDriverType`.
   * Role: Stores a clamped robot driver type and refreshes driver damage state.
   * Upstream: zobject.cpp:4541-4550
   */
  setDriverType(driverType: number): void {
    this.driverType = driverType;

    if (this.driverType < 0) {
      this.driverType = 0;
    }

    if (this.driverType >= RobotType.Max) {
      this.driverType = RobotType.Max - 1;
    }

    this.resetDamageInfo();
  }

  /**
   * Port of upstream `ZObject::GetDriverHealth`.
   * Role: Returns the first driver's health, or zero when there is no driver.
   * Upstream: zobject.cpp:4589-4595
   */
  getDriverHealth(): number {
    return this.driverInfo.length ? this.driverInfo[0].health : 0;
  }

  /**
   * Port of upstream `ZObject::GetDriverType`.
   * Role: Returns the entity's current driver type.
   * Upstream: zobject.cpp:4584-4587
   */
  getDriverType(): number {
    return this.driverType;
  }

  /**
   * Port of upstream `ZObject::ResetDamageInfo`.
   * Role: Resets driver-specific damage tracking for entities that override it.
   * Upstream: zobject.cpp:4613-4616
   */
  resetDamageInfo(): void {}

  /**
   * Port of upstream `CreateBuiltCannonData`.
   * Role: Creates serialized built-cannon data for this base entity.
   * Upstream: zobject.h:529
   */
  createBuiltCannonData(): BuiltCannonData {
    return { data: null, size: 0 };
  }

  /**
   * Port of upstream `ZObject::StoreBuiltCannon`.
   * Role: Base entity hook for storing a newly built cannon; unsupported by default.
   * Upstream: zobject.cpp:4155-4158
   */
  storeBuiltCannon(objectId: number): boolean {
    void objectId;
    return false;
  }

  /**
   * Port of upstream `ZObject::RemoveStoredCannon`.
   * Role: Base entity hook for removing a stored cannon; unsupported by default.
   * Upstream: zobject.cpp:4175-4178
   */
  removeStoredCannon(objectId: number): boolean {
    void objectId;
    return false;
  }

  /**
   * Port of upstream `ZObject::SetEjectableCannon`.
   * Role: Base hook for toggling cannon ejection support; unsupported entities ignore it.
   * Upstream: zobject.cpp:4608-4611
   */
  setEjectableCannon(ejectable: boolean): void {
    void ejectable;
  }

  /**
   * Port of upstream `ZObject::HaveStoredCannon`.
   * Role: Reports whether this base entity has a stored cannon matching an id.
   * Upstream: zobject.cpp:4180-4183
   */
  haveStoredCannon(objectId: number): boolean {
    void objectId;
    return false;
  }

  /**
   * Port of upstream `ProcessSetBuiltCannonData`.
   * Role: Processes serialized built-cannon updates for this base entity.
   * Upstream: zobject.cpp:4105-4108
   */
  processSetBuiltCannonData(data: Uint8Array | null, size: number): void {
    void data;
    void size;
  }

  /**
   * Port of upstream `ZObject::CreateLocationData`.
   * Role: Creates serialized reference and object-location data for position updates.
   * Upstream: zobject.cpp:3759-3766
   */
  createLocationData(): LocationData {
    const x = Math.trunc(this.position.x);
    const y = Math.trunc(this.position.y);

    return {
      refId: this.refId,
      location: {
        x,
        y,
        deltaX: this.position.x - x,
        deltaY: this.position.y - y,
      },
      size: 20,
    };
  }

  /**
   * Port of upstream `SetBuildingDefaultProduction`.
   * Role: Attempts to reset this base entity to default production.
   * Upstream: zobject.h:520
   */
  setBuildingDefaultProduction(): boolean {
    return false;
  }

  /**
   * Port of upstream `SetBuildingProduction`.
   * Role: Attempts to set this base entity's production unit type.
   * Upstream: zobject.h:521
   */
  setBuildingProduction(objectType: number, objectId: number): boolean {
    void objectType;
    void objectId;
    return false;
  }

  /**
   * Port of upstream `ZObject::PercentageProduced`.
   * Role: Reports current production completion percentage for producing entities.
   * Upstream: zobject.cpp:4125-4128
   */
  percentageProduced(theTime: number): number {
    void theTime;
    return 0;
  }

  /**
   * Port of upstream `ZObject::ProductionTimeTotal`.
   * Role: Reports total production time for this base entity.
   * Upstream: zobject.cpp:4130-4133
   */
  productionTimeTotal(): number {
    return 0;
  }

  /**
   * Port of upstream `ZObject::ResetProduction`.
   * Role: Resets production state for object types that support production.
   * Upstream: zobject.cpp:4145-4148
   */
  resetProduction(): void {}

  /**
   * Port of upstream `ZObject::GetBuildUnit`.
   * Role: Reports whether this base entity has a completed unit to retrieve.
   * Upstream: zobject.cpp:4135-4138
   */
  getBuildUnit(): BuildUnitResult {
    return {
      hasUnit: false,
      objectType: 0,
      objectId: 0,
    };
  }

  /**
   * Port of upstream `ZObject::BuildUnit`.
   * Role: Attempts to finish production for this base entity.
   * Upstream: zobject.cpp:4140-4143
   */
  buildUnit(theTime: number): BuildUnitResult {
    void theTime;
    return {
      hasUnit: false,
      objectType: 0,
      objectId: 0,
    };
  }

  /**
   * Port of upstream `StopBuildingProduction`.
   * Role: Attempts to stop production for this base entity.
   * Upstream: zobject.h:525
   */
  stopBuildingProduction(clearQueueList = true): boolean {
    void clearQueueList;
    return false;
  }

  /**
   * Port of upstream `SetJustLeftCannon`.
   * Role: Stores whether the entity has just exited cannon control.
   * Upstream: zobject.h:546
   */
  setJustLeftCannon(value: boolean): void {
    this.justLeftCannon = value;
  }

  /**
   * Port of upstream `GetDimensions`.
   * Role: Returns the entity dimensions used for tile-space logic.
   * Upstream: zobject.h:305
   */
  getDimensions(): { width: number; height: number } {
    return {
      width: this.width,
      height: this.height,
    };
  }

  /**
   * Port of upstream `GetDimensionsPixel`.
   * Role: Returns the entity sprite dimensions used for pixel-space rendering.
   * Upstream: zobject.h:306
   */
  getPixelDimensions(): { width: number; height: number } {
    return {
      width: this.pixelWidth,
      height: this.pixelHeight,
    };
  }

  /**
   * Port of upstream `GetOwner`.
   * Role: Reports the team that owns this entity.
   * Upstream: zobject.h:304
   */
  getOwner(): TeamType {
    return this.owner;
  }

  /**
   * Port of upstream `ZObject::SetOwner`.
   * Role: Updates the team that owns this entity.
   * Upstream: zobject.cpp:1001-1004
   */
  setOwner(owner: TeamType): void {
    this.owner = owner;
  }

  /**
   * Port of upstream `ZObject::CanBeDestroyed`.
   * Role: Reports whether this entity can be destroyed by gameplay damage.
   * Upstream: zobject.cpp:4476-4479
   */
  canBeDestroyed(): boolean {
    return this.canBeDestroyedFlag;
  }

  /**
   * Port of upstream `ZObject::IsDestroyed`.
   * Role: Reports whether health has reached zero for an entity with positive max health.
   * Upstream: zobject.cpp:286-289
   */
  isDestroyed(): boolean {
    return this.health <= 0 && this.maxHealth > 0;
  }

  /**
   * Port of upstream `ZObject::SetDestroyed`.
   * Role: Stores whether this entity has entered its destroyed state.
   * Upstream: zobject.cpp:1426-1429
   */
  setDestroyed(isDestroyed: boolean): void {
    this.destroyed = isDestroyed;
  }

  /**
   * Port of upstream `ZObject::DontStamp`.
   * Role: Stores whether this entity should skip map stamping.
   * Upstream: zobject.cpp:251-254
   */
  dontStamp(dontStamp: boolean): void {
    this.dontStampFlag = dontStamp;
  }

  /**
   * Port of upstream `ZObject::DoKillMe`.
   * Role: Schedules this entity for death at a fixed simulation time.
   * Upstream: zobject.cpp:276-284
   */
  doKillMe(killTime: number): void {
    if (this.killMeFlag) {
      return;
    }

    this.killMeFlag = true;
    this.killMeTime = killTime;
  }

  /**
   * Port of upstream `ZObject::SetMap`.
   * Role: Stores the map reference used by this entity.
   * Upstream: zobject.cpp:246-249
   */
  setMap(zmap: GameMap | null): void {
    this.zmap = zmap;
  }

  /**
   * Port of upstream `ZObject::SetMapImpassables`.
   * Role: Provides the base hook for marking entity impassable tiles.
   * Upstream: zobject.cpp:4284-4287
   */
  setMapImpassables(tmap: GameMap): void {
    void tmap;
  }

  /**
   * Port of upstream `ZObject::SetDestroyMapImpassables`.
   * Role: Provides the base hook for marking destroy-time impassable tiles.
   * Upstream: zobject.cpp:4294-4297
   */
  setDestroyMapImpassables(tmap: GameMap): void {
    void tmap;
  }

  /**
   * Port of upstream `ZObject::UnSetMapImpassables`.
   * Role: Provides the base hook for clearing entity impassable tiles.
   * Upstream: zobject.cpp:4289-4292
   */
  unsetMapImpassables(tmap: GameMap): void {
    void tmap;
  }

  /**
   * Port of upstream `ZObject::UnSetDestroyMapImpassables`.
   * Role: Provides the base hook for clearing destroy-time impassable tiles.
   * Upstream: zobject.cpp:4299-4302
   */
  unsetDestroyMapImpassables(tmap: GameMap): void {
    void tmap;
  }

  /**
   * Port of upstream `ZObject::CreationMapEffects`.
   * Role: Provides the base hook for map effects applied when an entity is created.
   * Upstream: zobject.cpp:4481-4484
   */
  creationMapEffects(tmap: GameMap): void {
    void tmap;
  }

  /**
   * Port of upstream `ZObject::DeathMapEffects`.
   * Role: Provides the base hook for map effects applied when an entity dies.
   * Upstream: zobject.cpp:4486-4489
   */
  deathMapEffects(tmap: GameMap): void {
    void tmap;
  }

  /**
   * Replacement for upstream `ZObject::DoPreRender`.
   * Role: Provides the empty base pre-render command hook for game entities.
   * Upstream: zobject.cpp:4226-4229
   */
  doPreRender(
    theMap: unknown,
    destination: unknown,
    shiftX: number,
    shiftY: number,
  ): [] {
    void theMap;
    void destination;
    void shiftX;
    void shiftY;

    return [];
  }

  /**
   * Replacement for upstream `ZObject::DoRender`.
   * Role: Provides the empty base render command hook for game entities.
   * Upstream: zobject.cpp:1416-1419
   */
  doRender(
    theMap: unknown,
    destination: unknown,
    shiftX: number,
    shiftY: number,
  ): [] {
    void theMap;
    void destination;
    void shiftX;
    void shiftY;

    return [];
  }

  /**
   * Port of upstream `ZObject::DoAfterEffects`.
   * Role: Provides the base post-render effects hook for game entities.
   * Upstream: zobject.cpp:1421-1424
   */
  doAfterEffects(
    theMap: unknown,
    destination: unknown,
    shiftX: number,
    shiftY: number,
  ): void {
    void theMap;
    void destination;
    void shiftX;
    void shiftY;
  }

  /**
   * Port of upstream `ZObject::SetBuildList`.
   * Role: Stores the build-list reference used for production choices.
   * Upstream: zobject.cpp:4150-4153
   */
  setBuildList(buildList: EntityBuildListReference | null): void {
    this.buildList = buildList;
  }

  /**
   * Port of upstream `ZObject::KillMe`.
   * Role: Reports whether this entity's scheduled death time has been reached.
   * Upstream: zobject.cpp:271-274
   */
  shouldKillAt(theTime: number): boolean {
    return this.killMeFlag && theTime >= this.killMeTime;
  }

  /**
   * Port of upstream `SetZoneOwnage`.
   * Role: Default hook for zone-ownership updates on entities that track them.
   * Upstream: zobject.h:477
   */
  setZoneOwnage(zoneOwnage: number): void {
    void zoneOwnage;
  }

  /**
   * Port of upstream `ZObject::SetConnectedZone`.
   * Role: Stores the map zone currently connected to this entity.
   * Upstream: zobject.cpp:4165-4168
   */
  setConnectedZone(connectedZone: MapZoneInfo | null): void {
    this.connectedZone = connectedZone;
  }

  /**
   * Port of upstream `ZObject::SetConnectedZone`.
   * Role: Stores the map zone at the entity's current location.
   * Upstream: zobject.cpp:4170-4173
   */
  setConnectedZoneFromMap(theMap: EntityConnectedZoneMap): void {
    this.connectedZone = theMap.getZone(this.position.x, this.position.y);
  }

  /**
   * Port of upstream `ZObject::CannonsInZone`.
   * Role: Counts other cannon objects connected to the same map zone.
   * Upstream: zobject.cpp:4185-4202
   */
  cannonsInZone(ols: { objectList: GameEntity[] }): number {
    let cannonsFound = 0;

    for (const object of ols.objectList) {
      if (this === object) continue;
      if (this.connectedZone !== object.connectedZone) continue;

      const objectId = object.getObjectId();
      if (objectId.objectType !== MapObjectType.Cannon) continue;

      cannonsFound += 1;
    }

    return cannonsFound;
  }

  /**
   * Port of upstream `ZObject::HasDestroyedFortInZone`.
   * Role: Reports whether this entity's connected zone contains a destroyed front fort.
   * Upstream: zobject.cpp:4231-4248
   */
  hasDestroyedFortInZone(ols: { buildingObjectList: GameEntity[] }): boolean {
    if (!this.connectedZone) return false;

    for (const object of ols.buildingObjectList) {
      if (this.connectedZone !== object.connectedZone) continue;
      if (!object.isDestroyed()) continue;

      const objectId = object.getObjectId();
      if (
        objectId.objectType === MapObjectType.Building &&
        objectId.objectId === BuildingType.FortFront
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * Port of upstream `SetDamageMissileList`.
   * Role: Sets the shared damage-missile impact list used by game objects.
   * Upstream: zobject.h:298
   */
  static setDamageMissileList(damageMissileList: DamageMissile[] | null): void {
    GameEntity.damageMissileList = damageMissileList;
  }

  /**
   * Port of upstream `ZObject::SetUnitLimitReachedList`.
   * Role: Sets the shared unit-limit flags used by production-capable objects.
   * Upstream: zobject.cpp:4211-4214
   */
  static setUnitLimitReachedList(unitLimitReachedList: boolean[] | null): void {
    GameEntity.unitLimitReachedList = unitLimitReachedList;
  }

  /**
   * Port of upstream `ZObject::Init`.
   * Role: Initializes the shared quick-group tag labels used when rendering entity groups.
   * Upstream: zobject.cpp:201-235
   */
  static initGroupTags(): void {
    GameEntity.groupTags = Array.from({ length: 10 }, (_, index) => ({
      label: String(index),
      color: {
        r: 200,
        g: 200,
        b: 200,
      },
    }));
  }

  /**
   * Port of upstream `ZObject::ClearAndDeleteList`.
   * Role: Clears object references from a list; JavaScript garbage collection owns deletion.
   * Upstream: zobject.cpp:3982-3988
   */
  static clearAndDeleteList(theList: Array<GameEntity | null | undefined>): void {
    theList.length = 0;
  }

  /**
   * Port of upstream `ZObject::GetObjectFromID_BS`.
   * Role: Finds an entity by reference id in a list sorted by reference id.
   * Upstream: zobject.cpp:3866-3897
   */
  static getObjectFromIdBinarySearch(
    refId: number,
    theList: GameEntity[],
  ): GameEntity | null {
    let low = 0;
    let high = theList.length - 1;

    while (low <= high) {
      const midpoint = low + ((high - low) >> 1);
      const targetRefId = theList[midpoint].getRefId();

      if (refId === targetRefId) {
        return theList[midpoint];
      }

      if (refId < targetRefId) {
        high = midpoint - 1;
      } else {
        low = midpoint + 1;
      }
    }

    return null;
  }

  /**
   * Port of upstream `ZObject::GetObjectFromID`.
   * Role: Finds an entity by reference id in the shared object list.
   * Upstream: zobject.cpp:3899-3910
   */
  static getObjectFromId(
    refId: number,
    theList: GameEntity[],
  ): GameEntity | null {
    return GameEntity.getObjectFromIdBinarySearch(refId, theList);
  }

  /**
   * Port of upstream `ZObject::RemoveObjectFromList`.
   * Role: Removes every occurrence of an entity reference from a list in place.
   * Upstream: zobject.cpp:3945-3956
   */
  static removeObjectFromList(
    theObject: GameEntity | null,
    theList: Array<GameEntity | null>,
  ): void {
    for (let i = theList.length - 1; i >= 0; i -= 1) {
      if (theList[i] === theObject) {
        theList.splice(i, 1);
      }
    }
  }

  /**
   * Port of upstream `ZObject::RemoveObject`.
   * Role: Clears references from this entity to an object being removed from the world.
   * Upstream: zobject.cpp:4056-4073
   */
  removeObject(object: GameEntity | null): void {
    if (this.attackObject === object) {
      this.setAttackObject(null);
      this.signalLidShouldClose();
    }

    for (let i = 0; i < this.minionList.length; i += 1) {
      if (this.minionList[i] === object) {
        this.minionList[i] = null;
      }
    }

    if (this.leaderObject === object) {
      this.leaderObject = null;
    }
  }

  update(deltaSeconds: number): void {
    if (!this.target) {
      return;
    }

    const dx = this.target.x - this.position.x;
    const yDistance = this.target.y - this.position.y;
    const distance = Math.hypot(dx, yDistance);

    if (distance < 0.01) {
      this.position = { ...this.target };
      this.target = null;
      return;
    }

    const step = Math.min(distance, this.speedTilesPerSecond * deltaSeconds);
    this.position.x += (dx / distance) * step;
    this.position.y += (yDistance / distance) * step;
  }
}
