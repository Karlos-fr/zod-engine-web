/**
 * Upstream: gmm_warning.h
 */
import { MainMenuEventType, MainMenuWarningFlag } from "./MainMenuBase";

/**
 * Port of upstream `_ZGMM_WARNING_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: gmm_warning.h:2
 */
export const ZGMM_WARNING_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream warning button reference dependency.
 * Role: Provides a widget reference id for warning OK/Cancel matching.
 * Upstream: gmm_warning.cpp:75, gmm_warning.cpp:81
 */
export type MainMenuWarningButtonRef = {
  getRefId(): number;
};

/**
 * Port of upstream warning event widget dependency.
 * Role: Provides the widget reference id that raised a warning dialog event.
 * Upstream: gmm_warning.cpp:70
 */
export type MainMenuWarningEventWidget = {
  getRefId(): number;
};

/**
 * Port of upstream `GMMWarning::HandleWidgetEvent` mutable fields.
 * Role: Holds warning dialog buttons, output flags, configured warning actions, and kill state.
 * Upstream: gmm_warning.cpp:75-83
 */
export type MainMenuWarningWidgetEventState = {
  killMe: boolean;
  okButton: MainMenuWarningButtonRef;
  cancelButton: MainMenuWarningButtonRef;
  warningFlags: MainMenuWarningFlag;
  mainMenuFlags: {
    quitGame: boolean;
    resetMap: boolean;
  };
};

/**
 * Port of upstream `GMMWarning::HandleWidgetEvent`.
 * Role: Handles OK/Cancel unclicks, closes the warning, and applies configured warning actions.
 * Upstream: gmm_warning.cpp:64-87
 */
export function handleMainMenuWarningWidgetEvent(
  state: MainMenuWarningWidgetEventState,
  eventType: MainMenuEventType | number,
  eventWidget: MainMenuWarningEventWidget | null | undefined,
): void {
  if (!eventWidget) return;

  const widgetRefId = eventWidget.getRefId();

  switch (eventType) {
    case MainMenuEventType.Unclick:
      if (widgetRefId === state.okButton.getRefId()) {
        state.killMe = true;
        state.mainMenuFlags.quitGame = state.warningFlags.quitGame;
        state.mainMenuFlags.resetMap = state.warningFlags.resetMap;
      } else if (widgetRefId === state.cancelButton.getRefId()) {
        state.killMe = true;
      }
      break;
  }
}
