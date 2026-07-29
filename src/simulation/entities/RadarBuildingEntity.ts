/**
 * Upstream: bradar.h / bradar.cpp
 */

import { BuildingEntity } from "./BuildingTypes";

/**
 * Browser simulation entity containing the subset of `BRadar` behavior already ported.
 * Role: Represents radar-building-specific crane interaction points.
 * Upstream: bradar.h
 */
export class RadarBuildingEntity extends BuildingEntity {
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
