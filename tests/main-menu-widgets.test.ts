import { describe, expect, it } from "vitest";
import { FontType } from "../src/rendering/FontEngine";
import {
  clearMainMenuListEntry,
  clickMainMenuButton,
  clickMainMenuRadio,
  clickMainMenuTextBox,
  clickMainMenuWidget,
  determineMainMenuButtonDimensions,
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
  MainMenuListEntry,
  MainMenuListState,
  MainMenuWidgetFlag,
  MainMenuWidgetType,
  ZGUI_MAIN_MENU_WIDGETS_HEADER_GUARD_PORTED,
  checkMainMenuListViewIndex,
  checkMainMenuRadioSelectedIndex,
  getFirstSelectedMainMenuListEntry,
  getMainMenuWidgetHeight,
  getMainMenuRadioSelected,
  getMainMenuWidgetRefId,
  getMainMenuWidgetType,
  getMainMenuWidgetWidth,
  initMainMenuRadio,
  initMainMenuTeamColor,
  initMainMenuTextBox,
  isMainMenuListEntryBefore,
  isMainMenuWidgetActive,
  keyPressMainMenuTextBox,
  makeMainMenuButtonTextImage,
  keyPressMainMenuWidget,
  makeMainMenuLabelTextImage,
  makeMainMenuTextBoxImage,
  moveDownMainMenuList,
  motionMainMenuWidget,
  moveUpMainMenuList,
  processMainMenuTextBox,
  processMainMenuWidget,
  renderMainMenuTeamColor,
  renderMainMenuWidget,
  setMainMenuButtonGreen,
  setMainMenuButtonText,
  setMainMenuButtonType,
  setMainMenuLabelFont,
  setMainMenuLabelJustification,
  setMainMenuLabelText,
  setMainMenuListHeight,
  setMainMenuListVisibleEntries,
  setMainMenuRadioMaxSelections,
  setMainMenuRadioSelected,
  setMainMenuTextBoxGoodCharsOnly,
  setMainMenuTextBoxMaxText,
  setMainMenuTextBoxPassworded,
  setMainMenuTextBoxSelected,
  setMainMenuTextBoxText,
  setMainMenuTeamColorTeam,
  setMainMenuWidgetActive,
  setMainMenuWidgetCoords,
  setMainMenuWidgetDimensions,
  toggleMainMenuWidgetActive,
  unclickMainMenuButton,
  unclickMainMenuList,
  unclickMainMenuWidget,
  unselectAllMainMenuListEntries,
  wheelDownMainMenuList,
  wheelDownMainMenuWidget,
  withinMainMenuListDownButton,
  withinMainMenuListEntry,
  withinMainMenuListUpButton,
  wheelUpMainMenuList,
  wheelUpMainMenuWidget,
  withinMainMenuWidgetDimensions,
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

  it("replaces ZGMMWidget::DoRender as the empty base render command list", () => {
    expect(renderMainMenuWidget()).toEqual([]);
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

  it("ports mmlist_entry default construction through clear", () => {
    expect(new MainMenuListEntry()).toEqual({
      text: "",
      refId: -1,
      sortNumber: -1,
      state: MainMenuListState.Normal,
    });
  });

  it("ports mmlist_entry configured construction", () => {
    expect(new MainMenuListEntry("Bravo", 12, 3)).toEqual({
      text: "Bravo",
      refId: 12,
      sortNumber: 3,
      state: MainMenuListState.Normal,
    });
  });

  it("ports sort_mmlist_entry_func as sort-number ordering", () => {
    expect(isMainMenuListEntryBefore({ sortNumber: 1 }, { sortNumber: 2 })).toBe(
      true,
    );
    expect(isMainMenuListEntryBefore({ sortNumber: 2 }, { sortNumber: 1 })).toBe(
      false,
    );
    expect(isMainMenuListEntryBefore({ sortNumber: 1 }, { sortNumber: 1 })).toBe(
      false,
    );
  });

  it("ports GMMWList::SetHeight as visible-entry height calculation", () => {
    const state = { visibleEntries: 4, height: 0 };

    setMainMenuListHeight(state);

    expect(state.height).toBe(3 + 4 * MAIN_MENU_LIST_ENTRY_HEIGHT_PIXELS + 2);
  });

  it("ports GMMWList::SetVisibleEntries as clamped entry count and height refresh", () => {
    const state = { visibleEntries: 4, height: 0 };

    setMainMenuListVisibleEntries(state, 2);
    expect(state).toEqual({
      visibleEntries: MAIN_MENU_LIST_MIN_ENTRIES,
      height: 3 + MAIN_MENU_LIST_MIN_ENTRIES * MAIN_MENU_LIST_ENTRY_HEIGHT_PIXELS + 2,
    });

    setMainMenuListVisibleEntries(state, 6);
    expect(state).toEqual({
      visibleEntries: 6,
      height: 3 + 6 * MAIN_MENU_LIST_ENTRY_HEIGHT_PIXELS + 2,
    });
  });

  it("ports GMMWList::GetFirstSelected as first pressed entry index", () => {
    const entries = [
      new MainMenuListEntry("Alpha", 1, 1),
      new MainMenuListEntry("Bravo", 2, 2),
      new MainMenuListEntry("Charlie", 3, 3),
    ];

    expect(getFirstSelectedMainMenuListEntry(entries)).toBe(-1);

    entries[2].state = MainMenuListState.Pressed;
    expect(getFirstSelectedMainMenuListEntry(entries)).toBe(2);

    entries[1].state = MainMenuListState.Pressed;
    expect(getFirstSelectedMainMenuListEntry(entries)).toBe(1);
  });

  it("ports GMMWList::UnSelectAll as clearing pressed entries except one", () => {
    const entries = [
      new MainMenuListEntry("Alpha", 1, 1),
      new MainMenuListEntry("Bravo", 2, 2),
      new MainMenuListEntry("Charlie", 3, 3),
    ];
    entries.forEach((entry) => {
      entry.state = MainMenuListState.Pressed;
    });

    unselectAllMainMenuListEntries(entries, 1);

    expect(entries.map((entry) => entry.state)).toEqual([
      MainMenuListState.Normal,
      MainMenuListState.Pressed,
      MainMenuListState.Normal,
    ]);
  });

  it("ports GMMWList::CheckViewI as first visible index clamping", () => {
    const state = {
      entries: [1, 2, 3, 4, 5],
      visibleEntries: 3,
      viewIndex: 4,
    };

    checkMainMenuListViewIndex(state);

    expect(state.viewIndex).toBe(2);

    state.viewIndex = -1;

    checkMainMenuListViewIndex(state);

    expect(state.viewIndex).toBe(0);

    state.entries = [1, 2];
    state.visibleEntries = 4;
    state.viewIndex = 3;

    checkMainMenuListViewIndex(state);

    expect(state.viewIndex).toBe(0);
  });

  it("ports GMMWList::MoveUp as first visible index decrement with floor", () => {
    const state = { viewIndex: 2 };

    expect(moveUpMainMenuList(state)).toBe(true);
    expect(state.viewIndex).toBe(1);

    state.viewIndex = 0;

    expect(moveUpMainMenuList(state)).toBe(false);
    expect(state.viewIndex).toBe(0);
  });

  it("ports GMMWList::MoveDown as first visible index increment with ceiling", () => {
    const state = {
      entries: [1, 2, 3, 4, 5],
      visibleEntries: 3,
      viewIndex: 0,
    };

    expect(moveDownMainMenuList(state)).toBe(true);
    expect(state.viewIndex).toBe(1);

    state.viewIndex = 2;

    expect(moveDownMainMenuList(state)).toBe(false);
    expect(state.viewIndex).toBe(2);

    state.entries = [1, 2];
    state.visibleEntries = 4;
    state.viewIndex = 0;

    expect(moveDownMainMenuList(state)).toBe(false);
    expect(state.viewIndex).toBe(0);
  });

  it("ports GMMWList::WithinUpButton as inclusive scroll-up button hit testing", () => {
    const state = { width: 120 };
    const buttonX = 120 - MAIN_MENU_LIST_UP_BUTTON_RIGHT_OFFSET_PIXELS;
    const buttonY = MAIN_MENU_LIST_UP_BUTTON_TOP_OFFSET_PIXELS;

    expect(withinMainMenuListUpButton(state, buttonX, buttonY)).toBe(true);
    expect(withinMainMenuListUpButton(state, buttonX + 11, buttonY + 8)).toBe(
      true,
    );
    expect(withinMainMenuListUpButton(state, buttonX - 1, buttonY)).toBe(false);
    expect(withinMainMenuListUpButton(state, buttonX, buttonY - 1)).toBe(false);
    expect(withinMainMenuListUpButton(state, buttonX + 12, buttonY + 8)).toBe(
      false,
    );
    expect(withinMainMenuListUpButton(state, buttonX + 11, buttonY + 9)).toBe(
      false,
    );
  });

  it("ports GMMWList::WithinDownButton as inclusive scroll-down button hit testing", () => {
    const state = { width: 120, height: 90 };
    const buttonX = 120 - MAIN_MENU_LIST_DOWN_BUTTON_RIGHT_OFFSET_PIXELS;
    const buttonY = 90 - MAIN_MENU_LIST_DOWN_BUTTON_BOTTOM_OFFSET_PIXELS;

    expect(withinMainMenuListDownButton(state, buttonX, buttonY)).toBe(true);
    expect(withinMainMenuListDownButton(state, buttonX + 11, buttonY + 8)).toBe(
      true,
    );
    expect(withinMainMenuListDownButton(state, buttonX - 1, buttonY)).toBe(
      false,
    );
    expect(withinMainMenuListDownButton(state, buttonX, buttonY - 1)).toBe(
      false,
    );
    expect(withinMainMenuListDownButton(state, buttonX + 12, buttonY + 8)).toBe(
      false,
    );
    expect(withinMainMenuListDownButton(state, buttonX + 11, buttonY + 9)).toBe(
      false,
    );
  });

  it("ports GMMWList::UnClick as scroll-button release handling", () => {
    const state = {
      x: 10,
      y: 20,
      width: 120,
      height: 90,
      entries: [1, 2, 3, 4, 5],
      visibleEntries: 3,
      viewIndex: 1,
      upButtonState: MainMenuListState.Pressed,
      downButtonState: MainMenuListState.Normal,
    };

    const upX = state.x + state.width - MAIN_MENU_LIST_UP_BUTTON_RIGHT_OFFSET_PIXELS;
    const upY = state.y + MAIN_MENU_LIST_UP_BUTTON_TOP_OFFSET_PIXELS;

    expect(unclickMainMenuList(state, upX, upY)).toBe(true);
    expect(state.viewIndex).toBe(0);
    expect(state.upButtonState).toBe(MainMenuListState.Normal);
    expect(state.downButtonState).toBe(MainMenuListState.Normal);

    state.viewIndex = 0;
    state.downButtonState = MainMenuListState.Pressed;

    const downX =
      state.x + state.width - MAIN_MENU_LIST_DOWN_BUTTON_RIGHT_OFFSET_PIXELS;
    const downY =
      state.y + state.height - MAIN_MENU_LIST_DOWN_BUTTON_BOTTOM_OFFSET_PIXELS;

    expect(unclickMainMenuList(state, downX, downY)).toBe(true);
    expect(state.viewIndex).toBe(1);

    state.downButtonState = MainMenuListState.Pressed;

    expect(unclickMainMenuList(state, state.x, state.y)).toBe(false);
    expect(state.downButtonState).toBe(MainMenuListState.Normal);
  });

  it("ports GMMWList::WithinEntry as list-local entry hit testing", () => {
    const state = {
      width: 100,
      visibleEntries: 3,
      viewIndex: 2,
      entries: ["A", "B", "C", "D", "E", "F"],
      topImage: { width: 100, height: 3 },
      leftImage: { width: 4, height: 44 },
      rightImage: { width: 5, height: 44 },
    };

    expect(withinMainMenuListEntry(state, 4, 3)).toBe(2);
    expect(withinMainMenuListEntry(state, 91, 16)).toBe(3);
    expect(withinMainMenuListEntry(state, 50, 41)).toBe(4);

    expect(withinMainMenuListEntry(state, 3, 3)).toBe(-1);
    expect(withinMainMenuListEntry(state, 92, 3)).toBe(-1);
    expect(withinMainMenuListEntry(state, 4, 2)).toBe(-1);
    expect(withinMainMenuListEntry(state, 4, 42)).toBe(-1);
  });

  it("ports GMMWList::WithinEntry guard exits", () => {
    const state = {
      width: 100,
      visibleEntries: 3,
      viewIndex: 4,
      entries: ["A", "B", "C", "D", "E"],
      topImage: { width: 100, height: 3 },
      leftImage: { width: 4, height: 44 },
      rightImage: { width: 5, height: 44 },
    };

    expect(withinMainMenuListEntry({ ...state, topImage: null }, 4, 3)).toBe(-1);
    expect(withinMainMenuListEntry({ ...state, leftImage: null }, 4, 3)).toBe(
      -1,
    );
    expect(withinMainMenuListEntry(state, 4, 29)).toBe(-1);
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

  it("ports ZGMMWidget::WithinDimensions as inclusive widget hit testing", () => {
    const state = { x: 10, y: 20, width: 30, height: 40 };

    expect(withinMainMenuWidgetDimensions(state, 10, 20)).toBe(true);
    expect(withinMainMenuWidgetDimensions(state, 40, 60)).toBe(true);
    expect(withinMainMenuWidgetDimensions(state, 9, 20)).toBe(false);
    expect(withinMainMenuWidgetDimensions(state, 10, 19)).toBe(false);
    expect(withinMainMenuWidgetDimensions(state, 41, 60)).toBe(false);
    expect(withinMainMenuWidgetDimensions(state, 40, 61)).toBe(false);
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

  it("ports GMMWButton::MakeTextImage as skipped when text is current", () => {
    const state = {
      text: "Launch",
      textImage: { textureId: "old" },
      rerenderText: false,
    };
    const renderCalls: Array<{ font: FontType; text: string }> = [];

    makeMainMenuButtonTextImage(state, (font, text) => {
      renderCalls.push({ font, text });
      return { textureId: text };
    });

    expect(renderCalls).toEqual([]);
    expect(state).toEqual({
      text: "Launch",
      textImage: { textureId: "old" },
      rerenderText: false,
    });
  });

  it("ports GMMWButton::MakeTextImage as yellow menu text rendering", () => {
    const state = {
      text: "Launch",
      textImage: null as { textureId: string } | null,
      rerenderText: true,
    };
    const renderCalls: Array<{ font: FontType; text: string }> = [];

    makeMainMenuButtonTextImage(state, (font, text) => {
      renderCalls.push({ font, text });
      return { textureId: text };
    });

    expect(renderCalls).toEqual([{ font: FontType.YellowMenu, text: "Launch" }]);
    expect(state).toEqual({
      text: "Launch",
      textImage: { textureId: "Launch" },
      rerenderText: false,
    });
  });

  it("ports GMMWButton::MakeTextImage as unload for empty text", () => {
    const state = {
      text: "",
      textImage: { textureId: "old" } as { textureId: string } | null,
      rerenderText: true,
    };

    makeMainMenuButtonTextImage(state, () => {
      throw new Error("empty button text should not render");
    });

    expect(state).toEqual({
      text: "",
      textImage: null,
      rerenderText: false,
    });
  });

  it("ports GMMWButton::DetermineDimensions as close-button sizing", () => {
    const closeButton = {
      type: MainMenuButtonType.Close,
      width: 80,
      height: 15,
    };
    const genericButton = {
      type: MainMenuButtonType.Generic,
      width: 80,
      height: 15,
    };

    determineMainMenuButtonDimensions(closeButton);
    determineMainMenuButtonDimensions(genericButton);

    expect(closeButton).toEqual({
      type: MainMenuButtonType.Close,
      width: 12,
      height: 12,
    });
    expect(genericButton).toEqual({
      type: MainMenuButtonType.Generic,
      width: 80,
      height: 15,
    });
  });

  it("ports GMMWButton::SetType as type assignment with dimension refresh", () => {
    const state = {
      type: MainMenuButtonType.Generic,
      width: 80,
      height: 15,
    };

    setMainMenuButtonType(state, MainMenuButtonType.Close);

    expect(state).toEqual({
      type: MainMenuButtonType.Close,
      width: 12,
      height: 12,
    });
  });

  it("ports GMMWButton::Click as active bounds check and pressed state", () => {
    const state = {
      active: true,
      x: 10,
      y: 20,
      width: 30,
      height: 15,
      state: MainMenuButtonState.Normal,
    };

    expect(clickMainMenuButton(state, 10, 20)).toBe(true);
    expect(state.state).toBe(MainMenuButtonState.Pressed);

    state.state = MainMenuButtonState.Normal;
    expect(clickMainMenuButton(state, 41, 20)).toBe(false);
    expect(state.state).toBe(MainMenuButtonState.Normal);

    state.active = false;
    expect(clickMainMenuButton(state, 10, 20)).toBe(false);
    expect(state.state).toBe(MainMenuButtonState.Normal);
  });

  it("ports GMMWButton::UnClick as release reset with completed click detection", () => {
    const state = {
      active: true,
      x: 10,
      y: 20,
      width: 30,
      height: 15,
      state: MainMenuButtonState.Pressed,
    };

    expect(unclickMainMenuButton(state, 10, 20)).toBe(true);
    expect(state.state).toBe(MainMenuButtonState.Normal);

    state.state = MainMenuButtonState.Pressed;
    expect(unclickMainMenuButton(state, 41, 20)).toBe(false);
    expect(state.state).toBe(MainMenuButtonState.Normal);

    state.state = MainMenuButtonState.Pressed;
    state.active = false;
    expect(unclickMainMenuButton(state, 10, 20)).toBe(false);
    expect(state.state).toBe(MainMenuButtonState.Normal);
  });

  it("ports GMMWTextBox::SetText as text-box text with rerender", () => {
    const state = { text: "", doRerender: false };

    setMainMenuTextBoxText(state, "hello");

    expect(state).toEqual({ text: "hello", doRerender: true });
  });

  it("ports GMMWTextBox::Click as text-box hit testing", () => {
    const state = { x: 5, y: 6, width: 20, height: 10 };

    expect(clickMainMenuTextBox(state, 5, 6)).toBe(true);
    expect(clickMainMenuTextBox(state, 25, 16)).toBe(true);
    expect(clickMainMenuTextBox(state, 26, 16)).toBe(false);
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

  it("ports GMMWTextBox::KeyPress as unhandled when not selected", () => {
    const state = {
      selected: false,
      text: "ready",
      maxText: -1,
      goodCharsOnly: false,
      doRerender: false,
    };

    expect(keyPressMainMenuTextBox(state, "A".charCodeAt(0))).toBe(false);
    expect(state).toEqual({
      selected: false,
      text: "ready",
      maxText: -1,
      goodCharsOnly: false,
      doRerender: false,
    });
  });

  it("ports GMMWTextBox::KeyPress as backspace with rerender", () => {
    const state = {
      selected: true,
      text: "ready",
      maxText: -1,
      goodCharsOnly: false,
      doRerender: false,
    };

    expect(keyPressMainMenuTextBox(state, 8)).toBe(true);

    expect(state.text).toBe("read");
    expect(state.doRerender).toBe(true);
  });

  it("ports GMMWTextBox::KeyPress as selected character append", () => {
    const state = {
      selected: true,
      text: "A",
      maxText: -1,
      goodCharsOnly: false,
      doRerender: false,
    };

    expect(keyPressMainMenuTextBox(state, "b".charCodeAt(0))).toBe(true);

    expect(state.text).toBe("Ab");
    expect(state.doRerender).toBe(true);
  });

  it("ports GMMWTextBox::KeyPress max length as handled without rerender", () => {
    const state = {
      selected: true,
      text: "AB",
      maxText: 2,
      goodCharsOnly: false,
      doRerender: false,
    };

    expect(keyPressMainMenuTextBox(state, "C".charCodeAt(0))).toBe(true);

    expect(state.text).toBe("AB");
    expect(state.doRerender).toBe(false);
  });

  it("ports GMMWTextBox::KeyPress good-character filter as handled without rerender", () => {
    const state = {
      selected: true,
      text: "AB",
      maxText: -1,
      goodCharsOnly: true,
      doRerender: false,
    };

    expect(keyPressMainMenuTextBox(state, "!".charCodeAt(0))).toBe(true);
    expect(state.text).toBe("AB");
    expect(state.doRerender).toBe(false);

    expect(keyPressMainMenuTextBox(state, "_".charCodeAt(0))).toBe(true);
    expect(state.text).toBe("AB_");
    expect(state.doRerender).toBe(true);
  });

  it("ports GMMWTextBox::SetGoodCharsOnly as text-box filter state", () => {
    const state = { goodCharsOnly: false, doRerender: false };

    setMainMenuTextBoxGoodCharsOnly(state, true);
    expect(state).toEqual({ goodCharsOnly: true, doRerender: true });

    state.doRerender = false;
    setMainMenuTextBoxGoodCharsOnly(state, false);
    expect(state).toEqual({ goodCharsOnly: false, doRerender: true });
  });

  it("ports GMMWTextBox::Init as frame image initialization", () => {
    const state = {
      topImage: null,
      leftImage: null,
      rightImage: null,
      bottomImage: null,
      finishedInit: false,
    };

    initMainMenuTextBox(state);

    expect(state).toEqual({
      topImage: "assets/other/main_menu_gui/textbox/textbox_top.png",
      leftImage: "assets/other/main_menu_gui/textbox/textbox_left.png",
      rightImage: "assets/other/main_menu_gui/textbox/textbox_right.png",
      bottomImage: "assets/other/main_menu_gui/textbox/textbox_bottom.png",
      finishedInit: true,
    });
  });

  it("ports GMMWTextBox::MakeTextImage as text rendering state refresh", () => {
    const renderCalls: Array<{ font: FontType; text: string }> = [];
    const state = {
      selected: true,
      text: "secret",
      passworded: true,
      textImage: null as { textureId: string } | null,
      doRerender: true,
    };

    makeMainMenuTextBoxImage(state, (font, text) => {
      renderCalls.push({ font, text });
      return { textureId: text };
    });

    expect(renderCalls).toEqual([
      { font: FontType.SmallWhite, text: "******{" },
    ]);
    expect(state).toEqual({
      selected: true,
      text: "secret",
      passworded: true,
      textImage: { textureId: "******{" },
      doRerender: false,
    });
  });

  it("ports GMMWTextBox::Process as a skipped refresh when text is current", () => {
    const state = {
      selected: false,
      text: "ready",
      passworded: false,
      textImage: { textureId: "ready" },
      doRerender: false,
    };
    const renderCalls: Array<{ font: FontType; text: string }> = [];

    processMainMenuTextBox(state, (font, text) => {
      renderCalls.push({ font, text });
      return { textureId: text };
    });

    expect(renderCalls).toEqual([]);
    expect(state).toEqual({
      selected: false,
      text: "ready",
      passworded: false,
      textImage: { textureId: "ready" },
      doRerender: false,
    });
  });

  it("ports GMMWTextBox::Process as a conditional text image rebuild", () => {
    const state = {
      selected: true,
      text: "ready",
      passworded: false,
      textImage: null as { textureId: string } | null,
      doRerender: true,
    };
    const renderCalls: Array<{ font: FontType; text: string }> = [];

    processMainMenuTextBox(state, (font, text) => {
      renderCalls.push({ font, text });
      return { textureId: text };
    });

    expect(renderCalls).toEqual([{ font: FontType.SmallWhite, text: "ready{" }]);
    expect(state).toEqual({
      selected: true,
      text: "ready",
      passworded: false,
      textImage: { textureId: "ready{" },
      doRerender: false,
    });
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

  it("ports GMMWLabel::SetText as label text with rerender when stale", () => {
    const state = { text: "", renderedText: "old", rerenderText: false };

    setMainMenuLabelText(state, "new");

    expect(state).toEqual({
      text: "new",
      renderedText: "old",
      rerenderText: true,
    });
  });

  it("ports GMMWLabel::SetText as a no-op when text is already rendered", () => {
    const state = { text: "draft", renderedText: "same", rerenderText: false };

    setMainMenuLabelText(state, "same");

    expect(state).toEqual({
      text: "draft",
      renderedText: "same",
      rerenderText: false,
    });
  });

  it("ports GMMWLabel::MakeTextImage as skipped when text is current", () => {
    const state = {
      text: "Ready",
      renderedText: "Ready",
      font: FontType.YellowMenu,
      textImage: { textureId: "old" },
      rerenderText: false,
    };
    const renderCalls: Array<{ font: FontType | number; text: string }> = [];

    makeMainMenuLabelTextImage(state, (font, text) => {
      renderCalls.push({ font, text });
      return { textureId: text };
    });

    expect(renderCalls).toEqual([]);
    expect(state).toEqual({
      text: "Ready",
      renderedText: "Ready",
      font: FontType.YellowMenu,
      textImage: { textureId: "old" },
      rerenderText: false,
    });
  });

  it("ports GMMWLabel::MakeTextImage as configured font text rendering", () => {
    const state = {
      text: "Ready",
      renderedText: "old",
      font: FontType.GreenBuilding,
      textImage: null as { textureId: string } | null,
      rerenderText: true,
    };
    const renderCalls: Array<{ font: FontType | number; text: string }> = [];

    makeMainMenuLabelTextImage(state, (font, text) => {
      renderCalls.push({ font, text });
      return { textureId: text };
    });

    expect(renderCalls).toEqual([
      { font: FontType.GreenBuilding, text: "Ready" },
    ]);
    expect(state).toEqual({
      text: "Ready",
      renderedText: "Ready",
      font: FontType.GreenBuilding,
      textImage: { textureId: "Ready" },
      rerenderText: false,
    });
  });

  it("ports GMMWLabel::MakeTextImage as unload for empty text", () => {
    const state = {
      text: "",
      renderedText: "old",
      font: FontType.YellowMenu,
      textImage: { textureId: "old" } as { textureId: string } | null,
      rerenderText: true,
    };

    makeMainMenuLabelTextImage(state, () => {
      throw new Error("empty label text should not render");
    });

    expect(state).toEqual({
      text: "",
      renderedText: "",
      font: FontType.YellowMenu,
      textImage: null,
      rerenderText: false,
    });
  });

  it("ports GMMWTeamColor::SetTeam as team assignment with bounds clamp", () => {
    const state = { team: 0 };

    setMainMenuTeamColorTeam(state, 2);
    expect(state.team).toBe(2);

    setMainMenuTeamColorTeam(state, -1);
    expect(state.team).toBe(0);

    setMainMenuTeamColorTeam(state, 9);
    expect(state.team).toBe(0);
  });

  it("ports GMMWTeamColor::Init as team color image initialization", () => {
    const loaded: Array<[number, string | { id: string } | null]> = [];
    const made: Array<[number, { id: string } | null]> = [];
    const baseSurface = { id: "red-base" };
    const teamColorImages = Array.from({ length: 9 }, (_, team) => ({
      getBaseSurface: () => (team === 1 ? baseSurface : null),
      loadBaseImage(source: string | { id: string } | null): void {
        loaded.push([team, source]);
      },
    }));
    const state = {
      teamColorImages,
      finishedInit: false,
    };

    initMainMenuTeamColor(state, (team, surface) => {
      made.push([team, surface]);
      return { id: `team-${team}` };
    });

    expect(loaded).toEqual([
      [0, "assets/other/main_menu_gui/team_color_null.png"],
      [1, "assets/other/main_menu_gui/team_color_red.png"],
      [2, { id: "team-2" }],
      [3, { id: "team-3" }],
      [4, { id: "team-4" }],
      [5, { id: "team-5" }],
      [6, { id: "team-6" }],
      [7, { id: "team-7" }],
      [8, { id: "team-8" }],
    ]);
    expect(made).toEqual([
      [2, baseSurface],
      [3, baseSurface],
      [4, baseSurface],
      [5, baseSurface],
      [6, baseSurface],
      [7, baseSurface],
      [8, baseSurface],
    ]);
    expect(state.finishedInit).toBe(true);
  });

  it("replaces GMMWTeamColor::DoRender with a team swatch texture command", () => {
    const state = {
      finishedInit: true,
      active: true,
      team: 2,
      x: 7,
      y: 11,
      teamColorImages: [
        null,
        null,
        { texture: "blue-team", width: 19, height: 12 },
      ],
    };

    expect(renderMainMenuTeamColor(state, 100, 200)).toEqual({
      texture: "blue-team",
      destinationX: 107,
      destinationY: 211,
      width: 19,
      height: 12,
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 19,
      sourceHeight: 12,
      textureLeft: 0,
      textureTop: 0,
      textureRight: 1,
      textureBottom: 1,
      scale: 1,
      angle: 0,
      alpha: 1,
    });
  });

  it("replaces GMMWTeamColor::DoRender guards with null commands", () => {
    const state = {
      finishedInit: true,
      active: true,
      team: 1,
      x: 0,
      y: 0,
      teamColorImages: [{ texture: 0, width: 19, height: 12 }],
    };

    expect(
      renderMainMenuTeamColor({ ...state, finishedInit: false }, 0, 0),
    ).toBeNull();
    expect(renderMainMenuTeamColor({ ...state, active: false }, 0, 0)).toBeNull();
    expect(renderMainMenuTeamColor({ ...state, team: -1 }, 0, 0)).toBeNull();
    expect(renderMainMenuTeamColor({ ...state, team: 9 }, 0, 0)).toBeNull();
    expect(renderMainMenuTeamColor(state, 0, 0)).toBeNull();
  });

  it("ports GMMWRadio::Init as radio image initialization", () => {
    const state = {
      radioLeftImage: null,
      radioCenterImage: null,
      radioRightImage: null,
      radioSelectorImage: null,
      finishedInit: false,
    };

    initMainMenuRadio(state);

    expect(state).toEqual({
      radioLeftImage: "assets/other/main_menu_gui/radio/radio_left.png",
      radioCenterImage: "assets/other/main_menu_gui/radio/radio_center.png",
      radioRightImage: "assets/other/main_menu_gui/radio/radio_right.png",
      radioSelectorImage:
        "assets/other/main_menu_gui/radio/radio_selector.png",
      finishedInit: true,
    });
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

  it("ports GMMWRadio::SetMaxSelections as count clamp, width refresh, and selection validation", () => {
    const state = { selections: 4, width: 0, selectedIndex: 3 };

    setMainMenuRadioMaxSelections(state, 1);
    expect(state).toEqual({
      selections: MAIN_MENU_RADIO_MIN_SELECTIONS,
      width:
        MAIN_MENU_RADIO_LEFT_WIDTH_PIXELS +
        (MAIN_MENU_RADIO_MIN_SELECTIONS - 2) *
          MAIN_MENU_RADIO_CENTER_WIDTH_PIXELS +
        MAIN_MENU_RADIO_RIGHT_WIDTH_PIXELS,
      selectedIndex: 0,
    });

    state.selectedIndex = 2;
    setMainMenuRadioMaxSelections(state, 5);
    expect(state).toEqual({
      selections: 5,
      width:
        MAIN_MENU_RADIO_LEFT_WIDTH_PIXELS +
        3 * MAIN_MENU_RADIO_CENTER_WIDTH_PIXELS +
        MAIN_MENU_RADIO_RIGHT_WIDTH_PIXELS,
      selectedIndex: 2,
    });
  });

  it("ports GMMWRadio::Click as bounds check and radio segment selection", () => {
    const flags = new MainMenuWidgetFlag();
    const state = {
      x: 10,
      y: 20,
      width:
        MAIN_MENU_RADIO_LEFT_WIDTH_PIXELS +
        3 * MAIN_MENU_RADIO_CENTER_WIDTH_PIXELS +
        MAIN_MENU_RADIO_RIGHT_WIDTH_PIXELS,
      height: MAIN_MENU_RADIO_HEIGHT_PIXELS,
      selections: 5,
      flags,
    };

    flags.listEntrySelected = 4;
    flags.radioSelectionIndexSelected = 2;
    expect(clickMainMenuRadio(state, 9, 20)).toBe(false);
    expect(flags).toEqual({
      listEntrySelected: -1,
      radioSelectionIndexSelected: -1,
    });

    expect(clickMainMenuRadio(state, state.x, state.y)).toBe(true);
    expect(flags.radioSelectionIndexSelected).toBe(0);

    expect(
      clickMainMenuRadio(
        state,
        state.x +
          MAIN_MENU_RADIO_LEFT_WIDTH_PIXELS +
          2 * MAIN_MENU_RADIO_CENTER_WIDTH_PIXELS,
        state.y + state.height,
      ),
    ).toBe(true);
    expect(flags.radioSelectionIndexSelected).toBe(3);

    expect(
      clickMainMenuRadio(
        state,
        state.x + state.width - MAIN_MENU_RADIO_RIGHT_WIDTH_PIXELS + 1,
        state.y,
      ),
    ).toBe(true);
    expect(flags.radioSelectionIndexSelected).toBe(4);
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
