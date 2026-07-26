import type { Vector2 } from "./Vector2";
import type { GameMap } from "./GameMap";

export class NavigationGrid {
  constructor(private readonly map: GameMap) {}

  isWalkable(point: Vector2): boolean {
    const tile = this.map.tileAt(Math.floor(point.x), Math.floor(point.y));
    return tile?.terrain === "plain";
  }
}
