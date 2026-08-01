/**
 * Upstream: gmm_warning.h
 */
import type { TexturedSurfaceRenderCommand } from "../rendering/SurfacePixels";
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
 * Replacement state for upstream `GMMWarning::DoRender`.
 * Role: Holds warning dialog initialization, placement, and base image data.
 * Upstream: gmm_warning.h:21-29, gmm_warning.cpp:55-61
 */
export type MainMenuWarningRenderState<TTexture> = {
  finishedInit: boolean;
  x: number;
  y: number;
  warningImage: {
    texture: TTexture;
    width: number;
    height: number;
  } | null;
};

/**
 * Replacement for upstream `GMMWarning::DoRender`.
 * Role: Builds the base warning texture command and appends widget render commands.
 * Upstream: gmm_warning.cpp:53-62
 */
export function renderMainMenuWarning<TTexture, TWidgetCommand>(
  state: MainMenuWarningRenderState<TTexture>,
  renderWidgets: () => readonly TWidgetCommand[],
): Array<TexturedSurfaceRenderCommand<TTexture> | TWidgetCommand> {
  if (!state.finishedInit) return [];
  if (!state.warningImage) return [...renderWidgets()];

  const image = state.warningImage;
  const baseCommand: TexturedSurfaceRenderCommand<TTexture> = {
    texture: image.texture,
    destinationX: state.x,
    destinationY: state.y,
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

  return [baseCommand, ...renderWidgets()];
}

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
