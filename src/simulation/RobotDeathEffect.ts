/**
 * Upstream: erobotdeath.h
 */

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
