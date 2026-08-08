import { describe, expect, it } from "vitest";
import {
  setGuiWindowCoords,
  type GuiWindowCoordinateState,
} from "../src/ui/GuiWindow";

describe("gui window", () => {
  it("ports ZGuiWindow SetCords as centered placement", () => {
    const state: GuiWindowCoordinateState = {
      x: 0,
      y: 0,
      width: 120,
      height: 80,
    };

    setGuiWindowCoords(state, 200, 140);

    expect(state).toEqual({
      x: 140,
      y: 100,
      width: 120,
      height: 80,
    });
  });

  it("ports ZGuiWindow SetCords minimum viewport margin clamp", () => {
    const state: GuiWindowCoordinateState = {
      x: 100,
      y: 100,
      width: 120,
      height: 80,
    };

    setGuiWindowCoords(state, 40, 30);

    expect(state).toEqual({
      x: 16,
      y: 16,
      width: 120,
      height: 80,
    });
  });
});
