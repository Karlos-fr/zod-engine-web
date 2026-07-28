/**
 * Upstream: gmm_select_map.h / zgui_main_menu_base.h
 */

/**
 * Marker exported from the map selection module.
 * Role: Marks an upstream header boundary.
 * Upstream: gmm_select_map.h:2
 */
export const GMM_SELECT_MAP_HEADER_GUARD_PORTED = true;

/**
 * Main menu base state consumed by selectable map-list helpers.
 * Role: Stores the map names that menu screens may present as selectable entries.
 * Upstream: zgui_main_menu_base.h:143
 */
export type SelectableMapListState = {
  selectableMapList: readonly string[] | null;
};

/**
 * Port of upstream `SetSelectableMapList`.
 * Role: Replaces the selectable map list for main-menu map selection screens.
 * Upstream: zgui_main_menu_base.h:143
 */
export function setSelectableMapList<TState extends SelectableMapListState>(
  state: TState,
  selectableMapList: readonly string[],
): TState {
  return {
    ...state,
    selectableMapList,
  };
}
