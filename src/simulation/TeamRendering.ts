import { ACTIVE_TEAM_TYPE_COUNT, TeamType } from "./SimulationConstants";

/**
 * Upstream: zteam.h
 */

/**
 * Port of upstream `_ZTEAM_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: zteam.h:2
 */
export const ZTEAM_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ZTEAM_BASE_TEAM`.
 * Role: Defines the base team palette used for team recoloring.
 * Upstream: zteam.h:12
 */
export const TEAM_RENDERING_BASE_TEAM = TeamType.Red;

/**
 * Port of upstream `ZTEAM_PALETTE_MAX`.
 * Role: Defines the number of color replacement slots in a team palette.
 * Upstream: zteam.h:16
 */
export const TEAM_RENDERING_PALETTE_MAX = 16;

/**
 * Browser-side replacement for upstream `SDL_Color` palette entries.
 * Role: Stores RGB channels used by team recoloring data.
 * Upstream: zteam.cpp:126
 */
export type TeamPaletteColor = {
  red: number;
  green: number;
  blue: number;
};

/**
 * Port of upstream `team_color`.
 * Role: Provides the base RGB color used by simple team-colored render effects.
 * Upstream: zteam.cpp:206-239
 */
export const TEAM_RENDERING_COLORS: Readonly<Record<TeamType, TeamPaletteColor>> = {
  [TeamType.Null]: { red: 115, green: 115, blue: 115 },
  [TeamType.Red]: { red: 223, green: 0, blue: 0 },
  [TeamType.Blue]: { red: 19, green: 55, blue: 251 },
  [TeamType.Green]: { red: 23, green: 143, blue: 19 },
  [TeamType.Yellow]: { red: 203, green: 99, blue: 47 },
  [TeamType.Purple]: { red: 223, green: 0, blue: 0 },
  [TeamType.Teal]: { red: 223, green: 0, blue: 0 },
  [TeamType.White]: { red: 223, green: 0, blue: 0 },
  [TeamType.Black]: { red: 223, green: 0, blue: 0 },
};

/**
 * Port of upstream `ZTeam_Palette` color arrays used by `AddColor`.
 * Role: Holds base and replacement color entries for team recoloring.
 * Upstream: zteam.cpp:132-138
 */
export type TeamPaletteColorState = {
  baseColor: TeamPaletteColor[];
  replaceColor: TeamPaletteColor[];
};

/**
 * Port of upstream `ZTeam_Palette`.
 * Role: Creates the browser-side palette state that replaces the upstream SDL_Color arrays.
 * Upstream: zteam.h:18-30
 */
export function createTeamPaletteColorState(): TeamPaletteColorState {
  return {
    baseColor: [],
    replaceColor: [],
  };
}

export type TeamPaletteSurface = {
  width: number;
  height: number;
  getPixelColor(x: number, y: number): TeamPaletteColor;
};

export type TeamPaletteSaveTarget = {
  saveSurfacePalette(filename: string): void;
};

export type TeamPaletteSurfaceLoader<TSurface> = (filename: string) => TSurface | null;

export type TeamPaletteSurfaceConverter<TSurface> = (surface: TSurface) => TeamPaletteSurface;

export type TeamRenderingBaseSurfaceSource<TSurface> = {
  getBaseSurface(): TSurface | null;
};

export type TeamRenderingLoadTarget<TSurface> = {
  loadBaseImage(source: string | TSurface | null): void;
};

export type TeamSurfaceFactory<TSurface> = (
  team: TeamType | number,
  baseSurface: TSurface | null,
) => TSurface | null;

export const TEAM_PALETTE_ADD_COLOR_REQUIRES_VECTOR_MESSAGE =
  "ZTeam_Palette::AddColor: this function requires color arrays be vectors";

export const TEAM_PALETTE_SAVE_REQUIRES_VECTOR_MESSAGE =
  "ZTeam_Palette::SaveSurfacePalette: this function requires color arrays be vectors";

export const TEAM_PALETTE_LOAD_WIDTH_MESSAGE =
  "ZTeam_Palette::LoadSurfacePalette:palette width not 2";

export const TEAM_RENDERING_TEAM_NAMES = [
  "null",
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "teal",
  "white",
  "black",
] as const;

export const TEAM_RENDERING_SAVE_BASE_PALETTE_MESSAGE =
  "ZTeam::SavePalette:You can not save the base palette (red)";

export function getTeamPaletteLoadFailureMessage(teamName: string, filename: string): string {
  return `ZTeam::Could not load palette for the ${teamName} team:'${filename}'`;
}

/**
 * Port of upstream `ZTeam::Init`.
 * Role: Loads every active team palette and then initializes team colors.
 * Upstream: zteam.cpp:187-195
 */
export function initTeamRendering(
  loadPalette: (team: TeamType | number) => void,
  setupTeamColor: () => void,
): void {
  for (let team = 0; team < ACTIVE_TEAM_TYPE_COUNT; team += 1) {
    loadPalette(team);
  }

  setupTeamColor();
}

/**
 * Port of upstream `ZTeam_Palette::AddColor`.
 * Role: Preserves the upstream active behavior, which reports unsupported storage and returns false.
 * Upstream: zteam.cpp:126-142
 */
export function addTeamPaletteColor(
  state: TeamPaletteColorState,
  baseColor: TeamPaletteColor,
  replaceColor: TeamPaletteColor,
  log: (message: string) => void = (): void => undefined,
): boolean {
  void state;
  void baseColor;
  void replaceColor;
  log(TEAM_PALETTE_ADD_COLOR_REQUIRES_VECTOR_MESSAGE);
  return false;
}

/**
 * Port of upstream `ZTeam_Palette::LoadSurfacePalette`.
 * Role: Loads base and replacement RGB palette rows from a browser-side surface abstraction.
 * Upstream: zteam.cpp:8-61
 */
export function loadTeamSurfacePalette(
  state: TeamPaletteColorState,
  surface: TeamPaletteSurface,
  log: (message: string) => void = (): void => undefined,
): boolean {
  if (surface.width !== 2) {
    log(TEAM_PALETTE_LOAD_WIDTH_MESSAGE);
    return false;
  }

  if (surface.height !== TEAM_RENDERING_PALETTE_MAX) {
    log(`ZTeam_Palette::LoadSurfacePalette:palette height not ${TEAM_RENDERING_PALETTE_MAX}`);
  }

  for (let row = 0; row < surface.height; row += 1) {
    const baseColor = surface.getPixelColor(0, row);
    const replaceColor = surface.getPixelColor(1, row);

    if (row < TEAM_RENDERING_PALETTE_MAX) {
      state.baseColor[row] = { ...baseColor };
      state.replaceColor[row] = { ...replaceColor };
    }
  }

  return true;
}

/**
 * Port of upstream `ZTeam_Palette::GetReplacement`.
 * Role: Finds a replacement palette color for a matching base RGB entry.
 * Upstream: zteam.cpp:144-185
 */
export function getTeamPaletteReplacement(
  state: TeamPaletteColorState,
  red: number,
  green: number,
  blue: number,
): TeamPaletteColor | null {
  for (let i = 0; i < TEAM_RENDERING_PALETTE_MAX; i += 1) {
    const baseColor = state.baseColor[i];

    if (
      baseColor &&
      red === baseColor.red &&
      green === baseColor.green &&
      blue === baseColor.blue
    ) {
      return state.replaceColor[i] ?? null;
    }
  }

  return null;
}

/**
 * Port of upstream `ZTeam_Palette::SaveSurfacePalette`.
 * Role: Preserves the upstream active behavior, which reports unsupported storage and returns false.
 * Upstream: zteam.cpp:63-124
 */
export function saveTeamSurfacePalette(
  filename: string,
  log: (message: string) => void = (): void => undefined,
): boolean {
  void filename;
  log(TEAM_PALETTE_SAVE_REQUIRES_VECTOR_MESSAGE);
  return false;
}

/**
 * Port of upstream `ZTeam::SaveAllPalettes`.
 * Role: Delegates palette saving once for every active team slot.
 * Upstream: zteam.cpp:300-306
 */
export function saveAllTeamPalettes(savePalette: (team: TeamType | number) => void): void {
  for (let team = 0; team < ACTIVE_TEAM_TYPE_COUNT; team += 1) {
    savePalette(team);
  }
}

/**
 * Port of upstream `ZTeam::LoadPalette`.
 * Role: Loads one non-base team palette from an image surface and delegates row loading.
 * Upstream: zteam.cpp:259-281
 */
export function loadTeamPalette<TSurface>(
  team: TeamType | number,
  teamPalettes: readonly (TeamPaletteColorState | null | undefined)[],
  loadSurface: TeamPaletteSurfaceLoader<TSurface>,
  convertSurface: TeamPaletteSurfaceConverter<TSurface>,
  freeSurface: (surface: TeamPaletteSurface) => void = (): void => undefined,
  log: (message: string) => void = (): void => undefined,
): void {
  if (team === TEAM_RENDERING_BASE_TEAM) return;

  const teamName = TEAM_RENDERING_TEAM_NAMES[team];
  const palette = teamPalettes[team];
  if (!teamName || !palette) return;

  const filename = `assets/teams/${teamName}_palette.bmp`;
  const sourceSurface = loadSurface(filename);

  if (!sourceSurface) {
    log(getTeamPaletteLoadFailureMessage(teamName, filename));
    return;
  }

  const convertedSurface = convertSurface(sourceSurface);
  loadTeamSurfacePalette(palette, convertedSurface, log);
  freeSurface(convertedSurface);
}

/**
 * Port of upstream `ZTeam::SavePalette`.
 * Role: Saves one non-base team's generated color replacement palette.
 * Upstream: zteam.cpp:283-298
 */
export function saveTeamPalette(
  team: TeamType | number,
  teamPalettes: readonly (TeamPaletteSaveTarget | null | undefined)[],
  log: (message: string) => void = (): void => undefined,
): void {
  if (team === TEAM_RENDERING_BASE_TEAM) {
    log(TEAM_RENDERING_SAVE_BASE_PALETTE_MESSAGE);
    return;
  }

  const teamName = TEAM_RENDERING_TEAM_NAMES[team];
  const palette = teamPalettes[team];
  if (!teamName || !palette) return;

  palette.saveSurfacePalette(`assets/teams/${teamName}_palette.bmp`);
}

/**
 * Port of upstream `ZTeam::LoadZSurface`.
 * Role: Loads a base/null team image by filename, or loads a recolored team surface from the base image.
 * Upstream: zteam.cpp:361-375
 */
export function loadTeamZSurface<TSurface>(
  team: TeamType | number,
  baseVersion: TeamRenderingBaseSurfaceSource<TSurface>,
  renderVersion: TeamRenderingLoadTarget<TSurface>,
  filename: string,
  makeTeamSurface: TeamSurfaceFactory<TSurface>,
): void {
  if (team === TeamType.Null || team === TEAM_RENDERING_BASE_TEAM) {
    renderVersion.loadBaseImage(filename);
    return;
  }

  renderVersion.loadBaseImage(makeTeamSurface(team, baseVersion.getBaseSurface()));
}
