import { describe, expect, it } from "vitest";
import {
  MAIN_MENU_LIST_ARROW_BUTTON_HEIGHT_PIXELS,
  MAIN_MENU_LIST_ARROW_BUTTON_WIDTH_PIXELS,
  MAIN_MENU_LIST_SCROLL_CLICKS_PER_SECOND,
} from "../src/ui/MainMenuListWidget";

describe("main menu list widget", () => {
  it("ports clicks_per_second as the held-scroll repeat rate", () => {
    expect(MAIN_MENU_LIST_SCROLL_CLICKS_PER_SECOND).toBe(30);
  });

  it("ports iw as the list arrow button hit-test width", () => {
    expect(MAIN_MENU_LIST_ARROW_BUTTON_WIDTH_PIXELS).toBe(11);
  });

  it("ports ih as the list arrow button hit-test height", () => {
    expect(MAIN_MENU_LIST_ARROW_BUTTON_HEIGHT_PIXELS).toBe(8);
  });
});
