import { describe, expect, it } from "vitest";
import {
  MAIN_MENU_BOTTOM_MARGIN_PIXELS,
  MAIN_MENU_SIDE_MARGIN_PIXELS,
  MAIN_MENU_TITLE_HEIGHT_PIXELS,
  MAIN_MENU_TOP_MARGIN_PIXELS,
  MainMenuEventType,
  MainMenuType,
  ZGUI_MAIN_MENU_BASE_HEADER_GUARD_PORTED,
} from "../src/ui/MainMenuBase";

describe("main menu base", () => {
  it("adapts the zgui_main_menu_base.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/ui/MainMenuBase");
    const secondImport = await import("../src/ui/MainMenuBase");

    expect(ZGUI_MAIN_MENU_BASE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZGUI_MAIN_MENU_BASE_HEADER_GUARD_PORTED).toBe(
      firstImport.ZGUI_MAIN_MENU_BASE_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the upstream main-menu layout margins", () => {
    expect(MAIN_MENU_SIDE_MARGIN_PIXELS).toBe(5);
    expect(MAIN_MENU_TOP_MARGIN_PIXELS).toBe(5);
    expect(MAIN_MENU_BOTTOM_MARGIN_PIXELS).toBe(5);
  });

  it("adapts the upstream main-menu title height", () => {
    expect(MAIN_MENU_TITLE_HEIGHT_PIXELS).toBe(18);
  });

  it("ports menu_type identifiers", () => {
    expect(MainMenuType.MainMain).toBe(0);
    expect(MainMenuType.ChangeTeams).toBe(1);
    expect(MainMenuType.ManageBots).toBe(2);
    expect(MainMenuType.PlayerList).toBe(3);
    expect(MainMenuType.SelectMap).toBe(4);
    expect(MainMenuType.Options).toBe(5);
    expect(MainMenuType.Warning).toBe(6);
    expect(MainMenuType.Multiplayer).toBe(7);
    expect(MainMenuType.MaxMenuTypes).toBe(8);
  });

  it("ports gmm_event_type identifiers", () => {
    expect(MainMenuEventType.Unknown).toBe(0);
    expect(MainMenuEventType.Click).toBe(1);
    expect(MainMenuEventType.Unclick).toBe(2);
    expect(MainMenuEventType.Motion).toBe(3);
    expect(MainMenuEventType.Keypress).toBe(4);
    expect(MainMenuEventType.WheelUp).toBe(5);
    expect(MainMenuEventType.WheelDown).toBe(6);
    expect(MainMenuEventType.MacGmmEvents).toBe(7);
  });
});
