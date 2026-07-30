import type { RgbaSurface } from "./ImageScaling";
import {
  type SurfaceDisplayFormatState,
  useRenderableSurfaceDisplayFormat,
} from "./SurfaceLifecycle";

/**
 * Upstream: zsdl.cpp, zsdl.h
 */

/**
 * Browser-side replacement for `SDL_Color`.
 * Role: Carries 8-bit color channels for a direct pixel write.
 * Upstream: zsdl.cpp:675-701
 */
export type SurfacePixelColor = {
  red: number;
  green: number;
  blue: number;
  alpha: number;
};

/**
 * Browser-side replacement for the SDL source/destination rectangle pair.
 * Role: Carries the copied region dimensions and destination position for blits.
 * Upstream: zsdl.cpp:551-566
 */
export type SurfaceBlitRegion = {
  sourceX: number;
  sourceY: number;
  width: number;
  height: number;
  destinationX: number;
  destinationY: number;
};

/**
 * Browser-side replacement for an SDL tile blit request.
 * Role: Carries source and destination tile coordinates for 16-pixel blits.
 * Upstream: zsdl.cpp:568-571
 */
export type SurfaceTileBlitRegion = {
  sourceX: number;
  sourceY: number;
  destinationX: number;
  destinationY: number;
};

export type SurfaceFillRectRegion = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type SurfaceFillCacheState<TRotozoomSurface, TTexture> = {
  useRenderCommands: boolean;
  rotozoomSurface: TRotozoomSurface | null;
  rotozoomLoaded: boolean;
  texture: TTexture | null;
  textureLoaded: boolean;
};

export type SurfaceAlphableState<TSurface extends RgbaSurface> =
  SurfaceDisplayFormatState<TSurface>;

export type RenderableSurfaceBlitState<TTexture> = {
  surface: RgbaSurface | null;
  screen: RgbaSurface | null;
  useRenderCommands: boolean;
  texture: TTexture | null;
  textureLoaded: boolean;
  size: number;
  angle: number;
  alpha: number;
};

export type RenderableSurfaceState<TTexture> =
  RenderableSurfaceBlitState<TTexture> & {
    rotozoomSurface: RgbaSurface | null;
    rotozoomLoaded: boolean;
    mapPlaceX: number;
    mapPlaceY: number;
  };

export type SurfaceScreenBoundsState = {
  surface: Pick<RgbaSurface, "width" | "height"> | null;
  size: number;
  screenWidth: number;
  screenHeight: number;
};

export type SurfaceBlitTarget<TRotozoomSurface, TTexture> = {
  surface: RgbaSurface | null;
  cacheState: SurfaceFillCacheState<TRotozoomSurface, TTexture>;
};

export type TexturedSurfaceRenderCommand<TTexture> = {
  texture: TTexture;
  destinationX: number;
  destinationY: number;
  width: number;
  height: number;
  sourceX: number;
  sourceY: number;
  sourceWidth: number;
  sourceHeight: number;
  textureLeft: number;
  textureTop: number;
  textureRight: number;
  textureBottom: number;
  scale: number;
  angle: number;
  alpha: number;
};

export type SurfaceFillRenderCommand = {
  region: SurfaceFillRectRegion | null;
  color: SurfacePixelColor;
  clear: boolean;
};

export type SurfaceMapBlitInfo = {
  sourceRegion: SurfaceFillRectRegion;
  destinationRegion: Pick<SurfaceFillRectRegion, "x" | "y">;
};

/**
 * Replacement for upstream `put32pixel`.
 * Role: Writes one pixel into a 32-bit surface when the target coordinate is inside bounds.
 * Upstream: zsdl.cpp:675-701
 */
export function putRgbaSurfacePixel(
  surface: RgbaSurface,
  x: number,
  y: number,
  color: SurfacePixelColor,
): void {
  if (x < 0 || y < 0 || x >= surface.width || y >= surface.height) {
    return;
  }

  const offset = (y * surface.width + x) * 4;
  surface.data[offset] = color.red;
  surface.data[offset + 1] = color.green;
  surface.data[offset + 2] = color.blue;
  surface.data[offset + 3] = color.alpha;
}

/**
 * Replacement for upstream `get32pixel`.
 * Role: Reads one 32-bit pixel from a surface and returns its color channels.
 * Upstream: zsdl.cpp:703-747
 */
export function getRgbaSurfacePixel(
  surface: RgbaSurface,
  x: number,
  y: number,
): SurfacePixelColor {
  if (x < 0 || y < 0 || x >= surface.width || y >= surface.height) {
    throw new RangeError("pixel coordinates must be inside the surface bounds");
  }

  const offset = (y * surface.width + x) * 4;

  return {
    red: surface.data[offset],
    green: surface.data[offset + 1],
    blue: surface.data[offset + 2],
    alpha: surface.data[offset + 3],
  };
}

