/**
 * Upstream: bbridge.h, bfort.h, bradar.h, brepair.h, brobot.h, bvehicle.h, zbuilding.h
 */

import {
  MAX_BUILDING_LEVELS,
  MAX_STORED_CANNONS,
  PlanetType,
  TeamType,
} from "../SimulationConstants";
import type { SetBuildingStatePacket } from "../EventHandler";
import {
  GameEntity,
  type BuildingQueueData,
  type BuildingStateData,
  type BuildUnitResult,
} from "./GameEntity";
import type { BuildList } from "./BuildList";
import { FontType } from "../../rendering/FontEngine";
import { MapObjectType } from "../../world/MapFormat";

/**
 * Marker exported from the building type module.
 * Role: Marks an upstream header boundary.
 * Upstream: bbridge.h:2
 */
export const BBRIDGE_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the building type module.
 * Role: Marks an upstream header boundary.
 * Upstream: bfort.h:2
 */
export const BFORT_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the building type module.
 * Role: Marks an upstream header boundary.
 * Upstream: bradar.h:2
 */
export const BRADAR_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the building type module.
 * Role: Marks an upstream header boundary.
 * Upstream: brepair.h:2
 */
export const BREPAIR_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the building type module.
 * Role: Marks an upstream header boundary.
 * Upstream: brobot.h:2
 */
export const BROBOT_HEADER_GUARD_PORTED = true;

/**
 * Marker exported from the building type module.
 * Role: Marks an upstream header boundary.
 * Upstream: bvehicle.h:2
 */
