/**
 * Upstream: erockparticle.h
 */

import { PlanetType } from "./SimulationConstants";

/**
 * Port of upstream `_EROCKPARTICLE_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: erockparticle.h:2
 */
export const EROCK_PARTICLE_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `rock_particle_type`.
 * Role: Identifies the rock particle sprite size for the effect.
 * Upstream: erockparticle.h:6-9
 */
export enum RockParticleType {
  Small = 0,
  Mid = 1,
}

/**
 * Port of upstream `ERockParticle` construction parameters.
 * Role: Describes one spawned rock debris particle effect.
 * Upstream: erockparticle.h:30-31
 */
export type RockParticleEffectSpawn<TTime = unknown> = {
  ztime: TTime | null;
  x: number;
  y: number;
  palette: PlanetType | number;
  particleType: RockParticleType;
  maxX: number;
  maxY: number;
};

const ROCK_PARTICLE_PLANET_NAMES = [
  "desert",
  "volcanic",
  "arctic",
  "jungle",
  "city",
] as const;

/**
 * Port of upstream `ERockParticle::Init` mutable fields.
 * Role: Holds loaded rock debris frame tables and the initialization flag.
 * Upstream: erockparticle.cpp:77-95
 */
export type RockParticleInitState<TImage = unknown> = {
  debriMid0Images: TImage[][];
  debriMid1Images: TImage[][];
  debriSmallImages: TImage[][];
  finishedInit: boolean;
};

/**
 * Port of upstream `ERockParticle::Process` mutable fields.
 * Role: Tracks rock debris animation, lifetime, and ballistic motion.
 * Upstream: erockparticle.cpp:98-130
 */
export type RockParticleProcessState = {
  killme: boolean;
  ztime: { ztime: number } | null;
  initTime: number;
  finalTime: number;
  nextProcessTime: number;
  renderIndex: number;
  x: number;
  y: number;
  startX: number;
  startY: number;
  deltaX: number;
  deltaY: number;
  rise: number;
  size: number;
};

/**
 * Replacement for upstream `ZSDL_Surface::SetSize` dependency.
 * Role: Provides the scale update applied to rock debris before rendering.
 * Upstream: erockparticle.cpp:140
 */
export type RockParticleRenderImage = {
  setSize?(size: number): void;
};

/**
 * Replacement for upstream `ZMap::RenderZSurface` dependency.
 * Role: Builds a centered map-relative render command for rock debris.
 * Upstream: erockparticle.cpp:144
 */
export type RockParticleRenderMap<TImage, TCommand> = {
  renderZSurface(
    surface: TImage,
    x: number,
    y: number,
    renderHit: boolean,
    aboutCenter: boolean,
  ): TCommand;
};

/**
 * Replacement state for upstream `ERockParticle::DoRender`.
 * Role: Holds the active rock debris frame, scale, and visibility state.
 * Upstream: erockparticle.cpp:132-147
 */
export type RockParticleRenderState<TImage> = {
  killme: boolean;
  x: number;
  y: number;
  size: number;
  renderIndex: number;
  renderImages: readonly TImage[];
};

/**
 * Replacement for upstream `ZSDL_Surface::LoadBaseImage`.
 * Role: Loads one rock debris frame asset.
 * Upstream: erockparticle.cpp:82, erockparticle.cpp:85, erockparticle.cpp:91
 */
export type RockParticleImageLoader<TImage> = (filename: string) => TImage;

/**
 * Port of upstream `ERockParticle::Init`.
 * Role: Loads rock debris particle images for every planet palette.
 * Upstream: erockparticle.cpp:72-96
 */
export function initRockParticleEffect<TImage>(
  state: RockParticleInitState<TImage>,
  loadImage: RockParticleImageLoader<TImage>,
): void {
  for (let planet = 0; planet < PlanetType.Max; planet += 1) {
    const planetName = ROCK_PARTICLE_PLANET_NAMES[planet];

    state.debriMid0Images[planet] = Array.from({ length: 8 }, (_frame, frame) =>
      loadImage(
        `assets/planets/rock_effects/debri_mid0_${planetName}_n${frame
          .toString()
          .padStart(2, "0")}.png`,
      ),
    );
    state.debriMid1Images[planet] = Array.from({ length: 8 }, (_frame, frame) =>
      loadImage(
        `assets/planets/rock_effects/debri_mid1_${planetName}_n${frame
          .toString()
          .padStart(2, "0")}.png`,
      ),
    );
    state.debriSmallImages[planet] = Array.from(
      { length: 16 },
      (_frame, frame) =>
        loadImage(
          `assets/planets/rock_effects/debri_small_${planetName}_n${frame
            .toString()
            .padStart(2, "0")}.png`,
        ),
    );
  }

  state.finishedInit = true;
}

/**
 * Port of upstream `ERockParticle::Process`.
 * Role: Advances rock debris animation, lifetime, and ballistic position.
 * Upstream: erockparticle.cpp:98-130
 */
export function processRockParticleEffect(
  state: RockParticleProcessState,
): void {
  const currentTime = state.ztime?.ztime ?? 0;

  if (state.killme) return;

  if (currentTime >= state.finalTime) {
    state.killme = true;
    return;
  }

  if (currentTime >= state.nextProcessTime) {
    state.renderIndex += 1;
    if (state.renderIndex >= 6) state.renderIndex = 0;

    state.nextProcessTime = currentTime + 0.07;
  }

  const timeDifference = currentTime - state.initTime;

  state.x = state.startX + state.deltaX * timeDifference;
  state.y = state.startY + state.deltaY * timeDifference;
  state.size =
    -(state.rise / (state.finalTime - state.initTime)) *
      (timeDifference * timeDifference) +
    state.rise * timeDifference;
  state.size += 1;
  state.y -= (state.size - 1) * 150;
}

/**
 * Replacement for upstream `ERockParticle::DoRender`.
 * Role: Builds the centered map-relative rock debris render command.
 * Upstream: erockparticle.cpp:132-147
 */
export function renderRockParticleEffect<
  TImage extends RockParticleRenderImage,
  TCommand,
>(
  state: RockParticleRenderState<TImage>,
  zmap: RockParticleRenderMap<TImage, TCommand>,
): TCommand | null {
  if (state.killme) return null;

  const image = state.renderImages[state.renderIndex];
  if (!image) return null;

  image.setSize?.(state.size);

  return zmap.renderZSurface(image, state.x, state.y, false, true);
}
