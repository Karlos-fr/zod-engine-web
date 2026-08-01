/**
 * Upstream: eunitparticle.h
 */

/**
 * Port of upstream `_EUNITPARTICLE_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: eunitparticle.h:2
 */
export const EUNIT_PARTICLE_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `EUnitParticle` sprite frame count.
 * Role: Defines how many unit-particle frames are loaded during initialization.
 * Upstream: eunitparticle.cpp:48-52
 */
export const UNIT_PARTICLE_FRAME_COUNT = 20;

/**
 * Port of upstream `EUnitParticle` image state.
 * Role: Stores loaded unit-particle frame asset paths.
 * Upstream: eunitparticle.cpp:43-53
 */
export type UnitParticleInitState = {
  baseImages: string[];
};

/**
 * Port of upstream `EUnitParticle::Process` mutable fields.
 * Role: Tracks unit-particle animation, lifetime, and ballistic motion.
 * Upstream: eunitparticle.cpp:55-88
 */
export type UnitParticleProcessState = {
  killme: boolean;
  ztime: { ztime: number } | null;
  initTime: number;
  finalTime: number;
  nextProcessTime: number;
  renderIndex: number;
  x: number;
  y: number;
  startX: number;
  startY: number;
  deltaX: number;
  deltaY: number;
  rise: number;
  size: number;
};

/**
 * Port of upstream `EUnitParticle::Init`.
 * Role: Initializes unit-particle frame asset paths.
 * Upstream: eunitparticle.cpp:43-53
 */
export function initUnitParticleEffect(state: UnitParticleInitState): void {
  state.baseImages = Array.from(
    { length: UNIT_PARTICLE_FRAME_COUNT },
    (_value, index) =>
      `assets/other/particles/unit_particle_n${index.toString().padStart(2, "0")}.png`,
  );
}

/**
 * Port of upstream `EUnitParticle::Process`.
 * Role: Advances unit-particle animation, lifetime, and ballistic position.
 * Upstream: eunitparticle.cpp:55-88
 */
export function processUnitParticleEffect(
  state: UnitParticleProcessState,
): void {
  const currentTime = state.ztime?.ztime ?? 0;

  if (state.killme) return;

  if (currentTime >= state.finalTime) {
    state.killme = true;
    return;
  }

  if (currentTime >= state.nextProcessTime) {
    state.renderIndex += 1;
    if (state.renderIndex >= UNIT_PARTICLE_FRAME_COUNT) state.renderIndex = 0;

    state.nextProcessTime = currentTime + 0.03;
  }

  const timeDifference = currentTime - state.initTime;

  state.x = state.startX + state.deltaX * timeDifference;
  state.y = state.startY + state.deltaY * timeDifference;
  state.size =
    -(state.rise / (state.finalTime - state.initTime)) *
      (timeDifference * timeDifference) +
    state.rise * timeDifference;
  state.size += 1;
  state.y -= (state.size - 1) * 65;
  state.size = 1;
}
