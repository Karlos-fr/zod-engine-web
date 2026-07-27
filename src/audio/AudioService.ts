/**
 * Ported from Zod Engine upstream.
 *
 * Upstream:
 * - File: zsdl.cpp
 * - Symbols: sound_setting, ZSDL_SetMusicOn, ZSDL_PlayMusic, ZMix_PlayChannel
 * - Ledger: ENU-ACA136, FUN-480910, FUN-721511, FUN-7E19BF
 *
 * Porting notes:
 * - Global SDL audio flags are represented as instance state on `AudioService`.
 */

/**
 * Replacement for upstream `sound_setting`.
 *
 * Role:
 * - Identifies the fixed volume presets available to the SDL audio layer.
 *
 * Ledger: ENU-ACA136
 * Upstream: zsdl.h:15-18
 *
 * Adaptation:
 * - Preserves numeric enum values while using descriptive TypeScript names.
 */
export enum SoundSetting {
  Sound0 = 0,
  Sound25 = 1,
  Sound50 = 2,
  Sound75 = 3,
  Sound100 = 4,
  MaxSoundSettings = 5,
}

/**
 * Browser-side replacement for an SDL music handle.
 *
 * Role:
 * - Carries an opaque music asset accepted by the playback backend.
 *
 * Ledger: FUN-721511
 * Upstream: zsdl.cpp:411-417
 */
export type MusicHandle = object;

/**
 * Browser-side replacement for the `Mix_PlayMusic` callback.
 *
 * Role:
 * - Starts playback for a music handle and returns the backend status code.
 *
 * Ledger: FUN-721511
 * Upstream: zsdl.cpp:411-417
 */
export type MusicPlayer = (music: MusicHandle, loops: number) => number;

/**
 * Browser-side replacement for an SDL chunk handle.
 *
 * Role:
 * - Carries an opaque sound effect asset accepted by the playback backend.
 *
 * Ledger: FUN-7E19BF
 * Upstream: zsdl.cpp:419-429
 */
export type SoundChunkHandle = object | null;

/**
 * Browser-side replacement for the `Mix_PlayChannel` callback.
 *
 * Role:
 * - Starts playback for a sound chunk and returns the backend channel/status.
 *
 * Ledger: FUN-7E19BF
 * Upstream: zsdl.cpp:419-429
 */
export type ChannelPlayer = (
  channel: number,
  chunk: SoundChunkHandle,
  repeat: number,
) => number;

export class AudioService {
  /**
   * Browser-side audio enablement state.
   *
   * Role:
   * - Tracks whether music playback is currently allowed.
   *
   * Ledger: FUN-480910
   * Upstream: zsdl.cpp:406-409
   */
  enabled = true;

  /**
   * Replacement for upstream `ZSDL_SetMusicOn`.
   *
   * Role:
   * - Enables or disables music playback.
   *
   * Ledger: FUN-480910
   * Upstream: zsdl.cpp:406-409
   *
   * Adaptation:
   * - Replaces the C++ global `zsdl_play_music` assignment with service state.
   */
  setMusicOn(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Replacement for upstream `ZSDL_PlayMusic`.
   *
   * Role:
   * - Plays a music asset only when music playback is enabled and a handle is
   *   available.
   *
   * Ledger: FUN-721511
   * Upstream: zsdl.cpp:411-417
   *
   * Adaptation:
   * - Replaces `Mix_PlayMusic(music, eh)` with an injected browser playback
   *   backend and preserves the upstream `0` no-op return value.
   */
  playMusic(
    music: MusicHandle | null,
    loops: number,
    playMusic: MusicPlayer,
  ): number {
    if (!this.enabled || !music) {
      return 0;
    }

    return playMusic(music, loops);
  }

  /**
   * Replacement for upstream `ZMix_PlayChannel`.
   *
   * Role:
   * - Plays a sound chunk on a requested channel when audio playback is enabled.
   *
   * Ledger: FUN-7E19BF
   * Upstream: zsdl.cpp:419-429
   *
   * Adaptation:
   * - Replaces `Mix_PlayChannel(ch, wav, repeat)` with an injected browser
   *   playback backend and preserves the upstream `0` no-op return value.
   * - Replaces the upstream `printf` failure message with an optional callback.
   */
  playChannel(
    channel: number,
    chunk: SoundChunkHandle,
    repeat: number,
    playChannel: ChannelPlayer,
    onPlaybackFailure: () => void = (): void => undefined,
  ): number {
    if (!this.enabled) {
      return 0;
    }

    const result = playChannel(channel, chunk, repeat);

    if (result === -1) {
      onPlaybackFailure();
    }

    return result;
  }

  setEnabled(enabled: boolean): void {
    this.setMusicOn(enabled);
  }
}
