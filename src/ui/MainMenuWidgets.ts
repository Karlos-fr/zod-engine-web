import { FontType } from "../rendering/FontEngine";
import { goodUserChar } from "../simulation/Common";
import type { TexturedSurfaceRenderCommand } from "../rendering/SurfacePixels";
import { ACTIVE_TEAM_TYPE_COUNT } from "../simulation/SimulationConstants";
import {
  loadTeamZSurface,
  TEAM_RENDERING_BASE_TEAM,
  type TeamSurfaceFactory,
} from "../simulation/TeamRendering";

/**
 * Upstream: zgui_main_menu_widgets.h
 */

/**
 * Port of upstream `_ZGUIMAINMENUWIDGETS_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: zgui_main_menu_widgets.h:2
 */
export const ZGUI_MAIN_MENU_WIDGETS_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ZGMMWidget::Process`.
 * Role: Provides the base main-menu widget no-op processing hook.
 * Upstream: zgui_main_menu_widgets.h:47
 */
export function processMainMenuWidget(): void {
  return undefined;
}

/**
 * Replacement for upstream `ZGMMWidget::DoRender`.
 * Role: Provides the empty base rendering hook for main-menu widgets.
 * Upstream: zgui_main_menu_widgets.h:48
 */
export function renderMainMenuWidget(): [] {
  return [];
}

/**
 * Port of upstream `gmmw_flag`.
 * Role: Carries widget interaction selections emitted by main-menu widgets.
 * Upstream: zgui_main_menu_widgets.h:13-26
 */
export class MainMenuWidgetFlag {
  listEntrySelected = -1;
  radioSelectionIndexSelected = -1;

  constructor() {
    this.clear();
  }

  /**
   * Port of upstream `gmmw_flag::clear`.
   * Role: Resets widget list and radio selection outputs.
   * Upstream: zgui_main_menu_widgets.h:18-22
   */
  clear(): void {
    this.listEntrySelected = -1;
    this.radioSelectionIndexSelected = -1;
  }
}

/**
 * Port of upstream `mmlist_entry` resettable fields.
 * Role: Holds one main-menu list entry's label, object reference, sort key, and interaction state.
 * Upstream: zgui_main_menu_widgets.h:195-201
 */
export type MainMenuListEntryState = {
  text: string;
  refId: number;
  sortNumber: number;
  state: MainMenuListState;
};

/**
 * Port of upstream `mmlist_entry`.
 * Role: Holds one main-menu list entry with default and configured construction.
 * Upstream: zgui_main_menu_widgets.h:183-209
 */
export class MainMenuListEntry implements MainMenuListEntryState {
  text = "";
  refId = -1;
  sortNumber = -1;
  state = MainMenuListState.Normal;

  constructor(text?: string, refId?: number, sortNumber?: number) {
    if (text === undefined || refId === undefined || sortNumber === undefined) {
      this.clear();
      return;
    }

    this.text = text;
    this.refId = refId;
    this.sortNumber = sortNumber;
    this.state = MainMenuListState.Normal;
  }

  clear(): void {
    clearMainMenuListEntry(this);
  }
}

/**
 * Port of upstream `mmwidget_type`.
 * Role: Identifies the concrete widget kind for main-menu controls.
 * Upstream: zgui_main_menu_widgets.h:28-34
 */
export enum MainMenuWidgetType {
  Unknown = 0,
  Button = 1,
  Label = 2,
  List = 3,
  Radio = 4,
  TeamColor = 5,
  TextBox = 6,
  MaxWidgets = 7,
}

/**
 * Port of upstream `mmbutton_type`.
 * Role: Identifies the visual variant of a main-menu button widget.
 * Upstream: zgui_main_menu_widgets.h:80-83
 */
export enum MainMenuButtonType {
  Generic = 0,
  Close = 1,
  MaxButtonTypes = 2,
}

/**
 * Port of upstream `mmbutton_state`.
 * Role: Identifies the visual interaction state of main-menu buttons.
 * Upstream: zgui_main_menu_widgets.h:90-93
 */
export enum MainMenuButtonState {
  Normal = 0,
  Pressed = 1,
  Green = 2,
  MaxButtonStates = 3,
}

/**
 * Port of upstream `GMMWButton` dimension state.
 * Role: Holds the button visual type and dimensions adjusted by button layout rules.
 * Upstream: zgui_main_menu_widgets.h:129, zgui_main_menu_widgets.h:136
 */
export type MainMenuButtonDimensionState = {
  type: MainMenuButtonType;
  width: number;
  height: number;
};

/**
 * Port of upstream `GMMWButton::MakeTextImage` mutable fields.
 * Role: Holds button text, its rendered image, and the pending text refresh flag.
 * Upstream: zgui_main_menu_widgets.h:129-141, gmmw_button.cpp:204-214
 */
export type MainMenuButtonTextImageState<TTextImage> = {
  text: string;
  textImage: TTextImage | null;
  rerenderText: boolean;
};

export type MainMenuButtonImageTarget = {
  loadBaseImage(filename: string): void;
};

/**
 * Port of upstream `GMMWButton::Init` image fields.
 * Role: Holds generic and non-generic button image targets plus the initialization flag.
 * Upstream: gmmw_button.cpp:29-71
 */
export type MainMenuButtonInitState = {
  nonGenericImages: MainMenuButtonImageTarget[][];
  genericTopLeftImages: MainMenuButtonImageTarget[];
  genericTopImages: MainMenuButtonImageTarget[];
  genericTopRightImages: MainMenuButtonImageTarget[];
  genericLeftImages: MainMenuButtonImageTarget[];
  genericCenterImages: MainMenuButtonImageTarget[];
  genericRightImages: MainMenuButtonImageTarget[];
  genericBottomLeftImages: MainMenuButtonImageTarget[];
  genericBottomImages: MainMenuButtonImageTarget[];
  genericBottomRightImages: MainMenuButtonImageTarget[];
  finishedInit: boolean;
};

export const MAIN_MENU_BUTTON_TYPE_ASSET_NAMES: Readonly<Record<number, string>> = {
  [MainMenuButtonType.Close]: "close",
};

/**
 * Port of upstream `GMMWButton::Init`.
 * Role: Loads shared main-menu button image assets and marks button images initialized.
 * Upstream: gmmw_button.cpp:25-72
 */
export function initMainMenuButtonImages(state: MainMenuButtonInitState): void {
  for (
    let buttonType = MainMenuButtonType.Generic + 1;
    buttonType < MainMenuButtonType.MaxButtonTypes;
    buttonType += 1
  ) {
    for (
      let buttonState = 0;
      buttonState < MainMenuButtonState.MaxButtonStates;
      buttonState += 1
    ) {
      const token =
        buttonState === MainMenuButtonState.Pressed ? "pressed" : "normal";
      state.nonGenericImages[buttonType]?.[buttonState]?.loadBaseImage(
        `assets/other/main_menu_gui/${MAIN_MENU_BUTTON_TYPE_ASSET_NAMES[buttonType]}_button_${token}.png`,
      );
    }
  }

  const genericTargets = [
    ["top_left", state.genericTopLeftImages],
    ["top", state.genericTopImages],
    ["top_right", state.genericTopRightImages],
    ["left", state.genericLeftImages],
    ["center", state.genericCenterImages],
    ["right", state.genericRightImages],
    ["bottom_left", state.genericBottomLeftImages],
    ["bottom", state.genericBottomImages],
    ["bottom_right", state.genericBottomRightImages],
  ] as const;

  for (
    let buttonState = 0;
    buttonState < MainMenuButtonState.MaxButtonStates;
    buttonState += 1
  ) {
    let token = "normal";
    if (buttonState === MainMenuButtonState.Pressed) token = "pressed";
    if (buttonState === MainMenuButtonState.Green) token = "green";

    for (const [segment, targets] of genericTargets) {
      targets[buttonState]?.loadBaseImage(
        `assets/other/main_menu_gui/generic_button_${token}_${segment}.png`,
      );
    }
  }

  state.finishedInit = true;
}

/**
 * Replacement for upstream `ZFontEngine::GetFont(...).Render`.
 * Role: Allows the browser renderer to provide a button text image or texture.
 * Upstream: gmmw_button.cpp:209
 */
export type MainMenuButtonTextRenderer<TTextImage> = (
  font: FontType,
  text: string,
) => TTextImage;

/**
 * Port of upstream `GMMWTextBox` text image fields.
 * Role: Holds the text-box state needed to rebuild its rendered text image.
 * Upstream: zgui_main_menu_widgets.h:359-369
 */
export type MainMenuTextBoxImageState<TTextImage> = {
  selected: boolean;
  text: string;
  passworded: boolean;
  textImage: TTextImage | null;
  doRerender: boolean;
};

/**
 * Replacement for upstream `ZFontEngine::GetFont(...).Render`.
 * Role: Allows the browser renderer to provide the actual text image or texture.
 * Upstream: gmmw_textbox.cpp:72
 */
export type MainMenuTextBoxTextRenderer<TTextImage> = (
  font: FontType,
  text: string,
) => TTextImage;

/**
 * Port of upstream `mmlist_state`.
 * Role: Identifies the visual interaction state of main-menu list controls.
 * Upstream: zgui_main_menu_widgets.h:178-181
 */
export enum MainMenuListState {
  Normal = 0,
  Pressed = 1,
  MaxListStates = 2,
}

/**
 * Port of upstream `mmlist_entry::clear`.
 * Role: Resets a main-menu list entry to its default state.
 * Upstream: zgui_main_menu_widgets.h:195-201
 */
export function clearMainMenuListEntry(state: MainMenuListEntryState): void {
  state.text = "";
  state.refId = -1;
  state.sortNumber = -1;
  state.state = MainMenuListState.Normal;
}

/**
 * Port of upstream `sort_mmlist_entry_func`.
 * Role: Orders main-menu list entries by their numeric sort key.
 * Upstream: gmmw_list.cpp:495-498
 */
export function isMainMenuListEntryBefore(
  a: Pick<MainMenuListEntryState, "sortNumber">,
  b: Pick<MainMenuListEntryState, "sortNumber">,
): boolean {
  return a.sortNumber < b.sortNumber;
}

/**
 * Port of upstream `GMMWList::SetHeight`.
 * Role: Updates the list widget height from the visible entry count.
 * Upstream: gmmw_list.cpp:115-118
 */
export function setMainMenuListHeight(state: {
  visibleEntries: number;
  height: number;
}): void {
  state.height = 3 + state.visibleEntries * MAIN_MENU_LIST_ENTRY_HEIGHT_PIXELS + 2;
}

/**
 * Port of upstream `GMMWList::SetVisibleEntries`.
 * Role: Updates the visible entry count, clamps it to the minimum, and refreshes height.
 * Upstream: gmmw_list.cpp:106-113
 */
export function setMainMenuListVisibleEntries(
  state: { visibleEntries: number; height: number },
  visibleEntries: number,
): void {
  state.visibleEntries = Math.max(visibleEntries, MAIN_MENU_LIST_MIN_ENTRIES);
  setMainMenuListHeight(state);
}

/**
 * Port of upstream `GMMWList::GetFirstSelected`.
 * Role: Returns the first pressed main-menu list entry index, or -1 when none is pressed.
 * Upstream: gmmw_list.cpp:120-127
 */
export function getFirstSelectedMainMenuListEntry(
  entries: Array<Pick<MainMenuListEntryState, "state">>,
): number {
  return entries.findIndex((entry) => entry.state === MainMenuListState.Pressed);
}

/**
 * Port of upstream `GMMWList::UnSelectAll`.
 * Role: Clears pressed state from every main-menu list entry except one optional entry.
 * Upstream: gmmw_list.cpp:129-134
 */
export function unselectAllMainMenuListEntries(
  entries: Array<Pick<MainMenuListEntryState, "state">>,
  exceptEntry: number,
): void {
  entries.forEach((entry, index) => {
    if (index !== exceptEntry) {
      entry.state = MainMenuListState.Normal;
    }
  });
}

/**
 * Minimal state consumed by ported `GMMWList::CheckViewI`.
 * Role: Holds list entries, visible entry count, and the first visible list index.
 * Upstream: gmmw_list.cpp:136-144
 */
export type MainMenuListViewState = {
  entries: readonly unknown[];
  visibleEntries: number;
  viewIndex: number;
};

/**
 * Port of upstream `GMMWList` release interaction state.
 * Role: Holds list bounds, scroll state, and scroll-button press states for release handling.
 * Upstream: zgui_main_menu_widgets.h:211-216
 */
export type MainMenuListUnclickState = MainMenuListViewState & {
  x: number;
  y: number;
  width: number;
  height: number;
  upButtonState: MainMenuListState;
  downButtonState: MainMenuListState;
};

/**
 * Minimal surface dimensions consumed by ported `GMMWList::WithinEntry`.
 * Role: Replaces upstream `GetBaseSurface()` checks and width/height reads.
 * Upstream: gmmw_list.cpp:211-219
 */
export type MainMenuListSurfaceDimensions = {
  width: number;
  height: number;
} | null;

/**
 * Minimal state consumed by ported `GMMWList::WithinEntry`.
 * Role: Holds list frame dimensions, visible entries, scroll offset, and entries.
 * Upstream: zgui_main_menu_widgets.h:211-216, gmmw_list.cpp:211-227
 */
export type MainMenuListWithinEntryState = MainMenuListViewState & {
  width: number;
  topImage: MainMenuListSurfaceDimensions;
  leftImage: MainMenuListSurfaceDimensions;
  rightImage: MainMenuListSurfaceDimensions;
};

/**
 * Port of upstream `GMMWList::CheckViewI`.
 * Role: Clamps the first visible list index to the available scroll range.
 * Upstream: gmmw_list.cpp:136-144
 */
export function checkMainMenuListViewIndex(
  state: MainMenuListViewState,
): void {
  const availableSlots = state.entries.length - state.visibleEntries;

  if (state.viewIndex > availableSlots) state.viewIndex = availableSlots;
  if (state.viewIndex < 0) state.viewIndex = 0;
}

/**
 * Port of upstream `GMMWList::MoveUp`.
 * Role: Moves the first visible list index one entry upward when possible.
 * Upstream: gmmw_list.cpp:266-277
 */
export function moveUpMainMenuList(state: { viewIndex: number }): boolean {
  state.viewIndex -= 1;

  if (state.viewIndex < 0) {
    state.viewIndex = 0;
    return false;
  }

  return true;
}

/**
 * Port of upstream `GMMWList::MoveDown`.
 * Role: Moves the first visible list index one entry downward when possible.
 * Upstream: gmmw_list.cpp:279-297
 */
export function moveDownMainMenuList(state: MainMenuListViewState): boolean {
  state.viewIndex += 1;

  const availableSlots = state.entries.length - state.visibleEntries;

  if (state.viewIndex > availableSlots) {
    state.viewIndex = availableSlots;

    if (state.viewIndex < 0) state.viewIndex = 0;

    return false;
  }

  return true;
}

/**
 * Port of upstream `GMMWList::WithinUpButton`.
 * Role: Tests whether a list-local point is inside the scroll-up button bounds.
 * Upstream: gmmw_list.cpp:232-247
 */
export function withinMainMenuListUpButton(
  state: { width: number },
  pointX: number,
  pointY: number,
): boolean {
  const buttonWidth = 11;
  const buttonHeight = 8;
  const buttonX = state.width - MAIN_MENU_LIST_UP_BUTTON_RIGHT_OFFSET_PIXELS;
  const buttonY = MAIN_MENU_LIST_UP_BUTTON_TOP_OFFSET_PIXELS;

  if (pointX < buttonX) return false;
  if (pointY < buttonY) return false;
  if (pointX > buttonX + buttonWidth) return false;
  if (pointY > buttonY + buttonHeight) return false;

  return true;
}

/**
 * Port of upstream `GMMWList::WithinDownButton`.
 * Role: Tests whether a list-local point is inside the scroll-down button bounds.
 * Upstream: gmmw_list.cpp:249-264
 */
export function withinMainMenuListDownButton(
  state: { width: number; height: number },
  pointX: number,
  pointY: number,
): boolean {
  const buttonWidth = 11;
  const buttonHeight = 8;
  const buttonX = state.width - MAIN_MENU_LIST_DOWN_BUTTON_RIGHT_OFFSET_PIXELS;
  const buttonY = state.height - MAIN_MENU_LIST_DOWN_BUTTON_BOTTOM_OFFSET_PIXELS;

  if (pointX < buttonX) return false;
  if (pointY < buttonY) return false;
  if (pointX > buttonX + buttonWidth) return false;
  if (pointY > buttonY + buttonHeight) return false;

  return true;
}

/**
 * Port of upstream `GMMWList::UnClick`.
 * Role: Releases list scroll buttons and applies the matching scroll action.
 * Upstream: gmmw_list.cpp:187-205
 */
export function unclickMainMenuList(
  state: MainMenuListUnclickState,
  pointX: number,
  pointY: number,
): boolean {
  const localX = pointX - state.x;
  const localY = pointY - state.y;
  const previousUpButtonState = state.upButtonState;
  const previousDownButtonState = state.downButtonState;

  state.upButtonState = MainMenuListState.Normal;
  state.downButtonState = MainMenuListState.Normal;

  if (
    previousUpButtonState === MainMenuListState.Pressed &&
    withinMainMenuListUpButton(state, localX, localY)
  ) {
    return moveUpMainMenuList(state);
  }

  if (
    previousDownButtonState === MainMenuListState.Pressed &&
    withinMainMenuListDownButton(state, localX, localY)
  ) {
    return moveDownMainMenuList(state);
  }

  return false;
}

/**
 * Port of upstream `GMMWList::WithinEntry`.
 * Role: Converts a list-local point into the hovered entry index, or -1 when outside.
 * Upstream: gmmw_list.cpp:207-230
 */
export function withinMainMenuListEntry(
  state: MainMenuListWithinEntryState,
  pointX: number,
  pointY: number,
): number {
  const topImage = state.topImage;
  const leftImage = state.leftImage;
  if (!topImage) return -1;
  if (!leftImage) return -1;

  const rightImageWidth = state.rightImage?.width ?? 0;

  if (pointX < leftImage.width) return -1;
  if (pointX > state.width - (leftImage.width + rightImageWidth)) return -1;
  if (pointY < topImage.height) return -1;
  if (
    pointY >
    topImage.height + state.visibleEntries * MAIN_MENU_LIST_ENTRY_HEIGHT_PIXELS
  ) {
    return -1;
  }

  let entryFound = Math.trunc(
    (pointY - topImage.height) / MAIN_MENU_LIST_ENTRY_HEIGHT_PIXELS,
  );

  if (entryFound < 0) return -1;
  if (entryFound >= state.visibleEntries) return -1;

  entryFound += state.viewIndex;

  if (entryFound < 0) return -1;
  if (entryFound >= state.entries.length) return -1;

  return entryFound;
}

/**
 * Port of upstream `mmlabel_justify_type`.
 * Role: Identifies horizontal text alignment for main-menu labels.
 * Upstream: zgui_main_menu_widgets.h:143-146
 */
export enum MainMenuLabelJustifyType {
  Normal = 0,
  Center = 1,
  Right = 2,
  MaxLabelJustifies = 3,
}

/**
 * Port of upstream `GetWidth`.
 * Role: Reports the current width of a main-menu widget.
 * Upstream: zgui_main_menu_widgets.h:55
 */
export function getMainMenuWidgetWidth(state: { width: number }): number {
  return state.width;
}

/**
 * Port of upstream `GetHeight`.
 * Role: Reports the current height of a main-menu widget.
 * Upstream: zgui_main_menu_widgets.h:56
 */
export function getMainMenuWidgetHeight(state: { height: number }): number {
  return state.height;
}

/**
 * Port of upstream `SetDimensions`.
 * Role: Updates the main-menu widget dimensions.
 * Upstream: zgui_main_menu_widgets.h:59
 */
export function setMainMenuWidgetDimensions(
  state: { width: number; height: number },
  width: number,
  height: number,
): void {
  state.width = width;
  state.height = height;
}

/**
 * Port of upstream `GetWidgetType`.
 * Role: Reports the concrete kind of a main-menu widget.
 * Upstream: zgui_main_menu_widgets.h:54
 */
export function getMainMenuWidgetType(state: {
  widgetType: MainMenuWidgetType;
}): MainMenuWidgetType {
  return state.widgetType;
}

/**
 * Port of upstream `IsActive`.
 * Role: Reports whether a main-menu widget is active.
 * Upstream: zgui_main_menu_widgets.h:52
 */
export function isMainMenuWidgetActive(state: { active: boolean }): boolean {
  return state.active;
}

/**
 * Port of upstream `SetActive`.
 * Role: Stores whether a main-menu widget is active.
 * Upstream: zgui_main_menu_widgets.h:50
 */
export function setMainMenuWidgetActive(
  state: { active: boolean },
  active: boolean,
): void {
  state.active = active;
}

/**
 * Port of upstream `ZGMMWidget` reference id field.
 * Role: Holds the unique main-menu widget reference id.
 * Upstream: zgui_main_menu_widgets.h:53, zgui_main_menu_widgets.h:72
 */
export type MainMenuWidgetRefState = {
  refId: number;
};

/**
 * Port of upstream `GetRefID`.
 * Role: Returns the unique main-menu widget reference id.
 * Upstream: zgui_main_menu_widgets.h:53
 */
export function getMainMenuWidgetRefId(
  state: MainMenuWidgetRefState,
): number {
  return state.refId;
}

/**
 * Port of upstream `ZGMMWidget` coordinate fields.
 * Role: Holds the main-menu widget origin.
 * Upstream: zgui_main_menu_widgets.h:60, zgui_main_menu_widgets.h:70
 */
export type MainMenuWidgetCoordinateState = {
  x: number;
  y: number;
};

/**
 * Port of upstream `ZGMMWidget` bounds fields.
 * Role: Holds the main-menu widget origin and dimensions used for hit testing.
 * Upstream: zgui_main_menu_widgets.h:61, zgui_main_menu_widgets.h:70
 */
export type MainMenuWidgetBoundsState = MainMenuWidgetCoordinateState & {
  width: number;
  height: number;
};

/**
 * Port of upstream `SetCoords`.
 * Role: Updates the main-menu widget origin.
 * Upstream: zgui_main_menu_widgets.h:60
 */
export function setMainMenuWidgetCoords(
  state: MainMenuWidgetCoordinateState,
  x: number,
  y: number,
): void {
  state.x = x;
  state.y = y;
}

/**
 * Port of upstream `ZGMMWidget::WithinDimensions`.
 * Role: Tests whether a point is within the widget's inclusive bounds.
 * Upstream: zgui_main_menu_widget.cpp:15-23
 */
export function withinMainMenuWidgetDimensions(
  state: MainMenuWidgetBoundsState,
  x: number,
  y: number,
): boolean {
  if (x < state.x) return false;
  if (y < state.y) return false;
  if (x > state.x + state.width) return false;
  if (y > state.y + state.height) return false;

  return true;
}

/**
 * Port of upstream `ZGMMWidget::Click`.
 * Role: Reports that the base main-menu widget does not consume click input.
 * Upstream: zgui_main_menu_widgets.h:63
 */
export function clickMainMenuWidget(x: number, y: number): boolean {
  void x;
  void y;
  return false;
}

/**
 * Port of upstream `ZGMMWidget::UnClick`.
 * Role: Reports that the base main-menu widget does not consume unclick input.
 * Upstream: zgui_main_menu_widgets.h:64
 */
export function unclickMainMenuWidget(x: number, y: number): boolean {
  void x;
  void y;
  return false;
}

/**
 * Port of upstream `ZGMMWidget::Motion`.
 * Role: Reports that the base main-menu widget does not consume pointer motion.
 * Upstream: zgui_main_menu_widgets.h:65
 */
export function motionMainMenuWidget(x: number, y: number): boolean {
  void x;
  void y;
  return false;
}

/**
 * Port of upstream `ZGMMWidget::KeyPress`.
 * Role: Reports that the base main-menu widget does not consume key input.
 * Upstream: zgui_main_menu_widgets.h:66
 */
export function keyPressMainMenuWidget(c: number): boolean {
  void c;
  return false;
}

/**
 * Port of upstream `ZGMMWidget::WheelUpButton`.
 * Role: Reports that the base main-menu widget does not consume wheel-up input.
 * Upstream: zgui_main_menu_widgets.h:67
 */
export function wheelUpMainMenuWidget(): boolean {
  return false;
}

/**
 * Port of upstream `GMMWList::WheelUpButton` dependency surface.
 * Role: Provides the list scroll-up behavior invoked by wheel-up input.
 * Upstream: zgui_main_menu_widgets.h:225
 */
export type MainMenuListWheelUpState = {
  moveUp(): boolean;
};

/**
 * Port of upstream `GMMWList::WheelUpButton`.
 * Role: Delegates wheel-up input to list scroll-up behavior.
 * Upstream: zgui_main_menu_widgets.h:225
 */
export function wheelUpMainMenuList(
  state: MainMenuListWheelUpState,
): boolean {
  return state.moveUp();
}

/**
 * Port of upstream `ZGMMWidget::WheelDownButton`.
 * Role: Reports that the base main-menu widget does not consume wheel-down input.
 * Upstream: zgui_main_menu_widgets.h:68
 */
export function wheelDownMainMenuWidget(): boolean {
  return false;
}

/**
 * Port of upstream `GMMWList::WheelDownButton` dependency surface.
 * Role: Provides the list scroll-down behavior invoked by wheel-down input.
 * Upstream: zgui_main_menu_widgets.h:226
 */
export type MainMenuListWheelDownState = {
  moveDown(): boolean;
};

/**
 * Port of upstream `GMMWList::WheelDownButton`.
 * Role: Delegates wheel-down input to list scroll-down behavior.
 * Upstream: zgui_main_menu_widgets.h:226
 */
export function wheelDownMainMenuList(
  state: MainMenuListWheelDownState,
): boolean {
  return state.moveDown();
}

/**
 * Port of upstream `ToggleActive`.
 * Role: Inverts whether a main-menu widget is active.
 * Upstream: zgui_main_menu_widgets.h:51
 */
export function toggleMainMenuWidgetActive(state: { active: boolean }): void {
  state.active = !state.active;
}

/**
 * Port of upstream `GMMWButton::SetText`.
 * Role: Stores button text and schedules text rerendering.
 * Upstream: zgui_main_menu_widgets.h:109
 */
export function setMainMenuButtonText(
  state: { text: string; rerenderText: boolean },
  text: string,
): void {
  state.text = text;
  state.rerenderText = true;
}

/**
 * Port of upstream `GMMWButton::DetermineDimensions`.
 * Role: Applies fixed dimensions for button visual types that override the default size.
 * Upstream: gmmw_button.cpp:216-225
 */
export function determineMainMenuButtonDimensions(
  state: MainMenuButtonDimensionState,
): void {
  switch (state.type) {
    case MainMenuButtonType.Close:
      state.width = 12;
      state.height = 12;
      break;
  }
}

/**
 * Port of upstream `SetType`.
 * Role: Stores the button visual type and reapplies type-specific dimensions.
 * Upstream: zgui_main_menu_widgets.h:110
 */
export function setMainMenuButtonType(
  state: MainMenuButtonDimensionState,
  type: MainMenuButtonType,
): void {
  state.type = type;
  determineMainMenuButtonDimensions(state);
}

/**
 * Port of upstream `GMMWButton::Click`.
 * Role: Presses an active button when the click lands inside its bounds.
 * Upstream: gmmw_button.cpp:227-235
 */
export function clickMainMenuButton(
  state: MainMenuWidgetBoundsState & {
    active: boolean;
    state: MainMenuButtonState;
  },
  x: number,
  y: number,
): boolean {
  if (!state.active) return false;
  if (!withinMainMenuWidgetDimensions(state, x, y)) return false;

  state.state = MainMenuButtonState.Pressed;

  return true;
}

/**
 * Port of upstream `GMMWButton::UnClick`.
 * Role: Releases a button and reports a completed click when release lands on an active pressed button.
 * Upstream: gmmw_button.cpp:237-249
 */
export function unclickMainMenuButton(
  state: MainMenuWidgetBoundsState & {
    active: boolean;
    state: MainMenuButtonState;
  },
  x: number,
  y: number,
): boolean {
  const previousState = state.state;
  state.state = MainMenuButtonState.Normal;

  if (!state.active) return false;
  if (!withinMainMenuWidgetDimensions(state, x, y)) return false;

  return previousState === MainMenuButtonState.Pressed;
}

/**
 * Port of upstream `SetGreen`.
 * Role: Stores whether a main-menu button uses its green visual state.
 * Upstream: zgui_main_menu_widgets.h:111
 */
export function setMainMenuButtonGreen(
  state: { isGreen: boolean },
  isGreen: boolean,
): void {
  state.isGreen = isGreen;
}

/**
 * Port of upstream `GMMWButton::MakeTextImage`.
 * Role: Refreshes or clears the rendered button text image when scheduled.
 * Upstream: gmmw_button.cpp:204-214
 */
export function makeMainMenuButtonTextImage<TTextImage>(
  state: MainMenuButtonTextImageState<TTextImage>,
  renderText: MainMenuButtonTextRenderer<TTextImage>,
): void {
  if (!state.rerenderText) return;

  state.textImage = state.text.length
    ? renderText(FontType.YellowMenu, state.text)
    : null;
  state.rerenderText = false;
}

/**
 * Port of upstream `SetGoodCharsOnly`.
 * Role: Stores the text-box character filter flag and schedules a text rerender.
 * Upstream: zgui_main_menu_widgets.h:354
 */
export function setMainMenuTextBoxGoodCharsOnly(
  state: { goodCharsOnly: boolean; doRerender: boolean },
  goodCharsOnly: boolean,
): void {
  state.goodCharsOnly = goodCharsOnly;
  state.doRerender = true;
}

/**
 * Minimal state consumed by ported `GMMWTextBox::Init`.
 * Role: Holds text-box frame image paths and the initialization flag.
 * Upstream: gmmw_textbox.cpp:23-31
 */
export type MainMenuTextBoxInitState = {
  topImage: string | null;
  leftImage: string | null;
  rightImage: string | null;
  bottomImage: string | null;
  finishedInit: boolean;
};

/**
 * Port of upstream `GMMWTextBox::KeyPress` mutable fields.
 * Role: Stores text-box selection, text, filter, limit, and rerender state for key input.
 * Upstream: gmmw_textbox.cpp:38-59
 */
export type MainMenuTextBoxKeyPressState = {
  selected: boolean;
  text: string;
  maxText: number;
  goodCharsOnly: boolean;
  doRerender: boolean;
};

/**
 * Port of upstream `GMMWTextBox::Init`.
 * Role: Initializes text-box frame image paths.
 * Upstream: gmmw_textbox.cpp:23-31
 */
export function initMainMenuTextBox(state: MainMenuTextBoxInitState): void {
  state.topImage =
    "assets/other/main_menu_gui/textbox/textbox_top.png";
  state.leftImage =
    "assets/other/main_menu_gui/textbox/textbox_left.png";
  state.rightImage =
    "assets/other/main_menu_gui/textbox/textbox_right.png";
  state.bottomImage =
    "assets/other/main_menu_gui/textbox/textbox_bottom.png";
  state.finishedInit = true;
}

/**
 * Port of upstream `GMMWTextBox::Click`.
 * Role: Reports whether a click lands inside the text-box bounds.
 * Upstream: gmmw_textbox.cpp:33-36
 */
export function clickMainMenuTextBox(
  state: MainMenuWidgetBoundsState,
  x: number,
  y: number,
): boolean {
  return withinMainMenuWidgetDimensions(state, x, y);
}

/**
 * Port of upstream `GMMWTextBox::SetText`.
 * Role: Stores text-box text and schedules text rerendering.
 * Upstream: zgui_main_menu_widgets.h:351
 */
export function setMainMenuTextBoxText(
  state: { text: string; doRerender: boolean },
  text: string,
): void {
  state.text = text;
  state.doRerender = true;
}

/**
 * Port of upstream `GMMWTextBox::SetSelected`.
 * Role: Stores text-box selection state and schedules text rerendering.
 * Upstream: zgui_main_menu_widgets.h:352
 */
export function setMainMenuTextBoxSelected(
  state: { selected: boolean; doRerender: boolean },
  selected: boolean,
): void {
  state.selected = selected;
  state.doRerender = true;
}

/**
 * Port of upstream `GMMWTextBox::SetMaxText`.
 * Role: Stores the maximum text length for a main-menu text-box.
 * Upstream: zgui_main_menu_widgets.h:353
 */
export function setMainMenuTextBoxMaxText(
  state: { maxText: number },
  maxText: number,
): void {
  state.maxText = maxText;
}

/**
 * Port of upstream `GMMWTextBox::SetPassworded`.
 * Role: Stores text-box password masking state and schedules text rerendering.
 * Upstream: zgui_main_menu_widgets.h:355
 */
export function setMainMenuTextBoxPassworded(
  state: { passworded: boolean; doRerender: boolean },
  passworded: boolean,
): void {
  state.passworded = passworded;
  state.doRerender = true;
}

/**
 * Port of upstream `GMMWTextBox::KeyPress`.
 * Role: Applies selected text-box backspace and character input with max-length and valid-character filters.
 * Upstream: gmmw_textbox.cpp:38-59
 */
export function keyPressMainMenuTextBox(
  state: MainMenuTextBoxKeyPressState,
  charCode: number,
): boolean {
  if (!state.selected) return false;

  if (charCode === 8) {
    if (state.text.length) {
      state.text = state.text.slice(0, -1);
    }
  } else {
    if (state.maxText !== -1 && state.text.length >= state.maxText) {
      return true;
    }

    const character = String.fromCharCode(charCode);
    if (state.goodCharsOnly && !goodUserChar(character)) {
      return true;
    }

    state.text += character;
  }

  state.doRerender = true;

  return true;
}

/**
 * Port of upstream `GMMWTextBox::MakeTextImage`.
 * Role: Rebuilds the browser text image payload from text-box state.
 * Upstream: gmmw_textbox.cpp:61-75
 */
export function makeMainMenuTextBoxImage<TTextImage>(
  state: MainMenuTextBoxImageState<TTextImage>,
  renderText: MainMenuTextBoxTextRenderer<TTextImage>,
): void {
  let renderTextValue = state.passworded
    ? "*".repeat(state.text.length)
    : state.text;

  if (state.selected) {
    renderTextValue += "{";
  }

  state.textImage = renderText(FontType.SmallWhite, renderTextValue);
  state.doRerender = false;
}

/**
 * Port of upstream `GMMWTextBox::Process`.
 * Role: Rebuilds text-box rendered text only when a rerender is scheduled.
 * Upstream: gmmw_textbox.cpp:78-81
 */
export function processMainMenuTextBox<TTextImage>(
  state: MainMenuTextBoxImageState<TTextImage>,
  renderText: MainMenuTextBoxTextRenderer<TTextImage>,
): void {
  if (state.doRerender) makeMainMenuTextBoxImage(state, renderText);
}

/**
 * Port of upstream `GMMWLabel::MakeTextImage` mutable fields.
 * Role: Holds label text, rendered text cache, font, image, and refresh flag.
 * Upstream: zgui_main_menu_widgets.h:148-170, gmmw_label.cpp:45-56
 */
export type MainMenuLabelTextImageState<TTextImage> = {
  text: string;
  renderedText: string;
  font: FontType | number;
  textImage: TTextImage | null;
  rerenderText: boolean;
};

/**
 * Replacement for upstream `ZFontEngine::GetFont(...).Render`.
 * Role: Allows the browser renderer to provide a label text image or texture.
 * Upstream: gmmw_label.cpp:50
 */
export type MainMenuLabelTextRenderer<TTextImage> = (
  font: FontType | number,
  text: string,
) => TTextImage;

/**
 * Port of upstream `GMMWLabel::MakeTextImage`.
 * Role: Refreshes or clears the rendered label text image when scheduled.
 * Upstream: gmmw_label.cpp:45-56
 */
export function makeMainMenuLabelTextImage<TTextImage>(
  state: MainMenuLabelTextImageState<TTextImage>,
  renderText: MainMenuLabelTextRenderer<TTextImage>,
): void {
  if (!state.rerenderText) return;

  state.textImage = state.text.length ? renderText(state.font, state.text) : null;
  state.renderedText = state.text;
  state.rerenderText = false;
}

/**
 * Port of upstream `SetJustification`.
 * Role: Stores the horizontal text alignment for a main-menu label.
 * Upstream: zgui_main_menu_widgets.h:156
 */
export function setMainMenuLabelJustification(
  state: { justification: MainMenuLabelJustifyType },
  justification: MainMenuLabelJustifyType,
): void {
  state.justification = justification;
}

/**
 * Port of upstream `SetFont`.
 * Role: Stores the font identifier for a main-menu label.
 * Upstream: zgui_main_menu_widgets.h:157
 */
export function setMainMenuLabelFont(
  state: { font: number },
  font: number,
): void {
  state.font = font;
}

/**
 * Port of upstream `GMMWLabel::SetText`.
 * Role: Stores label text and schedules text rerendering when it differs from the rendered text.
 * Upstream: gmmw_label.cpp:13-19
 */
export function setMainMenuLabelText(
  state: { text: string; renderedText: string; rerenderText: boolean },
  text: string,
): void {
  if (text === state.renderedText) {
    return;
  }

  state.text = text;
  state.rerenderText = true;
}

/**
 * Port of upstream `GMMWTeamColor::SetTeam`.
 * Role: Stores the team-color widget team, clamping invalid values to the null team.
 * Upstream: gmmw_team_color.cpp:31-37
 */
export function setMainMenuTeamColorTeam(
  state: { team: number },
  team: number,
): void {
  state.team = team;

  if (state.team < 0) state.team = 0;
  if (state.team >= ACTIVE_TEAM_TYPE_COUNT) state.team = 0;
}

export type MainMenuTeamColorImage<TSurface> = {
  getBaseSurface(): TSurface | null;
  loadBaseImage(source: string | TSurface | null): void;
};

export type MainMenuTeamColorInitState<TSurface> = {
  teamColorImages: readonly MainMenuTeamColorImage<TSurface>[];
  finishedInit: boolean;
};

/**
 * Replacement for upstream `GMMWTeamColor::DoRender` image dependency.
 * Role: Supplies texture and dimensions for a team-color swatch image.
 * Upstream: gmmw_team_color.cpp:50
 */
export type MainMenuTeamColorRenderImage<TTexture> = {
  texture: TTexture;
  width: number;
  height: number;
};

/**
 * Replacement for upstream `GMMWTeamColor::DoRender` state.
 * Role: Holds the team-color widget fields needed to render the active swatch.
 * Upstream: zgui_main_menu_widgets.h:317-333, gmmw_team_color.cpp:39-51
 */
export type MainMenuTeamColorRenderState<TTexture> = {
  finishedInit: boolean;
  active: boolean;
  team: number;
  x: number;
  y: number;
  teamColorImages: readonly (
    | MainMenuTeamColorRenderImage<TTexture>
    | null
    | undefined
  )[];
};

const MAIN_MENU_TEAM_COLOR_TEAM_NAMES = [
  "null",
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "teal",
  "white",
  "black",
] as const;

/**
 * Port of upstream `GMMWTeamColor::Init`.
 * Role: Initializes team-color widget images for every active team.
 * Upstream: gmmw_team_color.cpp:17-29
 */
export function initMainMenuTeamColor<TSurface>(
  state: MainMenuTeamColorInitState<TSurface>,
  makeTeamSurface: TeamSurfaceFactory<TSurface>,
): void {
  const baseImage = state.teamColorImages[TEAM_RENDERING_BASE_TEAM];
  if (!baseImage) return;

  for (let team = 0; team < ACTIVE_TEAM_TYPE_COUNT; team += 1) {
    const teamImage = state.teamColorImages[team];
    if (!teamImage) continue;

    loadTeamZSurface(
      team,
      baseImage,
      teamImage,
      `assets/other/main_menu_gui/team_color_${MAIN_MENU_TEAM_COLOR_TEAM_NAMES[team]}.png`,
      makeTeamSurface,
    );
  }

  state.finishedInit = true;
}

/**
 * Replacement for upstream `GMMWTeamColor::DoRender`.
 * Role: Builds the texture command used to draw the selected main-menu team color.
 * Upstream: gmmw_team_color.cpp:39-51
 */
export function renderMainMenuTeamColor<TTexture>(
  state: MainMenuTeamColorRenderState<TTexture>,
  offsetX: number,
  offsetY: number,
): TexturedSurfaceRenderCommand<TTexture> | null {
  if (!state.finishedInit) return null;
  if (!state.active) return null;
  if (state.team < 0) return null;
  if (state.team >= ACTIVE_TEAM_TYPE_COUNT) return null;

  const image = state.teamColorImages[state.team];
  if (!image) return null;

  return {
    texture: image.texture,
    destinationX: offsetX + state.x,
    destinationY: offsetY + state.y,
    width: image.width,
    height: image.height,
    sourceX: 0,
    sourceY: 0,
    sourceWidth: image.width,
    sourceHeight: image.height,
    textureLeft: 0,
    textureTop: 0,
    textureRight: 1,
    textureBottom: 1,
    scale: 1,
    angle: 0,
    alpha: 1,
  };
}

/**
 * Minimal state consumed by ported `GMMWRadio::Init`.
 * Role: Holds radio widget image paths and the initialization flag.
 * Upstream: gmmw_radio.cpp:18-26
 */
export type MainMenuRadioInitState = {
  radioLeftImage: string | null;
  radioCenterImage: string | null;
  radioRightImage: string | null;
  radioSelectorImage: string | null;
  finishedInit: boolean;
};

/**
 * Minimal state consumed by ported `GMMWRadio::Click`.
 * Role: Holds radio widget bounds, option count, and emitted click flags.
 * Upstream: zgui_main_menu_widgets.h:286-289, gmmw_radio.cpp:48-69
 */
export type MainMenuRadioClickState = {
  x: number;
  y: number;
  width: number;
  height: number;
  selections: number;
  flags: MainMenuWidgetFlag;
};

/**
 * Port of upstream `GMMWRadio::Init`.
 * Role: Initializes radio widget image paths.
 * Upstream: gmmw_radio.cpp:18-26
 */
export function initMainMenuRadio(state: MainMenuRadioInitState): void {
  state.radioLeftImage =
    "assets/other/main_menu_gui/radio/radio_left.png";
  state.radioCenterImage =
    "assets/other/main_menu_gui/radio/radio_center.png";
  state.radioRightImage =
    "assets/other/main_menu_gui/radio/radio_right.png";
  state.radioSelectorImage =
    "assets/other/main_menu_gui/radio/radio_selector.png";
  state.finishedInit = true;
}

/**
 * Port of upstream `GMMWRadio::GetSelected`.
 * Role: Reports the selected radio option index.
 * Upstream: zgui_main_menu_widgets.h:298
 */
export function getMainMenuRadioSelected(state: {
  selectedIndex: number;
}): number {
  return state.selectedIndex;
}

/**
 * Port of upstream `GMMWRadio::CheckSI`.
 * Role: Clamps an invalid selected radio option index back to the first option.
 * Upstream: gmmw_radio.cpp:39-46
 */
export function checkMainMenuRadioSelectedIndex(state: {
  selectedIndex: number;
  selections: number;
}): void {
  if (state.selectedIndex < 0 || state.selectedIndex >= state.selections) {
    state.selectedIndex = 0;
  }
}

/**
 * Port of upstream `GMMWRadio::SetSelected`.
 * Role: Stores the selected radio option index and validates it.
 * Upstream: zgui_main_menu_widgets.h:297
 */
export function setMainMenuRadioSelected(
  state: { selectedIndex: number; selections: number },
  selectedIndex: number,
): void {
  state.selectedIndex = selectedIndex;
  checkMainMenuRadioSelectedIndex(state);
}

/**
 * Port of upstream `GMMWRadio::SetMaxSelections`.
 * Role: Updates the radio option count, clamps it to the minimum, refreshes width, and validates selection.
 * Upstream: gmmw_radio.cpp:28-37
 */
export function setMainMenuRadioMaxSelections(
  state: { selections: number; width: number; selectedIndex: number },
  selections: number,
): void {
  state.selections = Math.max(selections, MAIN_MENU_RADIO_MIN_SELECTIONS);
  state.width =
    MAIN_MENU_RADIO_LEFT_WIDTH_PIXELS +
    (state.selections - 2) * MAIN_MENU_RADIO_CENTER_WIDTH_PIXELS +
    MAIN_MENU_RADIO_RIGHT_WIDTH_PIXELS;

  checkMainMenuRadioSelectedIndex(state);
}

/**
 * Port of upstream `GMMWRadio::Click`.
 * Role: Converts an in-bounds radio click into the selected option index flag.
 * Upstream: gmmw_radio.cpp:48-69
 */
export function clickMainMenuRadio(
  state: MainMenuRadioClickState,
  clickX: number,
  clickY: number,
): boolean {
  state.flags.clear();

  if (clickX < state.x) return false;
  if (clickX > state.x + state.width) return false;
  if (clickY < state.y) return false;
  if (clickY > state.y + state.height) return false;

  const localX = clickX - state.x;

  if (localX < MAIN_MENU_RADIO_LEFT_WIDTH_PIXELS) {
    state.flags.radioSelectionIndexSelected = 0;
  } else if (localX > state.width - MAIN_MENU_RADIO_RIGHT_WIDTH_PIXELS) {
    state.flags.radioSelectionIndexSelected = state.selections - 1;
  } else {
    state.flags.radioSelectionIndexSelected =
      1 +
      Math.trunc(
        (localX - MAIN_MENU_RADIO_LEFT_WIDTH_PIXELS) /
          MAIN_MENU_RADIO_CENTER_WIDTH_PIXELS,
      );
  }

  return true;
}

/**
 * Port of upstream `GMMWBUTTON_HEIGHT`.
 * Role: Defines the standard main-menu button height.
 * Upstream: zgui_main_menu_widgets.h:95
 */
export const MAIN_MENU_BUTTON_HEIGHT_PIXELS = 15;

/**
 * Port of upstream `MMLABEL_HEIGHT`.
 * Role: Defines the standard main-menu label height.
 * Upstream: zgui_main_menu_widgets.h:141
 */
export const MAIN_MENU_LABEL_HEIGHT_PIXELS = 10;

/**
 * Port of upstream `MMLIST_MIN_ENTRIES`.
 * Role: Defines the minimum visible entry count for main-menu lists.
 * Upstream: zgui_main_menu_widgets.h:170
 */
export const MAIN_MENU_LIST_MIN_ENTRIES = 4;

/**
 * Port of upstream `MMLIST_ENTRY_HEIGHT`.
 * Role: Defines the row height for main-menu list entries.
 * Upstream: zgui_main_menu_widgets.h:169
 */
export const MAIN_MENU_LIST_ENTRY_HEIGHT_PIXELS = 13;

/**
 * Port of upstream `MMLIST_UP_BUTTON_FROM_TOP`.
 * Role: Defines the list scroll-up button top offset.
 * Upstream: zgui_main_menu_widgets.h:172
 */
export const MAIN_MENU_LIST_UP_BUTTON_TOP_OFFSET_PIXELS = 3;

/**
 * Port of upstream `MMLIST_UP_BUTTON_FROM_RIGHT`.
 * Role: Defines the list scroll-up button right offset.
 * Upstream: zgui_main_menu_widgets.h:173
 */
export const MAIN_MENU_LIST_UP_BUTTON_RIGHT_OFFSET_PIXELS = 12;

/**
 * Port of upstream `MMLIST_DOWN_BUTTON_FROM_BOTTOM`.
 * Role: Defines the list scroll-down button bottom offset.
 * Upstream: zgui_main_menu_widgets.h:174
 */
export const MAIN_MENU_LIST_DOWN_BUTTON_BOTTOM_OFFSET_PIXELS = 11;

/**
 * Port of upstream `MMLIST_DOWN_BUTTON_FROM_RIGHT`.
 * Role: Defines the list scroll-down button right offset.
 * Upstream: zgui_main_menu_widgets.h:175
 */
export const MAIN_MENU_LIST_DOWN_BUTTON_RIGHT_OFFSET_PIXELS = 12;

/**
 * Port of upstream `MMLIST_SCROLLER_FROM_RIGHT`.
 * Role: Defines the list scrollbar right offset.
 * Upstream: zgui_main_menu_widgets.h:176
 */
export const MAIN_MENU_LIST_SCROLLER_RIGHT_OFFSET_PIXELS = 9;

/**
 * Port of upstream `MMRADIO_LEFT_WIDTH`.
 * Role: Defines the left segment width for main-menu radio controls.
 * Upstream: zgui_main_menu_widgets.h:280
 */
export const MAIN_MENU_RADIO_LEFT_WIDTH_PIXELS = 16;

/**
 * Port of upstream `MMRADIO_HEIGHT`.
 * Role: Defines the height of main-menu radio controls.
 * Upstream: zgui_main_menu_widgets.h:279
 */
export const MAIN_MENU_RADIO_HEIGHT_PIXELS = 9;

/**
 * Port of upstream `MMRADIO_CENTER_WIDTH`.
 * Role: Defines the center segment width for main-menu radio controls.
 * Upstream: zgui_main_menu_widgets.h:281
 */
export const MAIN_MENU_RADIO_CENTER_WIDTH_PIXELS = 13;

/**
 * Port of upstream `MMRADIO_RIGHT_WIDTH`.
 * Role: Defines the right segment width for main-menu radio controls.
 * Upstream: zgui_main_menu_widgets.h:282
 */
export const MAIN_MENU_RADIO_RIGHT_WIDTH_PIXELS = 15;

/**
 * Port of upstream `MMRADIO_MIN_SELECTIONS`.
 * Role: Defines the minimum number of selectable radio entries.
 * Upstream: zgui_main_menu_widgets.h:283
 */
export const MAIN_MENU_RADIO_MIN_SELECTIONS = 2;

/**
 * Port of upstream `MMTEAM_COLOR_WIDTH`.
 * Role: Defines the main-menu team-color swatch width.
 * Upstream: zgui_main_menu_widgets.h:315
 */
export const MAIN_MENU_TEAM_COLOR_WIDTH_PIXELS = 19;

/**
 * Port of upstream `MMTEAM_COLOR_HEIGHT`.
 * Role: Defines the main-menu team-color swatch height.
 * Upstream: zgui_main_menu_widgets.h:314
 */
export const MAIN_MENU_TEAM_COLOR_HEIGHT_PIXELS = 12;

/**
 * Port of upstream `MMTEXT_BOX_HEIGHT`.
 * Role: Defines the standard main-menu text-box height.
 * Upstream: zgui_main_menu_widgets.h:335
 */
export const MAIN_MENU_TEXT_BOX_HEIGHT_PIXELS = 14;
