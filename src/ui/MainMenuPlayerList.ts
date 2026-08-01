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
  MainMenuLabelJustifyType,
  MAIN_MENU_LABEL_HEIGHT_PIXELS,
  MainMenuListEntry,
  type MainMenuListEntryState,
  type MainMenuListViewState,
} from "./MainMenuWidgets";
import {
  MAIN_MENU_BOTTOM_MARGIN_PIXELS,
  MAIN_MENU_SIDE_MARGIN_PIXELS,
  MAIN_MENU_TITLE_MARGIN_PIXELS,
} from "./MainMenuBase";

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
 * Port of upstream `GMMPlayerList::SetupLayout1` label dependency surface.
 * Role: Receives player-list label text, position, dimensions, and justification.
 * Upstream: gmm_player_list.cpp:15-24
 */
export type MainMenuPlayerListLayoutLabel = {
  setText(text: string): void;
  setCoords(x: number, y: number): void;
  setDimensions(width: number, height: number): void;
  setJustification(justification: MainMenuLabelJustifyType): void;
};

/**
 * Port of upstream `GMMPlayerList::SetupLayout1` list dependency surface.
 * Role: Receives player-list position, dimensions, visible row count, and final height.
 * Upstream: gmm_player_list.cpp:27-32
 */
export type MainMenuPlayerListLayoutList = {
  setCoords(x: number, y: number): void;
  setDimensions(width: number, height: number): void;
  setVisibleEntries(visibleEntries: number): void;
  getHeight(): number;
};

/**
 * Port of upstream `GMMPlayerList::SetupLayout1` state.
 * Role: Holds player-list menu dimensions and widgets used to build layout 1.
 * Upstream: gmm_player_list.cpp:15-35
 */
export type MainMenuPlayerListLayoutState = {
  width: number;
  height: number;
  playersOnlineLabel: MainMenuPlayerListLayoutLabel;
  playersOnlineNumberLabel: MainMenuPlayerListLayoutLabel;
  playerList: MainMenuPlayerListLayoutList;
  widgetList: unknown[];
  updateDimensions(): void;
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
 * Port of upstream `GMMPlayerList::SetupLayout1`.
 * Role: Builds the player-list menu labels, list widget layout, final height, and widget order.
 * Upstream: gmm_player_list.cpp:13-36
 */
export function setupMainMenuPlayerListLayout(
  state: MainMenuPlayerListLayoutState,
): void {
  const contentWidth = state.width - MAIN_MENU_SIDE_MARGIN_PIXELS * 2;

  state.playersOnlineLabel.setText("Players Online:");
  state.playersOnlineLabel.setCoords(
    MAIN_MENU_SIDE_MARGIN_PIXELS + 4,
    MAIN_MENU_TITLE_MARGIN_PIXELS,
  );
  state.playersOnlineLabel.setDimensions(contentWidth, 0);
  state.playersOnlineLabel.setJustification(MainMenuLabelJustifyType.Normal);
  state.widgetList.push(state.playersOnlineLabel);

  state.playersOnlineNumberLabel.setText("50");
  state.playersOnlineNumberLabel.setCoords(
    MAIN_MENU_SIDE_MARGIN_PIXELS,
    MAIN_MENU_TITLE_MARGIN_PIXELS,
  );
  state.playersOnlineNumberLabel.setDimensions(contentWidth, 0);
  state.playersOnlineNumberLabel.setJustification(MainMenuLabelJustifyType.Right);
  state.widgetList.push(state.playersOnlineNumberLabel);

  state.playerList.setCoords(
    MAIN_MENU_SIDE_MARGIN_PIXELS,
    MAIN_MENU_TITLE_MARGIN_PIXELS + MAIN_MENU_LABEL_HEIGHT_PIXELS + 2,
  );
  state.playerList.setDimensions(contentWidth, 118);
  state.playerList.setVisibleEntries(8);
  state.widgetList.push(state.playerList);

  state.height =
    MAIN_MENU_TITLE_MARGIN_PIXELS +
    state.playerList.getHeight() +
    MAIN_MENU_BOTTOM_MARGIN_PIXELS +
    MAIN_MENU_LABEL_HEIGHT_PIXELS +
    2;

  state.updateDimensions();
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
