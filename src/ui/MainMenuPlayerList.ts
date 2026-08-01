/**
 * Upstream: gmm_player_list.h
 */
import {
  PlayerConnectionMode,
  TeamType,
} from "../simulation/SimulationConstants";
import {
  checkMainMenuListViewIndex,
  isMainMenuListEntryBefore,
  MainMenuListEntry,
  type MainMenuListEntryState,
  type MainMenuListViewState,
} from "./MainMenuWidgets";

/**
 * Port of upstream `_ZGMM_PLAYER_LIST_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: gmm_player_list.h:2
 */
export const ZGMM_PLAYER_LIST_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `GMMPlayerList::Process` call targets.
 * Role: Provides player-list setup and widget processing hooks.
 * Upstream: gmm_player_list.cpp:40-42
 */
export type MainMenuPlayerListProcessor = {
  setupList(): void;
  processWidgets(): void;
};

/**
 * Replacement for upstream `team_type_string` labels used by the player-list menu.
 * Role: Formats player-list rows with the owning team name.
 * Upstream: gmm_player_list.cpp:57
 */
export const MAIN_MENU_PLAYER_LIST_TEAM_LABELS: Readonly<Record<number, string>> = {
  [TeamType.Null]: "NULL",
  [TeamType.Red]: "RED",
  [TeamType.Blue]: "BLUE",
  [TeamType.Green]: "GREEN",
  [TeamType.Yellow]: "YELLOW",
  [TeamType.Purple]: "PURPLE",
  [TeamType.Teal]: "TEAL",
  [TeamType.White]: "WHITE",
  [TeamType.Black]: "BLACK",
};

/**
 * Port of upstream player-list `p_info` fields.
 * Role: Provides player identity, mode, and team fields consumed by setup-list rebuilding.
 * Upstream: gmm_player_list.cpp:54-57
 */
export type MainMenuPlayerListPlayerInfo = {
  name: string;
  playerId: number;
  team: number;
  mode: PlayerConnectionMode | number;
};

/**
 * Port of upstream `ZGMMLabel::SetText` target for the player count label.
 * Role: Receives the visible online-player count as text.
 * Upstream: gmm_player_list.cpp:61-62
 */
export type MainMenuPlayerListCountLabel = {
  setText(text: string): void;
};

/**
 * Port of upstream `GMMPlayerList::SetupList` state.
 * Role: Holds player info, target list entries, count label, and view clamp fields.
 * Upstream: gmm_player_list.cpp:45-75
 */
export type MainMenuPlayerListSetupState =
  MainMenuListViewState & {
    playerInfo: readonly MainMenuPlayerListPlayerInfo[] | null;
    entries: MainMenuListEntryState[];
    playersOnlineNumberLabel: MainMenuPlayerListCountLabel;
  };

/**
 * Port of upstream `GMMPlayerList::Process`.
 * Role: Refreshes the player list and processes its widgets.
 * Upstream: gmm_player_list.cpp:38-43
 */
export function processMainMenuPlayerList(
  state: MainMenuPlayerListProcessor,
): void {
  state.setupList();
  state.processWidgets();
}

/**
 * Port of upstream `GMMPlayerList::SetupList`.
 * Role: Rebuilds the visible human-player list, updates the online count label, sorts rows, and clamps the view index.
 * Upstream: gmm_player_list.cpp:45-75
 */
export function setupMainMenuPlayerList(
  state: MainMenuPlayerListSetupState,
): void {
  if (!state.playerInfo) return;

  state.entries.length = 0;

  for (const player of state.playerInfo) {
    if (player.mode === PlayerConnectionMode.Player) {
      const teamLabel =
        MAIN_MENU_PLAYER_LIST_TEAM_LABELS[player.team] ?? String(player.team);
      state.entries.push(
        new MainMenuListEntry(
          `${teamLabel}: ${player.name}`,
          player.playerId,
          player.team,
        ),
      );
    }
  }

  state.playersOnlineNumberLabel.setText(String(state.entries.length));
  state.entries.sort((a, b) => {
    if (isMainMenuListEntryBefore(a, b)) return -1;
    if (isMainMenuListEntryBefore(b, a)) return 1;
    return 0;
  });
  checkMainMenuListViewIndex(state);
}

/**
 * Port of upstream `GMMPlayerList::HandleWidgetEvent`.
 * Role: Hook for player-list widget events; upstream has no behavior.
 * Upstream: gmm_player_list.cpp:77-80
 */
export function handleMainMenuPlayerListWidgetEvent(
  eventType: number,
  eventWidget: unknown,
): void {
  void eventType;
  void eventWidget;
}
