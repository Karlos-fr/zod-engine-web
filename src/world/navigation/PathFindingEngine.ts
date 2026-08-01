/**
 * Upstream: zpath_finding.h / zpath_finding.cpp
 */

import type { MapPathfindingTile } from "./NavigationTypes";
import { PathTileType } from "./NavigationTypes";
import { doAstar, PathFindingPoint } from "./AStar";
import type { WithinImpassableResult } from "../GameMap";
import { ROAD_SPEED, WATER_SPEED } from "../../simulation/SimulationConstants";

export type PathFindingRegionInfoReference = {
  inSameRegion(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    isRobot: boolean,
  ): boolean;
  buildRegions?: (tileInfo: MapPathfindingTile[][], region: number[][]) => number;
  robotRegion?: number[][] | null;
  vehicleRegion?: number[][] | null;
};

/**
 * Port of upstream `ZPath_Finding_RegionInfo`.
 * Role: Stores allocated region grids used to skip impossible pathfinding queries.
 * Upstream: zpath_finding.h:62-96
 */
export class PathFindingRegionInfo {
  allocated = false;
  width = 0;
  height = 0;
  floodFillQueue: PathFindingPoint[] | null = null;
  robotRegion: number[][] | null = null;
  vehicleRegion: number[][] | null = null;

  /**
   * Port of upstream `ZPath_Finding_RegionInfo::Init`.
   * Role: Reallocates flood-fill storage and zeroed robot/vehicle region grids.
   * Upstream: zpath_finding.cpp:103-134
   */
  init(width: number, height: number): void {
    this.delete();

    this.width = width;
    this.height = height;
    this.floodFillQueue = Array.from(
      { length: width * height },
      () => new PathFindingPoint(0, 0),
    );
    this.robotRegion = Array.from({ length: width }, () =>
      Array.from({ length: height }, () => 0),
    );
    this.vehicleRegion = Array.from({ length: width }, () =>
      Array.from({ length: height }, () => 0),
    );
    this.allocated = true;
  }

  /**
   * Port of upstream `ZPath_Finding_RegionInfo::Delete`.
   * Role: Releases allocated flood-fill and region grids.
   * Upstream: zpath_finding.cpp:136-157
   */
  delete(): void {
    if (!this.allocated) return;

    this.floodFillQueue?.splice(0);

    for (let i = 0; i < this.width; i += 1) {
      this.robotRegion?.[i]?.splice(0);
      this.vehicleRegion?.[i]?.splice(0);
    }

    this.robotRegion?.splice(0);
    this.vehicleRegion?.splice(0);

    this.floodFillQueue = null;
    this.robotRegion = null;
    this.vehicleRegion = null;
    this.allocated = false;
  }

  /**
   * Port of upstream `ZPath_Finding_RegionInfo::FloodFill_Recursive`.
   * Role: Marks one contiguous unassigned region using recursive four-way flood fill.
   * Upstream: zpath_finding.cpp:159-178
   */
  floodFillRecursive(
    region: number[][],
    x: number,
    y: number,
    currentRegion: number,
  ): void {
    if (x < 0) return;
    if (y < 0) return;
    if (x >= this.width) return;
    if (y >= this.height) return;
    if (region[x]?.[y] !== -1) return;

    region[x][y] = currentRegion;

    this.floodFillRecursive(region, x - 1, y, currentRegion);
    this.floodFillRecursive(region, x + 1, y, currentRegion);
    this.floodFillRecursive(region, x, y - 1, currentRegion);
    this.floodFillRecursive(region, x, y + 1, currentRegion);
  }

  /**
   * Port of upstream `ZPath_Finding_RegionInfo::FloodFill_AddQ`.
   * Role: Adds one unassigned tile to the flood-fill queue and marks its region.
   * Upstream: zpath_finding.cpp:180-197
   */
  floodFillAddQueue(
    region: number[][],
    index: number,
    x: number,
    y: number,
    currentRegion: number,
  ): number {
    if (x < 0) return index;
    if (y < 0) return index;
    if (x >= this.width) return index;
    if (y >= this.height) return index;
    if (region[x]?.[y] !== -1) return index;
    if (!this.floodFillQueue) return index;

    region[x][y] = currentRegion;
    this.floodFillQueue[index] = new PathFindingPoint(x, y);

    return index + 1;
  }

