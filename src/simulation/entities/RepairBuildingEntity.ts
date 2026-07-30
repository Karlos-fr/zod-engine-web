/**
 * Upstream: brepair.h / brepair.cpp
 */

import { TeamType } from "../SimulationConstants";
import { BuildingEntity } from "./BuildingTypes";
import {
  type DriverInfo,
  Waypoint,
} from "./EntityTypes";
import type { RepairAnimData, RepairUnitOutput } from "./GameEntity";
import type { GameMap } from "../../world/GameMap";

const REPAIR_BUILDING_ANIM_PACKET_SIZE_BYTES = 24;

/**
 * Browser simulation entity containing the subset of `BRepair` behavior already ported.
 * Role: Represents repair-building-specific behavior over the shared game-entity base.
 * Upstream: brepair.h
 */
export class RepairBuildingEntity extends BuildingEntity {
  repairingUnit = false;
  repairTime = 0;
  bulbIndex = 0;
  smokeStackIndex = 0;
  repairObjectType = 0;
  repairObjectId = 0;
  repairDriverType = 0;
  repairDriverInfo: DriverInfo[] = [];
  repairWaypointList: Waypoint[] = [];

  /**
   * Port of upstream `BRepair::SetMapImpassables`.
   * Role: Marks the repair building footprint as blocked on the pathfinding map.
   * Upstream: brepair.cpp:427-443
   */
  override setMapImpassables(tmap: GameMap): void {
    const tileX = Math.trunc(this.position.x / 16);
    const tileY = Math.trunc(this.position.y / 16);
    const endX = tileX + this.width;
    const endY = tileY + this.height;

    for (let x = tileX; x < endX; x += 1) {
      for (let y = tileY; y < endY; y += 1) {
        tmap.setImpassable(x, y);
      }
    }
  }

  /**
   * Port of upstream `BRepair::RepairingAUnit`.
   * Role: Reports whether the repair building is currently repairing a unit.
   * Upstream: brepair.cpp:482-485
   */
  override repairingAUnit(): boolean {
    return this.repairingUnit;
  }

  /**
   * Port of upstream `BRepair::DoRepairBuildingAnim`.
   * Role: Toggles repair animation timing and resets visible repair-effect frame indices when enabled.
   * Upstream: brepair.cpp:534-546
   */
  override doRepairBuildingAnim(on: boolean, remainingTime: number): void {
    const theTime = this.ztime?.ztime ?? 0;

    this.repairingUnit = on;
    this.repairTime = theTime + remainingTime;

    if (this.repairingUnit) {
      this.bulbIndex = 0;
      this.smokeStackIndex = 0;
    }
  }

  /**
   * Port of upstream `BRepair::CreateRepairAnimData`.
   * Role: Creates the repair-building animation packet for network synchronization.
   * Upstream: brepair.cpp:514-532
   */
  override createRepairAnimData(playSound = true): RepairAnimData {
    const theTime = this.ztime?.ztime ?? 0;

    return {
      data: {
        refId: this.refId,
        on: this.repairingUnit,
        playSound,
        remainingTime: this.repairingUnit ? this.repairTime - theTime : 0,
      },
      size: REPAIR_BUILDING_ANIM_PACKET_SIZE_BYTES,
    };
  }

  /**
   * Port of upstream `BRepair::RepairUnit`.
   * Role: Emits a completed repaired unit payload once the active repair timer has elapsed.
   * Upstream: brepair.cpp:548-563
   */
  override repairUnit(output: RepairUnitOutput): boolean {
    const theTime = this.ztime?.ztime ?? output.time;

    if (!this.repairingUnit) return false;
    if (theTime < this.repairTime) return false;

    output.objectType = this.repairObjectType;
    output.objectId = this.repairObjectId;
    output.driverType = this.repairDriverType;
    output.driverInfo = this.repairDriverInfo.map((driver) => ({ ...driver }));
    output.waypointList = this.repairWaypointList.map((waypoint) =>
      Object.assign(new Waypoint(), waypoint),
    );

    this.repairingUnit = false;

    return true;
  }

  /**
   * Port of upstream `BRepair::CanRepairUnit`.
   * Role: Reports whether this repair building can repair a unit from the given team.
   * Upstream: brepair.cpp:473-480
   */
  override canRepairUnit(unitsTeam: TeamType): boolean {
    if (this.owner === TeamType.Null) return false;
    if (unitsTeam !== this.owner) return false;
    if (this.isDestroyed()) return false;

    return true;
  }

  /**
   * Port of upstream `BRepair::GetCraneEntrance`.
   * Role: Reports the repair-building crane entrance and exit point below the building.
   * Upstream: brepair.cpp:445-450
   */
  override getCraneEntrance(): {
    canEnter: boolean;
    x: number;
    y: number;
    exitX: number;
    exitY: number;
  } {
    const x = this.position.x + 32;
    const y = this.position.y + this.pixelHeight + 32;

    return {
      canEnter: true,
      x,
      y,
      exitX: x,
      exitY: y,
    };
  }

  /**
   * Port of upstream `BRepair::GetCraneCenter`.
   * Role: Reports the repair-building crane interaction center.
   * Upstream: brepair.cpp:452-457
   */
  override getCraneCenter(): { hasCenter: boolean; x: number; y: number } {
    return {
      hasCenter: true,
      x: this.position.x + 32,
      y: this.position.y + 32,
    };
  }

  /**
   * Port of upstream `BRepair::GetRepairEntrance`.
   * Role: Reports the vehicle repair entrance below the building.
   * Upstream: brepair.cpp:459-464
   */
  override getRepairEntrance(): { x: number; y: number } {
    return {
      x: this.position.x + 32,
      y: this.position.y + this.pixelHeight + 32,
    };
  }

  /**
   * Port of upstream `BRepair::GetRepairCenter`.
   * Role: Reports the repair interaction center for vehicles entering this building.
   * Upstream: brepair.cpp:466-471
   */
  override getRepairCenter(): { hasCenter: boolean; x: number; y: number } {
    return {
      hasCenter: true,
      x: this.position.x + 32,
      y: this.position.y + 32,
    };
  }
}
