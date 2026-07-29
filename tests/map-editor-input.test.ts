import { describe, expect, it } from "vitest";
import {
  MAP_EDITOR_INPUT_KEYS,
  type MapEditorModifierKeyState,
  type MapEditorScrollableMap,
  type MapEditorScrollState,
  isControlDown,
  isShiftDown,
  processMapEditorButtonUnpressed,
  processMapEditorScroll,
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

function createScrollState(
  overrides: Partial<MapEditorScrollState> = {},
): MapEditorScrollState {
  return {
    upDown: false,
    downDown: false,
    rightDown: false,
    leftDown: false,
    lastVerticalScrollTime: 10,
    lastHorizontalScrollTime: 10,
    verticalScrollOverflow: 0,
    horizontalScrollOverflow: 0,
    ...overrides,
  };
}

function createScrollableMap(): {
  map: MapEditorScrollableMap;
  calls: Array<[string, number]>;
} {
  const calls: Array<[string, number]> = [];

  return {
    map: {
      shiftViewUp(amount: number) {
        calls.push(["up", amount]);
        return true;
      },
      shiftViewDown(amount: number) {
        calls.push(["down", amount]);
        return true;
      },
      shiftViewRight(amount: number) {
        calls.push(["right", amount]);
        return true;
      },
      shiftViewLeft(amount: number) {
        calls.push(["left", amount]);
        return true;
      },
    },
    calls,
  };
}

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

  it("ports ProcessScroll as no-op until accumulated scroll reaches one pixel", () => {
    const { map, calls } = createScrollableMap();
    const state = createScrollState({
      upDown: true,
      rightDown: true,
      verticalScrollOverflow: 0.25,
      horizontalScrollOverflow: 0.25,
    });

    const nextState = processMapEditorScroll(state, map, 10.0005);

    expect(nextState).toBe(state);
    expect(calls).toEqual([]);
  });

  it("ports ProcessScroll by cancelling opposite directions on each axis", () => {
    const { map, calls } = createScrollableMap();
    const state = createScrollState({
      upDown: true,
      downDown: true,
      rightDown: true,
      leftDown: true,
    });

    const nextState = processMapEditorScroll(state, map, 11);

    expect(nextState).toBe(state);
    expect(calls).toEqual([]);
  });

  it("ports ProcessScroll as upward and rightward editor camera movement", () => {
    const { map, calls } = createScrollableMap();
    const state = createScrollState({
      upDown: true,
      rightDown: true,
      verticalScrollOverflow: 0.25,
      horizontalScrollOverflow: 0.5,
    });

    const nextState = processMapEditorScroll(state, map, 10.01);

    expect(calls).toEqual([
      ["up", 8],
      ["right", 8],
    ]);
    expect(nextState).toMatchObject({
      upDown: true,
      downDown: false,
      rightDown: true,
      leftDown: false,
      lastVerticalScrollTime: 10.01,
      lastHorizontalScrollTime: 10.01,
    });
    expect(nextState.verticalScrollOverflow).toBeCloseTo(0.25);
    expect(nextState.horizontalScrollOverflow).toBeCloseTo(0.5);
  });

  it("ports ProcessScroll as downward and leftward editor camera movement", () => {
    const { map, calls } = createScrollableMap();
    const state = createScrollState({
      downDown: true,
      leftDown: true,
      verticalScrollOverflow: 0.75,
      horizontalScrollOverflow: 0.125,
    });

    const nextState = processMapEditorScroll(state, map, 10.02);

    expect(calls).toEqual([
      ["down", 16],
      ["left", 16],
    ]);
    expect(nextState).toMatchObject({
      upDown: false,
      downDown: true,
      rightDown: false,
      leftDown: true,
      lastVerticalScrollTime: 10.02,
      lastHorizontalScrollTime: 10.02,
    });
    expect(nextState.verticalScrollOverflow).toBeCloseTo(0.75);
    expect(nextState.horizontalScrollOverflow).toBeCloseTo(0.125);
  });
});