/**
 * Replacement for upstream `ZSDL_ModifyBlack`.
 * Role: Recolors fully black visible pixels so they remain distinguishable from transparent black in later SDL-style operations.
 * Upstream: zsdl.cpp:523-549
 */
export function replaceOpaqueBlackPixels(surface: RgbaSurface): void {
  for (let offset = 0; offset < surface.data.length; offset += 4) {
    const red = surface.data[offset];
    const green = surface.data[offset + 1];
    const blue = surface.data[offset + 2];
    const alpha = surface.data[offset + 3];

    if (red === 0 && green === 0 && blue === 0 && alpha !== 0) {
      surface.data[offset] = 1;
      surface.data[offset + 1] = 0;
      surface.data[offset + 2] = 0;
    }
  }
}

/**
 * Replacement for upstream `ZSDL_Surface::MakeAlphable`.
 * Role: Prepares a software RGBA surface for black color-key alpha blits.
 * Upstream: zsdl_opengl.cpp:173-183
 */
export function makeRgbaSurfaceAlphable<TSurface extends RgbaSurface>(
  state: SurfaceAlphableState<TSurface>,
  convertSurface: (surface: TSurface) => TSurface,
  applyColorKey: (surface: TSurface, color: number) => void = (): void =>
    undefined,
  disposeSurface: (surface: TSurface) => void = (): void => undefined,
  applyAlpha: (surface: TSurface, alpha: number) => void = (): void =>
    undefined,
): void {
  if (!state.surface.current || state.useRenderCommands) {
    return;
  }

  replaceOpaqueBlackPixels(state.surface.current);
  useRenderableSurfaceDisplayFormat(
    state,
    convertSurface,
    disposeSurface,
    applyAlpha,
  );

  if (state.surface.current) {
    applyColorKey(state.surface.current, 0x000000);
  }
}

/**
 * Replacement for upstream `ZSDL_BlitSurface`.
 * Role: Copies a rectangular RGBA region from one surface into another.
 * Upstream: zsdl.cpp:551-566
 */
export function blitRgbaSurface(
  source: RgbaSurface,
  destination: RgbaSurface,
  region: SurfaceBlitRegion,
): void {
  if (region.width <= 0 || region.height <= 0) {
    return;
  }

  const startX = Math.max(
    0,
    -region.sourceX,
    -region.destinationX,
  );
  const startY = Math.max(
    0,
    -region.sourceY,
    -region.destinationY,
  );
  const endX = Math.min(
    region.width,
    source.width - region.sourceX,
    destination.width - region.destinationX,
  );
  const endY = Math.min(
    region.height,
    source.height - region.sourceY,
    destination.height - region.destinationY,
  );

  if (startX >= endX || startY >= endY) {
    return;
  }

  for (let offsetY = startY; offsetY < endY; offsetY += 1) {
    for (let offsetX = startX; offsetX < endX; offsetX += 1) {
      const sourceOffset =
        ((region.sourceY + offsetY) * source.width + region.sourceX + offsetX) *
        4;
      const destinationOffset =
        ((region.destinationY + offsetY) * destination.width +
          region.destinationX +
          offsetX) *
        4;

      destination.data.set(
        source.data.subarray(sourceOffset, sourceOffset + 4),
        destinationOffset,
      );
    }
  }
}

/**
 * Replacement for upstream `ZSDL_Surface::BlitSurface`.
 * Role: Copies the full source surface to a destination point.
 * Upstream: zsdl_opengl.cpp:625-633
 */
export function blitRgbaSurfaceAt(
  source: RgbaSurface,
  destination: RgbaSurface,
  x: number,
  y: number,
): void {
  blitRgbaSurface(source, destination, {
    sourceX: 0,
    sourceY: 0,
    width: source.width,
    height: source.height,
    destinationX: x,
    destinationY: y,
  });
}

/**
 * Replacement for upstream `ZSDL_Surface::BlitSurface`.
 * Role: Copies a source rectangle to a destination point.
 * Upstream: zsdl_opengl.cpp:635-650
 */
export function blitRgbaSurfaceRegionAt(
  source: RgbaSurface,
  destination: RgbaSurface,
  sourceX: number,
  sourceY: number,
  width: number,
  height: number,
  destinationX: number,
  destinationY: number,
): void {
  blitRgbaSurface(source, destination, {
    sourceX,
    sourceY,
    width,
    height,
    destinationX,
    destinationY,
  });
}

/**
 * Replacement for upstream `ZSDL_Surface::BlitOnToMe`.
 * Role: Blits an RGBA source region onto this surface and invalidates cached transformed render data.
 * Upstream: zsdl_opengl.cpp:349-370
 */
