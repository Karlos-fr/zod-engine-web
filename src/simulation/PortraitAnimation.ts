/**
 * Upstream: zportrait.h / zportrait.cpp
 */

import type { GameEntity } from "./entities/GameEntity";
import type { PlanetType, TeamType } from "./SimulationConstants";
import { RobotType } from "./SimulationConstants";
import { MapObjectType } from "../world/MapFormat";

/**
 * Port of upstream `_ZPORTRAIT_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: zportrait.h:2
 */
export const ZPORTRAIT_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ZObject` forward declaration.
 * Role: Provides the entity reference accepted by portrait object binding.
 * Upstream: zportrait.h:10
 */
export type PortraitObjectReference = GameEntity;

/**
 * Port of upstream `ZPORTRAIT_BASE_WIDTH`.
 * Role: Defines the base portrait image width.
 * Upstream: zportrait.h:16
 */
export const PORTRAIT_BASE_WIDTH_PIXELS = 86;

/**
 * Port of upstream `ZPORTRAIT_BASE_HEIGHT`.
 * Role: Defines the base portrait image height.
 * Upstream: zportrait.h:17
 */
export const PORTRAIT_BASE_HEIGHT_PIXELS = 74;

/**
 * Browser-side replacement for the SDL source/destination rectangle pair.
 * Role: Carries the copied portrait region dimensions and destination position.
 * Upstream: zportrait.cpp:10945-10987
 */
export type PortraitBlitInfo = {
  sourceX: number;
  sourceY: number;
  width: number;
  height: number;
  destinationX: number;
  destinationY: number;
};

/**
 * Port of upstream `MAX_EYES`.
 * Role: Defines the number of eye sprite variants.
 * Upstream: zportrait.h:19
 */
export const PORTRAIT_MAX_EYES = 11;

/**
 * Port of upstream `MAX_HANDS`.
 * Role: Defines the number of hand sprite variants.
 * Upstream: zportrait.h:20
 */
export const PORTRAIT_MAX_HANDS = 9;

/**
 * Port of upstream `MAX_MOUTHS`.
 * Role: Defines the number of mouth sprite variants.
 * Upstream: zportrait.h:21
 */
export const PORTRAIT_MAX_MOUTHS = 16;

/**
 * Port of upstream `look_direction`.
 * Role: Identifies which direction a portrait face is looking.
 * Upstream: zportrait.h:23-26
 */
export enum PortraitLookDirection {
  Straight = 0,
  Right = 1,
  Left = 2,
  MaxLookDirections = 3,
}

/**
 * Port of upstream `portrait_anim`.
 * Role: Identifies portrait animation and voice-line sequences.
 * Upstream: zportrait.h:28-55
 */
export enum PortraitAnimationType {
  YesSir = 0,
  YesSir3 = 1,
  UnitReporting1 = 2,
  UnitReporting2 = 3,
  GruntsReporting = 4,
  PsychosReporting = 5,
  SnipersReporting = 6,
  ToughsReporting = 7,
  LasersReporting = 8,
  PyrosReporting = 9,
  WereOnOurWay = 10,
  HereWeGo = 11,
  YouveGotIt = 12,
  MovingIn = 13,
  Okay = 14,
  Alright = 15,
  NoProblem = 16,
  OverNOut = 17,
  Affirmative = 18,
  GoingIn = 19,
  LetsDoIt = 20,
  LetsGetEm = 21,
  WereUnderAttack = 22,
  ISaidWereUnderAttack = 23,
  HelpHelp = 24,
  TheyreAllOverUs = 25,
  WereLoseingIt = 26,
  Aaahhh = 27,
  ForChristSake = 28,
  YoureJoking = 29,
  TargetDestroyed = 30,
  Blink = 31,
  Wink = 32,
  Surprise = 33,
  Anger = 34,
  Grin = 35,
  Scared = 36,
  EyesLeft = 37,
  EyesRight = 38,
  EyesUp = 39,
  EyesDown = 40,
  Whistle = 41,
  LookLeft = 42,
  LookRight = 43,
  Salute = 44,
  ThumbsUp = 45,
  YesSirSalute = 46,
  GoingInThumbsUp = 47,
  ForgetIt = 48,
  GetOuttaHere = 49,
  NoWay = 50,
  GoodHit = 51,
  NiceOne = 52,
  OhYeah = 53,
  Gotcha = 54,
  Smokin = 55,
  Cool = 56,
  WipeOut = 57,
  TerritoryTaken = 58,
  FireExtinguished = 59,
  GunCaptured = 60,
  VehicleCaptured = 61,
  GrenadesCollected = 62,
  EndW1 = 63,
  EndW2 = 64,
  EndW3 = 65,
  EndL1 = 66,
  EndL2 = 67,
  EndL3 = 68,
  MaxPortraitAnims = 69,
}

/**
 * Port of upstream `ZPortrait_Frame`.
 * Role: Stores one frame of portrait facial and hand animation state.
 * Upstream: zportrait.h:85-108
 */
export class PortraitFrame {
  lookDirection = PortraitLookDirection.Straight;
  mouth = 0;
  eyes = 0;
  hand = 0;
  handX = 0;
  handY = 0;
  handDoRender = false;
  headX = 4;
  headY = 2;
  duration = 0;
}

/**
 * Port of upstream `ZPortrait_Anim` frame list and duration fields.
 * Role: Holds the frames and total duration for one portrait animation sequence.
 * Upstream: zportrait.h:117-118
 */
export type PortraitAnimationState = {
  frameList: PortraitFrame[];
  totalDuration: number;
};

/**
 * Port of upstream `ZPortrait_Anim::AddFrame`.
 * Role: Adds a shifted hand-animation frame and refreshes the sequence duration.
 * Upstream: zportrait.cpp:538-551
 */
export function addPortraitAnimationFrame(
  state: PortraitAnimationState,
  frame: PortraitFrame,
): void {
  frame.handX -= 4;
  frame.handY -= 4;

  const storedFrame = Object.assign(new PortraitFrame(), frame);
  state.frameList.push(storedFrame);
  state.totalDuration = state.frameList.reduce(
    (duration, currentFrame) => duration + currentFrame.duration,
    0,
  );
}

/**
 * Port of upstream `ZPortrait_Anim`.
 * Role: Stores and updates one portrait animation sequence.
 * Upstream: zportrait.h:110-129
 */
export class PortraitAnimation implements PortraitAnimationState {
  frameList: PortraitFrame[] = [];
  totalDuration = 0;

  addFrame(frame: PortraitFrame): void {
    addPortraitAnimationFrame(this, frame);
  }

  copyFrom(animation: PortraitAnimationState): this {
    if (animation === this) {
      return this;
    }

    this.frameList = animation.frameList.map((frame) =>
      Object.assign(new PortraitFrame(), frame),
    );
    this.totalDuration = animation.totalDuration;

    return this;
  }
}

/**
 * Port of upstream `ZPortrait_Unit_Graphics`.
 * Role: Stores portrait sprite surfaces for one robot and team palette.
 * Upstream: zportrait.h:131-141
 */
export class PortraitUnitGraphics<TSurface = unknown> {
  head: Array<TSurface | null>;
  eyes: Array<TSurface | null>;
  hand: Array<TSurface | null>;
  mouth: Array<TSurface | null>;
  shoulders: TSurface | null = null;

  constructor() {
    this.head = Array.from(
      { length: PortraitLookDirection.MaxLookDirections },
      () => null,
    );
    this.eyes = Array.from({ length: PORTRAIT_MAX_EYES }, () => null);
    this.hand = Array.from({ length: PORTRAIT_MAX_HANDS }, () => null);
    this.mouth = Array.from({ length: PORTRAIT_MAX_MOUTHS }, () => null);
  }
}

/**
 * Port of upstream `ZPortrait::GetBlitInfo`.
 * Role: Calculates source clipping and portrait destination for sprite blits.
 * Upstream: zportrait.cpp:10945-10987
 */
export function getPortraitBlitInfo(
  source: { width: number; height: number } | null,
  x: number,
  y: number,
): PortraitBlitInfo | null {
  if (!source) return null;

  if (x > PORTRAIT_BASE_WIDTH_PIXELS) return null;
  if (y > PORTRAIT_BASE_HEIGHT_PIXELS) return null;
  if (x + source.width < 0) return null;
  if (y + source.height < 0) return null;

  let destinationX = x;
  let destinationY = y;
  let sourceX: number;
  let sourceY: number;
  let width: number;
  let height: number;

  if (destinationX < 0) {
    sourceX = -destinationX;
    width = source.width + destinationX;
    destinationX += sourceX;
    if (width > PORTRAIT_BASE_WIDTH_PIXELS) width = PORTRAIT_BASE_WIDTH_PIXELS;
  } else if (destinationX + source.width > PORTRAIT_BASE_WIDTH_PIXELS) {
    sourceX = 0;
    width = PORTRAIT_BASE_WIDTH_PIXELS - destinationX;
  } else {
    sourceX = 0;
    width = source.width;
  }

  if (destinationY < 0) {
    sourceY = -destinationY;
    height = source.height + destinationY;
    destinationY += sourceY;
    if (height > PORTRAIT_BASE_HEIGHT_PIXELS) {
      height = PORTRAIT_BASE_HEIGHT_PIXELS;
    }
  } else if (destinationY + source.height > PORTRAIT_BASE_HEIGHT_PIXELS) {
    sourceY = 0;
    height = PORTRAIT_BASE_HEIGHT_PIXELS - destinationY;
  } else {
    sourceY = 0;
    height = source.height;
  }

  return {
    sourceX,
    sourceY,
    width,
    height,
    destinationX,
    destinationY,
  };
}

/**
 * Port of upstream `ZPortrait` reference id field.
 * Role: Holds the object reference associated with the active portrait.
 * Upstream: zportrait.h:156, zportrait.h:194
 */
export type PortraitRefState = {
  refId: number;
};

/**
 * Port of upstream `SetRefID`.
 * Role: Updates the object reference associated with the active portrait.
 * Upstream: zportrait.h:156
 */
export function setPortraitRefId(state: PortraitRefState, refId: number): void {
  state.refId = refId;
}

/**
 * Port of upstream `GetRefID`.
 * Role: Returns the object reference associated with the active portrait.
 * Upstream: zportrait.h:157
 */
export function getPortraitRefId(state: PortraitRefState): number {
  return state.refId;
}

/**
 * Port of upstream `do_random_anims`.
 * Role: Stores whether portrait random animations are enabled.
 * Upstream: zportrait.h:159
 */
export type PortraitRandomAnimationState = {
  doRandomAnims: boolean;
};

/**
 * Port of upstream `SetDoRandomAnims`.
 * Role: Updates whether portrait random animations are enabled.
 * Upstream: zportrait.h:159
 */
export function setPortraitDoRandomAnims(
  state: PortraitRandomAnimationState,
  doRandomAnims: boolean,
): void {
  state.doRandomAnims = doRandomAnims;
}

/**
 * Port of upstream `ZPortrait` over-map field.
 * Role: Stores whether the portrait is rendered over the map.
 * Upstream: zportrait.h:182
 */
export type PortraitOverMapState = {
  overMap: boolean;
};

/**
 * Port of upstream `ZPortrait` terrain field.
 * Role: Stores the terrain palette used by portrait assets.
 * Upstream: zportrait.h:166
 */
export type PortraitTerrainState = {
  terrain: PlanetType;
};

/**
 * Port of upstream `ZPortrait` in-vehicle field.
 * Role: Stores whether the portrait subject is currently in a vehicle.
 * Upstream: zportrait.h:172
 */
export type PortraitInVehicleState = {
  inVehicle: boolean;
};

/**
 * Port of upstream `ZPortrait` team field.
 * Role: Stores the team palette used by portrait assets.
 * Upstream: zportrait.h:173
 */
export type PortraitTeamState = {
  team: TeamType | number;
};

/**
 * Port of upstream `ZPortrait` robot id render state.
 * Role: Stores the portrait robot type and whether the portrait needs rerendering.
 * Upstream: zportrait.h:167, zportrait.h:181
 */
export type PortraitRobotIdState = {
  oid: RobotType | number;
  doRender: boolean;
};

/**
 * Port of upstream `ZPortrait` current animation field.
 * Role: Holds the active portrait animation id, or -1 when idle.
 * Upstream: zportrait.h:177
 */
export type PortraitCurrentAnimationState = {
  currentAnimation: PortraitAnimationType | number;
};

/**
 * Port of upstream `ZPortrait` animation start fields.
 * Role: Stores animation data and active frame state used when starting an animation.
 * Upstream: zportrait.h:176-179
 */
export type PortraitStartAnimationState = {
  animInfo: PortraitAnimationState[];
  currentAnimation: PortraitAnimationType | number;
  renderFrame: PortraitFrame;
  animationStartTime: number;
};

/**
 * Port of upstream `ZPortrait::StartRandomAnim` state.
 * Role: Stores whether random portrait animations may start and the active animation state.
 * Upstream: zportrait.h:159, zportrait.h:176-179
 */
export type PortraitStartRandomAnimationState =
  PortraitRandomAnimationState & PortraitStartAnimationState;

/**
 * Port of upstream `ZPortrait` robot binding fields reset by `ClearRobotID`.
 * Role: Captures the portrait subject, render frame, animation, and reference state.
 * Upstream: zportrait.h:167, zportrait.h:172, zportrait.h:177-181, zportrait.h:194
 */
export type PortraitRobotClearState = {
  oid: RobotType | number;
  inVehicle: boolean;
  doRender: boolean;
  stillFrame: PortraitFrame;
  renderFrame: PortraitFrame;
  currentAnimation: PortraitAnimationType | number;
  animationStartTime: number;
  refId: number;
};

/**
 * Port of upstream `ZPortrait::SetObject` object access surface.
 * Role: Supplies identity, team, reference, and driver data for portrait binding.
 * Upstream: zportrait.cpp:149-178
 */
export type PortraitSetObjectReference = {
  refId: number;
  getObjectId(): { objectType: number; objectId: number };
  getOwner(): TeamType | number;
  getDriverType(): number;
};

/**
 * Port of upstream `ZPortrait::SetObject` mutable fields.
 * Role: Stores the active portrait subject and render invalidation state.
 * Upstream: zportrait.cpp:149-178
 */
export type PortraitSetObjectState = PortraitRobotClearState &
  PortraitTeamState &
  PortraitRobotIdState;

/**
 * Port of upstream `ZPortrait` coordinate fields.
 * Role: Stores the portrait render origin.
 * Upstream: zportrait.cpp:114-118
 */
export type PortraitCoordinateState = {
  x: number;
  y: number;
};

/**
 * Port of upstream `ZPortrait::SetCords`.
 * Role: Updates the portrait render origin.
 * Upstream: zportrait.cpp:114-118
 */
export function setPortraitCoordinates(
  state: PortraitCoordinateState,
  x: number,
  y: number,
): void {
  state.x = x;
  state.y = y;
}

/**
 * Port of upstream `ZPortrait::SetOverMap`.
 * Role: Updates whether the portrait is rendered over the map.
 * Upstream: zportrait.cpp:120-123
 */
export function setPortraitOverMap(
  state: PortraitOverMapState,
  overMap: boolean,
): void {
  state.overMap = overMap;
}

/**
 * Port of upstream `ZPortrait::SetTerrainType`.
 * Role: Stores the portrait terrain palette.
 * Upstream: zportrait.cpp:125-128
 */
export function setPortraitTerrainType(
  state: PortraitTerrainState,
  terrain: PlanetType,
): void {
  state.terrain = terrain;
}

/**
 * Port of upstream `ZPortrait::SetInVehicle`.
 * Role: Stores whether the portrait subject is in a vehicle.
 * Upstream: zportrait.cpp:130-133
 */
export function setPortraitInVehicle(
  state: PortraitInVehicleState,
  inVehicle: boolean,
): void {
  state.inVehicle = inVehicle;
}

/**
 * Port of upstream `ZPortrait::SetTeam`.
 * Role: Stores the portrait team palette.
 * Upstream: zportrait.cpp:135-138
 */
export function setPortraitTeam(state: PortraitTeamState, team: TeamType | number): void {
  state.team = team;
}

/**
 * Port of upstream `ZPortrait::SetRobotID`.
 * Role: Stores the robot portrait id, invalidating render and clamping invalid ids.
 * Upstream: zportrait.cpp:140-147
 */
export function setPortraitRobotId(
  state: PortraitRobotIdState,
  robotId: number,
): void {
  state.oid = robotId;
  state.doRender = true;

  if (state.oid < 0 || state.oid >= RobotType.Max) {
    state.oid = RobotType.Grunt;
  }
}

/**
 * Port of upstream `ZPortrait::DoingAnim`.
 * Role: Reports whether a portrait animation is currently active.
 * Upstream: zportrait.cpp:225-228
 */
export function isPortraitDoingAnimation(
  state: PortraitCurrentAnimationState,
): boolean {
  return state.currentAnimation !== -1;
}

/**
 * Port of upstream `ZPortrait::StartAnim`.
 * Role: Starts an animation at its first frame and triggers its voice line.
 * Upstream: zportrait.cpp:191-201
 */
export function startPortraitAnimation(
  state: PortraitStartAnimationState,
  animation: PortraitAnimationType | number,
  currentTime: () => number,
  playAnimSound: () => void,
): void {
  const firstFrame = state.animInfo[animation]?.frameList[0];

  if (!firstFrame) {
    return;
  }

  state.currentAnimation = animation;
  state.renderFrame = firstFrame;
  state.animationStartTime = currentTime();
  playAnimSound();
}

const PORTRAIT_RANDOM_ANIMATIONS = [
  PortraitAnimationType.Blink,
  PortraitAnimationType.Wink,
  PortraitAnimationType.Surprise,
  PortraitAnimationType.Anger,
  PortraitAnimationType.Grin,
  PortraitAnimationType.Scared,
  PortraitAnimationType.EyesLeft,
  PortraitAnimationType.EyesRight,
  PortraitAnimationType.EyesUp,
  PortraitAnimationType.EyesDown,
  PortraitAnimationType.Whistle,
  PortraitAnimationType.LookLeft,
  PortraitAnimationType.LookRight,
] as const;

/**
 * Port of upstream `ZPortrait::StartRandomAnim`.
 * Role: Starts one of the portrait's ambient facial animations when enabled.
 * Upstream: zportrait.cpp:203-223
 */
export function startPortraitRandomAnimation(
  state: PortraitStartRandomAnimationState,
  currentTime: () => number,
  playAnimSound: () => void,
  randomInt: (maxExclusive: number) => number = (maxExclusive) =>
    Math.floor(Math.random() * maxExclusive),
): void {
  if (!state.doRandomAnims) return;

  const index =
    Math.trunc(randomInt(PORTRAIT_RANDOM_ANIMATIONS.length)) %
    PORTRAIT_RANDOM_ANIMATIONS.length;
  startPortraitAnimation(
    state,
    PORTRAIT_RANDOM_ANIMATIONS[index],
    currentTime,
    playAnimSound,
  );
}

/**
 * Port of upstream `ZPortrait::ClearRobotID`.
 * Role: Clears the active robot portrait binding and resets animation/render state.
 * Upstream: zportrait.cpp:180-189
 */
export function clearPortraitRobotId(state: PortraitRobotClearState): void {
  state.oid = RobotType.Grunt;
  state.inVehicle = false;
  state.doRender = false;
  state.renderFrame = state.stillFrame;
  state.currentAnimation = -1;
  state.animationStartTime = 0;
  state.refId = -1;
}

/**
 * Port of upstream `ZPortrait::SetObject`.
 * Role: Binds the portrait to a robot, vehicle, or cannon object.
 * Upstream: zportrait.cpp:149-178
 */
export function setPortraitObject(
  state: PortraitSetObjectState,
  object: PortraitSetObjectReference | null,
): void {
  clearPortraitRobotId(state);

  if (!object) return;

  const objectId = object.getObjectId();

  setPortraitTeam(state, object.getOwner());
  state.refId = object.refId;

  switch (objectId.objectType) {
    case MapObjectType.Robot:
      setPortraitInVehicle(state, false);
      setPortraitRobotId(state, objectId.objectId);
      break;
    case MapObjectType.Vehicle:
    case MapObjectType.Cannon:
      setPortraitRobotId(state, object.getDriverType());
      setPortraitInVehicle(state, true);
      break;
  }
}

/**
 * Port of upstream `duration_multi`.
 * Role: Scales portrait animation frame durations.
 * Upstream: zportrait.cpp:555
 */
export const PORTRAIT_FRAME_DURATION_MULTIPLIER_SECONDS = 0.015;