  /**
   * Port of upstream `ZPath_Finding_RegionInfo::FloodFill`.
   * Role: Marks one contiguous unassigned region using four-way flood fill.
   * Upstream: zpath_finding.cpp:199-222
   */
  floodFill(
    region: number[][],
    x: number,
    y: number,
    currentRegion: number,
  ): number {
    if (!this.floodFillQueue) return 0;

    this.floodFillQueue.length = 0;
    let queueSize = this.floodFillAddQueue(region, 0, x, y, currentRegion);

    for (let i = 0; i < queueSize; i += 1) {
      const node = this.floodFillQueue[i];

      queueSize = this.floodFillAddQueue(
        region,
        queueSize,
        node.x - 1,
        node.y,
        currentRegion,
      );
      queueSize = this.floodFillAddQueue(
        region,
        queueSize,
        node.x + 1,
        node.y,
        currentRegion,
      );
      queueSize = this.floodFillAddQueue(
        region,
        queueSize,
        node.x,
        node.y - 1,
        currentRegion,
      );
      queueSize = this.floodFillAddQueue(
        region,
        queueSize,
        node.x,
        node.y + 1,
        currentRegion,
      );
    }

    return queueSize;
  }

  /**
   * Port of upstream `ZPath_Finding_RegionInfo::BuildRegions`.
   * Role: Builds contiguous region ids for passable pathfinding tiles.
   * Upstream: zpath_finding.cpp:224-253
   */
  buildRegions(tileInfo: MapPathfindingTile[][], region: number[][]): number {
    if (!this.allocated) return 0;

    for (let x = 0; x < this.width; x += 1) {
      for (let y = 0; y < this.height; y += 1) {
        region[x][y] = tileInfo[x][y].passable ? -1 : -2;
      }
    }

    let currentRegion = 0;

    for (let x = 0; x < this.width; x += 1) {
      for (let y = 0; y < this.height; y += 1) {
        if (region[x][y] === -1) {
          this.floodFill(region, x, y, currentRegion);
          currentRegion += 1;
        }
      }
    }

    return currentRegion;
  }

  /**
   * Port of upstream `ZPath_Finding_RegionInfo::InSameRegion`.
   * Role: Compares robot or vehicle region ids for two world-coordinate points.
   * Upstream: zpath_finding.cpp:255-285
   */
  inSameRegion(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    isRobot: boolean,
  ): boolean {
    if (!this.allocated) return true;

    const startTileX = startX >> 4;
    const startTileY = startY >> 4;
    const endTileX = endX >> 4;
    const endTileY = endY >> 4;

    if (startTileX < 0) return true;
    if (startTileY < 0) return true;
    if (endTileX < 0) return true;
    if (endTileY < 0) return true;
    if (startTileX >= this.width) return true;
    if (startTileY >= this.height) return true;
    if (endTileX >= this.width) return true;
    if (endTileY >= this.height) return true;

    if (isRobot) {
      return (
        this.robotRegion?.[startTileX]?.[startTileY] ===
        this.robotRegion?.[endTileX]?.[endTileY]
      );
    }

    return (
      this.vehicleRegion?.[startTileX]?.[startTileY] ===
      this.vehicleRegion?.[endTileX]?.[endTileY]
    );
  }
}

/**
 * Port of upstream `ZPath_Finding_Bresenham`.
 * Role: Stores incremental line traversal state for tile-space path checks.
 * Upstream: zpath_finding.h:17-28
 */
export class PathFindingBresenham {
  inited = false;
  startX = 0;
  startY = 0;
  endX = 0;
  endY = 0;
  nextX = 0;
  nextY = 0;
  deltaX = 0;
  deltaY = 0;
  stepX = 1;
  stepY = 1;
  fraction = 0;

  /**
   * Port of upstream `ZPath_Finding_Bresenham::Init`.
   * Role: Initializes bounded Bresenham traversal state between two map tiles.
   * Upstream: zpath_finding.cpp:13-52
   */
  init(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    width: number,
    height: number,
  ): void {
    this.inited = false;

    if (startX < 0) return;
    if (startY < 0) return;
    if (startX >= width) return;
    if (startY >= height) return;
    if (endX < 0) return;
    if (endY < 0) return;
    if (endX >= width) return;
    if (endY >= height) return;

    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;

    this.nextX = this.startX;
    this.nextY = this.startY;

    this.deltaX = this.endX - this.startX;
    this.deltaY = this.endY - this.startY;

    this.stepX = this.deltaX < 0 ? -1 : 1;
    this.stepY = this.deltaY < 0 ? -1 : 1;

    this.deltaX = Math.abs(this.deltaX * 2);
    this.deltaY = Math.abs(this.deltaY * 2);

    if (this.deltaY > this.deltaX) {
      this.fraction = this.deltaX * 2 - this.deltaY;
    } else {
      this.fraction = this.deltaY * 2 - this.deltaX;
    }

    this.inited = true;
  }

