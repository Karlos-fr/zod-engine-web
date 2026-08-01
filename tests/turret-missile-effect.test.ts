import { describe, expect, it } from "vitest";
import {
  ETURRET_MISSILE_HEADER_GUARD_PORTED,
  TurretMissileEffectType,
  type TurretMissileEffectSpawn,
} from "../src/simulation/TurretMissileEffect";

describe("turret missile effect", () => {
  it("adapts the eturrentmissile.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/TurretMissileEffect");
    const secondImport = await import("../src/simulation/TurretMissileEffect");

    expect(ETURRET_MISSILE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ETURRET_MISSILE_HEADER_GUARD_PORTED).toBe(
      firstImport.ETURRET_MISSILE_HEADER_GUARD_PORTED,
    );
  });

  it("ports eturrent_missile as turret missile effect identifiers", () => {
    expect(TurretMissileEffectType.Light).toBe(0);
    expect(TurretMissileEffectType.Medium).toBe(1);
    expect(TurretMissileEffectType.Heavy).toBe(2);
    expect(TurretMissileEffectType.Gatling).toBe(3);
    expect(TurretMissileEffectType.Gun).toBe(4);
    expect(TurretMissileEffectType.Howitzer).toBe(5);
    expect(TurretMissileEffectType.MissileCannon).toBe(6);
    expect(TurretMissileEffectType.BuildingPiece0).toBe(7);
    expect(TurretMissileEffectType.BuildingPiece1).toBe(8);
    expect(TurretMissileEffectType.FortBuildingPiece0).toBe(9);
    expect(TurretMissileEffectType.FortBuildingPiece1).toBe(10);
    expect(TurretMissileEffectType.FortBuildingPiece2).toBe(11);
    expect(TurretMissileEffectType.FortBuildingPiece3).toBe(12);
    expect(TurretMissileEffectType.FortBuildingPiece4).toBe(13);
    expect(TurretMissileEffectType.Grenade).toBe(14);
  });

  it("ports ETurrentMissile spawn descriptors as browser effect data", () => {
    const spawn: TurretMissileEffectSpawn<{ now: number }> = {
      ztime: { now: 12 },
      startX: 20,
      startY: 30,
      targetX: 100,
      targetY: 120,
      offsetTime: 3.5,
      type: TurretMissileEffectType.Heavy,
      owner: 2,
    };

    expect(spawn).toEqual({
      ztime: { now: 12 },
      startX: 20,
      startY: 30,
      targetX: 100,
      targetY: 120,
      offsetTime: 3.5,
      type: TurretMissileEffectType.Heavy,
      owner: 2,
    });
  });
});
