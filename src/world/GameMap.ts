/**
 * Upstream: zmap.h / zmap.cpp
 */

import type { Tile } from "./Tile";

/**
 * Port of upstream `path_finder`.
 * Role: Provides delegated pathfinding operations owned by the map.
 * Upstream: zmap.h:255-261
 */
export type MapPathFinder = {
  rebuildRegions(): void;
  setImpassable(x: number, y: number, impassable: boolean, destroyable: boolean): void;
  withinImpassable(
    x: number,
    y: number,
    width: number,
    height: number,
    isRobot: boolean,
  ): WithinImpassableResult;
};

/**
 * Port of upstream `WithinImpassable` output arguments.
 * Role: Reports whether an area hits impassable terrain and where it stopped.
 * Upstream: zmap.h:257-258
 */
export type WithinImpassableResult = {
  within: boolean;
  stopX: number;
  stopY: number;
};

export class GameMap {
  readonly width: number;
  readonly height: number;
  readonly tiles: Tile[];
  private readonly pathFinder?: MapPathFinder;

  constructor(options: {
    width: number;
    height: number;
    tiles: Tile[];
    pathFinder?: MapPathFinder;
  }) {
    this.width = options.width;
    this.height = options.height;
    this.tiles = options.tiles;
    this.pathFinder = options.pathFinder;
  }

  static createFlat(options: { width: number; height: number }): GameMap {
    return new GameMap({
      width: options.width,
      height: options.height,
      tiles: Array.from({ length: options.width * options.height }, () => ({
        terrain: "plain",
      })),
    });
  }

  tileAt(x: number, y: number): Tile | undefined {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return undefined;
    }
    return this.tiles[y * this.width + x];
  }

  /**
   * Port of upstream `RebuildRegions`.
   * Role: Rebuilds the map pathfinding regions.
   * Upstream: zmap.h:261
   */
  rebuildRegions(): void {
    this.pathFinder?.rebuildRegions();
  }

  /**
   * Port of upstream `SetImpassable`.
   * Role: Updates pathfinding blockage flags for a map coordinate.
   * Upstream: zmap.h:255-256
   */
  setImpassable(
    x: number,
    y: number,
    impassable = true,
    destroyable = false,
  ): void {
    this.pathFinder?.setImpassable(x, y, impassable, destroyable);
  }

  /**
   * Port of upstream `WithinImpassable`.
   * Role: Checks whether a rectangular unit area intersects impassable terrain.
   * Upstream: zmap.h:257-258
   */
  withinImpassable(
    x: number,
    y: number,
    width: number,
    height: number,
    isRobot: boolean,
  ): WithinImpassableResult {
    return (
      this.pathFinder?.withinImpassable(x, y, width, height, isRobot) ?? {
        within: false,
        stopX: x,
        stopY: y,
      }
    );
  }
}
