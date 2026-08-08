/**
 * Upstream: bfort.h
 */

import { pointsWithinArea } from "../Common";
import { BuildingType, PlanetType, TeamType } from "../SimulationConstants";
import type { SurfaceBlitRegion } from "../../rendering/SurfacePixels";
import type { MapSurfaceRenderCommand } from "../../world/GameMap";
import {
  BuildingEntity,
  BuildingState,
  type BuildingShowTimeTextRenderer,
} from "./BuildingTypes";

export type FortDestroyedOverlayImages<TImage> = ReadonlyArray<
  TImage | null | undefined
>;

export type FortPreRenderSurface<TImage> = {
  image: TImage;
  alpha: number;
};

export type FortPreRenderState<TImage> = {
  position: { x: number; y: number };
  palette: number;
  destroyed: boolean;
  isFront: boolean;
  destroyedFade: number;
  frontDestroyedOverlayImages: FortDestroyedOverlayImages<TImage>;
  backDestroyedOverlayImages: FortDestroyedOverlayImages<TImage>;
};

export type FortPreRenderMap<TImage> = {
  renderZSurface(
    surface: FortPreRenderSurface<TImage>,
    x: number,
    y: number,
    renderHit: boolean,
    aboutCenter: boolean,
  ): MapSurfaceRenderCommand<FortPreRenderSurface<TImage>>;
};

export type FortPreRenderCommand<TImage> =
  | MapSurfaceRenderCommand<FortPreRenderSurface<TImage>>
  | null;

export type FortBaseImages<TImage> = ReadonlyArray<TImage | null | undefined>;

export type FortRenderState<TImage> = {
  position: { x: number; y: number };
  palette: number;
  destroyed: boolean;
  isFront: boolean;
  dontStamp: boolean;
  doBaseRerender: boolean;
  frontBaseImages: FortBaseImages<TImage>;
  frontDestroyedBaseImages: FortBaseImages<TImage>;
  backBaseImages: FortBaseImages<TImage>;
  backDestroyedBaseImages: FortBaseImages<TImage>;
};

export type FortRenderMap<TImage> = {
  permStamp(x: number, y: number, surface: TImage): boolean;
  renderZSurface(
    surface: TImage,
    x: number,
    y: number,
    renderHit: boolean,
    aboutCenter: boolean,
  ): MapSurfaceRenderCommand<TImage>;
};

export type FortRenderCommand<TImage> = MapSurfaceRenderCommand<TImage> | null;

export type FortUnitCoverSurface<TImage> =
  | { kind: "base"; image: TImage }
  | { kind: "overlay"; image: TImage; alpha: number };

export type FortUnitCoverBlitCommand<TImage> = {
  surface: FortUnitCoverSurface<TImage>;
  region: SurfaceBlitRegion;
};

export type FortUnitCoverState<TImage> = {
  position: { x: number; y: number };
  shift: { x: number; y: number };
  palette: number;
  destroyed: boolean;
  isFront: boolean;
  destroyedFade: number;
  frontBaseImages: FortBaseImages<TImage>;
  frontDestroyedBaseImages: FortBaseImages<TImage>;
  frontDestroyedOverlayImages: FortDestroyedOverlayImages<TImage>;
  backBaseImages: FortBaseImages<TImage>;
  backDestroyedBaseImages: FortBaseImages<TImage>;
  backDestroyedOverlayImages: FortDestroyedOverlayImages<TImage>;
};

export type FortUnitCoverMap = {
  getBlitInfoFromDimensions(
    x: number,
    y: number,
    width: number,
    height: number,
  ): SurfaceBlitRegion | null;
};

/**
 * Replacement for upstream `BFort::DoPreRender`.
 * Role: Builds the destroyed fort overlay render command with the current fade alpha.
 * Upstream: bfort.cpp:214-239
 */
export function renderFortDestroyedOverlay<TImage>(
  state: FortPreRenderState<TImage>,
  zmap: FortPreRenderMap<TImage>,
): FortPreRenderCommand<TImage> {
  if (!state.destroyed) return null;

  const image = state.isFront
    ? state.frontDestroyedOverlayImages[state.palette]
    : state.backDestroyedOverlayImages[state.palette];
  if (!image) return null;

  return zmap.renderZSurface(
    { image, alpha: state.destroyedFade },
    state.position.x,
    state.position.y,
    false,
    false,
  );
}

/**
 * Replacement for upstream `BFort::DoRender`.
 * Role: Stamps or renders the fort base image selected by orientation, palette, and destruction state.
 * Upstream: bfort.cpp:241-301
 */
