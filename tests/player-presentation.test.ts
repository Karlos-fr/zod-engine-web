import { describe, expect, it } from "vitest";
import { SimulationTime } from "../src/simulation/SimulationTime";
import {
  createMouseButtonInfo,
  isPastSpaceBarEventLifetime,
  PLAYER_ASCII_DOWN_MAX,
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
  setPlayerSelectionZTime,
  SpaceBarEvent,
  ZPLAYER_HEADER_GUARD_PORTED,
} from "../src/simulation/PlayerPresentation";
import type { PlayerKeyEvent } from "../src/simulation/PlayerPresentation";

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

  it("adapts the lowercase ASCII key state count", () => {
    expect(PLAYER_ASCII_DOWN_MAX).toBe(26);
  });

  it("ports player key events", () => {
    const event: PlayerKeyEvent = {
      theKey: 97,
      theUnicode: 65,
    };

    expect(event).toEqual({
      theKey: 97,
      theUnicode: 65,
    });
  });

  it("ports cleared mouse button interaction state", () => {
    expect(createMouseButtonInfo()).toEqual({
      x: 0,
      y: 0,
      mapX: 0,
      mapY: 0,
      down: false,
      startedOverHud: false,
      startedOverGui: false,
    });
  });

  it("ports space-bar event lifetime expiry", () => {
    const event = { creationTime: 20 };

    expect(isPastSpaceBarEventLifetime(event, 29.999)).toBe(false);
    expect(isPastSpaceBarEventLifetime(event, 30)).toBe(false);
    expect(isPastSpaceBarEventLifetime(event, 30.001)).toBe(true);
  });

  it("ports SpaceBarEvent default construction", () => {
    expect(new SpaceBarEvent(undefined, undefined, undefined, 20)).toEqual({
      refId: -1,
      selectObject: false,
      openGui: false,
      creationTime: 20,
    });
  });

  it("ports SpaceBarEvent configured construction", () => {
    expect(new SpaceBarEvent(42, true, true, 20)).toEqual({
      refId: 42,
      selectObject: true,
      openGui: true,
      creationTime: 20,
    });
  });

  it("ports SpaceBarEvent clear without changing creation time", () => {
    const event = new SpaceBarEvent(42, true, true, 20);

    event.clear();

    expect(event).toEqual({
      refId: -1,
      selectObject: false,
      openGui: false,
      creationTime: 20,
    });
  });

  it("ports SpaceBarEvent past_lifetime using the stored creation time", () => {
    const event = new SpaceBarEvent(42, false, false, 20);

    expect(event.pastLifetime(30)).toBe(false);
    expect(event.pastLifetime(30.001)).toBe(true);
  });

  it("ports SpaceBarEvent equality by reference id only", () => {
    const event = new SpaceBarEvent(42, true, false, 20);
    const matchingEvent = new SpaceBarEvent(42, false, true, 99);
    const otherEvent = new SpaceBarEvent(7, true, false, 20);

    expect(event.equals(event)).toBe(true);
    expect(event.equals(matchingEvent)).toBe(true);
    expect(event.equals(otherEvent)).toBe(false);
  });

  it("ports selection_info::SetZTime as simulation clock reference assignment", () => {
    const ztime = new SimulationTime();
    const state = { ztime: null };

    setPlayerSelectionZTime(state, ztime);

    expect(state.ztime).toBe(ztime);
  });
});
