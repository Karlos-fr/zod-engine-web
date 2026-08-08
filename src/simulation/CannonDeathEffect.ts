/**
 * Upstream: ecannondeath.h
 */
import type { DeathSparksEffectSpawn } from "./DeathSparksEffect";
import {
  TurretMissileEffectType,
  type TurretMissileEffectSpawn,
} from "./TurretMissileEffect";

/**
 * Port of upstream `_ECANNONDEATH_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: ecannondeath.h:2
 */
export const ECANNON_DEATH_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ecannondeath_objects`.
 * Role: Identifies which cannon body variant is represented by a cannon death effect.
 * Upstream: ecannondeath.h:7-10
 */
export enum CannonDeathObject {
  Gatling = 0,
  Gun = 1,
  Howitzer = 2,
  Missile = 3,
}

/**
 * Port of upstream `ECannonDeath` wasted image fields.
 * Role: Stores the base image path for each cannon destroyed-body variant.
 * Upstream: ecannondeath.cpp:76-79
 */
export type CannonDeathImageState = {
  gatlingWasted: string | null;
  gunWasted: string | null;
  howitzerWasted: string | null;
  missileWasted: string | null;
};

/**
 * Minimal state consumed by ported `ECannonDeath::Init`.
 * Role: Holds cannon destroyed-body image paths and the initialization flag.
 * Upstream: ecannondeath.cpp:74-82
 */
export type CannonDeathInitState = CannonDeathImageState & {
  finishedInit: boolean;
};

/**
 * Port of upstream `ECannonDeath` construction arguments.
 * Role: Describes a cannon death effect spawned by cannon fire.
 * Upstream: ecannondeath.h:13-38
 */
export type CannonDeathEffectSpawn<TTime = unknown> = {
  ztime: TTime | null;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  offsetTime: number;
  object: CannonDeathObject;
};

/**
 * Port of upstream `ECannonDeath::Process` mutable fields.
 * Role: Stores cannon death timing, effect outputs, and child effects.
 * Upstream: ecannondeath.cpp:84-119
 */
export type CannonDeathProcessState<TTime = unknown> = {
  ztime: TTime | null;
  killMe: boolean;
  finalTime: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  offsetTime: number;
  object: CannonDeathObject | number;
  extraEffects: Array<{ process(): void }>;
};

export type CannonDeathRenderMap<TSurface, TCommand> = {
  renderZSurface(
    surface: TSurface,
    x: number,
    y: number,
    renderHit: boolean,
    aboutCenter: boolean,
  ): TCommand;
};

export type CannonDeathRenderChild<TMap, TCommand> = {
  render(zmap: TMap): TCommand | null;
};

/**
 * Replacement state for upstream `ECannonDeath::DoRender`.
 * Role: Tracks destroyed-cannon sprite placement and child visual effects.
 * Upstream: ecannondeath.cpp:121-133
 */
export type CannonDeathRenderState<TSurface, TMap, TCommand> = {
  killMe: boolean;
  x: number;
  y: number;
  wastedImage: TSurface | null;
  extraEffects: readonly CannonDeathRenderChild<TMap, TCommand>[];
};

/**
 * Port of upstream `ECannonDeath::Init`.
 * Role: Initializes cannon destroyed-body image paths.
 * Upstream: ecannondeath.cpp:74-82
 */
export function initCannonDeathEffect(state: CannonDeathInitState): void {
  state.gatlingWasted = "assets/units/cannons/gatling/wasted.png";
  state.gunWasted = "assets/units/cannons/gun/wasted.png";
  state.howitzerWasted = "assets/units/cannons/howitzer/wasted.png";
  state.missileWasted = "assets/units/cannons/missile_cannon/wasted.png";

  state.finishedInit = true;
}

/**
 * Port of upstream `ECannonDeath::DoSparks`.
 * Role: Spawns cannon death spark effects around the destroyed cannon center.
 * Upstream: ecannondeath.cpp:135-150
 */
export function spawnCannonDeathEffectSparks<TTime>(
  state: {
    ztime: TTime | null;
    x: number;
    y: number;
  },
  effectList: DeathSparksEffectSpawn<TTime>[] | null,
  randomInt: (maxExclusive: number) => number = (maxExclusive) =>
    Math.floor(Math.random() * maxExclusive),
): void {
  const sparksAmount = 20 + (Math.trunc(randomInt(15)) % 15);
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
 * Port of upstream `ECannonDeath::Process`.
 * Role: Expires cannon death effects, spawns debris, and processes transient child effects.
 * Upstream: ecannondeath.cpp:84-119
 */
export function processCannonDeathEffect<TTime>(
  state: CannonDeathProcessState<TTime>,
  currentTime: number,
  turretMissileEffects: TurretMissileEffectSpawn<TTime>[] | null,
  deathSparkEffects: DeathSparksEffectSpawn<TTime>[] | null,
  randomInt: (maxExclusive: number) => number = (maxExclusive) =>
    Math.floor(Math.random() * maxExclusive),
): void {
  if (state.killMe) return;

  if (currentTime >= state.finalTime) {
    state.killMe = true;
    spawnCannonDeathEffectSparks(state, deathSparkEffects, randomInt);

    const missileType = cannonDeathObjectToTurretMissileType(state.object);
    if (missileType === null) return;

    turretMissileEffects?.push({
      ztime: state.ztime,
      startX: state.x,
      startY: state.y,
      targetX: state.targetX,
      targetY: state.targetY,
      offsetTime: state.offsetTime,
      type: missileType,
    });
    return;
  }

  for (const effect of state.extraEffects) {
    effect.process();
  }
}

/**
 * Replacement for upstream `ECannonDeath::DoRender`.
 * Role: Builds destroyed-cannon and child-effect render commands.
 * Upstream: ecannondeath.cpp:121-133
 */
export function renderCannonDeathEffect<TSurface, TCommand, TMap extends CannonDeathRenderMap<TSurface, TCommand>>(
  state: CannonDeathRenderState<TSurface, TMap, TCommand>,
  zmap: TMap,
): TCommand[] {
  if (state.killMe) return [];

  const commands: TCommand[] = [];

  if (state.wastedImage) {
    commands.push(
      zmap.renderZSurface(state.wastedImage, state.x, state.y, false, false),
    );
  }

  for (const effect of state.extraEffects) {
    const command = effect.render(zmap);
    if (command) commands.push(command);
  }

  return commands;
}

function cannonDeathObjectToTurretMissileType(
  object: CannonDeathObject | number,
): TurretMissileEffectType | null {
  switch (object) {
    case CannonDeathObject.Gatling:
      return TurretMissileEffectType.Gatling;
    case CannonDeathObject.Gun:
      return TurretMissileEffectType.Gun;
    case CannonDeathObject.Howitzer:
      return TurretMissileEffectType.Howitzer;
    case CannonDeathObject.Missile:
      return TurretMissileEffectType.MissileCannon;
    default:
      return null;
  }
}
