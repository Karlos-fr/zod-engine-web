/**
 * Upstream: map_editor.cpp
 */

/**
 * Input state consumed by the ported map editor keyboard helpers.
 * Role: Stores the pressed state of directional and modifier keys for the map editor.
 * Upstream: map_editor.cpp:231-232, map_editor.cpp:698-719
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
 * SDL key code constants for the ported map editor keyboard switch.
 * Role: Names the numeric key codes for map editor key release handling.
 * Upstream: map_editor.cpp:702-717
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
 * Browser-side key identifier for the ported map editor key release
 * handler.
 * Role: Captures the SDL numeric arrow codes and adapted browser modifier key codes handled by `process_button_unpressed`.
 * Upstream: map_editor.cpp:702-717
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
 * Role: Reports whether either Control key is currently pressed for map editor commands.
 * Upstream: map_editor.cpp:231
 */
export function isControlDown(state: MapEditorModifierKeyState): boolean {
  return state.rightControlDown || state.leftControlDown;
}

/**
 * Port of upstream `shift_down`.
 * Role: Reports whether either Shift key is currently pressed for map editor commands.
 * Upstream: map_editor.cpp:232
 */
export function isShiftDown(state: MapEditorModifierKeyState): boolean {
  return state.leftShiftDown || state.rightShiftDown;
}

/**
 * Port of upstream `process_button_unpressed`.
 * Role: Clears the stored pressed state for map editor movement and modifier keys when the matching key is released.
 * Upstream: map_editor.cpp:698-719
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