  /**
   * Port of upstream `ZPath_Finding_Bresenham::GetNext`.
   * Role: Advances one tile along the initialized Bresenham line.
   * Upstream: zpath_finding.cpp:54-92
   */
  getNext(): PathFindingPoint | null {
    if (!this.inited) return null;

    if (this.deltaY > this.deltaX) {
      if (this.nextY === this.endY) return null;

      if (this.fraction >= 0) {
        this.nextX += this.stepX;
        this.fraction -= this.deltaY;
      }

      this.nextY += this.stepY;
      this.fraction += this.deltaX;

      return new PathFindingPoint(this.nextX, this.nextY);
    }

    if (this.nextX === this.endX) return null;

    if (this.fraction >= 0) {
      this.nextY += this.stepY;
      this.fraction -= this.deltaX;
    }

    this.nextX += this.stepX;
    this.fraction += this.deltaY;

    return new PathFindingPoint(this.nextX, this.nextY);
  }
}

export type PathFindingTileSet = {
  robotTiles: MapPathfindingTile[][];
  robotNoRocksTiles: MapPathfindingTile[][];
  vehicleTiles: MapPathfindingTile[][];
  vehicleNoRocksTiles: MapPathfindingTile[][];
};

export type PathFindingThreadHandle = {
  wait?: () => void;
} | null;

export type PathFindingThreadLauncher = (
  response: PathFindingResponse,
) => PathFindingThreadHandle;

/**
 * Port of upstream `ZPath_Finding_Response`.
 * Role: Stores one pathfinding request/response payload and tracks live responses.
 * Upstream: zpath_finding.h:30-49, zpath_finding.cpp:287-306
 */
export class PathFindingResponse {
  static existingResponses = 0;

  pathFinder: PathFindingEngine | null = null;
  threadId = 0;
  startX = 0;
  startY = 0;
  endX = 0;
  endY = 0;
  objectRefId = -1;
  width = 0;
  height = 0;
  isRobot = false;
  killThread = false;
  tileInfo: MapPathfindingTile[][] | null = null;
  pathFindingPointList: PathFindingPoint[] = [];
  private disposed = false;

  constructor() {
    PathFindingResponse.existingResponses += 1;
  }

  dispose(): void {
    if (this.disposed) return;

    PathFindingResponse.existingResponses -= 1;
    this.disposed = true;
  }
}

/**
 * Port of upstream `ZPath_Finding_Thread_Entry`.
 * Role: Tracks one active pathfinding worker and its response payload.
 * Upstream: zpath_finding.h:51-60
 */
export class PathFindingThreadEntry {
  threadId: number;
  thread: PathFindingThreadHandle;
  response: PathFindingResponse;

  constructor(
    threadId: number,
    thread: PathFindingThreadHandle,
    response: PathFindingResponse,
  ) {
    this.threadId = threadId;
    this.thread = thread;
    this.response = response;
  }
}

/**
 * Port of upstream `Find_Path_Thread`.
 * Role: Runs one pathfinding response and queues it for collection when still active.
 * Upstream: zpath_finding.cpp:789-808
 */
export function findPathThread(response: PathFindingResponse | null): number {
  if (!response) return 0;

  doAstar(response as PathFindingResponse & { tileInfo: MapPathfindingTile[][] });

  if (response.killThread) {
    response.dispose();
  } else {
    response.pathFinder?.pushResponse(response);
  }

  return 1;
}

/**
 * Port of upstream `ZPath_Finding_Engine`.
 * Role: Coordinates pathfinding queries and delegates region checks.
 * Upstream: zpath_finding.h:98-169
 */
export class PathFindingEngine {
  readonly regionInfo: PathFindingRegionInfoReference;
  readonly threadLauncher: PathFindingThreadLauncher;
  width: number;
  height: number;
  nextThreadId = 0;
  tileSet: PathFindingTileSet | null;
  responseList: PathFindingResponse[] = [];
  threadList: PathFindingThreadEntry[] = [];

