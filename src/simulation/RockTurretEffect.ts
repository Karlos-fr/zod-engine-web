/**
 * Upstream: erockturrent.h
 */
import {
  RockParticleType,
  type RockParticleEffectSpawn,
} from "./RockParticleEffect";
import { PlanetType } from "./SimulationConstants";

/**
 * Port of upstream `_EROCKTURRENT_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: erockturrent.h:2
 */
export const EROCK_TURRET_HEADER_GUARD_PORTED = true;

export type RockTurretDebriImage = {
  loadBaseImage(filename: string): void;
};

export type RockTurretEffectImageState = {
  debriLargeImages: readonly (readonly (readonly RockTurretDebriImage[])[])[];
  finishedInit: boolean;
};

const ROCK_TURRET_DEBRI_LARGE_VARIANT_COUNT = 2;
const ROCK_TURRET_DEBRI_LARGE_FRAME_COUNT = 12;
const ROCK_TURRET_PLANET_TYPE_ASSET_NAMES = [
  "desert",
  "volcanic",
  "arctic",
  "jungle",
  "city",
] as const;

/**
 * Port of upstream `ERockTurrent::Init`.
 * Role: Loads large rock turret debris images for each allowed variant, planet, and frame.
 * Upstream: erockturrent.cpp:69-88
 */
export function initRockTurretEffect(state: RockTurretEffectImageState): void {
  for (let variant = 0; variant < ROCK_TURRET_DEBRI_LARGE_VARIANT_COUNT; variant += 1) {
    for (let planet = 0; planet < PlanetType.Max; planet += 1) {
      if (planet === PlanetType.Desert && variant === 1) continue;
      if (planet === PlanetType.City && variant === 1) continue;

      for (let frame = 0; frame < ROCK_TURRET_DEBRI_LARGE_FRAME_COUNT; frame += 1) {
        state.debriLargeImages[variant]?.[planet]?.[frame]?.loadBaseImage(
          `assets/planets/rock_effects/debri_large${variant}_${ROCK_TURRET_PLANET_TYPE_ASSET_NAMES[planet]}_n${frame
            .toString()
            .padStart(2, "0")}.png`,
        );
      }
    }
  }

  state.finishedInit = true;
}

/**
 * Port of upstream `ERockTurrent::EndExplosion`.
 * Role: Spawns small rock debris particles when a rock turret explosion finishes.
 * Upstream: erockturrent.cpp:148-158
 */
export function endRockTurrentExplosion<TTime>(
  state: {
    ztime: TTime | null;
    x: number;
    y: number;
    palette: PlanetType | number;
  },
  effectList: RockParticleEffectSpawn<TTime>[] | null,
  randomInt: (maxExclusive: number) => number = (maxExclusive) =>
    Math.floor(Math.random() * maxExclusive),
): void {
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
