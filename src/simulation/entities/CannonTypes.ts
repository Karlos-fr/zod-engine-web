/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - File: cgatling.cpp
 * - Symbols: unit_x, unit_y
 * - Ledger: CON-035582, CON-8E48FD
 *
 * Porting notes:
 * - Cannon render offsets are represented as named constants.
 */

/**
 * Port of upstream `unit_x` from `CGatling`.
 *
 * Role:
 * - Defines the x offset of the gatling cannon unit render source.
 *
 * Ledger: CON-035582
 * Upstream: cgatling.cpp:91, cgatling.cpp:202
 *
 * Notes:
 * - Unit is source image pixels.
 * - The same upstream local constant appears in both gatling cannon render and
 *   process code with the same value.
 */
export const GATLING_CANNON_UNIT_X_PIXELS = 0;

/**
 * Port of upstream `unit_y` from `CGatling`.
 *
 * Role:
 * - Defines the y offset of the gatling cannon unit render source.
 *
 * Ledger: CON-8E48FD
 * Upstream: cgatling.cpp:92, cgatling.cpp:203
 *
 * Notes:
 * - Unit is source image pixels.
 * - The same upstream local constant appears in both gatling cannon render and
 *   process code with the same value.
 */
export const GATLING_CANNON_UNIT_Y_PIXELS = -7;
