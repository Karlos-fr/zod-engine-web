/**
 * Upstream: zrobot.h
 */

import type { SurfaceBlitRegion } from "../../rendering/SurfacePixels";
import type { EntityPortraitAnimationTarget } from "./GameEntity";
import { GameEntity } from "./GameEntity";
import { PortraitAnimationType } from "../PortraitAnimation";
import type { RobotDeathEffectSpawn } from "../RobotDeathEffect";
import type { RobotTurretEffectSpawn } from "../RobotTurretEffect";
import {
  ACTIVE_TEAM_TYPE_COUNT,
  MAX_ANGLE_TYPES,
  TeamType,
} from "../SimulationConstants";
import {
  loadTeamZSurface,
  TEAM_RENDERING_BASE_TEAM,
  type TeamSurfaceFactory,
} from "../TeamRendering";

/**
 * Port of upstream robot `object_mode` values.
 * Role: Identifies the robot animation/action mode used by robot behavior.
 * Upstream: zobject.h:68-75
 */
export enum RobotObjectMode {
  Null = 0,
  JustPlaced = 1,
  Rotating = 2,
  Stationary = 3,
  Walking = 4,
  Standing = 5,
  Cigarette = 6,
  FullScan = 7,
  HeadStretch = 8,
  Beer = 9,
  Attacking = 10,
  PickupUpGrenades = 11,
  PickupDownGrenades = 12,
  CannonAttacking = 13,
}

export type RobotFireImage<TSurface> = {
  getBaseSurface(): TSurface | null;
  loadBaseImage(source: string | TSurface | null): void;
};

export type RobotFireImageInitState<TSurface> = {
  fireImages: readonly (readonly (readonly RobotFireImage<TSurface>[])[])[];
};

/**
 * Replacement state for upstream `RGrunt::DoRender`.
 * Role: Stores grunt robot images and animation state needed for clipped rendering.
 * Upstream: rgrunt.cpp:88-135
 */
export type GruntRobotRenderState<TSurface> = RobotSubmergedRenderState & {
  owner: TeamType | number;
  direction: number;
  moveIndex: number;
  actionIndex: number;
  grenadeIndex: number;
  mode: RobotObjectMode | number;
  nullImage: TSurface | null;
  canThrowGrenades: boolean;
  attackObject: { attackedOnlyByExplosives(): boolean } | null;
  walkImages: readonly (readonly (readonly (TSurface | null | undefined)[])[])[];
  standImages: readonly (readonly (TSurface | null | undefined)[])[];
  beerImages: readonly (readonly (TSurface | null | undefined)[])[];
  cigaretteImages: readonly (readonly (TSurface | null | undefined)[])[];
  fullAreaScanImages: readonly (readonly (TSurface | null | undefined)[])[];
  headStretchImages: readonly (readonly (TSurface | null | undefined)[])[];
  pickupUpImages: readonly (readonly (TSurface | null | undefined)[])[];
  pickupDownImages: readonly (readonly (TSurface | null | undefined)[])[];
  fireImages: readonly (readonly (readonly (TSurface | null | undefined)[])[])[];
  throwSomethingImages: readonly (readonly (readonly (
    | TSurface
    | null
    | undefined
  )[])[])[];
};

/**
 * Replacement state for upstream `RLaser::DoRender`.
 * Role: Stores laser robot images and animation state needed for clipped rendering.
 * Upstream: rlaser.cpp:87-134
 */
export type LaserRobotRenderState<TSurface> = GruntRobotRenderState<TSurface>;

/**
 * Replacement state for upstream `RPsycho::DoRender`.
 * Role: Stores psycho robot images and animation state needed for clipped rendering.
 * Upstream: rpsycho.cpp:87-134
 */
export type PsychoRobotRenderState<TSurface> = GruntRobotRenderState<TSurface>;

/**
 * Replacement state for upstream `RPyro::DoRender`.
 * Role: Stores pyro robot images and animation state needed for clipped rendering.
 * Upstream: rpyro.cpp:87-134
 */
export type PyroRobotRenderState<TSurface> = GruntRobotRenderState<TSurface>;

/**
 * Replacement state for upstream `RSniper::DoRender`.
 * Role: Stores sniper robot images and animation state needed for clipped rendering.
 * Upstream: rsniper.cpp:87-134
 */
export type SniperRobotRenderState<TSurface> = GruntRobotRenderState<TSurface>;

export type RobotSubmergedRenderState = {
  position: { x: number; y: number };
  doHitEffect: boolean;
  submergeAmount: number;
};

