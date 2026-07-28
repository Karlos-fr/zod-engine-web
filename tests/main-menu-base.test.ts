import { describe, expect, it } from "vitest";
import { PlayerInfo } from "../src/simulation/GameCore";
import { SimulationTime } from "../src/simulation/SimulationTime";
import {
  getMainMenuCoords,
  getMainMenuDimensions,
  getMainMenuType,
  isMainMenuKilled,
  killMainMenu,
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
  setMainMenuPlayerInfoList,
  setMainMenuPlayerTeam,
  setMainMenuSoundSetting,
  setMainMenuWarningFlags,
  setMainMenuZTime,
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

  it("ports the menu type getter", () => {
    const state: MainMenuTypeState = { menuType: MainMenuType.Options };

    expect(getMainMenuType(state)).toBe(MainMenuType.Options);
  });

  it("ports GetCoords as a main menu coordinate snapshot", () => {
    const state = { x: 30, y: 40 };

    const coords = getMainMenuCoords(state);
    state.x = 0;

    expect(coords).toEqual({ x: 30, y: 40 });
  });

  it("ports GetDimensions as a main menu dimensions snapshot", () => {
    const state = { width: 160, height: 90 };

    const dimensions = getMainMenuDimensions(state);
    state.width = 0;

    expect(dimensions).toEqual({ width: 160, height: 90 });
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
});
