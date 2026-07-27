import { describe, expect, it } from "vitest";
import { PLAYER_NEWS_ENTRY_DURATION_SECONDS } from "../src/simulation/PlayerEvents";

describe("player events", () => {
  it("ports the news entry display duration", () => {
    expect(PLAYER_NEWS_ENTRY_DURATION_SECONDS).toBe(10.0);
  });
});
