/**
 * Upstream: vjeep.h / vjeep.cpp
 */

import { GameEntity } from "./GameEntity";
import { VehicleEntity } from "./VehicleEntity";

/**
 * Browser simulation entity containing the subset of `VJeep` behavior already ported.
 * Role: Represents jeep-specific vehicle attack-rendering behavior.
 * Upstream: vjeep.h
 */
export class JeepVehicleEntity extends VehicleEntity {
  renderFire = false;

  /**
   * Port of upstream `VJeep::SetAttackObject`.
   * Role: Stores the jeep attack target and disables fire rendering when the target is cleared.
   * Upstream: vjeep.cpp:283-288
   */
  override setAttackObject(object: GameEntity | null): void {
    this.attackObject = object;

    if (!object) {
      this.renderFire = false;
    }
  }
}
