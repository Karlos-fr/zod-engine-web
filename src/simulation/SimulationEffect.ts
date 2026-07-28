/**
 * Upstream: zeffect.h
 */

/**
 * Port of upstream `_ZEFFECT_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: zeffect.h:2
 */
export const ZEFFECT_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `effect_flags`.
 * Role: Carries extra effect requests emitted during effect processing.
 * Upstream: zeffect.h:16-32
 */
export class EffectFlags {
  unitParticles = false;
  unitParticlesRadius = 0;
  unitParticlesAmount = 0;
  x = 0;
  y = 0;

  constructor() {
    this.clear();
  }

  /**
   * Port of upstream `effect_flags::Clear`.
   * Role: Resets unit-particle effect flags and leaves coordinates untouched.
   * Upstream: zeffect.h:26-31
   */
  clear(): void {
    this.unitParticles = false;
    this.unitParticlesRadius = 0;
    this.unitParticlesAmount = 0;
  }
}
