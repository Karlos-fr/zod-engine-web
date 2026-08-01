/**
 * Upstream: gmm_multiplayer.h
 */

import {
  MAIN_MENU_BOTTOM_MARGIN_PIXELS,
  MAIN_MENU_SIDE_MARGIN_PIXELS,
  MAIN_MENU_TITLE_MARGIN_PIXELS,
} from "./MainMenuBase";
import { MAIN_MENU_TEXT_BOX_HEIGHT_PIXELS } from "./MainMenuWidgets";

/**
 * Port of upstream `_ZGMM_MULTIPLAYER_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: gmm_multiplayer.h:2
 */
export const ZGMM_MULTIPLAYER_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `GMMMultiplayer::SetupLayout1` text-box dependency surface.
 * Role: Receives host text-box layout, selection, and default text.
 * Upstream: gmm_multiplayer.cpp:19-23
 */
export type MainMenuMultiplayerHostTextBox = {
  setCoords(x: number, y: number): void;
  setDimensions(width: number, height: number): void;
  setSelected(selected: boolean): void;
  setText(text: string): void;
};

/**
 * Port of upstream `GMMMultiplayer::SetupLayout1` state.
 * Role: Holds menu dimensions and the host text box used by multiplayer layout 1.
 * Upstream: gmm_multiplayer.cpp:17-29
 */
export type MainMenuMultiplayerLayoutState = {
  width: number;
  height: number;
  hostTextBox: MainMenuMultiplayerHostTextBox;
  widgetList: unknown[];
  updateDimensions(): void;
};

/**
 * Port of upstream `GMMMultiplayer::SetupLayout1`.
 * Role: Builds the multiplayer host text-box layout and final menu height.
 * Upstream: gmm_multiplayer.cpp:13-30
 */
export function setupMainMenuMultiplayerLayout(
  state: MainMenuMultiplayerLayoutState,
): void {
  let nextY = MAIN_MENU_TITLE_MARGIN_PIXELS;

  state.hostTextBox.setCoords(MAIN_MENU_SIDE_MARGIN_PIXELS, nextY);
  state.hostTextBox.setDimensions(
    state.width - MAIN_MENU_SIDE_MARGIN_PIXELS * 2,
    MAIN_MENU_TEXT_BOX_HEIGHT_PIXELS,
  );
  state.hostTextBox.setSelected(true);
  state.hostTextBox.setText("test");
  state.widgetList.push(state.hostTextBox);
  nextY += MAIN_MENU_TEXT_BOX_HEIGHT_PIXELS;

  state.height = nextY + MAIN_MENU_BOTTOM_MARGIN_PIXELS;
  state.updateDimensions();
}

/**
 * Port of upstream `GMMMultiplayer::HandleWidgetEvent`.
 * Role: Hook for multiplayer widget events; upstream has no behavior.
 * Upstream: gmm_multiplayer.cpp:32-35
 */
export function handleMainMenuMultiplayerWidgetEvent(
  eventType: number,
  eventWidget: unknown,
): void {
  void eventType;
  void eventWidget;
}
