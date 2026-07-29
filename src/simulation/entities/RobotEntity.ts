/**
 * Upstream: zrobot.h
 */

import { GameEntity } from "./GameEntity";

/**
 * Port of upstream robot `object_mode` values.
 * Role: Identifies the robot animation/action mode used by robot behavior.
 * Upstream: zobject.h:68-75
 */
export enum RobotObjectMode {
  Walking = 4,
  Standing = 5,
  Attacking = 10,
  PickupUpGrenades = 11,
  PickupDownGrenades = 12,
}

/**
 * Browser simulation entity containing the subset of `ZRobot` behavior already ported.
 * Role: Represents shared robot behavior over the base game entity.
 * Upstream: zrobot.h
 */
export class RobotEntity extends GameEntity {
  grenadeAmount = 0;
  mode = RobotObjectMode.Standing;
  actionIndex = 0;
  nextAttackTime = 0;

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
   * Port of upstream `ZRobot::SetGrenadeAmount`.
   * Role: Updates robot grenade inventory and resets invalid counts.
   * Upstream: zrobot.cpp:409-418
   */
  override setGrenadeAmount(grenadeAmount: number): void {
    this.grenadeAmount = grenadeAmount;

    if (this.grenadeAmount < 0 || this.grenadeAmount > 99) {
      this.grenadeAmount = 0;
    }
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

  /**
   * Port of upstream `ZRobot::DoPickupGrenadeAnim`.
   * Role: Starts the robot grenade pickup animation based on its facing direction.
   * Upstream: zrobot.cpp:150-162
   */
  override doPickupGrenadeAnim(): void {
    if (!this.canHaveGrenades()) return;
    if (this.mode === RobotObjectMode.Attacking) return;

    this.mode =
      this.direction < 4
        ? RobotObjectMode.PickupUpGrenades
        : RobotObjectMode.PickupDownGrenades;
    this.actionIndex = 0;
  }

  /**
   * Port of upstream `ZRobot::CanThrowGrenades`.
   * Role: Reports whether this robot or its group leader has grenade inventory.
   * Upstream: zrobot.cpp:404-407
   */
  override canThrowGrenades(): boolean {
    const groupLeader = this.getGroupLeader();
    return Boolean(
      this.getGrenadeAmount() ||
        (groupLeader && groupLeader.getGrenadeAmount()),
    );
  }

  /**
   * Port of upstream `ZRobot::SetAttackObject`.
   * Role: Updates the robot attack target and attack animation timing state.
   * Upstream: zrobot.cpp:350-367
   */
  override setAttackObject(object: GameEntity | null, currentTime = 0): void {
    this.attackObject = object;

    if (this.attackObject) {
      this.mode = RobotObjectMode.Attacking;
      this.actionIndex = 0;
      this.nextAttackTime = currentTime + 0.1;
      return;
    }

    if (
      this.mode !== RobotObjectMode.Walking &&
      this.mode !== RobotObjectMode.Standing
    ) {
      this.mode = RobotObjectMode.Standing;
    }
  }
}
