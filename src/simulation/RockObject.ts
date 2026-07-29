/**
 * Upstream: orock.h
 */
import { PlanetType, TeamType } from "./SimulationConstants";

/**
 * Port of upstream `_OROCK_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: orock.h:2
 */
export const OROCK_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ORock` state used by small object-map operations.
 * Role: Holds rock palette, ownership, and map coordinates.
 * Upstream: orock.h:76-77
 */
export type RockObjectState = {
  palette: PlanetType;
  owner: TeamType;
  x: number;
  y: number;
};

export type RockObjectImpassableMap = {
  setImpassable(
    tileX: number,
    tileY: number,
    impassable: boolean,
    destroyable: boolean,
  ): void;
};

/**
 * Port of upstream `ORock::ChangePalette`.
 * Role: Stores the rock render palette.
 * Upstream: orock.cpp:312-315
 */
export function changeRockPalette(
  state: Pick<RockObjectState, "palette">,
  palette: PlanetType,
): void {
  state.palette = palette;
}

/**
 * Port of upstream `ORock::Process`.
 * Role: Reports rock objects as processed without doing per-tick work.
 * Upstream: orock.cpp:306-310
 */
export function processRockObject(): number {
  return 1;
}

/**
 * Port of upstream `ORock::CreationMapEffects`.
 * Role: Preserves the upstream no-op hook for rock map creation effects.
 * Upstream: orock.cpp:698-701
 */
export function createRockMapEffects(map: unknown): void {
  void map;
}

/**
 * Port of upstream `ORock::CausesImpassAtCoord`.
 * Role: Reports whether the rock occupies the queried impassable coordinate.
 * Upstream: orock.cpp:673-676
 */
export function rockCausesImpassAtCoord(
  state: Pick<RockObjectState, "x" | "y">,
  x: number,
  y: number,
): boolean {
  return x === state.x && y === state.y + 32;
}

/**
 * Port of upstream `ORock::SetMapImpassables`.
 * Role: Marks the rock's lower occupied tile as a destroyable impassable.
 * Upstream: orock.cpp:678-686
 */
export function setRockMapImpassables(
  state: Pick<RockObjectState, "x" | "y">,
  map: RockObjectImpassableMap,
): void {
  const tileX = Math.trunc(state.x / 16);
  const tileY = Math.trunc(state.y / 16);

  map.setImpassable(tileX, tileY + 2, true, true);
}

/**
 * Port of upstream `ORock::UnSetMapImpassables`.
 * Role: Clears the rock's lower occupied tile while preserving destroyable impassable metadata.
 * Upstream: orock.cpp:688-696
 */
export function unsetRockMapImpassables(
  state: Pick<RockObjectState, "x" | "y">,
  map: RockObjectImpassableMap,
): void {
  const tileX = Math.trunc(state.x / 16);
  const tileY = Math.trunc(state.y / 16);

  map.setImpassable(tileX, tileY + 2, false, true);
}

/**
 * Port of upstream `ORock::SetOwner`.
 * Role: Forces rock ownership to the null team.
 * Upstream: orock.cpp:645-648
 */
export function setRockOwner(state: Pick<RockObjectState, "owner">): void {
  state.owner = TeamType.Null;
}

/**
 * Port of upstream `ORock::IsDestroyableImpass`.
 * Role: Reports that rock objects are destroyable impassable barriers.
 * Upstream: orock.h:31
 */
export function isRockDestroyableImpassable(): boolean {
  return true;
}