export function renderFortBase<TImage>(
  state: FortRenderState<TImage>,
  zmap: FortRenderMap<TImage>,
): FortRenderCommand<TImage> {
  if (!state.dontStamp) {
    if (!state.doBaseRerender) return null;

    const surface = getFortBaseSurface(state);
    if (!surface) return null;

    if (zmap.permStamp(state.position.x, state.position.y, surface)) {
      state.doBaseRerender = false;
    }

    return null;
  }

  const surface = getFortBaseSurface(state);
  if (!surface) return null;

  return zmap.renderZSurface(
    surface,
    state.position.x,
    state.position.y,
    false,
    false,
  );
}

function getFortBaseSurface<TImage>(
  state: FortRenderState<TImage>,
): TImage | null | undefined {
  if (state.isFront) {
    return state.destroyed
      ? state.frontDestroyedBaseImages[state.palette]
      : state.frontBaseImages[state.palette];
  }

  return state.destroyed
    ? state.backDestroyedBaseImages[state.palette]
    : state.backBaseImages[state.palette];
}

/**
 * Replacement for upstream `BFort::RenderUnitCover`.
 * Role: Builds clipped blit commands for the fort unit-creation cover region.
 * Upstream: bfort.cpp:349-401
 */
export function renderFortUnitCover<TImage>(
  state: FortUnitCoverState<TImage>,
  zmap: FortUnitCoverMap,
): Array<FortUnitCoverBlitCommand<TImage>> {
  const sourceOffsetX = 64 - 8;
  const sourceOffsetY = state.isFront ? 112 - 8 : 16;
  const region = zmap.getBlitInfoFromDimensions(
    state.position.x + sourceOffsetX,
    state.position.y + sourceOffsetY,
    32 + 16,
    32 + 9,
  );
  if (!region) return [];

  const adjustedRegion = {
    ...region,
    sourceX: region.sourceX + sourceOffsetX,
    sourceY: region.sourceY + sourceOffsetY,
    destinationX: region.destinationX + state.shift.x,
    destinationY: region.destinationY + state.shift.y,
  };

  if (state.isFront) {
    return buildFortUnitCoverCommands(
      state,
      adjustedRegion,
      state.frontBaseImages[state.palette],
      state.frontDestroyedBaseImages[state.palette],
      state.frontDestroyedOverlayImages[state.palette],
    );
  }

  return buildFortUnitCoverCommands(
    state,
    adjustedRegion,
    state.backBaseImages[state.palette],
    state.backDestroyedBaseImages[state.palette],
    state.backDestroyedOverlayImages[state.palette],
  );
}

function buildFortUnitCoverCommands<TImage>(
  state: FortUnitCoverState<TImage>,
  region: SurfaceBlitRegion,
  baseImage: TImage | null | undefined,
  destroyedBaseImage: TImage | null | undefined,
  destroyedOverlayImage: TImage | null | undefined,
): Array<FortUnitCoverBlitCommand<TImage>> {
  if (!state.destroyed) {
    if (!baseImage) return [];
    return [{ surface: { kind: "base", image: baseImage }, region }];
  }

  const commands: Array<FortUnitCoverBlitCommand<TImage>> = [];
  if (destroyedBaseImage) {
    commands.push({ surface: { kind: "base", image: destroyedBaseImage }, region });
  }
  if (destroyedOverlayImage) {
    commands.push({
      surface: {
        kind: "overlay",
        image: destroyedOverlayImage,
        alpha: state.destroyedFade,
      },
      region,
    });
  }

  return commands;
}

/**
 * Browser simulation entity containing the subset of `BFort` behavior already ported.
 * Role: Represents fort-specific behavior over the base game entity.
 * Upstream: bfort.h
 */
export class FortEntity extends BuildingEntity {
  isFront = true;
  palette = PlanetType.Desert;
  unitCreateX = 0;
  unitCreateY = 0;
  unitMoveX = 0;
  unitMoveY = 0;
  flagIndex = 0;
  nextFlagTime = 0;
  destroyedFade = 0;
  lastFadeTime = 0;
  fadeDirection = 100;

  /**
   * Port of upstream `BFort::Process`.
   * Role: Advances fort flag animation, production countdown display, and destroyed-overlay fade.
   * Upstream: bfort.cpp:177-212
   */
  override process<TImage = unknown>(
    currentTime = this.ztime?.ztime ?? 0,
    processBuildingEffects: ((currentTime: number) => void) | null = null,
    renderShowTimeText: BuildingShowTimeTextRenderer<TImage> = (_font, text) =>
      text as TImage,
  ): number {
    processBuildingEffects?.(currentTime);

    if (currentTime > this.nextFlagTime) {
      this.flagIndex += 1;
      if (this.flagIndex >= 4) this.flagIndex = 0;

      this.nextFlagTime = currentTime + 0.2;
    }

    if (this.buildState !== BuildingState.Select) {
      this.resetShowTime(
        Math.trunc(this.productionTimeLeft(currentTime)),
        renderShowTimeText,
      );
    } else {
      this.resetShowTime(-1, renderShowTimeText);
    }

    this.destroyedFade += (currentTime - this.lastFadeTime) * this.fadeDirection;
    this.lastFadeTime = currentTime;

    if (this.destroyedFade > 254) {
      this.destroyedFade = 254;
      this.fadeDirection *= -1;
    } else if (this.destroyedFade < 1) {
      this.destroyedFade = 1;
      this.fadeDirection *= -1;
    }

    return 1;
  }

