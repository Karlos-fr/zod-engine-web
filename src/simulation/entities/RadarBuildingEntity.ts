/**
 * Upstream: bradar.h / bradar.cpp
 */

import { BuildingEntity } from "./BuildingTypes";
import type { GameMap } from "../../world/GameMap";

/**
 * Browser simulation entity containing the subset of `BRadar` behavior already ported.
 * Role: Represents radar-building-specific crane interaction points.
 * Upstream: bradar.h
 */
export class RadarBuildingEntity extends BuildingEntity {
  /**
   * Port of upstream `BRadar::SetMapImpassables`.
   * Role: Marks the radar building footprint as blocked while leaving its entrance tile open.
   * Upstream: bradar.cpp:346-362
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

    tmap.setImpassable(tileX + 3, tileY + 2, false);
  }

  /**
   * Port of upstream `BRadar::GetCraneEntrance`.
   * Role: Reports the radar crane entrance and exit point below the building.
   * Upstream: bradar.cpp:364-369
   */
  override getCraneEntrance(): {
    canEnter: boolean;
    x: number;
    y: number;
    exitX: number;
    exitY: number;
  } {
    const x = this.position.x + 28;
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
   * Port of upstream `BRadar::GetCraneCenter`.
   * Role: Reports the radar crane interaction center.
   * Upstream: bradar.cpp:371-376
   */
  override getCraneCenter(): { hasCenter: boolean; x: number; y: number } {
    return {
      hasCenter: true,
      x: this.position.x + 28,
      y: this.position.y + 24,
    };
  }
}
