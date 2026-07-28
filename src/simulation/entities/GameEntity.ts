/**
 * Upstream: zobject.h
 */

import type { Vector2 } from "../../world/Vector2";
import { Waypoint } from "./EntityTypes";
import type { DamageMissile } from "../ProjectileConstants";
import { TeamType } from "../SimulationConstants";

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
  data: Uint8Array | null;
  size: number;
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

/**
 * Browser simulation entity containing the subset of `ZObject` behavior already ported.
 * Role: Owns mutable runtime state for an object in the simulation world.
 * Upstream: zobject.h
 */
export class GameEntity {
  static damageMissileList: DamageMissile[] | null = null;

  readonly id: string;
  readonly kind: string;
  position: Vector2;
  target: Vector2 | null = null;
  speedTilesPerSecond = 2;
  aiLastSetBuildTime = 0;
  initialHealthPercent = 0;
  attackRadius = 0;
  justLeftCannon = false;
  width = 0;
  height = 0;
  pixelWidth = 0;
  pixelHeight = 0;
  currentWaypoint = new Waypoint();
  owner: TeamType;

  constructor(options: { id: string; kind: string; position: Vector2; owner?: TeamType }) {
    this.id = options.id;
    this.kind = options.kind;
    this.position = { ...options.position };
    this.owner = options.owner ?? TeamType.Null;
  }

  issueMoveOrder(target: Vector2): void {
    this.target = { ...target };
  }

  /**
   * Port of upstream `SetTarget`.
   * Role: Sets the movement target from the current waypoint coordinates.
   * Upstream: zobject.h:511
   */
  setTargetFromCurrentWaypoint(): void {
    this.issueMoveOrder({
      x: this.currentWaypoint.x,
      y: this.currentWaypoint.y,
    });
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
   * Port of upstream `GetCords`.
   * Role: Returns the entity's current world coordinates.
   * Upstream: zobject.h:407
   */
  getCoordinates(): Vector2 {
    return { ...this.position };
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
   * Port of upstream `CreateRepairAnimData`.
   * Role: Creates serialized repair animation data for this base entity.
   * Upstream: zobject.h:531
   */
  createRepairAnimData(playSound = true): RepairAnimData {
    void playSound;
    return { data: null, size: 0 };
  }

  /**
   * Port of upstream `CreateBuiltCannonData`.
   * Role: Creates serialized built-cannon data for this base entity.
   * Upstream: zobject.h:529
   */
  createBuiltCannonData(): BuiltCannonData {
    return { data: null, size: 0 };
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
   * Port of upstream `SetZoneOwnage`.
   * Role: Default hook for zone-ownership updates on entities that track them.
   * Upstream: zobject.h:477
   */
  setZoneOwnage(zoneOwnage: number): void {
    void zoneOwnage;
  }

  /**
   * Port of upstream `SetDamageMissileList`.
   * Role: Sets the shared damage-missile impact list used by game objects.
   * Upstream: zobject.h:298
   */
  static setDamageMissileList(damageMissileList: DamageMissile[] | null): void {
    GameEntity.damageMissileList = damageMissileList;
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
