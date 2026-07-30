/**
 * Upstream: constants.h / zhud.h / zhud.cpp
 */

import type { PlanetType, TeamType } from "../simulation/SimulationConstants";
import {
  PORTRAIT_BASE_HEIGHT_PIXELS,
  PORTRAIT_BASE_WIDTH_PIXELS,
  setPortraitTeam,
  setPortraitTerrainType,
  type PortraitTeamState,
  type PortraitTerrainState,
} from "../simulation/PortraitAnimation";

/**
 * Port of upstream `_ZHUD_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: zhud.h:2
 */
export const ZHUD_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `HUD_WIDTH`.
 * Role: Defines the reserved HUD width on the game viewport.
 * Upstream: constants.h:17
 */
export const HUD_WIDTH_PIXELS = 100;

/**
 * Port of upstream `HUD_HEIGHT`.
 * Role: Defines the reserved HUD height on the game viewport.
 * Upstream: constants.h:18
 */
export const HUD_HEIGHT_PIXELS = 36;

/**
 * Port of upstream `hud_buttons`.
 * Role: Identifies command buttons displayed by the HUD.
 * Upstream: zhud.h:15-18
 */
export enum HudButton {
  A = 0,
  B = 1,
  D = 2,
  G = 3,
  R = 4,
  T = 5,
  V = 6,
  Z = 7,
  Menu = 8,
  MaxHudButtons = 9,
}

/**
 * Port of upstream `hub_buttons_string`.
 * Role: Maps HUD button identifiers to their asset-name stem.
 * Upstream: zhud.h:20-23
 */
export const HUD_BUTTON_NAMES: readonly string[] = [
  "a_button",
  "b_button",
  "d_button",
  "g_button",
  "r_button",
  "t_button",
  "v_button",
  "z_button",
  "menu_button",
] as const;

/**
 * Port of upstream `hud_button_state`.
 * Role: Identifies the visual interaction state of a HUD command button.
 * Upstream: zhud.h:25-28
 */
export enum HudButtonState {
  Active = 0,
  Inactive = 1,
  Pressed = 2,
  MaxHudButtonStates = 3,
}

/**
 * Port of upstream `HubButton`.
 * Role: Stores the HUD button type and current visual state.
 * Upstream: zhud.h:53-68
 */
export class HubButton {
  type: HudButton;
  state: HudButtonState;
  name: string;
  x = 0;
  y = 0;
  shiftX = 0;
  shiftY = 0;

  constructor(type: HudButton = HudButton.A, state: HudButtonState = HudButtonState.Inactive) {
    this.type = type;
    this.state = state;
    this.name = HUD_BUTTON_NAMES[type] ?? "unknown_button";
  }

  /**
   * Port of upstream `HubButton::SetType`.
   * Role: Stores the HUD button command type and updates the asset-name stem.
   * Upstream: zhud.cpp:15-19
   */
  setType(type: HudButton): void {
    this.type = type;
    this.name = HUD_BUTTON_NAMES[type] ?? "unknown_button";
  }

  /**
   * Port of upstream `HubButton::CurrentState`.
   * Role: Returns the current HUD button visual state.
   * Upstream: zhud.cpp:34-37
   */
  currentState(): HudButtonState {
    return this.state;
  }

  /**
   * Port of upstream `HubButton::SetState`.
   * Role: Stores the current HUD button visual state.
   * Upstream: zhud.cpp:39-42
   */
  setState(state: HudButtonState): void {
    this.state = state;
  }

  /**
   * Port of upstream `HubButton::SetShift`.
   * Role: Stores the button render and hit-test offset.
   * Upstream: zhud.cpp:44-48
   */
  setShift(shiftX: number, shiftY: number): void {
    this.shiftX = shiftX;
    this.shiftY = shiftY;
  }

  /**
   * Port of upstream `HubButton::GetType`.
   * Role: Returns the HUD button command type.
   * Upstream: zhud.cpp:121-124
   */
  getType(): HudButton {
    return this.type;
  }

  /**
   * Port of upstream `HubButton::WithinCords`.
   * Role: Tests whether a point falls within the shifted current-state button image bounds.
   * Upstream: zhud.cpp:21-32
   */
  withinCords(
    pointX: number,
    pointY: number,
    currentImageSize: { width: number; height: number },
  ): boolean {
    const shiftedX = this.x + this.shiftX;
    const shiftedY = this.y + this.shiftY;

    if (pointX < shiftedX) return false;
    if (pointY < shiftedY) return false;
    if (pointX > shiftedX + currentImageSize.width) return false;
    if (pointY > shiftedY + currentImageSize.height) return false;

    return true;
  }
}