export type RobotSubmergedRenderMap = {
  submergeAmount(x: number, y: number): number;
  getBlitInfo(
    x: number,
    y: number,
    width: number,
    height: number,
  ): SurfaceBlitRegion | null;
};

export type RobotSubmergedRenderCommand<TSurface> = {
  surface: TSurface;
  region: SurfaceBlitRegion;
  renderHit: boolean;
};

const ROBOT_FIRE_FRAME_COUNT = 5;
const ROBOT_ROTATION_DEGREES = [0, 45, 90, 135, 180, 225, 270, 315] as const;
const ROBOT_TEAM_TYPE_ASSET_NAMES = [
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

function initRobotFireImages<TSurface>(
  state: RobotFireImageInitState<TSurface>,
  makeTeamSurface: TeamSurfaceFactory<TSurface>,
  robotDirectory: string,
  frameCount: number,
): void {
  for (let team = 1; team < ACTIVE_TEAM_TYPE_COUNT; team += 1) {
    for (let rotation = 0; rotation < MAX_ANGLE_TYPES; rotation += 1) {
      for (let frame = 0; frame < frameCount; frame += 1) {
        const baseImage =
          state.fireImages[TEAM_RENDERING_BASE_TEAM]?.[rotation]?.[frame];
        const fireImage = state.fireImages[team]?.[rotation]?.[frame];
        if (!baseImage || !fireImage) continue;

        loadTeamZSurface(
          team,
          baseImage,
          fireImage,
          `assets/units/robots/${robotDirectory}/fire_${ROBOT_TEAM_TYPE_ASSET_NAMES[team]}_r${ROBOT_ROTATION_DEGREES[
            rotation
          ]
            .toString()
            .padStart(3, "0")}_n${frame.toString().padStart(2, "0")}.png`,
          makeTeamSurface,
        );
      }
    }
  }
}

function playRobotSelectedAnimWithReporting(
  portrait: EntityPortraitAnimationTarget,
  reportingAnimation: PortraitAnimationType,
  randomInt: () => number,
): void {
  if (Math.trunc(randomInt()) % 2) {
    switch (Math.trunc(randomInt()) % 4) {
      case 0:
        portrait.startAnim(PortraitAnimationType.YesSir);
        break;
      case 1:
        portrait.startAnim(PortraitAnimationType.YesSir3);
        break;
      case 2:
        portrait.startAnim(PortraitAnimationType.UnitReporting1);
        break;
      case 3:
        portrait.startAnim(PortraitAnimationType.UnitReporting2);
        break;
    }
  } else {
    portrait.startAnim(reportingAnimation);
  }
}

/**
 * Replacement for upstream submerged robot hit-surface blit requests.
 * Role: Builds a clipped render command for a 16-pixel robot image affected by water depth.
 * Upstream: rgrunt.cpp:122-134
 */
export function renderSubmergedRobotSurface<TSurface>(
  state: RobotSubmergedRenderState,
  surface: TSurface | null | undefined,
  zmap: RobotSubmergedRenderMap,
  shiftX = 0,
  shiftY = 0,
): RobotSubmergedRenderCommand<TSurface> | null {
  if (!surface) return null;

  const renderHit = state.doHitEffect;
  state.submergeAmount = zmap.submergeAmount(
    state.position.x + 8,
    state.position.y + 8,
  );
  const visibleHeight = 16 - state.submergeAmount;
  if (visibleHeight <= 0) {
    state.doHitEffect = false;
    return null;
  }

  const region = zmap.getBlitInfo(
    state.position.x,
    state.position.y + state.submergeAmount,
    16,
    visibleHeight,
  );
  state.doHitEffect = false;

  if (!region) return null;

  return {
    surface,
    region: {
      ...region,
      destinationX: region.destinationX + shiftX,
      destinationY: region.destinationY + shiftY,
    },
    renderHit,
  };
}

/**
 * Port of upstream `RGrunt::PlaySelectedAnim`.
 * Role: Starts the grunt-specific selection portrait animation.
 * Upstream: rgrunt.cpp:55-69
 */
export function playGruntSelectedAnim(
  portrait: EntityPortraitAnimationTarget,
  randomInt: () => number = () => Math.floor(Math.random() * 2147483647),
): void {
  playRobotSelectedAnimWithReporting(
    portrait,
    PortraitAnimationType.GruntsReporting,
    randomInt,
  );
}

/**
 * Port of upstream `RGrunt::Init`.
 * Role: Initializes grunt firing animation images for each active non-null team, rotation, and frame.
 * Upstream: rgrunt.cpp:25-39
 */
export function initGruntFireImages<TSurface>(
  state: RobotFireImageInitState<TSurface>,
  makeTeamSurface: TeamSurfaceFactory<TSurface>,
): void {
  initRobotFireImages(state, makeTeamSurface, "grunt", ROBOT_FIRE_FRAME_COUNT);
}

/**
 * Replacement for upstream `RGrunt::DoRender`.
 * Role: Builds a clipped render command for the grunt robot's current animation image.
 * Upstream: rgrunt.cpp:88-135
 */
export function renderGruntRobot<TSurface>(
  state: GruntRobotRenderState<TSurface>,
  zmap: RobotSubmergedRenderMap,
  shiftX = 0,
  shiftY = 0,
): RobotSubmergedRenderCommand<TSurface> | null {
  return renderSubmergedRobotSurface(
    state,
    getGruntRobotRenderSurface(state),
    zmap,
    shiftX,
    shiftY,
  );
}

function getGruntRobotRenderSurface<TSurface>(
  state: GruntRobotRenderState<TSurface>,
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
      if (
        state.canThrowGrenades ||
        state.attackObject?.attackedOnlyByExplosives()
      ) {
        return state.throwSomethingImages[state.owner]?.[state.direction]?.[
          state.grenadeIndex
        ];
      }

      return state.fireImages[state.owner]?.[state.direction]?.[state.actionIndex];
    default:
      return state.nullImage;
  }
}