  constructor(
    regionInfo: PathFindingRegionInfoReference,
    options: {
      width?: number;
      height?: number;
      tileSet?: PathFindingTileSet;
      threadLauncher?: PathFindingThreadLauncher;
    } = {},
  ) {
    this.regionInfo = regionInfo;
    this.width = options.width ?? 0;
    this.height = options.height ?? 0;
    this.tileSet = options.tileSet ?? null;
    this.threadLauncher =
      options.threadLauncher ??
      ((response) => {
        findPathThread(response);
        return { wait: () => undefined };
      });
  }

  /**
   * Port of upstream `ZPath_Finding_Engine::Push_Response`.
   * Role: Appends one completed pathfinding response to the engine response list.
   * Upstream: zpath_finding.cpp:337-344
   */
  pushResponse(response: PathFindingResponse | null): void {
    if (!response) return;

    this.responseList.push(response);
  }

  /**
   * Port of upstream `ZPath_Finding_Engine::Kill_Thread_Id`.
   * Role: Cancels and removes one tracked pathfinding worker by id.
   * Upstream: zpath_finding.cpp:763-787
   */
  killThreadId(threadId: number): void {
    const index = this.threadList.findIndex((entry) => entry.threadId === threadId);
    if (index === -1) return;

    const entry = this.threadList[index];
    if (entry.thread) {
      entry.response.killThread = true;
      entry.thread.wait?.();
    }

    this.threadList.splice(index, 1);
  }

  /**
   * Port of upstream `ZPath_Finding_Engine::Clear_Thread_Id`.
   * Role: Removes one tracked pathfinding worker and releases its response.
   * Upstream: zpath_finding.cpp:713-725
   */
  clearThreadId(threadId: number): void {
    const index = this.threadList.findIndex((entry) => entry.threadId === threadId);
    if (index === -1) return;

    this.threadList[index].response.dispose();
    this.threadList.splice(index, 1);
  }

  /**
   * Port of upstream `ZPath_Finding_Engine::Clear_Response_List`.
   * Role: Clears queued pathfinding responses and cancels their tracked workers.
   * Upstream: zpath_finding.cpp:727-739
   */
  clearResponseList(): void {
    for (const response of this.responseList) {
      this.killThreadId(response.threadId);
      response.dispose();
    }

    this.responseList.length = 0;
  }

  /**
   * Port of upstream `ZPath_Finding_Engine::Clear_Thread_List`.
   * Role: Cancels every tracked pathfinding worker and clears the worker list.
   * Upstream: zpath_finding.cpp:741-761
   */
  clearThreadList(): void {
    for (const entry of this.threadList) {
      if (entry.thread) {
        entry.response.killThread = true;
        entry.thread.wait?.();
      }
    }

    this.threadList.length = 0;
  }

  /**
   * Port of upstream `ZPath_Finding_Engine::DeleteTileInfo`.
   * Role: Releases one pathfinding tile grid and clears the caller's reference.
   * Upstream: zpath_finding.cpp:346-358
   */
  static deleteTileInfo(
    tileGrid: MapPathfindingTile[][] | null,
  ): MapPathfindingTile[][] | null {
    if (tileGrid) {
      for (const column of tileGrid) {
        column.length = 0;
      }
      tileGrid.length = 0;
    }

    return null;
  }

  /**
   * Port of upstream `ZPath_Finding_Engine::DeleteAllTileInfo`.
   * Role: Stops pathfinding workers and releases every pathfinding tile grid.
   * Upstream: zpath_finding.cpp:360-369
   */
  deleteAllTileInfo(): void {
    this.clearThreadList();

    if (!this.tileSet) return;

    PathFindingEngine.deleteTileInfo(this.tileSet.robotTiles);
    PathFindingEngine.deleteTileInfo(this.tileSet.robotNoRocksTiles);
    PathFindingEngine.deleteTileInfo(this.tileSet.vehicleTiles);
    PathFindingEngine.deleteTileInfo(this.tileSet.vehicleNoRocksTiles);
    this.tileSet = null;
  }

  /**
   * Port of upstream `ZPath_Finding_Engine::AllocAllTileInfo`.
   * Role: Allocates zeroed pathfinding tile grids for robots, vehicles, and no-rock variants.
   * Upstream: zpath_finding.cpp:371-395
   */
  allocAllTileInfo(): void {
    this.tileSet = {
      robotTiles: createTileGrid(this.width, this.height),
      robotNoRocksTiles: createTileGrid(this.width, this.height),
      vehicleTiles: createTileGrid(this.width, this.height),
      vehicleNoRocksTiles: createTileGrid(this.width, this.height),
    };
  }

