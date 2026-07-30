import { describe, expect, it } from "vitest";
import {
  blitRgbaSurface,
  blitRgbaSurfaceAt,
  blitRgbaSurfaceOnToMe,
  blitRgbaSurfaceRegionAt,
  blitRgbaTileSurface,
  blitRgbaHitSurface,
  blitRgbaHitSurfaceToSurface,
  blitRenderableRgbaSurface,
  drawRgbaSurfaceBox,
  drawRgbaSelectionBox,
  fillRenderableRgbaSurface,
  fillRgbaSurfaceRect,
  getRgbaSurfacePixel,
  makeRgbaSurfaceAlphable,
  putRgbaSurfacePixel,
  replaceOpaqueBlackPixels,
  renderRgbaSurface,
  renderRgbaSurfaceAreaRepeat,
  renderRgbaSurfaceHorzRepeat,
  renderRgbaSurfaceVertRepeat,
  willRgbaSurfaceRenderOnScreen,
  zsdFillRgbaRect,
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

  it("replaces ZSDL_Surface::MakeAlphable with black masking and display conversion", () => {
    const disposed: string[] = [];
    const alphaApplied: Array<[string, number]> = [];
    const colorKeys: Array<[string, number]> = [];
    const state = {
      useRenderCommands: false,
      alpha: 128,
      surface: {
        current: {
          id: "base",
          width: 2,
          height: 1,
          data: new Uint8ClampedArray([
            0, 0, 0, 255,
            0, 0, 0, 0,
          ]),
        },
      },
      rotozoomSurface: { current: null as null },
    };

    makeRgbaSurfaceAlphable(
      state,
      (surface) => ({
        ...surface,
        id: `${surface.id}-display`,
        data: new Uint8ClampedArray(surface.data),
      }),
      (surface, color) => colorKeys.push([surface.id, color]),
      (surface) => disposed.push(surface.id),
      (surface, alpha) => alphaApplied.push([surface.id, alpha]),
    );

    expect(state.surface.current).toEqual({
      id: "base-display",
      width: 2,
      height: 1,
      data: new Uint8ClampedArray([
        1, 0, 0, 255,
        0, 0, 0, 0,
      ]),
    });
    expect(disposed).toEqual(["base"]);
    expect(alphaApplied).toEqual([["base-display", 128]]);
    expect(colorKeys).toEqual([["base-display", 0x000000]]);
  });

  it("keeps MakeAlphable as a no-op through the render-command path", () => {
    const colorKeys: number[] = [];
    const state = {
      useRenderCommands: true,
      alpha: 255,
      surface: {
        current: {
          width: 1,
          height: 1,
          data: new Uint8ClampedArray([0, 0, 0, 255]),
        },
      },
      rotozoomSurface: { current: null as null },
    };

    makeRgbaSurfaceAlphable(
      state,
      (surface) => surface,
      (_surface, color) => colorKeys.push(color),
    );

    expect([...state.surface.current.data]).toEqual([0, 0, 0, 255]);
    expect(colorKeys).toEqual([]);
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

  it("replaces ZSDL_Surface::BlitSurface full-surface overload", () => {
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
      width: 3,
      height: 2,
      data: new Uint8ClampedArray(24),
    };

    blitRgbaSurfaceAt(source, destination, 1, 0);

    expect([...destination.data]).toEqual([
      0, 0, 0, 0,
      1, 2, 3, 4,
      5, 6, 7, 8,
      0, 0, 0, 0,
      9, 10, 11, 12,
      13, 14, 15, 16,
    ]);
  });

  it("replaces ZSDL_Surface::BlitSurface source-rectangle overload", () => {
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

    blitRgbaSurfaceRegionAt(source, destination, 1, 0, 2, 2, 0, 0);

    expect([...destination.data]).toEqual([
      5, 6, 7, 8,
      9, 10, 11, 12,
      0, 0, 0, 0,
      17, 18, 19, 20,
      21, 22, 23, 24,
      0, 0, 0, 0,
    ]);
  });

  it("replaces ZSDL_Surface::BlitOnToMe with blit and cache invalidation", () => {
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
    const releasedRotozoom: string[] = [];
    const deletedTextures: number[] = [];
    const cacheState = {
      useRenderCommands: false,
      rotozoomSurface: { id: "rotated" },
      rotozoomLoaded: true,
      texture: 7,
      textureLoaded: true,
    };

    blitRgbaSurfaceOnToMe(
      destination,
      source,
      {
        sourceX: 1,
        sourceY: 0,
        width: 2,
        height: 2,
        destinationX: 0,
        destinationY: 0,
      },
      cacheState,
      (surface) => releasedRotozoom.push(surface.id),
      (texture) => deletedTextures.push(texture),
    );

    expect([...destination.data]).toEqual([
      5, 6, 7, 8,
      9, 10, 11, 12,
      0, 0, 0, 0,
      17, 18, 19, 20,
      21, 22, 23, 24,
      0, 0, 0, 0,
    ]);
    expect(releasedRotozoom).toEqual(["rotated"]);
    expect(deletedTextures).toEqual([7]);
    expect(cacheState).toEqual({
      useRenderCommands: false,
      rotozoomSurface: null,
      rotozoomLoaded: false,
      texture: 7,
      textureLoaded: false,
    });
  });

  it("preserves BlitOnToMe no-op behavior without a destination surface", () => {
    const source = {
      width: 1,
      height: 1,
      data: new Uint8ClampedArray([1, 2, 3, 4]),
    };
    const cacheState = {
      useRenderCommands: false,
      rotozoomSurface: { id: "rotated" },
      rotozoomLoaded: true,
      texture: 7,
      textureLoaded: true,
    };

    blitRgbaSurfaceOnToMe(
      null,
      source,
      {
        sourceX: 0,
        sourceY: 0,
        width: 1,
        height: 1,
        destinationX: 0,
        destinationY: 0,
      },
      cacheState,
    );

    expect(cacheState).toEqual({
      useRenderCommands: false,
      rotozoomSurface: { id: "rotated" },
      rotozoomLoaded: true,
      texture: 7,
      textureLoaded: true,
    });
  });

  it("replaces ZSDL_Surface::BlitSurface software path by blitting to screen", () => {
    const surface = {
      width: 2,
      height: 2,
      data: new Uint8ClampedArray([
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16,
      ]),
    };
    const screen = {
      width: 3,
      height: 2,
      data: new Uint8ClampedArray(24),
    };

    blitRenderableRgbaSurface(
      {
        surface,
        screen,
        useRenderCommands: false,
        texture: null,
        textureLoaded: false,
        size: 1,
        angle: 0,
        alpha: 255,
      },
      null,
      { x: 1, y: 0 },
      null,
    );

    expect([...screen.data]).toEqual([
      0, 0, 0, 0,
      1, 2, 3, 4,
      5, 6, 7, 8,
      0, 0, 0, 0,
      9, 10, 11, 12,
      13, 14, 15, 16,
    ]);
  });

  it("routes ZSDL_Surface::BlitSurface to destination BlitOnToMe when provided", () => {
    const surface = {
      width: 2,
      height: 1,
      data: new Uint8ClampedArray([
        1, 2, 3, 4,
        5, 6, 7, 8,
      ]),
    };
    const destinationSurface = {
      width: 2,
      height: 1,
      data: new Uint8ClampedArray(8),
    };
    const deletedTextures: number[] = [];
    const destination = {
      surface: destinationSurface,
      cacheState: {
        useRenderCommands: false,
        rotozoomSurface: null as null,
        rotozoomLoaded: true,
        texture: 4,
        textureLoaded: true,
      },
    };

    blitRenderableRgbaSurface(
      {
        surface,
        screen: null,
        useRenderCommands: true,
        texture: null,
        textureLoaded: false,
        size: 1,
        angle: 0,
        alpha: 255,
      },
      null,
      null,
      destination,
      () => false,
      () => undefined,
      () => undefined,
      (texture) => deletedTextures.push(texture),
    );

    expect([...destinationSurface.data]).toEqual([
      1, 2, 3, 4,
      5, 6, 7, 8,
    ]);
    expect(deletedTextures).toEqual([4]);
    expect(destination.cacheState.textureLoaded).toBe(false);
    expect(destination.cacheState.rotozoomLoaded).toBe(false);
  });

  it("replaces ZSDL_Surface::BlitSurface render-command path with a texture render command", () => {
    const commands: unknown[] = [];
    const state = {
      surface: {
        width: 4,
        height: 2,
        data: new Uint8ClampedArray(32),
      },
      screen: null,
      useRenderCommands: true,
      texture: 9,
      textureLoaded: true,
      size: 2,
      angle: 45,
      alpha: 128,
    };

    blitRenderableRgbaSurface(
      state,
      { x: 1, y: 0, width: 9, height: 1 },
      { x: 5, y: 6 },
      null,
      () => false,
      (command) => commands.push(command),
    );

    expect(commands).toEqual([
      {
        texture: 9,
        destinationX: 5,
        destinationY: 6,
        width: 3,
        height: 1,
        sourceX: 1,
        sourceY: 0,
        sourceWidth: 3,
        sourceHeight: 1,
        textureLeft: 0.25,
        textureTop: 0,
        textureRight: 1,
        textureBottom: 0.5,
        scale: 2,
        angle: 45,
        alpha: 128,
      },
    ]);
  });

  it("loads texture before BlitSurface OpenGL rendering when needed", () => {
    const commands: number[] = [];
    const state = {
      surface: {
        width: 1,
        height: 1,
        data: new Uint8ClampedArray(4),
      },
      screen: null,
      useRenderCommands: true,
      texture: null as number | null,
      textureLoaded: false,
      size: 1,
      angle: 0,
      alpha: 255,
    };

    blitRenderableRgbaSurface(
      state,
      null,
      null,
      null,
      () => {
        state.texture = 6;
        state.textureLoaded = true;
        return true;
      },
      (command) => commands.push(command.texture),
    );

    expect(commands).toEqual([6]);
  });

  it("preserves ZSDL_Surface::BlitSurface no-op behavior for empty source rects", () => {
    const screen = {
      width: 1,
      height: 1,
      data: new Uint8ClampedArray([0, 0, 0, 0]),
    };

    blitRenderableRgbaSurface(
      {
        surface: {
          width: 1,
          height: 1,
          data: new Uint8ClampedArray([1, 2, 3, 4]),
        },
        screen,
        useRenderCommands: false,
        texture: null,
        textureLoaded: false,
        size: 1,
        angle: 0,
        alpha: 255,
      },
      { x: 0, y: 0, width: 0, height: 1 },
      null,
      null,
    );

    expect([...screen.data]).toEqual([0, 0, 0, 0]);
  });

  it("replaces ZSDL_Surface::BlitHitSurface non-hit path by normal blitting", () => {
    const surface = {
      width: 2,
      height: 1,
      data: new Uint8ClampedArray([
        1, 2, 3, 4,
        5, 6, 7, 8,
      ]),
    };
    const screen = {
      width: 2,
      height: 1,
      data: new Uint8ClampedArray(8),
    };

    blitRgbaHitSurface(
      {
        surface,
        screen,
        useRenderCommands: false,
        texture: null,
        textureLoaded: false,
        size: 1,
        angle: 0,
        alpha: 255,
      },
      null,
      null,
      null,
      false,
    );

    expect([...screen.data]).toEqual([
      1, 2, 3, 4,
      5, 6, 7, 8,
    ]);
  });

  it("replaces ZSDL_Surface::BlitHitSurface by drawing visible pixels as white", () => {
    const surface = {
      width: 3,
      height: 2,
      data: new Uint8ClampedArray([
        1, 2, 3, 0,
        4, 5, 6, 255,
        7, 8, 9, 255,
        10, 11, 12, 0,
        13, 14, 15, 128,
        16, 17, 18, 0,
      ]),
    };
    const screen = {
      width: 4,
      height: 3,
      data: new Uint8ClampedArray(48),
    };

    blitRgbaHitSurface(
      {
        surface,
        screen,
        useRenderCommands: false,
        texture: null,
        textureLoaded: false,
        size: 1,
        angle: 0,
        alpha: 255,
      },
      { x: 1, y: 0, width: 2, height: 2 },
      { x: 2, y: 1 },
      null,
      true,
    );

    expect([...screen.data]).toEqual([
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      255, 255, 255, 255,
      255, 255, 255, 255,
      0, 0, 0, 0,
      0, 0, 0, 0,
      255, 255, 255, 255,
      0, 0, 0, 0,
    ]);
  });

  it("preserves BlitHitSurface no-op behavior without a source surface", () => {
    const screen = {
      width: 1,
      height: 1,
      data: new Uint8ClampedArray([0, 0, 0, 0]),
    };

    blitRgbaHitSurface(
      {
        surface: null,
        screen,
        useRenderCommands: false,
        texture: null,
        textureLoaded: false,
        size: 1,
        angle: 0,
        alpha: 255,
      },
      null,
      null,
      null,
      true,
    );

    expect([...screen.data]).toEqual([0, 0, 0, 0]);
  });

  it("replaces ZSDL_BlitHitSurface non-hit path by blitting between software surfaces", () => {
    const source = {
      width: 2,
      height: 1,
      data: new Uint8ClampedArray([
        1, 2, 3, 4,
        5, 6, 7, 8,
      ]),
    };
    const destination = {
      width: 3,
      height: 1,
      data: new Uint8ClampedArray(12),
    };

    blitRgbaHitSurfaceToSurface(
      source,
      null,
      destination,
      { x: 1, y: 0 },
      false,
    );

    expect([...destination.data]).toEqual([
      0, 0, 0, 0,
      1, 2, 3, 4,
      5, 6, 7, 8,
    ]);
  });

  it("replaces ZSDL_BlitHitSurface hit path with a black visible-pixel mask", () => {
    const source = {
      width: 3,
      height: 1,
      data: new Uint8ClampedArray([
        1, 2, 3, 0,
        4, 5, 6, 255,
        7, 8, 9, 128,
      ]),
    };
    const destination = {
      width: 5,
      height: 1,
      data: new Uint8ClampedArray([
        9, 9, 9, 255,
        9, 9, 9, 255,
        9, 9, 9, 255,
        9, 9, 9, 255,
        9, 9, 9, 255,
      ]),
    };

    blitRgbaHitSurfaceToSurface(
      source,
      { x: 1, y: 0, width: 2, height: 1 },
      destination,
      { x: 1, y: 0 },
      true,
    );

    expect([...destination.data]).toEqual([
      9, 9, 9, 255,
      9, 9, 9, 255,
      0, 0, 0, 255,
      0, 0, 0, 255,
      9, 9, 9, 255,
    ]);
  });

  it("preserves ZSDL_BlitHitSurface hit no-op behavior without source or destination", () => {
    const destination = {
      width: 1,
      height: 1,
      data: new Uint8ClampedArray([9, 9, 9, 255]),
    };

    blitRgbaHitSurfaceToSurface(
      null,
      null,
      destination,
      null,
      true,
    );
    blitRgbaHitSurfaceToSurface(
      {
        width: 1,
        height: 1,
        data: new Uint8ClampedArray([1, 2, 3, 255]),
      },
      null,
      null,
      null,
      true,
    );

    expect([...destination.data]).toEqual([9, 9, 9, 255]);
  });

  it("replaces ZSDL_Surface::RenderSurfaceAreaRepeat by tiling normal blits", () => {
    const surface = {
      width: 2,
      height: 1,
      data: new Uint8ClampedArray([
        1, 2, 3, 4,
        5, 6, 7, 8,
      ]),
    };
    const screen = {
      width: 5,
      height: 2,
      data: new Uint8ClampedArray(40),
    };

    renderRgbaSurfaceAreaRepeat(
      {
        surface,
        screen,
        useRenderCommands: false,
        texture: null,
        textureLoaded: false,
        size: 1,
        angle: 0,
        alpha: 255,
      },
      0,
      0,
      5,
      2,
      false,
    );

    expect([...screen.data]).toEqual([
      1, 2, 3, 4,
      5, 6, 7, 8,
      1, 2, 3, 4,
      5, 6, 7, 8,
      1, 2, 3, 4,
      1, 2, 3, 4,
      5, 6, 7, 8,
      1, 2, 3, 4,
      5, 6, 7, 8,
      1, 2, 3, 4,
    ]);
  });

  it("replaces RenderSurfaceAreaRepeat hit path by tiling white visible pixels", () => {
    const surface = {
      width: 2,
      height: 1,
      data: new Uint8ClampedArray([
        1, 2, 3, 255,
        5, 6, 7, 0,
      ]),
    };
    const screen = {
      width: 4,
      height: 1,
      data: new Uint8ClampedArray(16),
    };

    renderRgbaSurfaceAreaRepeat(
      {
        surface,
        screen,
        useRenderCommands: false,
        texture: null,
        textureLoaded: false,
        size: 1,
        angle: 0,
        alpha: 255,
      },
      0,
      0,
      4,
      1,
      true,
    );

    expect([...screen.data]).toEqual([
      255, 255, 255, 255,
      0, 0, 0, 0,
      255, 255, 255, 255,
      0, 0, 0, 0,
    ]);
  });

  it("preserves RenderSurfaceAreaRepeat no-op behavior without a surface", () => {
    const screen = {
      width: 1,
      height: 1,
      data: new Uint8ClampedArray([0, 0, 0, 0]),
    };

    renderRgbaSurfaceAreaRepeat(
      {
        surface: null,
        screen,
        useRenderCommands: false,
        texture: null,
        textureLoaded: false,
        size: 1,
        angle: 0,
        alpha: 255,
      },
      0,
      0,
      1,
      1,
      false,
    );

    expect([...screen.data]).toEqual([0, 0, 0, 0]);
  });

  it("replaces ZSDL_Surface::RenderSurfaceVertRepeat by tiling vertically", () => {
    const surface = {
      width: 2,
      height: 2,
      data: new Uint8ClampedArray([
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16,
      ]),
    };
    const screen = {
      width: 2,
      height: 5,
      data: new Uint8ClampedArray(40),
    };

    renderRgbaSurfaceVertRepeat(
      {
        surface,
        screen,
        useRenderCommands: false,
        texture: null,
        textureLoaded: false,
        size: 1,
        angle: 0,
        alpha: 255,
      },
      0,
      0,
      5,
      false,
    );

    expect([...screen.data]).toEqual([
      1, 2, 3, 4,
      5, 6, 7, 8,
      9, 10, 11, 12,
      13, 14, 15, 16,
      1, 2, 3, 4,
      5, 6, 7, 8,
      9, 10, 11, 12,
      13, 14, 15, 16,
      1, 2, 3, 4,
      5, 6, 7, 8,
    ]);
  });

  it("replaces RenderSurfaceVertRepeat hit path by tiling white visible pixels", () => {
    const surface = {
      width: 1,
      height: 2,
      data: new Uint8ClampedArray([
        1, 2, 3, 255,
        4, 5, 6, 0,
      ]),
    };
    const screen = {
      width: 1,
      height: 3,
      data: new Uint8ClampedArray(12),
    };

    renderRgbaSurfaceVertRepeat(
      {
        surface,
        screen,
        useRenderCommands: false,
        texture: null,
        textureLoaded: false,
        size: 1,
        angle: 0,
        alpha: 255,
      },
      0,
      0,
      3,
      true,
    );

    expect([...screen.data]).toEqual([
      255, 255, 255, 255,
      0, 0, 0, 0,
      255, 255, 255, 255,
    ]);
  });

  it("preserves RenderSurfaceVertRepeat no-op behavior without a surface", () => {
    const screen = {
      width: 1,
      height: 1,
      data: new Uint8ClampedArray([0, 0, 0, 0]),
    };

    renderRgbaSurfaceVertRepeat(
      {
        surface: null,
        screen,
        useRenderCommands: false,
        texture: null,
        textureLoaded: false,
        size: 1,
        angle: 0,
        alpha: 255,
      },
      0,
      0,
      1,
      false,
    );

    expect([...screen.data]).toEqual([0, 0, 0, 0]);
  });

  it("replaces ZSDL_Surface::RenderSurfaceHorzRepeat by tiling horizontally", () => {
    const surface = {
      width: 2,
      height: 1,
      data: new Uint8ClampedArray([
        1, 2, 3, 4,
        5, 6, 7, 8,
      ]),
    };
    const screen = {
      width: 5,
      height: 1,
      data: new Uint8ClampedArray(20),
    };

    renderRgbaSurfaceHorzRepeat(
      {
        surface,
        screen,
        useRenderCommands: false,
        texture: null,
        textureLoaded: false,
        size: 1,
        angle: 0,
        alpha: 255,
      },
      0,
      0,
      5,
      false,
    );

    expect([...screen.data]).toEqual([
      1, 2, 3, 4,
      5, 6, 7, 8,
      1, 2, 3, 4,
      5, 6, 7, 8,
      1, 2, 3, 4,
    ]);
  });

  it("replaces RenderSurfaceHorzRepeat hit path by tiling white visible pixels", () => {
    const surface = {
      width: 2,
      height: 1,
      data: new Uint8ClampedArray([
        1, 2, 3, 255,
        4, 5, 6, 0,
      ]),
    };
    const screen = {
      width: 3,
      height: 1,
      data: new Uint8ClampedArray(12),
    };

    renderRgbaSurfaceHorzRepeat(
      {
        surface,
        screen,
        useRenderCommands: false,
        texture: null,
        textureLoaded: false,
        size: 1,
        angle: 0,
        alpha: 255,
      },
      0,
      0,
      3,
      true,
    );

    expect([...screen.data]).toEqual([
      255, 255, 255, 255,
      0, 0, 0, 0,
      255, 255, 255, 255,
    ]);
  });

  it("preserves RenderSurfaceHorzRepeat no-op behavior without a surface", () => {
    const screen = {
      width: 1,
      height: 1,
      data: new Uint8ClampedArray([0, 0, 0, 0]),
    };

    renderRgbaSurfaceHorzRepeat(
      {
        surface: null,
        screen,
        useRenderCommands: false,
        texture: null,
        textureLoaded: false,
        size: 1,
        angle: 0,
        alpha: 255,
      },
      0,
      0,
      1,
      false,
    );

    expect([...screen.data]).toEqual([0, 0, 0, 0]);
  });

  it("replaces ZSDL_Surface::RenderSurface render-command path with a texture command", () => {
    const commands: unknown[] = [];

    renderRgbaSurface(
      {
        surface: {
          width: 2,
          height: 1,
          data: new Uint8ClampedArray(8),
        },
        screen: null,
        useRenderCommands: true,
        texture: 7,
        textureLoaded: true,
        size: 2,
        angle: 30,
        alpha: 128,
        rotozoomSurface: null,
        rotozoomLoaded: false,
        mapPlaceX: 10,
        mapPlaceY: 20,
      },
      3,
      4,
      false,
      false,
      () => null,
      () => false,
      () => false,
      (command) => commands.push(command),
    );

    expect(commands).toEqual([
      {
        texture: 7,
        destinationX: 3,
        destinationY: 4,
        width: 2,
        height: 1,
        sourceX: 0,
        sourceY: 0,
        sourceWidth: 2,
        sourceHeight: 1,
        textureLeft: 0,
        textureTop: 0,
        textureRight: 1,
        textureBottom: 1,
        scale: 2,
        angle: -30,
        alpha: 128,
      },
    ]);
  });

  it("routes RenderSurface OpenGL hit path through the map-adjusted hit mask", () => {
    const commands: unknown[] = [];

    renderRgbaSurface(
      {
        surface: {
          width: 2,
          height: 1,
          data: new Uint8ClampedArray([
            1, 2, 3, 255,
            4, 5, 6, 0,
          ]),
        },
        screen: null,
        useRenderCommands: true,
        texture: null,
        textureLoaded: false,
        size: 1,
        angle: 0,
        alpha: 255,
        rotozoomSurface: null,
        rotozoomLoaded: false,
        mapPlaceX: 1,
        mapPlaceY: 0,
      },
      1,
      0,
      true,
      false,
      () => null,
      () => false,
      () => false,
      () => undefined,
      (command) => commands.push(command),
    );

    expect(commands).toEqual([
      {
        region: { x: 2, y: 0, width: 1, height: 1 },
        color: { red: 255, green: 255, blue: 255, alpha: 255 },
        clear: false,
      },
    ]);
  });

  it("replaces RenderSurface software path with map blit and map-place offset", () => {
    const screen = {
      width: 4,
      height: 2,
      data: new Uint8ClampedArray(32),
    };

    renderRgbaSurface(
      {
        surface: {
          width: 3,
          height: 1,
          data: new Uint8ClampedArray([
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11, 12,
          ]),
        },
        screen,
        useRenderCommands: false,
        texture: null,
        textureLoaded: false,
        size: 1,
        angle: 0,
        alpha: 255,
        rotozoomSurface: null,
        rotozoomLoaded: false,
        mapPlaceX: 1,
        mapPlaceY: 1,
      },
      7,
      8,
      false,
      false,
      (surface, x, y) => {
        expect(surface.width).toBe(3);
        expect([x, y]).toEqual([7, 8]);
        return {
          sourceRegion: { x: 1, y: 0, width: 2, height: 1 },
          destinationRegion: { x: 0, y: 0 },
        };
      },
    );

    expect([...screen.data]).toEqual([
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      5, 6, 7, 8,
      9, 10, 11, 12,
      0, 0, 0, 0,
    ]);
  });

  it("loads and uses rotozoom surface for RenderSurface software transforms", () => {
    const screen = {
      width: 2,
      height: 1,
      data: new Uint8ClampedArray(8),
    };
    const state = {
      surface: {
        width: 1,
        height: 1,
        data: new Uint8ClampedArray([1, 2, 3, 4]),
      },
      screen,
      useRenderCommands: false,
      texture: null,
      textureLoaded: false,
      size: 2,
      angle: 0,
      alpha: 255,
      rotozoomSurface: null as {
        width: number;
        height: number;
        data: Uint8ClampedArray;
      } | null,
      rotozoomLoaded: false,
      mapPlaceX: 0,
      mapPlaceY: 0,
    };

    renderRgbaSurface(
      state,
      4,
      0,
      false,
      true,
      (surface, x, y) => {
        expect([surface.width, surface.height]).toEqual([2, 1]);
        expect([x, y]).toEqual([3, 0]);
        return {
          sourceRegion: { x: 0, y: 0, width: 2, height: 1 },
          destinationRegion: { x: 0, y: 0 },
        };
      },
      () => {
        state.rotozoomSurface = {
          width: 2,
          height: 1,
          data: new Uint8ClampedArray([
            9, 10, 11, 12,
            13, 14, 15, 16,
          ]),
        };
        state.rotozoomLoaded = true;
        return true;
      },
    );

    expect([...screen.data]).toEqual([
      9, 10, 11, 12,
      13, 14, 15, 16,
    ]);
  });

  it("replaces ZSDL_Surface::WillRenderOnScreen with scaled bounds checks", () => {
    const state = {
      surface: { width: 10, height: 8 },
      size: 2,
      screenWidth: 100,
      screenHeight: 80,
    };

    expect(willRgbaSurfaceRenderOnScreen(state, 100, 80, false)).toBe(true);
    expect(willRgbaSurfaceRenderOnScreen(state, 101, 80, false)).toBe(false);
    expect(willRgbaSurfaceRenderOnScreen(state, 100, 81, false)).toBe(false);
    expect(willRgbaSurfaceRenderOnScreen(state, -20, 0, false)).toBe(true);
    expect(willRgbaSurfaceRenderOnScreen(state, -21, 0, false)).toBe(false);
    expect(willRgbaSurfaceRenderOnScreen(state, 0, -17, false)).toBe(false);
  });

  it("applies WillRenderOnScreen centered positioning when requested", () => {
    const state = {
      surface: { width: 9, height: 5 },
      size: 3,
      screenWidth: 20,
      screenHeight: 20,
    };

    expect(willRgbaSurfaceRenderOnScreen(state, -15, 10, true)).toBe(true);
    expect(willRgbaSurfaceRenderOnScreen(state, -16, 10, true)).toBe(false);
  });

  it("preserves WillRenderOnScreen false result without a surface", () => {
    expect(
      willRgbaSurfaceRenderOnScreen(
        {
          surface: null,
          size: 1,
          screenWidth: 20,
          screenHeight: 20,
        },
        0,
        0,
        false,
      ),
    ).toBe(false);
  });

  it("replaces ZSDL_BlitTileSurface with a 16-pixel tile copy", () => {
    const source = {
      width: 32,
      height: 16,
      data: new Uint8ClampedArray(32 * 16 * 4),
    };
    const destination = {
      width: 16,
      height: 16,
      data: new Uint8ClampedArray(16 * 16 * 4),
    };

    putRgbaSurfacePixel(source, 16, 0, {
      red: 40,
      green: 50,
      blue: 60,
      alpha: 70,
    });
    putRgbaSurfacePixel(source, 31, 15, {
      red: 80,
      green: 90,
      blue: 100,
      alpha: 110,
    });

    blitRgbaTileSurface(source, destination, {
      sourceX: 1,
      sourceY: 0,
      destinationX: 0,
      destinationY: 0,
    });

    expect(getRgbaSurfacePixel(destination, 0, 0)).toEqual({
      red: 40,
      green: 50,
      blue: 60,
      alpha: 70,
    });
    expect(getRgbaSurfacePixel(destination, 15, 15)).toEqual({
      red: 80,
      green: 90,
      blue: 100,
      alpha: 110,
    });
  });

  it("replaces ZSDL_Surface::FillRectOnToMe with clipped RGBA fill and cache invalidation", () => {
    const surface = {
      width: 3,
      height: 2,
      data: new Uint8ClampedArray(24),
    };
    const releasedRotozoom: string[] = [];
    const deletedTextures: number[] = [];
    const cacheState = {
      useRenderCommands: false,
      rotozoomSurface: { id: "rotated" },
      rotozoomLoaded: true,
      texture: 5,
      textureLoaded: true,
    };

    fillRgbaSurfaceRect(
      surface,
      { x: 1, y: -1, width: 3, height: 2 },
      { red: 10, green: 20, blue: 30 },
      cacheState,
      (surfaceToRelease) => releasedRotozoom.push(surfaceToRelease.id),
      (texture) => deletedTextures.push(texture),
    );

    expect([...surface.data]).toEqual([
      0, 0, 0, 0,
      10, 20, 30, 255,
      10, 20, 30, 255,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
    ]);
    expect(releasedRotozoom).toEqual(["rotated"]);
    expect(deletedTextures).toEqual([5]);
    expect(cacheState).toEqual({
      useRenderCommands: false,
      rotozoomSurface: null,
      rotozoomLoaded: false,
      texture: 5,
      textureLoaded: false,
    });
  });

  it("routes ZSDL_Surface::ZSDL_FillRect to destination FillRectOnToMe when provided", () => {
    const surface = {
      width: 3,
      height: 2,
      data: new Uint8ClampedArray(24),
    };
    const releasedRotozoom: string[] = [];
    const deletedTextures: number[] = [];
    const destination = {
      surface,
      cacheState: {
        useRenderCommands: false,
        rotozoomSurface: { id: "rotated" },
        rotozoomLoaded: true,
        texture: 9,
        textureLoaded: true,
      },
    };

    fillRenderableRgbaSurface(
      null,
      true,
      { x: 1, y: 0, width: 2, height: 1 },
      { red: 7, green: 8, blue: 9 },
      destination,
      () => undefined,
      (rotozoomSurface) => releasedRotozoom.push(rotozoomSurface.id),
      (texture) => deletedTextures.push(texture),
    );

    expect([...surface.data]).toEqual([
      0, 0, 0, 0,
      7, 8, 9, 255,
      7, 8, 9, 255,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
    ]);
    expect(releasedRotozoom).toEqual(["rotated"]);
    expect(deletedTextures).toEqual([9]);
    expect(destination.cacheState.rotozoomLoaded).toBe(false);
    expect(destination.cacheState.textureLoaded).toBe(false);
  });

  it("replaces ZSDL_Surface::ZSDL_FillRect OpenGL rectangle with a fill command", () => {
    const commands: unknown[] = [];

    fillRenderableRgbaSurface(
      null,
      true,
      { x: 2, y: 3, width: 4, height: 5 },
      { red: 10, green: 20, blue: 30 },
      null,
      (command) => commands.push(command),
    );

    expect(commands).toEqual([
      {
        region: { x: 2, y: 3, width: 4, height: 5 },
        color: { red: 10, green: 20, blue: 30, alpha: 255 },
        clear: false,
      },
    ]);
  });

  it("replaces ZSDL_Surface::ZSDL_FillRect OpenGL full-screen fill with a clear command", () => {
    const commands: unknown[] = [];

    fillRenderableRgbaSurface(
      null,
      true,
      null,
      { red: 10, green: 20, blue: 30 },
      null,
      (command) => commands.push(command),
    );

    expect(commands).toEqual([
      {
        region: null,
        color: { red: 10, green: 20, blue: 30, alpha: 0 },
        clear: true,
      },
    ]);
  });

  it("replaces ZSDL_Surface::ZSDL_FillRect software path by filling the screen", () => {
    const screen = {
      width: 3,
      height: 2,
      data: new Uint8ClampedArray(24),
    };

    fillRenderableRgbaSurface(
      screen,
      false,
      { x: 1, y: 0, width: 3, height: 2 },
      { red: 4, green: 5, blue: 6 },
      null,
    );

    expect([...screen.data]).toEqual([
      0, 0, 0, 0,
      4, 5, 6, 255,
      4, 5, 6, 255,
      0, 0, 0, 0,
      4, 5, 6, 255,
      4, 5, 6, 255,
    ]);
  });

  it("replaces global ZSDL_FillRect by forwarding to the renderable fill operation", () => {
    const screen = {
      width: 2,
      height: 1,
      data: new Uint8ClampedArray(8),
    };

    zsdFillRgbaRect(
      screen,
      false,
      null,
      { red: 11, green: 12, blue: 13 },
    );

    expect([...screen.data]).toEqual([
      11, 12, 13, 255,
      11, 12, 13, 255,
    ]);
  });

  it("replaces draw_box by drawing four one-pixel outline fills", () => {
    const screen = {
      width: 4,
      height: 4,
      data: new Uint8ClampedArray(64),
    };

    drawRgbaSurfaceBox(
      screen,
      false,
      { x: 1, y: 1, width: 2, height: 2 },
      { red: 3, green: 4, blue: 5 },
      4,
      4,
    );

    expect([...screen.data]).toEqual([
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      3, 4, 5, 255,
      3, 4, 5, 255,
      3, 4, 5, 255,
      0, 0, 0, 0,
      3, 4, 5, 255,
      0, 0, 0, 0,
      3, 4, 5, 255,
      0, 0, 0, 0,
      3, 4, 5, 255,
      3, 4, 5, 255,
      0, 0, 0, 0,
    ]);
  });

  it("preserves draw_box no-op behavior when the origin is outside max bounds", () => {
    const screen = {
      width: 1,
      height: 1,
      data: new Uint8ClampedArray([0, 0, 0, 0]),
    };

    drawRgbaSurfaceBox(
      screen,
      false,
      { x: 1, y: 0, width: 1, height: 1 },
      { red: 3, green: 4, blue: 5 },
      1,
      1,
    );
    drawRgbaSurfaceBox(
      screen,
      false,
      { x: 0, y: 1, width: 1, height: 1 },
      { red: 3, green: 4, blue: 5 },
      1,
      1,
    );

    expect([...screen.data]).toEqual([0, 0, 0, 0]);
  });

  it("replaces draw_selection_box with padded corner fill commands", () => {
    const commands: unknown[] = [];

    drawRgbaSelectionBox(
      null,
      true,
      { x: 10, y: 20, width: 30, height: 40 },
      { red: 6, green: 7, blue: 8 },
      100,
      100,
      null,
      (command) => commands.push(command),
    );

    expect(commands).toEqual([
      {
        region: { x: 7, y: 17, width: 5, height: 1 },
        color: { red: 6, green: 7, blue: 8, alpha: 255 },
        clear: false,
      },
      {
        region: { x: 7, y: 17, width: 1, height: 5 },
        color: { red: 6, green: 7, blue: 8, alpha: 255 },
        clear: false,
      },
      {
        region: { x: 38, y: 17, width: 5, height: 1 },
        color: { red: 6, green: 7, blue: 8, alpha: 255 },
        clear: false,
      },
      {
        region: { x: 43, y: 17, width: 1, height: 5 },
        color: { red: 6, green: 7, blue: 8, alpha: 255 },
        clear: false,
      },
      {
        region: { x: 7, y: 63, width: 5, height: 1 },
        color: { red: 6, green: 7, blue: 8, alpha: 255 },
        clear: false,
      },
      {
        region: { x: 7, y: 58, width: 1, height: 5 },
        color: { red: 6, green: 7, blue: 8, alpha: 255 },
        clear: false,
      },
      {
        region: { x: 38, y: 63, width: 5, height: 1 },
        color: { red: 6, green: 7, blue: 8, alpha: 255 },
        clear: false,
      },
      {
        region: { x: 43, y: 58, width: 1, height: 5 },
        color: { red: 6, green: 7, blue: 8, alpha: 255 },
        clear: false,
      },
    ]);
  });

  it("clips draw_selection_box commands against right and bottom max bounds", () => {
    const commands: unknown[] = [];

    drawRgbaSelectionBox(
      null,
      true,
      { x: 0, y: 0, width: 10, height: 10 },
      { red: 6, green: 7, blue: 8 },
      10,
      10,
      null,
      (command) => commands.push(command),
    );

    expect(commands).toEqual([
      {
        region: { x: -3, y: -3, width: 5, height: 1 },
        color: { red: 6, green: 7, blue: 8, alpha: 255 },
        clear: false,
      },
      {
        region: { x: -3, y: -3, width: 1, height: 5 },
        color: { red: 6, green: 7, blue: 8, alpha: 255 },
        clear: false,
      },
      {
        region: { x: 8, y: -3, width: 2, height: 1 },
        color: { red: 6, green: 7, blue: 8, alpha: 255 },
        clear: false,
      },
      {
        region: { x: -3, y: 8, width: 1, height: 2 },
        color: { red: 6, green: 7, blue: 8, alpha: 255 },
        clear: false,
      },
    ]);
  });

  it("preserves draw_selection_box no-op behavior outside max bounds", () => {
    const commands: unknown[] = [];

    drawRgbaSelectionBox(
      null,
      true,
      { x: 20, y: 0, width: 1, height: 1 },
      { red: 6, green: 7, blue: 8 },
      10,
      10,
      null,
      (command) => commands.push(command),
    );
    drawRgbaSelectionBox(
      null,
      true,
      { x: 0, y: 20, width: 1, height: 1 },
      { red: 6, green: 7, blue: 8 },
      10,
      10,
      null,
      (command) => commands.push(command),
    );

    expect(commands).toEqual([]);
  });

  it("replaces ZSDL_Surface::FillRectOnToMe null rect with full-surface fill", () => {
    const surface = {
      width: 2,
      height: 1,
      data: new Uint8ClampedArray(8),
    };
    const cacheState = {
      useRenderCommands: true,
      rotozoomSurface: { id: "rotated" },
      rotozoomLoaded: true,
      texture: null,
      textureLoaded: false,
    };

    fillRgbaSurfaceRect(
      surface,
      null,
      { red: 1, green: 2, blue: 3 },
      cacheState,
    );

    expect([...surface.data]).toEqual([
      1, 2, 3, 255,
      1, 2, 3, 255,
    ]);
    expect(cacheState.rotozoomSurface).toEqual({ id: "rotated" });
    expect(cacheState.rotozoomLoaded).toBe(true);
  });

  it("preserves FillRectOnToMe no-op behavior without a surface", () => {
    const cacheState = {
      useRenderCommands: false,
      rotozoomSurface: { id: "rotated" },
      rotozoomLoaded: true,
      texture: 5,
      textureLoaded: true,
    };

    fillRgbaSurfaceRect(
      null,
      { x: 0, y: 0, width: 1, height: 1 },
      { red: 10, green: 20, blue: 30 },
      cacheState,
    );

    expect(cacheState).toEqual({
      useRenderCommands: false,
      rotozoomSurface: { id: "rotated" },
      rotozoomLoaded: true,
      texture: 5,
      textureLoaded: true,
    });
  });
});
