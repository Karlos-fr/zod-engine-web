/**
 * Upstream: zgui_main_menu_base.h
 */

import type { PlayerInfo } from "../simulation/GameCore";
import type { SimulationTime } from "../simulation/SimulationTime";

/**
 * Port of upstream `_ZGUIMAINMENUBASE_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: zgui_main_menu_base.h:2
 */
export const ZGUI_MAIN_MENU_BASE_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `GMM_SIDE_MARGIN`.
 * Role: Defines the side margin for main-menu layouts.
 * Upstream: zgui_main_menu_base.h:17
 */
export const MAIN_MENU_SIDE_MARGIN_PIXELS = 5;

/**
 * Port of upstream `GMM_TOP_MARGIN`.
 * Role: Defines the top margin for main-menu layouts.
 * Upstream: zgui_main_menu_base.h:18
 */
export const MAIN_MENU_TOP_MARGIN_PIXELS = 5;

/**
 * Port of upstream `GMM_BOTTOM_MARGIN`.
 * Role: Defines the bottom margin for main-menu layouts.
 * Upstream: zgui_main_menu_base.h:19
 */
export const MAIN_MENU_BOTTOM_MARGIN_PIXELS = 5;

/**
 * Port of upstream `GMM_TITLE_HEIGHT`.
 * Role: Defines the title row height for main-menu layouts.
 * Upstream: zgui_main_menu_base.h:20
 */
export const MAIN_MENU_TITLE_HEIGHT_PIXELS = 18;

/**
 * Port of upstream `GMM_TITLE_MARGIN`.
 * Role: Defines the vertical offset below the top margin and title row.
 * Upstream: zgui_main_menu_base.h:22
 */
export const MAIN_MENU_TITLE_MARGIN_PIXELS =
  MAIN_MENU_TITLE_HEIGHT_PIXELS + MAIN_MENU_TOP_MARGIN_PIXELS;

/**
 * Port of upstream `menu_type`.
 * Role: Identifies the active main-menu screen.
 * Upstream: zgui_main_menu_base.h:24-30
 */
export enum MainMenuType {
  MainMain = 0,
  ChangeTeams = 1,
  ManageBots = 2,
  PlayerList = 3,
  SelectMap = 4,
  Options = 5,
  Warning = 6,
  Multiplayer = 7,
  MaxMenuTypes = 8,
}

/**
 * Port of upstream `gmm_warning_flag`.
 * Role: Carries warning dialog text and follow-up actions requested by main-menu widgets.
 * Upstream: zgui_main_menu_base.h:45-62
 */
export class MainMenuWarningFlag {
  text1 = "";
  text2 = "";
  quitGame = false;
  resetMap = false;

  constructor() {
    this.clear();
  }

  /**
   * Port of upstream `gmm_warning_flag::clear`.
   * Role: Resets warning text and action flags.
   * Upstream: zgui_main_menu_base.h:50-56
   */
  clear(): void {
    this.text1 = "";
    this.text2 = "";
    this.quitGame = false;
    this.resetMap = false;
  }
}

/**
 * Port of upstream `gmm_flag`.
 * Role: Carries actions requested by main-menu widgets and nested warning state.
 * Upstream: zgui_main_menu_base.h:64-113
 */
export class MainMenuFlag {
  openMainMenu = false;
  openMainMenuType = -1;
  reshuffleTeams = false;
  changeTeam = false;
  changeTeamType = -1;
  startBot = false;
  stopBot = false;
  startBotTeam = -1;
  stopBotTeam = -1;
  changeMap = false;
  changeMapNumber = -1;
  resetMap = false;
  quitGame = false;
  setVolume = false;
  setVolumeValue = -1;
  pauseGame = false;
  setGameSpeed = false;
  setGameSpeedValue = 1.0;
  warningFlags = new MainMenuWarningFlag();

  constructor() {
    this.clear();
  }

