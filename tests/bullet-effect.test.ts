import { describe, expect, it } from "vitest";
import { SoundEngineSound } from "../src/audio/AudioService";
import {
  type BulletProcessState,
  type BulletRestrictedSoundCommand,
  type BulletUnitParticleSpawn,
  processBulletEffect,
} from "../src/simulation/BulletEffect";

describe("bullet effect", () => {
  it("ports EBullet Process as linear movement before final time", () => {
    const state = createBulletProcessState({
      initTime: 10,
      finalTime: 20,
      sx: 20,
      sy: 30,
      dx: 4,
      dy: -2,
    });
    const effects: BulletUnitParticleSpawn<typeof state.ztime>[] = [];
    const sounds: BulletRestrictedSoundCommand[] = [];

    processBulletEffect(state, 12.5, effects, sounds, () => 2);

    expect(state.killme).toBe(false);
    expect(state.x).toBe(30);
    expect(state.y).toBe(25);
    expect(effects).toEqual([]);
    expect(sounds).toEqual([]);
  });

  it("ports EBullet Process as impact particles and ricochet sound", () => {
    const state = createBulletProcessState({
      finalTime: 20,
      endX: 70,
      endY: 80,
    });
    const effects: BulletUnitParticleSpawn<typeof state.ztime>[] = [];
    const sounds: BulletRestrictedSoundCommand[] = [];

    processBulletEffect(state, 20, effects, sounds, () => 2);

    expect(state.killme).toBe(true);
    expect(effects).toEqual([
      { ztime: state.ztime, x: 70, y: 80 },
      { ztime: state.ztime, x: 70, y: 80 },
    ]);
    expect(sounds).toEqual([
      { sound: SoundEngineSound.RiochetSnd, x: 70, y: 80 },
    ]);
  });

  it("ports EBullet Process impact as optional effect and sound sinks", () => {
    const state = createBulletProcessState();

    processBulletEffect(state, 20, null, null, () => 1);

    expect(state.killme).toBe(true);
  });
});

function createBulletProcessState(
  overrides: Partial<BulletProcessState<{ ztime: number }>> = {},
): BulletProcessState<{ ztime: number }> {
  return {
    killme: false,
    ztime: { ztime: 12 },
    finalTime: 20,
    initTime: 10,
    x: 3,
    y: 4,
    sx: 0,
    sy: 0,
    dx: 1,
    dy: 1,
    endX: 50,
    endY: 60,
    ...overrides,
  };
}
