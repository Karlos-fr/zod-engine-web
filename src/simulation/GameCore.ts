/**
 * Ported from Zod Engine.
 * Upstream: zcore.h
 */

/**
 * Port of upstream `_ZCORE_H_`.
 * Role: Marks an upstream header boundary.
 * Ledger: MAC-860937
 * Upstream: zcore.h:2
 */
export const ZCORE_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `p_vote_choice`.
 * Role: Identifies a player's vote choice in core game voting.
 * Ledger: ENU-436CA4
 * Upstream: zcore.h:64-67
 */
export enum PlayerVoteChoice {
  Null = 0,
  Yes = 1,
  No = 2,
  Pass = 3,
  MaxVoteChoices = 4,
}

/**
 * Port of upstream `games_per_vp`.
 * Role: Defines how many played games grant one extra real voting-power point.
 * Ledger: CON-A48EED
 * Upstream: zcore.h:110
 */
export const GAMES_PER_VOTING_POWER_POINT = 5;

/**
 * Port of upstream `allow_run`.
 * Role: Stores whether the core game loop is currently permitted to run.
 * Ledger: FUN-542EC1
 * Upstream: zcore.h:148
 */
export type CoreRunPermissionState = {
  allowRun: boolean;
};

/**
 * Port of upstream `AllowRun`.
 * Role: Updates whether the core game loop is permitted to run.
 * Ledger: FUN-542EC1
 * Upstream: zcore.h:148
 */
export function allowCoreRun(
  state: CoreRunPermissionState,
  allowRun = true,
): void {
  state.allowRun = allowRun;
}
