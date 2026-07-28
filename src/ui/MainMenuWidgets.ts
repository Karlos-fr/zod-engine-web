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
 * Port of upstream `ToggleActive`.
 * Role: Inverts whether a main-menu widget is active.
 * Upstream: zgui_main_menu_widgets.h:51
 */
export function toggleMainMenuWidgetActive(state: { active: boolean }): void {
  state.active = !state.active;
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