/**
 * Port of upstream `RLaser::Init`.
 * Role: Initializes laser firing animation images for each active non-null team, rotation, and frame.
 * Upstream: rlaser.cpp:24-38
 */
export function initLaserFireImages<TSurface>(
  state: RobotFireImageInitState<TSurface>,
  makeTeamSurface: TeamSurfaceFactory<TSurface>,
): void {
  initRobotFireImages(state, makeTeamSurface, "laser", 3);
}

/**
 * Replacement for upstream `RLaser::DoRender`.
 * Role: Builds a clipped render command for the laser robot's current animation image.
 * Upstream: rlaser.cpp:87-134
 */
export function renderLaserRobot<TSurface>(
  state: LaserRobotRenderState<TSurface>,
  zmap: RobotSubmergedRenderMap,
  shiftX = 0,
  shiftY = 0,
): RobotSubmergedRenderCommand<TSurface> | null {
  return renderGruntRobot(state, zmap, shiftX, shiftY);
}

/**
 * Port of upstream `RPsycho::Init`.
 * Role: Initializes psycho firing animation images for each active non-null team, rotation, and frame.
 * Upstream: rpsycho.cpp:24-38
 */
export function initPsychoFireImages<TSurface>(
  state: RobotFireImageInitState<TSurface>,
  makeTeamSurface: TeamSurfaceFactory<TSurface>,
): void {
  initRobotFireImages(state, makeTeamSurface, "psycho", 2);
}

/**
 * Replacement for upstream `RPsycho::DoRender`.
 * Role: Builds a clipped render command for the psycho robot's current animation image.
 * Upstream: rpsycho.cpp:87-134
 */
export function renderPsychoRobot<TSurface>(
  state: PsychoRobotRenderState<TSurface>,
  zmap: RobotSubmergedRenderMap,
  shiftX = 0,
  shiftY = 0,
): RobotSubmergedRenderCommand<TSurface> | null {
  return renderGruntRobot(state, zmap, shiftX, shiftY);
}

/**
 * Port of upstream `RPyro::Init`.
 * Role: Initializes pyro firing animation images for each active non-null team, rotation, and frame.
 * Upstream: rpyro.cpp:24-38
 */
export function initPyroFireImages<TSurface>(
  state: RobotFireImageInitState<TSurface>,
  makeTeamSurface: TeamSurfaceFactory<TSurface>,
): void {
  initRobotFireImages(state, makeTeamSurface, "pyro", 3);
}

/**
 * Replacement for upstream `RPyro::DoRender`.
 * Role: Builds a clipped render command for the pyro robot's current animation image.
 * Upstream: rpyro.cpp:87-134
 */
export function renderPyroRobot<TSurface>(
  state: PyroRobotRenderState<TSurface>,
  zmap: RobotSubmergedRenderMap,
  shiftX = 0,
  shiftY = 0,
): RobotSubmergedRenderCommand<TSurface> | null {
  return renderGruntRobot(state, zmap, shiftX, shiftY);
}

/**
 * Port of upstream `RSniper::Init`.
 * Role: Initializes sniper firing animation images from the shared grunt fire sprite set.
 * Upstream: rsniper.cpp:24-38
 */
