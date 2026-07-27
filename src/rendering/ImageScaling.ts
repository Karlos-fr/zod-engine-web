/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - Files: SDL_rotozoom.cpp, SDL_rotozoom.h
 * - Symbols: shrinkSurfaceRGBA, shrinkSurfaceY, zoomSurfaceY,
 *   rotateSurface90Degrees, rotozoomSurfaceSizeXY, rotozoomSurfaceSize, MAX,
 *   VALUE_LIMIT, _SDL_rotozoom_h, M_PI, SMOOTHING_OFF, SMOOTHING_ON,
 *   SDL_ROTOZOOM_SCOPE
 * - Ledger: FUN-0743BB, FUN-9C99EE, FUN-AB50C1, FUN-B81617,
 *   FUN-E7CB44, FUN-FEC912, MAC-04F8EA, MAC-38509D, MAC-78DBD4,
 *   MAC-8F2CDF, MAC-9E34B7, MAC-D23627, MAC-E8E547
 *
 * Porting notes:
 * - SDL surfaces are replaced with browser-compatible typed pixel buffers.
 * - The C `MAX` macro is replaced by native `Math.max` where needed.
 * - The C `_SDL_rotozoom_h` header guard is replaced by ES module boundaries.
 * - The C `SDL_ROTOZOOM_SCOPE` export/import macro variants are replaced by
 *   named ES exports.
 */

/**
 * Browser replacement for SDL RGBA surface storage.
 *
 * Role:
 * - Carries dimensions and packed RGBA pixels for Web image transforms.
 *
 * Ledger: FUN-0743BB, FUN-9C99EE
 * Upstream: SDL_rotozoom.cpp
 *
 * Adaptation:
 * - Uses `Uint8ClampedArray` instead of SDL surface memory.
 */
export type RgbaSurface = {
  width: number;
  height: number;
  data: Uint8ClampedArray;
};

/**
 * Browser replacement for single-channel SDL surface storage.
 *
 * Role:
 * - Carries dimensions and grayscale pixels for Web image transforms.
 *
 * Ledger: FUN-E7CB44, FUN-FEC912
 * Upstream: SDL_rotozoom.cpp
 *
 * Adaptation:
 * - Uses `Uint8ClampedArray` instead of SDL surface memory.
 */
export type GrayscaleSurface = {
  width: number;
  height: number;
  data: Uint8ClampedArray;
};

/**
 * Replacement for upstream `VALUE_LIMIT`.
 *
 * Role:
 * - Defines the lower bound used to avoid near-zero transform instability.
 *
 * Ledger: MAC-D23627
 * Upstream: SDL_rotozoom.cpp:772, SDL_rotozoom.cpp:1095
 *
 * Adaptation:
 * - Replaces both duplicate C preprocessor macro declarations with one named
 *   TypeScript constant.
 */
export const ROTOZOOM_VALUE_LIMIT = 0.001;

/**
 * Replacement for upstream `M_PI`.
 *
 * Role:
 * - Provides the pi constant used when converting rotozoom degrees to radians.
 *
 * Ledger: MAC-38509D
 * Upstream: SDL_rotozoom.h:21
 *
 * Adaptation:
 * - Replaces the C preprocessor macro with a named TypeScript constant while
 *   preserving the upstream numeric precision.
 */
export const ROTOZOOM_PI = 3.141592654;

/**
 * Replacement for upstream `SMOOTHING_OFF`.
 *
 * Role:
 * - Identifies nearest-neighbor rotozoom sampling when smoothing is disabled.
 *
 * Ledger: MAC-78DBD4
 * Upstream: SDL_rotozoom.h:28
 *
 * Adaptation:
 * - Replaces the C preprocessor macro with a named TypeScript constant.
 */
export const ROTOZOOM_SMOOTHING_OFF = 0;

/**
 * Replacement for upstream `SMOOTHING_ON`.
 *
 * Role:
 * - Identifies interpolated rotozoom sampling when smoothing is enabled.
 *
 * Ledger: MAC-E8E547
 * Upstream: SDL_rotozoom.h:29
 *
 * Adaptation:
 * - Replaces the C preprocessor macro with a named TypeScript constant.
 */
export const ROTOZOOM_SMOOTHING_ON = 1;

