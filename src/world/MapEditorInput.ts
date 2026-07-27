/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - File: map_editor.cpp
 * - Symbols: ctrl_down, shift_down
 * - Ledger: FUN-5AFC37, FUN-615E08
 *
 * Porting notes:
 * - C++ map editor keyboard globals are represented as explicit input state.
 */

/**
 * Input state consumed by the ported map editor keyboard helpers.
 *
 * Role:
 * - Stores the pressed state of modifier keys used by the map editor.
 *
 * Ledger: FUN-5AFC37, FUN-615E08
 * Upstream: map_editor.cpp:231-232
 *
 * Adaptation:
 * - Replaces the upstream `lctrl_down`, `rctrl_down`, `lshift_down`, and
 *   `rshift_down` globals with explicit data passed to helper functions.
 */
export type MapEditorModifierKeyState = {
  leftControlDown: boolean;
  rightControlDown: boolean;
  leftShiftDown: boolean;
  rightShiftDown: boolean;
};

/**
 * Port of upstream `ctrl_down`.
 *
 * Role:
 * - Reports whether either Control key is currently pressed for map editor
 *   commands.
 *
 * Ledger: FUN-5AFC37
 * Upstream: map_editor.cpp:231
 *
 * Adaptation:
 * - Uses explicit key state instead of reading C++ file-scope globals.
 */
export function isControlDown(state: MapEditorModifierKeyState): boolean {
  return state.rightControlDown || state.leftControlDown;
}

/**
 * Port of upstream `shift_down`.
 *
 * Role:
 * - Reports whether either Shift key is currently pressed for map editor
 *   commands.
 *
 * Ledger: FUN-615E08
 * Upstream: map_editor.cpp:232
 *
 * Adaptation:
 * - Uses explicit key state instead of reading C++ file-scope globals.
 */
export function isShiftDown(state: MapEditorModifierKeyState): boolean {
  return state.leftShiftDown || state.rightShiftDown;
}
