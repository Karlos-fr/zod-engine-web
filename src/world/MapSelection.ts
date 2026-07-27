/**
 * Ported from Zod Engine.
 * Upstream: gmm_select_map.h / zgui_main_menu_base.h
 * Symbols: _ZGMM_SELECT_MAP_H_, SetSelectableMapList
 */

/**
 * Marker exported from the map selection module.
 * Role: Marks the TypeScript module boundary for upstream `gmm_select_map.h`.
 * Ledger: MAC-415C0D
 * Upstream: gmm_select_map.h:2
 */
export const GMM_SELECT_MAP_HEADER_GUARD_PORTED = true;

/**
 * Main menu base state consumed by selectable map-list helpers.
 * Role: Stores the map names that menu screens may present as selectable entries.
 * Ledger: FUN-5BDE61
 * Upstream: zgui_main_menu_base.h:143
 * Adaptation: Replaces the upstream `vector<string> *selectable_map_list` pointer with an explicit readonly array reference.
 */
export type SelectableMapListState = {
  selectableMapList: readonly string[] | null;
};

/**
 * Port of upstream `SetSelectableMapList`.
 * Role: Replaces the selectable map list used by main-menu map selection screens.
 * Ledger: FUN-5BDE61
 * Upstream: zgui_main_menu_base.h:143
 * Adaptation: Returns updated state instead of mutating a C++ class member pointer. * - Preserves reference replacement semantics by storing the provided list.
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
