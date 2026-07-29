/**
 * Upstream: abird.h / abird.cpp / zplayer.cpp
 */

import { PlanetType } from "../simulation/SimulationConstants";

const BIRD_PLANET_TYPE_ASSET_NAMES = [
  "desert",
  "volcanic",
  "arctic",
  "jungle",
  "city",
] as const;

/**
 * Port of upstream `_ABIRD_H_`.
 * Role: Marks an upstream compile-time boundary.
 * Upstream: abird.h:2
 */
export const ABIRD_HEADER_GUARD_PORTED = true;

export type BirdAnimationImage = {
  loadBaseImage(filename: string): void;
};

/**
 * Port of upstream `ABird::Init`.
 * Role: Loads ambient bird animation images for each planet palette.
 * Upstream: abird.cpp:36-48
 */
export function initAmbientBirdImages(
  birdImages: readonly (readonly BirdAnimationImage[])[],
): void {
  const rotation = 0;

  for (let planet = 0; planet < PlanetType.Max; planet += 1) {
    for (let frame = 0; frame < 5; frame += 1) {
      birdImages[planet]?.[frame]?.loadBaseImage(
        `assets/other/birds/bird_${BIRD_PLANET_TYPE_ASSET_NAMES[planet]}_r${rotation
          .toString()
          .padStart(3, "0")}_n${frame.toString().padStart(2, "0")}.png`,
      );
    }
  }
}

/**
 * Port of upstream `sq_tile_per_bird`.
 * Role: Defines the square-tile area budget used to derive ambient bird density for a map.
 * Upstream: zplayer.cpp:575
 */
export const AMBIENT_BIRD_SQUARE_TILES_PER_BIRD = 650;

/**
 * Port of upstream `BIRD_MAP_PADDING`.
 * Role: Defines the extra pixel margin around the map used when positioning or resetting ambient bird movement outside visible terrain bounds.
 * Upstream: abird.cpp:3
 */
export const BIRD_MAP_PADDING_PIXELS = 160;