/**
 * Port of upstream `hud_reponse_type`.
 * Role: Identifies the HUD interaction target returned by input handling.
 * Upstream: zhud.h:30-33
 */
export enum HudResponseType {
  Button = 0,
  MiniMap = 1,
  JumpToUnit = 2,
}

/**
 * Port of upstream `hud_click_response`.
 * Role: Carries the result of HUD input handling.
 * Upstream: zhud.h:35-52
 */
export class HudClickResponse {
  used = false;
  type = -1;
  button = 0;
  miniX = 0;
  miniY = 0;
  jumpRefId = -1;

  constructor() {
    this.clear();
  }

  /**
   * Port of upstream `hud_click_response::clear`.
   * Role: Resets whether a HUD click response is active and clears jump metadata.
   * Upstream: zhud.h:46-51
   */
  clear(): void {
    this.used = false;
    this.type = -1;
    this.jumpRefId = -1;
  }
}

export type HudMiniMapClickTarget = {
  clickedMap(x: number, y: number): { mapX: number; mapY: number } | null;
};

/**
 * Port of upstream `ZHud::OverMiniMap`.
 * Role: Converts a HUD minimap click into map coordinates when the cursor is over the HUD strip.
 * Upstream: zhud.cpp:305-322
 */
export function overHudMiniMap(
  miniMap: HudMiniMapClickTarget,
  x: number,
  y: number,
  screenWidth: number,
  screenHeight: number,
): { miniX: number; miniY: number } | null {
  if (x < screenWidth - HUD_WIDTH_PIXELS) {
    return null;
  }

  const offsetX = screenWidth - 648;
  const offsetY = screenHeight - 484;
  const rx = x - offsetX;
  const ry = y - offsetY;
  const clicked = miniMap.clickedMap(rx - 555, ry - 299);

  if (!clicked) {
    return null;
  }

  return {
    miniX: clicked.mapX,
    miniY: clicked.mapY,
  };
}

/**
 * Port of upstream `zhud_end_unit`.
 * Role: Stores object identifiers shown in the HUD end-unit sequence.
 * Upstream: zhud.h:77-89
 */
export class HudEndUnit {
  objectType: number;
  objectId: number;
  renderObjectId: number;

  constructor(objectType = 0, objectId = 0, renderObjectId = 0) {
    this.objectType = objectType;
    this.objectId = objectId;
    this.renderObjectId = renderObjectId;
  }
}

/**
 * Port of upstream `ZHud` end-animation state.
 * Role: Stores the queued HUD end-unit animations and their timing state.
 * Upstream: zhud.h:189-192
 */
export type HudEndAnimationState = {
  doEndAnimations: boolean;
  doEndAnimationsWon: boolean;
  nextEndAnimTime: number;
  endAnimations: HudEndUnit[];
};

/**
 * Port of upstream `ZHud` active reference timing state.
 * Role: Stores the active HUD reference id and scheduled activity prompt timings.
 * Upstream: zhud.h:177, zhud.h:197-201
 */
export type HudARefState = {
  activeRefId: number;
  ztime: { ztime: number } | null;
  nextACheckTime: number;
  nextAFlashTime: number;
  nextAAnimTime: number;
};

/**
 * Port of upstream `ZHud` selected object state.
 * Role: Holds the currently selected HUD object reference and its selection setter.
 * Upstream: zhud.cpp:191-197
 */
export type HudSelectedObjectState<TObject = unknown> = {
  selectedObject: TObject | null;
  setSelectedObject(selectedObject: TObject | null): void;
};

/**
 * Port of upstream `ZObject::PlayAcknowledgeAnim` dependency surface.
 * Role: Provides the selected object acknowledge animation used by HUD commands.
 * Upstream: zhud.cpp:215
 */
export type HudSelectedCommandObject<TPortrait = unknown> = {
  playAcknowledgeAnim(portrait: TPortrait, noWay: boolean): void;
};

/**
 * Port of upstream `ZHud` selected command state.
 * Role: Holds the selected object and portrait used for HUD command acknowledgement.
 * Upstream: zhud.cpp:212-216
 */
export type HudSelectedCommandState<TPortrait = unknown> = {
  selectedObject: HudSelectedCommandObject<TPortrait> | null;
  portrait: TPortrait;
};

/**
 * Port of upstream `ZSDL_Surface::Unload` dependency surface.
 * Role: Releases HUD text image resources owned by resettable HUD state.
 * Upstream: zhud.cpp:180
 */
export type HudUnloadableTextImage = {
  unload(): void;
};

/**
 * Port of upstream `ZHud` resettable game state.
 * Role: Holds HUD state cleared when the current game resets.
 * Upstream: zhud.cpp:172-181
 */
