/**
 * Upstream: ebridgeturrent.h
 */
import type { PlanetType } from "./SimulationConstants";

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
