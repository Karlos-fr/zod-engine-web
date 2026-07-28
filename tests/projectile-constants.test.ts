import { describe, expect, it } from "vitest";
import {
  BULLET_SPEED,
  calcDamageMissileExplodeTimeTo,
  calcMissileCannonRocketTimeD,
  calcMissileCannonRocketTimeD2,
  calcMobileMissileRocketTimeD,
  calcMobileMissileRocketTimeD2,
  EBULLET_HEADER_GUARD_PORTED,
  EFLAME_HEADER_GUARD_PORTED,
  ELASER_HEADER_GUARD_PORTED,
  FLAME_PROJECTILE_SPEED,
  LASER_PROJECTILE_SPEED,
  resolveMissileCannonRocketSpeed,
  resolveMobileMissileRocketSpeed,
  ZDAMAGE_MISSILE_HEADER_GUARD_PORTED,
} from "../src/simulation/ProjectileConstants";
import type { DamageMissileTimingState } from "../src/simulation/ProjectileConstants";

describe("projectile constants", () => {
  it("adapts the ebullet.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/ProjectileConstants");
    const secondImport = await import("../src/simulation/ProjectileConstants");

    expect(EBULLET_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.EBULLET_HEADER_GUARD_PORTED).toBe(
      firstImport.EBULLET_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the eflame.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/ProjectileConstants");
    const secondImport = await import("../src/simulation/ProjectileConstants");

    expect(EFLAME_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.EFLAME_HEADER_GUARD_PORTED).toBe(
      firstImport.EFLAME_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the elaser.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/ProjectileConstants");
    const secondImport = await import("../src/simulation/ProjectileConstants");

    expect(ELASER_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ELASER_HEADER_GUARD_PORTED).toBe(
      firstImport.ELASER_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the zdamagemissile.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/ProjectileConstants");
    const secondImport = await import("../src/simulation/ProjectileConstants");

    expect(ZDAMAGE_MISSILE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZDAMAGE_MISSILE_HEADER_GUARD_PORTED).toBe(
      firstImport.ZDAMAGE_MISSILE_HEADER_GUARD_PORTED,
    );
  });

  it("ports bullet_speed as the bullet projectile speed", () => {
    expect(BULLET_SPEED).toBe(300);
  });

  it("ports eflame.cpp bullet_speed as the flame projectile speed", () => {
    expect(FLAME_PROJECTILE_SPEED).toBe(300);
  });

  it("ports elaser.cpp bullet_speed as the laser projectile speed", () => {
    expect(LASER_PROJECTILE_SPEED).toBe(300);
  });

  it("ports damage missile explosion time calculation", () => {
    const state: DamageMissileTimingState = {
      x: 13,
      y: 24,
      explodeTime: 0,
    };

    calcDamageMissileExplodeTimeTo(state, 10, 20, 5, 8);

    expect(state.explodeTime).toBe(9);
  });

  it("ports emissilecrockets.cpp bullet_speed as the missile cannon rocket settings speed", () => {
    expect(
      resolveMissileCannonRocketSpeed(
        {
          cannonSettings: [
            { attackMissileSpeed: 120 },
            { attackMissileSpeed: 425 },
          ],
        },
        1,
      ),
    ).toBe(425);
  });

  it("rejects a missing missile cannon settings entry", () => {
    expect(() =>
      resolveMissileCannonRocketSpeed(
        {
          cannonSettings: [],
        },
        0,
      ),
    ).toThrow(RangeError);
  });

  it("ports emissilecrockets.cpp timing thresholds from missile speed", () => {
    expect(calcMissileCannonRocketTimeD(300)).toBe(0.02);
    expect(calcMissileCannonRocketTimeD2(300)).toBeCloseTo(0.0266666667);
  });

  it("ports emomissilerockets.cpp bullet_speed as the mobile missile launcher settings speed", () => {
    expect(
      resolveMobileMissileRocketSpeed(
        {
          vehicleSettings: [
            { attackMissileSpeed: 90 },
            { attackMissileSpeed: 360 },
          ],
        },
        1,
      ),
    ).toBe(360);
  });

  it("rejects a missing mobile missile launcher settings entry", () => {
    expect(() =>
      resolveMobileMissileRocketSpeed(
        {
          vehicleSettings: [],
        },
        0,
      ),
    ).toThrow(RangeError);
  });

  it("ports emomissilerockets.cpp timing thresholds from missile speed", () => {
    expect(calcMobileMissileRocketTimeD(400)).toBe(0.015);
    expect(calcMobileMissileRocketTimeD2(400)).toBe(0.02);
  });
});
