/**
 * Ported from Zod Engine.
 * Upstream: SDL_rotozoom.cpp, SDL_rotozoom.h
 */

/**
 * Browser replacement for SDL RGBA surface storage.
 * Role: Carries dimensions and packed RGBA pixels for Web image transforms.
 * Ledger: FUN-0743BB, FUN-9C99EE
 * Upstream: SDL_rotozoom.cpp
 */
export type RgbaSurface = {
  width: number;
  height: number;
  data: Uint8ClampedArray;
};

/**
 * Browser replacement for single-channel SDL surface storage.
 * Role: Carries dimensions and grayscale pixels for Web image transforms.
 * Ledger: FUN-E7CB44, FUN-FEC912
 * Upstream: SDL_rotozoom.cpp
 */
export type GrayscaleSurface = {
  width: number;
  height: number;
  data: Uint8ClampedArray;
};

/**
 * Browser replacement for the SDL rotozoom transform parameters.
 * Role: Carries fixed-point rotation and flip options for RGBA surface transforms.
 * Ledger: FUN-4429C1
 * Upstream: SDL_rotozoom.cpp:502-598
 */
export type RgbaSurfaceTransform = {
  centerX: number;
  centerY: number;
  sine: number;
  cosine: number;
  flipX?: boolean;
  flipY?: boolean;
  smooth?: boolean;
};

/**
 * Browser replacement for grayscale rotozoom transform parameters.
 * Role: Carries fixed-point rotation, flip options, and fallback color for grayscale transforms.
 * Ledger: FUN-D34892
 * Upstream: SDL_rotozoom.cpp:608-652
 */
export type GrayscaleSurfaceTransform = {
  centerX: number;
  centerY: number;
  sine: number;
  cosine: number;
  flipX?: boolean;
  flipY?: boolean;
  colorKey?: number;
};

/**
 * Replacement for upstream `VALUE_LIMIT`.
 * Role: Defines the lower bound used to avoid near-zero transform instability.
 * Ledger: MAC-D23627
 * Upstream: SDL_rotozoom.cpp:772, SDL_rotozoom.cpp:1095
 */
export const ROTOZOOM_VALUE_LIMIT = 0.001;

/**
 * Replacement for upstream `M_PI`.
 * Role: Provides the pi constant used when converting rotozoom degrees to radians.
 * Ledger: MAC-38509D
 * Upstream: SDL_rotozoom.h:21
 */
export const ROTOZOOM_PI = 3.141592654;

/**
 * Replacement for upstream `SMOOTHING_OFF`.
 * Role: Identifies nearest-neighbor rotozoom sampling when smoothing is disabled.
 * Ledger: MAC-78DBD4
 * Upstream: SDL_rotozoom.h:28
 */
export const ROTOZOOM_SMOOTHING_OFF = 0;

/**
 * Replacement for upstream `SMOOTHING_ON`.
 * Role: Identifies interpolated rotozoom sampling when smoothing is enabled.
 * Ledger: MAC-E8E547
 * Upstream: SDL_rotozoom.h:29
 */
export const ROTOZOOM_SMOOTHING_ON = 1;

/**
 * Replacement for upstream `zoomSurfaceSize`.
 * Role: Calculates the destination bounds for non-uniform surface zoom.
 * Ledger: FUN-E74E99
 * Upstream: SDL_rotozoom.cpp:1097-1120
 */
export function calculateZoomSurfaceSize(
  width: number,
  height: number,
  zoomX: number,
  zoomY: number,
): { width: number; height: number } {
  const normalizedZoomX = Math.max(zoomX, ROTOZOOM_VALUE_LIMIT);
  const normalizedZoomY = Math.max(zoomY, ROTOZOOM_VALUE_LIMIT);

  return {
    width: Math.max(1, Math.trunc(width * normalizedZoomX)),
    height: Math.max(1, Math.trunc(height * normalizedZoomY)),
  };
}

/**
 * Replacement for upstream `shrinkSurfaceRGBA`.
 * Role: Downscales an RGBA surface by averaging integer-sized pixel blocks.
 * Ledger: FUN-0743BB
 * Upstream: SDL_rotozoom.cpp:29-101
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
 * Replacement for upstream `zoomSurfaceRGBA`.
 * Role: Resizes an RGBA surface with optional flipping and interpolation.
 * Ledger: FUN-7F86B6
 * Upstream: SDL_rotozoom.cpp:188-386
 */
