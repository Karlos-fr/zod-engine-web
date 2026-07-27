export class FloodFillNode {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export enum PathTileType {
  Normal = 0,
  Impassable = 1,
  Water = 2,
  Road = 3,
  Max = 4,
}

/**
 * Navigation lists currently live on the single simulation thread, so
 * acquiring the upstream SDL mutex has no browser-side work to perform.
 */
export function lockList(): void {
  // Intentionally empty until navigation moves to a Web Worker.
}

export function unlockList(): void {
  // Intentionally empty until navigation moves to a Web Worker.
}

export type MapPathfindingTile = {
  sideWeight: number;
  diagonalWeight: number;
  passable: boolean;
};
