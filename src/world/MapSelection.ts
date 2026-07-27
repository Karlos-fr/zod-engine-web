/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - File: gmm_select_map.h / zgui_main_menu_base.h
 * - Symbols: _ZGMM_SELECT_MAP_H_, SetSelectableMapList
 * - Ledger: MAC-415C0D, FUN-5BDE61
 *
 * Porting notes:
 * - C header guards for map selection UI state are represented by ES module
 *   boundaries.
 * - Menu base pointer setters are represented as explicit state updates.
 */

/**
 * Marker exported from the map selection module.
 *
 * Role:
 * - Provides a concrete module boundary for the adapted `gmm_select_map.h`
 *   include guard before the full `GMMSelectMap` menu class is ported.
 *
 * Ledger: MAC-415C0D
 * Upstream: gmm_select_map.h:2
 *
 * Adaptation:
 * - Replaces the C `_ZGMM_SELECT_MAP_H_` header guard with TypeScript module
 *   loading.
 */
export const GMM_SELECT_MAP_HEADER_GUARD_PORTED = true;

/**
 * Main menu base state consumed by selectable map-list helpers.
 *
 * Role:
 * - Stores the map names that menu screens may present as selectable entries.
 *
 * Ledger: FUN-5BDE61
 * Upstream: zgui_main_menu_base.h:143
 *
 * Adaptation:
 * - Replaces the upstream `vector<string> *selectable_map_list` pointer with
 *   an explicit readonly array reference.
 */
export type SelectableMapListState = {
  selectableMapList: readonly string[] | null;
};

/**
 * Port of upstream `SetSelectableMapList`.
 *
 * Role:
 * - Replaces the selectable map list used by main-menu map selection screens.
 *
 * Ledger: FUN-5BDE61
 * Upstream: zgui_main_menu_base.h:143
 *
 * Adaptation:
 * - Returns updated state instead of mutating a C++ class member pointer.
 * - Preserves reference replacement semantics by storing the provided list.
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
