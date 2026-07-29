/**
 * Upstream: gmm_change_teams.h / gmm_change_teams.cpp
 */
import { ACTIVE_TEAM_TYPE_COUNT } from "../simulation/SimulationConstants";

/**
 * Port of upstream `_ZGMM_CHANGE_TEAMS_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: gmm_change_teams.h:2
 */
export const ZGMM_CHANGE_TEAMS_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream team button highlight dependency surface.
 * Role: Provides green-state assignment for change-team buttons.
 * Upstream: gmm_change_teams.cpp:203-206
 */
export type ChangeTeamsHighlightButton = {
  setGreen(isGreen: boolean): void;
};

/**
 * Port of upstream `GMMChangeTeams` team highlight fields.
 * Role: Holds the current player team and the team buttons highlighted by the menu.
 * Upstream: gmm_change_teams.cpp:196-207
 */
export type ChangeTeamsHighlightState = {
  playerTeam: number | null;
  teamButtons: ChangeTeamsHighlightButton[];
};

/**
 * Port of upstream change-teams widget processing dependency surface.
 * Role: Provides per-frame widget processing for the change-teams menu.
 * Upstream: gmm_change_teams.cpp:193
 */
export type ChangeTeamsWidgetProcessor = {
  processWidgets(): void;
};

/**
 * Port of upstream `GMMChangeTeams` process fields.
 * Role: Holds the state needed to refresh team highlighting and process widgets.
 * Upstream: gmm_change_teams.cpp:189-194
 */
export type ChangeTeamsProcessState = ChangeTeamsHighlightState &
  ChangeTeamsWidgetProcessor;

/**
 * Port of upstream `GMMChangeTeams::HighlightOurTeam`.
 * Role: Highlights the current player team button when the team value is valid.
 * Upstream: gmm_change_teams.cpp:196-207
 */
export function highlightOurChangeTeam(
  state: ChangeTeamsHighlightState,
): void {
  if (state.playerTeam === null) return;
  if (state.playerTeam < 0) return;
  if (state.playerTeam >= ACTIVE_TEAM_TYPE_COUNT) return;

  for (let i = 0; i < ACTIVE_TEAM_TYPE_COUNT; i += 1) {
    state.teamButtons[i]?.setGreen(false);
  }

  state.teamButtons[state.playerTeam]?.setGreen(true);
}

/**
 * Port of upstream `GMMChangeTeams::Process`.
 * Role: Refreshes the current-team highlight before processing menu widgets.
 * Upstream: gmm_change_teams.cpp:189-194
 */
export function processChangeTeamsMenu(state: ChangeTeamsProcessState): void {
  highlightOurChangeTeam(state);
  state.processWidgets();
}

/**
 * Port of upstream `button_width`.
 * Role: Defines the width of the "Join" buttons in `GMMChangeTeams::SetupLayout4`.
 * Upstream: gmm_change_teams.cpp:144
 */
export const CHANGE_TEAMS_JOIN_BUTTON_WIDTH_PIXELS = 40;
