import { describe, expect, it } from "vitest";
import { FontType } from "../src/rendering/FontEngine";
import { PlayerInfo } from "../src/simulation/GameCore";
import { SimulationTime } from "../src/simulation/SimulationTime";
import {
  getMainMenuCoords,
  getMainMenuDimensions,
  getMainMenuType,
  handleMainMenuBaseWidgetEvent,
  initMainMenuBase,
  isMainMenuOverHud,
  isMainMenuKilled,
  killMainMenu,
  makeMainMenuTitle,
  type MainMenuBaseImageState,
  MAIN_MENU_BOTTOM_MARGIN_PIXELS,
  MAIN_MENU_SIDE_MARGIN_PIXELS,
  MAIN_MENU_TITLE_HEIGHT_PIXELS,
  MAIN_MENU_TITLE_MARGIN_PIXELS,
  MAIN_MENU_TOP_MARGIN_PIXELS,
  MainMenuEventType,
  MainMenuFlag,
  type MainMenuPlayerInfoListState,
  type MainMenuPlayerTeamState,
  MainMenuWarningFlag,
  type MainMenuWarningFlagsState,
  type MainMenuSoundSettingState,
  type MainMenuTypeState,
  type MainMenuZTimeState,
  MainMenuType,
  moveMainMenuBase,
  processMainMenuBase,
  setMainMenuCenterCoords,
  setMainMenuPlayerInfoList,
  setMainMenuPlayerTeam,
  setMainMenuSoundSetting,
  setMainMenuWarningFlags,
  setMainMenuZTime,
  updateMainMenuDimensions,
  withinMainMenuDimensions,
  wheelDownMainMenuBase,
  wheelUpMainMenuBase,
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

  it("adapts the upstream main-menu title margin", () => {
    expect(MAIN_MENU_TITLE_MARGIN_PIXELS).toBe(18 + 5);
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

  it("ports gmm_warning_flag default construction through clear", () => {
    expect(new MainMenuWarningFlag()).toEqual({
      text1: "",
      text2: "",
      quitGame: false,
      resetMap: false,
    });
  });

  it("ports gmm_warning_flag clear as warning text and action reset", () => {
    const warningFlag = new MainMenuWarningFlag();
    warningFlag.text1 = "Quit?";
    warningFlag.text2 = "Current game will end.";
    warningFlag.quitGame = true;
    warningFlag.resetMap = true;

    warningFlag.clear();

    expect(warningFlag).toEqual({
      text1: "",
      text2: "",
      quitGame: false,
      resetMap: false,
    });
  });

  it("ports gmm_flag default construction through clear", () => {
    expect(new MainMenuFlag()).toEqual({
      openMainMenu: false,
      openMainMenuType: -1,
      reshuffleTeams: false,
      changeTeam: false,
      changeTeamType: -1,
      startBot: false,
      stopBot: false,
      startBotTeam: -1,
      stopBotTeam: -1,
      changeMap: false,
      changeMapNumber: -1,
      resetMap: false,
      quitGame: false,
      setVolume: false,
      setVolumeValue: -1,
      pauseGame: false,
      setGameSpeed: false,
      setGameSpeedValue: 1.0,
      warningFlags: {
        text1: "",
        text2: "",
        quitGame: false,
        resetMap: false,
      },
    });
  });

  it("ports gmm_flag clear as menu action and nested warning reset", () => {
    const flag = new MainMenuFlag();
    flag.openMainMenu = true;
    flag.openMainMenuType = MainMenuType.Options;
    flag.reshuffleTeams = true;
    flag.changeTeam = true;
    flag.changeTeamType = 2;
    flag.startBot = true;
    flag.stopBot = true;
    flag.startBotTeam = 3;
    flag.stopBotTeam = 4;
    flag.changeMap = true;
    flag.changeMapNumber = 5;
    flag.resetMap = true;
    flag.quitGame = true;
    flag.setVolume = true;
    flag.setVolumeValue = 6;
    flag.pauseGame = true;
    flag.setGameSpeed = true;
    flag.setGameSpeedValue = 2.5;
    flag.warningFlags.text1 = "Quit?";
    flag.warningFlags.text2 = "Current game will end.";
    flag.warningFlags.quitGame = true;
    flag.warningFlags.resetMap = true;

    flag.clear();

    expect(flag).toEqual({
      openMainMenu: false,
      openMainMenuType: -1,
      reshuffleTeams: false,
      changeTeam: false,
      changeTeamType: -1,
      startBot: false,
      stopBot: false,
      startBotTeam: -1,
      stopBotTeam: -1,
      changeMap: false,
      changeMapNumber: -1,
      resetMap: false,
      quitGame: false,
      setVolume: false,
      setVolumeValue: -1,
      pauseGame: false,
      setGameSpeed: false,
      setGameSpeedValue: 1.0,
      warningFlags: {
        text1: "",
        text2: "",
        quitGame: false,
        resetMap: false,
      },
    });
  });

  it("ports ZGuiMainMenuBase Init as static chrome image loading", () => {
    const state: MainMenuBaseImageState = { finishedInit: false };
    const filenames: string[] = [];

    initMainMenuBase(state, (filename) => {
      filenames.push(filename);
      return { filename };
    });

    expect(filenames).toEqual([
      "assets/other/main_menu_gui/menu_top_left.png",
      "assets/other/main_menu_gui/menu_top_right.png",
      "assets/other/main_menu_gui/menu_top.png",
      "assets/other/main_menu_gui/menu_left.png",
      "assets/other/main_menu_gui/menu_right.png",
      "assets/other/main_menu_gui/menu_bottom.png",
      "assets/other/main_menu_gui/menu_center.png",
      "assets/other/main_menu_gui/menu_warning.png",
    ]);
    expect(state.finishedInit).toBe(true);
    expect(state.images).toEqual({
      topLeft: { filename: "assets/other/main_menu_gui/menu_top_left.png" },
      topRight: { filename: "assets/other/main_menu_gui/menu_top_right.png" },
      top: { filename: "assets/other/main_menu_gui/menu_top.png" },
      left: { filename: "assets/other/main_menu_gui/menu_left.png" },
      right: { filename: "assets/other/main_menu_gui/menu_right.png" },
      bottom: { filename: "assets/other/main_menu_gui/menu_bottom.png" },
      center: { filename: "assets/other/main_menu_gui/menu_center.png" },
      warning: { filename: "assets/other/main_menu_gui/menu_warning.png" },
    });
  });

  it("ports ZGuiMainMenuBase MakeTitle as no-op without title text", () => {
    const loaded: string[] = [];
    const rendered: Array<{ font: FontType; text: string }> = [];

    makeMainMenuTitle<string>(
      {
        title: "",
        titleImage: {
          getBaseSurface: () => null,
          loadBaseImage: (image) => loaded.push(image),
        },
      },
      (font, text) => {
        rendered.push({ font, text });
        return text;
      },
    );

    expect(rendered).toEqual([]);
    expect(loaded).toEqual([]);
  });

  it("ports ZGuiMainMenuBase MakeTitle as no-op when the title image exists", () => {
    const loaded: string[] = [];
    const rendered: Array<{ font: FontType; text: string }> = [];

    makeMainMenuTitle<string>(
      {
        title: "Options",
        titleImage: {
          getBaseSurface: () => "existing",
          loadBaseImage: (image) => loaded.push(image),
        },
      },
      (font, text) => {
        rendered.push({ font, text });
        return text;
      },
    );

    expect(rendered).toEqual([]);
    expect(loaded).toEqual([]);
  });

  it("ports ZGuiMainMenuBase MakeTitle as yellow-menu title rendering", () => {
    let surface: string | null = null;
    const rendered: Array<{ font: FontType; text: string }> = [];

    makeMainMenuTitle<string>(
      {
        title: "Options",
        titleImage: {
          getBaseSurface: () => surface,
          loadBaseImage: (image) => {
            surface = image;
          },
        },
      },
      (font, text) => {
        rendered.push({ font, text });
        return `rendered:${text}`;
      },
    );

    expect(rendered).toEqual([{ font: FontType.YellowMenu, text: "Options" }]);
    expect(surface).toBe("rendered:Options");
  });

  it("ports the menu type getter", () => {
    const state: MainMenuTypeState = { menuType: MainMenuType.Options };

    expect(getMainMenuType(state)).toBe(MainMenuType.Options);
  });

  it("ports ZGuiMainMenuBase Process as widget processing delegation", () => {
    const calls: string[] = [];

    processMainMenuBase({
      processWidgets: () => calls.push("widgets"),
    });

    expect(calls).toEqual(["widgets"]);
  });

  it("ports GetCoords as a main menu coordinate snapshot", () => {
    const state = { x: 30, y: 40 };

    const coords = getMainMenuCoords(state);
    state.x = 0;

    expect(coords).toEqual({ x: 30, y: 40 });
  });

  it("ports ZGuiMainMenuBase SetCenterCoords as centered origin placement", () => {
    const state = { x: 0, y: 0, width: 101, height: 81 };

    setMainMenuCenterCoords(state, 200, 120);

    expect(state).toEqual({
      x: 150,
      y: 80,
      width: 101,
      height: 81,
    });
  });

  it("ports ZGuiMainMenuBase Move as scaled center repositioning", () => {
    const state = { x: 10, y: 20, width: 101, height: 81 };

    moveMainMenuBase(state, 2, 0.5);

    expect(state).toEqual({
      x: 70,
      y: -10,
      width: 101,
      height: 81,
    });
  });

  it("ports GetDimensions as a main menu dimensions snapshot", () => {
    const state = { width: 160, height: 90 };

    const dimensions = getMainMenuDimensions(state);
    state.width = 0;

    expect(dimensions).toEqual({ width: 160, height: 90 });
  });

  it("ports ZGuiMainMenuBase UpdateDimensions as close-button placement", () => {
    const coords: Array<{ x: number; y: number }> = [];

    updateMainMenuDimensions({
      width: 240,
      closeButton: {
        setCoords: (x, y) => coords.push({ x, y }),
      },
    });

    expect(coords).toEqual([{ x: 224, y: 4 }]);
  });

  it("ports ZGuiMainMenuBase::WithinDimensions as inclusive hit testing", () => {
    const state = { x: 50, y: 60, width: 100, height: 80 };

    expect(withinMainMenuDimensions(state, 50, 60)).toBe(true);
    expect(withinMainMenuDimensions(state, 150, 140)).toBe(true);
    expect(withinMainMenuDimensions(state, 49, 60)).toBe(false);
    expect(withinMainMenuDimensions(state, 50, 59)).toBe(false);
    expect(withinMainMenuDimensions(state, 151, 140)).toBe(false);
    expect(withinMainMenuDimensions(state, 150, 141)).toBe(false);
  });

  it("ports ZGuiMainMenuBase::IsOverHUD as inclusive HUD boundary overlap", () => {
    const state = { x: 20, y: 30, width: 40, height: 50 };

    expect(isMainMenuOverHud(state, 60, 90)).toBe(true);
    expect(isMainMenuOverHud(state, 61, 80)).toBe(true);
    expect(isMainMenuOverHud(state, 61, 81)).toBe(false);
  });

  it("ports KillMe as main menu kill-state read", () => {
    expect(isMainMenuKilled({ killMe: true })).toBe(true);
    expect(isMainMenuKilled({ killMe: false })).toBe(false);
  });

  it("ports DoKillMe as main menu kill-state assignment", () => {
    const state = { killMe: false };

    killMainMenu(state);

    expect(state.killMe).toBe(true);
  });

  it("ports SetWarningFlags as warning flag value assignment", () => {
    const state: MainMenuWarningFlagsState = {
      warningFlags: new MainMenuWarningFlag(),
    };
    const warningFlags = new MainMenuWarningFlag();
    warningFlags.text1 = "Quit?";
    warningFlags.text2 = "Current game will end.";
    warningFlags.quitGame = true;
    warningFlags.resetMap = true;

    setMainMenuWarningFlags(state, warningFlags);
    warningFlags.text1 = "Changed";

    expect(state.warningFlags).toEqual({
      text1: "Quit?",
      text2: "Current game will end.",
      quitGame: true,
      resetMap: true,
    });
  });

  it("ports SetSoundSetting as a mutable audio setting reference assignment", () => {
    const state: MainMenuSoundSettingState = { soundSetting: null };
    const soundSetting = { value: 2 };

    setMainMenuSoundSetting(state, soundSetting);
    soundSetting.value = 3;

    expect(state.soundSetting).toBe(soundSetting);
    expect(state.soundSetting?.value).toBe(3);
  });

  it("ports SetPlayerTeam as a mutable player-team reference assignment", () => {
    const state: MainMenuPlayerTeamState = { playerTeam: null };
    const playerTeam = { value: 1 };

    setMainMenuPlayerTeam(state, playerTeam);
    playerTeam.value = 2;

    expect(state.playerTeam).toBe(playerTeam);
    expect(state.playerTeam?.value).toBe(2);
  });

  it("ports SetZTime as a simulation clock reference assignment", () => {
    const state: MainMenuZTimeState = { ztime: null };
    const ztime = new SimulationTime();

    setMainMenuZTime(state, ztime);

    expect(state.ztime).toBe(ztime);
  });

  it("ports SetPlayerInfoList as a mutable player-info list reference assignment", () => {
    const state: MainMenuPlayerInfoListState = { playerInfoList: null };
    const playerInfoList = [new PlayerInfo(1)];

    setMainMenuPlayerInfoList(state, playerInfoList);
    playerInfoList.push(new PlayerInfo(2));

    expect(state.playerInfoList).toBe(playerInfoList);
    expect(state.playerInfoList).toHaveLength(2);
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

  it("ports ZGuiMainMenuBase HandleWidgetEvent as guarded debug logging", () => {
    const messages: string[] = [];

    handleMainMenuBaseWidgetEvent(
      MainMenuEventType.Click,
      { widgetType: 3, refId: 42 },
      (message) => messages.push(message),
    );

    expect(messages).toEqual([
      "ZGuiMainMenuBase::HandleWidgetEvent::1:click widget_type:3 ref_id:42",
    ]);
  });

  it("ports ZGuiMainMenuBase HandleWidgetEvent early returns", () => {
    const messages: string[] = [];
    const log = (message: string): void => {
      messages.push(message);
    };

    handleMainMenuBaseWidgetEvent(MainMenuEventType.Click, null, log);
    handleMainMenuBaseWidgetEvent(-1, { widgetType: 1, refId: 2 }, log);
    handleMainMenuBaseWidgetEvent(
      MainMenuEventType.MacGmmEvents,
      { widgetType: 1, refId: 2 },
      log,
    );

    expect(messages).toEqual([]);
  });

  it("ports ZGuiMainMenuBase WheelUpButton as widget routing with flag clear", () => {
    const calls: unknown[] = [];
    const handled = wheelUpMainMenuBase(
      {
        gmmFlags: { clear: () => calls.push("clear") },
        widgetList: [
          {
            widgetType: 1,
            refId: 10,
            wheelUpButton() {
              calls.push("first");
              return false;
            },
          },
          {
            widgetType: 2,
            refId: 20,
            wheelUpButton() {
              calls.push("second");
              return true;
            },
          },
          {
            widgetType: 3,
            refId: 30,
            wheelUpButton() {
              calls.push("third");
              return true;
            },
          },
        ],
      },
      (eventType, widget) => {
        calls.push(["event", eventType, widget.refId]);
      },
    );

    expect(handled).toBe(true);
    expect(calls).toEqual([
      "clear",
      "first",
      "second",
      ["event", MainMenuEventType.WheelUp, 20],
      "third",
      ["event", MainMenuEventType.WheelUp, 30],
    ]);
  });

  it("ports ZGuiMainMenuBase WheelUpButton unhandled path", () => {
    const calls: string[] = [];
    const handled = wheelUpMainMenuBase(
      {
        gmmFlags: { clear: () => calls.push("clear") },
        widgetList: [
          {
            widgetType: 1,
            refId: 10,
            wheelUpButton() {
              calls.push("first");
              return false;
            },
          },
        ],
      },
      () => calls.push("event"),
    );

    expect(handled).toBe(false);
    expect(calls).toEqual(["clear", "first"]);
  });

  it("ports ZGuiMainMenuBase WheelDownButton as widget routing with flag clear", () => {
    const calls: unknown[] = [];
    const handled = wheelDownMainMenuBase(
      {
        gmmFlags: { clear: () => calls.push("clear") },
        widgetList: [
          {
            widgetType: 1,
            refId: 10,
            wheelDownButton() {
              calls.push("first");
              return false;
            },
          },
          {
            widgetType: 2,
            refId: 20,
            wheelDownButton() {
              calls.push("second");
              return true;
            },
          },
          {
            widgetType: 3,
            refId: 30,
            wheelDownButton() {
              calls.push("third");
              return true;
            },
          },
        ],
      },
      (eventType, widget) => {
        calls.push(["event", eventType, widget.refId]);
      },
    );

    expect(handled).toBe(true);
    expect(calls).toEqual([
      "clear",
      "first",
      "second",
      ["event", MainMenuEventType.WheelDown, 20],
      "third",
      ["event", MainMenuEventType.WheelDown, 30],
    ]);
  });

  it("ports ZGuiMainMenuBase WheelDownButton unhandled path", () => {
    const calls: string[] = [];
    const handled = wheelDownMainMenuBase(
      {
        gmmFlags: { clear: () => calls.push("clear") },
        widgetList: [
          {
            widgetType: 1,
            refId: 10,
            wheelDownButton() {
              calls.push("first");
              return false;
            },
          },
        ],
      },
      () => calls.push("event"),
    );

    expect(handled).toBe(false);
    expect(calls).toEqual(["clear", "first"]);
  });
});
