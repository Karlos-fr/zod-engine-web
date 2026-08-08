import { describe, expect, it } from "vitest";
import {
  ACTIVE_TEAM_TYPE_COUNT,
  TeamType,
} from "../src/simulation/SimulationConstants";
import {
  EROBOT_DEATH_HEADER_GUARD_PORTED,
  initRobotDeathEffect,
  processRobotDeathEffect,
  ROBOT_DEATH_PROCESS_INTERVAL_SECONDS,
  renderRobotDeathEffect,
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

  it("ports ERobotDeath Init as team-colored robot death and melt image loading", () => {
    const loaded: Array<[string, number, number, number, string | { id: string } | null]> =
      [];
    const made: Array<[number, { id: string } | null]> = [];
    const dieBaseSurfaces = Array.from({ length: 4 }, (_, dieSet) =>
      Array.from({ length: 10 }, (_, frame) => ({
        id: `die-${dieSet}-red-base-${frame}`,
      })),
    );
    const meltBaseSurfaces = Array.from({ length: 17 }, (_, frame) => ({
      id: `melt-red-base-${frame}`,
    }));
    const state = {
      dieImages: Array.from({ length: 4 }, (_, dieSet) =>
        Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, (_, team) =>
          Array.from({ length: 10 }, (_, frame) => ({
            getBaseSurface: () =>
              team === TeamType.Red ? dieBaseSurfaces[dieSet]?.[frame] ?? null : null,
            loadBaseImage(source: string | { id: string } | null): void {
              loaded.push(["die", dieSet, team, frame, source]);
            },
          })),
        ),
      ),
      meltImages: Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, (_, team) =>
        Array.from({ length: 17 }, (_, frame) => ({
          getBaseSurface: () =>
            team === TeamType.Red ? meltBaseSurfaces[frame] ?? null : null,
          loadBaseImage(source: string | { id: string } | null): void {
            loaded.push(["melt", -1, team, frame, source]);
          },
        })),
      ),
      finishedInit: false,
    };

    initRobotDeathEffect(state, (team, surface) => {
      made.push([team, surface]);
      return { id: `team-${team}-${surface?.id ?? "null"}` };
    });

    expect(loaded).toHaveLength((ACTIVE_TEAM_TYPE_COUNT - 1) * 55);
    expect(loaded.slice(0, 3)).toEqual([
      [ "die", 0, TeamType.Red, 0, "assets/units/robots/die1_red_n00.png" ],
      [ "die", 0, TeamType.Red, 1, "assets/units/robots/die1_red_n01.png" ],
      [ "die", 0, TeamType.Red, 2, "assets/units/robots/die1_red_n02.png" ],
    ]);
    expect(loaded).toContainEqual([
      "die",
      3,
      TeamType.Red,
      7,
      "assets/units/robots/die4_red_n07.png",
    ]);
    expect(loaded).not.toContainEqual([
      "die",
      3,
      TeamType.Red,
      8,
      "assets/units/robots/die4_red_n08.png",
    ]);
    expect(loaded).toContainEqual([
      "melt",
      -1,
      TeamType.Red,
      16,
      "assets/units/robots/melt_red_n16.png",
    ]);
    expect(loaded).not.toContainEqual([
      "melt",
      -1,
      TeamType.Null,
      0,
      "assets/units/robots/melt_null_n00.png",
    ]);
    expect(loaded).toContainEqual([
      "die",
      0,
      TeamType.Blue,
      0,
      { id: "team-2-die-0-red-base-0" },
    ]);
    expect(loaded).toContainEqual([
      "melt",
      -1,
      TeamType.Blue,
      0,
      { id: "team-2-melt-red-base-0" },
    ]);
    expect(made).toHaveLength((ACTIVE_TEAM_TYPE_COUNT - 2) * 55);
    expect(made[0]).toEqual([TeamType.Blue, dieBaseSurfaces[0]?.[0]]);
    expect(state.finishedInit).toBe(true);
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

  it("replaces ERobotDeath DoRender with a map-relative death frame command", () => {
    const renderImages = [
      { id: "robot-death-0" },
      { id: "robot-death-1" },
      { id: "robot-death-2" },
    ];
    const calls: unknown[] = [];
    const zmap = {
      renderZSurface(
        surface: (typeof renderImages)[number],
        x: number,
        y: number,
        renderHit: boolean,
        aboutCenter: boolean,
      ) {
        calls.push(surface, x, y, renderHit, aboutCenter);
        return {
          surface,
          x: x - 6,
          y: y - 8,
          renderHit,
          aboutCenter,
        };
      },
    };

    expect(
      renderRobotDeathEffect(
        { killMe: false, x: 72, y: 48, renderIndex: 1, renderImages },
        zmap,
      ),
    ).toEqual({
      surface: renderImages[1],
      x: 66,
      y: 40,
      renderHit: false,
      aboutCenter: false,
    });
    expect(calls).toEqual([renderImages[1], 72, 48, false, false]);
  });

  it("replaces ERobotDeath DoRender as no command for killed or missing frames", () => {
    const zmap = {
      renderZSurface() {
        throw new Error("hidden robot death should not render");
      },
    };

    expect(
      renderRobotDeathEffect(
        { killMe: true, x: 72, y: 48, renderIndex: 0, renderImages: [{}] },
        zmap,
      ),
    ).toBeNull();
    expect(
      renderRobotDeathEffect(
        { killMe: false, x: 72, y: 48, renderIndex: 9, renderImages: [] },
        zmap,
      ),
    ).toBeNull();
  });
});
