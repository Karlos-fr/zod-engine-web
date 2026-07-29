/**
 * Upstream: zvehicle.h
 */

import { GameEntity } from "./GameEntity";

/**
 * Browser simulation entity containing the subset of `ZVehicle` behavior already ported.
 * Role: Represents shared vehicle behavior over the base game entity.
 * Upstream: zvehicle.h
 */
export class VehicleEntity extends GameEntity {
  lidOpen = false;
  doCloseLid = false;
  nextCloseLidTime = 0;
  moving = false;
  moveIndex = 0;

  /**
   * Port of upstream `CanSetWaypoints`.
   * Role: Reports whether this vehicle can receive waypoint orders.
   * Upstream: zvehicle.h:21
   */
  canSetWaypoints(): boolean {
    return true;
  }

  /**
   * Port of upstream `ZVehicle::ShowDamaged`.
   * Role: Reports whether this vehicle is below the damaged-health threshold.
   * Upstream: zvehicle.cpp:71-74
   */
  override showDamaged(): boolean {
    return 0.4 > this.health / this.maxHealth;
  }

  /**
   * Port of upstream `ZVehicle::ShowPartiallyDamaged`.
   * Role: Reports whether this vehicle is between partial and heavy damage.
   * Upstream: zvehicle.cpp:76-83
   */
  override showPartiallyDamaged(): boolean {
    const healthRatio = this.health / this.maxHealth;

    return healthRatio < 0.7 && healthRatio > 0.4;
  }

  /**
   * Port of upstream `ZVehicle::CanBeRepaired`.
   * Role: Reports whether this vehicle is damaged but not destroyed.
   * Upstream: zvehicle.cpp:170-176
   */
  override canBeRepaired(): boolean {
    if (this.isDestroyed()) return false;
    if (this.health >= this.maxHealth) return false;

    return true;
  }

  /**
   * Port of upstream `ZVehicle::CanBeSniped`.
   * Role: Reports whether this vehicle exposes a driver that can be sniped.
   * Upstream: zvehicle.cpp:178-186
   */
  override canBeSniped(): boolean {
    if (this.hasLidFlag) {
      return this.canBeSnipedFlag && this.lidOpen && this.driverInfo.length > 0;
    }

    return this.canBeSnipedFlag && this.driverInfo.length > 0;
  }

  /**
   * Port of upstream `ZVehicle::SetAttackObject`.
   * Role: Stores the attack target and faces the vehicle toward the target center.
   * Upstream: zvehicle.cpp:140-153
   */
  override setAttackObject(object: GameEntity | null): void {
    this.attackObject = object;

    if (!this.attackObject) return;

    const newDirection = this.directionFromLocation(
      this.attackObject.centerX - this.position.x,
      this.attackObject.centerY - this.position.y,
    );

    if (newDirection !== -1) {
      this.direction = newDirection;
    }
  }

  /**
   * Port of upstream `ZVehicle::RecalcDirection`.
   * Role: Refreshes vehicle movement state and facing direction from current velocity.
   * Upstream: zvehicle.cpp:51-69
   */
  override recalcDirection(): void {
    const newDirection = this.directionFromLocation(
      this.locationDeltaX,
      this.locationDeltaY,
    );

    if (newDirection !== -1) {
      this.moving = true;
      this.direction = newDirection;
      this.moveIndex = 0;
    } else {
      this.moving = false;
    }
  }

  /**
   * Port of upstream `ZVehicle::SetLidState`.
   * Role: Stores whether this vehicle's lid is open.
   * Upstream: zvehicle.cpp:188-191
   */
  override setLidState(lidOpen: boolean): void {
    this.lidOpen = lidOpen;
  }

  /**
   * Port of upstream `ZVehicle::GetLidState`.
   * Role: Reports whether this vehicle's lid is open.
   * Upstream: zvehicle.cpp:193-196
   */
  override getLidState(): boolean {
    return this.lidOpen;
  }

  /**
   * Port of upstream `ZVehicle::SignalLidShouldOpen`.
   * Role: Opens the vehicle lid and marks it for network update when the random gate allows it.
   * Upstream: zvehicle.cpp:198-207
   */
  override signalLidShouldOpen(
    randomModulo5 = Math.floor(Math.random() * 5),
  ): void {
    if (!this.hasLidFlag) return;
    if (randomModulo5 === 0) return;

    this.serverFlags.updatedOpenLid = true;
    this.lidOpen = true;
  }

  /**
   * Port of upstream `ZVehicle::SignalLidShouldClose`.
   * Role: Schedules lid closing after a short random delay when the lid is open.
   * Upstream: zvehicle.cpp:209-220
   */
  override signalLidShouldClose(
    theTime = 0,
    randomModulo15 = Math.floor(Math.random() * 15),
  ): void {
    if (!this.hasLidFlag) return;

    if (this.lidOpen && !this.doCloseLid) {
      this.doCloseLid = true;
      this.nextCloseLidTime = theTime + 0.1 * randomModulo15;
    }
  }
}
