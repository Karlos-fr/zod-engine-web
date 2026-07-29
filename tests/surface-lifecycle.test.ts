import { describe, expect, it } from "vitest";
import {
  freeSdlSurface,
  loadRotateCacheBaseImage,
  loadRotozoomCacheBaseImage,
  loadZoomCacheBaseImage,
  loadZsdlBaseImageFromFile,
  loadZsdlBaseImageSurface,
  loadZsdlNewSurface,
  loadZsdlRotozoomSurface,
  loadZsdlSurfaceGlTexture,
  setMainSoftwareSurface,
  setRotozoomSurfaceAngle,
  setRotozoomSurfaceSize,
  setZsdlSurfaceAlpha,
  setZsdlSurfaceUseOpenGL,
  unloadZsdlSurface,
  useZsdlSurfaceDisplayFormat,
} from "../src/rendering/SurfaceLifecycle";

describe("surface lifecycle", () => {
  it("replaces ZSDL_FreeSurface by disposing and clearing the reference", () => {
    const released: string[] = [];
    const surface = { current: { id: "surface-1" } };

    freeSdlSurface(surface, (value) => {
      released.push(value.id);
    });

    expect(released).toEqual(["surface-1"]);
    expect(surface.current).toBeNull();
  });

  it("does nothing for an empty surface reference", () => {
    const released: string[] = [];
    const surface = { current: null as { id: string } | null };

    freeSdlSurface(surface, (value) => {
      released.push(value.id);
    });

    expect(released).toEqual([]);
    expect(surface.current).toBeNull();
  });

  it("replaces ZSDL_Surface::SetMainSoftwareSurface as screen reference assignment", () => {
    const screen = { current: null as { id: string } | null };
    const surface = { id: "screen" };

    setMainSoftwareSurface(screen, surface);
    expect(screen.current).toBe(surface);

    setMainSoftwareSurface(screen, null);
    expect(screen.current).toBeNull();
  });

  it("replaces ZSDL_Surface::SetUseOpenGL as rendering path assignment", () => {
    const state = { useOpenGL: false };

    setZsdlSurfaceUseOpenGL(state, true);
    expect(state.useOpenGL).toBe(true);

    setZsdlSurfaceUseOpenGL(state, false);
    expect(state.useOpenGL).toBe(false);
  });

  it("replaces ZSDL_Surface::LoadBaseImage filename overload by loading and forwarding the surface", () => {
    const loadedFilenames: string[] = [];
    const forwardedSurfaces: Array<{ id: string } | null> = [];
    const state = { imageFilename: "" };

    loadZsdlBaseImageFromFile(
      state,
      "assets/unit.png",
      (filename) => {
        loadedFilenames.push(filename);
        return { id: "loaded-surface" };
      },
      (surface) => forwardedSurfaces.push(surface),
    );

    expect(state.imageFilename).toBe("assets/unit.png");
    expect(loadedFilenames).toEqual(["assets/unit.png"]);
    expect(forwardedSurfaces).toEqual([{ id: "loaded-surface" }]);
  });

  it("forwards LoadBaseImage filename load failures as null surfaces", () => {
    const forwardedSurfaces: Array<{ id: string } | null> = [];
    const state = { imageFilename: "" };

    loadZsdlBaseImageFromFile(
      state,
      "missing.png",
      () => null,
      (surface) => forwardedSurfaces.push(surface),
    );

    expect(state.imageFilename).toBe("missing.png");
    expect(forwardedSurfaces).toEqual([null]);
  });

  it("replaces specialized SDL transform cache LoadBaseImage wrappers", () => {
    const loaders = [
      loadRotozoomCacheBaseImage,
      loadZoomCacheBaseImage,
      loadRotateCacheBaseImage,
    ];

    loaders.forEach((loadBaseImage, index) => {
      const loadedFilenames: string[] = [];
      const forwardedSurfaces: Array<{ id: string } | null> = [];
      const state = { imageFilename: "" };

      loadBaseImage(
        state,
        `assets/cache-${index}.png`,
        (filename) => {
          loadedFilenames.push(filename);
          return { id: `cache-${index}` };
        },
        (surface) => forwardedSurfaces.push(surface),
      );

      expect(state.imageFilename).toBe(`assets/cache-${index}.png`);
      expect(loadedFilenames).toEqual([`assets/cache-${index}.png`]);
      expect(forwardedSurfaces).toEqual([{ id: `cache-${index}` }]);
    });
  });

  it("replaces ZSDL_Surface::LoadNewSurface with RGBA creation and black fill", () => {
    const loadedSurfaces: Array<{ id: string } | null> = [];
    const fills: Array<{
      region: { x: number; y: number; width: number; height: number };
      color: [number, number, number];
    }> = [];

    const surface = loadZsdlNewSurface(
      8,
      6,
      (request) => {
        expect(request).toEqual({
          width: 8,
          height: 6,
          bytesPerPixel: 4,
          redMask: 0xff000000,
          greenMask: 0x0000ff00,
          blueMask: 0x00ff0000,
          alphaMask: 0x000000ff,
        });
        return { id: "blank" };
      },
      (newSurface) => loadedSurfaces.push(newSurface),
      (region, red, green, blue) => {
        fills.push({ region, color: [red, green, blue] });
      },
    );

    expect(surface).toEqual({ id: "blank" });
    expect(loadedSurfaces).toEqual([{ id: "blank" }]);
    expect(fills).toEqual([
      {
        region: { x: 0, y: 0, width: 8, height: 6 },
        color: [0, 0, 0],
      },
    ]);
  });

  it("forwards LoadNewSurface creation failures without filling", () => {
    const loadedSurfaces: Array<{ id: string } | null> = [];
    const fills: Array<unknown> = [];

    const surface = loadZsdlNewSurface(
      8,
      6,
      () => null,
      (newSurface) => loadedSurfaces.push(newSurface),
      (...fill) => fills.push(fill),
    );

    expect(surface).toBeNull();
    expect(loadedSurfaces).toEqual([null]);
    expect(fills).toEqual([]);
  });

  it("replaces ZSDL_Surface::LoadBaseImage surface overload with unload and alpha conversion", () => {
    const disposedSurfaces: string[] = [];
    const deletedTextures: number[] = [];
    const state = {
      imageFilename: "assets/unit.png",
      surface: { current: { id: "old-base" } },
      rotozoomSurface: { current: { id: "old-rotated" } },
      texture: 4,
      textureLoaded: true,
      rotozoomLoaded: true,
    };
    const sourceSurface = { id: "loaded" };

    loadZsdlBaseImageSurface(
      state,
      sourceSurface,
      true,
      (surface) => ({ id: `${surface.id}-alpha` }),
      (surface) => disposedSurfaces.push(surface.id),
      (texture) => deletedTextures.push(texture),
    );

    expect(disposedSurfaces).toEqual(["old-base", "old-rotated", "loaded"]);
    expect(deletedTextures).toEqual([4]);
    expect(state).toEqual({
      imageFilename: "assets/unit.png",
      surface: { current: { id: "loaded-alpha" } },
      rotozoomSurface: { current: null },
      texture: null,
      textureLoaded: false,
      rotozoomLoaded: false,
    });
  });

  it("keeps LoadBaseImage surface overload input when delete_surface is false", () => {
    const disposedSurfaces: string[] = [];
    const state = {
      imageFilename: "assets/unit.png",
      surface: { current: null as { id: string } | null },
      rotozoomSurface: { current: null as { id: string } | null },
      texture: null as number | null,
      textureLoaded: false,
      rotozoomLoaded: false,
    };

    loadZsdlBaseImageSurface(
      state,
      { id: "loaded" },
      false,
      (surface) => ({ id: `${surface.id}-alpha` }),
      (surface) => disposedSurfaces.push(surface.id),
    );

    expect(disposedSurfaces).toEqual([]);
    expect(state.surface.current).toEqual({ id: "loaded-alpha" });
  });

  it("preserves LoadBaseImage surface overload null input after unloading old state", () => {
    const disposedSurfaces: string[] = [];
    const state = {
      imageFilename: "missing.png",
      surface: { current: { id: "old-base" } },
      rotozoomSurface: { current: null as { id: string } | null },
      texture: null as number | null,
      textureLoaded: false,
      rotozoomLoaded: true,
    };

    loadZsdlBaseImageSurface(
      state,
      null,
      true,
      (surface) => ({ id: surface.id }),
      (surface) => disposedSurfaces.push(surface.id),
    );

    expect(disposedSurfaces).toEqual(["old-base"]);
    expect(state.surface.current).toBeNull();
    expect(state.rotozoomLoaded).toBe(false);
  });

  it("replaces ZSDL_Surface::SetAngle by invalidating changed software rotozoom cache", () => {
    const released: string[] = [];
    const state = {
      useOpenGL: false,
      angle: 10,
      rotozoomSurface: { current: { id: "rotated" } },
      rotozoomLoaded: true,
    };

    setRotozoomSurfaceAngle(state, 20, (surface) => {
      released.push(surface.id);
    });

    expect(released).toEqual(["rotated"]);
    expect(state).toEqual({
      useOpenGL: false,
      angle: 20,
      rotozoomSurface: { current: null },
      rotozoomLoaded: false,
    });
  });

  it("keeps rotozoom cache when SetAngle receives the current angle", () => {
    const released: string[] = [];
    const state = {
      useOpenGL: false,
      angle: 10,
      rotozoomSurface: { current: { id: "rotated" } },
      rotozoomLoaded: true,
    };

    setRotozoomSurfaceAngle(state, 10, (surface) => {
      released.push(surface.id);
    });

    expect(released).toEqual([]);
    expect(state.rotozoomSurface.current).toEqual({ id: "rotated" });
    expect(state.rotozoomLoaded).toBe(true);
  });

  it("keeps rotozoom cache when SetAngle runs through the OpenGL path", () => {
    const released: string[] = [];
    const state = {
      useOpenGL: true,
      angle: 10,
      rotozoomSurface: { current: { id: "rotated" } },
      rotozoomLoaded: true,
    };

    setRotozoomSurfaceAngle(state, 20, (surface) => {
      released.push(surface.id);
    });

    expect(released).toEqual([]);
    expect(state.angle).toBe(20);
    expect(state.rotozoomSurface.current).toEqual({ id: "rotated" });
    expect(state.rotozoomLoaded).toBe(true);
  });

  it("replaces ZSDL_Surface::SetSize by invalidating changed software rotozoom cache", () => {
    const released: string[] = [];
    const state = {
      useOpenGL: false,
      size: 1,
      rotozoomSurface: { current: { id: "rotated" } },
      rotozoomLoaded: true,
    };

    setRotozoomSurfaceSize(state, 2, (surface) => {
      released.push(surface.id);
    });

    expect(released).toEqual(["rotated"]);
    expect(state).toEqual({
      useOpenGL: false,
      size: 2,
      rotozoomSurface: { current: null },
      rotozoomLoaded: false,
    });
  });

  it("keeps rotozoom cache when SetSize receives the current size", () => {
    const released: string[] = [];
    const state = {
      useOpenGL: false,
      size: 1,
      rotozoomSurface: { current: { id: "rotated" } },
      rotozoomLoaded: true,
    };

    setRotozoomSurfaceSize(state, 1, (surface) => {
      released.push(surface.id);
    });

    expect(released).toEqual([]);
    expect(state.rotozoomSurface.current).toEqual({ id: "rotated" });
    expect(state.rotozoomLoaded).toBe(true);
  });

  it("keeps rotozoom cache when SetSize runs through the OpenGL path", () => {
    const released: string[] = [];
    const state = {
      useOpenGL: true,
      size: 1,
      rotozoomSurface: { current: { id: "rotated" } },
      rotozoomLoaded: true,
    };

    setRotozoomSurfaceSize(state, 2, (surface) => {
      released.push(surface.id);
    });

    expect(released).toEqual([]);
    expect(state.size).toBe(2);
    expect(state.rotozoomSurface.current).toEqual({ id: "rotated" });
    expect(state.rotozoomLoaded).toBe(true);
  });

  it("replaces ZSDL_Surface::SetAlpha by applying alpha to software surfaces", () => {
    const applied: Array<[string, number]> = [];
    const state = {
      useOpenGL: false,
      alpha: 255,
      surface: { current: { id: "base" } },
      rotozoomSurface: { current: { id: "rotated" } },
    };

    setZsdlSurfaceAlpha(state, 128, (surface, alpha) => {
      applied.push([surface.id, alpha]);
    });

    expect(state.alpha).toBe(128);
    expect(applied).toEqual([
      ["base", 128],
      ["rotated", 128],
    ]);
  });

  it("stores SetAlpha without applying it through the OpenGL path", () => {
    const applied: Array<[string, number]> = [];
    const state = {
      useOpenGL: true,
      alpha: 255,
      surface: { current: { id: "base" } },
      rotozoomSurface: { current: { id: "rotated" } },
    };

    setZsdlSurfaceAlpha(state, 64, (surface, alpha) => {
      applied.push([surface.id, alpha]);
    });

    expect(state.alpha).toBe(64);
    expect(applied).toEqual([]);
  });

  it("replaces ZSDL_Surface::UseDisplayFormat by converting and reapplying alpha", () => {
    const disposed: string[] = [];
    const applied: Array<[string, number]> = [];
    const state = {
      useOpenGL: false,
      alpha: 128,
      surface: { current: { id: "base" } },
      rotozoomSurface: { current: null as { id: string } | null },
    };

    useZsdlSurfaceDisplayFormat(
      state,
      (surface) => ({ id: `${surface.id}-display` }),
      (surface) => disposed.push(surface.id),
      (surface, alpha) => applied.push([surface.id, alpha]),
    );

    expect(state.surface.current).toEqual({ id: "base-display" });
    expect(disposed).toEqual(["base"]);
    expect(applied).toEqual([["base-display", 128]]);
  });

  it("keeps UseDisplayFormat as a no-op without a software surface", () => {
    const state = {
      useOpenGL: false,
      alpha: 128,
      surface: { current: null as { id: string } | null },
      rotozoomSurface: { current: null as { id: string } | null },
    };

    useZsdlSurfaceDisplayFormat(
      state,
      (surface) => ({ id: `${surface.id}-display` }),
    );

    expect(state.surface.current).toBeNull();
  });

  it("keeps UseDisplayFormat as a no-op through the OpenGL path", () => {
    const converted: string[] = [];
    const state = {
      useOpenGL: true,
      alpha: 128,
      surface: { current: { id: "base" } },
      rotozoomSurface: { current: null as { id: string } | null },
    };

    useZsdlSurfaceDisplayFormat(state, (surface) => {
      converted.push(surface.id);
      return { id: `${surface.id}-display` };
    });

    expect(converted).toEqual([]);
    expect(state.surface.current).toEqual({ id: "base" });
  });

  it("replaces ZSDL_Surface::LoadRotoZoomSurface by creating a cached transform", () => {
    const disposed: string[] = [];
    const state = {
      surface: { current: { id: "base" } },
      angle: 45,
      size: 2,
      rotozoomSurface: { current: { id: "old-rotated" } },
      rotozoomLoaded: false,
    };

    const loaded = loadZsdlRotozoomSurface(
      state,
      (surface, angle, size) => ({
        id: `${surface.id}:${angle}:${size}`,
      }),
      (surface) => disposed.push(surface.id),
    );

    expect(loaded).toBe(true);
    expect(disposed).toEqual(["old-rotated"]);
    expect(state.rotozoomSurface.current).toEqual({ id: "base:45:2" });
    expect(state.rotozoomLoaded).toBe(true);
  });

  it("preserves LoadRotoZoomSurface false result without a software surface", () => {
    const state = {
      surface: { current: null as { id: string } | null },
      angle: 45,
      size: 2,
      rotozoomSurface: { current: { id: "old-rotated" } },
      rotozoomLoaded: true,
    };

    const loaded = loadZsdlRotozoomSurface(
      state,
      (surface) => ({ id: surface.id }),
    );

    expect(loaded).toBe(false);
    expect(state.rotozoomSurface.current).toEqual({ id: "old-rotated" });
    expect(state.rotozoomLoaded).toBe(true);
  });

  it("preserves LoadRotoZoomSurface false result when transform creation fails", () => {
    const disposed: string[] = [];
    const state = {
      surface: { current: { id: "base" } },
      angle: 45,
      size: 2,
      rotozoomSurface: { current: { id: "old-rotated" } },
      rotozoomLoaded: true,
    };

    const loaded = loadZsdlRotozoomSurface(
      state,
      () => null,
      (surface) => disposed.push(surface.id),
    );

    expect(loaded).toBe(false);
    expect(disposed).toEqual(["old-rotated"]);
    expect(state.rotozoomSurface.current).toBeNull();
    expect(state.rotozoomLoaded).toBe(false);
  });

  it("replaces ZSDL_Surface::LoadGLtexture by creating and uploading a texture", () => {
    const pixels = new Uint8ClampedArray([
      1, 2, 3, 4,
      5, 6, 7, 8,
    ]);
    const deletedTextures: number[] = [];
    const uploads: Array<{
      texture: number;
      width: number;
      height: number;
      bytesPerPixel: number;
      format: string;
      pixels: Uint8ClampedArray;
    }> = [];
    const state = {
      surface: {
        current: {
          width: 2,
          height: 1,
          bytesPerPixel: 4,
          redMask: 0x000000ff,
          pixels,
        },
      },
      texture: 3,
      textureLoaded: true,
    };

    const loaded = loadZsdlSurfaceGlTexture(
      state,
      (surface) => surface,
      () => 9,
      (upload) => uploads.push({ ...upload, pixels: pixels }),
      (texture) => deletedTextures.push(texture),
    );

    expect(loaded).toBe(true);
    expect(deletedTextures).toEqual([3]);
    expect(uploads).toEqual([
      {
        texture: 9,
        width: 2,
        height: 1,
        bytesPerPixel: 4,
        format: "RGBA",
        pixels,
      },
    ]);
    expect(state.texture).toBe(9);
    expect(state.textureLoaded).toBe(true);
  });

  it("maps LoadGLtexture formats from pixel width and red mask", () => {
    const uploads: string[] = [];
    const state = {
      surface: {
        current: {
          width: 1,
          height: 1,
          bytesPerPixel: 3,
          redMask: 0xff000000,
          pixels: new Uint8ClampedArray([1, 2, 3]),
        },
      },
      texture: null as number | null,
      textureLoaded: false,
    };

    const loaded = loadZsdlSurfaceGlTexture(
      state,
      (surface) => surface,
      () => 5,
      (upload) => uploads.push(upload.format),
    );

    expect(loaded).toBe(true);
    expect(uploads).toEqual(["BGR"]);
  });

  it("preserves LoadGLtexture false result without a software surface", () => {
    const state = {
      surface: { current: null as null },
      texture: 3,
      textureLoaded: true,
    };

    const loaded = loadZsdlSurfaceGlTexture(
      state,
      (surface) => surface,
      () => 9,
      () => undefined,
    );

    expect(loaded).toBe(false);
    expect(state.texture).toBe(3);
    expect(state.textureLoaded).toBe(true);
  });

  it("preserves LoadGLtexture false result for unsupported pixel formats", () => {
    const state = {
      surface: {
        current: {
          width: 1,
          height: 1,
          bytesPerPixel: 2,
          redMask: 0x000000ff,
          pixels: new Uint8ClampedArray([1, 2]),
        },
      },
      texture: null as number | null,
      textureLoaded: false,
    };

    const loaded = loadZsdlSurfaceGlTexture(
      state,
      (surface) => surface,
      () => 9,
      () => undefined,
    );

    expect(loaded).toBe(false);
    expect(state.texture).toBeNull();
    expect(state.textureLoaded).toBe(false);
  });

  it("replaces ZSDL_Surface::Unload by releasing surfaces and texture state", () => {
    const releasedSurfaces: string[] = [];
    const deletedTextures: number[] = [];
    const state = {
      surface: { current: { id: "base" } },
      rotozoomSurface: { current: { id: "rotated" } },
      texture: 7,
      textureLoaded: true,
      rotozoomLoaded: true,
    };

    unloadZsdlSurface(
      state,
      (surface) => releasedSurfaces.push(surface.id),
      (texture) => deletedTextures.push(texture),
    );

    expect(releasedSurfaces).toEqual(["base", "rotated"]);
    expect(deletedTextures).toEqual([7]);
    expect(state).toEqual({
      surface: { current: null },
      rotozoomSurface: { current: null },
      texture: null,
      textureLoaded: false,
      rotozoomLoaded: false,
    });
  });

  it("replaces ZSDL_Surface::Unload without deleting an unloaded texture", () => {
    const deletedTextures: number[] = [];
    const state = {
      surface: { current: null as { id: string } | null },
      rotozoomSurface: { current: null as { id: string } | null },
      texture: 7,
      textureLoaded: false,
      rotozoomLoaded: true,
    };

    unloadZsdlSurface(
      state,
      () => undefined,
      (texture) => deletedTextures.push(texture),
    );

    expect(deletedTextures).toEqual([]);
    expect(state.texture).toBeNull();
    expect(state.textureLoaded).toBe(false);
    expect(state.rotozoomLoaded).toBe(false);
  });
});
