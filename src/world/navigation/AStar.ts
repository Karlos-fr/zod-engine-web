/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - File: zpath_finding_astar.h / zpath_finding_astar.cpp
 * - Symbols: _ZPATH_FINDING_ASTAR_H_, hf, FreePointIndex, FreeList,
 *   InitPointIndex, RemovePoint
 * - Ledger: FUN-9322B5, FUN-993571, FUN-A028A6, FUN-C49153, FUN-F7AF7E,
 *   MAC-A866D1
 *
 * Porting notes:
 * - The C++ header guard is represented by native ES module scoping.
 * - Manual free operations are represented by clearing JavaScript arrays.
 */

/**
 * Port of upstream `hf`.
 *
 * Role:
 * - Computes the Manhattan-distance heuristic used by A* path scoring.
 *
 * Ledger: FUN-C49153
 * Upstream: zpath_finding_astar.cpp:10
 *
 * Notes:
 * - Renamed to `manhattanHeuristic` for readability.
 */
export function manhattanHeuristic(
  startX: number,
  startY: number,
  finishX: number,
  finishY: number,
): number {
  return Math.abs(startX - finishX) + Math.abs(startY - finishY);
}

/**
 * Port of upstream `FreePointIndex`.
 *
 * Role:
 * - Releases the point-index grid used to look up queued A* points by tile.
 *
 * Ledger: FUN-9322B5
 * Upstream: zpath_finding_astar.h:59-63
 *
 * Adaptation:
 * - Clears arrays so JavaScript can release references through garbage collection.
 */
export function freePointIndex<T>(pointIndex: T[][]): void {
  for (const column of pointIndex) {
    column.length = 0;
  }
  pointIndex.length = 0;
}

/**
 * Port of upstream `FreeList`.
 *
 * Role:
 * - Releases the active A* point list.
 *
 * Ledger: FUN-993571
 * Upstream: zpath_finding_astar.h:65-68
 *
 * Adaptation:
 * - Clears the array instead of calling `free`.
 */
export function freeList<T>(list: T[]): void {
  list.length = 0;
}

/**
 * Port of upstream `InitPointIndex`.
 *
 * Role:
 * - Creates the tile-index grid used to map coordinates to A* list indices.
 *
 * Ledger: FUN-A028A6
 * Upstream: zpath_finding_astar.h:40-57
 *
 * Notes:
 * - Initializes each cell with the upstream `-1` sentinel.
 */
export function initPointIndex(width: number, height: number): number[][] {
  return Array.from({ length: width }, () => Array<number>(height).fill(-1));
}

/**
 * Port of upstream `RemovePoint`.
 *
 * Role:
 * - Removes a point from an A* list and updates the point-index grid.
 *
 * Ledger: FUN-F7AF7E
 * Upstream: zpath_finding_astar.h:84-97
 *
 * Notes:
 * - Preserves the upstream constant-time tail-swap behavior.
 */
export function removePoint<T extends { x: number; y: number }>(
  list: T[],
  pointIndex: number[][],
  x: number,
  y: number,
): void {
  const index = pointIndex[x][y];
  if (index === -1) {
    return;
  }

  pointIndex[x][y] = -1;
  const lastPoint = list.pop();
  if (lastPoint && index < list.length) {
    list[index] = lastPoint;
    pointIndex[lastPoint.x][lastPoint.y] = index;
  }
}
