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
