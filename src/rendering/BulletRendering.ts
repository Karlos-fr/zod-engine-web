/**
 * Upstream: ebullet.cpp
 */

import type { TeamType } from "../simulation/SimulationConstants";
import { TEAM_RENDERING_COLORS } from "../simulation/TeamRendering";
import type { SurfaceFillRenderCommand } from "./SurfacePixels";

export type BulletRenderState = {
  x: number;
  y: number;
  owner: TeamType;
  killme: boolean;
};

export type BulletRenderViewport = {
  shiftX: number;
  shiftY: number;
  viewWidth: number;
  viewHeight: number;
};

/**
 * Replacement for upstream `EBullet::DoRender`.
 * Role: Builds the 2x2 team-colored fill command used to draw a visible bullet.
 * Upstream: ebullet.cpp:57-87
 */
export function renderBullet(
  bullet: BulletRenderState,
  viewport: BulletRenderViewport,
): SurfaceFillRenderCommand | null {
  if (bullet.killme) {
    return null;
  }

  if (bullet.x < viewport.shiftX) return null;
  if (bullet.y < viewport.shiftY) return null;
  if (bullet.x > viewport.viewWidth + viewport.shiftX) return null;
  if (bullet.y > viewport.viewHeight + viewport.shiftY) return null;

  const color = TEAM_RENDERING_COLORS[bullet.owner] ?? TEAM_RENDERING_COLORS[0];

  return {
    region: {
      x: bullet.x - viewport.shiftX,
      y: bullet.y - viewport.shiftY,
      width: 2,
      height: 2,
    },
    color: {
      red: color.red,
      green: color.green,
      blue: color.blue,
      alpha: 255,
    },
    clear: false,
  };
}
