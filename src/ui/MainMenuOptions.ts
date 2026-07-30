/**
 * Upstream: gmm_options.h / gmm_options.cpp
 */

import { SoundSetting } from "../audio/AudioService";
import { GMM_OPTIONS_SPEED_SETTING_VALUES } from "../data/GmmOptionsData";
import {
  getSimulationGameSpeed,
  isSimulationPaused,
} from "../simulation/SimulationTime";
import type {
  MainMenuSoundSettingState,
  MainMenuWidgetProcessor,
  MainMenuZTimeState,
} from "./MainMenuBase";
import { processMainMenuBase } from "./MainMenuBase";
import {
  getMainMenuRadioSelected,
  setMainMenuButtonGreen,
  setMainMenuLabelText,
  setMainMenuRadioSelected,
} from "./MainMenuWidgets";

const MAIN_MENU_OPTIONS_SOUND_SETTING_TEXT = [
  "0%",
  "25%",
  "50%",
  "75%",
  "100%",
] as const;

/**
 * Port of upstream `_ZGMM_OPTIONS_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: gmm_options.h:2
 */
export const ZGMM_OPTIONS_HEADER_GUARD_PORTED = true;

export type MainMenuOptionsVolumeStatusState = MainMenuSoundSettingState & {
  volumeLabel: {
    text: string;
    renderedText: string;
    rerenderText: boolean;
  };
  volumeRadio: {
    selectedIndex: number;
    selections: number;
  };
};

export type MainMenuOptionsTimeStatusState = MainMenuZTimeState & {
  pauseButton: {
    isGreen: boolean;
  };
  speedLabel: {
    text: string;
    renderedText: string;
    rerenderText: boolean;
  };
  speedRadio: {
    selectedIndex: number;
    selections: number;
  };
};

export type MainMenuOptionsProcessState = MainMenuOptionsVolumeStatusState &
  MainMenuOptionsTimeStatusState &
  MainMenuWidgetProcessor;

/**
 * Port of upstream `GMMOptions::SetVolumeStatus`.
 * Role: Synchronizes the options menu volume label and radio selection to the audio setting.
 * Upstream: gmm_options.cpp:97-113
 */
export function setMainMenuOptionsVolumeStatus(
  state: MainMenuOptionsVolumeStatusState,
): void {
  const soundSetting = state.soundSetting?.value;
  if (soundSetting === undefined) return;
  if (soundSetting < 0) return;
  if (soundSetting >= SoundSetting.MaxSoundSettings) return;

  if (soundSetting !== getMainMenuRadioSelected(state.volumeRadio)) {
    setMainMenuLabelText(
      state.volumeLabel,
      `Set Volume: ${MAIN_MENU_OPTIONS_SOUND_SETTING_TEXT[soundSetting]}`,
    );
    setMainMenuRadioSelected(state.volumeRadio, soundSetting);
  }
}

/**
 * Port of upstream `GMMOptions::SetTimeStatuses`.
 * Role: Synchronizes the options menu pause button and speed controls to simulation time.
 * Upstream: gmm_options.cpp:79-95
 */
export function setMainMenuOptionsTimeStatuses(
  state: MainMenuOptionsTimeStatusState,
): void {
  const ztime = state.ztime;
  if (!ztime) return;

  setMainMenuButtonGreen(state.pauseButton, isSimulationPaused(ztime));

  const gameSpeed = getSimulationGameSpeed(ztime);
  for (let i = 0; i < GMM_OPTIONS_SPEED_SETTING_VALUES.length; i += 1) {
    const speedSetting = GMM_OPTIONS_SPEED_SETTING_VALUES[i];
    if (speedSetting !== undefined && gameSpeed <= speedSetting + 0.01) {
      setMainMenuLabelText(
        state.speedLabel,
        `Set Game Speed: ${Math.round(100 * gameSpeed)}%\n`,
      );
      setMainMenuRadioSelected(state.speedRadio, i);
      break;
    }
  }
}

/**
 * Port of upstream `GMMOptions::Process`.
 * Role: Refreshes options menu status controls before processing widget interactions.
 * Upstream: gmm_options.cpp:70-77
 */
export function processMainMenuOptions(state: MainMenuOptionsProcessState): void {
  setMainMenuOptionsVolumeStatus(state);
  setMainMenuOptionsTimeStatuses(state);
  processMainMenuBase(state);
}
