/**
 * Upstream: gmm_player_list.h
 */

/**
 * Port of upstream `_ZGMM_PLAYER_LIST_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: gmm_player_list.h:2
 */
export const ZGMM_PLAYER_LIST_HEADER_GUARD_PORTED = true;

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
