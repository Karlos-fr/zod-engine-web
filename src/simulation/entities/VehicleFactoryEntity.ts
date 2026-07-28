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
}
