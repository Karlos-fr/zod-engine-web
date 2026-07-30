/**
 * Upstream: etankdirt.h / etankdirt.cpp
 */
import type { MapSurfaceRenderCommand } from "../world/GameMap";

/**
 * Port of upstream `_ETANKDIRT_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: etankdirt.h:2
 */
export const ETANK_DIRT_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ETANKDIRT_TIME`.
 * Role: Defines the frame advance delay for tank dirt animation effects.
 * Upstream: etankdirt.cpp:33
 */
export const TANK_DIRT_FRAME_INTERVAL_SECONDS = 0.15;

/**
 * Port of upstream `ETankDirt` render state.
 * Role: Holds the tank dirt frame selection and map anchor used for rendering.
 * Upstream: etankdirt.cpp:98-108
 */
export type TankDirtRenderState = {
  killme: boolean;
  cx: number;
  cy: number;
  palette: number;
  dirtIndex: number;
  frameIndex: number;
};

/**
 * Port of upstream `ETankDirt` frame timing state.
 * Role: Holds the tank dirt animation frame and next frame time.
 * Upstream: etankdirt.cpp:74-88
 */
export type TankDirtProcessState = {
  killme: boolean;
  palette: number;
  frameIndex: number;
  nextFrameTime: number;
};

/**
 * Port of upstream `td_graphics[palette].i_max`.
 * Role: Provides the frame count for tank dirt animation palettes.
 * Upstream: etankdirt.cpp:84
 */
export type TankDirtFrameCountGraphics = readonly { frameCount: number }[];

/**
 * Port of upstream `ETankDirt::do_pre_render`.
 * Role: Tracks whether tank dirt rendering is handled by the pre-render path.
 * Upstream: etankdirt.h:27, etankdirt.cpp:49
 */
export type TankDirtRenderModeState = {
  doPreRender: boolean;
};

/**
 * Port of upstream `td_graphics[palette].tank_dirt[dirt_i][ni]`.
 * Role: Provides loaded tank dirt frame surfaces by palette, dirt variant, and frame.
 * Upstream: etankdirt.cpp:100
 */
export type TankDirtRenderGraphics<TSurface extends TankDirtRenderSurface> =
  readonly (readonly (readonly (TSurface | null)[])[])[];

/**
 * Replacement for upstream tank dirt `ZSDL_Surface` frame.
 * Role: Provides dimensions required to anchor a tank dirt frame on the map.
 * Upstream: etankdirt.cpp:103-106
 */
export type TankDirtRenderSurface = {
  width: number;
  height: number;
};

/**
 * Replacement for upstream `ETankDirt::TheRender`.
 * Role: Builds the map-shifted render command for the current tank dirt frame.
 * Upstream: etankdirt.cpp:92-109
 */
export function renderTankDirtEffect<TSurface extends TankDirtRenderSurface>(
  state: TankDirtRenderState,
  graphics: TankDirtRenderGraphics<TSurface>,
  zmap: {
    renderZSurface(
      surface: TSurface,
      x: number,
      y: number,
      renderHit: boolean,
      aboutCenter: boolean,
    ): MapSurfaceRenderCommand<TSurface>;
  },
): MapSurfaceRenderCommand<TSurface> | null {
  if (state.killme) return null;

  const renderImage =
    graphics[state.palette]?.[state.dirtIndex]?.[state.frameIndex] ?? null;

  if (!renderImage) return null;

  return zmap.renderZSurface(
    renderImage,
    state.cx - (renderImage.width >> 1),
    state.cy - renderImage.height,
    false,
    false,
  );
}

/**
 * Replacement for upstream `ETankDirt::DoRender`.
 * Role: Emits the direct tank dirt render command when pre-rendering is disabled.
 * Upstream: etankdirt.h:27
 */
export function doRenderTankDirtEffect<TSurface extends TankDirtRenderSurface>(
  state: TankDirtRenderState & TankDirtRenderModeState,
  graphics: TankDirtRenderGraphics<TSurface>,
  zmap: {
    renderZSurface(
      surface: TSurface,
      x: number,
      y: number,
      renderHit: boolean,
      aboutCenter: boolean,
    ): MapSurfaceRenderCommand<TSurface>;
  },
): MapSurfaceRenderCommand<TSurface> | null {
  if (state.doPreRender) return null;

  return renderTankDirtEffect(state, graphics, zmap);
}

/**
 * Port of upstream `ETankDirt::Process`.
 * Role: Advances tank dirt animation frames and kills the effect after the last frame.
 * Upstream: etankdirt.cpp:72-90
 */
export function processTankDirtEffect(
  state: TankDirtProcessState,
  currentTime: number,
  graphics: TankDirtFrameCountGraphics,
): void {
  if (state.killme) return;

  if (currentTime < state.nextFrameTime) return;

  state.nextFrameTime = currentTime + TANK_DIRT_FRAME_INTERVAL_SECONDS;
  state.frameIndex += 1;

  const frameCount = graphics[state.palette]?.frameCount ?? 0;
  if (state.frameIndex >= frameCount) {
    state.frameIndex = 0;
    state.killme = true;
  }
}