export type HudResetGameState<TObject = unknown> = {
  doEndAnimations: boolean;
  endAnimations: HudEndUnit[];
  activeRefId: number;
  selectedObject: TObject | null;
  setSelectedObject(selectedObject: TObject | null): void;
  unitAmount: number;
  unitAmountText: HudUnloadableTextImage;
};

/**
 * Port of upstream `GetARefID`.
 * Role: Reports the active HUD reference identifier.
 * Upstream: zhud.h:122
 */
export function getHudARefId(state: { activeRefId: number }): number {
  return state.activeRefId;
}

/**
 * Port of upstream `ZHud::SetARefID`.
 * Role: Updates the active HUD reference id and schedules its prompt timers.
 * Upstream: zhud.cpp:597-609
 */
export function setHudARefId(
  state: HudARefState,
  activeRefId: number,
  randomInt: () => number = () => Math.floor(Math.random() * 2147483647),
): void {
  state.activeRefId = activeRefId;

  if (!state.ztime) return;

  const theTime = state.ztime.ztime;
  state.nextACheckTime = theTime + 0.25;
  state.nextAFlashTime = theTime + 0.15;
  state.nextAAnimTime = theTime + 5 + 0.01 * (Math.trunc(randomInt()) % 300);
}

/**
 * Port of upstream `ZHud::DeleteObject`.
 * Role: Clears the HUD selection when the deleted object is currently selected.
 * Upstream: zhud.cpp:191-197
 */
export function deleteHudObject<TObject>(
  state: HudSelectedObjectState<TObject>,
  object: TObject,
): void {
  if (state.selectedObject === object) {
    state.setSelectedObject(null);
  }
}

/**
 * Port of upstream `ZHud::GiveSelectedCommand`.
 * Role: Plays the selected object's acknowledge animation when a HUD command is issued.
 * Upstream: zhud.cpp:212-216
 */
export function giveHudSelectedCommand<TPortrait>(
  state: HudSelectedCommandState<TPortrait>,
  noWay: boolean,
): void {
  state.selectedObject?.playAcknowledgeAnim(state.portrait, noWay);
}

/**
 * Port of upstream `ZHud::ResetGame`.
 * Role: Clears transient HUD game state and releases the unit-count text image.
 * Upstream: zhud.cpp:172-181
 */
export function resetHudGame<TObject>(
  state: HudResetGameState<TObject>,
): void {
  state.doEndAnimations = false;
  state.endAnimations.length = 0;
  state.activeRefId = -1;
  state.setSelectedObject(null);
  state.unitAmount = -1;
  state.unitAmountText.unload();
}

/**
 * Port of upstream `ZHud::max_units`.
 * Role: Stores the maximum unit count rendered by the HUD.
 * Upstream: zhud.h:175
 */
export type HudMaxUnitsState = {
  maxUnits: number;
};

/**
 * Port of upstream `ZHud` unit amount render state.
 * Role: Stores the current unit count and whether its HUD text needs rerendering.
 * Upstream: zhud.cpp:1229-1237
 */
export type HudUnitAmountState = {
  unitAmount: number;
  rerenderUnitAmount: boolean;
};

/**
 * Port of upstream `ZHud::ztime`.
 * Role: Stores the simulation clock reference used by HUD timers.
 * Upstream: zhud.h:201
 */
export type HudZTimeState<TTime = unknown> = {
  ztime: TTime | null;
};

/**
 * Port of upstream `ZHud` terrain state.
 * Role: Stores the HUD terrain palette and the portraits sharing that palette.
 * Upstream: zhud.h:163, zhud.h:183-184
 */
export type HudTerrainState = {
  terrain: PlanetType;
  portrait: PortraitTerrainState;
  aportrait: PortraitTerrainState;
};

/**
 * Port of upstream `ZHud` team state.
 * Role: Stores the HUD team palette and the portraits sharing that palette.
 * Upstream: zhud.h:164, zhud.h:183-184
 */
export type HudTeamState = {
  team: TeamType | number;
  portrait: PortraitTeamState;
  aportrait: PortraitTeamState;
};

/**
 * Port of upstream `ZHud::SetMaxUnits`.
 * Role: Updates the maximum unit count rendered by the HUD.
 * Upstream: zhud.cpp:1224-1227
 */
export function setHudMaxUnits(state: HudMaxUnitsState, maxUnits: number): void {
  state.maxUnits = maxUnits;
}

/**
 * Port of upstream `ZHud::SetUnitAmount`.
 * Role: Updates the rendered unit count and marks it for rerendering when it changes.
 * Upstream: zhud.cpp:1229-1237
 */
