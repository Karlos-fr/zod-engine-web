import type { Tile } from "./Tile";

export class GameMap {
  readonly width: number;
  readonly height: number;
  readonly tiles: Tile[];

  constructor(options: { width: number; height: number; tiles: Tile[] }) {
    this.width = options.width;
    this.height = options.height;
    this.tiles = options.tiles;
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
}
