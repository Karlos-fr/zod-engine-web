import { describe, expect, it } from "vitest";
import {
  getVoteType,
  getVoteValue,
  MAX_VOTE_TIME_SECONDS,
  setVoteInProgress,
  setVoteValue,
  VOTE_DESCRIPTION_MAX_WIDTH_PIXELS,
  voteInProgress,
  VoteType,
  ZVOTE_HEADER_GUARD_PORTED,
} from "../src/simulation/VotePresentation";
import type {
  VoteProgressState,
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

  it("ports the vote in-progress setter", () => {
    const state: VoteProgressState = { inProgress: false };

    setVoteInProgress(state, true);
    expect(state.inProgress).toBe(true);
    expect(voteInProgress(state)).toBe(true);

    setVoteInProgress(state, false);
    expect(state.inProgress).toBe(false);
    expect(voteInProgress(state)).toBe(false);
  });

  it("ports the vote value setter", () => {
    const state: VoteValueState = { value: 0 };

    setVoteValue(state, 7);

    expect(state.value).toBe(7);
    expect(getVoteValue(state)).toBe(7);
  });
});
