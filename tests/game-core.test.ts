import { describe, expect, it } from "vitest";
import {
  allowCoreRun,
  GAMES_PER_VOTING_POWER_POINT,
  PlayerVoteChoice,
  ZCORE_HEADER_GUARD_PORTED,
} from "../src/simulation/GameCore";
import type { CoreRunPermissionState } from "../src/simulation/GameCore";

describe("game core", () => {
  it("adapts the zcore.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/GameCore");
    const secondImport = await import("../src/simulation/GameCore");

    expect(ZCORE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZCORE_HEADER_GUARD_PORTED).toBe(firstImport.ZCORE_HEADER_GUARD_PORTED);
  });

  it("ports games_per_vp as the voting-power progression interval", () => {
    expect(GAMES_PER_VOTING_POWER_POINT).toBe(5);
  });

  it("ports player vote choices", () => {
    expect(PlayerVoteChoice.Null).toBe(0);
    expect(PlayerVoteChoice.Yes).toBe(1);
    expect(PlayerVoteChoice.No).toBe(2);
    expect(PlayerVoteChoice.Pass).toBe(3);
    expect(PlayerVoteChoice.MaxVoteChoices).toBe(4);
  });

  it("ports AllowRun defaulting to true", () => {
    const state: CoreRunPermissionState = { allowRun: false };

    allowCoreRun(state);

    expect(state.allowRun).toBe(true);
  });

  it("ports AllowRun with an explicit value", () => {
    const state: CoreRunPermissionState = { allowRun: true };

    allowCoreRun(state, false);

    expect(state.allowRun).toBe(false);
  });
});
