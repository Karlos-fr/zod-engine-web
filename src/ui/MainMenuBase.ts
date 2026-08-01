/**
 * Upstream: zgui_main_menu_base.h
 */

import { FontType } from "../rendering/FontEngine";
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
 * Role: Processes widgets for the base main-menu loop.
 * Upstream: zgui_main_menu_base.cpp:56
 */
export type MainMenuWidgetProcessor = {
  processWidgets(): void;
};

/**
 * Port of upstream `gmm_flags` clear dependency.
 * Role: Resets pending main-menu actions before wheel-widget routing.
 * Upstream: zgui_main_menu_base.cpp:149
 */
export type MainMenuFlagClearTarget = {
  clear(): void;
};

/**
 * Port of upstream `ZGMMWidget::WheelUpButton` call target.
 * Role: Attempts to consume wheel-up input on a main-menu widget.
 * Upstream: zgui_main_menu_base.cpp:152
 */
export type MainMenuWheelUpWidgetTarget = MainMenuWidgetEventTarget & {
  wheelUpButton(): boolean;
};

/**
 * Port of upstream `ZGMMWidget::WheelDownButton` call target.
 * Role: Attempts to consume wheel-down input on a main-menu widget.
 * Upstream: zgui_main_menu_base.cpp:168
 */
export type MainMenuWheelDownWidgetTarget = MainMenuWidgetEventTarget & {
  wheelDownButton(): boolean;
};

/**
 * Port of upstream `ZGuiMainMenuBase` wheel-up fields.
 * Role: Holds the main-menu action flags and widgets used by wheel-up routing.
 * Upstream: zgui_main_menu_base.cpp:149-154
 */
export type MainMenuWheelUpState = {
  gmmFlags: MainMenuFlagClearTarget;
  widgetList: MainMenuWheelUpWidgetTarget[];
};

/**
 * Port of upstream `ZGuiMainMenuBase` wheel-down fields.
 * Role: Holds the main-menu action flags and widgets used by wheel-down routing.
 * Upstream: zgui_main_menu_base.cpp:165-170
 */
export type MainMenuWheelDownState = {
  gmmFlags: MainMenuFlagClearTarget;
  widgetList: MainMenuWheelDownWidgetTarget[];
};

/**
 * Port of upstream `ZGMMWidget::KeyPress` call target.
 * Role: Attempts to consume keyboard input on a main-menu widget.
 * Upstream: zgui_main_menu_base.cpp:136
 */
export type MainMenuKeyPressWidgetTarget = MainMenuWidgetEventTarget & {
  keyPress(c: number): boolean;
};

/**
 * Port of upstream `ZGuiMainMenuBase` key-press fields.
 * Role: Holds the main-menu action flags and widgets used by key-press routing.
 * Upstream: zgui_main_menu_base.cpp:133-136
 */
export type MainMenuKeyPressState = {
  gmmFlags: MainMenuFlagClearTarget;
  widgetList: MainMenuKeyPressWidgetTarget[];
};

/**
 * Port of upstream `ZGMMWidget::Motion` call target.
 * Role: Attempts to consume pointer motion on a main-menu widget.
 * Upstream: zgui_main_menu_base.cpp:120
 */
export type MainMenuMotionWidgetTarget = MainMenuWidgetEventTarget & {
  motionButton(x: number, y: number): boolean;
};

/**
 * Port of upstream `ZGuiMainMenuBase` motion fields.
 * Role: Holds main-menu position, drag state, flags, and widgets used by pointer motion routing.
 * Upstream: zgui_main_menu_base.cpp:105-120
 */
export type MainMenuMotionState = {
  x: number;
  y: number;
  clickGrabbed: boolean;
  grabX: number;
  grabY: number;
  gmmFlags: MainMenuFlagClearTarget;
  widgetList: MainMenuMotionWidgetTarget[];
};

/**
 * Port of upstream `ZGMMWidget::UnClick` call target.
 * Role: Attempts to consume pointer release on a main-menu widget.
 * Upstream: zgui_main_menu_base.cpp:226, zgui_main_menu_base.cpp:234
 */
export type MainMenuUnClickWidgetTarget = MainMenuWidgetEventTarget & {
  unClickButton(x: number, y: number): boolean;
};

/**
 * Port of upstream `ZGuiMainMenuBase` unclick fields.
 * Role: Holds menu bounds, close button, drag state, flags, and widgets used by pointer release routing.
 * Upstream: zgui_main_menu_base.cpp:217-240
 */