export function blitRgbaSurfaceOnToMe<TRotozoomSurface, TTexture>(
  destination: RgbaSurface | null,
  source: RgbaSurface,
  region: SurfaceBlitRegion,
  cacheState: SurfaceFillCacheState<TRotozoomSurface, TTexture>,
  disposeRotozoomSurface: (surface: TRotozoomSurface) => void = (): void =>
    undefined,
  deleteTexture: (texture: TTexture) => void = (): void => undefined,
): void {
  if (!destination) {
    return;
  }

  blitRgbaSurface(source, destination, region);

  if (cacheState.textureLoaded && cacheState.texture !== null) {
    deleteTexture(cacheState.texture);
    cacheState.textureLoaded = false;
  }

  if (!cacheState.useRenderCommands) {
    if (cacheState.rotozoomSurface !== null) {
      disposeRotozoomSurface(cacheState.rotozoomSurface);
    }
    cacheState.rotozoomSurface = null;
    cacheState.rotozoomLoaded = false;
  }
}

/**
 * Replacement for upstream `ZSDL_Surface::BlitSurface`.
 * Role: Routes a ZSDL surface blit to software surfaces or emits a browser texture render command.
 * Upstream: zsdl_opengl.cpp:652-730
 */
export function blitRenderableRgbaSurface<TRotozoomSurface, TTexture>(
  state: RenderableSurfaceBlitState<TTexture>,
  sourceRegion: SurfaceFillRectRegion | null,
  destinationRegion: Pick<SurfaceFillRectRegion, "x" | "y"> | null,
  destination: SurfaceBlitTarget<TRotozoomSurface, TTexture> | null,
  loadTexture: () => boolean = () => state.textureLoaded,
  renderTexture: (
    command: TexturedSurfaceRenderCommand<TTexture>,
  ) => void = (): void => undefined,
  disposeRotozoomSurface: (surface: TRotozoomSurface) => void = (): void =>
    undefined,
  deleteTexture: (texture: TTexture) => void = (): void => undefined,
): void {
  if (sourceRegion && (sourceRegion.width <= 0 || sourceRegion.height <= 0)) {
    return;
  }
  if (!state.surface) {
    return;
  }

  if (destination) {
    blitRgbaSurfaceOnToMe(
      destination.surface,
      state.surface,
      resolveSurfaceBlitRegion(state.surface, sourceRegion, destinationRegion),
      destination.cacheState,
      disposeRotozoomSurface,
      deleteTexture,
    );
    return;
  }

  if (state.useRenderCommands) {
    if (!state.textureLoaded && !loadTexture()) {
      return;
    }
    if (state.texture === null) {
      return;
    }

    renderTexture(
      resolveTexturedSurfaceRenderCommand(state, sourceRegion, destinationRegion),
    );
    return;
  }

  if (!state.screen) {
    return;
  }

  blitRgbaSurface(
    state.surface,
    state.screen,
    resolveSurfaceBlitRegion(state.surface, sourceRegion, destinationRegion),
  );
}

/**
 * Replacement for upstream `ZSDL_Surface::BlitHitSurface`.
 * Role: Renders a surface normally or draws visible source pixels as a white hit mask.
 * Upstream: zsdl_opengl.cpp:732-809
 */
export function blitRgbaHitSurface<TRotozoomSurface, TTexture>(
  state: RenderableSurfaceBlitState<TTexture>,
  sourceRegion: SurfaceFillRectRegion | null,
  destinationRegion: Pick<SurfaceFillRectRegion, "x" | "y"> | null,
  destination: SurfaceBlitTarget<TRotozoomSurface, TTexture> | null,
  renderHit: boolean,
  loadTexture: () => boolean = () => state.textureLoaded,
  renderTexture: (
    command: TexturedSurfaceRenderCommand<TTexture>,
  ) => void = (): void => undefined,
  renderFill: (command: SurfaceFillRenderCommand) => void = (): void =>
    undefined,
  disposeRotozoomSurface: (surface: TRotozoomSurface) => void = (): void =>
    undefined,
  deleteTexture: (texture: TTexture) => void = (): void => undefined,
): void {
  if (!renderHit) {
    blitRenderableRgbaSurface(
      state,
      sourceRegion,
      destinationRegion,
      destination,
      loadTexture,
      renderTexture,
      disposeRotozoomSurface,
      deleteTexture,
    );
    return;
  }
  if (!state.surface) {
    return;
  }

  const clippedSource = resolveClippedSourceRegion(state.surface, sourceRegion);
  const destinationX = destinationRegion?.x ?? 0;
  const destinationY = destinationRegion?.y ?? 0;

  for (let y = clippedSource.y; y < clippedSource.y + clippedSource.height; y += 1) {
    for (let x = clippedSource.x; x < clippedSource.x + clippedSource.width; x += 1) {
      if (getRgbaSurfacePixel(state.surface, x, y).alpha === 0) {
        continue;
      }

      zsdFillRgbaRect(
        state.screen,
        state.useRenderCommands,
        {
          x: destinationX + x - clippedSource.x,
          y: destinationY + y - clippedSource.y,
          width: 1,
          height: 1,
        },
        { red: 255, green: 255, blue: 255 },
        destination,
        renderFill,
        disposeRotozoomSurface,
        deleteTexture,
      );
    }
  }
}

