/**
 * Upstream: cursor.cpp, cursor.h
 */

import { TeamType } from "../simulation/SimulationConstants";

/**
 * Port of upstream `time_inc`.
 * Role: Defines the seconds between cursor animation frame advances.
 * Upstream: cursor.cpp:206
 */
export const CURSOR_FRAME_INTERVAL_SECONDS = 0.2;

/**
 * Port of upstream `cursor_type`.
 * Role: Identifies the cursor sprite and interaction feedback mode.
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

/**
 * Port of upstream `ZCursor` current cursor field.
 * Role: Holds the cursor sprite and interaction feedback mode currently selected.
 * Upstream: cursor.h:26
 */
export type CursorSelectionState = {
  currentCursor: CursorType;
};

/**
 * Port of upstream `ZCursor` owner and current surface fields.
 * Role: Holds the active team palette, animation frame, and selected cursor surface.
 * Upstream: cursor.h:25-29
 */
export type CursorSurfaceState<TSurface = unknown> = CursorSelectionState & {
  owner: TeamType | number;
  cursorFrameIndex: number;
  currentSurface: TSurface | null;
};

/**
 * Port of upstream `ZCursor::Process` mutable fields.
 * Role: Holds cursor animation timing and the active surface reference.
 * Upstream: cursor.cpp:204-216
 */
export type CursorProcessState<TSurface = unknown> =
  CursorSurfaceState<TSurface> & {
    nextProcessTime: number;
  };

export type CursorSurfaceTable<TSurface> = TSurface[][][];

/**
 * Port of upstream `ZCursor::GetCursor`.
 * Role: Returns the currently selected cursor sprite and interaction feedback mode.
 * Upstream: cursor.cpp:158-161
 */
export function getCursor(state: CursorSelectionState): CursorType {
  return state.currentCursor;
}

/**
 * Port of upstream `ZCursor::SetCursor`.
 * Role: Stores the active cursor type and refreshes the current surface reference.
 * Upstream: cursor.cpp:152-156
 */
export function setCursor<TSurface>(
  state: CursorSurfaceState<TSurface>,
  cursor: CursorType,
  surfaces: CursorSurfaceTable<TSurface>,
): void {
  state.currentCursor = cursor;
  state.currentSurface =
    surfaces[state.currentCursor]?.[state.owner]?.[state.cursorFrameIndex] ?? null;
}

/**
 * Port of upstream `ZCursor::SetTeam`.
 * Role: Stores the active cursor team palette and refreshes the current surface reference.
 * Upstream: cursor.cpp:163-167
 */
export function setCursorTeam<TSurface>(
  state: CursorSurfaceState<TSurface>,
  owner: TeamType | number,
  surfaces: CursorSurfaceTable<TSurface>,
): void {
  state.owner = owner;
  state.currentSurface =
    surfaces[state.currentCursor]?.[state.owner]?.[state.cursorFrameIndex] ?? null;
}

/**
 * Port of upstream `ZCursor::Process`.
 * Role: Advances cursor animation frames and refreshes the active cursor surface.
 * Upstream: cursor.cpp:204-216
 */
export function processCursor<TSurface>(
  state: CursorProcessState<TSurface>,
  currentTime: number,
  surfaces: CursorSurfaceTable<TSurface>,
): void {
  if (currentTime < state.nextProcessTime) return;

  state.nextProcessTime = currentTime + CURSOR_FRAME_INTERVAL_SECONDS;
  state.cursorFrameIndex += 1;

  if (state.cursorFrameIndex >= 4) {
    state.cursorFrameIndex = 0;
  }

  state.currentSurface =
    surfaces[state.currentCursor]?.[state.owner]?.[state.cursorFrameIndex] ?? null;
}
