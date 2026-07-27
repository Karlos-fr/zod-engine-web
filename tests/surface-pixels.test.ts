import { describe, expect, it } from "vitest";
import {
  blitRgbaSurface,
  getRgbaSurfacePixel,
  putRgbaSurfacePixel,
  replaceOpaqueBlackPixels,
} from "../src/rendering/SurfacePixels";

describe("surface pixel operations", () => {
  it("replaces the zsdl header guard with module boundaries", async () => {
    const firstImport = await import("../src/rendering/SurfacePixels");
    const secondImport = await import("../src/rendering/SurfacePixels");

    expect(typeof firstImport.putRgbaSurfacePixel).toBe("function");
    expect(secondImport.blitRgbaSurface).toBe(firstImport.blitRgbaSurface);
  });

  it("replaces put32pixel with a bounded RGBA surface write", () => {
    const surface = {
      width: 2,
      height: 2,
      data: new Uint8ClampedArray(16),
    };

    putRgbaSurfacePixel(surface, 1, 0, {
      red: 10,
      green: 20,
      blue: 30,
      alpha: 40,
    });

    expect([...surface.data]).toEqual([
      0, 0, 0, 0,
      10, 20, 30, 40,
      0, 0, 0, 0,
      0, 0, 0, 0,
    ]);
  });

  it("preserves put32pixel no-op behavior outside bounds", () => {
    const surface = {
      width: 1,
      height: 1,
      data: new Uint8ClampedArray([1, 2, 3, 4]),
    };

    putRgbaSurfacePixel(surface, -1, 0, {
      red: 10,
      green: 20,
      blue: 30,
      alpha: 40,
    });
    putRgbaSurfacePixel(surface, 0, 1, {
      red: 10,
      green: 20,
      blue: 30,
      alpha: 40,
    });

    expect([...surface.data]).toEqual([1, 2, 3, 4]);
  });

  it("replaces get32pixel with an RGBA surface read", () => {
    const surface = {
      width: 2,
      height: 1,
      data: new Uint8ClampedArray([
        1, 2, 3, 4,
        5, 6, 7, 8,
      ]),
    };

    expect(getRgbaSurfacePixel(surface, 1, 0)).toEqual({
      red: 5,
      green: 6,
      blue: 7,
      alpha: 8,
    });
  });

  it("rejects get32pixel reads outside bounds", () => {
    const surface = {
      width: 1,
      height: 1,
      data: new Uint8ClampedArray([1, 2, 3, 4]),
    };

    expect(() => getRgbaSurfacePixel(surface, 1, 0)).toThrow(RangeError);
  });

  it("replaces ZSDL_ModifyBlack by recoloring opaque black pixels", () => {
    const surface = {
      width: 2,
      height: 2,
      data: new Uint8ClampedArray([
        0, 0, 0, 255,
        0, 0, 0, 0,
        4, 0, 0, 255,
        0, 5, 0, 255,
      ]),
    };

    replaceOpaqueBlackPixels(surface);

    expect([...surface.data]).toEqual([
      1, 0, 0, 255,
      0, 0, 0, 0,
      4, 0, 0, 255,
      0, 5, 0, 255,
    ]);
  });

  it("replaces ZSDL_BlitSurface with a rectangular RGBA copy", () => {
    const source = {
      width: 3,
      height: 2,
      data: new Uint8ClampedArray([
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16,
        17, 18, 19, 20,
        21, 22, 23, 24,
      ]),
    };
    const destination = {
      width: 3,
      height: 2,
      data: new Uint8ClampedArray(24),
    };

    blitRgbaSurface(source, destination, {
      sourceX: 1,
      sourceY: 0,
      width: 2,
      height: 2,
      destinationX: 0,
      destinationY: 0,
    });

    expect([...destination.data]).toEqual([
      5, 6, 7, 8,
      9, 10, 11, 12,
      0, 0, 0, 0,
      17, 18, 19, 20,
      21, 22, 23, 24,
      0, 0, 0, 0,
    ]);
  });

  it("clips ZSDL_BlitSurface copies to destination bounds", () => {
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
      width: 1,
      height: 1,
      data: new Uint8ClampedArray([0, 0, 0, 0]),
    };

    blitRgbaSurface(source, destination, {
      sourceX: 0,
      sourceY: 0,
      width: 2,
      height: 2,
      destinationX: 0,
      destinationY: 0,
    });

    expect([...destination.data]).toEqual([1, 2, 3, 4]);
  });
});
