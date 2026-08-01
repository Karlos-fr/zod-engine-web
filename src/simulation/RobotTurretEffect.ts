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

export type RobotTurretEffectImageState<TSurface> = {
  robotFlipImages: readonly (readonly RobotTurretFlipImage<TSurface>[])[];
  finishedInit: boolean;
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