/**
 * Replacement for upstream `ZSDL_BlitHitSurface`.
 * Role: Blits a software surface normally or draws visible source pixels as a black hit mask.
 * Upstream: zsdl.cpp:573-659
 */
export function blitRgbaHitSurfaceToSurface(
  source: RgbaSurface | null,
  sourceRegion: SurfaceFillRectRegion | null,
  destination: RgbaSurface | null,
  destinationRegion: Pick<SurfaceFillRectRegion, "x" | "y"> | null,
  renderHit: boolean,
): void {
  if (!renderHit) {
    if (source && destination) {
      blitRgbaSurface(
        source,
        destination,
        resolveSurfaceBlitRegion(source, sourceRegion, destinationRegion),
      );
    }
    return;
  }
  if (!source || !destination) {
    return;
  }

  const clippedSource = resolveClippedSourceRegion(source, sourceRegion);
  const destinationX = destinationRegion?.x ?? 0;
  const destinationY = destinationRegion?.y ?? 0;

  for (let y = clippedSource.y; y < clippedSource.y + clippedSource.height; y += 1) {
    for (let x = clippedSource.x; x < clippedSource.x + clippedSource.width; x += 1) {
      if (getRgbaSurfacePixel(source, x, y).alpha === 0) {
        continue;
      }

      fillRgbaSurfacePixels(
        destination,
        {
          x: destinationX + x,
          y: destinationY + y,
          width: 1,
          height: 1,
        },
        { red: 0, green: 0, blue: 0 },
      );
    }
  }
}

/**
 * Replacement for upstream `ZSDL_Surface::RenderSurfaceAreaRepeat`.
 * Role: Tiles a surface across an area, optionally using the white hit-mask renderer.
 * Upstream: zsdl_opengl.cpp:586-623
 */
export function renderRgbaSurfaceAreaRepeat<TRotozoomSurface, TTexture>(
  state: RenderableSurfaceBlitState<TTexture>,
  x: number,
  y: number,
  width: number,
  height: number,
  renderHit: boolean,
  loadTexture: () => boolean = () => state.textureLoaded,
  renderTexture: (
    command: TexturedSurfaceRenderCommand<TTexture>,
  ) => void = (): void => undefined,
  renderFill: (command: SurfaceFillRenderCommand) => void = (): void =>
    undefined,
  disposeRotozoomSurface: (surface: TRotozoomSurface) => void = (): void =>
    undefined,
  deleteTexture: (texture: TTexture) => void = (): void => undefined,
): void {
  if (!state.surface || state.surface.width <= 0 || state.surface.height <= 0) {
    return;
  }

  let remainingHeight = height;
  let offsetY = y;
  while (remainingHeight > 0) {
    let remainingWidth = width;
    let offsetX = x;
    while (remainingWidth > 0) {
      blitRgbaHitSurface(
        state,
        { x: 0, y: 0, width: remainingWidth, height: remainingHeight },
        { x: offsetX, y: offsetY },
        null,
        renderHit,
        loadTexture,
        renderTexture,
        renderFill,
        disposeRotozoomSurface,
        deleteTexture,
      );

      offsetX += state.surface.width;
      remainingWidth -= state.surface.width;
    }

    offsetY += state.surface.height;
    remainingHeight -= state.surface.height;
  }
}

/**
 * Replacement for upstream `ZSDL_Surface::RenderSurfaceVertRepeat`.
 * Role: Tiles a surface vertically, clipping the final tile to the remaining height.
 * Upstream: zsdl_opengl.cpp:550-584
 */
export function renderRgbaSurfaceVertRepeat<TRotozoomSurface, TTexture>(
  state: RenderableSurfaceBlitState<TTexture>,
  x: number,
  y: number,
  totalHeight: number,
  renderHit: boolean,
  loadTexture: () => boolean = () => state.textureLoaded,
  renderTexture: (
    command: TexturedSurfaceRenderCommand<TTexture>,
  ) => void = (): void => undefined,
  renderFill: (command: SurfaceFillRenderCommand) => void = (): void =>
    undefined,
  disposeRotozoomSurface: (surface: TRotozoomSurface) => void = (): void =>
    undefined,
  deleteTexture: (texture: TTexture) => void = (): void => undefined,
): void {
  if (!state.surface || state.surface.width <= 0 || state.surface.height <= 0) {
    return;
  }

  let remainingHeight = totalHeight;
  let offsetY = y;
  while (remainingHeight > 0) {
    const sourceRegion =
      remainingHeight > state.surface.height
        ? null
        : {
            x: 0,
            y: 0,
            width: state.surface.width,
            height: remainingHeight,
          };

    blitRgbaHitSurface(
      state,
      sourceRegion,
      { x, y: offsetY },
      null,
      renderHit,
      loadTexture,
      renderTexture,
      renderFill,
      disposeRotozoomSurface,
      deleteTexture,
    );

    remainingHeight -= state.surface.height;
    offsetY += state.surface.height;
  }
}

