import { isZero } from "../simulation/Common";

/**
 * Ported from Zod Engine.
 * Upstream: zsdl.cpp
 */

/**
 * Replacement for upstream `AngleFromLoc`.
 * Role: Converts a movement vector into a normalized clockwise degree angle.
 * Ledger: FUN-6B2841
 * Upstream: zsdl.cpp:154-178
 */
export function angleFromLocation(deltaX: number, deltaY: number): number {
  if (isZero(deltaX) && isZero(deltaY)) {
    return -1;
  }

  let angleRadians = Math.atan2(deltaY, deltaX);
  if (angleRadians < 0) {
    angleRadians += 3.14159 + 3.14159;
  }

  let angleDegrees = Math.trunc((180 * angleRadians) / 3.14159);
  while (angleDegrees >= 360) {
    angleDegrees -= 360;
  }
  while (angleDegrees < 0) {
    angleDegrees += 360;
  }

  return angleDegrees;
}
