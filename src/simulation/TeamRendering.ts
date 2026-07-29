import { TeamType } from "./SimulationConstants";

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
