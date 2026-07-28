/**
 * Ported from Zod Engine.
 * Upstream: zvote.h / zvote.cpp
 */

/**
 * Port of upstream `_ZVOTE_H_`.
 * Role: Marks an upstream header boundary.
 * Ledger: MAC-3E31BD
 * Upstream: zvote.h:2
 */
export const ZVOTE_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `MAX_VOTE_TIME`.
 * Role: Defines the maximum vote duration.
 * Ledger: MAC-4E6AF1
 * Upstream: zvote.h:10
 */
export const MAX_VOTE_TIME_SECONDS = 30;

/**
 * Port of upstream `vote_type`.
 * Role: Identifies the kind of vote currently active in the game.
 * Ledger: ENU-685984
 * Upstream: zvote.h:13-18
 */
export enum VoteType {
  Pause = 0,
  Resume = 1,
  ChangeMap = 2,
  StartBot = 3,
  StopBot = 4,
  ResetGame = 5,
  ReshuffleTeams = 6,
  ChangeGameSpeed = 7,
  MaxVoteTypes = 8,
}

/**
 * Port of upstream `in_progress`.
 * Role: Stores whether a vote is currently active.
 * Ledger: FUN-314267
 * Upstream: zvote.h:45
 */
export type VoteProgressState = {
  inProgress: boolean;
};

/**
 * Port of upstream `VoteInProgress`.
 * Role: Returns whether a vote is currently active.
 * Ledger: FUN-485613
 * Upstream: zvote.h:35
 */
export function voteInProgress(state: VoteProgressState): boolean {
  return state.inProgress;
}

/**
 * Port of upstream `SetVoteInProgress`.
 * Role: Updates whether a vote is currently active.
 * Ledger: FUN-314267
 * Upstream: zvote.h:45
 */
export function setVoteInProgress(
  state: VoteProgressState,
  inProgress: boolean,
): void {
  state.inProgress = inProgress;
}

/**
 * Port of upstream `value`.
 * Role: Stores the numeric payload associated with the current vote.
 * Ledger: FUN-3E9145
 * Upstream: zvote.h:44
 */
export type VoteValueState = {
  value: number;
};

/**
 * Port of upstream `GetVoteValue`.
 * Role: Returns the numeric payload associated with the current vote.
 * Ledger: FUN-61BBEA
 * Upstream: zvote.h:42
 */
export function getVoteValue(state: VoteValueState): number {
  return state.value;
}

/**
 * Port of upstream `SetVoteValue`.
 * Role: Updates the numeric payload associated with the current vote.
 * Ledger: FUN-3E9145
 * Upstream: zvote.h:44
 */
export function setVoteValue(state: VoteValueState, value: number): void {
  state.value = value;
}

/**
 * Port of upstream `max_description_len`.
 * Role: Defines the maximum rendered vote description width.
 * Ledger: CON-500A93
 * Upstream: zvote.cpp:59
 */
export const VOTE_DESCRIPTION_MAX_WIDTH_PIXELS = 104;
