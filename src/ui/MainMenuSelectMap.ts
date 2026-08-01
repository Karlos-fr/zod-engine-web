/**
 * Upstream: gmm_select_map.h / gmm_select_map.cpp
 */

import {
  checkMainMenuListViewIndex,
  MainMenuListEntry,
  type MainMenuListViewState,
} from "./MainMenuWidgets";

/**
 * Port of upstream `_ZGMM_SELECT_MAP_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: gmm_select_map.h:2
 */
export const ZGMM_SELECT_MAP_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `GMMSelectMap::map_list` dependency surface.
 * Role: Holds the selectable-map list entries and scroll position.
 * Upstream: gmm_select_map.h:11, gmm_select_map.cpp:92-99
 */
export type MainMenuSelectMapListState = MainMenuListViewState & {
  entries: MainMenuListEntry[];
};

/**
 * Port of upstream `GMMSelectMap::selectable_map_list` dependency surface.
 * Role: Stores the map names available for the select-map menu.
 * Upstream: zgui_main_menu_base.h:143, gmm_select_map.cpp:89
 */
export type MainMenuSelectMapState = {
  selectableMapList: readonly string[] | null;
  mapList: MainMenuSelectMapListState;
};

/**
 * Port of upstream `GMMSelectMap::Process` call target.
 * Role: Provides widget processing for the select-map menu.
 * Upstream: gmm_select_map.cpp:50
 */
export type MainMenuSelectMapProcessor = MainMenuSelectMapState & {
  processWidgets(): void;
};

/**
 * Port of upstream `GMMSelectMap::SetupList`.
 * Role: Refreshes map-list entries from the selectable map names when the list size changes.
 * Upstream: gmm_select_map.cpp:87-100
 */
export function setupMainMenuSelectMapList(
  state: MainMenuSelectMapState,
): void {
  const selectableMapList = state.selectableMapList;

  if (!selectableMapList) return;
  if (selectableMapList.length === state.mapList.entries.length) return;

  state.mapList.entries.length = 0;

  selectableMapList.forEach((mapName, index) => {
    state.mapList.entries.push(new MainMenuListEntry(mapName, index, index));
  });

  checkMainMenuListViewIndex(state.mapList);
}

/**
 * Port of upstream `GMMSelectMap::Process`.
 * Role: Refreshes the selectable map list and processes select-map widgets.
 * Upstream: gmm_select_map.cpp:46-51
 */
export function processMainMenuSelectMap(
  state: MainMenuSelectMapProcessor,
): void {
  setupMainMenuSelectMapList(state);
  state.processWidgets();
}