  /**
   * Port of upstream `ZPath_Finding_Engine::InSameRegion`.
   * Role: Reports whether two map coordinates belong to the same pathfinding region.
   * Upstream: zpath_finding.cpp:597-600
   */
  inSameRegion(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    isRobot: boolean,
  ): boolean {
    return this.regionInfo.inSameRegion(startX, startY, endX, endY, isRobot);
  }

  /**
   * Port of upstream `ZPath_Finding_Engine::RebuildRegions`.
   * Role: Rebuilds robot and vehicle region grids from current pathfinding tiles.
   * Upstream: zpath_finding.cpp:602-606
   */
  rebuildRegions(): { robotRegions: number; vehicleRegions: number } {
    if (!this.tileSet) return { robotRegions: 0, vehicleRegions: 0 };
    if (!this.regionInfo.buildRegions) {
      return { robotRegions: 0, vehicleRegions: 0 };
    }
    if (!this.regionInfo.robotRegion || !this.regionInfo.vehicleRegion) {
      return { robotRegions: 0, vehicleRegions: 0 };
    }

    return {
      robotRegions: this.regionInfo.buildRegions(
        this.tileSet.robotTiles,
        this.regionInfo.robotRegion,
      ),
      vehicleRegions: this.regionInfo.buildRegions(
        this.tileSet.vehicleTiles,
        this.regionInfo.vehicleRegion,
      ),
    };
  }

  /**
   * Port of upstream `ZPath_Finding_Engine::SetImpassable`.
   * Role: Updates robot, vehicle, and no-rock passability for one pathfinding tile.
   * Upstream: zpath_finding.cpp:608-627
   */
  setImpassable(
    x: number,
    y: number,
    impassable: boolean,
    destroyable: boolean,
  ): void {
    if (x < 0) return;
    if (y < 0) return;
    if (x >= this.width) return;
    if (y >= this.height) return;
    if (!this.tileSet?.robotTiles) return;
    if (!this.tileSet.vehicleTiles) return;
    if (!this.tileSet.robotNoRocksTiles) return;
    if (!this.tileSet.vehicleNoRocksTiles) return;

    const passable = !impassable;
    const noRocksPassable = !impassable || destroyable;

    this.tileSet.robotTiles[x][y].passable = passable;
    this.tileSet.vehicleTiles[x][y].passable = passable;
    this.tileSet.robotNoRocksTiles[x][y].passable = noRocksPassable;
    this.tileSet.vehicleNoRocksTiles[x][y].passable = noRocksPassable;
  }

  /**
   * Port of upstream `ZPath_Finding_Engine::TileOnMap`.
   * Role: Reports whether tile coordinates are inside the pathfinding grid.
   * Upstream: zpath_finding.cpp:548-556
   */
  tileOnMap(tileX: number, tileY: number): boolean {
    if (tileX < 0) return false;
    if (tileY < 0) return false;
    if (tileX >= this.width) return false;
    if (tileY >= this.height) return false;

    return true;
  }

  /**
   * Port of upstream `ZPath_Finding_Engine::TilePassable`.
   * Role: Reports whether a robot or vehicle can occupy a pathfinding tile.
   * Upstream: zpath_finding.cpp:558-566
   */
  tilePassable(tileX: number, tileY: number, isRobot: boolean): boolean {
    if (!this.tileOnMap(tileX, tileY)) return false;
    if (!this.tileSet) return false;

    if (isRobot) {
      return this.tileSet.robotTiles[tileX][tileY].passable;
    }

    return this.tileSet.vehicleTiles[tileX][tileY].passable;
  }

  /**
   * Port of upstream `ZPath_Finding_Engine::ShouldBeAbleToMoveTo`.
   * Role: Checks region reachability and final tile occupancy for robot or vehicle moves.
   * Upstream: zpath_finding.cpp:568-595
   */
  shouldBeAbleToMoveTo(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    isRobot: boolean,
  ): boolean {
    if (!this.inSameRegion(startX, startY, endX, endY, isRobot)) return false;

    const tileX = endX >> 4;
    const tileY = endY >> 4;

    if (isRobot) {
      return this.tilePassable(tileX, tileY, isRobot);
    }

    if (!this.tilePassable(tileX, tileY, isRobot)) return false;
    if (!this.tilePassable(tileX + 1, tileY, isRobot)) return false;
    if (!this.tilePassable(tileX, tileY + 1, isRobot)) return false;
    if (!this.tilePassable(tileX + 1, tileY + 1, isRobot)) return false;

    return true;
  }

