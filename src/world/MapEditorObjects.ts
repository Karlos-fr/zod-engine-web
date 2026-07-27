/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - File: map_editor.cpp
 * - Symbols: object_exists_at
 * - Ledger: FUN-A5739D
 *
 * Porting notes:
 * - The upstream `edit_map.GetObjectList()` dependency is represented as an
 *   explicit readonly object list supplied by map editor state.
 */

import type { MapObject } from "./MapFormat";

/**
 * Port of upstream `object_exists_at`.
 *
 * Role:
 * - Reports whether the edited map contains an object at the requested tile
 *   coordinate.
 *
 * Ledger: FUN-A5739D
 * Upstream: map_editor.cpp:2556-2563
 *
 * Adaptation:
 * - Uses explicit `MapObject` data instead of reading the C++ `edit_map`
 *   global.
 */
export function objectExistsAt(
  objects: readonly MapObject[],
  x: number,
  y: number,
): boolean {
  return objects.some((object) => object.x === x && object.y === y);
}