export const BVEHICLE_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `_ZBUILDING_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: zbuilding.h:2
 */
export const ZBUILDING_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `sizeof(set_building_state_packet)`.
 * Role: Defines the aligned byte size expected for building-state update payloads.
 * Upstream: event_handler.h:74-81
 */
export const SET_BUILDING_STATE_PACKET_SIZE_BYTES = 32;

/**
 * Port of upstream `MAX_QUEUE_ITEMS`.
 * Role: Defines the maximum number of queued production units for a building.
 * Upstream: zbuilding.h:8
 */
export const BUILDING_MAX_QUEUE_ITEMS = 5;

/**
 * Port of upstream `building_state`.
 * Role: Identifies the production state currently held by a building.
 * Upstream: zbuilding.h:10-13
 */
export enum BuildingState {
  Place = 0,
  Select = 1,
  Building = 2,
  Paused = 3,
  MaxBuildingStates = 4,
}

/**
 * Port of upstream `ZBProductionUnit`.
 * Role: Stores the object type and object id queued for building production.
 * Upstream: zbuilding.h:18-25
 */
export class ZBProductionUnit {
  ot: number;
  oid: number;

  constructor(ot = 0, oid = 0) {
    this.ot = ot;
    this.oid = oid;
  }
}

/**
 * Port of upstream `ZBuilding` zone ownership field.
 * Role: Holds the zone ownership fraction used by building production timing.
 * Upstream: zbuilding.h:69, zbuilding.h:87
 */
export type BuildingZoneOwnageState = {
  zoneOwnage: number;
};

/**
 * Port of upstream `ZBuilding` production timing fields.
 * Role: Holds the total production duration tracked for the current build.
 * Upstream: zbuilding.h:51, zbuilding.h:84
 */
export type BuildingProductionTimeState = {
  totalProductionTime: number;
};

/**
 * Port of upstream `ZBuilding` production final-time field.
 * Role: Holds the simulation time at which the current production completes.
 * Upstream: zbuilding.h:83
 */
export type BuildingProductionProgressState = {
  initialProductionTime: number;
  finalProductionTime: number;
};

export type BuildingImageLoadTarget = {
  loadBaseImage(filename: string): void;
};

/**
 * Replacement for upstream `show_time_img`.
 * Role: Stores the rendered production countdown image.
 * Upstream: zbuilding.cpp:527, zbuilding.cpp:544
 */
export type BuildingShowTimeImageTarget<TImage = unknown> = {
  unload(): void;
  loadBaseImage(image: TImage): void;
};

export type BuildingShowTimeTextRenderer<TImage> = (
  font: FontType,
  text: string,
) => TImage;

/**
 * Port of upstream `ZBuilding::Init`.
 * Role: Loads shared building level and exhaust image assets.
 * Upstream: zbuilding.cpp:56-78
 */
export function initBuildingImages(
  levelImages: readonly BuildingImageLoadTarget[],
  exhaustImages: readonly BuildingImageLoadTarget[],
  littleExhaustImages: readonly BuildingImageLoadTarget[],
): void {
  for (let i = 0; i < MAX_BUILDING_LEVELS; i += 1) {
    levelImages[i]?.loadBaseImage(`assets/buildings/level_${i + 1}.bmp`);
  }

  for (let i = 0; i < 13; i += 1) {
    exhaustImages[i]?.loadBaseImage(`assets/buildings/exhaust_${i}.png`);
  }

  for (let i = 0; i < 4; i += 1) {
    littleExhaustImages[i]?.loadBaseImage(`assets/buildings/little_exhaust_${i}.png`);
  }
}

/**
 * Browser simulation entity containing the subset of `ZBuilding` behavior already ported.
 * Role: Owns shared building render and production state over the generic game entity base.
 * Upstream: zbuilding.h
 */
export class BuildingEntity extends GameEntity {
  level = 0;
  palette = PlanetType.Desert;
  doBaseRerender = false;
  buildObjectType = 0;
  buildObjectId = 0;
  buildState = BuildingState.Place;
  bot = -1;
  boid = -1;
  unitCreateX = 0;
  unitCreateY = 0;
  unitMoveX = 0;
  unitMoveY = 0;
  zoneOwnage = 0;
  initialProductionTime = 0;
  finalProductionTime = 0;
  totalProductionTime = 0;
  showTime = -1;
  showTimeImage: BuildingShowTimeImageTarget | null = null;
  ztime: { ztime: number } | null = null;
  buildList: Pick<
    BuildList,
    "getFirstUnitInBuildList" | "unitBuildTime" | "unitInBuildList"
  > | null = null;
  queueList: ZBProductionUnit[] = [];
  builtCannonList: number[] = [];
  extraEffects: unknown[] = [];

  /**
   * Port of upstream `ZBuilding::GetLevel`.
   * Role: Reports the building production level.
   * Upstream: zbuilding.cpp:88-91
   */
  override getLevel(): number {
    return this.level;
  }

  /**
   * Replacement for upstream `ZBuilding::ReRenderBase`.
   * Role: Marks the building base image as needing to be rebuilt.
   * Upstream: zbuilding.cpp:98-101
   */
  reRenderBase(): void {
    this.doBaseRerender = true;
  }

  /**
   * Port of upstream `ZBuilding::GetBuildUnit`.
   * Role: Returns the object type and id currently selected for building production.
   * Upstream: zbuilding.cpp:512-518
   */
  override getBuildUnit(): { hasUnit: boolean; objectType: number; objectId: number } {
    return {
      hasUnit: true,
      objectType: this.buildObjectType,
      objectId: this.buildObjectId,
    };
  }

  /**
   * Port of upstream `ZBuilding::ResetShowTime`.
   * Role: Refreshes the rendered production countdown image when the displayed seconds change.
   * Upstream: zbuilding.cpp:520-546
   */
  resetShowTime<TImage>(
    newTime: number,
    renderText: BuildingShowTimeTextRenderer<TImage>,
  ): void {
    if (newTime === this.showTime) return;

    this.showTimeImage?.unload();

    if (newTime > -1) {
      this.showTime = newTime;

      const seconds = newTime % 60;
      const minutes = Math.trunc(newTime / 60) % 60;
      const text = `${minutes}:${seconds.toString().padStart(2, "0")}`;

      this.showTimeImage?.loadBaseImage(renderText(FontType.GreenBuilding, text));
    }
  }

  /**
   * Port of upstream `ZBuilding::GetBuildState`.
   * Role: Reports paused production when this owner's unit cap is reached.
   * Upstream: zbuilding.cpp:506-510
   */
  override getBuildState(): number {
    if (GameEntity.unitLimitReachedList?.[this.owner]) {
      return BuildingState.Paused;
    }

    return this.buildState;
  }

  /**
   * Port of upstream `ZBuilding::BuildUnit`.
   * Role: Reports the completed production unit once its final build time is reached.
   * Upstream: zbuilding.cpp:405-420
   */
  override buildUnit(theTime: number): BuildUnitResult {
    if (this.bot === -1) return { hasUnit: false, objectType: 0, objectId: 0 };
    if (this.boid === -1) return { hasUnit: false, objectType: 0, objectId: 0 };
    if (this.buildState === BuildingState.Select) {
      return { hasUnit: false, objectType: 0, objectId: 0 };
    }
    if (this.owner === TeamType.Null) {
      return { hasUnit: false, objectType: 0, objectId: 0 };
    }

    if (
      theTime >= this.finalProductionTime &&
      !GameEntity.unitLimitReachedList?.[this.owner]
    ) {
      return {
        hasUnit: true,
        objectType: this.bot,
        objectId: this.boid,
      };
    }

    return { hasUnit: false, objectType: 0, objectId: 0 };
  }

  /**
   * Port of upstream `ZBuilding::GetBuildingCreationPoint`.
   * Role: Reports where newly-created units spawn relative to this building.
   * Upstream: zbuilding.cpp:529-535
   */
  override getBuildingCreationPoint(): { hasPoint: boolean; x: number; y: number } {
    return {
      hasPoint: true,
      x: this.position.x + this.unitCreateX,
      y: this.position.y + this.unitCreateY,
    };
  }

  /**
   * Port of upstream `ZBuilding::GetBuildingCreationMovePoint`.
   * Role: Reports where newly-created units should move after spawning.
   * Upstream: zbuilding.cpp:520-526
   */
  override getBuildingCreationMovePoint(): { hasPoint: boolean; x: number; y: number } {
    return {
      hasPoint: true,
      x: this.position.x + this.unitMoveX,
      y: this.position.y + this.unitMoveY,
    };
  }

  /**
   * Port of upstream `ZBuilding::ChangePalette`.
   * Role: Stores the building render palette.
   * Upstream: zbuilding.cpp:93-96
   */
  changePalette(palette: PlanetType): void {
    this.palette = palette;
  }

  /**
   * Port of upstream `ZBuilding::SetLevel`.
   * Role: Updates the building production level.
   * Upstream: zbuilding.cpp:559-562
   */
  override setLevel(level: number): void {
    this.level = level;
  }

  /**
   * Port of upstream `ZBuilding::SetOwner`.
   * Role: Updates building ownership and marks the base image for rerender.
   * Upstream: zbuilding.cpp:548-552
   */
  override setOwner(owner: TeamType): void {
    this.owner = owner;
    this.doBaseRerender = true;
  }

  /**
   * Port of upstream `ZBuilding::SetBuildingDefaultProduction`.
   * Role: Starts production for the first available unit in this building's build list.
   * Upstream: zbuilding.cpp:103-116
   */
  override setBuildingDefaultProduction(): boolean {
    if (
      this.bot !== -1 ||
      this.boid !== -1 ||
      this.buildState !== BuildingState.Select
    ) {
      return false;
    }

    const firstUnit = this.buildList?.getFirstUnitInBuildList(
      this.objectId,
      this.level,
    );
    if (!firstUnit?.hasUnit) return false;

    return this.setBuildingProduction(firstUnit.objectType, firstUnit.objectId);
  }

  /**
   * Port of upstream `ZBuilding::SetBuildingProduction`.
   * Role: Starts production for an available unit and seeds the production queue when empty.
   * Upstream: zbuilding.cpp:118-147
   */
  override setBuildingProduction(objectType: number, objectId: number): boolean {
    const theTime = this.ztime?.ztime ?? 0;

    if (this.owner === TeamType.Null) return false;
    if (!this.producesUnits()) return false;
    if (objectType === this.bot && objectId === this.boid) return false;
    if (!this.buildList?.unitInBuildList(this.objectId, this.level, objectType, objectId)) {
      return false;
    }

    this.bot = objectType;
    this.boid = objectId;
    this.buildState = BuildingState.Building;
    this.initialProductionTime = theTime;
    this.recalcBuildTime();

    if (!this.queueList.length) {
      this.addBuildingQueue(objectType, objectId);
    }

    return true;
  }

  /**
   * Port of upstream `ZBuilding::AddBuildingQueue`.
   * Role: Adds an available production unit to the front or back of the building queue.
   * Upstream: zbuilding.cpp:149-171
   */
  override addBuildingQueue(
    objectType: number,
    objectId: number,
    pushToFront = true,
  ): boolean {
    if (this.owner === TeamType.Null) return false;
    if (!this.producesUnits()) return false;
    if (this.queueList.length >= BUILDING_MAX_QUEUE_ITEMS) return false;
    if (!this.buildList?.unitInBuildList(this.objectId, this.level, objectType, objectId)) {
      return false;
    }

    const queuedUnit = new ZBProductionUnit(objectType, objectId);
    if (pushToFront) {
      this.queueList.unshift(queuedUnit);
    } else {
      this.queueList.push(queuedUnit);
    }

    return true;
  }

  /**
   * Port of upstream `ZBuilding::DoReviveEffect`.
   * Role: Marks the building base for rerendering and clears transient extra effects.
   * Upstream: zbuilding.cpp:569-578
   */
  override doReviveEffect(): void {
    this.doBaseRerender = true;
    this.extraEffects = [];
  }

  /**
   * Port of upstream `ZBuilding::BuildTimeModified`.
   * Role: Adjusts build time from zone ownership and current building damage.
   * Upstream: zbuilding.cpp:665-671
   */
  buildTimeModified(baseBuildTime: number): number {
    let buildTime = baseBuildTime;
    buildTime -= buildTime * 0.5 * this.zoneOwnage;
    buildTime +=
      buildTime * (1.25 * (1.0 - (1.0 * this.health) / this.maxHealth));

    return buildTime;
  }

  /**
   * Port of upstream `ZBuilding::ResetBuildTime`.
   * Role: Updates clamped zone ownership and recalculates production timing when it changes.
   * Upstream: zbuilding.cpp:625-635
   */
  override resetBuildTime(zoneOwnage: number): boolean {
    if (zoneOwnage === this.zoneOwnage) return false;

    this.zoneOwnage = zoneOwnage;
    if (this.zoneOwnage > 1) this.zoneOwnage = 1;
    if (this.zoneOwnage < 0) this.zoneOwnage = 0;

    return this.recalcBuildTime();
  }

  /**
   * Port of upstream `ZBuilding::RecalcBuildTime`.
   * Role: Recalculates the current production final time from build-list timing and building modifiers.
   * Upstream: zbuilding.cpp:637-663
   */
  override recalcBuildTime(): boolean {
    const finalProductionTimeOld = this.finalProductionTime;

    if (!this.buildList) return false;
    if (this.bot === -1) return false;
    if (this.boid === -1) return false;
    if (this.buildState === BuildingState.Select) return false;

    const buildTime = this.buildTimeModified(
      this.buildList.unitBuildTime(this.bot, this.boid),
    );
    this.finalProductionTime = this.initialProductionTime + buildTime;

    return finalProductionTimeOld !== this.finalProductionTime;
  }

  /**
   * Port of upstream `ZBuilding::CancelBuildingQueue`.
   * Role: Removes a queued production item when ownership, bounds, and object id checks pass.
   * Upstream: zbuilding.cpp:173-192
   */
  override cancelBuildingQueue(
    index: number,
    objectType: number,
    objectId: number,
  ): boolean {
    if (this.owner === TeamType.Null) return false;
    if (!this.producesUnits()) return false;
    if (index < 0) return false;
    if (index >= this.queueList.length) return false;

    const queuedUnit = this.queueList[index];
    if (objectType !== queuedUnit.ot) return false;
    if (objectId !== queuedUnit.oid) return false;

    this.queueList.splice(index, 1);
    return true;
  }

  /**
   * Port of upstream `ZBuilding::ProductionTimeLeft`.
   * Role: Reports remaining production time, clamped at zero after completion.
   * Upstream: zbuilding.cpp:378-387
   */
  productionTimeLeft(theTime: number): number {
    return Math.max(this.finalProductionTime - theTime, 0);
  }

  /**
   * Port of upstream `ZBuilding::PercentageProduced`.
   * Role: Reports current production progress as a clamped ratio.
   * Upstream: zbuilding.cpp:366-376
   */
  percentageProduced(theTime: number): number {
    return getBuildingPercentageProduced(this, theTime);
  }

  /**
   * Port of upstream `ZBuilding::DoDeathEffect`.
   * Role: Marks the building base image for rerender after death effects.
   * Upstream: zbuilding.cpp:564-567
   */
  override doDeathEffect(doFireDeath: boolean, doMissileDeath: boolean): void {
    void doFireDeath;
    void doMissileDeath;
    this.doBaseRerender = true;
  }

  /**
   * Port of upstream `ZBuilding::HaveStoredCannon`.
   * Role: Reports whether this building has a stored cannon matching an id.
   * Upstream: zbuilding.cpp:471-479
   */
  override haveStoredCannon(objectId: number): boolean {
    return this.builtCannonList.some((storedObjectId) => storedObjectId === objectId);
  }

  /**
   * Port of upstream `ZBuilding::CannonsInZone`.
   * Role: Counts active and stored cannons connected to this building's map zone.
   * Upstream: zbuilding.cpp:433-456
   */
  override cannonsInZone(ols: { objectList: GameEntity[] }): number {
    let cannonsFound = this.builtCannonList.length;

    for (const object of ols.objectList) {
      if (this === object) continue;
      if (this.connectedZone !== object.connectedZone) continue;

      const objectId = object.getObjectId();

      if (objectId.objectType === MapObjectType.Building) {
        if (object instanceof BuildingEntity) {
          cannonsFound += object.builtCannonList.length;
        }
      }

      if (objectId.objectType !== MapObjectType.Cannon) continue;

      cannonsFound += 1;
    }

    return cannonsFound;
  }

  /**
   * Port of upstream `ZBuilding::StoreBuiltCannon`.
   * Role: Stores a built cannon id while enforcing the building cannon capacity.
   * Upstream: zbuilding.cpp:422-431
   */
  override storeBuiltCannon(objectId: number): boolean {
    if (this.builtCannonList.length >= MAX_STORED_CANNONS) return false;

    this.builtCannonList.push(objectId);

    return true;
  }

  /**
   * Port of upstream `ZBuilding::RemoveStoredCannon`.
   * Role: Removes the first stored cannon matching an id.
   * Upstream: zbuilding.cpp:458-469
   */
  override removeStoredCannon(objectId: number): boolean {
    const storedIndex = this.builtCannonList.findIndex(
      (storedObjectId) => storedObjectId === objectId,
    );

    if (storedIndex === -1) return false;

    this.builtCannonList.splice(storedIndex, 1);

    return true;
  }

  /**
   * Port of upstream `ZBuilding::ProcessSetBuiltCannonData`.
   * Role: Replaces the stored cannon list from serialized built-cannon update data.
   * Upstream: zbuilding.cpp:307-326
   */
  override processSetBuiltCannonData(data: Uint8Array | null, size: number): void {
    if (!data) return;
    if (size < 8) return;
    if (data.length < size) return;

    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    const cannonAmount = view.getInt32(4, true);
    if (size - 8 !== cannonAmount) return;

    this.builtCannonList = [];
    for (let i = 0; i < cannonAmount; i += 1) {
      this.builtCannonList.push(data[8 + i]);
    }
  }

  /**
   * Port of upstream `ZBuilding::ProcessSetBuildingStateData`.
   * Role: Applies serialized building production state and timing updates for this building.
   * Upstream: zbuilding.cpp:345-364
   */
  override processSetBuildingStateData(
    data: SetBuildingStatePacket | Uint8Array | null,
    size: number,
  ): void {
    if (!data) return;
    if (data instanceof Uint8Array) return;
    if (size !== SET_BUILDING_STATE_PACKET_SIZE_BYTES) return;
    if (this.refId !== data.refId) return;

    const theTime = this.ztime?.ztime ?? 0;

    this.buildState = data.state;
    this.bot = data.objectType;
    this.boid = data.objectId;
    this.initialProductionTime = theTime + data.initOffset;
    this.finalProductionTime = this.initialProductionTime + data.productionTime;
    this.totalProductionTime = data.productionTime;
  }

  /**
   * Port of upstream `ZBuilding::CreateBuildingStateData`.
   * Role: Serializes the current building production state and timing for network updates.
   * Upstream: zbuilding.cpp:328-343
   */
  override createBuildingStateData(): BuildingStateData {
    const data = new Uint8Array(SET_BUILDING_STATE_PACKET_SIZE_BYTES);
    const view = new DataView(data.buffer);
    const theTime = this.ztime?.ztime ?? 0;

    view.setInt32(0, this.refId, true);
    view.setInt32(4, this.buildState, true);
    view.setFloat64(8, this.initialProductionTime - theTime, true);
    view.setFloat64(16, this.finalProductionTime - this.initialProductionTime, true);
    data[24] = this.bot & 0xff;
    data[25] = this.boid & 0xff;

    return { data, size: SET_BUILDING_STATE_PACKET_SIZE_BYTES };
  }

  /**
   * Port of upstream `ZBuilding::CreateBuiltCannonData`.
   * Role: Serializes the building reference id and stored cannon ids for network updates.
   * Upstream: zbuilding.cpp:292-305
   */
  override createBuiltCannonData(): { data: Uint8Array; size: number } {
    const size = 8 + this.builtCannonList.length;
    const data = new Uint8Array(size);
    const view = new DataView(data.buffer);

    view.setInt32(0, this.refId, true);
    view.setInt32(4, this.builtCannonList.length, true);

    this.builtCannonList.forEach((objectId, index) => {
      data[8 + index] = objectId & 0xff;
    });

    return { data, size };
  }

  /**
   * Port of upstream `ZBuilding::CreateBuildingQueueData`.
   * Role: Serializes the building reference id and queued production units for network updates.
   * Upstream: zbuilding.cpp:194-222
   */
  override createBuildingQueueData(): BuildingQueueData {
    if (!this.producesUnits()) {
      return { data: null, size: 0 };
    }

    const size = 8 + this.queueList.length * 2;
    const data = new Uint8Array(size);
    const view = new DataView(data.buffer);

    view.setInt32(0, this.refId, true);
    view.setInt32(4, this.queueList.length, true);

    this.queueList.forEach((queuedUnit, index) => {
      const offset = 8 + index * 2;
      data[offset] = queuedUnit.ot & 0xff;
      data[offset + 1] = queuedUnit.oid & 0xff;
    });

    return { data, size };
  }

  /**
   * Port of upstream `ZBuilding::ResetProduction`.
   * Role: Restarts production from the first queued unit or stops production when the queue is empty.
   * Upstream: zbuilding.cpp:481-510
   */
  override resetProduction(): void {
    const queuedUnit = this.queueList.shift();

    if (queuedUnit) {
      this.stopBuildingProduction(false);
      this.setBuildingProduction(queuedUnit.ot, queuedUnit.oid);
      return;
    }

    this.stopBuildingProduction();
  }

  /**
   * Port of upstream `ZBuilding::StopBuildingProduction`.
   * Role: Resets active building production and optionally clears queued units.
   * Upstream: zbuilding.cpp:278-290
   */
  override stopBuildingProduction(clearQueueList = true): boolean {
    if (
      this.bot === -1 &&
      this.boid === -1 &&
      this.buildState === BuildingState.Select
    ) {
      return false;
    }

    this.buildState = BuildingState.Select;
    this.bot = -1;
    this.boid = -1;

    if (clearQueueList) this.queueList.length = 0;

    return true;
  }
}

/**
 * Port of upstream `ZBuilding::SetZoneOwnage`.
 * Role: Updates the building zone ownership fraction.
 * Upstream: zbuilding.h:69
 */
export function setBuildingZoneOwnage(
  state: BuildingZoneOwnageState,
  zoneOwnage: number,
): void {
  state.zoneOwnage = zoneOwnage;
}

/**
 * Port of upstream `ProductionTimeTotal`.
 * Role: Returns the total production duration tracked for the current build.
 * Upstream: zbuilding.h:51
 */
export function getBuildingProductionTimeTotal(
  state: BuildingProductionTimeState,
): number {
  return state.totalProductionTime;
}

/**
 * Port of upstream `ZBuilding::ProductionTimeLeft`.
 * Role: Computes remaining production time from a building timing state.
 * Upstream: zbuilding.cpp:378-387
 */
export function getBuildingProductionTimeLeft(
  state: Pick<BuildingProductionProgressState, "finalProductionTime">,
  theTime: number,
): number {
  return Math.max(state.finalProductionTime - theTime, 0);
}

/**
 * Port of upstream `ZBuilding::PercentageProduced`.
 * Role: Computes production progress from initial/final production timestamps.
 * Upstream: zbuilding.cpp:366-376
 */
export function getBuildingPercentageProduced(
  state: BuildingProductionProgressState,
  theTime: number,
): number {
  const percentage =
    (theTime - state.initialProductionTime) /
    (state.finalProductionTime - state.initialProductionTime);

  if (percentage < 0) return 0;
  if (percentage > 1) return 1;

  return percentage;
}

/**
 * Port of upstream `min_interval_time` from `BVehicle`.
 * Role: Defines the minimum time interval between vehicle factory process updates.
 * Upstream: bvehicle.cpp:139
 */
export const VEHICLE_FACTORY_MIN_PROCESS_INTERVAL_SECONDS = 0.25;

/**
 * Port of upstream `exhaust_x` from `BVehicle`.
 * Role: Defines the x offset of the vehicle factory exhaust effect source.
 * Upstream: bvehicle.cpp:232
 */
export const VEHICLE_FACTORY_EXHAUST_X_PIXELS = 28;

/**
 * Port of upstream `exhaust_y` from `BVehicle`.
 * Role: Defines the y offset of the vehicle factory exhaust effect source.
 * Upstream: bvehicle.cpp:233
 */
export const VEHICLE_FACTORY_EXHAUST_Y_PIXELS = -22;

/**
 * Port of upstream `bulb_x` from `BVehicle`.
 * Role: Defines the x offset of the vehicle factory bulb effect source.
 * Upstream: bvehicle.cpp:224
 */
export const VEHICLE_FACTORY_BULB_X_PIXELS = 24;

/**
 * Port of upstream `bulb_y` from `BVehicle`.
 * Role: Defines the y offset of the vehicle factory bulb effect source.
 * Upstream: bvehicle.cpp:225
 */
export const VEHICLE_FACTORY_BULB_Y_PIXELS = 39;

/**
 * Port of upstream `x_plus` from `BVehicle`.
 * Role: Defines the additional x offset applied while rendering the vehicle factory building effect layer.
 * Upstream: bvehicle.cpp:361
 */
export const VEHICLE_FACTORY_EFFECT_X_OFFSET_PIXELS = 15;

/**
 * Port of upstream `y_plus` from `BVehicle`.
 * Role: Defines the additional y offset applied while rendering the vehicle factory building effect layer.
 * Upstream: bvehicle.cpp:362
 */
export const VEHICLE_FACTORY_EFFECT_Y_OFFSET_PIXELS = 8;

/**
 * Port of upstream `level_x` from `BVehicle`.
 * Role: Defines the x offset of the vehicle factory level indicator effect source.
 * Upstream: bvehicle.cpp:176, bvehicle.cpp:228
 */
export const VEHICLE_FACTORY_LEVEL_X_PIXELS = 8;

/**
 * Port of upstream `level_y` from `BVehicle`.
 * Role: Defines the y offset of the vehicle factory level indicator effect source.
 * Upstream: bvehicle.cpp:177, bvehicle.cpp:229
 */
export const VEHICLE_FACTORY_LEVEL_Y_PIXELS = 56;

/**
 * Port of upstream `lights_y` from `BVehicle`.
 * Role: Defines the y offset of the vehicle factory lights effect source.
 * Upstream: bvehicle.cpp:231
 */
export const VEHICLE_FACTORY_LIGHTS_Y_PIXELS = 47;

/**
 * Port of upstream `spin_x` from `BVehicle`.
 * Role: Defines the x offset of the vehicle factory spinner effect source.
 * Upstream: bvehicle.cpp:220
 */
export const VEHICLE_FACTORY_SPINNER_X_PIXELS = 9;

/**
 * Port of upstream `spin_y` from `BVehicle`.
 * Role: Defines the y offset of the vehicle factory spinner effect source.
 * Upstream: bvehicle.cpp:221
 */
export const VEHICLE_FACTORY_SPINNER_Y_PIXELS = -2;

/**
 * Port of upstream `tank_x` from `BVehicle`.
 * Role: Defines the x offset of the vehicle factory tank effect source.
 * Upstream: bvehicle.cpp:226
 */
export const VEHICLE_FACTORY_TANK_X_PIXELS = 16;

/**
 * Port of upstream `tank_y` from `BVehicle`.
 * Role: Defines the y offset of the vehicle factory tank effect source.
 * Upstream: bvehicle.cpp:227
 */
export const VEHICLE_FACTORY_TANK_Y_PIXELS = 48;

/**
 * Port of upstream `vent_x` from `BVehicle`.
 * Role: Defines the x offset of the vehicle factory vent effect source.
 * Upstream: bvehicle.cpp:222
 */
export const VEHICLE_FACTORY_VENT_X_PIXELS = 16;

/**
 * Port of upstream `vent_y` from `BVehicle`.
 * Role: Defines the y offset of the vehicle factory vent effect source.
 * Upstream: bvehicle.cpp:223
 */
export const VEHICLE_FACTORY_VENT_Y_PIXELS = 32;

/**
 * Port of upstream `min_interval_time` from `BRobot`.
 * Role: Defines the minimum time interval between robot factory process updates.
 * Upstream: brobot.cpp:138
 */
export const ROBOT_FACTORY_MIN_PROCESS_INTERVAL_SECONDS = 0.25;

/**
 * Port of upstream `double_light_x` from `BRobot`.
 * Role: Defines the x offset of the robot factory double-light effect source.
 * Upstream: brobot.cpp:221
 */
export const ROBOT_FACTORY_DOUBLE_LIGHT_X_PIXELS = 16;

/**
 * Port of upstream `double_light_y` from `BRobot`.
 * Role: Defines the y offset of the robot factory double-light effect source.
 * Upstream: brobot.cpp:222
 */
export const ROBOT_FACTORY_DOUBLE_LIGHT_Y_PIXELS = 32;

/**
 * Port of upstream `exhaust_x` from `BRobot`.
 * Role: Defines the x offset of the robot factory exhaust effect source.
 * Upstream: brobot.cpp:229
 */
export const ROBOT_FACTORY_EXHAUST_X_PIXELS = 28;

/**
 * Port of upstream `exhaust_y` from `BRobot`.
 * Role: Defines the y offset of the robot factory exhaust effect source.
 * Upstream: brobot.cpp:230
 */
export const ROBOT_FACTORY_EXHAUST_Y_PIXELS = -24;

/**
 * Port of upstream `green_box_x` from `BRobot`.
 * Role: Defines the x offset of the robot factory green-box effect source.
 * Upstream: brobot.cpp:227
 */
export const ROBOT_FACTORY_GREEN_BOX_X_PIXELS = 38;

/**
 * Port of upstream `green_box_y` from `BRobot`.
 * Role: Defines the y offset of the robot factory green-box effect source.
 * Upstream: brobot.cpp:228
 */
export const ROBOT_FACTORY_GREEN_BOX_Y_PIXELS = 39;

/**
 * Port of upstream `level_x` from `BRobot`.
 * Role: Defines the x offset of the robot factory level indicator effect source.
 * Upstream: brobot.cpp:225
 */
export const ROBOT_FACTORY_LEVEL_X_PIXELS = 8;

/**
 * Port of upstream `level_y` from `BRobot`.
 * Role: Defines the y offset of the robot factory level indicator effect source.
 * Upstream: brobot.cpp:226
 */
export const ROBOT_FACTORY_LEVEL_Y_PIXELS = 56;

/**
 * Port of upstream `robot_x` from `BRobot`.
 * Role: Defines the x offset of the robot factory robot-body effect source.
 * Upstream: brobot.cpp:219
 */
export const ROBOT_FACTORY_ROBOT_X_PIXELS = 16;

/**
 * Port of upstream `robot_y` from `BRobot`.
 * Role: Defines the y offset of the robot factory robot-body effect source.
 * Upstream: brobot.cpp:220
 */
export const ROBOT_FACTORY_ROBOT_Y_PIXELS = 48;

/**
 * Port of upstream `single_light_y` from `BRobot`.
 * Role: Defines the y offset of the robot factory single-light effect source.
 * Upstream: brobot.cpp:224
 */
export const ROBOT_FACTORY_SINGLE_LIGHT_Y_PIXELS = 68;

/**
 * Port of upstream `spin_x` from `BRobot`.
 * Role: Defines the x offset of the robot factory spinner effect source.
 * Upstream: brobot.cpp:217
 */
export const ROBOT_FACTORY_SPINNER_X_PIXELS = 9;

/**
 * Port of upstream `spin_y` from `BRobot`.
 * Role: Defines the y offset of the robot factory spinner effect source.
 * Upstream: brobot.cpp:218
 */
export const ROBOT_FACTORY_SPINNER_Y_PIXELS = -2;

/**
 * Port of upstream `x_plus` from `BRobot`.
 * Role: Defines the additional x offset applied while rendering the robot factory building effect layer.
 * Upstream: brobot.cpp:360
 */
export const ROBOT_FACTORY_EFFECT_X_OFFSET_PIXELS = 19;

/**
 * Port of upstream `y_plus` from `BRobot`.
 * Role: Defines the additional y offset applied while rendering the robot factory building effect layer.
 * Upstream: brobot.cpp:361
 */
export const ROBOT_FACTORY_EFFECT_Y_OFFSET_PIXELS = 8;

/**
 * Port of upstream `min_interval_time` from `BRepair`.
 * Role: Defines the minimum time interval between repair building process updates.
 * Upstream: brepair.cpp:125
 */
export const REPAIR_MIN_PROCESS_INTERVAL_SECONDS = 0.35;

/**
 * Port of upstream `front_light_x` from `BRepair`.
 * Role: Defines the x offset of the repair building front-light effect source.
 * Upstream: brepair.cpp:208
 */
export const REPAIR_FRONT_LIGHT_X_PIXELS = 6;

/**
 * Port of upstream `front_light_y` from `BRepair`.
 * Role: Defines the y offset of the repair building front-light effect source.
 * Upstream: brepair.cpp:209
 */
export const REPAIR_FRONT_LIGHT_Y_PIXELS = 16;

/**
 * Port of upstream `side_light_x` from `BRepair`.
 * Role: Defines the x offset of the repair building side-light effect source.
 * Upstream: brepair.cpp:210
 */
export const REPAIR_SIDE_LIGHT_X_PIXELS = 18;

/**
 * Port of upstream `side_light_y` from `BRepair`.
 * Role: Defines the y offset of the repair building side-light effect source.
 * Upstream: brepair.cpp:211
 */
export const REPAIR_SIDE_LIGHT_Y_PIXELS = 6;

/**
 * Port of upstream `bulb_x` from `BRepair`.
 * Role: Defines the x offset of the repair building bulb effect source.
 * Upstream: brepair.cpp:212
 */
export const REPAIR_BULB_X_PIXELS = 32;

/**
 * Port of upstream `bulb_y` from `BRepair`.
 * Role: Defines the y offset of the repair building bulb effect source.
 * Upstream: brepair.cpp:213
 */
export const REPAIR_BULB_Y_PIXELS = 0;

/**
 * Port of upstream `smoke_stack_x` from `BRepair`.
 * Role: Defines the x offset of the repair building smoke-stack effect source.
 * Upstream: brepair.cpp:214
 */
export const REPAIR_SMOKE_STACK_X_PIXELS = 61;

/**
 * Port of upstream `smoke_stack_y` from `BRepair`.
 * Role: Defines the y offset of the repair building smoke-stack effect source.
 * Upstream: brepair.cpp:215
 */
export const REPAIR_SMOKE_STACK_Y_PIXELS = 0;

/**
 * Port of upstream `text_box_x` from `BRepair`.
 * Role: Defines the x offset of the repair building status text box source.
 * Upstream: brepair.cpp:216
 */
export const REPAIR_TEXT_BOX_X_PIXELS = 16;

/**
 * Port of upstream `text_box_y` from `BRepair`.
 * Role: Defines the y offset of the repair building status text box source.
 * Upstream: brepair.cpp:217
 */
export const REPAIR_TEXT_BOX_Y_PIXELS = 32;

/**
 * Port of upstream `x_plus` from `BRepair`.
 * Role: Defines the additional x offset applied while rendering the repair building effect layer.
 * Upstream: brepair.cpp:239, brepair.cpp:357
 */
export const REPAIR_EFFECT_X_OFFSET_PIXELS = 10;

/**
 * Port of upstream `y_plus` from `BRepair`.
 * Role: Defines the additional y offset applied while rendering the repair building effect layer.
 * Upstream: brepair.cpp:240, brepair.cpp:358
 */
export const REPAIR_EFFECT_Y_OFFSET_PIXELS = 6;

/**
 * Port of upstream `min_interval_time`.
 * Role: Defines the minimum time interval between radar building process updates.
 * Upstream: bradar.cpp:118
 */
export const RADAR_MIN_PROCESS_INTERVAL_SECONDS = 0.25;

/**
 * Port of upstream `front_light_x`.
 * Role: Defines the x offset of the radar building front-light effect source.
 * Upstream: bradar.cpp:194
 */
export const RADAR_FRONT_LIGHT_X_PIXELS = 16;

/**
 * Port of upstream `front_light_y`.
 * Role: Defines the y offset of the radar building front-light effect source.
 * Upstream: bradar.cpp:195
 */
export const RADAR_FRONT_LIGHT_Y_PIXELS = 22;

/**
 * Port of upstream `side_light_x`.
 * Role: Defines the x offset of the radar building side-light effect source.
 * Upstream: bradar.cpp:196
 */
export const RADAR_SIDE_LIGHT_X_PIXELS = 41;

/**
 * Port of upstream `side_light_y`.
 * Role: Defines the y offset of the radar building side-light effect source.
 * Upstream: bradar.cpp:197
 */
export const RADAR_SIDE_LIGHT_Y_PIXELS = 0;

/**
 * Port of upstream `box_spinner_x`.
 * Role: Defines the x offset of the radar building box-spinner effect source.
 * Upstream: bradar.cpp:198
 */
export const RADAR_BOX_SPINNER_X_PIXELS = 18;

/**
 * Port of upstream `box_spinner_y`.
 * Role: Defines the y offset of the radar building box-spinner effect source.
 * Upstream: bradar.cpp:199
 */
export const RADAR_BOX_SPINNER_Y_PIXELS = 13;

/**
 * Port of upstream `dish_x`.
 * Role: Defines the x offset of the radar building dish effect source.
 * Upstream: bradar.cpp:200
 */
export const RADAR_DISH_X_PIXELS = 15;

/**
 * Port of upstream `x_plus`.
 * Role: Defines the additional x offset applied while rendering the radar building effect layer.
 * Upstream: bradar.cpp:276
 */
export const RADAR_EFFECT_X_OFFSET_PIXELS = 12;

/**
 * Port of upstream `y_plus`.
 * Role: Defines the additional y offset applied while rendering the radar building effect layer.
 * Upstream: bradar.cpp:277
 */
export const RADAR_EFFECT_Y_OFFSET_PIXELS = 0;
