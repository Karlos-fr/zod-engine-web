import { describe, expect, it } from "vitest";
import {
  BOT_CRANE_TARGET_MAX_LINE_DISTANCE_PIXELS,
  BOT_CRANE_TARGET_MAX_TOTAL_DISTANCE_PIXELS,
  BOT_MAX_BUILD_COMBO_CHECK,
  BOT_MAX_GUNS_BUILDING_RATIO,
  ZBOT_HEADER_GUARD_PORTED,
} from "../src/simulation/BotAI";

describe("bot AI", () => {
  it("adapts the zbot.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/BotAI");
    const secondImport = await import("../src/simulation/BotAI");

    expect(ZBOT_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZBOT_HEADER_GUARD_PORTED).toBe(firstImport.ZBOT_HEADER_GUARD_PORTED);
  });

  it("ports crane target culling distance limits", () => {
    expect(BOT_CRANE_TARGET_MAX_LINE_DISTANCE_PIXELS).toBe(14 * 16);
    expect(BOT_CRANE_TARGET_MAX_TOTAL_DISTANCE_PIXELS).toBe(42 * 16);
  });

  it("ports build-order heuristic limits", () => {
    expect(BOT_MAX_GUNS_BUILDING_RATIO).toBe(0.35);
    expect(BOT_MAX_BUILD_COMBO_CHECK).toBe(6);
  });
});