  /**
   * Port of upstream `gmm_flag::clear`.
   * Role: Resets main-menu requested actions and nested warning flags.
   * Upstream: zgui_main_menu_base.h:69-91
   */
  clear(): void {
    this.openMainMenu = false;
    this.openMainMenuType = -1;
    this.reshuffleTeams = false;
    this.changeTeam = false;
    this.changeTeamType = -1;
    this.startBot = false;
    this.stopBot = false;
    this.startBotTeam = -1;
    this.stopBotTeam = -1;
    this.changeMap = false;
    this.changeMapNumber = -1;
    this.resetMap = false;
    this.quitGame = false;
    this.setVolume = false;
    this.setVolumeValue = -1;
    this.pauseGame = false;
    this.setGameSpeed = false;
    this.setGameSpeedValue = 1.0;
    this.warningFlags.clear();
  }
}

/**
 * Port of upstream `menu_type`.
 * Role: Stores the active main-menu screen.
 * Upstream: zgui_main_menu_base.h:118
 */
export type MainMenuTypeState = {
  menuType: MainMenuType;
};

/**
 * Port of upstream `ZGuiMainMenuBase::ProcessWidgets` call target.
 * Role: Provides the minimal main-menu API needed by the base process wrapper.
 * Upstream: zgui_main_menu_base.cpp:56
 */
export type MainMenuWidgetProcessor = {
  processWidgets(): void;
};

/**
 * Port of upstream `sound_setting` reference.
 * Role: Holds a mutable audio setting referenced by the main menu base.
 * Upstream: zgui_main_menu_base.h:145, zgui_main_menu_base.h:181
 */
export type MainMenuSoundSettingRef = {
  value: number;
};

/**
 * Port of upstream `sound_setting` pointer field.
 * Role: Stores the mutable audio setting reference used by the main menu base.
 * Upstream: zgui_main_menu_base.h:145, zgui_main_menu_base.h:181
 */
export type MainMenuSoundSettingState = {
  soundSetting: MainMenuSoundSettingRef | null;
};

/**
 * Port of upstream `player_team` reference.
 * Role: Holds a mutable player-team value referenced by the main menu base.
 * Upstream: zgui_main_menu_base.h:144, zgui_main_menu_base.h:180
 */
export type MainMenuPlayerTeamRef = {
  value: number;
};

/**
 * Port of upstream `player_team` pointer field.
 * Role: Stores the mutable player-team reference used by the main menu base.
 * Upstream: zgui_main_menu_base.h:144, zgui_main_menu_base.h:180
 */
export type MainMenuPlayerTeamState = {
  playerTeam: MainMenuPlayerTeamRef | null;
};

/**
 * Port of upstream `ztime` pointer field.
 * Role: Stores the simulation clock reference used by the main menu base.
 * Upstream: zgui_main_menu_base.h:146, zgui_main_menu_base.h:181
 */
export type MainMenuZTimeState = {
  ztime: SimulationTime | null;
};

/**
 * Port of upstream `player_info` list reference.
 * Role: Holds the mutable player info list referenced by the main menu base.
 * Upstream: zgui_main_menu_base.h:142, zgui_main_menu_base.h:178
 */
export type MainMenuPlayerInfoList = PlayerInfo[];

/**
 * Port of upstream `player_info` pointer field.
 * Role: Stores the mutable player info list reference used by the main menu base.
 * Upstream: zgui_main_menu_base.h:142, zgui_main_menu_base.h:178
 */
export type MainMenuPlayerInfoListState = {
  playerInfoList: MainMenuPlayerInfoList | null;
};

/**
 * Port of upstream `killme` state.
 * Role: Holds whether the main-menu base should be removed.
 * Upstream: zgui_main_menu_base.h:133, zgui_main_menu_base.h:172
 */
export type MainMenuKillState = {
  killMe: boolean;
};

/**
 * Port of upstream `ZGuiMainMenuBase` coordinate fields.
 * Role: Holds the main-menu base origin.
 * Upstream: zgui_main_menu_base.h:139, zgui_main_menu_base.h:174
 */
export type MainMenuCoordinateState = {
  x: number;
  y: number;
};

