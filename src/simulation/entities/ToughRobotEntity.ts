/**
 * Upstream: rtough.h
 */

import { RobotEntity } from "./RobotEntity";

/**
 * Browser simulation entity containing the subset of `RTough` behavior already ported.
 * Role: Represents the tough robot specialization over the shared game-entity base.
 * Upstream: rtough.h
 */
export class ToughRobotEntity extends RobotEntity {
  /**
   * Port of upstream `CanPickupGrenades`.
   * Role: Reports whether tough robots can pick up grenade inventory.
   * Upstream: rtough.h:20
   */
  override canPickupGrenades(): boolean {
    return false;
  }

  /**
   * Port of upstream `CanHaveGrenades`.
   * Role: Reports whether tough robots can carry grenade inventory.
   * Upstream: rtough.h:21
   */
  override canHaveGrenades(): boolean {
    return false;
  }

  /**
   * Port of upstream `CanThrowGrenades`.
   * Role: Reports whether tough robots can use grenade attacks.
   * Upstream: rtough.h:22
   */
  override canThrowGrenades(): boolean {
    return false;
  }
}
