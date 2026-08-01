import { describe, expect, it } from "vitest";
import { MainMenuEventType, MainMenuWarningFlag } from "../src/ui/MainMenuBase";
import {
  handleMainMenuWarningWidgetEvent,
  renderMainMenuWarning,
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

  it("replaces GMMWarning DoRender with base image then widget commands", () => {
    const widgetCalls: string[] = [];

    const commands = renderMainMenuWarning(
      {
        finishedInit: true,
        x: 30,
        y: 40,
        warningImage: {
          texture: { textureId: "warning" },
          width: 220,
          height: 85,
        },
      },
      () => {
        widgetCalls.push("widgets");
        return [{ widget: "ok" }, { widget: "cancel" }];
      },
    );

    expect(widgetCalls).toEqual(["widgets"]);
    expect(commands).toEqual([
      {
        texture: { textureId: "warning" },
        destinationX: 30,
        destinationY: 40,
        width: 220,
        height: 85,
        sourceX: 0,
        sourceY: 0,
        sourceWidth: 220,
        sourceHeight: 85,
        textureLeft: 0,
        textureTop: 0,
        textureRight: 1,
        textureBottom: 1,
        scale: 1,
        angle: 0,
        alpha: 1,
      },
      { widget: "ok" },
      { widget: "cancel" },
    ]);
  });

  it("replaces GMMWarning DoRender guard and missing-image cases", () => {
    const failRender = () => {
      throw new Error("uninitialized warning should not render widgets");
    };

    expect(
      renderMainMenuWarning(
        { finishedInit: false, x: 30, y: 40, warningImage: null },
        failRender,
      ),
    ).toEqual([]);
    expect(
      renderMainMenuWarning(
        { finishedInit: true, x: 30, y: 40, warningImage: null },
        () => [{ widget: "ok" }],
      ),
    ).toEqual([{ widget: "ok" }]);
  });
});
