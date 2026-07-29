import { describe, expect, it } from "vitest";
import {
  ETANK_SMOKE_HEADER_GUARD_PORTED,
  processTankSmokeEffect,
  TANK_SMOKE_FRAME_COUNT,
  TANK_SMOKE_FRAME_INTERVAL_SECONDS,
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
});