  /**
   * Port of upstream `ZPath_Finding_Engine::SetTileInfo`.
   * Role: Updates pathfinding passability and movement weights for one tile.
   * Upstream: zpath_finding.cpp:417-471
   */
  setTileInfo(x: number, y: number, tileType: PathTileType): void {
    if (x < 0) return;
    if (y < 0) return;
    if (x >= this.width) return;
    if (y >= this.height) return;
    if (!this.tileSet?.robotTiles) return;
    if (!this.tileSet.vehicleTiles) return;
    if (!this.tileSet.robotNoRocksTiles) return;
    if (!this.tileSet.vehicleNoRocksTiles) return;

    let tileSpeed = 1.0;

    switch (tileType) {
      case PathTileType.Normal:
        this.tileSet.robotTiles[x][y].passable = true;
        this.tileSet.vehicleTiles[x][y].passable = true;
        break;
      case PathTileType.Impassable:
        this.tileSet.robotTiles[x][y].passable = false;
        this.tileSet.vehicleTiles[x][y].passable = false;
        break;
      case PathTileType.Water:
        tileSpeed = 1.0 / WATER_SPEED;
        this.tileSet.robotTiles[x][y].passable = true;
        this.tileSet.vehicleTiles[x][y].passable = false;
        break;
      case PathTileType.Road:
        tileSpeed = 1.0 / (ROAD_SPEED + 0.5);
        this.tileSet.robotTiles[x][y].passable = true;
        this.tileSet.vehicleTiles[x][y].passable = true;
        break;
      default:
        break;
    }

    const sideWeight = 100 * tileSpeed;
    const diagonalWeight = 1.414 * 100 * tileSpeed;

    this.tileSet.robotTiles[x][y].sideWeight = sideWeight;
    this.tileSet.robotTiles[x][y].diagonalWeight = diagonalWeight;
    this.tileSet.vehicleTiles[x][y].sideWeight = sideWeight;
    this.tileSet.vehicleTiles[x][y].diagonalWeight = diagonalWeight;
    this.tileSet.robotNoRocksTiles[x][y].sideWeight = sideWeight;
    this.tileSet.robotNoRocksTiles[x][y].diagonalWeight = diagonalWeight;
    this.tileSet.vehicleNoRocksTiles[x][y].sideWeight = sideWeight;
    this.tileSet.vehicleNoRocksTiles[x][y].diagonalWeight = diagonalWeight;
    this.tileSet.robotNoRocksTiles[x][y].passable =
      this.tileSet.robotTiles[x][y].passable;
    this.tileSet.vehicleNoRocksTiles[x][y].passable =
      this.tileSet.vehicleTiles[x][y].passable;
  }

  /**
   * Port of upstream `ZPath_Finding_Engine::SetTileWideWeights`.
   * Role: Expands vehicle movement weights across the 2x2 footprint used by vehicles.
   * Upstream: zpath_finding.cpp:473-546
   */
  setTileWideWeights(): void {
    if (this.width <= 0 || this.height <= 0) return;
    if (!this.tileSet?.vehicleTiles) return;
    if (!this.tileSet.vehicleNoRocksTiles) return;

    const wideSideWeight = Array.from({ length: this.width }, () =>
      Array<number>(this.height).fill(0),
    );
    const wideDiagonalWeight = Array.from({ length: this.width }, () =>
      Array<number>(this.height).fill(0),
    );

    for (let x = 0; x < this.width; x += 1) {
      for (let y = 0; y < this.height; y += 1) {
        let sideWeight = this.tileSet.vehicleTiles[x][y].sideWeight;
        let diagonalWeight = this.tileSet.vehicleTiles[x][y].diagonalWeight;

        if (x + 1 < this.width) {
          sideWeight += this.tileSet.vehicleTiles[x + 1][y].sideWeight;
          diagonalWeight += this.tileSet.vehicleTiles[x + 1][y].diagonalWeight;
        }

        if (y + 1 < this.height) {
          sideWeight += this.tileSet.vehicleTiles[x][y + 1].sideWeight;
          diagonalWeight += this.tileSet.vehicleTiles[x][y + 1].diagonalWeight;
        }

        if (x + 1 < this.width && y + 1 < this.height) {
          sideWeight += this.tileSet.vehicleTiles[x + 1][y + 1].sideWeight;
          diagonalWeight += this.tileSet.vehicleTiles[x + 1][y + 1].diagonalWeight;
        }

        wideSideWeight[x][y] = sideWeight;
        wideDiagonalWeight[x][y] = diagonalWeight;
      }
    }

    for (let x = 0; x < this.width; x += 1) {
      for (let y = 0; y < this.height; y += 1) {
        this.tileSet.vehicleTiles[x][y].sideWeight = wideSideWeight[x][y];
        this.tileSet.vehicleTiles[x][y].diagonalWeight =
          wideDiagonalWeight[x][y];
        this.tileSet.vehicleNoRocksTiles[x][y].sideWeight =
          this.tileSet.vehicleTiles[x][y].sideWeight;
        this.tileSet.vehicleNoRocksTiles[x][y].diagonalWeight =
          this.tileSet.vehicleTiles[x][y].diagonalWeight;
      }
    }
  }

