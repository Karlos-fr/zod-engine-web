/**
 * Upstream: ebridgeturrent.h
 */
import { PlanetType } from "./SimulationConstants";
import {
  RockParticleType,
  type RockParticleEffectSpawn,
} from "./RockParticleEffect";

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

/**
 * Replacement for upstream rotozoom image state used by `EBridgeTurrent::DoRender`.
 * Role: Applies the current angle and scale before bridge debris rendering.
 * Upstream: ebridgeturrent.cpp:148-149
 */
export type BridgeTurrentRenderImage = {
  setAngle?(angle: number): void;
  setSize?(size: number): void;
};

export type BridgeTurrentEffectImageState = {
  debriLargeImages: readonly (readonly BridgeTurrentDebriImage[])[];
  finishedInit: boolean;
};

/**
 * Replacement for upstream `ZMap::RenderZSurface` dependency.
 * Role: Builds a centered map-relative render command for bridge turret debris.
 * Upstream: ebridgeturrent.cpp:153
 */
export type BridgeTurrentRenderMap<TImage, TCommand> = {
  renderZSurface(
    surface: TImage,
    x: number,
    y: number,
    renderHit: boolean,
    aboutCenter: boolean,
  ): TCommand;
};

/**
 * Replacement state for upstream `EBridgeTurrent::DoRender`.
 * Role: Holds the active bridge debris frame, transform, and visibility state.
 * Upstream: ebridgeturrent.cpp:140-156
 */
export type BridgeTurrentRenderState<TImage> = {
  killme: boolean;
  x: number;
  y: number;
  palette: number;
  renderIndex: number;
  angle: number;
  size: number;
  debriLargeImages: readonly (readonly TImage[])[];
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

/**
 * Replacement for upstream `EBridgeTurrent::DoRender`.
 * Role: Builds the centered map-relative bridge turret debris render command.
 * Upstream: ebridgeturrent.cpp:140-156
 */
export function renderBridgeTurrentEffect<
  TImage extends BridgeTurrentRenderImage,
  TCommand,
>(
  state: BridgeTurrentRenderState<TImage>,
  zmap: BridgeTurrentRenderMap<TImage, TCommand>,
): TCommand | null {
  if (state.killme) return null;

  const image = state.debriLargeImages[state.palette]?.[state.renderIndex];
  if (!image) return null;

  image.setAngle?.(state.angle);
  image.setSize?.(state.size);

  return zmap.renderZSurface(image, state.x, state.y, false, true);
}

/**
 * Port of upstream `EBridgeTurrent::EndExplosion`.
 * Role: Spawns small rock debris particles when a bridge turret explosion finishes.
 * Upstream: ebridgeturrent.cpp:158-169
 */
export function endBridgeTurrentExplosion<TTime>(
  state: {
    isReversed: boolean;
    ztime: TTime | null;
    x: number;
    y: number;
    palette: PlanetType | number;
  },
  effectList: RockParticleEffectSpawn<TTime>[] | null,
  randomInt: (maxExclusive: number) => number = (maxExclusive) =>
    Math.floor(Math.random() * maxExclusive),
): void {
  if (state.isReversed) return;

  const smallParticles = 12 + (Math.trunc(randomInt(6)) % 6);

  for (let i = 0; i < smallParticles; i += 1) {
    if (effectList) {
      effectList.push({
        ztime: state.ztime,
        x: state.x,
        y: state.y,
        palette: state.palette,
        particleType: RockParticleType.Small,
        maxX: 80,
        maxY: 60,
      });
    }
  }
}
