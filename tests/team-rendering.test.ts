import { describe, expect, it } from "vitest";
import { TeamType } from "../src/simulation/SimulationConstants";
import {
  addTeamPaletteColor,
  initTeamRendering,
  loadTeamZSurface,
  saveAllTeamPalettes,
  saveTeamPalette,
  TEAM_RENDERING_COLORS,
  TEAM_PALETTE_ADD_COLOR_REQUIRES_VECTOR_MESSAGE,
  TEAM_RENDERING_BASE_TEAM,
  TEAM_RENDERING_PALETTE_MAX,
  TEAM_RENDERING_SAVE_BASE_PALETTE_MESSAGE,
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

  it("ports ZTeam Init as palette loading followed by team color setup", () => {
    const calls: Array<string | number> = [];

    initTeamRendering(
      (team) => {
        calls.push("load-palette", team);
      },
      () => calls.push("setup-team-color"),
    );

    expect(calls).toEqual([
      "load-palette",
      TeamType.Null,
      "load-palette",
      TeamType.Red,
      "load-palette",
      TeamType.Blue,
      "load-palette",
      TeamType.Green,
      "load-palette",
      TeamType.Yellow,
      "load-palette",
      TeamType.Purple,
      "load-palette",
      TeamType.Teal,
      "load-palette",
      TeamType.White,
      "load-palette",
      TeamType.Black,
      "setup-team-color",
    ]);
  });

  it("ports base team render colors", () => {
    expect(TEAM_RENDERING_COLORS[TeamType.Null]).toEqual({ red: 115, green: 115, blue: 115 });
    expect(TEAM_RENDERING_COLORS[TeamType.Red]).toEqual({ red: 223, green: 0, blue: 0 });
    expect(TEAM_RENDERING_COLORS[TeamType.Blue]).toEqual({ red: 19, green: 55, blue: 251 });
    expect(TEAM_RENDERING_COLORS[TeamType.Green]).toEqual({ red: 23, green: 143, blue: 19 });
    expect(TEAM_RENDERING_COLORS[TeamType.Yellow]).toEqual({ red: 203, green: 99, blue: 47 });
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

  it("ports ZTeam SaveAllPalettes over every active team slot", () => {
    const savedTeams: number[] = [];

    saveAllTeamPalettes((team) => savedTeams.push(team));

    expect(savedTeams).toEqual([
      TeamType.Null,
      TeamType.Red,
      TeamType.Blue,
      TeamType.Green,
      TeamType.Yellow,
      TeamType.Purple,
      TeamType.Teal,
      TeamType.White,
      TeamType.Black,
    ]);
  });

  it("ports ZTeam SavePalette as non-base palette persistence", () => {
    const saved: Array<[number, string]> = [];
    const teamPalettes = Array.from({ length: 9 }, (_, team) => ({
      saveSurfacePalette(filename: string): void {
        saved.push([team, filename]);
      },
    }));

    saveTeamPalette(TeamType.Blue, teamPalettes);

    expect(saved).toEqual([[TeamType.Blue, "assets/teams/blue_palette.bmp"]]);
  });

  it("ports ZTeam SavePalette as base-team guard", () => {
    const saved: string[] = [];
    const messages: string[] = [];
    const teamPalettes = Array.from({ length: 9 }, () => ({
      saveSurfacePalette(filename: string): void {
        saved.push(filename);
      },
    }));

    saveTeamPalette(TEAM_RENDERING_BASE_TEAM, teamPalettes, (message) =>
      messages.push(message),
    );

    expect(saved).toEqual([]);
    expect(messages).toEqual([TEAM_RENDERING_SAVE_BASE_PALETTE_MESSAGE]);
  });

  it("ports ZTeam LoadZSurface as filename loading for null and base teams", () => {
    const loaded: Array<string | { id: string } | null> = [];
    const baseSurface = { id: "base-surface" };
    const baseVersion = {
      getBaseSurface: () => baseSurface,
    };
    const renderVersion = {
      loadBaseImage: (source: string | { id: string } | null) => loaded.push(source),
    };

    loadTeamZSurface(
      TeamType.Null,
      baseVersion,
      renderVersion,
      "assets/units/base.png",
      () => ({ id: "unexpected" }),
    );
    loadTeamZSurface(
      TEAM_RENDERING_BASE_TEAM,
      baseVersion,
      renderVersion,
      "assets/units/base.png",
      () => ({ id: "unexpected" }),
    );

    expect(loaded).toEqual(["assets/units/base.png", "assets/units/base.png"]);
  });

  it("ports ZTeam LoadZSurface as recolored surface loading for colored teams", () => {
    const loaded: Array<string | { id: string } | null> = [];
    const made: Array<[number, { id: string } | null]> = [];
    const baseSurface = { id: "base-surface" };
    const recoloredSurface = { id: "blue-surface" };
    const baseVersion = {
      getBaseSurface: () => baseSurface,
    };
    const renderVersion = {
      loadBaseImage: (source: string | { id: string } | null) => loaded.push(source),
    };

    loadTeamZSurface(
      TeamType.Blue,
      baseVersion,
      renderVersion,
      "assets/units/base.png",
      (team, surface) => {
        made.push([team, surface]);
        return recoloredSurface;
      },
    );

    expect(made).toEqual([[TeamType.Blue, baseSurface]]);
    expect(loaded).toEqual([recoloredSurface]);
  });
});
