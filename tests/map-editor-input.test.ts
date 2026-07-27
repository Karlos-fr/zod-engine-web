import { describe, expect, it } from "vitest";
import { isControlDown, isShiftDown } from "../src/world/MapEditorInput";

describe("map editor input", () => {
  it("ports ctrl_down as true when left control is pressed", () => {
    expect(
      isControlDown({
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
        leftControlDown: true,
        rightControlDown: true,
        leftShiftDown: false,
        rightShiftDown: false,
      }),
    ).toBe(false);
  });
});