/**
 * Replacement for upstream `shrinkSurfaceRGBA`.
 *
 * Role:
 * - Downscales an RGBA surface by averaging integer-sized pixel blocks.
 *
 * Ledger: FUN-0743BB
 * Upstream: SDL_rotozoom.cpp:29-101
 *
 * Adaptation:
 * - Operates on browser-compatible RGBA buffers instead of SDL surfaces.
 */
export function shrinkRgbaSurface(
  source: RgbaSurface,
  factorX: number,
  factorY: number,
): RgbaSurface {
  if (
    !Number.isInteger(factorX) ||
    !Number.isInteger(factorY) ||
    factorX <= 0 ||
    factorY <= 0
  ) {
    throw new RangeError("shrink factors must be positive integers");
  }

  const width = Math.floor(source.width / factorX);
  const height = Math.floor(source.height / factorY);
  const data = new Uint8ClampedArray(width * height * 4);
  const sampleCount = factorX * factorY;

  for (let destinationY = 0; destinationY < height; destinationY += 1) {
    for (let destinationX = 0; destinationX < width; destinationX += 1) {
      const totals = [0, 0, 0, 0];
      for (let offsetY = 0; offsetY < factorY; offsetY += 1) {
        for (let offsetX = 0; offsetX < factorX; offsetX += 1) {
          const sourceX = destinationX * factorX + offsetX;
          const sourceY = destinationY * factorY + offsetY;
          const sourceOffset = (sourceY * source.width + sourceX) * 4;
          for (let channel = 0; channel < 4; channel += 1) {
            totals[channel] += source.data[sourceOffset + channel];
          }
        }
      }

      const destinationOffset = (destinationY * width + destinationX) * 4;
      for (let channel = 0; channel < 4; channel += 1) {
        data[destinationOffset + channel] = Math.floor(
          totals[channel] / sampleCount,
        );
      }
    }
  }

  return { width, height, data };
}

/**
 * Replacement for upstream `rotateSurface90Degrees`.
 *
 * Role:
 * - Rotates an RGBA surface by quarter-turn increments.
 *
 * Ledger: FUN-9C99EE
 * Upstream: SDL_rotozoom.cpp:663-759
 *
 * Adaptation:
 * - Operates on browser-compatible RGBA buffers instead of SDL surfaces.
 */
export function rotateRgbaSurface90Degrees(
  source: RgbaSurface,
  clockwiseTurns: number,
): RgbaSurface {
  const turns = ((Math.trunc(clockwiseTurns) % 4) + 4) % 4;
  const width = turns % 2 === 0 ? source.width : source.height;
  const height = turns % 2 === 0 ? source.height : source.width;
  const data = new Uint8ClampedArray(source.data.length);

  for (let sourceY = 0; sourceY < source.height; sourceY += 1) {
    for (let sourceX = 0; sourceX < source.width; sourceX += 1) {
      let destinationX = sourceX;
      let destinationY = sourceY;
      if (turns === 1) {
        destinationX = source.height - sourceY - 1;
        destinationY = sourceX;
      } else if (turns === 2) {
        destinationX = source.width - sourceX - 1;
        destinationY = source.height - sourceY - 1;
      } else if (turns === 3) {
        destinationX = sourceY;
        destinationY = source.width - sourceX - 1;
      }

      const sourceOffset = (sourceY * source.width + sourceX) * 4;
      const destinationOffset = (destinationY * width + destinationX) * 4;
      data.set(source.data.subarray(sourceOffset, sourceOffset + 4), destinationOffset);
    }
  }

  return { width, height, data };
}

/**
 * Replacement for upstream `rotozoomSurfaceSizeXY`.
 *
 * Role:
 * - Calculates the destination bounds for non-uniform rotozoom transforms.
 *
 * Ledger: FUN-AB50C1
 * Upstream: SDL_rotozoom.cpp:809-814
 *
 * Adaptation:
 * - Returns a dimension object instead of writing output reference arguments.
 */
