import { describe, expect, it } from "vitest";
import {
  EROBOT_TURRET_HEADER_GUARD_PORTED,
  initRobotTurretEffect,
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
});
