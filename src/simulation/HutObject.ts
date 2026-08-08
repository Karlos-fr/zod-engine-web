/**
 * Upstream: ohut.h
 */
import { PlanetType, TeamType } from "./SimulationConstants";
import type { SurfaceBlitRegion } from "../rendering/SurfacePixels";

const HUT_PLANET_TYPE_ASSET_NAMES = [
  "desert",
  "volcanic",
  "arctic",
  "jungle",
  "city",
] as const;

/**
 * Port of upstream `_OHUT_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: ohut.h:2
 */
export const OHUT_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `OHut` state used by small object-map operations.
 * Role: Holds hut palette, ownership, and map coordinates.
 * Upstream: ohut.h:29-36
 */
export type HutObjectState = {
  palette: PlanetType;
  owner: TeamType;
  x: number;
  y: number;
};

export type HutObjectImpassableMap = {
  setImpassable(
    tileX: number,
    tileY: number,
    impassable: boolean,
    destroyable: boolean,
  ): void;
};

/**
 * Minimal state consumed by ported `OHut::SetMaxHutAnimals`.
 * Role: Stores the configured animal count range and resulting hut animal cap.
 * Upstream: ohut.cpp:227-235
 */
export type HutMaxAnimalsState = {
  hutAnimalMin: number;
  hutAnimalMax: number;
  maxHutAnimals: number;
};

export type HutPlanetTemplate = {
  loadBaseImage(filename: string): void;
};

/**
 * Port of upstream `ZSDL_Surface::GetBaseSurface` dependency.
 * Role: Provides the loaded base surface used to clip hut rendering.
 * Upstream: ohut.cpp:55
 */
export type HutRenderableImage<TBaseSurface> = {
  getBaseSurface(): TBaseSurface | null;
};

/**
 * Replacement for upstream `ZMap::GetBlitInfo` dependency.
 * Role: Calculates visible source and destination rectangles for hut rendering.
 * Upstream: ohut.cpp:55
 */
export type HutRenderMap<TBaseSurface> = {
  getBlitInfo(
    surface: TBaseSurface | null,
    x: number,
    y: number,
  ): SurfaceBlitRegion | null;
};

/**
 * Replacement state for upstream `OHut::DoRender`.
 * Role: Holds hut palette, render images, and map-space location used for rendering.
 * Upstream: ohut.cpp:49-63
 */
export type HutDoRenderState<TImage> = {
  palette: number;
  x: number;
  y: number;
  renderImages: readonly (TImage | null | undefined)[];
};

/**
 * Replacement for upstream `ZSDL_Surface::BlitSurface`.
 * Role: Describes the clipped hut blit requested by object rendering.
 * Upstream: ohut.cpp:60
 */
export type HutBlitCommand<TImage> = {
  renderImage: TImage;
  region: SurfaceBlitRegion;
};

/**
 * Port of upstream `AHutAnimal` home-return surface.
 * Role: Reports and starts an animal's return-home state for hut coordination.
 * Upstream: ohut.cpp:142-154
 */
export type HutAnimalHomeReturn = {
  isGoingHome(): boolean;
  goHome(): void;
};

/**
 * Port of upstream `OHut::SendAnimalsHome` state.
 * Role: Holds the hut animals managed by a hut object.
 * Upstream: ohut.cpp:142-151
 */
export type HutAnimalsHomeState<TAnimal extends HutAnimalHomeReturn = HutAnimalHomeReturn> = {
  hutAnimals: TAnimal[];
};

/**
 * Port of upstream `OHut::Init`.
 * Role: Loads one hut render image per planet palette.
 * Upstream: ohut.cpp:37-47
 */
export function initHutPlanetTemplates(
  renderImages: readonly HutPlanetTemplate[],
): void {
  for (let i = 0; i < PlanetType.Max; i += 1) {
    renderImages[i]?.loadBaseImage(
      `assets/other/map_items/hut_${HUT_PLANET_TYPE_ASSET_NAMES[i]}.png`,
    );
  }
}

/**
 * Replacement for upstream `OHut::DoRender`.
 * Role: Builds a shifted, clipped blit command for a hut object.
 * Upstream: ohut.cpp:49-63
 */
export function renderHutObject<
  TBaseSurface extends { width: number; height: number },
  TImage extends HutRenderableImage<TBaseSurface>,
