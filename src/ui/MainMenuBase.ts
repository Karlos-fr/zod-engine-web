/**
 * Ported from Zod Engine.
 * Upstream: zgui_main_menu_base.h
 */

/**
 * Port of upstream `_ZGUIMAINMENUBASE_H_`.
 * Role: Marks an upstream header boundary.
 * Ledger: MAC-03B1C6
 * Upstream: zgui_main_menu_base.h:2
 */
export const ZGUI_MAIN_MENU_BASE_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `GMM_SIDE_MARGIN`.
 * Role: Defines the side margin for main-menu layouts.
 * Ledger: MAC-7B1DAE
 * Upstream: zgui_main_menu_base.h:17
 */
export const MAIN_MENU_SIDE_MARGIN_PIXELS = 5;

/**
 * Port of upstream `GMM_TOP_MARGIN`.
 * Role: Defines the top margin for main-menu layouts.
 * Ledger: MAC-41B1C6
 * Upstream: zgui_main_menu_base.h:18
 */
export const MAIN_MENU_TOP_MARGIN_PIXELS = 5;

/**
 * Port of upstream `GMM_BOTTOM_MARGIN`.
 * Role: Defines the bottom margin for main-menu layouts.
 * Ledger: MAC-6EC2A3
 * Upstream: zgui_main_menu_base.h:19
 */
export const MAIN_MENU_BOTTOM_MARGIN_PIXELS = 5;

/**
 * Port of upstream `GMM_TITLE_HEIGHT`.
 * Role: Defines the title row height for main-menu layouts.
 * Ledger: MAC-3EB2BE
 * Upstream: zgui_main_menu_base.h:20
 */
export const MAIN_MENU_TITLE_HEIGHT_PIXELS = 18;

/**
 * Port of upstream `menu_type`.
 * Role: Identifies the active main-menu screen.
 * Ledger: ENU-021003
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
 * Port of upstream `gmm_event_type`.
 * Role: Identifies input event categories consumed by main-menu widgets.
 * Ledger: ENU-2F8442
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
