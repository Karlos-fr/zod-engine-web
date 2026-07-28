/**
 * Upstream: constants.h / zhud.h / zhud.cpp
 */

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
 * Port of upstream `GetARefID`.
 * Role: Reports the active HUD reference identifier.
 * Upstream: zhud.h:122
 */
export function getHudARefId(state: { activeRefId: number }): number {
  return state.activeRefId;
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