export function calculateRotozoomSurfaceSize(
  width: number,
  height: number,
  angleDegrees: number,
  zoomX: number,
  zoomY: number,
): { width: number; height: number } {
  const angleRadians = (angleDegrees * ROTOZOOM_PI) / 180;
  const rawSine = Math.abs(Math.sin(angleRadians));
  const rawCosine = Math.abs(Math.cos(angleRadians));
  const sine = rawSine < Number.EPSILON * 8 ? 0 : rawSine;
  const cosine = rawCosine < Number.EPSILON * 8 ? 0 : rawCosine;
  const scaledWidth = Math.abs(width * zoomX);
  const scaledHeight = Math.abs(height * zoomY);

  return {
    width: Math.ceil(scaledWidth * cosine + scaledHeight * sine),
    height: Math.ceil(scaledWidth * sine + scaledHeight * cosine),
  };
}

/**
 * Replacement for upstream `rotozoomSurfaceSize`.
 *
 * Role:
 * - Calculates the destination bounds for uniform rotozoom transforms.
 *
 * Ledger: FUN-B81617
 * Upstream: SDL_rotozoom.cpp:818-823
 *
 * Adaptation:
 * - Delegates to the non-uniform Web calculation with equal zoom axes.
 */
export function calculateUniformRotozoomSurfaceSize(
  width: number,
  height: number,
  angleDegrees: number,
  zoom: number,
): { width: number; height: number } {
  return calculateRotozoomSurfaceSize(
    width,
    height,
    angleDegrees,
    zoom,
    zoom,
  );
}

/**
 * Replacement for upstream `shrinkSurfaceY`.
 *
 * Role:
 * - Downscales a grayscale surface by averaging integer-sized pixel blocks.
 *
 * Ledger: FUN-E7CB44
 * Upstream: SDL_rotozoom.cpp:111-178
 *
 * Adaptation:
 * - Operates on browser-compatible single-channel buffers.
 */
export function shrinkGrayscaleSurface(
  source: GrayscaleSurface,
  factorX: number,
  factorY: number,
): GrayscaleSurface {
  if (
    !Number.isInteger(factorX) ||
    !Number.isInteger(factorY) ||
    factorX <= 0 ||
    factorY <= 0
  ) {
    throw new RangeError("shrink factors must be positive integers");
  }

  const width = Math.floor(source.width / factorX);
  const height = Math.floor(source.height / factorY);
  const data = new Uint8ClampedArray(width * height);
  const sampleCount = factorX * factorY;

  for (let destinationY = 0; destinationY < height; destinationY += 1) {
    for (let destinationX = 0; destinationX < width; destinationX += 1) {
      let total = 0;
      for (let offsetY = 0; offsetY < factorY; offsetY += 1) {
        for (let offsetX = 0; offsetX < factorX; offsetX += 1) {
          const sourceX = destinationX * factorX + offsetX;
          const sourceY = destinationY * factorY + offsetY;
          total += source.data[sourceY * source.width + sourceX];
        }
      }
      data[destinationY * width + destinationX] = Math.floor(
        total / sampleCount,
      );
    }
  }

  return { width, height, data };
}

/**
 * Replacement for upstream `zoomSurfaceY`.
 *
 * Role:
 * - Resizes a grayscale surface using nearest-neighbor sampling.
 *
 * Ledger: FUN-FEC912
 * Upstream: SDL_rotozoom.cpp:396-492
 *
 * Adaptation:
 * - Includes horizontal and vertical flipping over browser buffers.
 */
export function resizeGrayscaleSurfaceNearest(
  source: GrayscaleSurface,
  width: number,
  height: number,
  flipX = false,
  flipY = false,
): GrayscaleSurface {
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width <= 0 ||
    height <= 0
  ) {
    throw new RangeError("destination dimensions must be positive integers");
  }

  const data = new Uint8ClampedArray(width * height);
  for (let destinationY = 0; destinationY < height; destinationY += 1) {
    const sampledY = Math.floor((destinationY * source.height) / height);
    const sourceY = flipY ? source.height - sampledY - 1 : sampledY;
    for (let destinationX = 0; destinationX < width; destinationX += 1) {
      const sampledX = Math.floor((destinationX * source.width) / width);
      const sourceX = flipX ? source.width - sampledX - 1 : sampledX;
      data[destinationY * width + destinationX] =
        source.data[sourceY * source.width + sourceX];
    }
  }

  return { width, height, data };
}
