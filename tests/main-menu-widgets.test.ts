import { describe, expect, it } from "vitest";
import {
  MAIN_MENU_BUTTON_HEIGHT_PIXELS,
  MAIN_MENU_LABEL_HEIGHT_PIXELS,
  MAIN_MENU_LIST_DOWN_BUTTON_BOTTOM_OFFSET_PIXELS,
  MAIN_MENU_LIST_DOWN_BUTTON_RIGHT_OFFSET_PIXELS,
  MAIN_MENU_LIST_ENTRY_HEIGHT_PIXELS,
  MAIN_MENU_LIST_MIN_ENTRIES,
  MAIN_MENU_LIST_SCROLLER_RIGHT_OFFSET_PIXELS,
  MAIN_MENU_LIST_UP_BUTTON_RIGHT_OFFSET_PIXELS,
  MAIN_MENU_LIST_UP_BUTTON_TOP_OFFSET_PIXELS,
  MAIN_MENU_RADIO_CENTER_WIDTH_PIXELS,
  MAIN_MENU_RADIO_HEIGHT_PIXELS,
  MAIN_MENU_RADIO_LEFT_WIDTH_PIXELS,
  MAIN_MENU_RADIO_MIN_SELECTIONS,
  MAIN_MENU_RADIO_RIGHT_WIDTH_PIXELS,
  MAIN_MENU_TEAM_COLOR_HEIGHT_PIXELS,
  MAIN_MENU_TEAM_COLOR_WIDTH_PIXELS,
  MAIN_MENU_TEXT_BOX_HEIGHT_PIXELS,
  MainMenuButtonState,
  MainMenuButtonType,
  MainMenuLabelJustifyType,
  MainMenuListState,
  MainMenuWidgetType,
  ZGUI_MAIN_MENU_WIDGETS_HEADER_GUARD_PORTED,
  getMainMenuWidgetHeight,
  getMainMenuWidgetType,
  getMainMenuWidgetWidth,
  setMainMenuButtonGreen,
  setMainMenuLabelFont,
  setMainMenuLabelJustification,
  setMainMenuTextBoxGoodCharsOnly,
  toggleMainMenuWidgetActive,
} from "../src/ui/MainMenuWidgets";

