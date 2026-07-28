/**
 * Ported from Zod Engine.
 * Upstream: gmm_main_menu.h
 */

/**
 * Port of upstream `_ZGMM_MAIN_MENU_H_`.
 * Role: Marks an upstream header boundary.
 * Ledger: MAC-F72C27
 * Upstream: gmm_main_menu.h:2
 */
export const ZGMM_MAIN_MENU_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `gmm_main_menu_button`.
 * Role: Identifies the top-level main menu buttons handled by the menu screen.
 * Ledger: ENU-D27422
 * Upstream: gmm_main_menu.h:6-12
 */
export enum MainMenuButton {
  ChangeTeams = 0,
  ManageBots = 1,
  PlayerList = 2,
  SelectMap = 3,
  Options = 4,
  QuitGame = 5,
  MaxButtons = 6,
}
