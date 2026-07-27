import { describe, expect, it } from "vitest";
import {
  getScreenDimensions,
  initializeOpenGlRendering,
  resetOpenGlViewport,
} from "../src/rendering/OpenGLInitialization";

describe("OpenGL renderer initialization", () => {
  it("replaces the zsdl_opengl header guard with module boundaries", async () => {
    const firstImport = await import("../src/rendering/OpenGLInitialization");
    const secondImport = await import("../src/rendering/OpenGLInitialization");

    expect(typeof firstImport.initializeOpenGlRendering).toBe("function");
    expect(secondImport.resetOpenGlViewport).toBe(firstImport.resetOpenGlViewport);
  });

  it("replaces InitOpenGL with renderer-local clear defaults", () => {
    const calls: unknown[][] = [];
    const renderer = {
      autoClear: false,
      setClearColor: (...args: unknown[]): void => {
        calls.push(["setClearColor", ...args]);
      },
      setClearAlpha: (...args: unknown[]): void => {
        calls.push(["setClearAlpha", ...args]);
      },
    };

    initializeOpenGlRendering(renderer);

    expect(calls).toEqual([
      ["setClearColor", 0x000000, 0],
      ["setClearAlpha", 0],
    ]);
    expect(renderer.autoClear).toBe(true);
  });

  it("replaces ResetOpenGLViewPort with renderer viewport sizing", () => {
    const calls: unknown[][] = [];
    const renderer = {
      setSize: (...args: unknown[]): void => {
        calls.push(["setSize", ...args]);
      },
    };

    const viewport = resetOpenGlViewport(renderer, 640, 480);

    expect(calls).toEqual([["setSize", 640, 480, false]]);
    expect(viewport).toEqual({ x: 0, y: 0, width: 640, height: 480 });
  });

  it("replaces GetScreenDimensions with structured browser dimensions", () => {
    expect(
      getScreenDimensions(
        { clientWidth: 320, clientHeight: 200 },
        { innerWidth: 800, innerHeight: 600 },
      ),
    ).toEqual({ width: 320, height: 200 });
  });

  it("falls back to window dimensions when the host has no size", () => {
    expect(
      getScreenDimensions(
        { clientWidth: 0, clientHeight: 0 },
        { innerWidth: 800, innerHeight: 600 },
      ),
    ).toEqual({ width: 800, height: 600 });
  });
});
