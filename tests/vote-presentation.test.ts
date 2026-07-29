import { describe, expect, it } from "vitest";
import {
  getVoteType,
  getVoteValue,
  initializeVotePresentation,
  MAX_VOTE_TIME_SECONDS,
  resetVote,
  setVoteInProgress,
  setVoteType,
  setVoteValue,
  startVote,
  VOTE_DESCRIPTION_MAX_WIDTH_PIXELS,
  VOTE_IN_PROGRESS_IMAGE_PATH,
  voteInProgress,
  voteTimeExpired,
  VoteType,
  ZVOTE_HEADER_GUARD_PORTED,
} from "../src/simulation/VotePresentation";
import type {
  VoteProgressState,
  VoteInProgressImageState,
  VoteResetState,
  VoteStartState,
  VoteTimeState,
  VoteTypeState,
  VoteValueState,
} from "../src/simulation/VotePresentation";

describe("vote presentation", () => {
  it("adapts the zvote.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/VotePresentation");
    const secondImport = await import("../src/simulation/VotePresentation");

    expect(ZVOTE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZVOTE_HEADER_GUARD_PORTED).toBe(
      firstImport.ZVOTE_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the maximum vote duration", () => {
    expect(MAX_VOTE_TIME_SECONDS).toBe(30);
  });

  it("ports the vote-in-progress panel image path", () => {
    expect(VOTE_IN_PROGRESS_IMAGE_PATH).toBe(
      "assets/other/menus/vote_in_progress.png",
    );
  });

  it("ports vote types", () => {
    expect(VoteType.Pause).toBe(0);
    expect(VoteType.ChangeMap).toBe(2);
    expect(VoteType.StopBot).toBe(4);
    expect(VoteType.ChangeGameSpeed).toBe(7);
    expect(VoteType.MaxVoteTypes).toBe(8);
  });

  it("ports the maximum rendered vote description width", () => {
    expect(VOTE_DESCRIPTION_MAX_WIDTH_PIXELS).toBe(112 - 8);
  });

  it("ports the vote type getter", () => {
    const state: VoteTypeState = { voteType: VoteType.ChangeGameSpeed };

    expect(getVoteType(state)).toBe(VoteType.ChangeGameSpeed);
  });

  it("ports ZVote SetVoteType as bounded vote type assignment", () => {
    const state: VoteTypeState = { voteType: -1 };

    setVoteType(state, VoteType.ChangeMap);
    expect(state.voteType).toBe(VoteType.ChangeMap);
    expect(getVoteType(state)).toBe(VoteType.ChangeMap);

    setVoteType(state, -2);
    expect(state.voteType).toBe(-1);

    setVoteType(state, VoteType.MaxVoteTypes);
    expect(state.voteType).toBe(-1);
  });

  it("ports the vote in-progress setter", () => {
    const state: VoteProgressState = { inProgress: false };

    setVoteInProgress(state, true);
    expect(state.inProgress).toBe(true);
    expect(voteInProgress(state)).toBe(true);

    setVoteInProgress(state, false);
    expect(state.inProgress).toBe(false);
    expect(voteInProgress(state)).toBe(false);
  });

  it("ports ZVote Init as vote panel image preparation", () => {
    const state: VoteInProgressImageState = {
      voteInProgressImagePath: "",
      voteInProgressImageAlphable: false,
    };

    initializeVotePresentation(state);

    expect(state).toEqual({
      voteInProgressImagePath: VOTE_IN_PROGRESS_IMAGE_PATH,
      voteInProgressImageAlphable: true,
    });
  });

  it("ports the vote value setter", () => {
    const state: VoteValueState = { value: 0 };

    setVoteValue(state, 7);

    expect(state.value).toBe(7);
    expect(getVoteValue(state)).toBe(7);
  });

  it("ports ZVote ResetVote as clearing active vote state", () => {
    const state: VoteResetState = {
      inProgress: true,
      voteType: VoteType.ResetGame,
      value: 5,
    };

    resetVote(state);

    expect(state).toEqual({
      inProgress: false,
      voteType: -1,
      value: -1,
    });
  });

  it("ports ZVote StartVote as active vote initialization", () => {
    const state: VoteStartState = {
      inProgress: false,
      voteType: -1,
      value: -1,
      startTime: 0,
      endTime: 0,
    };

    expect(startVote(state, VoteType.ChangeMap, 7, () => 12.5)).toBe(true);
    expect(state).toEqual({
      inProgress: true,
      voteType: VoteType.ChangeMap,
      value: 7,
      startTime: 12.5,
      endTime: 12.5 + MAX_VOTE_TIME_SECONDS,
    });
  });

  it("ports ZVote StartVote as rejecting an already active vote", () => {
    const state: VoteStartState = {
      inProgress: true,
      voteType: VoteType.Pause,
      value: 1,
      startTime: 5,
      endTime: 35,
    };

    expect(startVote(state, VoteType.ResetGame, 9, () => 99)).toBe(false);
    expect(state).toEqual({
      inProgress: true,
      voteType: VoteType.Pause,
      value: 1,
      startTime: 5,
      endTime: 35,
    });
  });

  it("ports ZVote TimeExpired as current time reaching end time", () => {
    const state: VoteTimeState = { endTime: 42.5 };

    expect(voteTimeExpired(state, 42.499)).toBe(false);
    expect(voteTimeExpired(state, 42.5)).toBe(true);
    expect(voteTimeExpired(state, 43)).toBe(true);
  });
});
