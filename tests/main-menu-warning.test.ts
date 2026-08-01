import { describe, expect, it } from "vitest";
import { MainMenuEventType, MainMenuWarningFlag } from "../src/ui/MainMenuBase";
import {
  handleMainMenuWarningWidgetEvent,
  ZGMM_WARNING_HEADER_GUARD_PORTED,
} from "../src/ui/MainMenuWarning";

describe("main menu warning", () => {
  it("adapts the gmm_warning.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/ui/MainMenuWarning");
    const secondImport = await import("../src/ui/MainMenuWarning");

    expect(ZGMM_WARNING_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZGMM_WARNING_HEADER_GUARD_PORTED).toBe(
      firstImport.ZGMM_WARNING_HEADER_GUARD_PORTED,
    );
  });

  it("ports GMMWarning HandleWidgetEvent as OK unclick action application", () => {
    const warningFlags = new MainMenuWarningFlag();
    warningFlags.quitGame = true;
    warningFlags.resetMap = true;
    const state = {
      killMe: false,
      okButton: { getRefId: () => 10 },
      cancelButton: { getRefId: () => 20 },
      warningFlags,
      mainMenuFlags: {
        quitGame: false,
        resetMap: false,
      },
    };

    handleMainMenuWarningWidgetEvent(
      state,
      MainMenuEventType.Unclick,
      { getRefId: () => 10 },
    );

    expect(state.killMe).toBe(true);
    expect(state.mainMenuFlags).toEqual({ quitGame: true, resetMap: true });
  });

  it("ports GMMWarning HandleWidgetEvent as Cancel unclick close only", () => {
    const warningFlags = new MainMenuWarningFlag();
    warningFlags.quitGame = true;
    warningFlags.resetMap = true;
    const state = {
      killMe: false,
      okButton: { getRefId: () => 10 },
      cancelButton: { getRefId: () => 20 },
      warningFlags,
      mainMenuFlags: {
        quitGame: false,
        resetMap: false,
      },
    };

    handleMainMenuWarningWidgetEvent(
      state,
      MainMenuEventType.Unclick,
      { getRefId: () => 20 },
    );

    expect(state.killMe).toBe(true);
    expect(state.mainMenuFlags).toEqual({ quitGame: false, resetMap: false });
  });

  it("ports GMMWarning HandleWidgetEvent guard and ignored event cases", () => {
    const state = {
      killMe: false,
      okButton: { getRefId: () => 10 },
      cancelButton: { getRefId: () => 20 },
      warningFlags: new MainMenuWarningFlag(),
      mainMenuFlags: {
        quitGame: false,
        resetMap: false,
      },
    };

    handleMainMenuWarningWidgetEvent(state, MainMenuEventType.Click, {
      getRefId: () => 10,
    });
    handleMainMenuWarningWidgetEvent(state, MainMenuEventType.Unclick, {
      getRefId: () => 99,
    });
    handleMainMenuWarningWidgetEvent(state, MainMenuEventType.Unclick, null);

    expect(state.killMe).toBe(false);
    expect(state.mainMenuFlags).toEqual({ quitGame: false, resetMap: false });
  });
});
