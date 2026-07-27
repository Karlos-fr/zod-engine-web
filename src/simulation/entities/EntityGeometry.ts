import type { Vector2 } from "../../world/Vector2";

export function getCenterCoordinates(centerX: number, centerY: number): Vector2 {
  return { x: centerX, y: centerY };
}
