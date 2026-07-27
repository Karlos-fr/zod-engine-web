import { describe, expect, it } from "vitest";
import {
  MAP_EDITOR_INPUT_KEYS,
  type MapEditorModifierKeyState,
  isControlDown,
  isShiftDown,
  processMapEditorButtonUnpressed,
} from "../src/world/MapEditorInput";

const pressedInputState: MapEditorModifierKeyState = {
  upDown: true,
  downDown: true,
  rightDown: true,
  leftDown: true,
  leftControlDown: true,
  rightControlDown: true,
  leftShiftDown: true,
  rightShiftDown: true,
};

describe("map editor input", () => {
  it("ports ctrl_down as true when left control is pressed", () => {
    expect(
      isControlDown({
        upDown: false,
        downDown: false,
        rightDown: false,
        leftDown: false,
        leftControlDown: true,
        rightControlDown: false,
        leftShiftDown: false,
        rightShiftDown: false,
      }),
    ).toBe(true);
  });

  it("ports ctrl_down as true when right control is pressed", () => {
    expect(
      isControlDown({
        upDown: false,
        downDown: false,
        rightDown: false,
        leftDown: false,
        leftControlDown: false,
        rightControlDown: true,
        leftShiftDown: false,
        rightShiftDown: false,
      }),
    ).toBe(true);
  });

  it("ports ctrl_down as false when neither control key is pressed", () => {
    expect(
      isControlDown({
        upDown: false,
        downDown: false,
        rightDown: false,
        leftDown: false,
        leftControlDown: false,
        rightControlDown: false,
        leftShiftDown: true,
        rightShiftDown: true,
      }),
    ).toBe(false);
  });

  it("ports shift_down as true when left shift is pressed", () => {
    expect(
      isShiftDown({
        upDown: false,
        downDown: false,
        rightDown: false,
        leftDown: false,
        leftControlDown: false,
        rightControlDown: false,
        leftShiftDown: true,
        rightShiftDown: false,
      }),
    ).toBe(true);
  });

  it("ports shift_down as true when right shift is pressed", () => {
    expect(
      isShiftDown({
        upDown: false,
        downDown: false,
        rightDown: false,
        leftDown: false,
        leftControlDown: false,
        rightControlDown: false,
        leftShiftDown: false,
        rightShiftDown: true,
      }),
    ).toBe(true);
  });

  it("ports shift_down as false when neither shift key is pressed", () => {
    expect(
      isShiftDown({
        upDown: false,
        downDown: false,
        rightDown: false,
        leftDown: false,
        leftControlDown: true,
        rightControlDown: true,
        leftShiftDown: false,
        rightShiftDown: false,
      }),
    ).toBe(false);
  });

  it.each([
    [MAP_EDITOR_INPUT_KEYS.arrowUp, "upDown"],
    [MAP_EDITOR_INPUT_KEYS.arrowDown, "downDown"],
    [MAP_EDITOR_INPUT_KEYS.arrowRight, "rightDown"],
    [MAP_EDITOR_INPUT_KEYS.arrowLeft, "leftDown"],
    [MAP_EDITOR_INPUT_KEYS.leftControl, "leftControlDown"],
    [MAP_EDITOR_INPUT_KEYS.rightControl, "rightControlDown"],
    [MAP_EDITOR_INPUT_KEYS.rightShift, "rightShiftDown"],
    [MAP_EDITOR_INPUT_KEYS.leftShift, "leftShiftDown"],
  ] as const)(
    "ports process_button_unpressed for %s",
    (keyCode, releasedField) => {
      const nextState = processMapEditorButtonUnpressed(
        pressedInputState,
        keyCode,
      );

      expect(nextState).toEqual({
        ...pressedInputState,
        [releasedField]: false,
      });
      expect(pressedInputState[releasedField]).toBe(true);
    },
  );
});