/**
 * Port of upstream `GetCoords` output.
 * Role: Carries the main-menu base origin.
 * Upstream: zgui_main_menu_base.h:139
 */
export type MainMenuCoordsResult = {
  x: number;
  y: number;
};

/**
 * Port of upstream `ZGuiMainMenuBase` dimension fields.
 * Role: Holds the main-menu base dimensions.
 * Upstream: zgui_main_menu_base.h:140, zgui_main_menu_base.h:174
 */
export type MainMenuDimensionState = {
  width: number;
  height: number;
};

/**
 * Port of upstream `ZGuiMainMenuBase` bounds fields.
 * Role: Holds the main-menu base origin and dimensions used for hit testing.
 * Upstream: zgui_main_menu_base.h:139-140, zgui_main_menu_base.cpp:68-76
 */
export type MainMenuBoundsState = MainMenuCoordinateState &
  MainMenuDimensionState;

/**
 * Port of upstream `GetDimensions` output.
 * Role: Carries the main-menu base dimensions.
 * Upstream: zgui_main_menu_base.h:140
 */
export type MainMenuDimensionsResult = {
  width: number;
  height: number;
};

/**
 * Port of upstream `warning_flags` field.
 * Role: Stores warning dialog flags owned by the main menu base.
 * Upstream: zgui_main_menu_base.h:148, zgui_main_menu_base.h:183
 */
export type MainMenuWarningFlagsState = {
  warningFlags: MainMenuWarningFlag;
};

/**
 * Port of upstream `GetMenuType`.
 * Role: Returns the active main-menu screen.
 * Upstream: zgui_main_menu_base.h:135
 */
export function getMainMenuType(state: MainMenuTypeState): MainMenuType {
  return state.menuType;
}

/**
 * Port of upstream `ZGuiMainMenuBase::Process`.
 * Role: Delegates per-frame menu processing to widget processing.
 * Upstream: zgui_main_menu_base.cpp:54-57
 */
export function processMainMenuBase(menu: MainMenuWidgetProcessor): void {
  menu.processWidgets();
}

/**
 * Port of upstream `KillMe`.
 * Role: Returns whether the main-menu base should be removed.
 * Upstream: zgui_main_menu_base.h:133
 */
export function isMainMenuKilled(state: MainMenuKillState): boolean {
  return state.killMe;
}

/**
 * Port of upstream `DoKillMe`.
 * Role: Marks the main-menu base for removal.
 * Upstream: zgui_main_menu_base.h:134
 */
export function killMainMenu(state: MainMenuKillState): void {
  state.killMe = true;
}

/**
 * Port of upstream `GetCoords`.
 * Role: Returns the main-menu base origin.
 * Upstream: zgui_main_menu_base.h:139
 */
export function getMainMenuCoords(
  state: MainMenuCoordinateState,
): MainMenuCoordsResult {
  return {
    x: state.x,
    y: state.y,
  };
}

/**
 * Port of upstream `ZGuiMainMenuBase::SetCenterCoords`.
 * Role: Positions the main-menu base so its bounds are centered on a point.
 * Upstream: zgui_main_menu_base.cpp:48-52
 */
export function setMainMenuCenterCoords(
  state: MainMenuBoundsState,
  centerX: number,
  centerY: number,
): void {
  state.x = centerX - (state.width >> 1);
  state.y = centerY - (state.height >> 1);
}

/**
 * Port of upstream `ZGuiMainMenuBase::Move`.
 * Role: Scales the menu center point and updates the origin to keep dimensions centered.
 * Upstream: zgui_main_menu_base.cpp:86-98
 */
export function moveMainMenuBase(
  state: MainMenuBoundsState,
  px: number,
  py: number,
): void {
  const halfWidth = state.width >> 1;
  const halfHeight = state.height >> 1;
  const centerX = (state.x + halfWidth) * px;
  const centerY = (state.y + halfHeight) * py;

  state.x = centerX - halfWidth;
  state.y = centerY - halfHeight;
}

