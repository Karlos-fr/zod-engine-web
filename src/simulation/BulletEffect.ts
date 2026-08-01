/**
 * Upstream: ebullet.cpp / ebullet.h
 */

import { SoundEngineSound } from "../audio/AudioService";

/**
 * Port of upstream `EUnitParticle` creation by `EBullet::Process`.
 * Role: Describes a unit-particle effect spawned at a bullet impact point.
 * Upstream: ebullet.cpp:41-45
 */
export type BulletUnitParticleSpawn<TTime = unknown> = {
  ztime: TTime;
  x: number;
  y: number;
};

/**
 * Port of upstream restricted ricochet sound call by `EBullet::Process`.
 * Role: Describes a positional sound emitted by a bullet impact.
 * Upstream: ebullet.cpp:47
 */
export type BulletRestrictedSoundCommand = {
  sound: SoundEngineSound | number;
  x: number;
  y: number;
};

/**
 * Port of upstream `EBullet::Process` mutable fields.
 * Role: Tracks bullet lifetime, movement, and impact position.
 * Upstream: ebullet.cpp:32-55
 */
export type BulletProcessState<TTime = unknown> = {
  killme: boolean;
  ztime: TTime;
  finalTime: number;
  initTime: number;
  x: number;
  y: number;
  sx: number;
  sy: number;
  dx: number;
  dy: number;
  endX: number;
  endY: number;
};

/**
 * Port of upstream `EBullet::Process`.
 * Role: Advances bullet movement until impact, then spawns particles and ricochet sound.
 * Upstream: ebullet.cpp:32-55
 */
export function processBulletEffect<TTime>(
  state: BulletProcessState<TTime>,
  currentTime: number,
  effectList: BulletUnitParticleSpawn<TTime>[] | null,
  soundCommands: BulletRestrictedSoundCommand[] | null,
  randomInt: (maxExclusive: number) => number,
): void {
  if (currentTime >= state.finalTime) {
    state.killme = true;

    const particleAmount = Math.trunc(randomInt(3)) % 3;
    for (let i = 0; i < particleAmount; i += 1) {
      effectList?.push({
        ztime: state.ztime,
        x: state.endX,
        y: state.endY,
      });
    }

    soundCommands?.push({
      sound: SoundEngineSound.RiochetSnd,
      x: state.endX,
      y: state.endY,
    });
    return;
  }

  state.x = state.sx + state.dx * (currentTime - state.initTime);
  state.y = state.sy + state.dy * (currentTime - state.initTime);
}
