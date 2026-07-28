/**
 * Ported from Zod Engine.
 * Upstream: zportrait.h / zportrait.cpp
 */

/**
 * Port of upstream `_ZPORTRAIT_H_`.
 * Role: Marks an upstream header boundary.
 * Ledger: MAC-76482F
 * Upstream: zportrait.h:2
 */
export const ZPORTRAIT_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ZPORTRAIT_BASE_WIDTH`.
 * Role: Defines the base portrait image width.
 * Ledger: MAC-1B23C5
 * Upstream: zportrait.h:16
 */
export const PORTRAIT_BASE_WIDTH_PIXELS = 86;

/**
 * Port of upstream `ZPORTRAIT_BASE_HEIGHT`.
 * Role: Defines the base portrait image height.
 * Ledger: MAC-133A59
 * Upstream: zportrait.h:17
 */
export const PORTRAIT_BASE_HEIGHT_PIXELS = 74;

/**
 * Port of upstream `MAX_EYES`.
 * Role: Defines the number of eye sprite variants.
 * Ledger: MAC-D08EAE
 * Upstream: zportrait.h:19
 */
export const PORTRAIT_MAX_EYES = 11;

/**
 * Port of upstream `MAX_HANDS`.
 * Role: Defines the number of hand sprite variants.
 * Ledger: MAC-8004D5
 * Upstream: zportrait.h:20
 */
export const PORTRAIT_MAX_HANDS = 9;

/**
 * Port of upstream `MAX_MOUTHS`.
 * Role: Defines the number of mouth sprite variants.
 * Ledger: MAC-92052D
 * Upstream: zportrait.h:21
 */
export const PORTRAIT_MAX_MOUTHS = 16;

/**
 * Port of upstream `look_direction`.
 * Role: Identifies which direction a portrait face is looking.
 * Ledger: ENU-85FAF4
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
 * Ledger: ENU-A1377E
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
 * Port of upstream `do_random_anims`.
 * Role: Stores whether portrait random animations are enabled.
 * Ledger: FUN-D35B40
 * Upstream: zportrait.h:159
 */
export type PortraitRandomAnimationState = {
  doRandomAnims: boolean;
};

/**
 * Port of upstream `SetDoRandomAnims`.
 * Role: Updates whether portrait random animations are enabled.
 * Ledger: FUN-D35B40
 * Upstream: zportrait.h:159
 */
export function setPortraitDoRandomAnims(
  state: PortraitRandomAnimationState,
  doRandomAnims: boolean,
): void {
  state.doRandomAnims = doRandomAnims;
}

/**
 * Port of upstream `duration_multi`.
 * Role: Scales portrait animation frame durations.
 * Ledger: CON-6FAD49
 * Upstream: zportrait.cpp:555
 */
export const PORTRAIT_FRAME_DURATION_MULTIPLIER_SECONDS = 0.015;
