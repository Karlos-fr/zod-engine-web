import { describe, expect, it } from "vitest";
import {
  handleMainMenuMultiplayerWidgetEvent,
  setupMainMenuMultiplayerLayout,
  ZGMM_MULTIPLAYER_HEADER_GUARD_PORTED,
} from "../src/ui/MainMenuMultiplayer";

describe("main menu multiplayer", () => {
  it("adapts the gmm_multiplayer.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/ui/MainMenuMultiplayer");
    const secondImport = await import("../src/ui/MainMenuMultiplayer");

    expect(ZGMM_MULTIPLAYER_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZGMM_MULTIPLAYER_HEADER_GUARD_PORTED).toBe(
      firstImport.ZGMM_MULTIPLAYER_HEADER_GUARD_PORTED,
    );
  });

  it("ports GMMMultiplayer HandleWidgetEvent as an empty widget hook", () => {
    const widget = { touched: false };

    expect(handleMainMenuMultiplayerWidgetEvent(3, widget)).toBeUndefined();
    expect(widget).toEqual({ touched: false });
  });

  it("ports GMMMultiplayer SetupLayout1 as host text-box layout", () => {
    const calls: unknown[] = [];
    const hostTextBox = {
      setCoords: (x: number, y: number) => calls.push(["coords", x, y]),
      setDimensions: (width: number, height: number) =>
        calls.push(["dimensions", width, height]),
      setSelected: (selected: boolean) => calls.push(["selected", selected]),
      setText: (text: string) => calls.push(["text", text]),
    };
    const state = {
      width: 180,
      height: 0,
      hostTextBox,
      widgetList: [] as unknown[],
      updateDimensions: () => calls.push(["updateDimensions"]),
    };

    setupMainMenuMultiplayerLayout(state);

    expect(calls).toEqual([
      ["coords", 5, 23],
      ["dimensions", 170, 14],
      ["selected", true],
      ["text", "test"],
      ["updateDimensions"],
    ]);
    expect(state.height).toBe(42);
    expect(state.widgetList).toEqual([hostTextBox]);
  });
});
