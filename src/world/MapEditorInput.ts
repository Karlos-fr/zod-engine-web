/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - File: map_editor.cpp
 * - Symbols: ctrl_down, shift_down, process_button_unpressed
 * - Ledger: FUN-5AFC37, FUN-615E08, FUN-9CD6AB
 *
 * Porting notes:
 * - C++ map editor keyboard globals are represented as explicit input state.
 */

/**
 * Input state consumed by the ported map editor keyboard helpers.
 *
 * Role:
 * - Stores the pressed state of directional and modifier keys used by the map
 *   editor.
 *
 * Ledger: FUN-5AFC37, FUN-615E08, FUN-9CD6AB
 * Upstream: map_editor.cpp:231-232, map_editor.cpp:698-719
 *
 * Adaptation:
 * - Replaces the upstream `up_down`, `down_down`, `left_down`, `right_down`,
 *   `lctrl_down`, `rctrl_down`, `lshift_down`, and `rshift_down` globals with
 *   explicit data passed to helper functions.
 */
export type MapEditorModifierKeyState = {
  upDown: boolean;
  downDown: boolean;
  rightDown: boolean;
  leftDown: boolean;
  leftControlDown: boolean;
  rightControlDown: boolean;
  leftShiftDown: boolean;
  rightShiftDown: boolean;
};

/**
 * SDL key code constants consumed by the ported map editor keyboard switch.
 *
 * Role:
 * - Names the numeric key codes used by `process_button_unpressed` without
 *   leaking SDL-specific identifiers through caller code.
 *
 * Ledger: FUN-9CD6AB
 * Upstream: map_editor.cpp:702-717
 *
 * Notes:
 * - Arrow key values are the literal SDL codes present in upstream comments.
 * - Modifier values use stable DOM KeyboardEvent.code names for the browser
 *   input adapter.
 */
export const MAP_EDITOR_INPUT_KEYS = {
  arrowUp: 273,
  arrowDown: 274,
  arrowRight: 275,
  arrowLeft: 276,
  leftControl: "ControlLeft",
  rightControl: "ControlRight",
  rightShift: "ShiftRight",
  leftShift: "ShiftLeft",
} as const;

/**
 * Browser-side key identifier accepted by the ported map editor key release
 * handler.
 *
 * Role:
 * - Captures the SDL numeric arrow codes and adapted browser modifier key
 *   codes handled by `process_button_unpressed`.
 *
 * Ledger: FUN-9CD6AB
 * Upstream: map_editor.cpp:702-717
 *
 * Adaptation:
 * - SDL modifier constants are represented with DOM `KeyboardEvent.code`
 *   strings.
 */
export type MapEditorInputKeyCode =
  | 273
  | 274
  | 275
  | 276
  | "ControlLeft"
  | "ControlRight"
  | "ShiftRight"
  | "ShiftLeft";

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

/**
 * Port of upstream `process_button_unpressed`.
 *
 * Role:
 * - Clears the stored pressed state for map editor movement and modifier keys
 *   when the matching key is released.
 *
 * Ledger: FUN-9CD6AB
 * Upstream: map_editor.cpp:698-719
 *
 * Adaptation:
 * - Returns updated input state instead of mutating C++ file-scope globals.
 * - Keeps the upstream SDL arrow codes and maps SDL modifier constants to DOM
 *   `KeyboardEvent.code` names.
 */
export function processMapEditorButtonUnpressed(
  state: MapEditorModifierKeyState,
  keyCode: MapEditorInputKeyCode,
): MapEditorModifierKeyState {
  switch (keyCode) {
    case MAP_EDITOR_INPUT_KEYS.arrowUp:
      return { ...state, upDown: false };
    case MAP_EDITOR_INPUT_KEYS.arrowDown:
      return { ...state, downDown: false };
    case MAP_EDITOR_INPUT_KEYS.arrowRight:
      return { ...state, rightDown: false };
    case MAP_EDITOR_INPUT_KEYS.arrowLeft:
      return { ...state, leftDown: false };
    case MAP_EDITOR_INPUT_KEYS.leftControl:
      return { ...state, leftControlDown: false };
    case MAP_EDITOR_INPUT_KEYS.rightControl:
      return { ...state, rightControlDown: false };
    case MAP_EDITOR_INPUT_KEYS.rightShift:
      return { ...state, rightShiftDown: false };
    case MAP_EDITOR_INPUT_KEYS.leftShift:
      return { ...state, leftShiftDown: false };
  }
}
