/**
 * Upstream: ebridgeturrent.h
 */
import { PlanetType } from "./SimulationConstants";

/**
 * Marker exported from the bridge turret effect module.
 * Role: Marks an upstream header boundary.
 * Upstream: ebridgeturrent.h:2
 */
export const EBRIDGE_TURRENT_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `EBridgeTurrent` spawn data.
 * Role: Describes a bridge turret effect for the browser simulation/rendering boundary.
 * Upstream: ebridgeturrent.h
 */
export type BridgeTurrentEffectSpawn = {
  x: number;
  y: number;
  palette: PlanetType;
  width: number;
  height: number;
  isReversed: boolean;
};

export type BridgeTurrentDebriImage = {
  loadBaseImage(filename: string): void;
};

export type BridgeTurrentEffectImageState = {
  debriLargeImages: readonly (readonly BridgeTurrentDebriImage[])[];
  finishedInit: boolean;
};

const BRIDGE_TURRENT_DEBRI_LARGE_FRAME_COUNT = 12;
const BRIDGE_TURRENT_PLANET_TYPE_ASSET_NAMES = [
  "desert",
  "volcanic",
  "arctic",
  "jungle",
  "city",
] as const;

/**
 * Port of upstream `EBridgeTurrent::Init`.
 * Role: Loads large bridge debris images for every planet palette and frame.
 * Upstream: ebridgeturrent.cpp:79-98
 */
export function initBridgeTurrentEffect(
  state: BridgeTurrentEffectImageState,
): void {
  for (let planet = 0; planet < PlanetType.Max; planet += 1) {
    for (let frame = 0; frame < BRIDGE_TURRENT_DEBRI_LARGE_FRAME_COUNT; frame += 1) {
      state.debriLargeImages[planet]?.[frame]?.loadBaseImage(
        `assets/planets/bridge_effects/debri_large_${BRIDGE_TURRENT_PLANET_TYPE_ASSET_NAMES[planet]}_n${frame
          .toString()
          .padStart(2, "0")}.png`,
      );
    }
  }

  state.finishedInit = true;
}
