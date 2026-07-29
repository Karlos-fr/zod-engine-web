/**
 * Upstream: oflag.h, oflag.cpp
 */

import { MapObjectType } from "../world/MapFormat";
import { BuildingType } from "./SimulationConstants";

/**
 * Port of upstream `_OFLAG_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: oflag.h:2
 */
export const OFLAG_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `int_time`.
 * Role: Defines the minimum elapsed time between flag animation frame advances.
 * Upstream: oflag.cpp:39
 */
export const FLAG_ANIMATION_INTERVAL_SECONDS = 0.2;

/**
 * Port of upstream `OFlag::HasRadar` connected object dependency.
 * Role: Supplies the object type/id pair read via upstream `GetObjectID`.
 * Upstream: oflag.cpp:113-119
 */
export type FlagConnectedObject = {
  getObjectId(): {
    objectType: number;
    objectId: number;
  };
};

/**
 * Port of upstream `OFlag::Process` mutable fields.
 * Role: Stores flag animation timing and current frame index.
 * Upstream: oflag.cpp:36-50
 */
export type FlagProcessState = {
  lastProcessTime: number;
  flagIndex: number;
};

/**
 * Port of upstream `OFlag::Process`.
 * Role: Advances the flag animation frame at the upstream fixed interval.
 * Upstream: oflag.cpp:36-50
 */
export function processFlagObject(
  state: FlagProcessState,
  currentTime: number,
): number {
  if (currentTime - state.lastProcessTime >= FLAG_ANIMATION_INTERVAL_SECONDS) {
    state.lastProcessTime = currentTime;
    state.flagIndex += 1;
    if (state.flagIndex > 3) state.flagIndex = 0;
  }

  return 1;
}

/**
 * Port of upstream `OFlag::HasRadar`.
 * Role: Reports whether any connected object is a radar building.
 * Upstream: oflag.cpp:111-124
 */
export function flagHasRadar(connectedObjects: FlagConnectedObject[]): boolean {
  return connectedObjects.some(({ getObjectId }) => {
    const { objectType, objectId } = getObjectId();
    return objectType === MapObjectType.Building && objectId === BuildingType.Radar;
  });
}
