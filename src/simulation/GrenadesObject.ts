/**
 * Upstream: ogrenades.h, ogrenades.cpp
 */

/**
 * Port of upstream `_OGRENADES_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: ogrenades.h:2
 */
export const OGRENADES_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `OGrenades` grenade inventory field.
 * Role: Holds the grenade count carried by a grenade pickup object.
 * Upstream: ogrenades.h:15, ogrenades.h:25
 */
export type GrenadesObjectInventoryState = {
  grenadeAmount: number;
};

/**
 * Port of upstream `SetGrenadeAmount`.
 * Role: Updates the grenade count carried by a grenade pickup object.
 * Upstream: ogrenades.h:15
 */
export function setGrenadesObjectAmount(
  state: GrenadesObjectInventoryState,
  grenadeAmount: number,
): void {
  state.grenadeAmount = grenadeAmount;
}

/**
 * Port of upstream `GetGrenadeAmount`.
 * Role: Returns the grenade count carried by a grenade pickup object.
 * Upstream: ogrenades.h:16
 */
export function getGrenadesObjectAmount(
  state: GrenadesObjectInventoryState,
): number {
  return state.grenadeAmount;
}

/**
 * Port of upstream `max_horz`.
 * Role: Defines the horizontal random spread limit for grenade-triggered missiles.
 * Upstream: ogrenades.cpp:60
 */
export const GRENADES_MISSILE_MAX_HORIZONTAL_SPREAD_PIXELS = 130;

/**
 * Port of upstream `max_vert`.
 * Role: Defines the vertical random spread limit for grenade-triggered missiles.
 * Upstream: ogrenades.cpp:61
 */
export const GRENADES_MISSILE_MAX_VERTICAL_SPREAD_PIXELS = 130;
