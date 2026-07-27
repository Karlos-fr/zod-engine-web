/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - File: zobject.h
 * - Symbols: GetCenterCords
 * - Ledger: FUN-03D079
 *
 * Porting notes:
 * - C++ output references are represented with immutable return values.
 */

import type { Vector2 } from "../../world/Vector2";

/**
 * Port of upstream `GetCenterCords`.
 *
 * Role:
 * - Returns the center coordinates used by entity targeting and selection.
 *
 * Ledger: FUN-03D079
 * Upstream: zobject.h:408
 *
 * Notes:
 * - Returns a `Vector2` instead of mutating output reference arguments.
 */
export function getCenterCoordinates(centerX: number, centerY: number): Vector2 {
  return { x: centerX, y: centerY };
}
