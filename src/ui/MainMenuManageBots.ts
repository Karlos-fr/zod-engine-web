/**
 * Upstream: gmm_manage_bots.h / gmm_manage_bots.cpp
 */

/**
 * Port of upstream `_ZGMM_MANAGE_BOTS_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: gmm_manage_bots.h:2
 */
export const ZGMM_MANAGE_BOTS_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `max_rows`.
 * Role: Defines the maximum number of team rows per column in `GMMManageBots::SetupLayout1`.
 * Upstream: gmm_manage_bots.cpp:16
 */
export const MANAGE_BOTS_MAX_ROWS_PER_COLUMN = 4;

/**
 * Port of upstream `label_width`.
 * Role: Defines the width of each team label in the manage-bots menu layout.
 * Upstream: gmm_manage_bots.cpp:17
 */
export const MANAGE_BOTS_TEAM_LABEL_WIDTH_PIXELS = 40;

/**
 * Port of upstream `start_width`.
 * Role: Defines the width of the "On" bot-control button.
 * Upstream: gmm_manage_bots.cpp:18
 */
export const MANAGE_BOTS_START_BUTTON_WIDTH_PIXELS = 25;

/**
 * Port of upstream `stop_width`.
 * Role: Defines the width of the "Off" bot-control button.
 * Upstream: gmm_manage_bots.cpp:19
 */
export const MANAGE_BOTS_STOP_BUTTON_WIDTH_PIXELS = 25;

/**
 * Port of upstream `button_spacer`.
 * Role: Defines the horizontal spacing between manage-bots menu controls.
 * Upstream: gmm_manage_bots.cpp:20
 */
export const MANAGE_BOTS_BUTTON_SPACER_PIXELS = 2;

/**
 * Port of upstream `GMMManageBots::Process` call targets.
 * Role: Provides bot-state refresh and widget processing hooks.
 * Upstream: gmm_manage_bots.cpp:69-71
 */
export type MainMenuManageBotsProcessor = {
  checkBots(): void;
  processWidgets(): void;
};

/**
 * Port of upstream `GMMManageBots::Process`.
 * Role: Refreshes bot controls and processes manage-bots widgets.
 * Upstream: gmm_manage_bots.cpp:67-72
 */
export function processMainMenuManageBots(
  state: MainMenuManageBotsProcessor,
): void {
  state.checkBots();
  state.processWidgets();
}
