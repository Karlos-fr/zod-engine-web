import { describe, expect, it } from "vitest";
import {
  clearMainMenuListEntry,
  clickMainMenuWidget,
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
  MainMenuWidgetFlag,
  MainMenuWidgetType,
  ZGUI_MAIN_MENU_WIDGETS_HEADER_GUARD_PORTED,
  checkMainMenuRadioSelectedIndex,
  getMainMenuWidgetHeight,
  getMainMenuRadioSelected,
  getMainMenuWidgetRefId,
  getMainMenuWidgetType,
  getMainMenuWidgetWidth,
  isMainMenuWidgetActive,
  keyPressMainMenuWidget,
  motionMainMenuWidget,
  processMainMenuWidget,
  setMainMenuButtonGreen,
  setMainMenuButtonText,
  setMainMenuLabelFont,
  setMainMenuLabelJustification,
  setMainMenuRadioSelected,
  setMainMenuTextBoxGoodCharsOnly,
  setMainMenuTextBoxMaxText,
  setMainMenuTextBoxPassworded,
  setMainMenuTextBoxSelected,
  setMainMenuTextBoxText,
  setMainMenuWidgetActive,
  setMainMenuWidgetCoords,
  setMainMenuWidgetDimensions,
  toggleMainMenuWidgetActive,
  unclickMainMenuWidget,
  wheelDownMainMenuList,
  wheelDownMainMenuWidget,
  wheelUpMainMenuList,
  wheelUpMainMenuWidget,
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

  it("ports ZGMMWidget::Process as a base no-op hook", () => {
    expect(processMainMenuWidget()).toBeUndefined();
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

  it("ports gmmw_flag default construction through clear", () => {
    expect(new MainMenuWidgetFlag()).toEqual({
      listEntrySelected: -1,
      radioSelectionIndexSelected: -1,
    });
  });

  it("ports gmmw_flag clear as widget selection reset", () => {
    const flag = new MainMenuWidgetFlag();
    flag.listEntrySelected = 2;
    flag.radioSelectionIndexSelected = 3;

    flag.clear();

    expect(flag).toEqual({
      listEntrySelected: -1,
      radioSelectionIndexSelected: -1,
    });
  });

  it("ports mmlist_entry clear as list entry reset", () => {
    const entry = {
      text: "Alpha",
      refId: 42,
      sortNumber: 7,
      state: MainMenuListState.Pressed,
    };

    clearMainMenuListEntry(entry);

    expect(entry).toEqual({
      text: "",
      refId: -1,
      sortNumber: -1,
      state: MainMenuListState.Normal,
    });
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

  it("ports ZGMMWidget::SetDimensions as widget dimension assignment", () => {
    const state = { width: 0, height: 0 };

    setMainMenuWidgetDimensions(state, 80, 20);

    expect(state).toEqual({ width: 80, height: 20 });
  });

  it("ports ZGMMWidget::GetWidgetType as a widget kind accessor", () => {
    expect(
      getMainMenuWidgetType({
        widgetType: MainMenuWidgetType.TextBox,
      }),
    ).toBe(MainMenuWidgetType.TextBox);
  });

  it("ports ZGMMWidget::GetRefID as a widget reference read", () => {
    expect(getMainMenuWidgetRefId({ refId: 42 })).toBe(42);
  });

  it("ports ZGMMWidget::IsActive as widget active-state read", () => {
    expect(isMainMenuWidgetActive({ active: true })).toBe(true);
    expect(isMainMenuWidgetActive({ active: false })).toBe(false);
  });

  it("ports ZGMMWidget::SetActive as widget active-state assignment", () => {
    const state = { active: false };

    setMainMenuWidgetActive(state, true);
    expect(state.active).toBe(true);

    setMainMenuWidgetActive(state, false);
    expect(state.active).toBe(false);
  });

  it("ports ZGMMWidget::SetCoords as widget coordinate assignment", () => {
    const state = { x: 0, y: 0 };

    setMainMenuWidgetCoords(state, 30, 40);

    expect(state).toEqual({ x: 30, y: 40 });
  });

  it("ports ZGMMWidget::Click as a default unhandled click", () => {
    expect(clickMainMenuWidget(30, 40)).toBe(false);
  });

  it("ports ZGMMWidget::UnClick as a default unhandled unclick", () => {
    expect(unclickMainMenuWidget(30, 40)).toBe(false);
  });

  it("ports ZGMMWidget::Motion as a default unhandled pointer motion", () => {
    expect(motionMainMenuWidget(30, 40)).toBe(false);
  });

  it("ports ZGMMWidget::KeyPress as a default unhandled key input", () => {
    expect(keyPressMainMenuWidget(65)).toBe(false);
  });

  it("ports ZGMMWidget::WheelUpButton as default unhandled wheel-up input", () => {
    expect(wheelUpMainMenuWidget()).toBe(false);
  });

  it("ports GMMWList::WheelUpButton as MoveUp forwarding", () => {
    let calls = 0;

    const handled = wheelUpMainMenuList({
      moveUp() {
        calls += 1;
        return true;
      },
    });

    expect(handled).toBe(true);
    expect(calls).toBe(1);
  });

  it("ports ZGMMWidget::WheelDownButton as default unhandled wheel-down input", () => {
    expect(wheelDownMainMenuWidget()).toBe(false);
  });

  it("ports GMMWList::WheelDownButton as MoveDown forwarding", () => {
    let calls = 0;

    const handled = wheelDownMainMenuList({
      moveDown() {
        calls += 1;
        return true;
      },
    });

    expect(handled).toBe(true);
    expect(calls).toBe(1);
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

  it("ports GMMWButton::SetText as button text with rerender", () => {
    const state = { text: "", rerenderText: false };

    setMainMenuButtonText(state, "Launch");

    expect(state).toEqual({ text: "Launch", rerenderText: true });
  });

  it("ports GMMWTextBox::SetText as text-box text with rerender", () => {
    const state = { text: "", doRerender: false };

    setMainMenuTextBoxText(state, "hello");

    expect(state).toEqual({ text: "hello", doRerender: true });
  });

  it("ports GMMWTextBox::SetSelected as text-box selection with rerender", () => {
    const state = { selected: false, doRerender: false };

    setMainMenuTextBoxSelected(state, true);

    expect(state).toEqual({ selected: true, doRerender: true });
  });

  it("ports GMMWTextBox::SetMaxText as text-box maximum length state", () => {
    const state = { maxText: 0 };

    setMainMenuTextBoxMaxText(state, 16);

    expect(state.maxText).toBe(16);
  });

  it("ports GMMWTextBox::SetPassworded as password masking state with rerender", () => {
    const state = { passworded: false, doRerender: false };

    setMainMenuTextBoxPassworded(state, true);

    expect(state).toEqual({ passworded: true, doRerender: true });
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

  it("ports GMMWRadio::GetSelected as selected radio index read", () => {
    expect(getMainMenuRadioSelected({ selectedIndex: 2 })).toBe(2);
  });

  it("ports GMMWRadio::CheckSI as selected radio index validation", () => {
    const valid = { selectedIndex: 1, selections: 3 };
    checkMainMenuRadioSelectedIndex(valid);
    expect(valid.selectedIndex).toBe(1);

    const negative = { selectedIndex: -1, selections: 3 };
    checkMainMenuRadioSelectedIndex(negative);
    expect(negative.selectedIndex).toBe(0);

    const tooHigh = { selectedIndex: 3, selections: 3 };
    checkMainMenuRadioSelectedIndex(tooHigh);
    expect(tooHigh.selectedIndex).toBe(0);
  });

  it("ports GMMWRadio::SetSelected as selected radio index assignment with validation", () => {
    const state = { selectedIndex: 0, selections: 3 };

    setMainMenuRadioSelected(state, 2);
    expect(state.selectedIndex).toBe(2);

    setMainMenuRadioSelected(state, 4);
    expect(state.selectedIndex).toBe(0);
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
