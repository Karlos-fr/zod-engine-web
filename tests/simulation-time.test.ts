import { describe, expect, it } from "vitest";
import {
  getSimulationGameSpeed,
  isSimulationPaused,
  SimulationTime,
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

  it("ports ZTime construction as initial simulation time state", () => {
    expect(new SimulationTime()).toMatchObject({
      ztime: 0,
      paused: false,
      gameSpeed: 1.0,
      lastChangeFrontTime: 0,
      lastChangeBackTime: 0,
    });
  });

  it("ports ZTime::UpdateTime as scaled elapsed-time update while running", () => {
    const clock = [2, 4];
    const time = new SimulationTime(() => clock.shift() ?? 0);
    time.gameSpeed = 1.5;

    time.updateTime();
    expect(time.ztime).toBe(3);

    time.paused = true;
    time.updateTime();
    expect(time.ztime).toBe(3);
  });

  it("ports ZTime::Pause as idempotent front-time freeze", () => {
    const clock = [5, 9];
    const time = new SimulationTime(() => clock.shift() ?? 0);
    time.lastChangeFrontTime = 10;
    time.lastChangeBackTime = 2;
    time.gameSpeed = 2;

    time.pause();

    expect(time).toMatchObject({
      paused: true,
      lastChangeFrontTime: 16,
      lastChangeBackTime: 5,
    });

    time.pause();
    expect(time.lastChangeBackTime).toBe(5);
  });

  it("ports ZTime::Resume as idempotent back-time reset", () => {
    const clock = [8, 12];
    const time = new SimulationTime(() => clock.shift() ?? 0);
    time.paused = true;

    time.resume();

    expect(time).toMatchObject({
      paused: false,
      lastChangeBackTime: 8,
    });

    time.resume();
    expect(time.lastChangeBackTime).toBe(8);
  });

  it("ports ZTime::SetGameSpeed as elapsed-time preservation and clamping", () => {
    const clock = [5, 9];
    const time = new SimulationTime(() => clock.shift() ?? 0);
    time.lastChangeFrontTime = 1;
    time.lastChangeBackTime = 2;
    time.gameSpeed = 3;

    time.setGameSpeed(0.5);

    expect(time).toMatchObject({
      gameSpeed: 0.5,
      lastChangeFrontTime: 10,
      lastChangeBackTime: 5,
    });

    time.paused = true;
    time.setGameSpeed(-2);

    expect(time).toMatchObject({
      gameSpeed: 0,
      lastChangeFrontTime: 10,
      lastChangeBackTime: 5,
    });
  });
});
