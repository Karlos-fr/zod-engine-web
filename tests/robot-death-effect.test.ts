import { describe, expect, it } from "vitest";
import {
  EROBOT_DEATH_HEADER_GUARD_PORTED,
  processRobotDeathEffect,
  ROBOT_DEATH_PROCESS_INTERVAL_SECONDS,
  type RobotDeathProcessState,
} from "../src/simulation/RobotDeathEffect";

describe("robot death effect", () => {
  it("adapts the erobotdeath.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/RobotDeathEffect");
    const secondImport = await import("../src/simulation/RobotDeathEffect");

    expect(EROBOT_DEATH_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.EROBOT_DEATH_HEADER_GUARD_PORTED).toBe(
      firstImport.EROBOT_DEATH_HEADER_GUARD_PORTED,
    );
  });

  it("keeps killed robot death effects unchanged while processing", () => {
    const state: RobotDeathProcessState = {
      killMe: true,
      renderIndex: 2,
      maxRenderIndex: 5,
      nextProcessTime: 10,
    };

    processRobotDeathEffect(state, 10);

    expect(state).toEqual({
      killMe: true,
      renderIndex: 2,
      maxRenderIndex: 5,
      nextProcessTime: 10,
    });
  });

  it("keeps robot death unchanged before the next process time", () => {
    const state: RobotDeathProcessState = {
      killMe: false,
      renderIndex: 2,
      maxRenderIndex: 5,
      nextProcessTime: 10,
    };

    processRobotDeathEffect(state, 9.99);

    expect(state.renderIndex).toBe(2);
    expect(state.nextProcessTime).toBe(10);
    expect(state.killMe).toBe(false);
  });

  it("advances robot death frame and schedules the next process time", () => {
    const state: RobotDeathProcessState = {
      killMe: false,
      renderIndex: 2,
      maxRenderIndex: 5,
      nextProcessTime: 10,
    };

    processRobotDeathEffect(state, 10);

    expect(state.renderIndex).toBe(3);
    expect(state.nextProcessTime).toBe(
      10 + ROBOT_DEATH_PROCESS_INTERVAL_SECONDS,
    );
    expect(state.killMe).toBe(false);
  });

  it("expires robot death after reaching the render limit", () => {
    const state: RobotDeathProcessState = {
      killMe: false,
      renderIndex: 4,
      maxRenderIndex: 5,
      nextProcessTime: 10,
    };

    processRobotDeathEffect(state, 10);

    expect(state.renderIndex).toBe(5);
    expect(state.killMe).toBe(true);
  });
});
