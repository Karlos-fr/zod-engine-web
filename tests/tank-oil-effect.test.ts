import { describe, expect, it } from "vitest";
import {
  doPreRenderTankOilEffect,
  ETANK_OIL_HEADER_GUARD_PORTED,
  initTankOilEffect,
  processTankOilEffect,
  TANK_OIL_FRAME_COUNT,
  TANK_OIL_LIFETIME_SECONDS,
  TANK_OIL_RANDOM_DELAY_STEP_SECONDS,
  TANK_OIL_VARIANT_COUNT,
  type TankOilInitState,
  type TankOilPreRenderState,
  type TankOilProcessState,
} from "../src/simulation/TankOilEffect";

describe("tank oil effect", () => {
  it("adapts the etankoil.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/TankOilEffect");
    const secondImport = await import("../src/simulation/TankOilEffect");

    expect(ETANK_OIL_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ETANK_OIL_HEADER_GUARD_PORTED).toBe(
      firstImport.ETANK_OIL_HEADER_GUARD_PORTED,
    );
  });

  it("ports ETANKOIL_TIME as the tank oil lifetime", () => {
    expect(TANK_OIL_LIFETIME_SECONDS).toBe(3.0);
  });

  it("ports ETankOil Init as a 3x3 tank-oil frame path matrix", () => {
    const state: TankOilInitState = {
      tankOilFrames: [],
      finishedInit: false,
    };

    initTankOilEffect(state);

    expect(state.finishedInit).toBe(true);
    expect(state.tankOilFrames).toHaveLength(TANK_OIL_VARIANT_COUNT);
    expect(state.tankOilFrames[0]).toHaveLength(TANK_OIL_FRAME_COUNT);
    expect(state.tankOilFrames).toEqual([
      [
        "assets/units/vehicles/tank_oil_0_n00.png",
        "assets/units/vehicles/tank_oil_0_n01.png",
        "assets/units/vehicles/tank_oil_0_n02.png",
      ],
      [
        "assets/units/vehicles/tank_oil_1_n00.png",
        "assets/units/vehicles/tank_oil_1_n01.png",
        "assets/units/vehicles/tank_oil_1_n02.png",
      ],
      [
        "assets/units/vehicles/tank_oil_2_n00.png",
        "assets/units/vehicles/tank_oil_2_n01.png",
        "assets/units/vehicles/tank_oil_2_n02.png",
      ],
    ]);
  });

  it("leaves already killed tank-oil effects unchanged", () => {
    const state: TankOilProcessState = {
      killMe: true,
      frameIndex: 1,
      nextFrameTime: 10,
    };

    processTankOilEffect(state, 12, () => {
      throw new Error("randomInt should not be called");
    });

    expect(state).toEqual({
      killMe: true,
      frameIndex: 1,
      nextFrameTime: 10,
    });
  });

  it("does not advance before the next frame time", () => {
    const state: TankOilProcessState = {
      killMe: false,
      frameIndex: 1,
      nextFrameTime: 10,
    };

    processTankOilEffect(state, 9.99, () => {
      throw new Error("randomInt should not be called");
    });

    expect(state).toEqual({
      killMe: false,
      frameIndex: 1,
      nextFrameTime: 10,
    });
  });

  it("advances a frame and schedules the upstream randomized delay", () => {
    const randomMaxValues: number[] = [];
    const state: TankOilProcessState = {
      killMe: false,
      frameIndex: 0,
      nextFrameTime: 10,
    };

    processTankOilEffect(state, 10, (maxExclusive) => {
      randomMaxValues.push(maxExclusive);
      return 7;
    });

    expect(randomMaxValues).toEqual([10]);
    expect(state).toEqual({
      killMe: false,
      frameIndex: 1,
      nextFrameTime:
        10 + TANK_OIL_LIFETIME_SECONDS + 7 * TANK_OIL_RANDOM_DELAY_STEP_SECONDS,
    });
  });

  it("expires and resets the frame index after the last frame", () => {
    const state: TankOilProcessState = {
      killMe: false,
      frameIndex: TANK_OIL_FRAME_COUNT - 1,
      nextFrameTime: 10,
    };

    processTankOilEffect(state, 10, () => 0);

    expect(state).toEqual({
      killMe: true,
      frameIndex: 0,
      nextFrameTime: 10 + TANK_OIL_LIFETIME_SECONDS,
    });
  });

  it("replaces ETankOil DoPreRender as no command for killed effects", () => {
    const state: TankOilPreRenderState<string> = {
      killMe: true,
      tankOilFrames: [["oil"]],
      oilIndex: 0,
      frameIndex: 0,
      centerX: 12,
      centerY: 14,
    };

    const command = doPreRenderTankOilEffect(state, {
      renderZSurface: () => {
        throw new Error("renderZSurface should not be called");
      },
    });

    expect(command).toBeNull();
  });

  it("replaces ETankOil DoPreRender as no command when the frame is missing", () => {
    const state: TankOilPreRenderState<string> = {
      killMe: false,
      tankOilFrames: [[]],
      oilIndex: 0,
      frameIndex: 2,
      centerX: 12,
      centerY: 14,
    };

    const command = doPreRenderTankOilEffect(state, {
      renderZSurface: () => {
        throw new Error("renderZSurface should not be called");
      },
    });

    expect(command).toBeNull();
  });

  it("replaces ETankOil DoPreRender as a centered map surface command", () => {
    const calls: unknown[] = [];
    const state: TankOilPreRenderState<string> = {
      killMe: false,
      tankOilFrames: [
        ["oil-0-0", "oil-0-1"],
        ["oil-1-0", "oil-1-1"],
      ],
      oilIndex: 1,
      frameIndex: 1,
      centerX: 32,
      centerY: 48,
    };

    const command = doPreRenderTankOilEffect(state, {
      renderZSurface: (surface, x, y, renderHit, aboutCenter) => {
        calls.push([surface, x, y, renderHit, aboutCenter]);
        return { surface, x: x - 2, y: y - 3, renderHit, aboutCenter };
      },
    });

    expect(calls).toEqual([["oil-1-1", 32, 48, false, true]]);
    expect(command).toEqual({
      surface: "oil-1-1",
      x: 30,
      y: 45,
      renderHit: false,
      aboutCenter: true,
    });
  });
});
