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
