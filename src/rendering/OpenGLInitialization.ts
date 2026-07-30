/**
 * Upstream: zsdl_opengl.cpp, zsdl_opengl.h
 */

export type RendererInitializationTarget = {
  setClearColor(color: number | string, alpha?: number): void;
  setClearAlpha(alpha: number): void;
  autoClear: boolean;
};

export type RendererViewportTarget = {
  setSize(width: number, height: number, updateStyle?: boolean): void;
};

export type OpenGlViewport = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * Browser-side replacement for the upstream screen dimension storage.
 * Role: Provides the width and height pair returned by screen dimension queries.
 * Upstream: zsdl_opengl.h:30
 */
export type ScreenDimensions = {
  width: number;
  height: number;
};

/**
 * Source element used to read browser viewport dimensions.
 * Role: Supplies host canvas bounds for the renderer resize path.
 * Upstream: zsdl_opengl.h:30
 */
export type ScreenDimensionSource = {
  clientWidth: number;
  clientHeight: number;
};

/**
 * Fallback source used when the host has not been laid out yet.
 * Role: Supplies window dimensions when the renderer host reports zero size.
 * Upstream: zsdl_opengl.h:30
 */
export type ScreenDimensionFallback = {
  innerWidth: number;
  innerHeight: number;
};

/**
 * Replacement for upstream `InitOpenGL`.
 * Role: Applies the default renderer state needed before drawing a frame.
 * Upstream: zsdl_opengl.cpp:8-28
 */
export function initializeOpenGlRendering(
  renderer: RendererInitializationTarget,
): void {
  renderer.setClearColor(0x000000, 0);
  renderer.setClearAlpha(0);
  renderer.autoClear = true;
}

/**
 * Replacement for upstream `ResetOpenGLViewPort`.
 * Role: Resizes the render viewport before drawing with the current projection.
 * Upstream: zsdl_opengl.cpp:30-43
 */
export function resetOpenGlViewport(
  renderer: RendererViewportTarget,
  width: number,
  height: number,
): OpenGlViewport {
  renderer.setSize(width, height, false);

  return {
    x: 0,
    y: 0,
    width,
    height,
  };
}

/**
 * Replacement for upstream `GetScreenDimensions`.
 * Role: Returns the current render target width and height.
 * Upstream: zsdl_opengl.h:30
 */
export function getScreenDimensions(
  source: ScreenDimensionSource,
  fallback: ScreenDimensionFallback,
): ScreenDimensions {
  return {
    width: source.clientWidth || fallback.innerWidth,
    height: source.clientHeight || fallback.innerHeight,
  };
}
