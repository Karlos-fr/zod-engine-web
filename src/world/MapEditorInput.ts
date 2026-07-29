/**
 * Upstream: map_editor.cpp
 */

import { MAP_EDITOR_VIEW_SHIFT_SPEED } from "./WorldConstants";

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
 * Port of upstream map editor scroll state globals.
 * Role: Stores directional key state plus fractional scroll carry for editor camera movement.
 * Upstream: map_editor.cpp:633-696
 */
export type MapEditorScrollState = Pick<
  MapEditorModifierKeyState,
  "upDown" | "downDown" | "rightDown" | "leftDown"
> & {
  lastVerticalScrollTime: number;
  lastHorizontalScrollTime: number;
  verticalScrollOverflow: number;
  horizontalScrollOverflow: number;
};

/**
 * Port of upstream `edit_map` scroll dependency surface.
 * Role: Receives map editor camera movement requests produced by `ProcessScroll`.
 * Upstream: map_editor.cpp:650, map_editor.cpp:664, map_editor.cpp:679, map_editor.cpp:693
 */
export type MapEditorScrollableMap = {
  shiftViewUp(amount: number): boolean;
  shiftViewDown(amount: number): boolean;
  shiftViewRight(amount: number): boolean;
  shiftViewLeft(amount: number): boolean;
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

function processMapEditorAxisScroll(
  timeDifference: number,
  overflow: number,
): { amount: number; overflow: number } | null {
  const shift = timeDifference * MAP_EDITOR_VIEW_SHIFT_SPEED + overflow;
  if (shift < 1) return null;

  const amount = Math.trunc(shift);
  return {
    amount,
    overflow: shift - amount,
  };
}

/**
 * Port of upstream `ProcessScroll`.
 * Role: Applies pressed directional keys to the map editor camera while carrying sub-pixel scroll overflow.
 * Upstream: map_editor.cpp:633-696
 */
export function processMapEditorScroll(
  state: MapEditorScrollState,
  editMap: MapEditorScrollableMap,
  theTime: number,
): MapEditorScrollState {
  let nextState = state;

  if (state.upDown && !state.downDown) {
    const scroll = processMapEditorAxisScroll(
      theTime - state.lastVerticalScrollTime,
      state.verticalScrollOverflow,
    );

    if (scroll) {
      editMap.shiftViewUp(scroll.amount);
      nextState = {
        ...nextState,
        lastVerticalScrollTime: theTime,
        verticalScrollOverflow: scroll.overflow,
      };
    }
  } else if (!state.upDown && state.downDown) {
    const scroll = processMapEditorAxisScroll(
      theTime - state.lastVerticalScrollTime,
      state.verticalScrollOverflow,
    );

    if (scroll) {
      editMap.shiftViewDown(scroll.amount);
      nextState = {
        ...nextState,
        lastVerticalScrollTime: theTime,
        verticalScrollOverflow: scroll.overflow,
      };
    }
  }

  if (state.rightDown && !state.leftDown) {
    const scroll = processMapEditorAxisScroll(
      theTime - state.lastHorizontalScrollTime,
      state.horizontalScrollOverflow,
    );

    if (scroll) {
      editMap.shiftViewRight(scroll.amount);
      nextState = {
        ...nextState,
        lastHorizontalScrollTime: theTime,
        horizontalScrollOverflow: scroll.overflow,
      };
    }
  } else if (!state.rightDown && state.leftDown) {
    const scroll = processMapEditorAxisScroll(
      theTime - state.lastHorizontalScrollTime,
      state.horizontalScrollOverflow,
    );

    if (scroll) {
      editMap.shiftViewLeft(scroll.amount);
      nextState = {
        ...nextState,
        lastHorizontalScrollTime: theTime,
        horizontalScrollOverflow: scroll.overflow,
      };
    }
  }

  return nextState;
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
