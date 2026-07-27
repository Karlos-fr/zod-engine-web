import * as THREE from "three";

/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - Files: zsdl_opengl.cpp, zsdl_opengl.h
 * - Symbols: InitOpenGL, ResetOpenGLViewPort, GetScreenDimensions,
 *   _ZSDL_OPENGL_H_
 * - Ledger: FUN-103D30, FUN-365BFD, FUN-B68917, MAC-67A624
 *
 * Porting notes:
 * - Immediate-mode OpenGL state is replaced by explicit Three.js renderer setup.
 * - The C `_ZSDL_OPENGL_H_` header guard is replaced by ES module boundaries.
 */

export type RendererInitializationTarget = {
  setClearColor(color: THREE.ColorRepresentation, alpha?: number): void;
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
 *
 * Role:
 * - Provides the width and height pair returned by screen dimension queries.
 *
 * Ledger: FUN-B68917
 * Upstream: zsdl_opengl.h:30
 */
export type ScreenDimensions = {
  width: number;
  height: number;
};

/**
 * Source element used to read browser viewport dimensions.
 *
 * Role:
 * - Supplies host canvas bounds for the renderer resize path.
 *
 * Ledger: FUN-B68917
 * Upstream: zsdl_opengl.h:30
 */
export type ScreenDimensionSource = {
  clientWidth: number;
  clientHeight: number;
};

/**
 * Fallback source used when the host has not been laid out yet.
 *
 * Role:
 * - Supplies window dimensions when the renderer host reports zero size.
 *
 * Ledger: FUN-B68917
 * Upstream: zsdl_opengl.h:30
 */
export type ScreenDimensionFallback = {
  innerWidth: number;
  innerHeight: number;
};

/**
 * Replacement for upstream `InitOpenGL`.
 *
 * Role:
 * - Applies the default renderer state needed before drawing a frame.
 *
 * Ledger: FUN-103D30
 * Upstream: zsdl_opengl.cpp:8-28
 *
 * Adaptation:
 * - Replaces global fixed-function OpenGL setup with renderer-local WebGL
 *   defaults that are stable in Three.js.
 * - Texture mapping, depth testing, smooth shading, alpha blending, and identity
 *   matrices are handled by Three.js materials, cameras, and scene graph state.
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
 *
 * Role:
 * - Resizes the render viewport before drawing with the current projection.
 *
 * Ledger: FUN-365BFD
 * Upstream: zsdl_opengl.cpp:30-43
 *
 * Adaptation:
 * - Replaces `glViewport(0, 0, width, height)` with `WebGLRenderer.setSize`.
 * - The upstream `glOrtho` projection reset is handled by
 *   `CameraController.resize` in the Three.js rendering path.
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
 *
 * Role:
 * - Returns the current render target width and height.
 *
 * Ledger: FUN-B68917
 * Upstream: zsdl_opengl.h:30
 *
 * Adaptation:
 * - Returns a structured object instead of writing C++ reference arguments.
 * - Reads the browser host dimensions, falling back to the window dimensions
 *   when the host has no layout size yet.
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
