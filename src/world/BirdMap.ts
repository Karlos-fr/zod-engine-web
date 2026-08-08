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
 * Replacement for upstream rotozoom image state used by `ABird::DoRender`.
 * Role: Applies the current angle and rise scale before ambient bird rendering.
 * Upstream: abird.cpp:59-60
 */
export type AmbientBirdRenderImage = {
  setAngle?(angle: number): void;
  setSize?(size: number): void;
};

/**
 * Replacement for upstream `ZMap::RenderZSurface` dependency.
 * Role: Builds a centered map-relative render command for an ambient bird.
 * Upstream: abird.cpp:64
 */
export type AmbientBirdRenderMap<TImage, TCommand> = {
  renderZSurface(
    surface: TImage,
    x: number,
    y: number,
    renderHit: boolean,
    aboutCenter: boolean,
  ): TCommand;
};

/**
 * Replacement state for upstream `ABird::DoRender`.
 * Role: Holds the active ambient bird frame, transform, and map-space location.
 * Upstream: abird.cpp:50-72
 */
export type AmbientBirdRenderState<TImage> = {
  x: number;
  y: number;
  palette: number;
  renderIndex: number;
  angle: number;
  rise: number;
  birdImages: readonly (readonly TImage[])[];
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
 * Replacement for upstream `ABird::DoRender`.
 * Role: Builds the centered map-relative ambient bird render command.
 * Upstream: abird.cpp:50-72
 */
export function renderAmbientBird<
  TImage extends AmbientBirdRenderImage,
  TCommand,
>(
  state: AmbientBirdRenderState<TImage>,
  map: AmbientBirdRenderMap<TImage, TCommand>,
): TCommand | null {
  const image = state.birdImages[state.palette]?.[state.renderIndex];
  if (!image) return null;

  image.setAngle?.(state.angle);
  image.setSize?.(state.rise);

  return map.renderZSurface(
    image,
    state.x,
    state.y - (state.rise - 1) * 50,
    false,
    true,
  );
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
