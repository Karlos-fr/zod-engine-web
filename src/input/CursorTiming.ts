/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - Files: cursor.cpp, cursor.h
 * - Symbols: time_inc, _CURSOR_H_
 * - Ledger: CON-DC7963, MAC-C7392C
 *
 * Porting notes:
 * - Cursor animation timing is represented as named input constants.
 * - The C `_CURSOR_H_` header guard is replaced by ES module boundaries.
 */

/**
 * Port of upstream `time_inc`.
 *
 * Role:
 * - Defines the seconds between cursor animation frame advances.
 *
 * Ledger: CON-DC7963
 * Upstream: cursor.cpp:206
 *
 * Adaptation:
 * - Replaces the C++ local constant with a named TypeScript export for future
 *   cursor animation ports.
 */
export const CURSOR_FRAME_INTERVAL_SECONDS = 0.2;
