/**
 * Ported from Zod Engine.
 * Upstream: zmap.h
 * Symbols: map_basics
 */

/**
 * Port of upstream `map_basics`.
 * Role: Stores the high-level dimensions and counts read from a map file header.
 * Ledger: CLS-A580AC
 * Upstream: zmap.h:114-137
 */
export type MapBasics = {
  width: number;
  height: number;
  name: string;
  playerCount: number;
  objectCount: number;
  terrainType: number;
  zoneCount: number;
};

/**
 * Port of upstream `map_basics` default initialization.
 * Role: Creates an empty map metadata record before loading or resetting map data.
 * Ledger: CLS-A580AC
 * Upstream: zmap.h:114-137
 */
export function createEmptyMapBasics(): MapBasics {
  return {
    width: 0,
    height: 0,
    name: "",
    playerCount: 0,
    objectCount: 0,
    terrainType: 0,
    zoneCount: 0,
  };
}

/**
 * Port of upstream `map_basics::clear`.
 * Role: Restores map metadata to its empty state while preserving the target object.
 * Ledger: CLS-A580AC
 * Upstream: zmap.h:135-137
 */
export function resetMapBasics(target: MapBasics): void {
  Object.assign(target, createEmptyMapBasics());
}
