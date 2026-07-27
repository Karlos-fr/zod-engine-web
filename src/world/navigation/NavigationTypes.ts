/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - File: zpath_finding.h
 * - Symbols: _ZPATH_FINDING_H_, ffnode, pf_tile_types, Lock_List,
 *   Unlock_List, map_pathfinding_info_tile
 * - Ledger: CLS-0189C7, ENU-E2519F, FUN-5C4BB5, FUN-A8D32D,
 *   MAC-A837E6, STR-BD17E8
 *
 * Porting notes:
 * - The C++ header guard is represented by native ES module scoping.
 * - SDL mutex calls are no-ops while navigation runs on one simulation thread.
 */

/**
 * Port of upstream `ffnode`.
 *
 * Role:
 * - Stores a tile coordinate used by flood-fill pathfinding queues.
 *
 * Ledger: CLS-0189C7
 * Upstream: zpath_finding.h:62-67
 *
 * Notes:
 * - Renamed to `FloodFillNode` for clarity.
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
 *
 * Role:
 * - Classifies pathfinding tiles by movement affordance.
 *
 * Ledger: ENU-E2519F
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
 *
 * Role:
 * - Marks the beginning of a critical section around shared navigation lists.
 *
 * Ledger: FUN-5C4BB5
 * Upstream: zpath_finding.h:130
 *
 * Adaptation:
 * - It is intentionally a no-op until navigation moves to a Web Worker.
 */
export function lockList(): void {
  // Intentionally empty until navigation moves to a Web Worker.
}

/**
 * Port of upstream `Unlock_List`.
 *
 * Role:
 * - Marks the end of a critical section around shared navigation lists.
 *
 * Ledger: FUN-A8D32D
 * Upstream: zpath_finding.h:131
 *
 * Adaptation:
 * - It is intentionally a no-op until navigation moves to a Web Worker.
 */
export function unlockList(): void {
  // Intentionally empty until navigation moves to a Web Worker.
}

/**
 * Port of upstream `map_pathfinding_info_tile`.
 *
 * Role:
 * - Stores movement costs and passability for one pathfinding tile.
 *
 * Ledger: STR-BD17E8
 * Upstream: zpath_finding.h:16-21
 */
export type MapPathfindingTile = {
  sideWeight: number;
  diagonalWeight: number;
  passable: boolean;
};
