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

export const TEAM_PALETTE_ADD_COLOR_REQUIRES_VECTOR_MESSAGE =
  "ZTeam_Palette::AddColor: this function requires color arrays be vectors";

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
 * Port of upstream `ZTeam::SaveAllPalettes`.
 * Role: Delegates palette saving once for every active team slot.
 * Upstream: zteam.cpp:300-306
 */
export function saveAllTeamPalettes(savePalette: (team: TeamType | number) => void): void {
  for (let team = 0; team < ACTIVE_TEAM_TYPE_COUNT; team += 1) {
    savePalette(team);
  }
}
