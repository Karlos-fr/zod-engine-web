/**
 * Upstream: bvehicle.h
 */

import { GameEntity } from "./GameEntity";

/**
 * Browser simulation entity containing the subset of `BVehicle` behavior already ported.
 * Role: Represents vehicle factory behavior over the base game entity.
 * Upstream: bvehicle.h
 */
export class VehicleFactoryEntity extends GameEntity {
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