/**
 * Replacement for upstream `ZSDL_Surface::RenderSurfaceHorzRepeat`.
 * Role: Tiles a surface horizontally, clipping the final tile to the remaining width.
 * Upstream: zsdl_opengl.cpp:514-548
 */
export function renderRgbaSurfaceHorzRepeat<TRotozoomSurface, TTexture>(
  state: RenderableSurfaceBlitState<TTexture>,
  x: number,
  y: number,
  totalWidth: number,
  renderHit: boolean,
  loadTexture: () => boolean = () => state.textureLoaded,
  renderTexture: (
    command: TexturedSurfaceRenderCommand<TTexture>,
  ) => void = (): void => undefined,
  renderFill: (command: SurfaceFillRenderCommand) => void = (): void =>
    undefined,
  disposeRotozoomSurface: (surface: TRotozoomSurface) => void = (): void =>
    undefined,
  deleteTexture: (texture: TTexture) => void = (): void => undefined,
): void {
  if (!state.surface || state.surface.width <= 0 || state.surface.height <= 0) {
    return;
  }

  let remainingWidth = totalWidth;
  let offsetX = x;
  while (remainingWidth > 0) {
    const sourceRegion =
      remainingWidth > state.surface.width
        ? null
        : {
            x: 0,
            y: 0,
            width: remainingWidth,
            height: state.surface.height,
          };

    blitRgbaHitSurface(
      state,
      sourceRegion,
      { x: offsetX, y },
      null,
      renderHit,
      loadTexture,
      renderTexture,
      renderFill,
      disposeRotozoomSurface,
      deleteTexture,
    );

    remainingWidth -= state.surface.width;
    offsetX += state.surface.width;
  }
}

/**
 * Replacement for upstream `ZSDL_Surface::RenderSurface`.
 * Role: Renders a surface at a map-adjusted position through texture, software, or hit-mask paths.
 * Upstream: zsdl_opengl.cpp:424-512
 */
export function renderRgbaSurface<TRotozoomSurface, TTexture>(
  state: RenderableSurfaceState<TTexture>,
  x: number,
  y: number,
  renderHit: boolean,
  aboutCenter: boolean,
  getMapBlitInfo: (
    surface: RgbaSurface,
    x: number,
    y: number,
  ) => SurfaceMapBlitInfo | null,
  loadRotozoomSurface: () => boolean = () => state.rotozoomLoaded,
  loadTexture: () => boolean = () => state.textureLoaded,
  renderTexture: (
    command: TexturedSurfaceRenderCommand<TTexture>,
  ) => void = (): void => undefined,
  renderFill: (command: SurfaceFillRenderCommand) => void = (): void =>
    undefined,
  disposeRotozoomSurface: (surface: TRotozoomSurface) => void = (): void =>
    undefined,
  deleteTexture: (texture: TTexture) => void = (): void => undefined,
): void {
  if (!state.surface) {
    return;
  }

  if (state.useRenderCommands) {
    if (renderHit) {
      blitRgbaHitSurface(
        state,
        null,
        { x: x + state.mapPlaceX, y: y + state.mapPlaceY },
        null,
        true,
        loadTexture,
        renderTexture,
        renderFill,
        disposeRotozoomSurface,
        deleteTexture,
      );
      return;
    }

    if (!state.textureLoaded && !loadTexture()) {
      return;
    }
    if (state.texture === null) {
      return;
    }

    renderTexture({
      texture: state.texture,
      destinationX: x,
      destinationY: y,
      width: state.surface.width,
      height: state.surface.height,
      sourceX: 0,
      sourceY: 0,
      sourceWidth: state.surface.width,
      sourceHeight: state.surface.height,
      textureLeft: 0,
      textureTop: 0,
      textureRight: 1,
      textureBottom: 1,
      scale: state.size,
      angle: -state.angle,
      alpha: state.alpha,
    });
    return;
  }

  const usesRotozoom = state.angle !== 0 || state.size !== 1;
  if (usesRotozoom && !state.rotozoomLoaded && !loadRotozoomSurface()) {
    return;
  }

  const renderSurface = usesRotozoom ? state.rotozoomSurface : state.surface;
  if (!renderSurface) {
    return;
  }

  const renderX = aboutCenter ? x - Math.trunc(renderSurface.width / 2) : x;
  const renderY = aboutCenter ? y - Math.trunc(renderSurface.height / 2) : y;
  const blitInfo = getMapBlitInfo(renderSurface, renderX, renderY);
  if (!blitInfo) {
    return;
  }

  const destinationRegion = {
    x: blitInfo.destinationRegion.x + state.mapPlaceX,
    y: blitInfo.destinationRegion.y + state.mapPlaceY,
  };

  if (renderHit) {
    blitRgbaHitSurface(
      { ...state, surface: renderSurface, useRenderCommands: false },
      blitInfo.sourceRegion,
      destinationRegion,
      null,
      true,
      loadTexture,
      renderTexture,
      renderFill,
      disposeRotozoomSurface,
      deleteTexture,
    );
    return;
  }

  if (state.screen) {
    blitRgbaSurface(renderSurface, state.screen, {
      sourceX: blitInfo.sourceRegion.x,
      sourceY: blitInfo.sourceRegion.y,
      width: blitInfo.sourceRegion.width,
      height: blitInfo.sourceRegion.height,
      destinationX: destinationRegion.x,
      destinationY: destinationRegion.y,
    });
  }
}

