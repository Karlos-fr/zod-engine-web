import { describe, expect, it } from "vitest";
import { MapObjectType } from "../src/world/MapFormat";
import {
  ACTIVE_TEAM_TYPE_COUNT,
  BuildingType,
  CannonType,
  TeamType,
} from "../src/simulation/SimulationConstants";
import {
  FLAG_ANIMATION_INTERVAL_SECONDS,
  flagHasRadar,
  initFlagObjectImages,
  OFLAG_HEADER_GUARD_PORTED,
  processFlagObject,
  type FlagConnectedObject,
  type FlagProcessState,
} from "../src/simulation/FlagObject";

describe("flag object", () => {
  it("adapts the oflag.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/FlagObject");
    const secondImport = await import("../src/simulation/FlagObject");

    expect(OFLAG_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.OFLAG_HEADER_GUARD_PORTED).toBe(firstImport.OFLAG_HEADER_GUARD_PORTED);
  });

  it("ports int_time as the flag animation frame interval", () => {
    expect(FLAG_ANIMATION_INTERVAL_SECONDS).toBe(0.2);
  });

  it("ports OFlag Init as team-colored flag image initialization", () => {
    const loaded: Array<[number, number, string | { id: string } | null]> = [];
    const made: Array<[number, { id: string } | null]> = [];
    const baseSurfaces = Array.from({ length: 4 }, (_, frame) => ({
      id: `red-base-${frame}`,
    }));
    const flagImages = Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, (_, team) =>
      Array.from({ length: 4 }, (_, frame) => ({
        getBaseSurface: () =>
          team === TeamType.Red ? baseSurfaces[frame] ?? null : null,
        loadBaseImage(source: string | { id: string } | null): void {
          loaded.push([team, frame, source]);
        },
      })),
    );

    initFlagObjectImages({ flagImages }, (team, surface) => {
      made.push([team, surface]);
      return { id: `team-${team}-${surface?.id ?? "null"}` };
    });

    expect(loaded).toHaveLength(ACTIVE_TEAM_TYPE_COUNT * 4);
    expect(loaded.slice(0, 5)).toEqual([
      [TeamType.Null, 0, "assets/other/flag_null_0.png"],
      [TeamType.Null, 1, "assets/other/flag_null_1.png"],
      [TeamType.Null, 2, "assets/other/flag_null_2.png"],
      [TeamType.Null, 3, "assets/other/flag_null_3.png"],
      [TeamType.Red, 0, "assets/other/flag_red_0.png"],
    ]);
    expect(loaded).toContainEqual([
      TeamType.Blue,
      2,
      { id: "team-2-red-base-2" },
    ]);
    expect(loaded).toContainEqual([
      TeamType.Black,
      3,
      { id: "team-8-red-base-3" },
    ]);
    expect(made).toHaveLength((ACTIVE_TEAM_TYPE_COUNT - 2) * 4);
    expect(made[0]).toEqual([TeamType.Blue, baseSurfaces[0]]);
  });

  it("keeps the flag frame unchanged before the animation interval", () => {
    const state: FlagProcessState = {
      lastProcessTime: 10,
      flagIndex: 2,
    };

    expect(processFlagObject(state, 10.199)).toBe(1);
    expect(state).toEqual({
      lastProcessTime: 10,
      flagIndex: 2,
    });
  });

  it("advances the flag frame at the animation interval", () => {
    const state: FlagProcessState = {
      lastProcessTime: 0,
      flagIndex: 2,
    };

    expect(processFlagObject(state, FLAG_ANIMATION_INTERVAL_SECONDS)).toBe(1);

    expect(state.lastProcessTime).toBe(FLAG_ANIMATION_INTERVAL_SECONDS);
    expect(state.flagIndex).toBe(3);
  });

  it("wraps the flag frame after the fourth frame", () => {
    const state: FlagProcessState = {
      lastProcessTime: 0,
      flagIndex: 3,
    };

    expect(processFlagObject(state, FLAG_ANIMATION_INTERVAL_SECONDS)).toBe(1);

    expect(state.lastProcessTime).toBe(FLAG_ANIMATION_INTERVAL_SECONDS);
    expect(state.flagIndex).toBe(0);
  });

  it("reports no radar when the flag has no connected objects", () => {
    expect(flagHasRadar([])).toBe(false);
  });

  it("ignores connected objects that are not radar buildings", () => {
    const connectedObjects: FlagConnectedObject[] = [
      {
        getObjectId: () => ({
          objectType: MapObjectType.Building,
          objectId: BuildingType.Repair,
        }),
      },
      {
        getObjectId: () => ({
          objectType: MapObjectType.Cannon,
          objectId: CannonType.Gatling,
        }),
      },
    ];

    expect(flagHasRadar(connectedObjects)).toBe(false);
  });

  it("ports OFlag HasRadar by detecting a connected radar building", () => {
    const connectedObjects: FlagConnectedObject[] = [
      {
        getObjectId: () => ({
          objectType: MapObjectType.Cannon,
          objectId: CannonType.Gatling,
        }),
      },
      {
        getObjectId: () => ({
          objectType: MapObjectType.Building,
          objectId: BuildingType.Radar,
        }),
      },
    ];

    expect(flagHasRadar(connectedObjects)).toBe(true);
  });
});
