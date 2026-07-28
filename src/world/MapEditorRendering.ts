import {
  MINIMAP_MAX_HEIGHT_PIXELS,
  MINIMAP_MAX_WIDTH_PIXELS,
} from "./MiniMap";

/**
 * Ported from Zod Engine.
 * Upstream: map_editor.cpp
 */

/**
 * Port of upstream `SEP_SHIFT_X`.
 * Role: Defines the fixed horizontal pixel offset used to position the map editor separator panel.
 * Ledger: MAC-89DEB3
 * Upstream: map_editor.cpp:61
 */
export const MAP_EDITOR_SEPARATOR_SHIFT_X_PIXELS = 320;

/**
 * Port of upstream `SEP_WIDTH`.
 * Role: Defines the fixed pixel width of the map editor separator panel.
 * Ledger: MAC-60B442
 * Upstream: map_editor.cpp:62
 */
export const MAP_EDITOR_SEPARATOR_WIDTH_PIXELS = 16;

/**
 * Port of upstream `MAP_SHIFT_X`.
 * Role: Defines the left pixel coordinate where the editable map area begins.
 * Ledger: MAC-0A4EFD
 * Upstream: map_editor.cpp:63
 */
export const MAP_EDITOR_MAP_SHIFT_X_PIXELS =
  MAP_EDITOR_SEPARATOR_SHIFT_X_PIXELS + MAP_EDITOR_SEPARATOR_WIDTH_PIXELS;

/**
 * Port of upstream `MINIMAP_X`.
 * Role: Defines the fixed left pixel coordinate of the map editor minimap.
 * Ledger: MAC-D25A25
 * Upstream: map_editor.cpp:64
 */
export const MAP_EDITOR_MINIMAP_X_PIXELS = 5;

/**
 * Port of upstream `MINIMAP_Y`.
 * Role: Defines the fixed top pixel coordinate of the map editor minimap.
 * Ledger: MAC-523C93
 * Upstream: map_editor.cpp:65
 */
export const MAP_EDITOR_MINIMAP_Y_PIXELS = 400;

/**
 * Port of upstream `within_minimap`.
 * Role: Reports whether a point is inside the map editor minimap hit area.
 * Ledger: FUN-CF872B
 * Upstream: map_editor.cpp:958-961
 */
export function isWithinMapEditorMiniMap(x: number, y: number): boolean {
  return (
    x > MAP_EDITOR_MINIMAP_X_PIXELS &&
    x < MAP_EDITOR_MINIMAP_X_PIXELS + MINIMAP_MAX_WIDTH_PIXELS &&
    y > MAP_EDITOR_MINIMAP_Y_PIXELS &&
    y < MAP_EDITOR_MINIMAP_Y_PIXELS + MINIMAP_MAX_HEIGHT_PIXELS
  );
}

/**
 * Port of upstream `draw_seperator`.
 * Role: Preserves the map editor separator rendering hook, which currently only presents the SDL screen when requested.
 * Ledger: FUN-95674C
 * Upstream: map_editor.cpp:1769-1773
 */
export function drawMapEditorSeparator(
  flip: boolean,
  presentScreen: () => void = () => undefined,
): void {
  if (flip) {
    presentScreen();
  }
}
