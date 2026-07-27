import { describe, expect, it } from "vitest";
import { AudioService, SoundSetting } from "../src/audio/AudioService";

describe("audio service", () => {
  it("replaces sound_setting volume preset identifiers", () => {
    expect(SoundSetting.Sound0).toBe(0);
    expect(SoundSetting.Sound25).toBe(1);
    expect(SoundSetting.Sound50).toBe(2);
    expect(SoundSetting.Sound75).toBe(3);
    expect(SoundSetting.Sound100).toBe(4);
    expect(SoundSetting.MaxSoundSettings).toBe(5);
  });

  it("replaces ZSDL_SetMusicOn with service music state", () => {
    const audio = new AudioService();

    audio.setMusicOn(false);
    expect(audio.enabled).toBe(false);

    audio.setMusicOn(true);
    expect(audio.enabled).toBe(true);
  });

  it("keeps the generic enablement setter as an alias", () => {
    const audio = new AudioService();

    audio.setEnabled(false);

    expect(audio.enabled).toBe(false);
  });

  it("replaces ZSDL_PlayMusic with guarded backend playback", () => {
    const audio = new AudioService();
    const music = { id: "theme" };
    const calls: unknown[][] = [];

    const result = audio.playMusic(music, -1, (handle, loops) => {
      calls.push([handle, loops]);
      return 1;
    });

    expect(result).toBe(1);
    expect(calls).toEqual([[music, -1]]);
  });

  it("does not play music when disabled or missing", () => {
    const audio = new AudioService();
    const calls: unknown[][] = [];
    const player = (music: object, loops: number): number => {
      calls.push([music, loops]);
      return 1;
    };

    audio.setMusicOn(false);

    expect(audio.playMusic({ id: "theme" }, -1, player)).toBe(0);
    audio.setMusicOn(true);
    expect(audio.playMusic(null, -1, player)).toBe(0);
    expect(calls).toEqual([]);
  });

  it("replaces ZMix_PlayChannel with guarded backend playback", () => {
    const audio = new AudioService();
    const chunk = { id: "click" };
    const calls: unknown[][] = [];

    const result = audio.playChannel(2, chunk, 0, (channel, wav, repeat) => {
      calls.push([channel, wav, repeat]);
      return 2;
    });

    expect(result).toBe(2);
    expect(calls).toEqual([[2, chunk, 0]]);
  });

  it("does not play channels when disabled", () => {
    const audio = new AudioService();
    const calls: unknown[][] = [];

    audio.setMusicOn(false);

    const result = audio.playChannel(2, null, 0, (channel, wav, repeat) => {
      calls.push([channel, wav, repeat]);
      return 2;
    });

    expect(result).toBe(0);
    expect(calls).toEqual([]);
  });

  it("reports channel playback failure", () => {
    const audio = new AudioService();
    let failed = false;

    const result = audio.playChannel(
      2,
      null,
      0,
      () => -1,
      () => {
        failed = true;
      },
    );

    expect(result).toBe(-1);
    expect(failed).toBe(true);
  });
});
