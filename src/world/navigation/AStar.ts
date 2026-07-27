/**
 * Ported from Zod Engine.
 * Upstream: zpath_finding_astar.h / zpath_finding_astar.cpp
 * Symbols: see entity comments
 * Ledger: see entity comments
 */

/**
 * Port of upstream `hf`.
 * Role: Computes the Manhattan-distance heuristic used by A* path scoring.
 * Ledger: FUN-C49153
 * Upstream: zpath_finding_astar.cpp:10
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
 * Role: Releases the point-index grid used to look up queued A* points by tile.
 * Ledger: FUN-9322B5
 * Upstream: zpath_finding_astar.h:59-63
 */
export function freePointIndex<T>(pointIndex: T[][]): void {
  for (const column of pointIndex) {
    column.length = 0;
  }
  pointIndex.length = 0;
}

/**
 * Port of upstream `FreeList`.
 * Role: Releases the active A* point list.
 * Ledger: FUN-993571
 * Upstream: zpath_finding_astar.h:65-68
 */
export function freeList<T>(list: T[]): void {
  list.length = 0;
}

/**
 * Port of upstream `InitPointIndex`.
 * Role: Creates the tile-index grid used to map coordinates to A* list indices.
 * Ledger: FUN-A028A6
 * Upstream: zpath_finding_astar.h:40-57
 */
export function initPointIndex(width: number, height: number): number[][] {
  return Array.from({ length: width }, () => Array<number>(height).fill(-1));
}

/**
 * Port of upstream `RemovePoint`.
 * Role: Removes a point from an A* list and updates the point-index grid.
 * Ledger: FUN-F7AF7E
 * Upstream: zpath_finding_astar.h:84-97
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
