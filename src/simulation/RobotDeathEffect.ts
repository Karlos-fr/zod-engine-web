/**
 * Upstream: erobotdeath.h
 */
import { ACTIVE_TEAM_TYPE_COUNT } from "./SimulationConstants";
import {
  loadTeamZSurface,
  TEAM_RENDERING_BASE_TEAM,
  type TeamSurfaceFactory,
} from "./TeamRendering";

/**
 * Port of upstream `_EROBOTDEATH_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: erobotdeath.h:2
 */
export const EROBOT_DEATH_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ERobotDeath::Process` cadence.
 * Role: Defines the fixed delay between robot-death frame advances.
 * Upstream: erobotdeath.cpp:81
 */
export const ROBOT_DEATH_PROCESS_INTERVAL_SECONDS = 0.16;

const ROBOT_DEATH_DIE_FRAME_COUNTS = [10, 10, 10, 8] as const;
const ROBOT_DEATH_MELT_FRAME_COUNT = 17;
const ROBOT_DEATH_TEAM_TYPE_ASSET_NAMES = [
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

export type RobotDeathImage<TSurface> = {
  getBaseSurface(): TSurface | null;
  loadBaseImage(source: string | TSurface | null): void;
};

export type RobotDeathInitState<TSurface> = {
  dieImages: readonly (readonly (readonly RobotDeathImage<TSurface>[])[])[];
  meltImages: readonly (readonly RobotDeathImage<TSurface>[])[];
  finishedInit: boolean;
};

/**
 * Port of upstream `ERobotDeath` construction arguments.
 * Role: Describes a spawned robot death effect.
 * Upstream: erobotdeath.h:12-28
 */
export type RobotDeathEffectSpawn<TTime = unknown> = {
  ztime: TTime | null;
  x: number;
  y: number;
  owner: number;
  doFireDeath: boolean;
};

/**
 * Port of upstream `ERobotDeath::Init`.
 * Role: Loads robot death and melt images for each active non-null team and animation frame.
 * Upstream: erobotdeath.cpp:47-71
 */
export function initRobotDeathEffect<TSurface>(
  state: RobotDeathInitState<TSurface>,
  makeTeamSurface: TeamSurfaceFactory<TSurface>,
): void {
  for (let team = 1; team < ACTIVE_TEAM_TYPE_COUNT; team += 1) {
    for (let dieSet = 0; dieSet < ROBOT_DEATH_DIE_FRAME_COUNTS.length; dieSet += 1) {
      const frameCount = ROBOT_DEATH_DIE_FRAME_COUNTS[dieSet];

      for (let frame = 0; frame < frameCount; frame += 1) {
        const baseImage =
          state.dieImages[dieSet]?.[TEAM_RENDERING_BASE_TEAM]?.[frame];
        const dieImage = state.dieImages[dieSet]?.[team]?.[frame];
        if (!baseImage || !dieImage) continue;

        loadTeamZSurface(
          team,
          baseImage,
          dieImage,
          `assets/units/robots/die${dieSet + 1}_${ROBOT_DEATH_TEAM_TYPE_ASSET_NAMES[team]}_n${frame
            .toString()
            .padStart(2, "0")}.png`,
          makeTeamSurface,
        );
      }
    }

    for (let frame = 0; frame < ROBOT_DEATH_MELT_FRAME_COUNT; frame += 1) {
      const baseImage = state.meltImages[TEAM_RENDERING_BASE_TEAM]?.[frame];
      const meltImage = state.meltImages[team]?.[frame];
      if (!baseImage || !meltImage) continue;

      loadTeamZSurface(
        team,
        baseImage,
        meltImage,
        `assets/units/robots/melt_${ROBOT_DEATH_TEAM_TYPE_ASSET_NAMES[team]}_n${frame
          .toString()
          .padStart(2, "0")}.png`,
        makeTeamSurface,
      );
    }
  }

  state.finishedInit = true;
}

/**
 * Port of upstream `ERobotDeath::Process` mutable fields.
 * Role: Captures robot death lifetime, frame index, frame limit, and next tick.
 * Upstream: erobotdeath.cpp:73-88
 */
export type RobotDeathProcessState = {
  killMe: boolean;
  renderIndex: number;
  maxRenderIndex: number;
  nextProcessTime: number;
};

/**
 * Port of upstream `ERobotDeath::Process`.
 * Role: Advances robot-death frames and expires after reaching the render limit.
 * Upstream: erobotdeath.cpp:73-88
 */
export function processRobotDeathEffect(
  state: RobotDeathProcessState,
  currentTime: number,
): void {
  if (state.killMe) return;

  if (currentTime >= state.nextProcessTime) {
    state.nextProcessTime =
      currentTime + ROBOT_DEATH_PROCESS_INTERVAL_SECONDS;

    state.renderIndex += 1;
    if (state.renderIndex >= state.maxRenderIndex) state.killMe = true;
  }
}
