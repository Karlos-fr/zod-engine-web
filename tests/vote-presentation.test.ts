import { describe, expect, it } from "vitest";
import {
  MAX_VOTE_TIME_SECONDS,
  VOTE_DESCRIPTION_MAX_WIDTH_PIXELS,
  ZVOTE_HEADER_GUARD_PORTED,
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

  it("ports the maximum rendered vote description width", () => {
    expect(VOTE_DESCRIPTION_MAX_WIDTH_PIXELS).toBe(112 - 8);
  });
});