export function initSniperFireImages<TSurface>(
  state: RobotFireImageInitState<TSurface>,
  makeTeamSurface: TeamSurfaceFactory<TSurface>,
): void {
  initRobotFireImages(state, makeTeamSurface, "grunt", ROBOT_FIRE_FRAME_COUNT);
}

/**
 * Replacement for upstream `RSniper::DoRender`.
 * Role: Builds a clipped render command for the sniper robot's current animation image.
 * Upstream: rsniper.cpp:87-134
 */
export function renderSniperRobot<TSurface>(
  state: SniperRobotRenderState<TSurface>,
  zmap: RobotSubmergedRenderMap,
  shiftX = 0,
  shiftY = 0,
): RobotSubmergedRenderCommand<TSurface> | null {
  return renderGruntRobot(state, zmap, shiftX, shiftY);
}

/**
 * Port of upstream `RTough::Init`.
 * Role: Initializes tough firing animation images for each active non-null team, rotation, and frame.
 * Upstream: rtough.cpp:26-40
 */
export function initToughFireImages<TSurface>(
  state: RobotFireImageInitState<TSurface>,
  makeTeamSurface: TeamSurfaceFactory<TSurface>,
): void {
  initRobotFireImages(state, makeTeamSurface, "tough", 3);
}

/**
 * Port of upstream `RLaser::PlaySelectedAnim`.
 * Role: Starts the laser-specific selection portrait animation.
 * Upstream: rlaser.cpp:54-68
 */
export function playLaserSelectedAnim(
  portrait: EntityPortraitAnimationTarget,
  randomInt: () => number = () => Math.floor(Math.random() * 2147483647),
): void {
  playRobotSelectedAnimWithReporting(
    portrait,
    PortraitAnimationType.LasersReporting,
    randomInt,
  );
}

/**
 * Port of upstream `RPsycho::PlaySelectedAnim`.
 * Role: Starts the psycho-specific selection portrait animation.
 * Upstream: rpsycho.cpp:54-68
 */
export function playPsychoSelectedAnim(
  portrait: EntityPortraitAnimationTarget,
  randomInt: () => number = () => Math.floor(Math.random() * 2147483647),
): void {
  playRobotSelectedAnimWithReporting(
    portrait,
    PortraitAnimationType.PsychosReporting,
    randomInt,
  );
}

/**
 * Port of upstream `RPyro::PlaySelectedAnim`.
 * Role: Starts the pyro-specific selection portrait animation.
 * Upstream: rpyro.cpp:54-68
 */
export function playPyroSelectedAnim(
  portrait: EntityPortraitAnimationTarget,
  randomInt: () => number = () => Math.floor(Math.random() * 2147483647),
): void {
  playRobotSelectedAnimWithReporting(
    portrait,
    PortraitAnimationType.PyrosReporting,
    randomInt,
  );
}

/**
 * Port of upstream `RSniper::PlaySelectedAnim`.
 * Role: Starts the sniper-specific selection portrait animation.
 * Upstream: rsniper.cpp:54-68
 */
export function playSniperSelectedAnim(
  portrait: EntityPortraitAnimationTarget,
  randomInt: () => number = () => Math.floor(Math.random() * 2147483647),
): void {
  playRobotSelectedAnimWithReporting(
    portrait,
    PortraitAnimationType.SnipersReporting,
    randomInt,
  );
}

/**
 * Port of upstream `RTough::PlaySelectedAnim`.
 * Role: Starts the tough-specific selection portrait animation.
 * Upstream: rtough.cpp:56-70
 */
export function playToughSelectedAnim(
  portrait: EntityPortraitAnimationTarget,
  randomInt: () => number = () => Math.floor(Math.random() * 2147483647),
): void {
  playRobotSelectedAnimWithReporting(
    portrait,
    PortraitAnimationType.ToughsReporting,
    randomInt,
  );
}

export type RobotDeathEffectListItem<TTime = unknown> =
  | RobotDeathEffectSpawn<TTime>
  | RobotTurretEffectSpawn<TTime>;

/**
 * Port of upstream `ZRobot::DoDeathEffect`.
 * Role: Spawns robot death debris or robot turret debris into the shared effect list.
 * Upstream: zrobot.cpp:369-378
 */
