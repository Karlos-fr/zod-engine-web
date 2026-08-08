/**
 * Upstream: cursor.cpp, cursor.h
 */

import { TeamType } from "../simulation/SimulationConstants";
import type { SurfaceBlitRegion } from "../rendering/SurfacePixels";

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

export type CursorRenderSurface<TBaseSurface> = {
  getBaseSurface(): TBaseSurface | null;
};

/**
 * Replacement for upstream `ZMap::GetBlitInfo` dependency in cursor rendering.
 * Role: Clips a cursor base surface against the current map viewport.
 * Upstream: cursor.cpp:190
 */
export type CursorRenderMap<TBaseSurface> = {
  getBlitInfo(
    surface: TBaseSurface | null,
    x: number,
    y: number,
  ): SurfaceBlitRegion | null;
};

/**
 * Replacement for upstream `ZCursor::Render` blit operation.
 * Role: Describes either a clipped cursor blit or an unrestricted cursor destination.
 * Upstream: cursor.cpp:190-199
 */
export type CursorRenderCommand<TSurface> =
  | {
      kind: "restricted";
      surface: TSurface;
      region: SurfaceBlitRegion;
    }
  | {
      kind: "unrestricted";
      surface: TSurface;
      x: number;
      y: number;
    };

/**
 * Port of upstream `ZPlayer::SetPcursor` dependency surface.
 * Role: Holds the active player cursor and the preview cursor updated from it.
 * Upstream: zplayer.cpp:2024-2051
 */
export type PlayerPreviewCursorState<TSurface = unknown> = {
  cursor: CursorSelectionState;
  previewCursor: CursorSurfaceState<TSurface>;
};

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

/**
 * Port of upstream `ZPlayer::SetPcursor`.
 * Role: Maps the active command cursor to its preview/feedback cursor variant.
 * Upstream: zplayer.cpp:2022-2054
 */
export function setPlayerPreviewCursor<TSurface>(
  state: PlayerPreviewCursorState<TSurface>,
  surfaces: CursorSurfaceTable<TSurface>,
): void {
  switch (getCursor(state.cursor)) {
    case CursorType.Place:
      setCursor(state.previewCursor, CursorType.Placed, surfaces);
      break;
    case CursorType.Attack:
      setCursor(state.previewCursor, CursorType.Attacked, surfaces);
      break;
    case CursorType.Grab:
      setCursor(state.previewCursor, CursorType.Grabbed, surfaces);
      break;
    case CursorType.Grenade:
      setCursor(state.previewCursor, CursorType.Grenaded, surfaces);
      break;
    case CursorType.Repair:
      setCursor(state.previewCursor, CursorType.Repaired, surfaces);
      break;
    case CursorType.Enter:
      setCursor(state.previewCursor, CursorType.Entered, surfaces);
      break;
    case CursorType.Exit:
      setCursor(state.previewCursor, CursorType.Exited, surfaces);
      break;
    case CursorType.Cannon:
      setCursor(state.previewCursor, CursorType.Cannoned, surfaces);
      break;
    default:
      setCursor(state.previewCursor, CursorType.Placed, surfaces);
      break;
  }
}

/**
 * Replacement for upstream `ZCursor::Render`.
 * Role: Builds a cursor blit command with upstream cursor-offset and optional map clipping.
 * Upstream: cursor.cpp:169-202
 */
export function renderCursor<TSurface extends CursorRenderSurface<TBaseSurface>, TBaseSurface>(
  state: CursorSurfaceState<TSurface>,
  map: CursorRenderMap<TBaseSurface>,
  x: number,
  y: number,
  restrictToMap = false,
): CursorRenderCommand<TSurface> | null {
  const surface = state.currentSurface;
  if (!surface) return null;

  const xShift = state.currentCursor > CursorType.Cursor ? -8 : 0;
  const yShift = state.currentCursor > CursorType.Cursor ? -8 : 0;
  const destinationX = x + xShift;
  const destinationY = y + yShift;

  if (restrictToMap) {
    const region = map.getBlitInfo(
      surface.getBaseSurface(),
      destinationX,
      destinationY,
    );
    if (!region) return null;

    return {
      kind: "restricted",
      surface,
      region,
    };
  }

  return {
    kind: "unrestricted",
    surface,
    x: destinationX,
    y: destinationY,
  };
}
