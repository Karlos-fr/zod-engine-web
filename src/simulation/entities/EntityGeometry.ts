/**
 * Ported from Zod Engine.
 * Upstream: zobject.h
 */

import type { Vector2 } from "../../world/Vector2";

/**
 * Port of upstream `GetCenterCords`.
 * Role: Returns the center coordinates for entity targeting and selection.
 * Ledger: FUN-03D079
 * Upstream: zobject.h:408
 */
export function getCenterCoordinates(centerX: number, centerY: number): Vector2 {
  return { x: centerX, y: centerY };
}
