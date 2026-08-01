import { describe, expect, it } from "vitest";
import { TeamType } from "../src/simulation/SimulationConstants";
import {
  addTeamPaletteColor,
  createTeamPaletteColorState,
  getTeamPaletteReplacement,
  getTeamPaletteLoadFailureMessage,
  initTeamRendering,
  loadTeamPalette,
  loadTeamSurfacePalette,
  loadTeamZSurface,
  saveAllTeamPalettes,
  saveTeamSurfacePalette,
  saveTeamPalette,
  TEAM_RENDERING_COLORS,
  TEAM_PALETTE_ADD_COLOR_REQUIRES_VECTOR_MESSAGE,
  TEAM_PALETTE_LOAD_WIDTH_MESSAGE,
  TEAM_PALETTE_SAVE_REQUIRES_VECTOR_MESSAGE,
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

  it("ports ZTeam_Palette as independent base and replacement color state", () => {
    const state = createTeamPaletteColorState();

    state.baseColor[0] = { red: 1, green: 2, blue: 3 };

    expect(state).toEqual({
      baseColor: [{ red: 1, green: 2, blue: 3 }],
      replaceColor: [],
    });
    expect(state.baseColor).not.toBe(state.replaceColor);
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

  it("ports ZTeam_Palette LoadSurfacePalette as a width guard", () => {
    const messages: string[] = [];
    const state = {
      baseColor: [{ red: 1, green: 2, blue: 3 }],
      replaceColor: [{ red: 4, green: 5, blue: 6 }],
    };

    const result = loadTeamSurfacePalette(
      state,
      {
        width: 3,
        height: TEAM_RENDERING_PALETTE_MAX,
        getPixelColor: () => ({ red: 0, green: 0, blue: 0 }),
      },
      (message) => messages.push(message),
    );

    expect(result).toBe(false);
    expect(messages).toEqual([TEAM_PALETTE_LOAD_WIDTH_MESSAGE]);
    expect(state).toEqual({
      baseColor: [{ red: 1, green: 2, blue: 3 }],
      replaceColor: [{ red: 4, green: 5, blue: 6 }],
    });
  });

  it("ports ZTeam_Palette LoadSurfacePalette as row-wise base and replacement loading", () => {
    const state = {
      baseColor: [],
      replaceColor: [],
    };
    const reads: Array<[number, number]> = [];

    const result = loadTeamSurfacePalette(state, {
      width: 2,
      height: 2,
      getPixelColor: (x, y) => {
        reads.push([x, y]);
        return { red: x + y * 10, green: x + y * 10 + 1, blue: x + y * 10 + 2 };
      },
    });

    expect(result).toBe(true);
    expect(reads).toEqual([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);
    expect(state.baseColor).toEqual([
      { red: 0, green: 1, blue: 2 },
      { red: 10, green: 11, blue: 12 },
    ]);
    expect(state.replaceColor).toEqual([
      { red: 1, green: 2, blue: 3 },
      { red: 11, green: 12, blue: 13 },
    ]);
  });

  it("ports ZTeam_Palette LoadSurfacePalette as height warning and 16-row cap", () => {
    const messages: string[] = [];
    const state = {
      baseColor: [],
      replaceColor: [],
    };

    const result = loadTeamSurfacePalette(
      state,
      {
        width: 2,
        height: TEAM_RENDERING_PALETTE_MAX + 1,
        getPixelColor: (x, y) => ({ red: y, green: x, blue: x + y }),
      },
      (message) => messages.push(message),
    );

    expect(result).toBe(true);
    expect(messages).toEqual([
      "ZTeam_Palette::LoadSurfacePalette:palette height not 16",
    ]);
    expect(state.baseColor).toHaveLength(TEAM_RENDERING_PALETTE_MAX);
    expect(state.replaceColor).toHaveLength(TEAM_RENDERING_PALETTE_MAX);
    expect(state.baseColor[15]).toEqual({ red: 15, green: 0, blue: 15 });
    expect(state.replaceColor[15]).toEqual({ red: 15, green: 1, blue: 16 });
  });

  it("ports ZTeam_Palette GetReplacement as base-color lookup", () => {
    const state = {
      baseColor: [
        { red: 1, green: 2, blue: 3 },
        { red: 10, green: 20, blue: 30 },
      ],
      replaceColor: [
        { red: 4, green: 5, blue: 6 },
        { red: 40, green: 50, blue: 60 },
      ],
    };

    expect(getTeamPaletteReplacement(state, 10, 20, 30)).toEqual({
      red: 40,
      green: 50,
      blue: 60,
    });
  });

  it("ports ZTeam_Palette GetReplacement as null when no base color matches", () => {
    const state = {
      baseColor: [{ red: 1, green: 2, blue: 3 }],
      replaceColor: [{ red: 4, green: 5, blue: 6 }],
    };

    expect(getTeamPaletteReplacement(state, 1, 2, 4)).toBeNull();
  });

  it("ports ZTeam_Palette SaveSurfacePalette as unsupported vector-storage guard", () => {
    const messages: string[] = [];

    const result = saveTeamSurfacePalette("assets/teams/blue_palette.bmp", (message) =>
      messages.push(message),
    );

    expect(result).toBe(false);
    expect(messages).toEqual([TEAM_PALETTE_SAVE_REQUIRES_VECTOR_MESSAGE]);
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

  it("ports ZTeam LoadPalette as base-team guard", () => {
    const loaded: string[] = [];
    const state = createTeamPaletteColorState();

    loadTeamPalette(
      TEAM_RENDERING_BASE_TEAM,
      [null, state],
      (filename) => {
        loaded.push(filename);
        return {};
      },
      () => ({
        width: 2,
        height: TEAM_RENDERING_PALETTE_MAX,
        getPixelColor: () => ({ red: 0, green: 0, blue: 0 }),
      }),
    );

    expect(loaded).toEqual([]);
    expect(state).toEqual({ baseColor: [], replaceColor: [] });
  });

  it("ports ZTeam LoadPalette as missing palette log", () => {
    const messages: string[] = [];
    const state = createTeamPaletteColorState();

    loadTeamPalette(
      TeamType.Blue,
      Array.from({ length: 9 }, (_, team) => (team === TeamType.Blue ? state : null)),
      () => null,
      () => ({
        width: 2,
        height: TEAM_RENDERING_PALETTE_MAX,
        getPixelColor: () => ({ red: 0, green: 0, blue: 0 }),
      }),
      undefined,
      (message) => messages.push(message),
    );

    expect(messages).toEqual([
      getTeamPaletteLoadFailureMessage(
        "blue",
        "assets/teams/blue_palette.bmp",
      ),
    ]);
    expect(state).toEqual({ baseColor: [], replaceColor: [] });
  });

  it("ports ZTeam LoadPalette as load, convert, palette import, and free", () => {
    const sourceSurface = { id: "raw-blue-palette" };
    const loaded: string[] = [];
    const converted: Array<typeof sourceSurface> = [];
    const freed: string[] = [];
    const state = createTeamPaletteColorState();

    loadTeamPalette(
      TeamType.Blue,
      Array.from({ length: 9 }, (_, team) => (team === TeamType.Blue ? state : null)),
      (filename) => {
        loaded.push(filename);
        return sourceSurface;
      },
      (surface) => {
        converted.push(surface);
        return {
          width: 2,
          height: 2,
          getPixelColor: (x, y) => ({
            red: 10 + x + y * 20,
            green: 11 + x + y * 20,
            blue: 12 + x + y * 20,
          }),
        };
      },
      (surface) => freed.push(`${surface.width}x${surface.height}`),
    );

    expect(loaded).toEqual(["assets/teams/blue_palette.bmp"]);
    expect(converted).toEqual([sourceSurface]);
    expect(freed).toEqual(["2x2"]);
    expect(state.baseColor).toEqual([
      { red: 10, green: 11, blue: 12 },
      { red: 30, green: 31, blue: 32 },
    ]);
    expect(state.replaceColor).toEqual([
      { red: 11, green: 12, blue: 13 },
      { red: 31, green: 32, blue: 33 },
    ]);
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
