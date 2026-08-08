import { describe, expect, it } from "vitest";
import {
  EROBOT_TURRET_HEADER_GUARD_PORTED,
  initRobotTurretEffect,
  processRobotTurretEffect,
  renderRobotTurretEffect,
} from "../src/simulation/RobotTurretEffect";
import {
  ACTIVE_TEAM_TYPE_COUNT,
  TeamType,
} from "../src/simulation/SimulationConstants";

describe("robot turret effect", () => {
  it("adapts the erobotturrent.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/RobotTurretEffect");
    const secondImport = await import("../src/simulation/RobotTurretEffect");

    expect(EROBOT_TURRET_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.EROBOT_TURRET_HEADER_GUARD_PORTED).toBe(
      firstImport.EROBOT_TURRET_HEADER_GUARD_PORTED,
    );
  });

  it("ports ERobotTurrent Init as team-colored robot flip image loading", () => {
    const loaded: Array<[number, number, string | { id: string } | null]> = [];
    const made: Array<[number, { id: string } | null]> = [];
    const baseSurfaces = Array.from({ length: 33 }, (_, frame) => ({
      id: `red-base-${frame}`,
    }));
    const state = {
      robotFlipImages: Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, (_, team) =>
        Array.from({ length: 33 }, (_, frame) => ({
          getBaseSurface: () =>
            team === TeamType.Red ? baseSurfaces[frame] ?? null : null,
          loadBaseImage(source: string | { id: string } | null): void {
            loaded.push([team, frame, source]);
          },
        })),
      ),
      finishedInit: false,
    };

    initRobotTurretEffect(state, (team, surface) => {
      made.push([team, surface]);
      return { id: `team-${team}-${surface?.id ?? "null"}` };
    });

    expect(loaded).toHaveLength((ACTIVE_TEAM_TYPE_COUNT - 1) * 33);
    expect(loaded.slice(0, 3)).toEqual([
      [TeamType.Red, 0, "assets/units/robots/die5_red_n00.png"],
      [TeamType.Red, 1, "assets/units/robots/die5_red_n01.png"],
      [TeamType.Red, 2, "assets/units/robots/die5_red_n02.png"],
    ]);
    expect(loaded).not.toContainEqual([
      TeamType.Null,
      0,
      "assets/units/robots/die5_null_n00.png",
    ]);
    expect(loaded).toContainEqual([
      TeamType.Blue,
      32,
      { id: "team-2-red-base-32" },
    ]);
    expect(made).toHaveLength((ACTIVE_TEAM_TYPE_COUNT - 2) * 33);
    expect(made[0]).toEqual([TeamType.Blue, baseSurfaces[0]]);
    expect(state.finishedInit).toBe(true);
  });

  it("replaces ERobotTurrent DoRender with a scaled centered team-frame command", () => {
    const sizes: number[] = [];
    const robotFlipImages = Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, (_, team) =>
      Array.from({ length: 4 }, (_, frame) => ({
        id: `team-${team}-frame-${frame}`,
        setSize: (size: number) => sizes.push(size),
      })),
    );
    const calls: unknown[] = [];

    const command = renderRobotTurretEffect(
      {
        killMe: false,
        x: 112,
        y: 144,
        size: 1.5,
        owner: TeamType.Blue,
        renderIndex: 2,
        robotFlipImages,
      },
      {
        renderZSurface: (surface, x, y, renderHit, aboutCenter) => {
          calls.push({ surface, x, y, renderHit, aboutCenter });
          return {
            surface,
            x: x - 16,
            y: y - 24,
            renderHit,
            aboutCenter,
          };
        },
      },
    );

    expect(command).toEqual({
      surface: robotFlipImages[TeamType.Blue]?.[2],
      x: 96,
      y: 120,
      renderHit: false,
      aboutCenter: true,
    });
    expect(sizes).toEqual([1.5]);
    expect(calls).toEqual([
      {
        surface: robotFlipImages[TeamType.Blue]?.[2],
        x: 112,
        y: 144,
        renderHit: false,
        aboutCenter: true,
      },
    ]);
  });

  it("replaces ERobotTurrent DoRender as no command for killed or missing frames", () => {
    const robotFlipImages = [[{ setSize: () => undefined }]];
    const zmap = {
      renderZSurface: () => {
        throw new Error("renderZSurface should not be called");
      },
    };

    expect(
      renderRobotTurretEffect(
        {
          killMe: true,
          x: 0,
          y: 0,
          size: 1,
          owner: 0,
          renderIndex: 0,
          robotFlipImages,
        },
        zmap,
      ),
    ).toBeNull();
    expect(
      renderRobotTurretEffect(
        {
          killMe: false,
          x: 0,
          y: 0,
          size: 1,
          owner: TeamType.Blue,
          renderIndex: 9,
          robotFlipImages,
        },
        zmap,
      ),
    ).toBeNull();
  });

  it("ports ERobotTurrent Process as in-air animation and ballistic movement", () => {
    const state = {
      killMe: false,
      x: 0,
      y: 0,
      startX: 100,
      startY: 200,
      deltaX: 10,
      deltaY: -5,
      rise: 2,
      size: 1,
      renderIndex: 7,
      initTime: 10,
      finalTime: 14,
      nextRenderIndexTime: 11,
    };

    processRobotTurretEffect(state, 12);

    expect(state.killMe).toBe(false);
    expect(state.renderIndex).toBe(0);
    expect(state.nextRenderIndexTime).toBe(12.05);
    expect(state.size).toBe(3);
    expect(state.x).toBe(120);
    expect(state.y).toBe(130);
  });

  it("ports ERobotTurrent Process as late animation tail and size reset", () => {
    const state = {
      killMe: false,
      x: 100,
      y: 200,
      startX: 100,
      startY: 200,
      deltaX: 10,
      deltaY: -5,
      rise: 2,
      size: 3,
      renderIndex: 2,
      initTime: 10,
      finalTime: 14,
      nextRenderIndexTime: 14,
    };

    processRobotTurretEffect(state, 14.5);

    expect(state.killMe).toBe(false);
    expect(state.renderIndex).toBe(8);
    expect(state.nextRenderIndexTime).toBe(14.65);
    expect(state.size).toBe(1);
    expect(state.x).toBe(100);
    expect(state.y).toBe(200);
  });

  it("ports ERobotTurrent Process as kill after final frame and early kill guard", () => {
    const killedState = {
      killMe: false,
      x: 1,
      y: 2,
      startX: 1,
      startY: 2,
      deltaX: 3,
      deltaY: 4,
      rise: 5,
      size: 6,
      renderIndex: 32,
      initTime: 10,
      finalTime: 11,
      nextRenderIndexTime: 12,
    };

    processRobotTurretEffect(killedState, 12);

    expect(killedState.killMe).toBe(true);
    expect(killedState.renderIndex).toBe(33);
    expect(killedState.x).toBe(1);
    expect(killedState.y).toBe(2);
    expect(killedState.size).toBe(6);

    const alreadyKilled = { ...killedState, killMe: true, renderIndex: 1 };
    processRobotTurretEffect(alreadyKilled, 99);
    expect(alreadyKilled.renderIndex).toBe(1);
  });
});
