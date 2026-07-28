/**
 * Upstream: ztime.h
 */
import { currentTime } from "./Common";

/**
 * Port of upstream `_ZTIME_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: ztime.h:2
 */
export const ZTIME_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `game_speed`.
 * Role: Stores the current simulation time speed multiplier.
 * Upstream: ztime.h:14
 */
export type SimulationTimeSpeedState = {
  gameSpeed: number;
};

/**
 * Port of upstream `paused`.
 * Role: Stores whether simulation time progression is paused.
 * Upstream: ztime.h:12
 */
export type SimulationTimePauseState = {
  paused: boolean;
};

export type SimulationCurrentTimeReader = () => number;

/**
 * Port of upstream `ZTime`.
 * Role: Tracks elapsed simulation time with pause and game-speed controls.
 * Upstream: ztime.h:4-23
 */
export class SimulationTime {
  ztime = 0;
  paused = false;
  gameSpeed = 1.0;
  lastChangeFrontTime = 0;
  lastChangeBackTime = 0;

  constructor(
    private readonly readCurrentTime: SimulationCurrentTimeReader = currentTime,
  ) {}

  /**
   * Port of upstream `ZTime::UpdateTime`.
   * Role: Advances visible simulation time while not paused.
   * Upstream: ztime.cpp:17-22
   */
  updateTime(): void {
    if (!this.paused) {
      this.ztime =
        this.lastChangeFrontTime +
        (this.readCurrentTime() - this.lastChangeBackTime) * this.gameSpeed;
    }
  }

  /**
   * Port of upstream `ZTime::Pause`.
   * Role: Freezes simulation time at the current scaled elapsed point.
   * Upstream: ztime.cpp:24-35
   */
  pause(): void {
    if (this.paused) {
      return;
    }

    this.paused = true;

    const theTime = this.readCurrentTime();
    this.lastChangeFrontTime =
      this.lastChangeFrontTime +
      (theTime - this.lastChangeBackTime) * this.gameSpeed;
    this.lastChangeBackTime = theTime;
  }

  /**
   * Port of upstream `ZTime::Resume`.
   * Role: Resumes simulation time progression from the current wall-clock sample.
   * Upstream: ztime.cpp:37-48
   */
  resume(): void {
    if (!this.paused) {
      return;
    }

    this.paused = false;

    const theTime = this.readCurrentTime();
    this.lastChangeBackTime = theTime;
  }

  /**
   * Port of upstream `ZTime::SetGameSpeed`.
   * Role: Updates simulation speed after preserving elapsed scaled time.
   * Upstream: ztime.cpp:50-62
   */
  setGameSpeed(newSpeed: number): void {
    let nextSpeed = newSpeed;
    if (nextSpeed < 0) {
      nextSpeed = 0;
    }

    if (!this.paused) {
      const theTime = this.readCurrentTime();
      this.lastChangeFrontTime =
        this.lastChangeFrontTime +
        (theTime - this.lastChangeBackTime) * this.gameSpeed;
      this.lastChangeBackTime = theTime;
    }

    this.gameSpeed = nextSpeed;
  }
}

/**
 * Port of upstream `IsPaused`.
 * Role: Returns whether simulation time progression is paused.
 * Upstream: ztime.h:12
 */
export function isSimulationPaused(
  state: SimulationTimePauseState,
): boolean {
  return state.paused;
}

/**
 * Port of upstream `GameSpeed`.
 * Role: Returns the current simulation time speed multiplier.
 * Upstream: ztime.h:14
 */
export function getSimulationGameSpeed(
  state: SimulationTimeSpeedState,
): number {
  return state.gameSpeed;
}
