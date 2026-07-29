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

type TileOkPathFindingResponse = {
  tileInfo: MapPathfindingTile[][] | null;
  width: number;
  height: number;
  isRobot: boolean;
};

type MovementCostPathFindingResponse = {
  tileInfo: MapPathfindingTile[][];
};

type OpenListPathFindingResponse = TileOkPathFindingResponse &
  MovementCostPathFindingResponse & {
    endX: number;
    endY: number;
  };

type DoAstarPathFindingResponse = OpenListPathFindingResponse & {
  startX: number;
  startY: number;
  killThread: boolean;
  pathFindingPointList: PathFindingPoint[];
};

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
 * Port of upstream `pf_point` forward declaration.
 * Role: References an A* pathfinding point from navigation declarations.
 * Upstream: zpath_finding.h:27
 */
export type PathFindingPointReference = PathFindingPoint;

/**
 * Port of upstream `pf_point_array`.
 * Role: Stores an A* point list with a coordinate-to-list index for fast queue updates.
 * Upstream: zpath_finding_astar.h:29-104
 */
export class PathFindingPointArray {
  list: PathFindingPoint[] = [];
  pointIndex: number[][] = [];
  w = 0;
  h = 0;
  size = 0;
  allocSize = 0;

  initPointIndex(width: number, height: number): void {
    this.w = width;
    this.h = height;
    this.pointIndex = initPointIndex(width, height);
  }

  freePointIndex(): void {
    freePointIndex(this.pointIndex);
  }

  freeList(): void {
    freeList(this.list);
    this.size = 0;
  }

  addPoint(point: PathFindingPoint): void {
    addPoint(this, point);
  }