  /**
   * Port of upstream `ZPath_Finding_Engine::Direct_Path_Possible`.
   * Role: Checks whether a straight pixel path avoids blocking pathfinding tiles.
   * Upstream: zpath_finding.cpp:903-1020
   */
  directPathPossible(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    isRobot: boolean,
    hasExplosives: boolean,
  ): boolean {
    if (startX === endX && startY === endY) {
      return true;
    }
    if (!this.tileSet) {
      return false;
    }

    const crawlDistance = 4;
    const lineDeltaX = endX - startX;
    const lineDeltaY = endY - startY;
    let distanceLeft = Math.trunc(
      Math.sqrt(lineDeltaX * lineDeltaX + lineDeltaY * lineDeltaY),
    );
    const hyp =
      Math.abs(lineDeltaX) > Math.abs(lineDeltaY)
        ? 1 / Math.cos(Math.atan2(Math.abs(lineDeltaY), Math.abs(lineDeltaX)))
        : 1 / Math.sin(Math.atan2(Math.abs(lineDeltaY), Math.abs(lineDeltaX)));
    const tileCheck = selectTileGrid(this.tileSet, isRobot, hasExplosives);
    const boundsCheck = isRobot ? 1 : 2;
    const lineA = -1 * (startY - endY);
    const lineB = startX - endX;
    const lineC = -1 * (lineA * startX + lineB * startY);
    const lineDenominator = Math.sqrt(lineA * lineA + lineB * lineB);
    let currentX = startX;
    let currentY = startY;
    const stepX = (lineDeltaX / distanceLeft) * crawlDistance;
    const stepY = (lineDeltaY / distanceLeft) * crawlDistance;
    const distanceCheck =
      (isRobot ? 8 + 8 + 1 : 16 + 8 + 1) * hyp * lineDenominator;

    while (distanceLeft > 0) {
      const centerTileX = Math.trunc(currentX / 16);
      const centerTileY = Math.trunc(currentY / 16);
      const endTileX = centerTileX + boundsCheck;
      const endTileY = centerTileY + boundsCheck;

      for (
        let tileX = centerTileX - boundsCheck;
        tileX <= endTileX;
        tileX += 1
      ) {
        for (
          let tileY = centerTileY - boundsCheck;
          tileY <= endTileY;
          tileY += 1
        ) {
          if (tileX < 0) continue;
          if (tileY < 0) continue;
          if (tileX >= this.width) continue;
          if (tileY >= this.height) continue;
          if (tileCheck[tileX][tileY].passable) continue;

          const tileCenterX = tileX * 16 + 8;
          const tileCenterY = tileY * 16 + 8;
          if (
            distanceCheck >=
            Math.abs(lineA * tileCenterX + lineB * tileCenterY + lineC)
          ) {
            return false;
          }
        }
      }

      currentX += stepX;
      currentY += stepY;
      distanceLeft -= crawlDistance;
    }

    return true;
  }

  /**
   * Port of upstream `ZPath_Finding_Engine::Find_Path`.
   * Role: Creates and starts one asynchronous pathfinding request when direct movement is blocked.
   * Upstream: zpath_finding.cpp:810-901
   */
  findPath(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    isRobot: boolean,
    hasExplosives: boolean,
    objectRefId: number,
  ): number {
    if (
      this.directPathPossible(
        startX,
        startY,
        endX,
        endY,
        isRobot,
        hasExplosives,
      )
    ) {
      return 0;
    }

    if (!this.inSameRegion(startX, startY, endX, endY, isRobot)) return 0;
    if (!this.tileSet) return 0;

    this.nextThreadId += 1;
    if (this.nextThreadId === 0) this.nextThreadId += 1;

    const response = new PathFindingResponse();
    response.pathFinder = this;
    response.threadId = this.nextThreadId;
    response.objectRefId = objectRefId;
    response.startX = startX;
    response.startY = startY;
    response.endX = endX;
    response.endY = endY;
    response.isRobot = isRobot;
    response.killThread = false;
    response.width = this.width;
    response.height = this.height;
    response.tileInfo = selectTileGrid(this.tileSet, isRobot, hasExplosives);

    const thread = this.threadLauncher(response);
    if (!thread) {
      response.dispose();
      return 0;
    }

    this.threadList.push(
      new PathFindingThreadEntry(this.nextThreadId, thread, response),
    );

    return this.nextThreadId;
  }

