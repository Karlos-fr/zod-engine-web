import { describe, expect, it } from "vitest";
import { SoundSetting } from "../src/audio/AudioService";
import {
  processMainMenuOptions,
  setMainMenuOptionsTimeStatuses,
  setMainMenuOptionsVolumeStatus,
  type MainMenuOptionsProcessState,
  type MainMenuOptionsTimeStatusState,
  type MainMenuOptionsVolumeStatusState,
  ZGMM_OPTIONS_HEADER_GUARD_PORTED,
} from "../src/ui/MainMenuOptions";

describe("main menu options", () => {
  it("adapts the gmm_options.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/ui/MainMenuOptions");
    const secondImport = await import("../src/ui/MainMenuOptions");

    expect(ZGMM_OPTIONS_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZGMM_OPTIONS_HEADER_GUARD_PORTED).toBe(
      firstImport.ZGMM_OPTIONS_HEADER_GUARD_PORTED,
    );
  });

  it("ports GMMOptions SetVolumeStatus as a no-op without sound setting", () => {
    const state = createVolumeStatusState(null, 0);

    setMainMenuOptionsVolumeStatus(state);

    expect(state.volumeLabel).toEqual({
      text: "Set Volume:",
      renderedText: "Set Volume:",
      rerenderText: false,
    });
    expect(state.volumeRadio.selectedIndex).toBe(0);
  });

  it("ports GMMOptions SetVolumeStatus as a no-op for invalid sound setting", () => {
    const negative = createVolumeStatusState(-1, 0);
    const tooHigh = createVolumeStatusState(SoundSetting.MaxSoundSettings, 0);

    setMainMenuOptionsVolumeStatus(negative);
    setMainMenuOptionsVolumeStatus(tooHigh);

    expect(negative.volumeRadio.selectedIndex).toBe(0);
    expect(tooHigh.volumeRadio.selectedIndex).toBe(0);
    expect(negative.volumeLabel.rerenderText).toBe(false);
    expect(tooHigh.volumeLabel.rerenderText).toBe(false);
  });

  it("ports GMMOptions SetVolumeStatus as a no-op when radio already matches", () => {
    const state = createVolumeStatusState(SoundSetting.Sound50, SoundSetting.Sound50);

    setMainMenuOptionsVolumeStatus(state);

    expect(state.volumeLabel).toEqual({
      text: "Set Volume:",
      renderedText: "Set Volume:",
      rerenderText: false,
    });
    expect(state.volumeRadio.selectedIndex).toBe(SoundSetting.Sound50);
  });

  it("ports GMMOptions SetVolumeStatus as label and radio synchronization", () => {
    const state = createVolumeStatusState(SoundSetting.Sound75, SoundSetting.Sound25);

    setMainMenuOptionsVolumeStatus(state);

    expect(state.volumeLabel).toEqual({
      text: "Set Volume: 75%",
      renderedText: "Set Volume:",
      rerenderText: true,
    });
    expect(state.volumeRadio.selectedIndex).toBe(SoundSetting.Sound75);
  });

  it("ports GMMOptions SetTimeStatuses as a no-op without ztime", () => {
    const state = createTimeStatusState(null, 0);

    setMainMenuOptionsTimeStatuses(state);

    expect(state.pauseButton.isGreen).toBe(false);
    expect(state.speedLabel).toEqual({
      text: "Set Game Speed:",
      renderedText: "Set Game Speed:",
      rerenderText: false,
    });
    expect(state.speedRadio.selectedIndex).toBe(0);
  });

  it("ports GMMOptions SetTimeStatuses as pause and speed control synchronization", () => {
    const state = createTimeStatusState({ paused: true, gameSpeed: 1.49 }, 0);

    setMainMenuOptionsTimeStatuses(state);

    expect(state.pauseButton.isGreen).toBe(true);
    expect(state.speedLabel).toEqual({
      text: "Set Game Speed: 149%\n",
      renderedText: "Set Game Speed:",
      rerenderText: true,
    });
    expect(state.speedRadio.selectedIndex).toBe(4);
  });

  it("ports GMMOptions SetTimeStatuses using the upstream speed threshold tolerance", () => {
    const state = createTimeStatusState({ paused: false, gameSpeed: 1.51 }, 0);

    setMainMenuOptionsTimeStatuses(state);

    expect(state.pauseButton.isGreen).toBe(false);
    expect(state.speedLabel.text).toBe("Set Game Speed: 151%\n");
    expect(state.speedRadio.selectedIndex).toBe(4);
  });

  it("ports GMMOptions SetTimeStatuses without speed update above known choices", () => {
    const state = createTimeStatusState({ paused: true, gameSpeed: 4.02 }, 3);

    setMainMenuOptionsTimeStatuses(state);

    expect(state.pauseButton.isGreen).toBe(true);
    expect(state.speedLabel).toEqual({
      text: "Set Game Speed:",
      renderedText: "Set Game Speed:",
      rerenderText: false,
    });
    expect(state.speedRadio.selectedIndex).toBe(3);
  });

  it("ports GMMOptions Process as status refresh before widget processing", () => {
    const calls: string[] = [];
    const state: MainMenuOptionsProcessState = {
      ...createVolumeStatusState(SoundSetting.Sound100, SoundSetting.Sound0),
      ...createTimeStatusState({ paused: true, gameSpeed: 0.74 }, 0),
      processWidgets: () => {
        calls.push(
          `${state.volumeRadio.selectedIndex}:${state.speedRadio.selectedIndex}:${state.pauseButton.isGreen}`,
        );
      },
    };

    processMainMenuOptions(state);

    expect(calls).toEqual(["4:2:true"]);
    expect(state.volumeLabel.text).toBe("Set Volume: 100%");
    expect(state.speedLabel.text).toBe("Set Game Speed: 74%\n");
  });
});

function createVolumeStatusState(
  soundSetting: number | null,
  selectedIndex: number,
): MainMenuOptionsVolumeStatusState {
  return {
    soundSetting: soundSetting === null ? null : { value: soundSetting },
    volumeLabel: {
      text: "Set Volume:",
      renderedText: "Set Volume:",
      rerenderText: false,
    },
    volumeRadio: {
      selectedIndex,
      selections: SoundSetting.MaxSoundSettings,
    },
  };
}

function createTimeStatusState(
  ztime: { paused: boolean; gameSpeed: number } | null,
  selectedIndex: number,
): MainMenuOptionsTimeStatusState {
  return {
    ztime,
    pauseButton: {
      isGreen: false,
    },
    speedLabel: {
      text: "Set Game Speed:",
      renderedText: "Set Game Speed:",
      rerenderText: false,
    },
    speedRadio: {
      selectedIndex,
      selections: 7,
    },
  };
}