export type MainMenuUnClickState = MainMenuBoundsState & {
  clickGrabbed: boolean;
  killMe: boolean;
  gmmFlags: MainMenuFlagClearTarget;
  closeButton: MainMenuUnClickWidgetTarget;
  widgetList: MainMenuUnClickWidgetTarget[];
};

/**
 * Port of upstream `ZGMMWidget::Click` call target.
 * Role: Attempts to consume pointer press on a main-menu widget.
 * Upstream: zgui_main_menu_base.cpp:189, zgui_main_menu_base.cpp:193
 */
export type MainMenuClickWidgetTarget = MainMenuWidgetEventTarget & {
  clickButton(x: number, y: number): boolean;
};

/**
 * Port of upstream `ZGuiMainMenuBase` click fields.
 * Role: Holds menu bounds, close button, drag state, flags, and widgets used by pointer press routing.
 * Upstream: zgui_main_menu_base.cpp:183-209
 */
export type MainMenuClickState = MainMenuBoundsState & {
  clickGrabbed: boolean;
  grabX: number;
  grabY: number;
  gmmFlags: MainMenuFlagClearTarget;
  closeButton: MainMenuClickWidgetTarget;
  widgetList: MainMenuClickWidgetTarget[];
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
 * Port of upstream `ZGuiButtonBase::SetCoords` call target.
 * Role: Repositions the main-menu close button when menu dimensions change.
 * Upstream: zgui_main_menu_base.cpp:45
 */
export type MainMenuCloseButton = {
  setCoords(x: number, y: number): void;
};

/**
 * Port of upstream `ZGuiMainMenuBase::UpdateDimensions` state.
 * Role: Holds menu width and the close button that is aligned to the top-right chrome.
 * Upstream: zgui_main_menu_base.cpp:43-46
 */
export type MainMenuUpdateDimensionsState = Pick<MainMenuDimensionState, "width"> & {
  closeButton: MainMenuCloseButton;
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

export type MainMenuBaseImageName =
  | "topLeft"
  | "topRight"
  | "top"
  | "left"
  | "right"
  | "bottom"
  | "center"
  | "warning";

export type MainMenuBaseImageState = {
  images?: Partial<Record<MainMenuBaseImageName, unknown | null>>;
  finishedInit?: boolean;
};

export type MainMenuBaseImageLoader = (filename: string) => unknown | null;

/**
 * Port of upstream `ZGuiMainMenuBase::title_img` dependency surface.
 * Role: Stores the rendered main-menu title image.
 * Upstream: zgui_main_menu_base.h:151, zgui_main_menu_base.cpp:346-348
 */
export type MainMenuTitleImage<TImage> = {
  getBaseSurface(): TImage | null;
  loadBaseImage(image: TImage): void;
};

/**
 * Port of upstream `ZGuiMainMenuBase::MakeTitle` consumed fields.
 * Role: Holds title text and the lazily rendered title image.
 * Upstream: zgui_main_menu_base.h:150-151, zgui_main_menu_base.cpp:343-349
 */
export type MainMenuTitleState<TImage> = {
  title: string;
  titleImage: MainMenuTitleImage<TImage>;
};

/**
 * Replacement for upstream `ZFontEngine::GetFont(...).Render`.
 * Role: Renders a main-menu title string with a browser font implementation.
 * Upstream: zgui_main_menu_base.cpp:348
 */
export type MainMenuTitleRenderer<TImage> = (
  font: FontType,
  text: string,
) => TImage;

const MAIN_MENU_BASE_IMAGE_FILES: ReadonlyArray<{
  name: MainMenuBaseImageName;
  filename: string;
}> = [
  {
    name: "topLeft",
    filename: "assets/other/main_menu_gui/menu_top_left.png",
  },
  {
    name: "topRight",
    filename: "assets/other/main_menu_gui/menu_top_right.png",
  },
  { name: "top", filename: "assets/other/main_menu_gui/menu_top.png" },
  { name: "left", filename: "assets/other/main_menu_gui/menu_left.png" },
  { name: "right", filename: "assets/other/main_menu_gui/menu_right.png" },
  { name: "bottom", filename: "assets/other/main_menu_gui/menu_bottom.png" },
  { name: "center", filename: "assets/other/main_menu_gui/menu_center.png" },
  { name: "warning", filename: "assets/other/main_menu_gui/menu_warning.png" },
];

/**
 * Port of upstream `ZGuiMainMenuBase::Init`.
 * Role: Loads static main-menu chrome images and marks the shared menu base initialized.
 * Upstream: zgui_main_menu_base.cpp:29-41
 */
export function initMainMenuBase(
  state: MainMenuBaseImageState,
  loadImage: MainMenuBaseImageLoader,
): void {
  state.images = {};

  for (const image of MAIN_MENU_BASE_IMAGE_FILES) {
    state.images[image.name] = loadImage(image.filename);
  }

  state.finishedInit = true;
}

/**
 * Port of upstream `ZGuiMainMenuBase::MakeTitle`.
 * Role: Lazily renders the main-menu title image when title text exists.
 * Upstream: zgui_main_menu_base.cpp:343-349
 */
export function makeMainMenuTitle<TImage>(
  state: MainMenuTitleState<TImage>,
  renderTitle: MainMenuTitleRenderer<TImage>,
): void {
  if (!state.title.length) return;
  if (state.titleImage.getBaseSurface()) return;

  state.titleImage.loadBaseImage(renderTitle(FontType.YellowMenu, state.title));
}

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
 * Port of upstream `ZGuiMainMenuBase::UpdateDimensions`.
 * Role: Aligns the close button to the menu's top-right corner.
 * Upstream: zgui_main_menu_base.cpp:43-46
 */
export function updateMainMenuDimensions(
  state: MainMenuUpdateDimensionsState,
): void {
  state.closeButton.setCoords(state.width - 16, 4);
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

export const MAIN_MENU_EVENT_TYPE_NAMES: readonly string[] = [
  "unknown",
  "click",
  "unclick",
  "motion",
  "keypress",
  "wheelup",
  "wheeldown",
];

export type MainMenuWidgetEventTarget = {
  widgetType: number;
  refId: number;
};

export type MainMenuWidgetEventLogger = (message: string) => void;

/**
 * Port of upstream `ZGuiMainMenuBase::HandleWidgetEvent`.
 * Role: Validates a base widget event and reports the same debug line as upstream `printf`.
 * Upstream: zgui_main_menu_base.cpp:243-250
 */
export function handleMainMenuBaseWidgetEvent(
  eventType: MainMenuEventType | number,
  eventWidget: MainMenuWidgetEventTarget | null | undefined,
  log: MainMenuWidgetEventLogger = (): void => undefined,
): void {
  if (!eventWidget) return;
  if (eventType < 0) return;
  if (eventType >= MainMenuEventType.MacGmmEvents) return;

  log(
    `ZGuiMainMenuBase::HandleWidgetEvent::${eventType}:${
      MAIN_MENU_EVENT_TYPE_NAMES[eventType] ?? ""
    } widget_type:${eventWidget.widgetType} ref_id:${eventWidget.refId}`,
  );
}

/**
 * Port of upstream `ZGuiMainMenuBase::WheelUpButton`.
 * Role: Clears menu flags, routes wheel-up input to widgets, and reports consuming widgets.
 * Upstream: zgui_main_menu_base.cpp:145-159
 */
export function wheelUpMainMenuBase(
  state: MainMenuWheelUpState,
  handleWidgetEvent: (
    eventType: MainMenuEventType,
    widget: MainMenuWidgetEventTarget,
  ) => void = handleMainMenuBaseWidgetEvent,
): boolean {
  let actionTaken = false;

  state.gmmFlags.clear();

  for (const widget of state.widgetList) {
    if (widget.wheelUpButton()) {
      handleWidgetEvent(MainMenuEventType.WheelUp, widget);
      actionTaken = true;
    }
  }

  return actionTaken;
}

/**
 * Port of upstream `ZGuiMainMenuBase::WheelDownButton`.
 * Role: Clears menu flags, routes wheel-down input to widgets, and reports consuming widgets.
 * Upstream: zgui_main_menu_base.cpp:161-175
 */
export function wheelDownMainMenuBase(
  state: MainMenuWheelDownState,
  handleWidgetEvent: (
    eventType: MainMenuEventType,
    widget: MainMenuWidgetEventTarget,
  ) => void = handleMainMenuBaseWidgetEvent,
): boolean {
  let actionTaken = false;

  state.gmmFlags.clear();

  for (const widget of state.widgetList) {
    if (widget.wheelDownButton()) {
      handleWidgetEvent(MainMenuEventType.WheelDown, widget);
      actionTaken = true;
    }
  }

  return actionTaken;
}

/**
 * Port of upstream `ZGuiMainMenuBase::KeyPress`.
 * Role: Clears menu flags, routes keyboard input to widgets, and reports consuming widgets.
 * Upstream: zgui_main_menu_base.cpp:129-143
 */
export function keyPressMainMenuBase(
  state: MainMenuKeyPressState,
  c: number,
  handleWidgetEvent: (
    eventType: MainMenuEventType,
    widget: MainMenuWidgetEventTarget,
  ) => void = handleMainMenuBaseWidgetEvent,
): boolean {
  let actionTaken = false;

  state.gmmFlags.clear();

  for (const widget of state.widgetList) {
    if (widget.keyPress(c)) {
      handleWidgetEvent(MainMenuEventType.Keypress, widget);
      actionTaken = true;
    }
  }

  return actionTaken;
}

/**
 * Port of upstream `ZGuiMainMenuBase::Motion`.
 * Role: Clears menu flags, drags the menu when grabbed, otherwise routes local pointer motion to widgets.
 * Upstream: zgui_main_menu_base.cpp:100-127
 */
export function motionMainMenuBase(
  state: MainMenuMotionState,
  x: number,
  y: number,
  handleWidgetEvent: (
    eventType: MainMenuEventType,
    widget: MainMenuWidgetEventTarget,
  ) => void = handleMainMenuBaseWidgetEvent,
): boolean {
  let actionTaken = false;

  state.gmmFlags.clear();

  if (state.clickGrabbed) {
    state.x = x - state.grabX;
    state.y = y - state.grabY;
    return true;
  }

  const translatedX = x - state.x;
  const translatedY = y - state.y;

  for (const widget of state.widgetList) {
    if (widget.motionButton(translatedX, translatedY)) {
      handleWidgetEvent(MainMenuEventType.Motion, widget);
      actionTaken = true;
    }
  }

  return actionTaken;
}

/**
 * Port of upstream `ZGuiMainMenuBase::UnClick`.
 * Role: Clears menu flags, releases drag state, handles close, then routes local pointer release to widgets.
 * Upstream: zgui_main_menu_base.cpp:212-241
 */
export function unClickMainMenuBase(
  state: MainMenuUnClickState,
  x: number,
  y: number,
  handleWidgetEvent: (
    eventType: MainMenuEventType,
    widget: MainMenuWidgetEventTarget,
  ) => void = handleMainMenuBaseWidgetEvent,
): boolean {
  let actionTaken = false;

  state.gmmFlags.clear();
  state.clickGrabbed = false;

  const translatedX = x - state.x;
  const translatedY = y - state.y;

  if (state.closeButton.unClickButton(translatedX, translatedY)) {
    state.killMe = true;
    return true;
  }

  for (const widget of state.widgetList) {
    if (widget.unClickButton(translatedX, translatedY)) {
      handleWidgetEvent(MainMenuEventType.Unclick, widget);
      actionTaken = true;
    }
  }

  return actionTaken || withinMainMenuDimensions(state, x, y);
}

/**
 * Port of upstream `ZGuiMainMenuBase::Click`.
 * Role: Clears menu flags, routes local pointer press to widgets, and starts window dragging on empty chrome.
 * Upstream: zgui_main_menu_base.cpp:177-210
 */
export function clickMainMenuBase(
  state: MainMenuClickState,
  x: number,
  y: number,
  handleWidgetEvent: (
    eventType: MainMenuEventType,
    widget: MainMenuWidgetEventTarget,
  ) => void = handleMainMenuBaseWidgetEvent,
): boolean {
  let actionTaken = false;

  state.gmmFlags.clear();

  const translatedX = x - state.x;
  const translatedY = y - state.y;

  if (state.closeButton.clickButton(translatedX, translatedY)) {
    actionTaken = true;
  }

  for (const widget of state.widgetList) {
    if (widget.clickButton(translatedX, translatedY)) {
      handleWidgetEvent(MainMenuEventType.Click, widget);
      actionTaken = true;
    }
  }

  const withinDimensions = withinMainMenuDimensions(state, x, y);

  if (!actionTaken && withinDimensions) {
    state.clickGrabbed = true;
    state.grabX = translatedX;
    state.grabY = translatedY;
  }

  return actionTaken || withinDimensions;
}