describe("main menu widgets", () => {
  it("adapts the zgui_main_menu_widgets.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/ui/MainMenuWidgets");
    const secondImport = await import("../src/ui/MainMenuWidgets");

    expect(ZGUI_MAIN_MENU_WIDGETS_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZGUI_MAIN_MENU_WIDGETS_HEADER_GUARD_PORTED).toBe(
      firstImport.ZGUI_MAIN_MENU_WIDGETS_HEADER_GUARD_PORTED,
    );
  });

  it("adapts button, label, team-color, and text-box dimensions", () => {
    expect(MAIN_MENU_BUTTON_HEIGHT_PIXELS).toBe(15);
    expect(MAIN_MENU_LABEL_HEIGHT_PIXELS).toBe(10);
    expect(MAIN_MENU_TEAM_COLOR_WIDTH_PIXELS).toBe(19);
    expect(MAIN_MENU_TEAM_COLOR_HEIGHT_PIXELS).toBe(12);
    expect(MAIN_MENU_TEXT_BOX_HEIGHT_PIXELS).toBe(14);
  });

  it("ports mmlabel_justify_type identifiers", () => {
    expect(MainMenuLabelJustifyType.Normal).toBe(0);
    expect(MainMenuLabelJustifyType.Center).toBe(1);
    expect(MainMenuLabelJustifyType.Right).toBe(2);
    expect(MainMenuLabelJustifyType.MaxLabelJustifies).toBe(3);
  });

  it("ports mmwidget_type identifiers", () => {
    expect(MainMenuWidgetType.Unknown).toBe(0);
    expect(MainMenuWidgetType.Button).toBe(1);
    expect(MainMenuWidgetType.Label).toBe(2);
    expect(MainMenuWidgetType.List).toBe(3);
    expect(MainMenuWidgetType.Radio).toBe(4);
    expect(MainMenuWidgetType.TeamColor).toBe(5);
    expect(MainMenuWidgetType.TextBox).toBe(6);
    expect(MainMenuWidgetType.MaxWidgets).toBe(7);
  });

  it("ports mmbutton_type identifiers", () => {
    expect(MainMenuButtonType.Generic).toBe(0);
    expect(MainMenuButtonType.Close).toBe(1);
    expect(MainMenuButtonType.MaxButtonTypes).toBe(2);
  });

  it("ports mmbutton_state identifiers", () => {
    expect(MainMenuButtonState.Normal).toBe(0);
    expect(MainMenuButtonState.Pressed).toBe(1);
    expect(MainMenuButtonState.Green).toBe(2);
    expect(MainMenuButtonState.MaxButtonStates).toBe(3);
  });

  it("ports ZGMMWidget::GetWidth as a widget width accessor", () => {
    expect(getMainMenuWidgetWidth({ width: 42 })).toBe(42);
  });

  it("ports ZGMMWidget::GetHeight as a widget height accessor", () => {
    expect(getMainMenuWidgetHeight({ height: 17 })).toBe(17);
  });

  it("ports ZGMMWidget::GetWidgetType as a widget kind accessor", () => {
    expect(
      getMainMenuWidgetType({
        widgetType: MainMenuWidgetType.TextBox,
      }),
    ).toBe(MainMenuWidgetType.TextBox);
  });

  it("ports ZGMMWidget::ToggleActive as widget active state inversion", () => {
    const state = { active: false };

    toggleMainMenuWidgetActive(state);
    expect(state.active).toBe(true);

    toggleMainMenuWidgetActive(state);
    expect(state.active).toBe(false);
  });

  it("ports GMMWButton::SetGreen as button green state", () => {
    const state = { isGreen: false };

    setMainMenuButtonGreen(state, true);
    expect(state.isGreen).toBe(true);

    setMainMenuButtonGreen(state, false);
    expect(state.isGreen).toBe(false);
  });

  it("ports GMMWTextBox::SetGoodCharsOnly as text-box filter state", () => {
    const state = { goodCharsOnly: false, doRerender: false };

    setMainMenuTextBoxGoodCharsOnly(state, true);
    expect(state).toEqual({ goodCharsOnly: true, doRerender: true });

    state.doRerender = false;
    setMainMenuTextBoxGoodCharsOnly(state, false);
    expect(state).toEqual({ goodCharsOnly: false, doRerender: true });
  });

  it("ports GMMWLabel::SetJustification as label alignment state", () => {
    const state = { justification: MainMenuLabelJustifyType.Normal };

    setMainMenuLabelJustification(state, MainMenuLabelJustifyType.Right);

    expect(state.justification).toBe(MainMenuLabelJustifyType.Right);
  });

  it("ports GMMWLabel::SetFont as label font state", () => {
    const state = { font: 0 };

    setMainMenuLabelFont(state, 3);

    expect(state.font).toBe(3);
  });

  it("adapts list widget layout constants", () => {
    expect(MAIN_MENU_LIST_MIN_ENTRIES).toBe(4);
    expect(MAIN_MENU_LIST_ENTRY_HEIGHT_PIXELS).toBe(13);
    expect(MAIN_MENU_LIST_UP_BUTTON_TOP_OFFSET_PIXELS).toBe(3);
    expect(MAIN_MENU_LIST_UP_BUTTON_RIGHT_OFFSET_PIXELS).toBe(12);
    expect(MAIN_MENU_LIST_DOWN_BUTTON_BOTTOM_OFFSET_PIXELS).toBe(11);
    expect(MAIN_MENU_LIST_DOWN_BUTTON_RIGHT_OFFSET_PIXELS).toBe(12);
    expect(MAIN_MENU_LIST_SCROLLER_RIGHT_OFFSET_PIXELS).toBe(9);
  });

  it("ports mmlist_state identifiers", () => {
    expect(MainMenuListState.Normal).toBe(0);
    expect(MainMenuListState.Pressed).toBe(1);
    expect(MainMenuListState.MaxListStates).toBe(2);
  });

  it("adapts radio widget dimensions", () => {
    expect(MAIN_MENU_RADIO_HEIGHT_PIXELS).toBe(9);
    expect(MAIN_MENU_RADIO_LEFT_WIDTH_PIXELS).toBe(16);
    expect(MAIN_MENU_RADIO_CENTER_WIDTH_PIXELS).toBe(13);
    expect(MAIN_MENU_RADIO_RIGHT_WIDTH_PIXELS).toBe(15);
    expect(MAIN_MENU_RADIO_MIN_SELECTIONS).toBe(2);
  });
});