/**
 * Port of upstream `GetDimensions`.
 * Role: Returns the main-menu base dimensions.
 * Upstream: zgui_main_menu_base.h:140
 */
export function getMainMenuDimensions(
  state: MainMenuDimensionState,
): MainMenuDimensionsResult {
  return {
    width: state.width,
    height: state.height,
  };
}

/**
 * Port of upstream `ZGuiMainMenuBase::WithinDimensions`.
 * Role: Tests whether a point is within the main-menu base's inclusive bounds.
 * Upstream: zgui_main_menu_base.cpp:68-76
 */
export function withinMainMenuDimensions(
  state: MainMenuBoundsState,
  x: number,
  y: number,
): boolean {
  if (x < state.x) return false;
  if (y < state.y) return false;
  if (x > state.x + state.width) return false;
  if (y > state.y + state.height) return false;

  return true;
}

/**
 * Port of upstream `ZGuiMainMenuBase::IsOverHUD`.
 * Role: Reports whether the menu bounds overlap the HUD left or top boundary.
 * Upstream: zgui_main_menu_base.cpp:78-84
 */
export function isMainMenuOverHud(
  state: MainMenuBoundsState,
  hudLeft: number,
  hudTop: number,
): boolean {
  if (state.x + state.width >= hudLeft) return true;
  if (state.y + state.height >= hudTop) return true;

  return false;
}

/**
 * Port of upstream `SetWarningFlags`.
 * Role: Copies warning dialog flags into the main menu base.
 * Upstream: zgui_main_menu_base.h:148
 */
export function setMainMenuWarningFlags(
  state: MainMenuWarningFlagsState,
  warningFlags: MainMenuWarningFlag,
): void {
  const nextWarningFlags = new MainMenuWarningFlag();
  nextWarningFlags.text1 = warningFlags.text1;
  nextWarningFlags.text2 = warningFlags.text2;
  nextWarningFlags.quitGame = warningFlags.quitGame;
  nextWarningFlags.resetMap = warningFlags.resetMap;
  state.warningFlags = nextWarningFlags;
}

/**
 * Port of upstream `SetSoundSetting`.
 * Role: Updates the mutable audio setting reference used by the main menu base.
 * Upstream: zgui_main_menu_base.h:145
 */
export function setMainMenuSoundSetting(
  state: MainMenuSoundSettingState,
  soundSetting: MainMenuSoundSettingRef,
): void {
  state.soundSetting = soundSetting;
}

/**
 * Port of upstream `SetPlayerTeam`.
 * Role: Updates the mutable player-team reference used by the main menu base.
 * Upstream: zgui_main_menu_base.h:144
 */
export function setMainMenuPlayerTeam(
  state: MainMenuPlayerTeamState,
  playerTeam: MainMenuPlayerTeamRef,
): void {
  state.playerTeam = playerTeam;
}

/**
 * Port of upstream `SetZTime`.
 * Role: Updates the simulation clock reference used by the main menu base.
 * Upstream: zgui_main_menu_base.h:146
 */
export function setMainMenuZTime(
  state: MainMenuZTimeState,
  ztime: SimulationTime,
): void {
  state.ztime = ztime;
}

/**
 * Port of upstream `SetPlayerInfoList`.
 * Role: Updates the mutable player info list reference used by the main menu base.
 * Upstream: zgui_main_menu_base.h:142
 */
export function setMainMenuPlayerInfoList(
  state: MainMenuPlayerInfoListState,
  playerInfoList: MainMenuPlayerInfoList,
): void {
  state.playerInfoList = playerInfoList;
}

/**
 * Port of upstream `gmm_event_type`.
 * Role: Identifies input event categories consumed by main-menu widgets.
 * Upstream: zgui_main_menu_base.h:32-37
 */
export enum MainMenuEventType {
  Unknown = 0,
  Click = 1,
  Unclick = 2,
  Motion = 3,
  Keypress = 4,
  WheelUp = 5,
  WheelDown = 6,
  MacGmmEvents = 7,
}