/**
 * Replacement for upstream `ZSDL_Surface::WillRenderOnScreen`.
 * Role: Tests whether a scaled surface intersects the current screen bounds.
 * Upstream: zsdl_opengl.cpp:869-885
 */
export function willRgbaSurfaceRenderOnScreen(
  state: SurfaceScreenBoundsState,
  x: number,
  y: number,
  aboutCenter: boolean,
): boolean {
  if (!state.surface) {
    return false;
  }

  let renderX = x;
  let renderY = y;
  if (aboutCenter) {
    renderX -= Math.trunc(state.surface.width / 2) * state.size;
    renderY -= Math.trunc(state.surface.height / 2) * state.size;
  }

  if (renderX > state.screenWidth) {
    return false;
  }
  if (renderY > state.screenHeight) {
    return false;
  }
  if (renderX + state.surface.width * state.size < 0) {
    return false;
  }
  if (renderY + state.surface.height * state.size < 0) {
    return false;
  }

  return true;
}

function resolveSurfaceBlitRegion(
  source: RgbaSurface,
  sourceRegion: SurfaceFillRectRegion | null,
  destinationRegion: Pick<SurfaceFillRectRegion, "x" | "y"> | null,
): SurfaceBlitRegion {
  const clippedSource = resolveClippedSourceRegion(source, sourceRegion);

  return {
    sourceX: clippedSource.x,
    sourceY: clippedSource.y,
    width: clippedSource.width,
    height: clippedSource.height,
    destinationX: destinationRegion?.x ?? 0,
    destinationY: destinationRegion?.y ?? 0,
  };
}

function resolveTexturedSurfaceRenderCommand<TTexture>(
  state: RenderableSurfaceBlitState<TTexture>,
  sourceRegion: SurfaceFillRectRegion | null,
  destinationRegion: Pick<SurfaceFillRectRegion, "x" | "y"> | null,
): TexturedSurfaceRenderCommand<TTexture> {
  const source = state.surface;
  if (!source || state.texture === null) {
    throw new Error("textured render requires a loaded surface and texture");
  }

  const clippedSource = resolveClippedSourceRegion(source, sourceRegion);

  return {
    texture: state.texture,
    destinationX: destinationRegion?.x ?? 0,
    destinationY: destinationRegion?.y ?? 0,
    width: clippedSource.width,
    height: clippedSource.height,
    sourceX: clippedSource.x,
    sourceY: clippedSource.y,
    sourceWidth: clippedSource.width,
    sourceHeight: clippedSource.height,
    textureLeft: clippedSource.x / source.width,
    textureTop: clippedSource.y / source.height,
    textureRight: (clippedSource.x + clippedSource.width) / source.width,
    textureBottom: (clippedSource.y + clippedSource.height) / source.height,
    scale: state.size,
    angle: state.angle,
    alpha: state.alpha,
  };
}

function resolveClippedSourceRegion(
  source: RgbaSurface,
  sourceRegion: SurfaceFillRectRegion | null,
): SurfaceFillRectRegion {
  if (!sourceRegion) {
    return {
      x: 0,
      y: 0,
      width: source.width,
      height: source.height,
    };
  }

  return {
    x: sourceRegion.x,
    y: sourceRegion.y,
    width: Math.min(sourceRegion.width, source.width - sourceRegion.x),
    height: Math.min(sourceRegion.height, source.height - sourceRegion.y),
  };
}

/**
 * Replacement for upstream `ZSDL_BlitTileSurface`.
 * Role: Copies one 16-pixel tile between RGBA surfaces.
 * Upstream: zsdl.cpp:568-571
 */
export function blitRgbaTileSurface(
  source: RgbaSurface,
  destination: RgbaSurface,
  tile: SurfaceTileBlitRegion,
): void {
  blitRgbaSurface(source, destination, {
    sourceX: tile.sourceX * 16,
    sourceY: tile.sourceY * 16,
    width: 16,
    height: 16,
    destinationX: tile.destinationX * 16,
    destinationY: tile.destinationY * 16,
  });
}

