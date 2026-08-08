/**
 * Upstream: rtough.h
 */

import { TeamType } from "../SimulationConstants";
import {
  renderSubmergedRobotSurface,
  RobotEntity,
  RobotObjectMode,
  type RobotSubmergedRenderCommand,
  type RobotSubmergedRenderMap,
} from "./RobotEntity";

export type ToughRobotProcessState = {
  mode: RobotObjectMode | number;
  actionIndex: number;
  nextAttackTime: number;
};

/**
 * Replacement state for upstream `RTough::DoRender`.
 * Role: Stores tough robot images and animation state needed for clipped rendering.
 * Upstream: rtough.cpp:89-131
 */
export type ToughRobotRenderState<TSurface> = {
  position: { x: number; y: number };
  owner: TeamType | number;
  direction: number;
  moveIndex: number;
  actionIndex: number;
  mode: RobotObjectMode | number;
  doHitEffect: boolean;
  submergeAmount: number;
  nullImage: TSurface | null;
  walkImages: readonly (readonly (readonly (TSurface | null | undefined)[])[])[];
  standImages: readonly (readonly (TSurface | null | undefined)[])[];
  beerImages: readonly (readonly (TSurface | null | undefined)[])[];
  cigaretteImages: readonly (readonly (TSurface | null | undefined)[])[];
  fullAreaScanImages: readonly (readonly (TSurface | null | undefined)[])[];
  headStretchImages: readonly (readonly (TSurface | null | undefined)[])[];
  pickupUpImages: readonly (readonly (TSurface | null | undefined)[])[];
  pickupDownImages: readonly (readonly (TSurface | null | undefined)[])[];
  fireImages: readonly (readonly (readonly (TSurface | null | undefined)[])[])[];
};

/**
 * Replacement for upstream clipped map render dependencies used by `RTough::DoRender`.
 * Role: Provides submersion lookup and map viewport clipping for tough robot rendering.
 * Upstream: rtough.cpp:118-121
 */
export type ToughRobotRenderMap = RobotSubmergedRenderMap;

export type ToughRobotRenderCommand<TSurface> =
  RobotSubmergedRenderCommand<TSurface>;

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
 * Replacement for upstream `RTough::DoRender`.
 * Role: Builds a clipped render command for the tough robot's current animation image.
 * Upstream: rtough.cpp:89-131
 */
export function renderToughRobot<TSurface>(
  state: ToughRobotRenderState<TSurface>,
  zmap: ToughRobotRenderMap,
  shiftX = 0,
  shiftY = 0,
): ToughRobotRenderCommand<TSurface> | null {
  return renderSubmergedRobotSurface(
    state,
    getToughRobotRenderSurface(state),
    zmap,
    shiftX,
    shiftY,
  );
}

function getToughRobotRenderSurface<TSurface>(
  state: ToughRobotRenderState<TSurface>,
): TSurface | null | undefined {
  if (state.owner === TeamType.Null) return state.nullImage;

  switch (state.mode) {
    case RobotObjectMode.Walking:
      return state.walkImages[state.owner]?.[state.direction]?.[state.moveIndex];
    case RobotObjectMode.Standing:
      return state.standImages[state.owner]?.[state.direction];
    case RobotObjectMode.Beer:
      return state.beerImages[state.owner]?.[state.actionIndex];
    case RobotObjectMode.Cigarette:
      return state.cigaretteImages[state.owner]?.[state.actionIndex];
    case RobotObjectMode.FullScan:
      return state.fullAreaScanImages[state.owner]?.[state.actionIndex];
    case RobotObjectMode.HeadStretch:
      return state.headStretchImages[state.owner]?.[state.actionIndex];
    case RobotObjectMode.PickupUpGrenades:
      return state.pickupUpImages[state.owner]?.[state.actionIndex];
    case RobotObjectMode.PickupDownGrenades:
      return state.pickupDownImages[state.owner]?.[state.actionIndex];
    case RobotObjectMode.Attacking:
      return state.fireImages[state.owner]?.[state.direction]?.[state.actionIndex];
    default:
      return state.nullImage;
  }
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
