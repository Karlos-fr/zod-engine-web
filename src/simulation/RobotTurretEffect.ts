/**
 * Upstream: erobotturrent.h
 */
import { ACTIVE_TEAM_TYPE_COUNT } from "./SimulationConstants";
import {
  loadTeamZSurface,
  TEAM_RENDERING_BASE_TEAM,
  type TeamSurfaceFactory,
} from "./TeamRendering";

/**
 * Port of upstream `_EROBOTTURRENT_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: erobotturrent.h:2
 */
export const EROBOT_TURRET_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ERobotTurrent` construction arguments.
 * Role: Describes a spawned robot turret debris effect.
 * Upstream: erobotturrent.h:12-31
 */
export type RobotTurretEffectSpawn<TTime = unknown> = {
  ztime: TTime | null;
  x: number;
  y: number;
  owner: number;
};

export type RobotTurretFlipImage<TSurface> = {
  getBaseSurface(): TSurface | null;
  loadBaseImage(source: string | TSurface | null): void;
};

/**
 * Replacement for upstream `ZSDL_Surface::SetSize` dependency.
 * Role: Provides the scale update applied to robot turret debris before rendering.
 * Upstream: erobotturrent.cpp:141
 */
export type RobotTurretRenderImage = {
  setSize?(size: number): void;
};

export type RobotTurretEffectImageState<TSurface> = {
  robotFlipImages: readonly (readonly RobotTurretFlipImage<TSurface>[])[];
  finishedInit: boolean;
};

/**
 * Replacement for upstream `ZMap::RenderZSurface` dependency.
 * Role: Builds a centered map-relative render command for robot turret debris.
 * Upstream: erobotturrent.cpp:145
 */
export type RobotTurretRenderMap<TImage, TCommand> = {
  renderZSurface(
    surface: TImage,
    x: number,
    y: number,
    renderHit: boolean,
    aboutCenter: boolean,
  ): TCommand;
};

/**
 * Replacement state for upstream `ERobotTurrent::DoRender`.
 * Role: Holds the active team-colored robot turret debris frame and visibility state.
 * Upstream: erobotturrent.cpp:133-148
 */
export type RobotTurretRenderState<TImage> = {
  killMe: boolean;
  x: number;
  y: number;
  size: number;
  owner: number;
  renderIndex: number;
  robotFlipImages: readonly (readonly TImage[])[];
};

/**
 * Port of upstream `ERobotTurrent::Process` mutable fields.
 * Role: Holds robot turret debris timing, animation, movement, and size state.
 * Upstream: erobotturrent.cpp:76-131
 */
export type RobotTurretProcessState = {
  killMe: boolean;
  x: number;
  y: number;
  startX: number;
  startY: number;
  deltaX: number;
  deltaY: number;
  rise: number;
  size: number;
  renderIndex: number;
  initTime: number;
  finalTime: number;
  nextRenderIndexTime: number;
};

const ROBOT_TURRET_FLIP_FRAME_COUNT = 33;
const ROBOT_TURRET_TEAM_TYPE_ASSET_NAMES = [
  "null",
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "teal",
  "white",
  "black",
] as const;

/**
 * Port of upstream `ERobotTurrent::Init`.
 * Role: Loads robot flip debris images for each active non-null team and frame.
 * Upstream: erobotturrent.cpp:60-74
 */
export function initRobotTurretEffect<TSurface>(
  state: RobotTurretEffectImageState<TSurface>,
  makeTeamSurface: TeamSurfaceFactory<TSurface>,
): void {
  for (let team = 1; team < ACTIVE_TEAM_TYPE_COUNT; team += 1) {
    for (let frame = 0; frame < ROBOT_TURRET_FLIP_FRAME_COUNT; frame += 1) {
      const baseImage = state.robotFlipImages[TEAM_RENDERING_BASE_TEAM]?.[frame];
      const robotFlipImage = state.robotFlipImages[team]?.[frame];
      if (!baseImage || !robotFlipImage) continue;

      loadTeamZSurface(
        team,
        baseImage,
        robotFlipImage,
        `assets/units/robots/die5_${ROBOT_TURRET_TEAM_TYPE_ASSET_NAMES[team]}_n${frame
          .toString()
          .padStart(2, "0")}.png`,
        makeTeamSurface,
      );
    }
  }

  state.finishedInit = true;
}

/**
 * Replacement for upstream `ERobotTurrent::DoRender`.
 * Role: Builds the centered map-relative robot turret debris render command.
 * Upstream: erobotturrent.cpp:133-148
 */
export function renderRobotTurretEffect<
  TImage extends RobotTurretRenderImage,
  TCommand,
>(
  state: RobotTurretRenderState<TImage>,
  zmap: RobotTurretRenderMap<TImage, TCommand>,
): TCommand | null {
  if (state.killMe) return null;

  const image = state.robotFlipImages[state.owner]?.[state.renderIndex];
  if (!image) return null;

  image.setSize?.(state.size);

  return zmap.renderZSurface(image, state.x, state.y, false, true);
}

/**
 * Port of upstream `ERobotTurrent::Process`.
 * Role: Advances robot turret debris animation, ballistic movement, and kill state.
 * Upstream: erobotturrent.cpp:76-131
 */
export function processRobotTurretEffect(
  state: RobotTurretProcessState,
  currentTime: number,
): void {
  if (state.killMe) return;

  if (currentTime >= state.nextRenderIndexTime) {
    state.renderIndex += 1;

    if (currentTime < state.finalTime) {
      state.nextRenderIndexTime = currentTime + 0.05;

      if (state.renderIndex > 7) state.renderIndex = 0;
    } else {
      state.nextRenderIndexTime = currentTime + 0.15;

      if (state.renderIndex < 8) state.renderIndex = 8;
    }

    if (state.renderIndex > 32) {
      state.killMe = true;
      return;
    }
  }

  if (currentTime < state.finalTime) {
    const timeDifference = currentTime - state.initTime;

    state.x = state.startX + state.deltaX * timeDifference;
    state.y = state.startY + state.deltaY * timeDifference;
    state.size =
      -(state.rise / (state.finalTime - state.initTime)) *
        (timeDifference * timeDifference) +
      state.rise * timeDifference;
    state.size += 1;
    state.y -= (state.size - 1) * 30;
  } else {
    state.size = 1;
  }
}
