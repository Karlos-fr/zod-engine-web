/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - File: map_editor.cpp
 * - Symbols: SEP_SHIFT_X, SEP_WIDTH, MINIMAP_X, MINIMAP_Y, draw_seperator
 * - Ledger: MAC-89DEB3, MAC-60B442, MAC-D25A25, MAC-523C93, FUN-95674C
 *
 * Porting notes:
 * - SDL screen flipping is represented as an explicit render-present callback.
 * - Map editor fixed screen coordinates are exposed as named pixel constants.
 */

/**
 * Port of upstream `SEP_SHIFT_X`.
 *
 * Role:
 * - Defines the fixed horizontal pixel offset used to position the map editor
 *   separator panel.
 *
 * Ledger: MAC-89DEB3
 * Upstream: map_editor.cpp:61
 *
 * Adaptation:
 * - Renamed to expose the screen pixel unit and map editor ownership.
 */
export const MAP_EDITOR_SEPARATOR_SHIFT_X_PIXELS = 320;

/**
 * Port of upstream `SEP_WIDTH`.
 *
 * Role:
 * - Defines the fixed pixel width of the map editor separator panel.
 *
 * Ledger: MAC-60B442
 * Upstream: map_editor.cpp:62
 *
 * Adaptation:
 * - Renamed to expose the screen pixel unit and map editor ownership.
 */
export const MAP_EDITOR_SEPARATOR_WIDTH_PIXELS = 16;

/**
 * Port of upstream `MINIMAP_X`.
 *
 * Role:
 * - Defines the fixed left pixel coordinate of the map editor minimap.
 *
 * Ledger: MAC-D25A25
 * Upstream: map_editor.cpp:64
 *
 * Adaptation:
 * - Renamed to expose the screen pixel unit and map editor ownership.
 */
export const MAP_EDITOR_MINIMAP_X_PIXELS = 5;

/**
 * Port of upstream `MINIMAP_Y`.
 *
 * Role:
 * - Defines the fixed top pixel coordinate of the map editor minimap.
 *
 * Ledger: MAC-523C93
 * Upstream: map_editor.cpp:65
 *
 * Adaptation:
 * - Renamed to expose the screen pixel unit and map editor ownership.
 */
export const MAP_EDITOR_MINIMAP_Y_PIXELS = 400;

/**
 * Port of upstream `draw_seperator`.
 *
 * Role:
 * - Preserves the map editor separator rendering hook, which currently only
 *   presents the SDL screen when requested.
 *
 * Ledger: FUN-95674C
 * Upstream: map_editor.cpp:1769-1773
 *
 * Adaptation:
 * - Keeps the upstream `seperator` spelling in documentation only.
 * - Replaces `SDL_Flip(screen)` with an optional callback supplied by browser
 *   rendering code.
 */
export function drawMapEditorSeparator(
  flip: boolean,
  presentScreen: () => void = () => undefined,
): void {
  if (flip) {
    presentScreen();
  }
}
