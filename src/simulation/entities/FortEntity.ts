/**
 * Upstream: bfort.h
 */

import { GameEntity } from "./GameEntity";
import { pointsWithinArea } from "../Common";
import { BuildingType, PlanetType, TeamType } from "../SimulationConstants";

/**
 * Browser simulation entity containing the subset of `BFort` behavior already ported.
 * Role: Represents fort-specific behavior over the base game entity.
 * Upstream: bfort.h
 */
export class FortEntity extends GameEntity {
  isFront = true;
  palette = PlanetType.Desert;
  unitCreateX = 0;
  unitCreateY = 0;
  unitMoveX = 0;
  unitMoveY = 0;

  /**
   * Port of upstream `BFort::SetIsFront`.
   * Role: Configures fort orientation, footprint, spawn offsets, and center coordinates.
   * Upstream: bfort.cpp:137-175
   */
  setIsFront(isFront: boolean): void {
    this.isFront = isFront;

    if (this.isFront) {
      this.objectId = BuildingType.FortFront;
      this.width = 10;
      this.height = 12;
      this.pixelWidth = this.width * 16;
      this.pixelHeight = this.height * 16;
      this.unitCreateX = 80;
      this.unitCreateY = 128;
      this.unitMoveX = 80;
      this.unitMoveY = 192 + 16;

      if (this.palette === PlanetType.Jungle) {
        this.height -= 1;
        this.pixelHeight = this.height * 16;
      }
    } else {
      this.objectId = BuildingType.FortBack;
      this.width = 10;
      this.height = 11;
      this.pixelWidth = this.width * 16;
      this.pixelHeight = this.height * 16;
      this.unitCreateX = 80;
      this.unitCreateY = 32;
      this.unitMoveX = 80;
      this.unitMoveY = -16;
    }

    this.centerX = this.position.x + (this.pixelWidth >> 1);
    this.centerY = this.position.y + (this.pixelHeight >> 1);
  }

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
   * Port of upstream `BFort::UnderCursorCanAttack`.
   * Role: Checks whether the cursor is over an attackable fort body section.
   * Upstream: bfort.cpp:491-515
   */
  override underCursorCanAttack(mapX: number, mapY: number): boolean {
    const localX = mapX - this.position.x;
    const localY = mapY - this.position.y;

    if (pointsWithinArea(localX, localY, 16, 16, 16 * 8, 16 * 7)) {
      return true;
    }
    if (pointsWithinArea(localX, localY, 0, 16 * 3, 16 * 10, 16 * 4)) {
      return true;
    }
    if (pointsWithinArea(localX, localY, 16, 0, 16 * 2, 16)) {
      return true;
    }
    if (pointsWithinArea(localX, localY, 16 * 7, 0, 16 * 2, 16)) {
      return true;
    }
    if (pointsWithinArea(localX, localY, 16 * 2, 16 * 8, 16, 16)) {
      return true;
    }

    return pointsWithinArea(localX, localY, 16 * 7, 16 * 8, 16, 16);
  }

  /**
   * Port of upstream `BFort::UnderCursorFortCanEnter`.
   * Role: Checks whether the cursor is over a fort entry area.
   * Upstream: bfort.cpp:517-532
   */
  override underCursorFortCanEnter(mapX: number, mapY: number): boolean {
    const localX = mapX - this.position.x;
    const localY = mapY - this.position.y;

    if (this.objectId === BuildingType.FortFront) {
      return pointsWithinArea(localX, localY, 16 * 4, 16 * 2, 32, 16 * 6);
    }

    return pointsWithinArea(localX, localY, 16 * 4, 16, 32, 16 * 4);
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