/**
 * Replacement for upstream `ZSDL_Surface::ZSDL_FillRect`.
 * Role: Routes a fill operation to a destination surface, the software screen, or browser render commands.
 * Upstream: zsdl_opengl.cpp:373-422
 */
export function fillRenderableRgbaSurface<TRotozoomSurface, TTexture>(
  screen: RgbaSurface | null,
  useRenderCommands: boolean,
  region: SurfaceFillRectRegion | null,
  color: Omit<SurfacePixelColor, "alpha">,
  destination: SurfaceBlitTarget<TRotozoomSurface, TTexture> | null,
  renderFill: (command: SurfaceFillRenderCommand) => void = (): void =>
    undefined,
  disposeRotozoomSurface: (surface: TRotozoomSurface) => void = (): void =>
    undefined,
  deleteTexture: (texture: TTexture) => void = (): void => undefined,
): void {
  if (destination) {
    fillRgbaSurfaceRect(
      destination.surface,
      region,
      color,
      destination.cacheState,
      disposeRotozoomSurface,
      deleteTexture,
    );
    return;
  }

  if (useRenderCommands) {
    renderFill({
      region,
      color: {
        ...color,
        alpha: region ? 255 : 0,
      },
      clear: region === null,
    });
    return;
  }

  if (screen) {
    fillRgbaSurfacePixels(screen, region, color);
  }
}

/**
 * Replacement for upstream `ZSDL_FillRect`.
 * Role: Provides the module-level fill helper that forwards to the renderable surface fill operation.
 * Upstream: zsdl_opengl.h:90-91
 */
export function zsdFillRgbaRect<TRotozoomSurface, TTexture>(
  screen: RgbaSurface | null,
  useRenderCommands: boolean,
  region: SurfaceFillRectRegion | null,
  color: Omit<SurfacePixelColor, "alpha">,
  destination: SurfaceBlitTarget<TRotozoomSurface, TTexture> | null = null,
  renderFill: (command: SurfaceFillRenderCommand) => void = (): void =>
    undefined,
  disposeRotozoomSurface: (surface: TRotozoomSurface) => void = (): void =>
    undefined,
  deleteTexture: (texture: TTexture) => void = (): void => undefined,
): void {
  fillRenderableRgbaSurface(
    screen,
    useRenderCommands,
    region,
    color,
    destination,
    renderFill,
    disposeRotozoomSurface,
    deleteTexture,
  );
}

/**
 * Replacement for upstream `draw_box`.
 * Role: Draws a rectangular outline with one-pixel top, bottom, left, and right edges.
 * Upstream: zsdl.cpp:337-404
 */
export function drawRgbaSurfaceBox<TRotozoomSurface, TTexture>(
  screen: RgbaSurface | null,
  useRenderCommands: boolean,
  region: SurfaceFillRectRegion,
  color: Omit<SurfacePixelColor, "alpha">,
  maxX: number,
  maxY: number,
  destination: SurfaceBlitTarget<TRotozoomSurface, TTexture> | null = null,
  renderFill: (command: SurfaceFillRenderCommand) => void = (): void =>
    undefined,
  disposeRotozoomSurface: (surface: TRotozoomSurface) => void = (): void =>
    undefined,
  deleteTexture: (texture: TTexture) => void = (): void => undefined,
): void {
  if (region.x >= maxX || region.y >= maxY) {
    return;
  }

  const lines: SurfaceFillRectRegion[] = [
    { x: region.x, y: region.y, width: region.width, height: 1 },
    {
      x: region.x,
      y: region.y + region.height,
      width: region.width,
      height: 1,
    },
    { x: region.x, y: region.y, width: 1, height: region.height },
    {
      x: region.x + region.width,
      y: region.y,
      width: 1,
      height: region.height,
    },
  ];

  for (const line of lines) {
    zsdFillRgbaRect(
      screen,
      useRenderCommands,
      line,
      color,
      destination,
      renderFill,
      disposeRotozoomSurface,
      deleteTexture,
    );
  }
}

/**
 * Replacement for upstream `draw_selection_box`.
 * Role: Draws padded corner handles around a selection rectangle.
 * Upstream: zsdl.cpp:180-335
 */
