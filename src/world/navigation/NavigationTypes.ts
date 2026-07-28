/**
 * Upstream: zpath_finding.h
 */

/**
 * Port of upstream `ZPath_Finding_Engine` forward declaration.
 * Role: Represents a pathfinding engine reference before the engine class is defined.
 * Upstream: zpath_finding.h:23
 */
export type PathFindingEngineReference = object;

/**
 * Port of upstream `ffnode`.
 * Role: Stores a tile coordinate for flood-fill pathfinding queues.
 * Upstream: zpath_finding.h:62-67
 */
export class FloodFillNode {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

/**
 * Port of upstream `pf_tile_types`.
 * Role: Classifies pathfinding tiles by movement affordance.
 * Upstream: zpath_finding.h:11-14
 */
export enum PathTileType {
  Normal = 0,
  Impassable = 1,
  Water = 2,
  Road = 3,
  Max = 4,
}

/**
 * Port of upstream `Lock_List`.
 * Role: Marks the beginning of a critical section around shared navigation lists.
 * Upstream: zpath_finding.h:130
 */
export function lockList(): void {
  // Intentionally empty until navigation moves to a Web Worker.
}

/**
 * Port of upstream `Unlock_List`.
 * Role: Marks the end of a critical section around shared navigation lists.
 * Upstream: zpath_finding.h:131
 */
export function unlockList(): void {
  // Intentionally empty until navigation moves to a Web Worker.
}

/**
 * Port of upstream `map_pathfinding_info_tile`.
 * Role: Stores movement costs and passability for one pathfinding tile.
 * Upstream: zpath_finding.h:16-21
 */
export type MapPathfindingTile = {
  sideWeight: number;
  diagonalWeight: number;
  passable: boolean;
};
