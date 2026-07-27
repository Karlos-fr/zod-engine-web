import { describe, expect, it } from "vitest";
import {
  MAIN_MENU_RADIO_CENTER_SELECTOR_OFFSET_PIXELS,
  MAIN_MENU_RADIO_LEFT_SELECTOR_OFFSET_PIXELS,
  MAIN_MENU_RADIO_RIGHT_SELECTOR_OFFSET_PIXELS,
} from "../src/ui/MainMenuRadio";

describe("main menu radio", () => {
  it("ports lx as the first-segment selector x-offset", () => {
    expect(MAIN_MENU_RADIO_LEFT_SELECTOR_OFFSET_PIXELS).toBe(7);
  });

  it("ports cx as the middle-segment selector x-offset", () => {
    expect(MAIN_MENU_RADIO_CENTER_SELECTOR_OFFSET_PIXELS).toBe(4);
  });

  it("ports rx as the last-segment selector x-offset", () => {
    expect(MAIN_MENU_RADIO_RIGHT_SELECTOR_OFFSET_PIXELS).toBe(4);
  });
});
