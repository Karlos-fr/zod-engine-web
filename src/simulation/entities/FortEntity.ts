/**
 * Upstream: bfort.h
 */

import { GameEntity } from "./GameEntity";
import { TeamType } from "../SimulationConstants";

/**
 * Browser simulation entity containing the subset of `BFort` behavior already ported.
 * Role: Represents fort-specific behavior over the base game entity.
 * Upstream: bfort.h
 */
export class FortEntity extends GameEntity {
  /**
   * Port of upstream `CanSetRallypoints`.
   * Role: Reports whether forts can set rally points.
   * Upstream: bfort.h:25
   */
  override canSetRallypoints(): boolean {
    return true;
  }

  /**
   * Port of upstream `ProducesUnits`.
   * Role: Reports whether forts can produce units.
   * Upstream: bfort.h:26
   */
  override producesUnits(): boolean {
    return true;
  }

  /**
   * Port of upstream `BFort::CanEnterFort`.
   * Role: Reports whether a team can enter this fort.
   * Upstream: bfort.cpp:483-489
   */
  override canEnterFort(team: TeamType): boolean {
    if (team === this.owner) return false;
    if (this.isDestroyed()) return false;

    return true;
  }

  /**
   * Port of upstream `BFort::CannonNotPlacable`.
   * Role: Allows cannon placement on fort mount points while other overlapping fort areas block placement.
   * Upstream: bfort.cpp:534-548
   */
  override cannonNotPlacable(selection: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  }): boolean {
    const localX = selection.left - this.position.x;
    const localY = selection.top - this.position.y;

    if (localX === 16 && (localY === 0 || localY === 48)) return false;
    if (localX === 112 && (localY === 0 || localY === 48)) return false;

    return this.withinSelection(selection);
  }
}
