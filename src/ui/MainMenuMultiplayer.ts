/**
 * Upstream: gmm_multiplayer.h
 */

/**
 * Port of upstream `_ZGMM_MULTIPLAYER_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: gmm_multiplayer.h:2
 */
export const ZGMM_MULTIPLAYER_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `GMMMultiplayer::HandleWidgetEvent`.
 * Role: Hook for multiplayer widget events; upstream has no behavior.
 * Upstream: gmm_multiplayer.cpp:32-35
 */
export function handleMainMenuMultiplayerWidgetEvent(
  eventType: number,
  eventWidget: unknown,
): void {
  void eventType;
  void eventWidget;
}
