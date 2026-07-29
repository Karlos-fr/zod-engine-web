import { describe, expect, it } from "vitest";
import {
  ETANK_SPARK_HEADER_GUARD_PORTED,
  initTankSparkEffect,
  processTankSparkEffect,
  TANK_SPARK_FRAME_COUNT,
  TANK_SPARK_FRAME_INTERVAL_SECONDS,
  type TankSparkInitState,
  type TankSparkProcessState,
} from "../src/simulation/TankSparkEffect";

describe("tank spark effect", () => {
  it("adapts the etankspark.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/TankSparkEffect");
    const secondImport = await import("../src/simulation/TankSparkEffect");

    expect(ETANK_SPARK_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ETANK_SPARK_HEADER_GUARD_PORTED).toBe(
      firstImport.ETANK_SPARK_HEADER_GUARD_PORTED,
    );
  });

  it("ports ETANKSPARK_TIME as the tank spark frame interval", () => {
    expect(TANK_SPARK_FRAME_INTERVAL_SECONDS).toBe(0.1);
  });

  it("ports ETankSpark Init as ground-spark frame path initialization", () => {
    const state: TankSparkInitState = {
      tankSparkFrames: [],
      finishedInit: false,
    };

    initTankSparkEffect(state);

    expect(state.finishedInit).toBe(true);
    expect(state.tankSparkFrames).toHaveLength(TANK_SPARK_FRAME_COUNT);
    expect(state.tankSparkFrames).toEqual([
      "assets/units/vehicles/ground_spark_n00.png",
      "assets/units/vehicles/ground_spark_n01.png",
      "assets/units/vehicles/ground_spark_n02.png",
      "assets/units/vehicles/ground_spark_n03.png",
      "assets/units/vehicles/ground_spark_n04.png",
      "assets/units/vehicles/ground_spark_n05.png",
    ]);
  });

  it("keeps killed tank spark effects unchanged while processing", () => {
    const state: TankSparkProcessState = {
      killMe: true,
      frameIndex: 2,
      frameIteration: 3,
      maxFrameIterations: 5,
      nextFrameTime: 10,
    };

    processTankSparkEffect(state, 10);

    expect(state).toEqual({
      killMe: true,
      frameIndex: 2,
      frameIteration: 3,
      maxFrameIterations: 5,
      nextFrameTime: 10,
    });
  });

  it("keeps tank spark unchanged before the next frame time", () => {
    const state: TankSparkProcessState = {
      killMe: false,
      frameIndex: 2,
      frameIteration: 3,
      maxFrameIterations: 5,
      nextFrameTime: 10,
    };

    processTankSparkEffect(state, 9.99);

    expect(state.frameIndex).toBe(2);
    expect(state.frameIteration).toBe(3);
    expect(state.nextFrameTime).toBe(10);
    expect(state.killMe).toBe(false);
  });

  it("advances tank spark frame and schedules the next frame time", () => {
    const state: TankSparkProcessState = {
      killMe: false,
      frameIndex: 2,
      frameIteration: 3,
      maxFrameIterations: 6,
      nextFrameTime: 10,
    };

    processTankSparkEffect(state, 10);

    expect(state.frameIndex).toBe(3);
    expect(state.frameIteration).toBe(4);
    expect(state.nextFrameTime).toBe(
      10 + TANK_SPARK_FRAME_INTERVAL_SECONDS,
    );
    expect(state.killMe).toBe(false);
  });

  it("wraps the tank spark frame index after the sixth frame", () => {
    const state: TankSparkProcessState = {
      killMe: false,
      frameIndex: TANK_SPARK_FRAME_COUNT - 1,
      frameIteration: 0,
      maxFrameIterations: 5,
      nextFrameTime: 10,
    };

    processTankSparkEffect(state, 10);

    expect(state.frameIndex).toBe(0);
    expect(state.frameIteration).toBe(1);
  });

  it("expires tank spark after reaching the iteration cap", () => {
    const state: TankSparkProcessState = {
      killMe: false,
      frameIndex: 0,
      frameIteration: 4,
      maxFrameIterations: 5,
      nextFrameTime: 10,
    };

    processTankSparkEffect(state, 10);

    expect(state.frameIteration).toBe(5);
    expect(state.killMe).toBe(true);
  });
});
