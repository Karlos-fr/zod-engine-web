/**
 * Upstream: rtough.h
 */

import { RobotEntity, RobotObjectMode } from "./RobotEntity";

export type ToughRobotProcessState = {
  mode: RobotObjectMode | number;
  actionIndex: number;
  nextAttackTime: number;
};

/**
 * Port of upstream `RTough::Process`.
 * Role: Runs common robot processing and advances tough attack animation timing.
 * Upstream: rtough.cpp:195-222
 */
export function processToughRobot(
  state: ToughRobotProcessState,
  currentTime: number,
  commonProcess: (currentTime: number) => void,
  randomInt: (maxExclusive: number) => number = (maxExclusive) =>
    Math.floor(Math.random() * maxExclusive),
): number {
  commonProcess(currentTime);

  if (
    state.mode === RobotObjectMode.Attacking &&
    currentTime >= state.nextAttackTime &&
    state.actionIndex !== 0
  ) {
    state.actionIndex += 1;
    if (state.actionIndex >= 3) state.actionIndex = 0;

    switch (state.actionIndex) {
      case 0:
        state.nextAttackTime =
          currentTime + 0.7 + (Math.trunc(randomInt(100)) % 100) * 0.003;
        break;
      case 1:
      case 2:
        state.nextAttackTime =
          currentTime + 0.05 + (Math.trunc(randomInt(100)) % 100) * 0.0003;
        break;
    }
  }

  return 1;
}

/**
 * Browser simulation entity containing the subset of `RTough` behavior already ported.
 * Role: Represents the tough robot specialization over the shared game-entity base.
 * Upstream: rtough.h
 */
export class ToughRobotEntity extends RobotEntity {
  /**
   * Port of upstream `CanPickupGrenades`.
   * Role: Reports whether tough robots can pick up grenade inventory.
   * Upstream: rtough.h:20
   */
  override canPickupGrenades(): boolean {
    return false;
  }

  /**
   * Port of upstream `CanHaveGrenades`.
   * Role: Reports whether tough robots can carry grenade inventory.
   * Upstream: rtough.h:21
   */
  override canHaveGrenades(): boolean {
    return false;
  }

  /**
   * Port of upstream `CanThrowGrenades`.
   * Role: Reports whether tough robots can use grenade attacks.
   * Upstream: rtough.h:22
   */
  override canThrowGrenades(): boolean {
    return false;
  }
}
