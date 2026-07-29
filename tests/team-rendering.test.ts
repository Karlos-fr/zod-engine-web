import { describe, expect, it } from "vitest";
import { TeamType } from "../src/simulation/SimulationConstants";
import {
  addTeamPaletteColor,
  TEAM_PALETTE_ADD_COLOR_REQUIRES_VECTOR_MESSAGE,
  TEAM_RENDERING_BASE_TEAM,
  TEAM_RENDERING_PALETTE_MAX,
  ZTEAM_HEADER_GUARD_PORTED,
} from "../src/simulation/TeamRendering";

describe("team rendering", () => {
  it("adapts the zteam.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/TeamRendering");
    const secondImport = await import("../src/simulation/TeamRendering");

    expect(ZTEAM_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZTEAM_HEADER_GUARD_PORTED).toBe(
      firstImport.ZTEAM_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the base recoloring team", () => {
    expect(TEAM_RENDERING_BASE_TEAM).toBe(TeamType.Red);
  });

  it("adapts the team palette replacement slot count", () => {
    expect(TEAM_RENDERING_PALETTE_MAX).toBe(16);
  });

  it("ports ZTeam_Palette AddColor as unsupported vector-storage guard", () => {
    const state = {
      baseColor: [{ red: 1, green: 2, blue: 3 }],
      replaceColor: [{ red: 4, green: 5, blue: 6 }],
    };
    const messages: string[] = [];

    const result = addTeamPaletteColor(
      state,
      { red: 7, green: 8, blue: 9 },
      { red: 10, green: 11, blue: 12 },
      (message) => messages.push(message),
    );

    expect(result).toBe(false);
    expect(messages).toEqual([TEAM_PALETTE_ADD_COLOR_REQUIRES_VECTOR_MESSAGE]);
    expect(state).toEqual({
      baseColor: [{ red: 1, green: 2, blue: 3 }],
      replaceColor: [{ red: 4, green: 5, blue: 6 }],
    });
  });
});