export function setHudUnitAmount(
  state: HudUnitAmountState,
  unitAmount: number,
): void {
  if (state.unitAmount === unitAmount) return;

  state.unitAmount = unitAmount;
  state.rerenderUnitAmount = true;
}

/**
 * Port of upstream `ZHud::SetZTime`.
 * Role: Stores the simulation clock reference used by HUD timers.
 * Upstream: zhud.cpp:1274-1277
 */
export function setHudZTime<TTime>(
  state: HudZTimeState<TTime>,
  ztime: TTime | null,
): void {
  state.ztime = ztime;
}

/**
 * Port of upstream `ZHud::SetTerrainType`.
 * Role: Updates the HUD terrain palette and both HUD portraits.
 * Upstream: zhud.cpp:204-210
 */
export function setHudTerrainType(
  state: HudTerrainState,
  terrain: PlanetType,
): void {
  state.terrain = terrain;
  setPortraitTerrainType(state.portrait, terrain);
  setPortraitTerrainType(state.aportrait, terrain);
}

/**
 * Port of upstream `ZHud::SetTeam`.
 * Role: Updates the HUD team palette and both HUD portraits.
 * Upstream: zhud.cpp:1239-1245
 */
export function setHudTeam(state: HudTeamState, team: TeamType | number): void {
  state.team = team;
  setPortraitTeam(state.portrait, team);
  setPortraitTeam(state.aportrait, team);
}

/**
 * Port of upstream `ZHud::StartEndAnimations`.
 * Role: Starts HUD end-unit animations and copies their queued units.
 * Upstream: zhud.cpp:183-189
 */
export function startHudEndAnimations(
  state: HudEndAnimationState,
  endAnimations: readonly HudEndUnit[],
  won: boolean,
): void {
  state.doEndAnimations = true;
  state.doEndAnimationsWon = won;
  state.nextEndAnimTime = 0;
  state.endAnimations = endAnimations.map(
    (unit) => new HudEndUnit(unit.objectType, unit.objectId, unit.renderObjectId),
  );
}

/**
 * Port of upstream `port_x`.
 * Role: Defines the HUD portrait hit-test x coordinate.
 * Upstream: zhud.cpp:326
 */
export const HUD_PORTRAIT_X_PIXELS = 556;

/**
 * Port of upstream `port_y`.
 * Role: Defines the HUD portrait hit-test y coordinate.
 * Upstream: zhud.cpp:327
 */
export const HUD_PORTRAIT_Y_PIXELS = 44;

/**
 * Port of upstream `ZHud::OverPortrait`.
 * Role: Tests whether a HUD-relative point is inside the active portrait bounds.
 * Upstream: zhud.cpp:324-338
 */
export function overHudPortrait(pointX: number, pointY: number): boolean {
  if (pointX < HUD_PORTRAIT_X_PIXELS) return false;
  if (pointX > HUD_PORTRAIT_X_PIXELS + PORTRAIT_BASE_WIDTH_PIXELS) return false;
  if (pointY < HUD_PORTRAIT_Y_PIXELS) return false;
  if (pointY > HUD_PORTRAIT_Y_PIXELS + PORTRAIT_BASE_HEIGHT_PIXELS) return false;

  return true;
}

/**
 * Port of upstream `max_dist`.
 * Role: Defines the maximum health-bar fill distance.
 * Upstream: zhud.cpp:1013
 */
export const HUD_HEALTH_BAR_MAX_FILL_PIXELS = 74;

/**
 * Port of upstream `y_down_shift`.
 * Role: Defines the downward y offset for the HUD timer.
 * Upstream: zhud.cpp:1074
 */
export const HUD_TIMER_Y_DOWN_SHIFT_PIXELS = 9;

/**
 * Port of upstream `x_hours_shift`.
 * Role: Defines the x offset for the HUD timer hours field.
 * Upstream: zhud.cpp:1075
 */
export const HUD_TIMER_HOURS_X_SHIFT_PIXELS = 38;

/**
 * Port of upstream `x_minutes_shift`.
 * Role: Defines the x offset for the HUD timer minutes field.
 * Upstream: zhud.cpp:1076
 */
export const HUD_TIMER_MINUTES_X_SHIFT_PIXELS =
  HUD_TIMER_HOURS_X_SHIFT_PIXELS + 14;

/**
 * Port of upstream `x_seconds_shift`.
 * Role: Defines the x offset for the HUD timer seconds field.
 * Upstream: zhud.cpp:1077
 */
export const HUD_TIMER_SECONDS_X_SHIFT_PIXELS =
  HUD_TIMER_MINUTES_X_SHIFT_PIXELS + 23;
