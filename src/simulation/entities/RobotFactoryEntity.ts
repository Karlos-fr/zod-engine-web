/**
 * Upstream: brobot.h
 */

import { GameEntity } from "./GameEntity";
import type { GameMap } from "../../world/GameMap";

/**
 * Browser simulation entity containing the subset of `BRobot` behavior already ported.
 * Role: Represents robot factory behavior over the base game entity.
 * Upstream: brobot.h
 */
export class RobotFactoryEntity extends GameEntity {
  /**
   * Port of upstream `BRobot::SetMapImpassables`.
   * Role: Marks the robot factory footprint as blocked on the pathfinding map.
   * Upstream: brobot.cpp:459-475
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

  /**
   * Port of upstream `BRobot::GetCraneEntrance`.
   * Role: Reports the robot factory crane entrance and exit point below the building.
   * Upstream: brobot.cpp:477-482
   */
  override getCraneEntrance(): {
    canEnter: boolean;
    x: number;
    y: number;
    exitX: number;
    exitY: number;
  } {
    const x = this.position.x + 35;
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
   * Port of upstream `BRobot::GetCraneCenter`.
   * Role: Reports the robot factory crane interaction center.
   * Upstream: brobot.cpp:484-489
   */
  override getCraneCenter(): { hasCenter: boolean; x: number; y: number } {
    return {
      hasCenter: true,
      x: this.position.x + 35,
      y: this.position.y + 32,
    };
  }
}
