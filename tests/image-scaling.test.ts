import { describe, expect, it } from "vitest";
import {
  calculateRotozoomSurfaceSize,
  calculateUniformRotozoomSurfaceSize,
  calculateZoomSurfaceSize,
  rotateRgbaSurface90Degrees,
  resizeGrayscaleSurfaceNearest,
  resizeRgbaSurface,
  ROTOZOOM_PI,
  ROTOZOOM_SMOOTHING_OFF,
  ROTOZOOM_SMOOTHING_ON,
  ROTOZOOM_VALUE_LIMIT,
  shrinkGrayscaleSurface,
  shrinkRgbaSurface,
  transformGrayscaleSurface,
  transformRgbaSurface,
} from "../src/rendering/ImageScaling";

describe("RGBA image scaling", () => {
  it("replaces the SDL_rotozoom header guard with module boundaries", async () => {
    const firstImport = await import("../src/rendering/ImageScaling");
    const secondImport = await import("../src/rendering/ImageScaling");

    expect(firstImport.ROTOZOOM_VALUE_LIMIT).toBe(0.001);
    expect(secondImport.ROTOZOOM_VALUE_LIMIT).toBe(firstImport.ROTOZOOM_VALUE_LIMIT);
  });

  it("replaces the SDL_rotozoom export macro with named exports", async () => {
    const imageScaling = await import("../src/rendering/ImageScaling");

    expect(typeof imageScaling.calculateRotozoomSurfaceSize).toBe("function");
    expect(typeof imageScaling.rotateRgbaSurface90Degrees).toBe("function");
    expect(typeof imageScaling.shrinkRgbaSurface).toBe("function");
  });

  it("replaces the rotozoom minimum value threshold", () => {
    expect(ROTOZOOM_VALUE_LIMIT).toBe(0.001);
  });

  it("replaces the SDL_rotozoom pi macro", () => {
    expect(ROTOZOOM_PI).toBe(3.141592654);
  });

  it("replaces the SDL_rotozoom smoothing macros", () => {
    expect(ROTOZOOM_SMOOTHING_OFF).toBe(0);
    expect(ROTOZOOM_SMOOTHING_ON).toBe(1);
  });

  it("calculates zoom bounds without rotation", () => {
    expect(calculateZoomSurfaceSize(20, 10, 1.5, 0.5)).toEqual({
      width: 30,
      height: 5,
    });
  });

  it("clamps zoom bounds to the rotozoom value limit", () => {
    expect(calculateZoomSurfaceSize(20, 10, 0, -1)).toEqual({
      width: 1,
      height: 1,
    });
  });

  it("shrinks by averaging each source pixel block", () => {
    const result = shrinkRgbaSurface(
      {
        width: 2,
        height: 2,
        data: new Uint8ClampedArray([
          0, 20, 40, 60,
          20, 40, 60, 80,
          40, 60, 80, 100,
          60, 80, 100, 120,
        ]),
      },
      2,
      2,
    );

    expect(result.width).toBe(1);
    expect(result.height).toBe(1);
    expect([...result.data]).toEqual([30, 50, 70, 90]);
  });

  it("rejects invalid shrink factors", () => {
    expect(() =>
      shrinkRgbaSurface(
        {
          width: 1,
          height: 1,
          data: new Uint8ClampedArray(4),
        },
        0,
        1,
      ),
    ).toThrow(RangeError);
  });

  it("resizes an RGBA surface with nearest sampling", () => {
    const result = resizeRgbaSurface(
      {
        width: 2,
        height: 2,
        data: new Uint8ClampedArray([
          1, 2, 3, 4,
          5, 6, 7, 8,
          9, 10, 11, 12,
          13, 14, 15, 16,
        ]),
      },
      4,
      2,
    );

    expect(result.width).toBe(4);
    expect(result.height).toBe(2);
    expect([...result.data]).toEqual([
      1, 2, 3, 4,
      1, 2, 3, 4,
      5, 6, 7, 8,
      5, 6, 7, 8,
      9, 10, 11, 12,
      9, 10, 11, 12,
      13, 14, 15, 16,
      13, 14, 15, 16,
    ]);
  });

  it("resizes and flips an RGBA surface", () => {
    const result = resizeRgbaSurface(
      {
        width: 2,
        height: 1,
        data: new Uint8ClampedArray([
          1, 2, 3, 4,
          5, 6, 7, 8,
        ]),
      },
      2,
      1,
      true,
    );

    expect([...result.data]).toEqual([
      5, 6, 7, 8,
      1, 2, 3, 4,
    ]);
  });

  it("resizes an RGBA surface with smoothed interpolation", () => {
    const result = resizeRgbaSurface(
      {
        width: 2,
        height: 2,
        data: new Uint8ClampedArray([
          0, 10, 20, 30,
          100, 110, 120, 130,
          200, 210, 220, 230,
          255, 250, 245, 240,
        ]),
      },
      3,
      3,
      false,
      false,
      true,
    );

    expect([...result.data.slice(16, 20)]).toEqual([94, 102, 111, 119]);
  });

  it("rotates RGBA pixels by normalized clockwise quarter turns", () => {
    const surface = {
      width: 2,
      height: 1,
      data: new Uint8ClampedArray([
        1, 2, 3, 4,
        5, 6, 7, 8,
      ]),
    };

    const clockwise = rotateRgbaSurface90Degrees(surface, 1);
    expect(clockwise.width).toBe(1);
    expect(clockwise.height).toBe(2);
    expect([...clockwise.data]).toEqual([
      1, 2, 3, 4,
      5, 6, 7, 8,
    ]);

    const counterClockwise = rotateRgbaSurface90Degrees(surface, -1);
    expect([...counterClockwise.data]).toEqual([
      5, 6, 7, 8,
      1, 2, 3, 4,
    ]);
  });

  it("calculates the bounding size of a rotated and scaled surface", () => {
    expect(calculateRotozoomSurfaceSize(20, 10, 0, 2, 3)).toEqual({
      width: 40,
      height: 30,
    });
    expect(calculateRotozoomSurfaceSize(20, 10, 90, 2, 3)).toEqual({
      // Upstream `M_PI` precision leaves a tiny cosine value, which is ceiled.
      width: 31,
      height: 41,
    });
  });

  it("calculates rotozoom bounds with a uniform scale", () => {
    expect(calculateUniformRotozoomSurfaceSize(20, 10, 90, 2)).toEqual({
      width: 21,
      height: 41,
    });
  });

  it("shrinks a grayscale surface by block averaging", () => {
    const result = shrinkGrayscaleSurface(
      {
        width: 2,
        height: 2,
        data: new Uint8ClampedArray([10, 20, 30, 40]),
      },
      2,
      2,
    );

    expect(result.width).toBe(1);
    expect(result.height).toBe(1);
    expect([...result.data]).toEqual([25]);
  });

  it("resizes and flips a grayscale surface with nearest sampling", () => {
    const result = resizeGrayscaleSurfaceNearest(
      {
        width: 2,
        height: 2,
        data: new Uint8ClampedArray([1, 2, 3, 4]),
      },
      4,
      2,
      true,
    );

    expect([...result.data]).toEqual([
      2, 2, 1, 1,
      4, 4, 3, 3,
    ]);
  });

  it("transforms a grayscale surface with nearest sampling", () => {
    const source = {
      width: 2,
      height: 2,
      data: new Uint8ClampedArray([1, 2, 3, 4]),
    };
    const destination = {
      width: 2,
      height: 2,
      data: new Uint8ClampedArray(4),
    };

    transformGrayscaleSurface(source, destination, {
      centerX: 1,
      centerY: 1,
      sine: 0,
      cosine: 65536,
    });

    expect([...destination.data]).toEqual([1, 2, 3, 4]);
  });

  it("flips a grayscale transform vertically", () => {
    const source = {
      width: 2,
      height: 2,
      data: new Uint8ClampedArray([1, 2, 3, 4]),
    };
    const destination = {
      width: 2,
      height: 2,
      data: new Uint8ClampedArray(4),
    };

    transformGrayscaleSurface(source, destination, {
      centerX: 1,
      centerY: 1,
      sine: 0,
      cosine: 65536,
      flipY: true,
    });

    expect([...destination.data]).toEqual([3, 4, 1, 2]);
  });

  it("fills invalid grayscale transform pixels with the color key", () => {
    const source = {
      width: 1,
      height: 1,
      data: new Uint8ClampedArray([7]),
    };
    const destination = {
      width: 3,
      height: 1,
      data: new Uint8ClampedArray(3),
    };

    transformGrayscaleSurface(source, destination, {
      centerX: 0,
      centerY: 0,
      sine: 0,
      cosine: 65536,
      colorKey: 9,
    });

    expect([...destination.data]).toEqual([9, 7, 9]);
  });

  it("transforms an RGBA surface with nearest sampling", () => {
    const source = {
      width: 2,
      height: 2,
      data: new Uint8ClampedArray([
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16,
      ]),
    };
    const destination = {
      width: 2,
      height: 2,
      data: new Uint8ClampedArray(16),
    };

    transformRgbaSurface(source, destination, {
      centerX: 1,
      centerY: 1,
      sine: 0,
      cosine: 65536,
    });

    expect([...destination.data]).toEqual([...source.data]);
  });

  it("flips an RGBA transform horizontally", () => {
    const source = {
      width: 2,
      height: 1,
      data: new Uint8ClampedArray([
        1, 2, 3, 4,
        5, 6, 7, 8,
      ]),
    };
    const destination = {
      width: 2,
      height: 1,
      data: new Uint8ClampedArray(8),
    };

    transformRgbaSurface(source, destination, {
      centerX: 0,
      centerY: 0,
      sine: 0,
      cosine: 65536,
      flipX: true,
    });

    expect([...destination.data]).toEqual([
      5, 6, 7, 8,
      1, 2, 3, 4,
    ]);
  });

  it("transforms an RGBA surface with smoothed interpolation", () => {
    const source = {
      width: 2,
      height: 2,
      data: new Uint8ClampedArray([
        0, 10, 20, 30,
        100, 110, 120, 130,
        200, 210, 220, 230,
        255, 250, 245, 240,
      ]),
    };
    const destination = {
      width: 1,
      height: 1,
      data: new Uint8ClampedArray(4),
    };

    transformRgbaSurface(source, destination, {
      centerX: 0,
      centerY: 0,
      sine: 0,
      cosine: 65536,
      smooth: true,
    });

    expect([...destination.data]).toEqual([138, 145, 151, 157]);
  });
});
