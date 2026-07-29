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
