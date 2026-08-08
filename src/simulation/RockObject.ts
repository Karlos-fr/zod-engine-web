/**
 * Upstream: orock.h
 */
import type { SurfaceBlitRegion } from "../rendering/SurfacePixels";
import {
  RockParticleType,
  type RockParticleEffectSpawn,
} from "./RockParticleEffect";
import { PlanetType, TeamType } from "./SimulationConstants";

/**
 * Port of upstream `_OROCK_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: orock.h:2
 */
export const OROCK_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ORock` state used by small object-map operations.
 * Role: Holds rock palette, ownership, and map coordinates.
 * Upstream: orock.h:76-77
 */
export type RockObjectState = {
  palette: PlanetType;
  owner: TeamType;
  x: number;
  y: number;
};

export type RockObjectImpassableMap = {
  setImpassable(
    tileX: number,
    tileY: number,
    impassable: boolean,
    destroyable: boolean,
  ): void;
};

export type RockObjectDeathMap<TSurface> = {
  width: number;
  height: number;
  coordStamped(x: number, y: number): boolean;
  permStamp(
    x: number,
    y: number,
    surface: TSurface | null,
    markStamped: boolean,
    fullRenderSurfaceAvailable: boolean,
  ): unknown;
};

export type RockTurrentEffectSpawn<TTime = unknown> = {
  ztime: TTime | null;
  x: number;
  y: number;
  palette: PlanetType | number;
  maxX: number;
  maxY: number;
};

export type RockObjectDeathEffectSpawn<TTime = unknown> =
  | RockParticleEffectSpawn<TTime>
  | RockTurrentEffectSpawn<TTime>;

/**
 * Replacement for upstream `ORock::render_img`.
 * Role: Holds cached rock render images by owner variant and damage frame.
 * Upstream: orock.h:78, orock.cpp:321-323
 */
export type RockRenderImageState<TRenderImage> = {
  renderImages: Array<Array<TRenderImage | null>>;
};

/**
 * Replacement for upstream default rock graphics arrays.
 * Role: Provides the palette-indexed rock images used by the default render cache.
 * Upstream: orock.cpp:330-332
 */
export type RockDefaultRenderGraphics<TRenderImage> = {
  verticalDownTop: readonly (TRenderImage | null)[];
  singleMidUnder: readonly (TRenderImage | null)[];
  singleBottomUnder: readonly (TRenderImage | null)[];
};

/**
 * Port of upstream `ZSDL_Surface::GetBaseSurface` dependency for rock rendering.
 * Role: Provides the loaded base surface used to clip rock image rendering.
 * Upstream: orock.cpp:270
 */
export type RockRenderableImage<TBaseSurface> = {
  getBaseSurface(): TBaseSurface | null;
};

/**
 * Replacement for upstream `ZMap::GetBlitInfo` dependency.
 * Role: Calculates visible source and destination rectangles for rock rendering.
 * Upstream: orock.cpp:272
 */
export type RockRenderMap<TBaseSurface> = {
  getBlitInfo(
    surface: TBaseSurface | null,
    x: number,
    y: number,
  ): SurfaceBlitRegion | null;
};

/**
 * Replacement for upstream `ZSDL_Surface::BlitSurface`.
 * Role: Describes a clipped rock image blit requested by pre-rendering.
 * Upstream: orock.cpp:277
 */
export type RockBlitCommand<TImage> = {
  renderImage: TImage;
  region: SurfaceBlitRegion;
};

/**
 * Port of upstream `ORock::ChangePalette`.
 * Role: Stores the rock render palette.
 * Upstream: orock.cpp:312-315
 */
export function changeRockPalette(
  state: Pick<RockObjectState, "palette">,
  palette: PlanetType,
): void {
  state.palette = palette;
}

/**
 * Port of upstream `ORock::Process`.
 * Role: Reports rock objects as processed without doing per-tick work.
 * Upstream: orock.cpp:306-310
 */
export function processRockObject(): number {
  return 1;
}

/**
 * Port of upstream `ORock::DoDeathEffect`.
 * Role: Spawns small, mid, and occasional large rock debris effects.
 * Upstream: orock.cpp:650-671
 */
export function doRockDeathEffect<TTime>(
  state: Pick<RockObjectState, "x" | "y" | "palette"> & {
    ztime: TTime | null;
  },
  effectList: RockObjectDeathEffectSpawn<TTime>[] | null,
  doFireDeath: boolean,
  doMissileDeath: boolean,
  randomInt: (maxExclusive: number) => number = (maxExclusive) =>
    Math.floor(Math.random() * maxExclusive),
): void {
  void doFireDeath;
  void doMissileDeath;

  if (!effectList) return;

  const smallParticles = 12 + (Math.trunc(randomInt(6)) % 6);
  const midParticles = 4 + (Math.trunc(randomInt(3)) % 3);
  const largeParticles = Math.trunc(randomInt(2)) % 2;

  for (let i = 0; i < smallParticles; i += 1) {
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

  for (let i = 0; i < midParticles; i += 1) {
    effectList.push({
      ztime: state.ztime,
      x: state.x,
      y: state.y,
      palette: state.palette,
      particleType: RockParticleType.Mid,
      maxX: 40,
      maxY: 40,
    });
  }

  for (let i = 0; i < largeParticles; i += 1) {
    effectList.push({
      ztime: state.ztime,
      x: state.x,
      y: state.y,
      palette: state.palette,
      maxX: 140,
      maxY: 140,
    });
  }
}

/**
 * Replacement for upstream `ORock::ClearRender`.
 * Role: Clears all cached rock render images.
 * Upstream: orock.cpp:317-324
 */
export function clearRockRender<TRenderImage>(
  state: RockRenderImageState<TRenderImage>,
): void {
  for (let ownerVariant = 0; ownerVariant < 2; ownerVariant += 1) {
    if (!state.renderImages[ownerVariant]) {
      state.renderImages[ownerVariant] = [];
    }

    for (let damageFrame = 0; damageFrame < 3; damageFrame += 1) {
      state.renderImages[ownerVariant][damageFrame] = null;
    }
  }
}

/**
 * Replacement for upstream `ORock::SetDefaultRender`.
 * Role: Resets the rock render cache to the default palette-specific images.
 * Upstream: orock.cpp:326-333
 */
export function setDefaultRockRender<TRenderImage>(
  state: Pick<RockObjectState, "palette"> & RockRenderImageState<TRenderImage>,
  graphics: RockDefaultRenderGraphics<TRenderImage>,
): void {
  clearRockRender(state);

  state.renderImages[0][0] = graphics.verticalDownTop[state.palette] ?? null;
  state.renderImages[0][1] = graphics.singleMidUnder[state.palette] ?? null;
  state.renderImages[0][2] = graphics.singleBottomUnder[state.palette] ?? null;
}

/**
 * Replacement for upstream `ORock::DoPreRender`.
 * Role: Builds shifted, clipped blit commands for the rock shadow images.
 * Upstream: orock.cpp:260-281
 */
export function preRenderRockObject<
  TBaseSurface extends { width: number; height: number },
  TImage extends RockRenderableImage<TBaseSurface>,
>(
  state: Pick<RockObjectState, "x" | "y"> & RockRenderImageState<TImage>,
  map: RockRenderMap<TBaseSurface>,
  shiftX: number,
  shiftY: number,
): Array<RockBlitCommand<TImage>> {
  const commands: Array<RockBlitCommand<TImage>> = [];
  const shadowImages = state.renderImages[1] ?? [];

  for (let frame = 0, yShift = 0; frame < 3; frame += 1, yShift += 16) {
    const renderImage = shadowImages[frame];
    if (!renderImage) continue;

    const region = map.getBlitInfo(
      renderImage.getBaseSurface(),
      state.x + 16,
      state.y + yShift,
    );
    if (!region) continue;

    commands.push({
      renderImage,
      region: {
        ...region,
        destinationX: region.destinationX + shiftX,
        destinationY: region.destinationY + shiftY,
      },
    });
  }

  return commands;
}

/**
 * Replacement for upstream `ORock::DoRender`.
 * Role: Builds shifted, clipped blit commands for the visible rock body images.
 * Upstream: orock.cpp:283-304
 */
export function renderRockObject<
  TBaseSurface extends { width: number; height: number },
  TImage extends RockRenderableImage<TBaseSurface>,
>(
  state: Pick<RockObjectState, "x" | "y"> & RockRenderImageState<TImage>,
  map: RockRenderMap<TBaseSurface>,
  shiftX: number,
  shiftY: number,
): Array<RockBlitCommand<TImage>> {
  const commands: Array<RockBlitCommand<TImage>> = [];
  const bodyImages = state.renderImages[0] ?? [];

  for (let frame = 0, yShift = 0; frame < 3; frame += 1, yShift += 16) {
    const renderImage = bodyImages[frame];
    if (!renderImage) continue;

    const region = map.getBlitInfo(
      renderImage.getBaseSurface(),
      state.x,
      state.y + yShift,
    );
    if (!region) continue;

    commands.push({
      renderImage,
      region: {
        ...region,
        destinationX: region.destinationX + shiftX,
        destinationY: region.destinationY + shiftY,
      },
    });
  }

  return commands;
}

/**
 * Port of upstream `ORock::CreationMapEffects`.
 * Role: Preserves the upstream no-op hook for rock map creation effects.
 * Upstream: orock.cpp:698-701
 */
export function createRockMapEffects(map: unknown): void {
  void map;
}

/**
 * Port of upstream `ORock::DeathMapEffects`.
 * Role: Permanently stamps the destroyed lower rock tile when the map area is valid and unstamped.
 * Upstream: orock.cpp:703-724
 */
export function deathRockMapEffects<TSurface>(
  state: Pick<RockObjectState, "x" | "y" | "palette">,
  map: RockObjectDeathMap<TSurface>,
  rockDestroyedImages: readonly (readonly (TSurface | null)[])[],
  randomInt: (maxExclusive: number) => number = (maxExclusive) =>
    Math.floor(Math.random() * maxExclusive),
  fullRenderSurfaceAvailable = true,
): void {
  const tx = state.x;
  const ty = state.y + 32;

  if (tx < 0) return;
  if (ty < 0) return;
  if (tx + 16 > map.width * 16) return;
  if (ty + 16 > map.height * 16) return;
  if (map.coordStamped(tx, ty)) return;

  const destroyedIndex = Math.trunc(randomInt(6)) % 6;
  const surface = rockDestroyedImages[state.palette]?.[destroyedIndex] ?? null;

  map.permStamp(tx, ty, surface, false, fullRenderSurfaceAvailable);
}

/**
 * Port of upstream `ORock::CausesImpassAtCoord`.
 * Role: Reports whether the rock occupies the queried impassable coordinate.
 * Upstream: orock.cpp:673-676
 */
export function rockCausesImpassAtCoord(
  state: Pick<RockObjectState, "x" | "y">,
  x: number,
  y: number,
): boolean {
  return x === state.x && y === state.y + 32;
}

/**
 * Port of upstream `ORock::SetMapImpassables`.
 * Role: Marks the rock's lower occupied tile as a destroyable impassable.
 * Upstream: orock.cpp:678-686
 */
export function setRockMapImpassables(
  state: Pick<RockObjectState, "x" | "y">,
  map: RockObjectImpassableMap,
): void {
  const tileX = Math.trunc(state.x / 16);
  const tileY = Math.trunc(state.y / 16);

  map.setImpassable(tileX, tileY + 2, true, true);
}

/**
 * Port of upstream `ORock::UnSetMapImpassables`.
 * Role: Clears the rock's lower occupied tile while preserving destroyable impassable metadata.
 * Upstream: orock.cpp:688-696
 */
export function unsetRockMapImpassables(
  state: Pick<RockObjectState, "x" | "y">,
  map: RockObjectImpassableMap,
): void {
  const tileX = Math.trunc(state.x / 16);
  const tileY = Math.trunc(state.y / 16);

  map.setImpassable(tileX, tileY + 2, false, true);
}

/**
 * Port of upstream `ORock::SetOwner`.
 * Role: Forces rock ownership to the null team.
 * Upstream: orock.cpp:645-648
 */
export function setRockOwner(state: Pick<RockObjectState, "owner">): void {
  state.owner = TeamType.Null;
}

/**
 * Port of upstream `ORock::IsDestroyableImpass`.
 * Role: Reports that rock objects are destroyable impassable barriers.
 * Upstream: orock.h:31
 */
export function isRockDestroyableImpassable(): boolean {
  return true;
}
