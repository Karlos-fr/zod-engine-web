/**
 * Upstream: zpath_finding_astar.h / zpath_finding_astar.cpp
 */

import type { MapPathfindingTile } from "./NavigationTypes";

/**
 * Port of upstream `map_pathfinding_info_tile` forward declaration.
 * Role: References the pathfinding tile metadata used by A* without redefining it.
 * Upstream: zpath_finding_astar.h:13
 */
export type AStarMapPathfindingTileReference = MapPathfindingTile;

/**
 * Port of upstream `ZPath_Finding_Response` forward declaration.
 * Role: Represents the pathfinding response object consumed by A* helpers.
 * Upstream: zpath_finding_astar.h:14
 */
export type PathFindingResponseReference = object;

/**
 * Port of upstream `pf_point`.
 * Role: Stores one queued A* point with path score and parent coordinates.
 * Upstream: zpath_finding_astar.h:18-27
 */
export class PathFindingPoint {
  x: number;
  y: number;
  f = 0;
  g = 0;
  h = 0;
  px = 0;
  py = 0;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

/**
 * Port of upstream `hf`.
 * Role: Computes the Manhattan-distance heuristic for A* path scoring.
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
 * Upstream: zpath_finding_astar.h:65-68
 */
export function freeList<T>(list: T[]): void {
  list.length = 0;
}

/**
 * Port of upstream `InitPointIndex`.
 * Role: Creates the tile-index grid used to map coordinates to A* list indices.
 * Upstream: zpath_finding_astar.h:40-57
 */
export function initPointIndex(width: number, height: number): number[][] {
  return Array.from({ length: width }, () => Array<number>(height).fill(-1));
}

/**
 * Port of upstream `RemovePoint`.
 * Role: Removes a point from an A* list and updates the point-index grid.
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