export function resizeRgbaSurface(
  source: RgbaSurface,
  width: number,
  height: number,
  flipX = false,
  flipY = false,
  smooth = false,
): RgbaSurface {
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width <= 0 ||
    height <= 0
  ) {
    throw new RangeError("destination dimensions must be positive integers");
  }

  const data = new Uint8ClampedArray(width * height * 4);
  const scaleX = Math.trunc(
    (65536 * (smooth ? source.width - 1 : source.width)) / width,
  );
  const scaleY = Math.trunc(
    (65536 * (smooth ? source.height - 1 : source.height)) / height,
  );
  const maxSourceX = source.width - 1;
  const maxSourceY = source.height - 1;

  for (let destinationY = 0; destinationY < height; destinationY += 1) {
    const scaledY = destinationY * scaleY;
    const sampledY = scaledY >> 16;
    const sourceY = flipY ? maxSourceY - sampledY : sampledY;

    for (let destinationX = 0; destinationX < width; destinationX += 1) {
      const scaledX = destinationX * scaleX;
      const sampledX = scaledX >> 16;
      const sourceX = flipX ? maxSourceX - sampledX : sampledX;
      const destinationOffset = (destinationY * width + destinationX) * 4;

      if (smooth) {
        const neighborX = flipX
          ? Math.max(0, sourceX - 1)
          : Math.min(maxSourceX, sourceX + 1);
        const neighborY = flipY
          ? Math.max(0, sourceY - 1)
          : Math.min(maxSourceY, sourceY + 1);

        writeInterpolatedRgbaPixel(
          source,
          data,
          destinationOffset,
          sourceX,
          sourceY,
          neighborX,
          neighborY,
          scaledX & 0xffff,
          scaledY & 0xffff,
        );
      } else {
        const sourceOffset = (sourceY * source.width + sourceX) * 4;
        data.set(source.data.subarray(sourceOffset, sourceOffset + 4), destinationOffset);
      }
    }
  }

  return { width, height, data };
}

/**
 * Replacement for upstream `rotateSurface90Degrees`.
 * Role: Rotates an RGBA surface by quarter-turn increments.
 * Ledger: FUN-9C99EE
 * Upstream: SDL_rotozoom.cpp:663-759
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
 * Role: Calculates the destination bounds for non-uniform rotozoom transforms.
 * Ledger: FUN-AB50C1
 * Upstream: SDL_rotozoom.cpp:809-814
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
 * Role: Calculates the destination bounds for uniform rotozoom transforms.
 * Ledger: FUN-B81617
 * Upstream: SDL_rotozoom.cpp:818-823
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
 * Role: Downscales a grayscale surface by averaging integer-sized pixel blocks.
 * Ledger: FUN-E7CB44
 * Upstream: SDL_rotozoom.cpp:111-178
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
 * Role: Resizes a grayscale surface using nearest-neighbor sampling.
 * Ledger: FUN-FEC912
 * Upstream: SDL_rotozoom.cpp:396-492
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

/**
 * Replacement for upstream `transformSurfaceY`.
 * Role: Writes a rotated grayscale source image into a destination surface.
 * Ledger: FUN-D34892
 * Upstream: SDL_rotozoom.cpp:608-652
 */
export function transformGrayscaleSurface(
  source: GrayscaleSurface,
  destination: GrayscaleSurface,
  transform: GrayscaleSurfaceTransform,
): void {
  destination.data.fill(transform.colorKey ?? 0);

  const offsetX = (source.width - destination.width) << 15;
  const offsetY = (source.height - destination.height) << 15;
  const axisX =
    (transform.centerX << 16) - transform.cosine * transform.centerX;
  const axisY = (transform.centerY << 16) - transform.sine * transform.centerX;
  const maxSourceX = source.width - 1;
  const maxSourceY = source.height - 1;

  for (
    let destinationY = 0;
    destinationY < destination.height;
    destinationY += 1
  ) {
    const deltaY = transform.centerY - destinationY;
    let scaledX = axisX + transform.sine * deltaY + offsetX;
    let scaledY = axisY - transform.cosine * deltaY + offsetY;

    for (
      let destinationX = 0;
      destinationX < destination.width;
      destinationX += 1
    ) {
      const sampledX = scaledX >> 16;
      const sampledY = scaledY >> 16;
      const sourceX = transform.flipX ? maxSourceX - sampledX : sampledX;
      const sourceY = transform.flipY ? maxSourceY - sampledY : sampledY;

      if (
        sourceX >= 0 &&
        sourceY >= 0 &&
        sourceX <= maxSourceX &&
        sourceY <= maxSourceY
      ) {
        destination.data[destinationY * destination.width + destinationX] =
          source.data[sourceY * source.width + sourceX];
      }

      scaledX += transform.cosine;
      scaledY += transform.sine;
    }
  }
}

/**
 * Replacement for upstream `transformSurfaceRGBA`.
 * Role: Writes a rotated RGBA source image into a destination surface.
 * Ledger: FUN-4429C1
 * Upstream: SDL_rotozoom.cpp:502-598
 */
