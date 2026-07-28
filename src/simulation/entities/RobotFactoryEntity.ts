/**
 * Upstream: brobot.h
 */

import { GameEntity } from "./GameEntity";

/**
 * Browser simulation entity containing the subset of `BRobot` behavior already ported.
 * Role: Represents robot factory behavior over the base game entity.
 * Upstream: brobot.h
 */
export class RobotFactoryEntity extends GameEntity {
  /**
   * Port of upstream `CanSetRallypoints`.
   * Role: Reports whether robot factories can set rally points.
   * Upstream: brobot.h:20
   */
  override canSetRallypoints(): boolean {
    return true;
  }

  /**
   * Port of upstream `ProducesUnits`.
   * Role: Reports whether robot factories can produce units.
   * Upstream: brobot.h:21
   */
  override producesUnits(): boolean {
    return true;
  }
}
