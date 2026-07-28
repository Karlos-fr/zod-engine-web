/**
 * Ported from Zod Engine.
 * Upstream: zmini_map.h
 */

/**
 * Port of upstream `_ZMINIMAP_H_`.
 * Role: Marks an upstream compile-time boundary.
 * Ledger: MAC-6C4569
 * Upstream: zmini_map.h:2
 */
export const ZMINIMAP_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `MINIMAP_H_MAX`.
 * Role: Defines the maximum source minimap height in pixels.
 * Ledger: MAC-0ACAEE
 * Upstream: zmini_map.h:12
 */
export const MINIMAP_MAX_HEIGHT_PIXELS = 89;

/**
 * Port of upstream `MINIMAP_W_MAX`.
 * Role: Defines the maximum source minimap width in pixels.
 * Ledger: MAC-2E4A0F
 * Upstream: zmini_map.h:11
 */
export const MINIMAP_MAX_WIDTH_PIXELS = 92;

/**
 * Minimal state consumed by ported `ZMiniMap` display toggles.
 * Role: Stores whether terrain rendering is enabled for the minimap overlay.
 * Ledger: FUN-E0BA90, FUN-94134A
 * Upstream: zmini_map.h:23-24, zmini_map.h:32
 */
export type MiniMapTerrainState = {
  showTerrain: boolean;
};

/**
 * Port of upstream `SetShowTerrain`.
 * Role: Sets the minimap terrain visibility flag to the requested value.
 * Ledger: FUN-E0BA90
 * Upstream: zmini_map.h:23
 */
export function setMiniMapShowTerrain<TState extends MiniMapTerrainState>(
  state: TState,
  showTerrain: boolean,
): TState {
  return {
    ...state,
    showTerrain,
  };
}

/**
 * Port of upstream `ToggleShowTerrain`.
 * Role: Flips the minimap terrain visibility flag.
 * Ledger: FUN-94134A
 * Upstream: zmini_map.h:24
 */
export function toggleMiniMapShowTerrain<TState extends MiniMapTerrainState>(
  state: TState,
): TState {
  return {
    ...state,
    showTerrain: !state.showTerrain,
  };
}
