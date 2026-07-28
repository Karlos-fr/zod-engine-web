import type { RgbaSurface } from "./ImageScaling";

/**
 * Ported from Zod Engine.
 * Upstream: zsdl.cpp, zsdl.h
 */

/**
 * Browser-side replacement for `SDL_Color`.
 * Role: Carries 8-bit color channels for a direct pixel write.
 * Ledger: FUN-9356C2
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
 * Ledger: FUN-A5A250
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
 * Ledger: FUN-6D8C4B
 * Upstream: zsdl.cpp:568-571
 */
export type SurfaceTileBlitRegion = {
  sourceX: number;
  sourceY: number;
  destinationX: number;
  destinationY: number;
};

/**
 * Replacement for upstream `put32pixel`.
 * Role: Writes one pixel into a 32-bit surface when the target coordinate is inside bounds.
 * Ledger: FUN-9356C2
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
 * Ledger: FUN-F75CC8
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
 * Ledger: FUN-A35BBA
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
 * Replacement for upstream `ZSDL_BlitSurface`.
 * Role: Copies a rectangular RGBA region from one surface into another.
 * Ledger: FUN-A5A250
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
 * Replacement for upstream `ZSDL_BlitTileSurface`.
 * Role: Copies one 16-pixel tile between RGBA surfaces.
 * Ledger: FUN-6D8C4B
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
