/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - File: zmini_map.h
 * - Symbols: ToggleShowTerrain
 * - Ledger: FUN-94134A
 *
 * Porting notes:
 * - SDL minimap instance state is represented as explicit browser-side data.
 */

/**
 * Minimal state consumed by ported `ZMiniMap` display toggles.
 *
 * Role:
 * - Stores whether terrain rendering is enabled for the minimap overlay.
 *
 * Ledger: FUN-94134A
 * Upstream: zmini_map.h:24, zmini_map.h:32
 *
 * Adaptation:
 * - Represents the C++ `show_terrain` member as a boolean.
 */
export type MiniMapTerrainState = {
  showTerrain: boolean;
};

/**
 * Port of upstream `ToggleShowTerrain`.
 *
 * Role:
 * - Flips the minimap terrain visibility flag.
 *
 * Ledger: FUN-94134A
 * Upstream: zmini_map.h:24
 *
 * Adaptation:
 * - Returns updated state instead of mutating the `ZMiniMap` instance member.
 */
export function toggleMiniMapShowTerrain<TState extends MiniMapTerrainState>(
  state: TState,
): TState {
  return {
    ...state,
    showTerrain: !state.showTerrain,
  };
}
