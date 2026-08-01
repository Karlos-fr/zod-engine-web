/**
 * Upstream: bvehicle.h
 */

import type { GameMap } from "../../world/GameMap";
import {
  BuildingEntity,
  BuildingState,
  type BuildingShowTimeTextRenderer,
} from "./BuildingTypes";

/**
 * Browser simulation entity containing the subset of `BVehicle` behavior already ported.
 * Role: Represents vehicle factory behavior over the base game entity.
 * Upstream: bvehicle.h
 */
export class VehicleFactoryEntity extends BuildingEntity {
  spinIndex = 0;
  ventIndex = 0;
  exhaustIndex = 0;
  bulbIndex = 0;
  tankIndex = 0;
  lastProcessTime = 0;

  /**
   * Port of upstream `BVehicle::Process`.
   * Role: Advances vehicle-factory animation frames and refreshes production countdown display.
   * Upstream: bvehicle.cpp:136-172
   */
  override process<TImage = unknown>(
    currentTime = this.ztime?.ztime ?? 0,
    processBuildingEffects: ((currentTime: number) => void) | null = null,
    renderShowTimeText: BuildingShowTimeTextRenderer<TImage> = (_font, text) =>
      text as TImage,
  ): number {
    const minIntervalTime = 0.25;

    processBuildingEffects?.(currentTime);

    if (currentTime - this.lastProcessTime >= minIntervalTime) {
      this.lastProcessTime = currentTime;

      this.spinIndex += 1;
      if (this.spinIndex >= 8) this.spinIndex = 0;

      this.ventIndex += 1;
      if (this.ventIndex >= 4) this.ventIndex = 0;

      this.exhaustIndex += 1;
      if (this.exhaustIndex >= 13) this.exhaustIndex = 0;

      this.bulbIndex += 1;
      if (this.bulbIndex >= 2) this.bulbIndex = 0;

      this.tankIndex += 1;
      if (this.tankIndex >= 2) this.tankIndex = 0;
    }

    if (this.buildState !== BuildingState.Select) {
      this.resetShowTime(
        Math.trunc(this.productionTimeLeft(currentTime)),
        renderShowTimeText,
      );
    } else {
      this.resetShowTime(-1, renderShowTimeText);
    }

    return 1;
  }

  /**
   * Port of upstream `BVehicle::SetMapImpassables`.
   * Role: Marks the vehicle factory footprint as blocked on the pathfinding map.
   * Upstream: bvehicle.cpp:460-476
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
   * Port of upstream `CanSetRallypoints`.
   * Role: Reports whether vehicle factories can set rally points.
   * Upstream: bvehicle.h:20
   */
  override canSetRallypoints(): boolean {
    return true;
  }

  /**
   * Port of upstream `ProducesUnits`.
   * Role: Reports whether vehicle factories can produce units.
   * Upstream: bvehicle.h:21
   */
  override producesUnits(): boolean {
    return true;
  }

  /**
   * Port of upstream `BVehicle::GetCraneEntrance`.
   * Role: Reports the vehicle factory crane entrance and exit point below the building.
   * Upstream: bvehicle.cpp:478-483
   */
  override getCraneEntrance(): {
    canEnter: boolean;
    x: number;
    y: number;
    exitX: number;
    exitY: number;
  } {
    const x = this.position.x + 31;
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
   * Port of upstream `BVehicle::GetCraneCenter`.
   * Role: Reports the vehicle factory crane interaction center.
   * Upstream: bvehicle.cpp:485-490
   */
  override getCraneCenter(): { hasCenter: boolean; x: number; y: number } {
    return {
      hasCenter: true,
      x: this.position.x + 31,
      y: this.position.y + 32,
    };
  }
}