>(
  state: HutDoRenderState<TImage>,
  map: HutRenderMap<TBaseSurface>,
  shiftX: number,
  shiftY: number,
): HutBlitCommand<TImage> | null {
  const renderImage = state.renderImages[state.palette];
  if (!renderImage) return null;

  const region = map.getBlitInfo(
    renderImage.getBaseSurface(),
    state.x,
    state.y,
  );
  if (!region) return null;

  return {
    renderImage,
    region: {
      ...region,
      destinationX: region.destinationX + shiftX,
      destinationY: region.destinationY + shiftY,
    },
  };
}

/**
 * Port of upstream `OHut::ChangePalette`.
 * Role: Stores the hut render palette.
 * Upstream: ohut.cpp:237-240
 */
export function changeHutPalette(
  state: Pick<HutObjectState, "palette">,
  palette: PlanetType,
): void {
  state.palette = palette;
}

/**
 * Port of upstream `OHut::CausesImpassAtCoord`.
 * Role: Reports whether the hut occupies the queried coordinate.
 * Upstream: ohut.cpp:242-245
 */
export function hutCausesImpassAtCoord(
  state: Pick<HutObjectState, "x" | "y">,
  x: number,
  y: number,
): boolean {
  return x === state.x && y === state.y;
}

/**
 * Port of upstream `OHut::SetMapImpassables`.
 * Role: Marks this hut's occupied tile as a destroyable impassable.
 * Upstream: ohut.cpp:247-255
 */
export function setHutMapImpassables(
  state: Pick<HutObjectState, "x" | "y">,
  map: HutObjectImpassableMap,
): void {
  const tileX = Math.trunc(state.x / 16);
  const tileY = Math.trunc(state.y / 16);

  map.setImpassable(tileX, tileY, true, true);
}

/**
 * Port of upstream `OHut::UnSetMapImpassables`.
 * Role: Clears this hut's occupied tile while preserving destroyable impassable metadata.
 * Upstream: ohut.cpp:257-265
 */
export function unsetHutMapImpassables(
  state: Pick<HutObjectState, "x" | "y">,
  map: HutObjectImpassableMap,
): void {
  const tileX = Math.trunc(state.x / 16);
  const tileY = Math.trunc(state.y / 16);

  map.setImpassable(tileX, tileY, false, true);
}

/**
 * Port of upstream `OHut::SetMaxHutAnimals`.
 * Role: Picks the hut animal cap from the configured min/max range.
 * Upstream: ohut.cpp:227-235
 */
export function setMaxHutAnimals(
  state: HutMaxAnimalsState,
  randomInt: (maxExclusive: number) => number = (maxExclusive) =>
    Math.floor(Math.random() * maxExclusive),
): void {
  const randomDifference = state.hutAnimalMax - state.hutAnimalMin;

  state.maxHutAnimals = state.hutAnimalMin;
  if (randomDifference > 0) {
    state.maxHutAnimals += randomInt(randomDifference);
  }
}

/**
 * Port of upstream `OHut::SendAnimalsHome`.
 * Role: Sends only enough non-returning hut animals home to satisfy the requested return count.
 * Upstream: ohut.cpp:137-159
 */
export function sendHutAnimalsHome(
  state: HutAnimalsHomeState,
  amount: number,
): void {
  let amountGoingHome = 0;

  for (const animal of state.hutAnimals) {
    if (animal.isGoingHome()) {
      amountGoingHome += 1;
    }
  }

  let remainingAmount = amount - amountGoingHome;
  if (remainingAmount <= 0) return;

  for (const animal of state.hutAnimals) {
    if (animal.isGoingHome()) continue;

    animal.goHome();
    remainingAmount -= 1;

    if (remainingAmount <= 0) return;
  }
}

/**
 * Port of upstream `OHut::SetOwner`.
 * Role: Ignores ownership changes for neutral hut objects.
 * Upstream: ohut.cpp:267-270
 */
export function setHutOwner(owner: TeamType): void {
  void owner;
}

/**
 * Port of upstream `OHut::IsDestroyableImpass`.
 * Role: Reports that hut objects are destroyable impassable barriers.
 * Upstream: ohut.h:25
 */
export function isHutDestroyableImpassable(): boolean {
  return true;
}
