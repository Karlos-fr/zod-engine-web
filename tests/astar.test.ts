import { describe, expect, it } from "vitest";
import {
  addPoint,
  addToOpenList,
  doAstar,
  freePointIndex,
  freeList,
  initPointIndex,
  lowestFCostPoint,
  manhattanHeuristic,
  pathDirection,
  pathMovementCost,
  PathFindingPoint,
  PathFindingPointArray,
  pushInNeighbors,
  removeFromOpen,
  removePoint,
  tileOk,
} from "../src/world/navigation/AStar";
import type {
  AStarMapPathfindingTileReference,
  PathFindingPointReference,
  PathFindingResponseReference,
} from "../src/world/navigation/AStar";
import type { MapPathfindingTile } from "../src/world/navigation/NavigationTypes";

describe("A* navigation", () => {
  it("ports the A* map pathfinding tile forward declaration as a shared reference", () => {
    const tile: AStarMapPathfindingTileReference = {
      sideWeight: 10,
      diagonalWeight: 14,
      passable: true,
    };

    expect(tile).toEqual({
      sideWeight: 10,
      diagonalWeight: 14,
      passable: true,
    });
  });

  it("ports the pathfinding response forward declaration as an opaque reference", () => {
    const response = { requestId: 7 };
    const acceptResponse = (
      value: PathFindingResponseReference,
    ): PathFindingResponseReference => value;

    expect(acceptResponse(response)).toBe(response);
  });

  it("ports pf_point default construction", () => {
    expect(new PathFindingPoint()).toEqual({
      x: 0,
      y: 0,
      f: 0,
      g: 0,
      h: 0,
      px: 0,
      py: 0,
    });
  });

  it("ports pf_point coordinate construction", () => {
    expect(new PathFindingPoint(4, 7)).toEqual({
      x: 4,
      y: 7,
      f: 0,
      g: 0,
      h: 0,
      px: 0,
      py: 0,
    });
  });

  it("ports the navigation pf_point forward declaration as an A* point reference", () => {
    const point: PathFindingPointReference = new PathFindingPoint(6, 9);

    expect(point).toBeInstanceOf(PathFindingPoint);
    expect(point).toMatchObject({ x: 6, y: 9 });
  });

  it("ports pf_point_array default construction", () => {
    expect(new PathFindingPointArray()).toEqual({
      list: [],
      pointIndex: [],
      w: 0,
      h: 0,
      size: 0,
      allocSize: 0,
    });
  });

  it("initializes pf_point_array point indexes", () => {
    const points = new PathFindingPointArray();

    points.initPointIndex(2, 3);

    expect(points.w).toBe(2);
    expect(points.h).toBe(3);
    expect(points.pointIndex).toEqual([
      [-1, -1, -1],
      [-1, -1, -1],
    ]);
  });

  it("adds pf_point_array points and indexes them by coordinate", () => {
    const points = new PathFindingPointArray();
    points.initPointIndex(3, 2);

    points.addPoint(new PathFindingPoint(1, 0));
    points.addPoint(new PathFindingPoint(2, 1));

    expect(points.size).toBe(2);
    expect(points.allocSize).toBe(1000);
    expect(points.list).toEqual([
      new PathFindingPoint(1, 0),
      new PathFindingPoint(2, 1),
    ]);
    expect(points.pointIndex).toEqual([
      [-1, -1],
      [0, -1],
      [-1, 1],
    ]);
  });

  it("ports AddPoint as a standalone point-array update", () => {
    const points = new PathFindingPointArray();
    points.initPointIndex(2, 2);
    const point = new PathFindingPoint(1, 1);

    addPoint(points, point);

    expect(points.size).toBe(1);
    expect(points.allocSize).toBe(1000);
    expect(points.list[0]).toBe(point);
    expect(points.pointIndex).toEqual([
      [-1, -1],
      [-1, 0],
    ]);
  });

  it("removes pf_point_array points and reindexes the moved tail point", () => {
    const points = new PathFindingPointArray();
    points.initPointIndex(3, 1);
    points.addPoint(new PathFindingPoint(0, 0));
    points.addPoint(new PathFindingPoint(1, 0));
    points.addPoint(new PathFindingPoint(2, 0));

    points.removePoint(1, 0);

    expect(points.size).toBe(2);
    expect(points.list).toEqual([
      new PathFindingPoint(0, 0),
      new PathFindingPoint(2, 0),
    ]);
    expect(points.pointIndex).toEqual([[0], [-1], [1]]);
  });

  it("releases pf_point_array backing storage", () => {
    const points = new PathFindingPointArray();
    points.initPointIndex(1, 1);
    points.addPoint(new PathFindingPoint(0, 0));

    points.freePointIndex();
    points.freeList();

    expect(points.pointIndex).toEqual([]);
    expect(points.list).toEqual([]);
    expect(points.size).toBe(0);
  });

  it("calculates the Manhattan heuristic", () => {
    expect(manhattanHeuristic(2, 3, 7, 11)).toBe(13);
    expect(manhattanHeuristic(7, 11, 2, 3)).toBe(13);
  });

  it("uses side weights for orthogonal A* movement costs", () => {
    const tileInfo = createTileGrid(3, 3, true);
    tileInfo[2][1].sideWeight = 25;
    tileInfo[2][1].diagonalWeight = 99;

    expect(pathMovementCost(1, 1, 2, 1, { tileInfo })).toBe(25);
    expect(pathMovementCost(1, 1, 1, 2, { tileInfo })).toBe(0);
  });

  it("uses diagonal weights for diagonal A* movement costs", () => {
    const tileInfo = createTileGrid(3, 3, true);
    tileInfo[2][2].sideWeight = 25;
    tileInfo[2][2].diagonalWeight = 35;

    expect(pathMovementCost(1, 1, 2, 2, { tileInfo })).toBe(35);
  });

  it("accepts robot side moves to passable in-bounds tiles", () => {
    expect(
      tileOk(1, 1, 2, 1, {
        tileInfo: createTileGrid(3, 3, true),
        width: 3,
        height: 3,
        isRobot: true,
      }),
    ).toBe(true);
  });

  it("rejects robot moves outside the map or into impassable tiles", () => {
    const tileInfo = createTileGrid(3, 3, true);
    tileInfo[2][1].passable = false;

    expect(tileOk(1, 1, -1, 1, { tileInfo, width: 3, height: 3, isRobot: true })).toBe(
      false,
    );
    expect(tileOk(1, 1, 2, 1, { tileInfo, width: 3, height: 3, isRobot: true })).toBe(
      false,
    );
  });

  it("rejects robot diagonal moves through blocked side tiles", () => {
    const tileInfo = createTileGrid(3, 3, true);
    tileInfo[2][1].passable = false;

    expect(tileOk(1, 1, 2, 2, { tileInfo, width: 3, height: 3, isRobot: true })).toBe(
      false,
    );

    tileInfo[2][1].passable = true;
    tileInfo[1][2].passable = false;

    expect(tileOk(1, 1, 2, 2, { tileInfo, width: 3, height: 3, isRobot: true })).toBe(
      false,
    );
  });

  it("requires the vehicle 2x2 destination footprint to be passable", () => {
    const tileInfo = createTileGrid(4, 4, true);

    expect(tileOk(1, 1, 2, 1, { tileInfo, width: 4, height: 4, isRobot: false })).toBe(
      true,
    );

    tileInfo[3][2].passable = false;

    expect(tileOk(1, 1, 2, 1, { tileInfo, width: 4, height: 4, isRobot: false })).toBe(
      false,
    );
    expect(tileOk(1, 1, 3, 1, { tileInfo, width: 4, height: 4, isRobot: false })).toBe(
      false,
    );
  });

  it("rejects vehicle diagonal moves when side clearance is blocked", () => {
    const tileInfo = createTileGrid(4, 4, true);
    tileInfo[3][1].passable = false;

    expect(tileOk(1, 1, 2, 2, { tileInfo, width: 4, height: 4, isRobot: false })).toBe(
      false,
    );

    tileInfo[3][1].passable = true;
    tileInfo[1][3].passable = false;

    expect(tileOk(1, 1, 2, 2, { tileInfo, width: 4, height: 4, isRobot: false })).toBe(
      false,
    );
  });

  it("adds a new candidate point to the A* open list with scores and parent", () => {
    const openList = new PathFindingPointArray();
    const closedList = new PathFindingPointArray();
    openList.initPointIndex(4, 4);
    closedList.initPointIndex(4, 4);
    const currentPoint = new PathFindingPoint(1, 1);
    currentPoint.g = 10;
    const candidatePoint = new PathFindingPoint(2, 1);
    const tileInfo = createTileGrid(4, 4, true);
    tileInfo[2][1].sideWeight = 7;

    addToOpenList(currentPoint, candidatePoint, openList, closedList, {
      tileInfo,
      width: 4,
      height: 4,
      isRobot: true,
      endX: 3,
      endY: 3,
    });

    expect(openList.size).toBe(1);
    expect(openList.pointIndex[2][1]).toBe(0);
    expect(openList.list[0]).toMatchObject({
      x: 2,
      y: 1,
      g: 17,
      h: 3,
      f: 20,
      px: 1,
      py: 1,
    });
    expect(openList.list[0]).not.toBe(candidatePoint);
    expect(candidatePoint.g).toBe(0);
  });

  it("does not add blocked or already-open A* candidate points", () => {
    const openList = new PathFindingPointArray();
    const closedList = new PathFindingPointArray();
    openList.initPointIndex(3, 3);
    closedList.initPointIndex(3, 3);
    const currentPoint = new PathFindingPoint(1, 1);
    const candidatePoint = new PathFindingPoint(2, 1);
    const tileInfo = createTileGrid(3, 3, true);
    tileInfo[2][1].passable = false;

    addToOpenList(currentPoint, candidatePoint, openList, closedList, {
      tileInfo,
      width: 3,
      height: 3,
      isRobot: true,
      endX: 2,
      endY: 2,
    });

    expect(openList.size).toBe(0);

    tileInfo[2][1].passable = true;
    openList.addPoint(new PathFindingPoint(2, 1));
    addToOpenList(currentPoint, candidatePoint, openList, closedList, {
      tileInfo,
      width: 3,
      height: 3,
      isRobot: true,
      endX: 2,
      endY: 2,
    });

    expect(openList.size).toBe(1);
  });

  it("improves an already-closed A* point when the new route is cheaper", () => {
    const openList = new PathFindingPointArray();
    const closedList = new PathFindingPointArray();
    openList.initPointIndex(4, 4);
    closedList.initPointIndex(4, 4);
    const currentPoint = new PathFindingPoint(1, 1);
    currentPoint.g = 5;
    const closedPoint = new PathFindingPoint(2, 1);
    closedPoint.g = 30;
    closedList.addPoint(closedPoint);
    const tileInfo = createTileGrid(4, 4, true);
    tileInfo[2][1].sideWeight = 7;

    addToOpenList(currentPoint, new PathFindingPoint(2, 1), openList, closedList, {
      tileInfo,
      width: 4,
      height: 4,
      isRobot: true,
      endX: 3,
      endY: 3,
    });

    expect(openList.size).toBe(0);
    expect(closedPoint).toMatchObject({
      g: 12,
      h: 3,
      f: 15,
      px: 1,
      py: 1,
    });
  });

  it("keeps an already-closed A* point when the new route is not cheaper", () => {
    const openList = new PathFindingPointArray();
    const closedList = new PathFindingPointArray();
    openList.initPointIndex(4, 4);
    closedList.initPointIndex(4, 4);
    const currentPoint = new PathFindingPoint(1, 1);
    currentPoint.g = 50;
    const closedPoint = new PathFindingPoint(2, 1);
    closedPoint.g = 30;
    closedPoint.f = 33;
    closedList.addPoint(closedPoint);

    addToOpenList(currentPoint, new PathFindingPoint(2, 1), openList, closedList, {
      tileInfo: createTileGrid(4, 4, true),
      width: 4,
      height: 4,
      isRobot: true,
      endX: 3,
      endY: 3,
    });

    expect(openList.size).toBe(0);
    expect(closedPoint.g).toBe(30);
    expect(closedPoint.f).toBe(33);
  });

  it("pushes all eight A* neighbors in upstream order", () => {
    const openList = new PathFindingPointArray();
    const closedList = new PathFindingPointArray();
    openList.initPointIndex(5, 5);
    closedList.initPointIndex(5, 5);
    const currentPoint = new PathFindingPoint(2, 2);
    const tileInfo = createTileGrid(5, 5, true);

    pushInNeighbors(currentPoint, openList, closedList, {
      tileInfo,
      width: 5,
      height: 5,
      isRobot: true,
      endX: 4,
      endY: 4,
    });

    expect(openList.list.map(({ x, y }) => [x, y])).toEqual([
      [1, 1],
      [1, 2],
      [1, 3],
      [2, 1],
      [2, 3],
      [3, 1],
      [3, 2],
      [3, 3],
    ]);
    expect(openList.size).toBe(8);
  });

  it("pushes only passable A* neighbors accepted by add-to-open rules", () => {
    const openList = new PathFindingPointArray();
    const closedList = new PathFindingPointArray();
    openList.initPointIndex(4, 4);
    closedList.initPointIndex(4, 4);
    const currentPoint = new PathFindingPoint(1, 1);
    const tileInfo = createTileGrid(4, 4, true);
    tileInfo[0][1].passable = false;
    tileInfo[1][0].passable = false;
    openList.addPoint(new PathFindingPoint(1, 2));

    pushInNeighbors(currentPoint, openList, closedList, {
      tileInfo,
      width: 4,
      height: 4,
      isRobot: true,
      endX: 3,
      endY: 3,
    });

    expect(openList.list.map(({ x, y }) => [x, y])).toEqual([
      [1, 2],
      [2, 1],
      [2, 2],
    ]);
  });

  it("returns the requested endpoint when A* start or end tiles are invalid", () => {
    const response = createAstarResponse(createTileGrid(3, 3, true), {
      startX: 24,
      startY: 24,
      endX: 48,
      endY: 24,
    });
    response.tileInfo[2][1].passable = false;

    doAstar(response);

    expect(response.pathFindingPointList).toEqual([new PathFindingPoint(48, 24)]);
  });

  it("builds a robot A* path and appends the exact requested endpoint", () => {
    const response = createAstarResponse(createWeightedTileGrid(4, 4, true), {
      startX: 24,
      startY: 24,
      endX: 40,
      endY: 24,
    });

    doAstar(response);

    expect(response.pathFindingPointList.map(({ x, y }) => [x, y])).toEqual([
      [40, 24],
      [40, 24],
    ]);
  });

  it("keeps the first straight A* path waypoint before the endpoint", () => {
    const response = createAstarResponse(createWeightedTileGrid(5, 3, true), {
      startX: 24,
      startY: 24,
      endX: 56,
      endY: 24,
    });

    doAstar(response);

    expect(response.pathFindingPointList.map(({ x, y }) => [x, y])).toEqual([
      [40, 24],
      [56, 24],
      [56, 24],
    ]);
  });

  it("routes A* paths around blocked robot tiles", () => {
    const tileInfo = createWeightedTileGrid(5, 5, true);
    tileInfo[2][2].passable = false;
    const response = createAstarResponse(tileInfo, {
      startX: 24,
      startY: 24,
      endX: 56,
      endY: 56,
    });

    doAstar(response);

    expect(response.pathFindingPointList.at(-1)).toEqual(new PathFindingPoint(56, 56));
    expect(
      response.pathFindingPointList.some((point) => point.x === 40 && point.y === 40),
    ).toBe(false);
  });

  it("leaves A* response paths untouched when killed during processing", () => {
    const response = createAstarResponse(createTileGrid(3, 3, true), {
      startX: 24,
      startY: 24,
      endX: 40,
      endY: 24,
    });
    response.killThread = true;

    doAstar(response);

    expect(response.pathFindingPointList).toEqual([]);
  });

  it("maps movement to the upstream eight-way path direction index", () => {
    const previousPoint = new PathFindingPoint(10, 10);

    expect(pathDirection(previousPoint, new PathFindingPoint(11, 10))).toBe(0);
    expect(pathDirection(previousPoint, new PathFindingPoint(11, 9))).toBe(1);
    expect(pathDirection(previousPoint, new PathFindingPoint(10, 9))).toBe(2);
    expect(pathDirection(previousPoint, new PathFindingPoint(9, 9))).toBe(3);
    expect(pathDirection(previousPoint, new PathFindingPoint(9, 10))).toBe(4);
    expect(pathDirection(previousPoint, new PathFindingPoint(9, 11))).toBe(5);
    expect(pathDirection(previousPoint, new PathFindingPoint(10, 11))).toBe(6);
    expect(pathDirection(previousPoint, new PathFindingPoint(11, 11))).toBe(7);
  });

  it("preserves the upstream overlapping-point direction branch", () => {
    expect(
      pathDirection(new PathFindingPoint(3, 3), new PathFindingPoint(3, 3)),
    ).toBe(6);
  });

  it("selects the open-list point with the lowest f cost", () => {
    const points = new PathFindingPointArray();
    points.initPointIndex(3, 1);
    const first = new PathFindingPoint(0, 0);
    first.f = 12;
    const second = new PathFindingPoint(1, 0);
    second.f = 4;
    const third = new PathFindingPoint(2, 0);
    third.f = 9;
    points.addPoint(first);
    points.addPoint(second);
    points.addPoint(third);

    expect(lowestFCostPoint(points)).toEqual(second);
  });

  it("keeps the first open-list point when f costs tie", () => {
    const points = new PathFindingPointArray();
    points.initPointIndex(2, 1);
    const first = new PathFindingPoint(0, 0);
    first.f = 5;
    const second = new PathFindingPoint(1, 0);
    second.f = 5;
    points.addPoint(first);
    points.addPoint(second);

    expect(lowestFCostPoint(points)).toEqual(first);
  });

  it("returns a copy of the lowest f-cost point", () => {
    const points = new PathFindingPointArray();
    points.initPointIndex(1, 1);
    const point = new PathFindingPoint(0, 0);
    point.f = 3;
    point.g = 2;
    point.h = 1;
    point.px = 4;
    point.py = 5;
    points.addPoint(point);

    const selected = lowestFCostPoint(points);

    expect(selected).toEqual(point);
    expect(selected).not.toBe(point);
  });

  it("moves a point from the open list to the closed list", () => {
    const openList = new PathFindingPointArray();
    const closedList = new PathFindingPointArray();
    openList.initPointIndex(3, 1);
    closedList.initPointIndex(3, 1);
    const first = new PathFindingPoint(0, 0);
    const moved = new PathFindingPoint(1, 0);
    const tail = new PathFindingPoint(2, 0);
    openList.addPoint(first);
    openList.addPoint(moved);
    openList.addPoint(tail);

    removeFromOpen(moved, openList, closedList);

    expect(openList.size).toBe(2);
    expect(openList.list).toEqual([first, tail]);
    expect(openList.pointIndex).toEqual([[0], [-1], [1]]);
    expect(closedList.size).toBe(1);
    expect(closedList.list[0]).toBe(moved);
    expect(closedList.pointIndex).toEqual([[-1], [0], [-1]]);
  });

  it("adds a missing open-list point to the closed list", () => {
    const openList = new PathFindingPointArray();
    const closedList = new PathFindingPointArray();
    openList.initPointIndex(2, 1);
    closedList.initPointIndex(2, 1);
    const point = new PathFindingPoint(1, 0);

    removeFromOpen(point, openList, closedList);

    expect(openList.size).toBe(0);
    expect(openList.pointIndex).toEqual([[-1], [-1]]);
    expect(closedList.list[0]).toBe(point);
    expect(closedList.pointIndex).toEqual([[-1], [0]]);
  });

  it("releases all point-index columns", () => {
    const firstColumn = [{ id: 1 }];
    const pointIndex = [firstColumn, [{ id: 2 }]];

    freePointIndex(pointIndex);

    expect(pointIndex).toEqual([]);
    expect(firstColumn).toEqual([]);
  });

  it("releases the A* point list", () => {
    const list = [{ id: 1 }, { id: 2 }];

    freeList(list);

    expect(list).toEqual([]);
  });

  it("initializes a width-major point index with empty sentinels", () => {
    expect(initPointIndex(3, 2)).toEqual([
      [-1, -1],
      [-1, -1],
      [-1, -1],
    ]);
  });

  it("removes a point and reindexes the moved tail point", () => {
    const list = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ];
    const pointIndex = initPointIndex(3, 1);
    pointIndex[0][0] = 0;
    pointIndex[1][0] = 1;
    pointIndex[2][0] = 2;

    removePoint(list, pointIndex, 1, 0);

    expect(list).toEqual([
      { x: 0, y: 0 },
      { x: 2, y: 0 },
    ]);
    expect(pointIndex).toEqual([[0], [-1], [1]]);
  });
});

function createTileGrid(
  width: number,
  height: number,
  passable: boolean,
): MapPathfindingTile[][] {
  return Array.from({ length: width }, () =>
    Array.from({ length: height }, () => ({
      sideWeight: 0,
      diagonalWeight: 0,
      passable,
    })),
  );
}

function createWeightedTileGrid(
  width: number,
  height: number,
  passable: boolean,
): MapPathfindingTile[][] {
  return Array.from({ length: width }, () =>
    Array.from({ length: height }, () => ({
      sideWeight: 10,
      diagonalWeight: 14,
      passable,
    })),
  );
}

function createAstarResponse(
  tileInfo: MapPathfindingTile[][],
  options: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    isRobot?: boolean;
  },
) {
  return {
    tileInfo,
    width: tileInfo.length,
    height: tileInfo[0]?.length ?? 0,
    isRobot: options.isRobot ?? true,
    startX: options.startX,
    startY: options.startY,
    endX: options.endX,
    endY: options.endY,
    killThread: false,
    pathFindingPointList: [] as PathFindingPoint[],
  };
}
