/**
 * Upstream: zrobot.h
 */

import { GameEntity } from "./GameEntity";

/**
 * Browser simulation entity containing the subset of `ZRobot` behavior already ported.
 * Role: Represents shared robot behavior over the base game entity.
 * Upstream: zrobot.h
 */
export class RobotEntity extends GameEntity {
  grenadeAmount = 0;

  /**
   * Port of upstream `CanSetWaypoints`.
   * Role: Reports whether this robot can receive waypoint orders.
   * Upstream: zrobot.h:15
   */
  canSetWaypoints(): boolean {
    return true;
  }

  /**
   * Port of upstream `GetGrenadeAmount`.
   * Role: Reports this robot's grenade inventory count.
   * Upstream: zrobot.h:19
   */
  override getGrenadeAmount(): number {
    return this.grenadeAmount;
  }

  /**
   * Port of upstream `CanHaveGrenades`.
   * Role: Reports whether this robot can carry grenade inventory.
   * Upstream: zrobot.h:17
   */
  override canHaveGrenades(): boolean {
    return true;
  }

  /**
   * Port of upstream `CanPickupGrenades`.
   * Role: Reports whether this robot can pick up grenade inventory.
   * Upstream: zrobot.h:16
   */
  override canPickupGrenades(): boolean {
    return this.grenadeAmount <= 0;
  }
}
