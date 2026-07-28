/**
 * Ported from Zod Engine.
 * Upstream: map_editor.cpp
 */

import type { MapObject } from "./MapFormat";

/**
 * Port of upstream `object_exists_at`.
 * Role: Reports whether the edited map contains an object at the requested tile coordinate.
 * Ledger: FUN-A5739D
 * Upstream: map_editor.cpp:2556-2563
 */
export function objectExistsAt(
  objects: readonly MapObject[],
  x: number,
  y: number,
): boolean {
  return objects.some((object) => object.x === x && object.y === y);
}