  /**
   * Port of upstream `ZPath_Finding_Engine::WithinImpassable`.
   * Role: Checks whether a pixel rectangle overlaps impassable pathfinding tiles.
   * Upstream: zpath_finding.cpp:629-698
   */
  withinImpassable(
    x: number,
    y: number,
    width: number,
    height: number,
    isRobot: boolean,
  ): WithinImpassableResult {
    if (!this.tileSet?.robotTiles) {
      return { within: false, stopX: x, stopY: y };
    }
    if (!this.tileSet.vehicleTiles) {
      return { within: false, stopX: x, stopY: y };
    }

    const widthPixels = this.width << 4;
    const heightPixels = this.height << 4;

    if (x < 0) return { within: true, stopX: x, stopY: y };
    if (y < 0) return { within: true, stopX: x, stopY: y };
    if (x + width >= widthPixels) return { within: true, stopX: x, stopY: y };
    if (y + height >= heightPixels) return { within: true, stopX: x, stopY: y };

    const tileCheck = isRobot ? this.tileSet.robotTiles : this.tileSet.vehicleTiles;
    const startTileX = x >> 4;
    const startTileY = y >> 4;
    let tileWidth = width >> 4;
    let tileHeight = height >> 4;

    if (width % 16) tileWidth += 1;
    if (height % 16) tileHeight += 1;

    let endTileX = startTileX + tileWidth;
    let endTileY = startTileY + tileHeight;
    const maxTileX = (widthPixels >> 4) - 1;
    const maxTileY = (heightPixels >> 4) - 1;

    if (endTileX > maxTileX) endTileX = maxTileX;
    if (endTileY > maxTileY) endTileY = maxTileY;

    for (
      let tileX = startTileX, tilePixelX = startTileX << 4;
      tileX <= endTileX;
      tileX += 1, tilePixelX += 16
    ) {
      for (
        let tileY = startTileY, tilePixelY = startTileY << 4;
        tileY <= endTileY;
        tileY += 1, tilePixelY += 16
      ) {
        if (tileCheck[tileX][tileY].passable) continue;
        if (x >= tilePixelX + 16) continue;
        if (y >= tilePixelY + 16) continue;
        if (x + width <= tilePixelX) continue;
        if (y + height <= tilePixelY) continue;

        return {
          within: true,
          stopX: tileX << 4,
          stopY: tileY << 4,
        };
      }
    }

    return { within: false, stopX: x, stopY: y };
  }

  /**
   * Port of upstream `ZPath_Finding_Engine::HasDestroyableBarrier`.
   * Role: Reports whether a tile is blocked only by a destroyable barrier.
   * Upstream: zpath_finding.cpp:700-711
   */
  hasDestroyableBarrier(x: number, y: number): boolean {
    if (!this.tileSet?.robotTiles) return false;
    if (!this.tileSet.robotNoRocksTiles) return false;
    if (x < 0) return false;
    if (y < 0) return false;
    if (x >= this.width) return false;
    if (y >= this.height) return false;

    return (
      this.tileSet.robotNoRocksTiles[x][y].passable &&
      !this.tileSet.robotTiles[x][y].passable
    );
  }
}

function selectTileGrid(
  tileSet: PathFindingTileSet,
  isRobot: boolean,
  hasExplosives: boolean,
): MapPathfindingTile[][] {
  if (isRobot) {
    return hasExplosives ? tileSet.robotNoRocksTiles : tileSet.robotTiles;
  }
  return hasExplosives ? tileSet.vehicleNoRocksTiles : tileSet.vehicleTiles;
}

function createTileGrid(width: number, height: number): MapPathfindingTile[][] {
  return Array.from({ length: width }, () =>
    Array.from({ length: height }, () => ({
      sideWeight: 0,
      diagonalWeight: 0,
      passable: false,
    })),
  );
}
