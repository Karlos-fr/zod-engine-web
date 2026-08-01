/**
 * Upstream: gmm_manage_bots.h / gmm_manage_bots.cpp
 */

import {
  ACTIVE_TEAM_TYPE_COUNT,
  PlayerConnectionMode,
} from "../simulation/SimulationConstants";
import { MainMenuEventType, type MainMenuFlag } from "./MainMenuBase";

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

/**
 * Port of upstream `GMMManageBots::CheckBots` player row input.
 * Role: Provides the team, mode, and ignored flag used to color bot controls.
 * Upstream: gmm_manage_bots.cpp:85-87
 */
export type MainMenuManageBotsPlayerInfo = {
  team: number;
  mode: PlayerConnectionMode | number;
  ignored: boolean;
};

/**
 * Port of upstream `GMMManageBots::CheckBots` button dependency surface.
 * Role: Receives active/inactive coloring for start and stop bot buttons.
 * Upstream: gmm_manage_bots.cpp:92-100
 */
export type MainMenuManageBotsButton = {
  setGreen(active: boolean): void;
};

/**
 * Port of upstream `GMMManageBots::CheckBots`.
 * Role: Colors each team's start/stop controls from active, non-ignored bot players.
 * Upstream: gmm_manage_bots.cpp:74-103
 */
export function checkMainMenuManageBots(
  playerInfo: readonly MainMenuManageBotsPlayerInfo[] | null,
  startButtons: readonly MainMenuManageBotsButton[],
  stopButtons: readonly MainMenuManageBotsButton[],
): void {
  if (!playerInfo) return;

  const teamHasBot = Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, () => false);

  for (const player of playerInfo) {
    if (
      player.mode === PlayerConnectionMode.Bot &&
      !player.ignored &&
      player.team >= 0 &&
      player.team < ACTIVE_TEAM_TYPE_COUNT
    ) {
      teamHasBot[player.team] = true;
    }
  }

  for (let i = 0; i < ACTIVE_TEAM_TYPE_COUNT; i += 1) {
    if (teamHasBot[i]) {
      startButtons[i]?.setGreen(true);
      stopButtons[i]?.setGreen(false);
    } else {
      startButtons[i]?.setGreen(false);
      stopButtons[i]?.setGreen(true);
    }
  }
}

/**
 * Port of upstream `GMMManageBots::HandleWidgetEvent` button dependency surface.
 * Role: Provides the widget reference id used to match start and stop controls.
 * Upstream: gmm_manage_bots.cpp:118-124
 */
export type MainMenuManageBotsWidgetButton = {
  refId: number;
};

/**
 * Port of upstream `GMMManageBots::HandleWidgetEvent`.
 * Role: Records requested bot start/stop actions from manage-bots unclick events.
 * Upstream: gmm_manage_bots.cpp:105-133
 */
export function handleMainMenuManageBotsWidgetEvent(
  flags: Pick<MainMenuFlag, "startBot" | "startBotTeam" | "stopBot" | "stopBotTeam">,
  eventType: MainMenuEventType | number,
  eventWidget: MainMenuManageBotsWidgetButton | null | undefined,
  startButtons: readonly MainMenuManageBotsWidgetButton[],
  stopButtons: readonly MainMenuManageBotsWidgetButton[],
): void {
  if (!eventWidget) return;

  if (eventType !== MainMenuEventType.Unclick) return;

  const widgetRefId = eventWidget.refId;

  for (let i = 0; i < ACTIVE_TEAM_TYPE_COUNT; i += 1) {
    if (widgetRefId === startButtons[i]?.refId) {
      flags.startBot = true;
      flags.startBotTeam = i;
      break;
    }

    if (widgetRefId === stopButtons[i]?.refId) {
      flags.stopBot = true;
      flags.stopBotTeam = i;
      break;
    }
  }
}
