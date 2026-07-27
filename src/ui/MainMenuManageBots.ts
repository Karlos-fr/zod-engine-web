/**
 * Ported from Zod Engine.
 * Upstream: gmm_manage_bots.h / gmm_manage_bots.cpp
 * Symbols: see entity comments
 * Ledger: see entity comments
 */

/**
 * Adaptation of upstream `_ZGMM_MANAGE_BOTS_H_`.
 * Role: Marks the TypeScript module boundary for upstream `gmm_manage_bots.h`.
 * Ledger: MAC-2D309A
 * Upstream: gmm_manage_bots.h:2
 */
export const ZGMM_MANAGE_BOTS_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `max_rows`.
 * Role: Defines the maximum number of team rows per column in `GMMManageBots::SetupLayout1`.
 * Ledger: CON-0890AC
 * Upstream: gmm_manage_bots.cpp:16
 */
export const MANAGE_BOTS_MAX_ROWS_PER_COLUMN = 4;

/**
 * Port of upstream `label_width`.
 * Role: Defines the width of each team label in the manage-bots menu layout.
 * Ledger: CON-910E76
 * Upstream: gmm_manage_bots.cpp:17
 */
export const MANAGE_BOTS_TEAM_LABEL_WIDTH_PIXELS = 40;

/**
 * Port of upstream `start_width`.
 * Role: Defines the width of the "On" bot-control button.
 * Ledger: CON-A8B807
 * Upstream: gmm_manage_bots.cpp:18
 */
export const MANAGE_BOTS_START_BUTTON_WIDTH_PIXELS = 25;

/**
 * Port of upstream `stop_width`.
 * Role: Defines the width of the "Off" bot-control button.
 * Ledger: CON-5C1C35
 * Upstream: gmm_manage_bots.cpp:19
 */
export const MANAGE_BOTS_STOP_BUTTON_WIDTH_PIXELS = 25;

/**
 * Port of upstream `button_spacer`.
 * Role: Defines the horizontal spacing between manage-bots menu controls.
 * Ledger: CON-8B3D98
 * Upstream: gmm_manage_bots.cpp:20
 */
export const MANAGE_BOTS_BUTTON_SPACER_PIXELS = 2;