export function drawRgbaSelectionBox<TRotozoomSurface, TTexture>(
  screen: RgbaSurface | null,
  useRenderCommands: boolean,
  region: SurfaceFillRectRegion,
  color: Omit<SurfacePixelColor, "alpha">,
  maxX: number,
  maxY: number,
  destination: SurfaceBlitTarget<TRotozoomSurface, TTexture> | null = null,
  renderFill: (command: SurfaceFillRenderCommand) => void = (): void =>
    undefined,
  disposeRotozoomSurface: (surface: TRotozoomSurface) => void = (): void =>
    undefined,
  deleteTexture: (texture: TTexture) => void = (): void => undefined,
): void {
  const paddedRegion = {
    x: region.x - 3,
    y: region.y - 3,
    width: region.width + 6,
    height: region.height + 6,
  };

  if (paddedRegion.x >= maxX || paddedRegion.y >= maxY) {
    return;
  }
  if (paddedRegion.x + paddedRegion.width < 0) {
    return;
  }
  if (paddedRegion.y + paddedRegion.height < 0) {
    return;
  }

  const lineLength = 5;
  const lines: SurfaceFillRectRegion[] = [
    { x: paddedRegion.x, y: paddedRegion.y, width: lineLength, height: 1 },
    { x: paddedRegion.x, y: paddedRegion.y, width: 1, height: lineLength },
    {
      x: paddedRegion.x + paddedRegion.width - lineLength,
      y: paddedRegion.y,
      width: lineLength,
      height: 1,
    },
    {
      x: paddedRegion.x + paddedRegion.width,
      y: paddedRegion.y,
      width: 1,
      height: lineLength,
    },
    {
      x: paddedRegion.x,
      y: paddedRegion.y + paddedRegion.height,
      width: lineLength,
      height: 1,
    },
    {
      x: paddedRegion.x,
      y: paddedRegion.y + paddedRegion.height - lineLength,
      width: 1,
      height: lineLength,
    },
    {
      x: paddedRegion.x + paddedRegion.width - lineLength,
      y: paddedRegion.y + paddedRegion.height,
      width: lineLength,
      height: 1,
    },
    {
      x: paddedRegion.x + paddedRegion.width,
      y: paddedRegion.y + paddedRegion.height - lineLength,
      width: 1,
      height: lineLength,
    },
  ];

  for (const line of lines) {
    const clippedLine = clipSelectionBoxLine(line, maxX, maxY);
    if (!clippedLine) {
      continue;
    }

    zsdFillRgbaRect(
      screen,
      useRenderCommands,
      clippedLine,
      color,
      destination,
      renderFill,
      disposeRotozoomSurface,
      deleteTexture,
    );
  }
}

function clipSelectionBoxLine(
  line: SurfaceFillRectRegion,
  maxX: number,
  maxY: number,
): SurfaceFillRectRegion | null {
  const clippedLine = { ...line };
  if (clippedLine.x + clippedLine.width >= maxX) {
    clippedLine.width = maxX - clippedLine.x;
  }
  if (clippedLine.y + clippedLine.height >= maxY) {
    clippedLine.height = maxY - clippedLine.y;
  }

  if (maxX - clippedLine.x <= 0 || maxY - clippedLine.y <= 0) {
    return null;
  }

  return clippedLine;
}

/**
 * Replacement for upstream `ZSDL_Surface::FillRectOnToMe`.
 * Role: Fills a rectangular RGBA region and invalidates cached transformed render data.
 * Upstream: zsdl_opengl.cpp:326-347
 */
export function fillRgbaSurfaceRect<TRotozoomSurface, TTexture>(
  surface: RgbaSurface | null,
  region: SurfaceFillRectRegion | null,
  color: Omit<SurfacePixelColor, "alpha">,
  cacheState: SurfaceFillCacheState<TRotozoomSurface, TTexture>,
  disposeRotozoomSurface: (surface: TRotozoomSurface) => void = (): void =>
    undefined,
  deleteTexture: (texture: TTexture) => void = (): void => undefined,
): void {
  if (!surface) {
    return;
  }

  fillRgbaSurfacePixels(surface, region, color);

  if (cacheState.textureLoaded && cacheState.texture !== null) {
    deleteTexture(cacheState.texture);
    cacheState.textureLoaded = false;
  }

  if (!cacheState.useRenderCommands) {
    if (cacheState.rotozoomSurface !== null) {
      disposeRotozoomSurface(cacheState.rotozoomSurface);
    }
    cacheState.rotozoomSurface = null;
    cacheState.rotozoomLoaded = false;
  }
}

function fillRgbaSurfacePixels(
  surface: RgbaSurface,
  region: SurfaceFillRectRegion | null,
  color: Omit<SurfacePixelColor, "alpha">,
): void {
  const fillRegion = region ?? {
    x: 0,
    y: 0,
    width: surface.width,
    height: surface.height,
  };
  const startX = Math.max(0, fillRegion.x);
  const startY = Math.max(0, fillRegion.y);
  const endX = Math.min(surface.width, fillRegion.x + fillRegion.width);
  const endY = Math.min(surface.height, fillRegion.y + fillRegion.height);

  for (let y = startY; y < endY; y += 1) {
    for (let x = startX; x < endX; x += 1) {
      putRgbaSurfacePixel(surface, x, y, {
        ...color,
        alpha: 255,
      });
    }
  }
}
