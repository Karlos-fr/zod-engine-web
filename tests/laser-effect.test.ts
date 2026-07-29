import { describe, expect, it } from "vitest";
import {
  initLaserEffect,
  LASER_BULLET_FRAME_COUNT,
  type LaserInitState,
  type LaserProcessState,
  processLaserEffect,
} from "../src/simulation/LaserEffect";

describe("laser effect", () => {
  it("ports ELaser Init as laser bullet frame path initialization", () => {
    const state: LaserInitState = {
      laserBulletFrames: [],
      finishedInit: false,
    };

    initLaserEffect(state);

    expect(state.finishedInit).toBe(true);
    expect(state.laserBulletFrames).toHaveLength(LASER_BULLET_FRAME_COUNT);
    expect(state.laserBulletFrames).toEqual([
      "assets/units/robots/laser/bullet_n00.png",
      "assets/units/robots/laser/bullet_n01.png",
    ]);
  });

  it("ports ELaser Process as linear movement before final time", () => {
    const state: LaserProcessState = {
      killMe: false,
      finalTime: 15,
      initTime: 10,
      x: 0,
      y: 0,
      sx: 20,
      sy: 30,
      dx: 4,
      dy: -2,
    };

    processLaserEffect(state, 12.5);

    expect(state.killMe).toBe(false);
    expect(state.x).toBe(30);
    expect(state.y).toBe(25);
  });

  it("ports ELaser Process as kill flag when final time is reached", () => {
    const state: LaserProcessState = {
      killMe: false,
      finalTime: 15,
      initTime: 10,
      x: 3,
      y: 4,
      sx: 20,
      sy: 30,
      dx: 4,
      dy: -2,
    };

    processLaserEffect(state, 15);

    expect(state.killMe).toBe(true);
    expect(state.x).toBe(3);
    expect(state.y).toBe(4);
  });
});
