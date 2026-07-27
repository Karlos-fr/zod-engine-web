import { TeamType } from "./SimulationConstants";

/**
 * Ported from Zod Engine.
 * Upstream: zteam.h
 * Symbols: _ZTEAM_H_, ZTEAM_BASE_TEAM, ZTEAM_PALETTE_MAX
 */

/**
 * Adaptation of upstream `_ZTEAM_H_`.
 * Role: Marks the TypeScript module boundary for upstream `zteam.h`.
 * Ledger: MAC-50DDC6
 * Upstream: zteam.h:2
 */
export const ZTEAM_HEADER_GUARD_PORTED = true;

/**
 * Adaptation of upstream `ZTEAM_BASE_TEAM`.
 * Role: Defines the base team palette used for team recoloring.
 * Ledger: MAC-A1C505
 * Upstream: zteam.h:12
 */
export const TEAM_RENDERING_BASE_TEAM = TeamType.Red;

/**
 * Adaptation of upstream `ZTEAM_PALETTE_MAX`.
 * Role: Defines the number of color replacement slots in a team palette.
 * Ledger: MAC-D800E9
 * Upstream: zteam.h:16
 */
export const TEAM_RENDERING_PALETTE_MAX = 16;
