import { describe, expect, it } from "vitest";
import {
  PLAYER_GRAPHICS_LOAD_ITEM_COUNT,
  PLAYER_MAX_NEWS_HISTORY,
  PLAYER_MAX_STORED_SPACE_BAR_EVENTS,
  PLAYER_NEWS_ACTIVE_DURATION_SECONDS,
  PLAYER_NEWS_FADE_START_SECONDS,
  PLAYER_NEWS_ROW_SPACING_PIXELS,
  PLAYER_SCROLL_SPEED_PIXELS_PER_SECOND,
  PLAYER_SELECTION_SHIFT_TICK_SECONDS,
  PLAYER_SPACE_BAR_EVENT_LIFETIME_SECONDS,
  PLAYER_SPLASH_FADE_PER_SECOND,
  ZPLAYER_HEADER_GUARD_PORTED,
} from "../src/simulation/PlayerPresentation";

describe("player presentation constants", () => {
  it("adapts the zplayer.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/PlayerPresentation");
    const secondImport = await import("../src/simulation/PlayerPresentation");

    expect(ZPLAYER_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZPLAYER_HEADER_GUARD_PORTED).toBe(
      firstImport.ZPLAYER_HEADER_GUARD_PORTED,
    );
  });

  it("ports the graphics load progress item count", () => {
    expect(PLAYER_GRAPHICS_LOAD_ITEM_COUNT).toBe(81);
  });

  it("ports the player news timing and layout constants", () => {
    expect(PLAYER_NEWS_ACTIVE_DURATION_SECONDS).toBe(17.0);
    expect(PLAYER_NEWS_ROW_SPACING_PIXELS).toBe(15);
    expect(PLAYER_NEWS_FADE_START_SECONDS).toBe(5);
    expect(PLAYER_MAX_NEWS_HISTORY).toBe(50);
  });

  it("ports the player interaction animation constants", () => {
    expect(PLAYER_SELECTION_SHIFT_TICK_SECONDS).toBe(0.1);
    expect(PLAYER_SCROLL_SPEED_PIXELS_PER_SECOND).toBe(400);
    expect(PLAYER_SPLASH_FADE_PER_SECOND).toBe(5);
  });

  it("adapts the space-bar focus event retention constants", () => {
    expect(PLAYER_MAX_STORED_SPACE_BAR_EVENTS).toBe(5);
    expect(PLAYER_SPACE_BAR_EVENT_LIFETIME_SECONDS).toBe(10);
  });
});