export function doRobotDeathEffect<TTime>(
  state: {
    ztime: TTime | null;
    position: { x: number; y: number };
    centerX: number;
    centerY: number;
    owner: TeamType | number;
  },
  effectList: RobotDeathEffectListItem<TTime>[] | null,
  doFireDeath: boolean,
  doMissileDeath: boolean,
): void {
  if (!effectList) return;

  if (doMissileDeath) {
    effectList.push({
      ztime: state.ztime,
      x: state.centerX,
      y: state.centerY,
      owner: state.owner,
    });
    return;
  }

  effectList.unshift({
    ztime: state.ztime,
    x: state.position.x,
    y: state.position.y,
    owner: state.owner,
    doFireDeath,
  });
}

/**
 * Browser simulation entity containing the subset of `ZRobot` behavior already ported.
 * Role: Represents shared robot behavior over the base game entity.
 * Upstream: zrobot.h
 */
export class RobotEntity extends GameEntity {
  grenadeAmount = 0;
  mode = RobotObjectMode.Standing;
  actionIndex = 0;
  nextAttackTime = 0;

  /**
   * Port of upstream `CanSetWaypoints`.
   * Role: Reports whether this robot can receive waypoint orders.
   * Upstream: zrobot.h:15
   */
  canSetWaypoints(): boolean {
    return true;
  }

  /**
   * Port of upstream `GetGrenadeAmount`.
   * Role: Reports this robot's grenade inventory count.
   * Upstream: zrobot.h:19
   */
  override getGrenadeAmount(): number {
    return this.grenadeAmount;
  }

  /**
   * Port of upstream `ZRobot::SetGrenadeAmount`.
   * Role: Updates robot grenade inventory and resets invalid counts.
   * Upstream: zrobot.cpp:409-418
   */
  override setGrenadeAmount(grenadeAmount: number): void {
    this.grenadeAmount = grenadeAmount;

    if (this.grenadeAmount < 0 || this.grenadeAmount > 99) {
      this.grenadeAmount = 0;
    }
  }

  /**
   * Port of upstream `CanHaveGrenades`.
   * Role: Reports whether this robot can carry grenade inventory.
   * Upstream: zrobot.h:17
   */
  override canHaveGrenades(): boolean {
    return true;
  }

  /**
   * Port of upstream `CanPickupGrenades`.
   * Role: Reports whether this robot can pick up grenade inventory.
   * Upstream: zrobot.h:16
   */
  override canPickupGrenades(): boolean {
    return this.grenadeAmount <= 0;
  }

  /**
   * Port of upstream `ZRobot::DoPickupGrenadeAnim`.
   * Role: Starts the robot grenade pickup animation based on its facing direction.
   * Upstream: zrobot.cpp:150-162
   */
  override doPickupGrenadeAnim(): void {
    if (!this.canHaveGrenades()) return;
    if (this.mode === RobotObjectMode.Attacking) return;

    this.mode =
      this.direction < 4
        ? RobotObjectMode.PickupUpGrenades
        : RobotObjectMode.PickupDownGrenades;
    this.actionIndex = 0;
  }

  /**
   * Port of upstream `ZRobot::CanThrowGrenades`.
   * Role: Reports whether this robot or its group leader has grenade inventory.
   * Upstream: zrobot.cpp:404-407
   */
  override canThrowGrenades(): boolean {
    const groupLeader = this.getGroupLeader();
    return Boolean(
      this.getGrenadeAmount() ||
        (groupLeader && groupLeader.getGrenadeAmount()),
    );
  }

  /**
   * Port of upstream `ZRobot::RecalcDirection`.
   * Role: Updates robot walking or standing mode from current movement direction.
   * Upstream: zrobot.cpp:328-348
   */
  override recalcDirection(): void {
    const newDirection = this.directionFromLocation(
      this.locationDeltaX,
      this.locationDeltaY,
    );

    if (newDirection !== -1) {
      if (this.mode !== RobotObjectMode.Walking) {
        this.actionIndex = 0;
      }

      this.mode = RobotObjectMode.Walking;
      this.direction = newDirection;
      return;
    }

    this.mode = RobotObjectMode.Standing;
  }

  /**
   * Port of upstream `ZRobot::SetAttackObject`.
   * Role: Updates the robot attack target and attack animation timing state.
   * Upstream: zrobot.cpp:350-367
   */
  override setAttackObject(object: GameEntity | null, currentTime = 0): void {
    this.attackObject = object;

    if (this.attackObject) {
      this.mode = RobotObjectMode.Attacking;
      this.actionIndex = 0;
      this.nextAttackTime = currentTime + 0.1;
      return;
    }

    if (
      this.mode !== RobotObjectMode.Walking &&
      this.mode !== RobotObjectMode.Standing
    ) {
      this.mode = RobotObjectMode.Standing;
    }
  }
}
