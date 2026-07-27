import { describe, expect, it } from "vitest";
import {
  calculateRotozoomSurfaceSize,
  calculateUniformRotozoomSurfaceSize,
  rotateRgbaSurface90Degrees,
  resizeGrayscaleSurfaceNearest,
  ROTOZOOM_PI,
  ROTOZOOM_SMOOTHING_OFF,
  ROTOZOOM_SMOOTHING_ON,
  ROTOZOOM_VALUE_LIMIT,
  shrinkGrayscaleSurface,
  shrinkRgbaSurface,
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
});
