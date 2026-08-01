/**
 * Upstream: edeath.h
 */
import type { DeathSparksEffectSpawn } from "./DeathSparksEffect";

/**
 * Port of upstream `_EDEATH_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: edeath.h:2
 */
export const EDEATH_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `edeath_objects`.
 * Role: Identifies the vehicle death sprite set for the death effect.
 * Upstream: edeath.h:7-10
 */
export enum DeathEffectObject {
  Jeep = 0,
  MobileMissile = 1,
  Apc = 2,
  Tank = 3,
  Crane = 4,
}

/**
 * Port of upstream `EDeath` construction arguments.
 * Role: Carries the spawned vehicle death effect state.
 * Upstream: edeath.cpp, edeath.h
 */
export type DeathEffectSpawn<TTime = unknown> = {
  ztime: TTime | null;
  x: number;
  y: number;
  object: DeathEffectObject;
  baseImage?: unknown | null;
};

/**
 * Port of upstream `EDeath` wasted image fields.
 * Role: Stores the base image path for each vehicle destroyed-body variant initialized by the effect.
 * Upstream: edeath.cpp:101-104
 */
export type DeathEffectImageState = {
  jeepWasted: string | null;
  mobileMissileWasted: string | null;
  apcWasted: string | null;
  craneWasted: string | null;
};

/**
 * Minimal state consumed by ported `EDeath::Init`.
 * Role: Holds vehicle destroyed-body image paths and the initialization flag.
 * Upstream: edeath.cpp:99-107
 */
export type DeathEffectInitState = DeathEffectImageState & {
  finishedInit: boolean;
};

/**
 * Port of upstream `EDeath::Process` mutable fields.
 * Role: Tracks lifetime, spark spawning, and child effect processing for a vehicle death effect.
 * Upstream: edeath.cpp:109-124
 */
export type DeathEffectProcessState<TTime = unknown> = {
  killme: boolean;
  finalTime: number;
  ztime: TTime | null;
  x: number;
  y: number;
  extraEffects: Array<{ process(): void }>;
};

/**
 * Port of upstream `EDeath::Init`.
 * Role: Initializes vehicle destroyed-body image paths.
 * Upstream: edeath.cpp:99-107
 */
export function initDeathEffect(state: DeathEffectInitState): void {
  state.jeepWasted = "assets/units/vehicles/jeep/wasted.png";
  state.mobileMissileWasted =
    "assets/units/vehicles/missile_launcher/wasted.png";
  state.apcWasted = "assets/units/vehicles/apc/wasted.png";
  state.craneWasted = "assets/units/vehicles/crane/wasted_null.png";

  state.finishedInit = true;
}

/**
 * Port of upstream `EDeath::DoSparks`.
 * Role: Spawns vehicle death spark effects around the destroyed object center.
 * Upstream: edeath.cpp:140-155
 */
export function spawnDeathEffectSparks<TTime>(
  state: {
    ztime: TTime | null;
    x: number;
    y: number;
  },
  effectList: DeathSparksEffectSpawn<TTime>[] | null,
  randomInt: (maxExclusive: number) => number = (maxExclusive) =>
    Math.floor(Math.random() * maxExclusive),
): void {
  const sparksAmount = 40 + (Math.trunc(randomInt(30)) % 30);
  const sparkX = state.x + 16;
  const sparkY = state.y + 16;

  if (!effectList) return;

  for (let i = 0; i < sparksAmount; i += 1) {
    effectList.push({
      ztime: state.ztime,
      x: sparkX,
      y: sparkY,
    });
  }
}

/**
 * Port of upstream `EDeath::Process`.
 * Role: Advances a vehicle death effect, ending it with spark spawns at final time.
 * Upstream: edeath.cpp:109-124
 */
export function processDeathEffect<TTime>(
  state: DeathEffectProcessState<TTime>,
  currentTime: number,
  effectList: DeathSparksEffectSpawn<TTime>[] | null,
  randomInt: (maxExclusive: number) => number = (maxExclusive) =>
    Math.floor(Math.random() * maxExclusive),
): void {
  if (state.killme) return;

  if (currentTime >= state.finalTime) {
    state.killme = true;
    spawnDeathEffectSparks(state, effectList, randomInt);
    return;
  }

  for (const effect of state.extraEffects) {
    effect.process();
  }
}
