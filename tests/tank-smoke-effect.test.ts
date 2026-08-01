import { describe, expect, it } from "vitest";
import {
  ETANK_SMOKE_HEADER_GUARD_PORTED,
  doPreRenderTankSmokeEffect,
  initTankSmokeEffect,
  processTankSmokeEffect,
  TANK_SMOKE_FRAME_COUNT,
  TANK_SMOKE_FRAME_INTERVAL_SECONDS,
  TANK_SMOKE_SPARK_FRAME_COUNT,
  type TankSmokeInitState,
  type TankSmokePreRenderState,
  type TankSmokeProcessState,
} from "../src/simulation/TankSmokeEffect";

describe("tank smoke effect", () => {
  it("adapts the etanksmoke.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/TankSmokeEffect");
    const secondImport = await import("../src/simulation/TankSmokeEffect");

    expect(ETANK_SMOKE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ETANK_SMOKE_HEADER_GUARD_PORTED).toBe(
      firstImport.ETANK_SMOKE_HEADER_GUARD_PORTED,
    );
  });

  it("ports ETANKSMOKE_TIME as the tank smoke frame interval", () => {
    expect(TANK_SMOKE_FRAME_INTERVAL_SECONDS).toBe(0.15);
  });

  it("ports ETankSmoke Init as smoke and spark image loading", () => {
    const state: TankSmokeInitState<{ filename: string }> = {
      tankSmoke: [[{ filename: "old-smoke" }]],
      tankSpark: [[{ filename: "old-spark" }]],
      finishedInit: false,
    };
    const filenames: string[] = [];

    initTankSmokeEffect(state, (filename) => {
      filenames.push(filename);
      return { filename };
    });

    expect(state.finishedInit).toBe(true);
    expect(state.tankSmoke).toHaveLength(8);
    expect(state.tankSpark).toHaveLength(8);
    expect(state.tankSmoke[0]).toHaveLength(TANK_SMOKE_FRAME_COUNT);
    expect(state.tankSpark[0]).toHaveLength(TANK_SMOKE_SPARK_FRAME_COUNT);
    expect(state.tankSmoke[0][0]).toEqual({
      filename: "assets/units/vehicles/track_dust_r000_n00.png",
    });
    expect(state.tankSmoke[7][6]).toEqual({
      filename: "assets/units/vehicles/track_dust_r315_n06.png",
    });
    expect(state.tankSpark[0][0]).toEqual({
      filename: "assets/units/vehicles/track_spark_r000_n00.png",
    });
    expect(state.tankSpark[7][3]).toEqual({
      filename: "assets/units/vehicles/track_spark_r315_n03.png",
    });
    expect(filenames).toHaveLength(8 * 7 + 8 * 4);
  });

  it("keeps killed tank smoke effects unchanged", () => {
    const state: TankSmokeProcessState = {
      killMe: true,
      frameIndex: 2,
      nextFrameTime: 10,
    };

    processTankSmokeEffect(state, 12);

    expect(state).toEqual({
      killMe: true,
      frameIndex: 2,
      nextFrameTime: 10,
    });
  });

  it("does not advance before the next frame time", () => {
    const state: TankSmokeProcessState = {
      killMe: false,
      frameIndex: 2,
      nextFrameTime: 10,
    };

    processTankSmokeEffect(state, 9.99);

    expect(state).toEqual({
      killMe: false,
      frameIndex: 2,
      nextFrameTime: 10,
    });
  });

  it("advances at the next frame time and schedules the next tick", () => {
    const state: TankSmokeProcessState = {
      killMe: false,
      frameIndex: 2,
      nextFrameTime: 10,
    };

    processTankSmokeEffect(state, 10);

    expect(state).toEqual({
      killMe: false,
      frameIndex: 3,
      nextFrameTime: 10 + TANK_SMOKE_FRAME_INTERVAL_SECONDS,
    });
  });

  it("expires after the last smoke frame", () => {
    const state: TankSmokeProcessState = {
      killMe: false,
      frameIndex: TANK_SMOKE_FRAME_COUNT - 1,
      nextFrameTime: 10,
    };

    processTankSmokeEffect(state, 10);

    expect(state).toEqual({
      killMe: true,
      frameIndex: 0,
      nextFrameTime: 10 + TANK_SMOKE_FRAME_INTERVAL_SECONDS,
    });
  });

  it("replaces ETankSmoke DoPreRender as no command for killed effects", () => {
    const state: TankSmokePreRenderState<string> = {
      killMe: true,
      doSpark: true,
      frameIndex: 0,
      direction: 0,
      x: 12,
      y: 14,
      tankSmoke: [["smoke"]],
      tankSpark: [["spark"]],
    };

    const command = doPreRenderTankSmokeEffect(state, {
      renderZSurface: () => {
        throw new Error("renderZSurface should not be called");
      },
    });

    expect(command).toBeNull();
  });

  it("replaces ETankSmoke DoPreRender as no command when the frame is missing", () => {
    const state: TankSmokePreRenderState<string> = {
      killMe: false,
      doSpark: false,
      frameIndex: 2,
      direction: 0,
      x: 12,
      y: 14,
      tankSmoke: [[]],
      tankSpark: [[]],
    };

    const command = doPreRenderTankSmokeEffect(state, {
      renderZSurface: () => {
        throw new Error("renderZSurface should not be called");
      },
    });

    expect(command).toBeNull();
  });

  it("replaces ETankSmoke DoPreRender as a spark map surface command", () => {
    const calls: unknown[] = [];
    const state: TankSmokePreRenderState<string> = {
      killMe: false,
      doSpark: true,
      frameIndex: 3,
      direction: 1,
      x: 32,
      y: 48,
      tankSmoke: [["smoke-0"], ["smoke-1"]],
      tankSpark: [["spark-0"], ["spark-1-0", "spark-1-1", "spark-1-2", "spark-1-3"]],
    };

    const command = doPreRenderTankSmokeEffect(state, {
      renderZSurface: (surface, x, y, renderHit, aboutCenter) => {
        calls.push([surface, x, y, renderHit, aboutCenter]);
        return { surface, x: x - 2, y: y - 3, renderHit, aboutCenter };
      },
    });

    expect(calls).toEqual([["spark-1-3", 32, 48, false, false]]);
    expect(command).toEqual({
      surface: "spark-1-3",
      x: 30,
      y: 45,
      renderHit: false,
      aboutCenter: false,
    });
  });

  it("replaces ETankSmoke DoPreRender by using smoke after spark frames", () => {
    const state: TankSmokePreRenderState<string> = {
      killMe: false,
      doSpark: true,
      frameIndex: TANK_SMOKE_SPARK_FRAME_COUNT,
      direction: 0,
      x: 32,
      y: 48,
      tankSmoke: [["smoke-0", "smoke-1", "smoke-2", "smoke-3", "smoke-4"]],
      tankSpark: [["spark-0", "spark-1", "spark-2", "spark-3"]],
    };

    const command = doPreRenderTankSmokeEffect(state, {
      renderZSurface: (surface, x, y, renderHit, aboutCenter) => ({
        surface,
        x,
        y,
        renderHit,
        aboutCenter,
      }),
    });

    expect(command).toEqual({
      surface: "smoke-4",
      x: 32,
      y: 48,
      renderHit: false,
      aboutCenter: false,
    });
  });
});