export function transformRgbaSurface(
  source: RgbaSurface,
  destination: RgbaSurface,
  transform: RgbaSurfaceTransform,
): void {
  const offsetX = (source.width - destination.width) << 15;
  const offsetY = (source.height - destination.height) << 15;
  const axisX =
    (transform.centerX << 16) - transform.cosine * transform.centerX;
  const axisY = (transform.centerY << 16) - transform.sine * transform.centerX;
  const maxSourceX = source.width - 1;
  const maxSourceY = source.height - 1;

  for (
    let destinationY = 0;
    destinationY < destination.height;
    destinationY += 1
  ) {
    const deltaY = transform.centerY - destinationY;
    let scaledX = axisX + transform.sine * deltaY + offsetX;
    let scaledY = axisY - transform.cosine * deltaY + offsetY;

    for (
      let destinationX = 0;
      destinationX < destination.width;
      destinationX += 1
    ) {
      if (transform.smooth) {
        writeSmoothedTransformPixel(
          source,
          destination,
          destinationX,
          destinationY,
          scaledX,
          scaledY,
          Boolean(transform.flipX),
          Boolean(transform.flipY),
        );
      } else {
        writeNearestTransformPixel(
          source,
          destination,
          destinationX,
          destinationY,
          scaledX >> 16,
          scaledY >> 16,
          maxSourceX,
          maxSourceY,
          Boolean(transform.flipX),
          Boolean(transform.flipY),
        );
      }

      scaledX += transform.cosine;
      scaledY += transform.sine;
    }
  }
}

function writeNearestTransformPixel(
  source: RgbaSurface,
  destination: RgbaSurface,
  destinationX: number,
  destinationY: number,
  sampledX: number,
  sampledY: number,
  maxSourceX: number,
  maxSourceY: number,
  flipX: boolean,
  flipY: boolean,
): void {
  const sourceX = flipX ? maxSourceX - sampledX : sampledX;
  const sourceY = flipY ? maxSourceY - sampledY : sampledY;

  if (
    sourceX < 0 ||
    sourceY < 0 ||
    sourceX > maxSourceX ||
    sourceY > maxSourceY
  ) {
    return;
  }

  const sourceOffset = (sourceY * source.width + sourceX) * 4;
  const destinationOffset =
    (destinationY * destination.width + destinationX) * 4;
  destination.data.set(
    source.data.subarray(sourceOffset, sourceOffset + 4),
    destinationOffset,
  );
}

function writeSmoothedTransformPixel(
  source: RgbaSurface,
  destination: RgbaSurface,
  destinationX: number,
  destinationY: number,
  scaledX: number,
  scaledY: number,
  flipX: boolean,
  flipY: boolean,
): void {
  const baseX = scaledX >> 16;
  const baseY = scaledY >> 16;

  if (baseX < 0 || baseY < 0 || baseX >= source.width || baseY >= source.height) {
    return;
  }

  const maxSourceX = source.width - 1;
  const maxSourceY = source.height - 1;
  const sourceX = flipX ? maxSourceX - baseX : baseX;
  const sourceY = flipY ? maxSourceY - baseY : baseY;
  const neighborX = flipX
    ? Math.max(0, sourceX - 1)
    : Math.min(maxSourceX, sourceX + 1);
  const neighborY = flipY
    ? Math.max(0, sourceY - 1)
    : Math.min(maxSourceY, sourceY + 1);
  const fractionX = scaledX & 0xffff;
  const fractionY = scaledY & 0xffff;
  const destinationOffset =
    (destinationY * destination.width + destinationX) * 4;

  for (let channel = 0; channel < 4; channel += 1) {
    destination.data[destinationOffset + channel] = interpolateRgbaChannel(
      source,
      sourceX,
      sourceY,
      neighborX,
      neighborY,
      channel,
      fractionX,
      fractionY,
    );
  }
}

function writeInterpolatedRgbaPixel(
  source: RgbaSurface,
  destination: Uint8ClampedArray,
  destinationOffset: number,
  sourceX: number,
  sourceY: number,
  neighborX: number,
  neighborY: number,
  fractionX: number,
  fractionY: number,
): void {
  for (let channel = 0; channel < 4; channel += 1) {
    destination[destinationOffset + channel] = interpolateRgbaChannel(
      source,
      sourceX,
      sourceY,
      neighborX,
      neighborY,
      channel,
      fractionX,
      fractionY,
    );
  }
}

function interpolateRgbaChannel(
  source: RgbaSurface,
  sourceX: number,
  sourceY: number,
  neighborX: number,
  neighborY: number,
  channel: number,
  fractionX: number,
  fractionY: number,
): number {
  const topLeft = getRgbaChannel(source, sourceX, sourceY, channel);
  const topRight = getRgbaChannel(source, neighborX, sourceY, channel);
  const bottomLeft = getRgbaChannel(source, sourceX, neighborY, channel);
  const bottomRight = getRgbaChannel(source, neighborX, neighborY, channel);
  const top = (((topRight - topLeft) * fractionX) >> 16) + topLeft;
  const bottom = (((bottomRight - bottomLeft) * fractionX) >> 16) + bottomLeft;

  return (((bottom - top) * fractionY) >> 16) + top;
}

function getRgbaChannel(
  surface: RgbaSurface,
  x: number,
  y: number,
  channel: number,
): number {
  return surface.data[(y * surface.width + x) * 4 + channel];
}
