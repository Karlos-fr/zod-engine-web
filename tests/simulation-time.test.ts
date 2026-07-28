import { describe, expect, it } from "vitest";
import {
  getSimulationGameSpeed,
  isSimulationPaused,
  ZTIME_HEADER_GUARD_PORTED,
} from "../src/simulation/SimulationTime";
import type {
  SimulationTimePauseState,
  SimulationTimeSpeedState,
} from "../src/simulation/SimulationTime";

describe("simulation time", () => {
  it("adapts the ztime.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/SimulationTime");
    const secondImport = await import("../src/simulation/SimulationTime");

    expect(ZTIME_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZTIME_HEADER_GUARD_PORTED).toBe(
      firstImport.ZTIME_HEADER_GUARD_PORTED,
    );
  });

  it("ports the GameSpeed getter", () => {
    const state: SimulationTimeSpeedState = { gameSpeed: 1.25 };

    expect(getSimulationGameSpeed(state)).toBe(1.25);
  });

  it("ports the IsPaused getter", () => {
    const pausedState: SimulationTimePauseState = { paused: true };
    const runningState: SimulationTimePauseState = { paused: false };

    expect(isSimulationPaused(pausedState)).toBe(true);
    expect(isSimulationPaused(runningState)).toBe(false);
  });
});