  /**
   * Port of upstream `BFort::SetIsFront`.
   * Role: Configures fort orientation, footprint, spawn offsets, and center coordinates.
   * Upstream: bfort.cpp:137-175
   */
  setIsFront(isFront: boolean): void {
    this.isFront = isFront;

    if (this.isFront) {
      this.objectId = BuildingType.FortFront;
      this.width = 10;
      this.height = 12;
      this.pixelWidth = this.width * 16;
      this.pixelHeight = this.height * 16;
      this.unitCreateX = 80;
      this.unitCreateY = 128;
      this.unitMoveX = 80;
      this.unitMoveY = 192 + 16;

      if (this.palette === PlanetType.Jungle) {
        this.height -= 1;
        this.pixelHeight = this.height * 16;
      }
    } else {
      this.objectId = BuildingType.FortBack;
      this.width = 10;
      this.height = 11;
      this.pixelWidth = this.width * 16;
      this.pixelHeight = this.height * 16;
      this.unitCreateX = 80;
      this.unitCreateY = 32;
      this.unitMoveX = 80;
      this.unitMoveY = -16;
    }

    this.centerX = this.position.x + (this.pixelWidth >> 1);
    this.centerY = this.position.y + (this.pixelHeight >> 1);
  }

  /**
   * Port of upstream `CanSetRallypoints`.
   * Role: Reports whether forts can set rally points.
   * Upstream: bfort.h:25
   */
  override canSetRallypoints(): boolean {
    return true;
  }

  /**
   * Port of upstream `ProducesUnits`.
   * Role: Reports whether forts can produce units.
   * Upstream: bfort.h:26
   */
  override producesUnits(): boolean {
    return true;
  }

  /**
   * Port of upstream `BFort::CanEnterFort`.
   * Role: Reports whether a team can enter this fort.
   * Upstream: bfort.cpp:483-489
   */
  override canEnterFort(team: TeamType): boolean {
    if (team === this.owner) return false;
    if (this.isDestroyed()) return false;

    return true;
  }

  /**
   * Port of upstream `BFort::UnderCursorCanAttack`.
   * Role: Checks whether the cursor is over an attackable fort body section.
   * Upstream: bfort.cpp:491-515
   */
  override underCursorCanAttack(mapX: number, mapY: number): boolean {
    const localX = mapX - this.position.x;
    const localY = mapY - this.position.y;

    if (pointsWithinArea(localX, localY, 16, 16, 16 * 8, 16 * 7)) {
      return true;
    }
    if (pointsWithinArea(localX, localY, 0, 16 * 3, 16 * 10, 16 * 4)) {
      return true;
    }
    if (pointsWithinArea(localX, localY, 16, 0, 16 * 2, 16)) {
      return true;
    }
    if (pointsWithinArea(localX, localY, 16 * 7, 0, 16 * 2, 16)) {
      return true;
    }
    if (pointsWithinArea(localX, localY, 16 * 2, 16 * 8, 16, 16)) {
      return true;
    }

    return pointsWithinArea(localX, localY, 16 * 7, 16 * 8, 16, 16);
  }

  /**
   * Port of upstream `BFort::UnderCursorFortCanEnter`.
   * Role: Checks whether the cursor is over a fort entry area.
   * Upstream: bfort.cpp:517-532
   */
  override underCursorFortCanEnter(mapX: number, mapY: number): boolean {
    const localX = mapX - this.position.x;
    const localY = mapY - this.position.y;

    if (this.objectId === BuildingType.FortFront) {
      return pointsWithinArea(localX, localY, 16 * 4, 16 * 2, 32, 16 * 6);
    }

    return pointsWithinArea(localX, localY, 16 * 4, 16, 32, 16 * 4);
  }

  /**
   * Port of upstream `BFort::CannonNotPlacable`.
   * Role: Allows cannon placement on fort mount points while other overlapping fort areas block placement.
   * Upstream: bfort.cpp:534-548
   */
  override cannonNotPlacable(selection: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  }): boolean {
    const localX = selection.left - this.position.x;
    const localY = selection.top - this.position.y;

    if (localX === 16 && (localY === 0 || localY === 48)) return false;
    if (localX === 112 && (localY === 0 || localY === 48)) return false;

    return this.withinSelection(selection);
  }
}
