/**
 * Ported from Zod Engine.
 * Upstream: cursor.cpp, cursor.h
 */

/**
 * Port of upstream `time_inc`.
 * Role: Defines the seconds between cursor animation frame advances.
 * Ledger: CON-DC7963
 * Upstream: cursor.cpp:206
 */
export const CURSOR_FRAME_INTERVAL_SECONDS = 0.2;

/**
 * Port of upstream `cursor_type`.
 * Role: Identifies the cursor sprite and interaction feedback mode.
 * Ledger: ENU-CCA299
 * Upstream: constants.h:183-189
 */
export enum CursorType {
  Cursor = 0,
  Place = 1,
  Placed = 2,
  Attack = 3,
  Attacked = 4,
  Grab = 5,
  Grabbed = 6,
  Grenade = 7,
  Grenaded = 8,
  Repair = 9,
  Repaired = 10,
  Nono = 11,
  Cannon = 12,
  Cannoned = 13,
  Enter = 14,
  Entered = 15,
  Exit = 16,
  Exited = 17,
  MaxCursorTypes = 18,
}