  removePoint(x: number, y: number): void {
    removePoint(this.list, this.pointIndex, x, y);
    this.size = this.list.length;
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
 * Port of upstream `gf`.
 * Role: Returns the A* movement cost for an orthogonal or diagonal tile step.
 * Upstream: zpath_finding_astar.cpp:17-23
 */
export function pathMovementCost(
  currentX: number,
  currentY: number,
  nextX: number,
  nextY: number,
  response: MovementCostPathFindingResponse,
): number {
  const tile = response.tileInfo[nextX][nextY];

  if (currentX === nextX || currentY === nextY) {
    return tile.sideWeight;
  }

  return tile.diagonalWeight;
}

/**
 * Port of upstream `tile_ok`.
 * Role: Checks whether an A* neighbor tile is traversable for robot or vehicle movement.
 * Upstream: zpath_finding_astar.cpp:98-157
 */
export function tileOk(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  response: TileOkPathFindingResponse,
): boolean {
  const tileInfo = response.tileInfo;
  if (!tileInfo) return false;

  if (response.isRobot) {
    if (endX < 0) return false;
    if (endY < 0) return false;
    if (endX >= response.width) return false;
    if (endY >= response.height) return false;
    if (!tileInfo[endX][endY].passable) return false;

    if (endX === startX || endY === startY) return true;

    if (!tileInfo[startX + (endX - startX)][startY].passable) return false;
    if (!tileInfo[startX][startY + (endY - startY)].passable) return false;
  } else {
    if (endX < 0) return false;
    if (endY < 0) return false;
    if (endX + 1 >= response.width) return false;
    if (endY + 1 >= response.height) return false;
    if (!tileInfo[endX][endY].passable) return false;
    if (!tileInfo[endX + 1][endY].passable) return false;
    if (!tileInfo[endX][endY + 1].passable) return false;
    if (!tileInfo[endX + 1][endY + 1].passable) return false;

    if (endX === startX || endY === startY) return true;

    if (endX > startX && endY < startY) {
      if (!tileInfo[startX][startY - 1].passable) return false;
      if (!tileInfo[startX + 2][startY + 1].passable) return false;
    } else if (endX < startX && endY < startY) {
      if (!tileInfo[startX + 1][startY - 1].passable) return false;
      if (!tileInfo[startX - 1][startY + 1].passable) return false;
    } else if (endX > startX && endY > startY) {
      if (!tileInfo[startX + 2][startY].passable) return false;
      if (!tileInfo[startX][startY + 2].passable) return false;
    } else {
      if (!tileInfo[startX - 1][startY].passable) return false;
      if (!tileInfo[startX + 1][startY + 2].passable) return false;
    }
  }

  return true;
}

/**
 * Port of upstream `add_to_open_list`.
 * Role: Queues or improves one neighboring A* point during path expansion.
 * Upstream: zpath_finding_astar.cpp:25-96
 */
export function addToOpenList(
  currentPoint: PathFindingPoint,
  candidatePoint: PathFindingPoint,
  openList: PathFindingPointArray,
  closedList: PathFindingPointArray,
  response: OpenListPathFindingResponse,
): void {
  if (
    !tileOk(
      currentPoint.x,
      currentPoint.y,
      candidatePoint.x,
      candidatePoint.y,
      response,
    )
  ) {
    return;
  }

  if (openList.pointIndex[candidatePoint.x][candidatePoint.y] !== -1) return;

  const closedIndex = closedList.pointIndex[candidatePoint.x][candidatePoint.y];
  if (closedIndex !== -1) {
    const closedPoint = closedList.list[closedIndex];
    const nextG =
      pathMovementCost(
        currentPoint.x,
        currentPoint.y,
        candidatePoint.x,
        candidatePoint.y,
        response,
      ) + currentPoint.g;

    if (closedPoint.g > nextG) {
      closedPoint.g = nextG;
      closedPoint.h = manhattanHeuristic(
        candidatePoint.x,
        candidatePoint.y,
        response.endX,
        response.endY,
      );
      closedPoint.f = closedPoint.g + closedPoint.h;
      closedPoint.px = currentPoint.x;
      closedPoint.py = currentPoint.y;
    }
    return;
  }

  const nextPoint = copyPathFindingPoint(candidatePoint);
  nextPoint.g =
    pathMovementCost(
      currentPoint.x,
      currentPoint.y,
      candidatePoint.x,
      candidatePoint.y,
      response,
    ) + currentPoint.g;
  nextPoint.h = manhattanHeuristic(
    candidatePoint.x,
    candidatePoint.y,
    response.endX,
    response.endY,
  );
  nextPoint.f = nextPoint.g + nextPoint.h;
  nextPoint.px = currentPoint.x;
  nextPoint.py = currentPoint.y;

  openList.addPoint(nextPoint);
}

/**
 * Port of upstream `push_in_neighbors`.
 * Role: Expands one A* point by considering all eight neighboring tiles.
 * Upstream: zpath_finding_astar.cpp:159-174
 */
export function pushInNeighbors(
  currentPoint: PathFindingPoint,
  openList: PathFindingPointArray,
  closedList: PathFindingPointArray,
  response: OpenListPathFindingResponse,
): void {
  const { x, y } = currentPoint;

  addToOpenList(
    currentPoint,
    new PathFindingPoint(x - 1, y - 1),
    openList,
    closedList,
    response,
  );
  addToOpenList(
    currentPoint,
    new PathFindingPoint(x - 1, y),
    openList,
    closedList,
    response,
  );
  addToOpenList(
    currentPoint,
    new PathFindingPoint(x - 1, y + 1),
    openList,
    closedList,
    response,
  );
  addToOpenList(
    currentPoint,
    new PathFindingPoint(x, y - 1),
    openList,
    closedList,
    response,
  );
  addToOpenList(
    currentPoint,
    new PathFindingPoint(x, y + 1),
    openList,
    closedList,
    response,
  );
  addToOpenList(
    currentPoint,
    new PathFindingPoint(x + 1, y - 1),
    openList,
    closedList,
    response,
  );
  addToOpenList(
    currentPoint,
    new PathFindingPoint(x + 1, y),
    openList,
    closedList,
    response,
  );
  addToOpenList(
    currentPoint,
    new PathFindingPoint(x + 1, y + 1),
    openList,
    closedList,
    response,
  );
}

/**
 * Port of upstream `Do_Astar`.
 * Role: Runs A* and writes the resulting waypoint list into the pathfinding response.
 * Upstream: zpath_finding_astar.cpp:261-517
 */
export function doAstar(response: DoAstarPathFindingResponse | null): void {
  if (!response) return;

  const startX = Math.trunc((response.startX + 1) / 16);
  const startY = Math.trunc((response.startY + 1) / 16);
  const endX = Math.trunc(response.endX / 16);
  const endY = Math.trunc(response.endY / 16);

  if (
    !tileOk(startX, startY, startX, startY, response) ||
    !tileOk(endX, endY, endX, endY, response)
  ) {
    response.pathFindingPointList.push(
      new PathFindingPoint(response.endX, response.endY),
    );
    return;
  }

  const openList = new PathFindingPointArray();
  const closedList = new PathFindingPointArray();
  openList.allocSize = 1000;
  closedList.allocSize = 1000;
  openList.initPointIndex(response.width, response.height);
  closedList.initPointIndex(response.width, response.height);
  openList.addPoint(new PathFindingPoint(startX, startY));

  let currentPoint = new PathFindingPoint();
  while (openList.size) {
    currentPoint = lowestFCostPoint(openList);

    if (response.killThread) {
      return;
    }

    if (currentPoint.x === endX && currentPoint.y === endY) {
      break;
    }

    removeFromOpen(currentPoint, openList, closedList);

    if (response.killThread) {
      return;
    }

    pushInNeighbors(currentPoint, openList, closedList, response);

    if (response.killThread) {
      return;
    }
  }

  const finalPath: PathFindingPoint[] = [];
  if (currentPoint.x === endX && currentPoint.y === endY) {
    while (true) {
      finalPath.unshift(copyPathFindingPoint(currentPoint));

      const parentIndex = closedList.list.findIndex(
        (point) => currentPoint.px === point.x && currentPoint.py === point.y,
      );
      if (parentIndex === -1) {
        finalPath.length = 0;
        break;
      }

      currentPoint = closedList.list[parentIndex];

      if (currentPoint.x === startX && currentPoint.y === startY) {
        if (finalPath.length) {
          const firstPoint = finalPath[0];
          const startDirection = pathDirection(currentPoint, firstPoint);
          const realX = response.startX;
          const realY = response.startY;
          const currentRealX = currentPoint.x * 16;
          const currentRealY = currentPoint.y * 16;

          if (
            (startDirection === 0 &&
              realX - 1 <= currentRealX &&
              !tileOk(startX, startY + 1, firstPoint.x, firstPoint.y, response)) ||
            (startDirection === 1 &&
              !tileOk(startX + 1, startY, firstPoint.x, firstPoint.y, response)) ||
            (startDirection === 1 && realX - 1 <= currentRealX) ||
            (startDirection === 2 &&
              !tileOk(startX + 1, startY, firstPoint.x, firstPoint.y, response)) ||
            startDirection === 3 ||
            (startDirection === 4 &&
              !tileOk(startX, startY + 1, firstPoint.x, firstPoint.y, response)) ||
            (startDirection === 5 &&
              !tileOk(startX, startY + 1, firstPoint.x, firstPoint.y, response)) ||
            (startDirection === 5 && realY - 1 <= currentRealY) ||
            (startDirection === 6 &&
              realY - 1 <= currentRealY &&
              !tileOk(startX + 1, startY, firstPoint.x, firstPoint.y, response))
          ) {
            finalPath.unshift(copyPathFindingPoint(currentPoint));
          }
        }

        break;
      }
    }
  }

  removeRedundantPathPoints(finalPath);

  for (const point of finalPath) {
    point.x *= 16;
    point.y *= 16;

    if (response.isRobot) {
      point.x += 8;
      point.y += 8;
    } else {
      point.x += 16;
      point.y += 16;
    }
  }

  finalPath.push(new PathFindingPoint(response.endX, response.endY));
  response.pathFindingPointList = finalPath;
}

/**
 * Port of upstream `the_dir`.
 * Role: Maps movement from the previous A* point to the current point onto an eight-way direction index.
 * Upstream: zpath_finding_astar.cpp:225-259
 */
export function pathDirection(
  previousPoint: Pick<PathFindingPoint, "x" | "y">,
  currentPoint: Pick<PathFindingPoint, "x" | "y">,
): number {
  if (currentPoint.x > previousPoint.x) {
    if (currentPoint.y === previousPoint.y) {
      return 0;
    }
    return currentPoint.y < previousPoint.y ? 1 : 7;
  }

  if (currentPoint.x === previousPoint.x) {
    return currentPoint.y < previousPoint.y ? 2 : 6;
  }

  if (currentPoint.y < previousPoint.y) {
    return 3;
  }
  if (currentPoint.y > previousPoint.y) {
    return 5;
  }
  return 4;
}

/**
 * Port of upstream `lowest_f_cost`.
 * Role: Selects the queued A* point with the lowest accumulated f score.
 * Upstream: zpath_finding_astar.cpp:205-223
 */
export function lowestFCostPoint(
  openList: Pick<PathFindingPointArray, "list" | "size">,
): PathFindingPoint {
  let lowestFound = openList.list[0] ?? new PathFindingPoint();

  for (let index = 0; index < openList.size; index += 1) {
    const point = openList.list[index];
    if (point && lowestFound.f > point.f) {
      lowestFound = point;
    }
  }

  return copyPathFindingPoint(lowestFound);
}

/**
 * Port of upstream `AddPoint`.
 * Role: Appends one A* point and records its coordinate index for later lookup.
 * Upstream: zpath_finding_astar.h:70-82
 */
export function addPoint(pointArray: PathFindingPointArray, point: PathFindingPoint): void {
  if (pointArray.size >= pointArray.allocSize) {
    pointArray.allocSize += 1000;
  }

  pointArray.list[pointArray.size] = point;
  pointArray.pointIndex[point.x][point.y] = pointArray.size;
  pointArray.size += 1;
}

/**
 * Port of upstream `remove_from_open`.
 * Role: Moves one A* point from the open list to the closed list.
 * Upstream: zpath_finding_astar.cpp:176-203
 */
export function removeFromOpen(
  point: PathFindingPoint,
  openList: PathFindingPointArray,
  closedList: PathFindingPointArray,
): void {
  openList.removePoint(point.x, point.y);
  closedList.addPoint(point);
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

function copyPathFindingPoint(point: PathFindingPoint): PathFindingPoint {
  const copy = new PathFindingPoint(point.x, point.y);
  copy.f = point.f;
  copy.g = point.g;
  copy.h = point.h;
  copy.px = point.px;
  copy.py = point.py;
  return copy;
}

function removeRedundantPathPoints(path: PathFindingPoint[]): void {
  for (let index = 0; index < path.length; ) {
    if (index !== 0 && index + 1 !== path.length) {
      const previousDirection = pathDirection(path[index - 1], path[index]);
      const currentDirection = pathDirection(path[index], path[index + 1]);

      if (previousDirection === currentDirection) {
        path.splice(index, 1);
      } else {
        index += 1;
      }
    } else {
      index += 1;
    }
  }
}
