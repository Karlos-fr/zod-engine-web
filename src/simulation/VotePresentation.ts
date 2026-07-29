/**
 * Upstream: zvote.h / zvote.cpp
 */

import { currentTime } from "./Common";

/**
 * Port of upstream `_ZVOTE_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: zvote.h:2
 */
export const ZVOTE_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `MAX_VOTE_TIME`.
 * Role: Defines the maximum vote duration.
 * Upstream: zvote.h:10
 */
export const MAX_VOTE_TIME_SECONDS = 30;

/**
 * Port of upstream `vote_in_progress_img` asset path.
 * Role: Identifies the vote-in-progress panel image used by vote rendering.
 * Upstream: zvote.cpp:15
 */
export const VOTE_IN_PROGRESS_IMAGE_PATH =
  "assets/other/menus/vote_in_progress.png";

/**
 * Port of upstream `vote_type`.
 * Role: Identifies the kind of vote currently active in the game.
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
 * Port of upstream `vote_type`.
 * Role: Stores the kind of vote currently active.
 * Upstream: zvote.h:43
 */
export type VoteTypeState = {
  voteType: VoteType | number;
};

/**
 * Port of upstream `GetVoteType`.
 * Role: Returns the kind of vote currently active.
 * Upstream: zvote.h:41
 */
export function getVoteType(state: VoteTypeState): VoteType | number {
  return state.voteType;
}

/**
 * Port of upstream `ZVote::SetVoteType`.
 * Role: Updates the active vote kind, using -1 for out-of-range values.
 * Upstream: zvote.cpp:116-122
 */
export function setVoteType(state: VoteTypeState, voteType: number): void {
  if (voteType < 0 || voteType >= VoteType.MaxVoteTypes) {
    state.voteType = -1;
    return;
  }

  state.voteType = voteType;
}

/**
 * Port of upstream `in_progress`.
 * Role: Stores whether a vote is currently active.
 * Upstream: zvote.h:45
 */
export type VoteProgressState = {
  inProgress: boolean;
};

/**
 * Port of upstream `VoteInProgress`.
 * Role: Returns whether a vote is currently active.
 * Upstream: zvote.h:35
 */
export function voteInProgress(state: VoteProgressState): boolean {
  return state.inProgress;
}

/**
 * Port of upstream `SetVoteInProgress`.
 * Role: Updates whether a vote is currently active.
 * Upstream: zvote.h:45
 */
export function setVoteInProgress(
  state: VoteProgressState,
  inProgress: boolean,
): void {
  state.inProgress = inProgress;
}

/**
 * Port of upstream `vote_in_progress_img` initialization state.
 * Role: Holds the prepared vote-in-progress panel image metadata.
 * Upstream: zvote.cpp:13-17
 */
export type VoteInProgressImageState = {
  voteInProgressImagePath: string;
  voteInProgressImageAlphable: boolean;
};

/**
 * Port of upstream `ZVote::Init`.
 * Role: Prepares the vote-in-progress panel image for translucent rendering.
 * Upstream: zvote.cpp:13-17
 */
export function initializeVotePresentation(
  state: VoteInProgressImageState,
): void {
  state.voteInProgressImagePath = VOTE_IN_PROGRESS_IMAGE_PATH;
  state.voteInProgressImageAlphable = true;
}

/**
 * Port of upstream `value`.
 * Role: Stores the numeric payload associated with the current vote.
 * Upstream: zvote.h:44
 */
export type VoteValueState = {
  value: number;
};

/**
 * Port of upstream `GetVoteValue`.
 * Role: Returns the numeric payload associated with the current vote.
 * Upstream: zvote.h:42
 */
export function getVoteValue(state: VoteValueState): number {
  return state.value;
}

/**
 * Port of upstream `SetVoteValue`.
 * Role: Updates the numeric payload associated with the current vote.
 * Upstream: zvote.h:44
 */
export function setVoteValue(state: VoteValueState, value: number): void {
  state.value = value;
}

/**
 * Port of upstream `ZVote::ResetVote` state surface.
 * Role: Holds the active vote status, type, and numeric payload.
 * Upstream: zvote.cpp:124-129
 */
export type VoteResetState = VoteProgressState &
  VoteValueState & {
    voteType: VoteType | number;
  };

/**
 * Port of upstream `ZVote::ResetVote`.
 * Role: Clears the active vote status, vote type, and numeric payload.
 * Upstream: zvote.cpp:124-129
 */
export function resetVote(state: VoteResetState): void {
  state.inProgress = false;
  state.voteType = -1;
  state.value = -1;
}

/**
 * Port of upstream `end_time`.
 * Role: Stores the absolute time when the current vote expires.
 * Upstream: zvote.h:47
 */
export type VoteTimeState = {
  startTime?: number;
  endTime: number;
};

/**
 * Port of upstream `ZVote::StartVote` state surface.
 * Role: Holds active vote status, kind, payload, and timing fields.
 * Upstream: zvote.cpp:98-109
 */
export type VoteStartState = VoteProgressState &
  VoteValueState &
  VoteTimeState & {
    voteType: VoteType | number;
    startTime: number;
  };

/**
 * Port of upstream `ZVote::StartVote`.
 * Role: Starts a vote unless another vote is already in progress.
 * Upstream: zvote.cpp:98-109
 */
export function startVote(
  state: VoteStartState,
  voteType: VoteType | number,
  value: number,
  now: () => number = currentTime,
): boolean {
  if (state.inProgress) return false;

  state.inProgress = true;
  state.voteType = voteType;
  state.value = value;
  state.startTime = now();
  state.endTime = state.startTime + MAX_VOTE_TIME_SECONDS;

  return true;
}

/**
 * Port of upstream `ZVote::TimeExpired`.
 * Role: Reports whether the current time has reached the vote end time.
 * Upstream: zvote.cpp:111-114
 */
export function voteTimeExpired(state: VoteTimeState, now: number): boolean {
  return now >= state.endTime;
}

/**
 * Port of upstream `max_description_len`.
 * Role: Defines the maximum rendered vote description width.
 * Upstream: zvote.cpp:59
 */
export const VOTE_DESCRIPTION_MAX_WIDTH_PIXELS = 104;
