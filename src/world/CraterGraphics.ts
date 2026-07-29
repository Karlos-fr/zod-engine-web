/**
 * Upstream: zmap_crater_graphics.h
 */

import { PlanetType } from "../simulation/SimulationConstants";

/**
 * Port of upstream `MAX_KNOWN_CRATER_TYPES`.
 * Role: Defines how many crater sprite/type groups the terrain renderer can address.
 * Upstream: zmap_crater_graphics.h:8
 */
export const MAX_KNOWN_CRATER_TYPES = 7;

/**
 * Port of upstream `MAX_KNOWN_CRATER_N`.
 * Role: Defines the maximum number of crater variants available within each type.
 * Upstream: zmap_crater_graphics.h:9
 */
export const MAX_KNOWN_CRATERS_PER_TYPE = 7;

/**
 * Port of upstream `ZMapCraterGraphics` crater counters used by `CraterExists`.
 * Role: Stores available small and large crater variant counts by palette and crater type.
 * Upstream: zmap_crater_graphics.h:26-27
 */
export type CraterGraphicsCountsState = {
  craterSmallCounts: readonly (readonly number[])[];
  craterLargeCounts: readonly (readonly number[])[];
};

/**
 * Port of upstream `ZMapCraterGraphics::CraterExists`.
 * Role: Reports whether at least one crater graphic exists for the requested size, palette, and type.
 * Upstream: zmap_crater_graphics.cpp:87-98
 */
export function craterExists(
  state: CraterGraphicsCountsState,
  isSmall: boolean,
  palette: number,
  craterType: number,
): boolean {
  if (palette < 0) return false;
  if (palette >= PlanetType.Max) return false;
  if (craterType < 0) return false;
  if (craterType >= MAX_KNOWN_CRATER_TYPES) return false;

  const counts = isSmall ? state.craterSmallCounts : state.craterLargeCounts;

  return Boolean(counts[palette]?.[craterType]);
}
