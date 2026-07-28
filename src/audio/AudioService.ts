/**
 * Ported from Zod Engine.
 * Upstream: zsdl.cpp / zmusic_engine.h / zsound_engine.h
 */

/**
 * Port of upstream `_ZMUSIC_ENGINE_H_`.
 * Role: Marks an upstream header boundary.
 * Ledger: MAC-D6050B
 * Upstream: zmusic_engine.h:2
 */
export const ZMUSIC_ENGINE_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `_ZSOUND_ENGINE_H_`.
 * Role: Marks an upstream header boundary.
 * Ledger: MAC-05D842
 * Upstream: zsound_engine.h:2
 */
export const ZSOUND_ENGINE_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ZSOUND_MIX_CHANNELS`.
 * Role: Defines the SDL mixer channel count for the sound engine.
 * Ledger: MAC-E436C3
 * Upstream: zsound_engine.h:6
 */
export const SOUND_ENGINE_MIX_CHANNELS = 32;

/**
 * Port of upstream `MAX_COMP_LOSING_MESSAGES`.
 * Role: Defines how many computer losing voice lines are available.
 * Ledger: MAC-A79FD1
 * Upstream: zsound_engine.h:8
 */
export const SOUND_ENGINE_MAX_COMP_LOSING_MESSAGES = 10;

/**
 * Replacement for upstream `sound_setting`.
 * Role: Identifies the fixed volume presets available to the SDL audio layer.
 * Ledger: ENU-ACA136
 * Upstream: zsdl.h:15-18
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
 * Port of upstream `sound_engine_sound`.
 * Role: Identifies every sound effect slot managed in the sound engine.
 * Ledger: ENU-1914D2
 * Upstream: zsound_engine.h:11-41
 */
export enum SoundEngineSound {
  PsychoFireSnd = 0,
  RiochetSnd = 1,
  RandomExplosionSnd = 2,
  LightRandomExplosionSnd = 3,
  LightFireSnd = 4,
  MediumFireSnd = 5,
  HeavyFireSnd = 6,
  PyroFireSnd = 7,
  LaserFireSnd = 8,
  RifleFireSnd = 9,
  GunFireSnd = 10,
  GatlingFireSnd = 11,
  TurrentExplosionSnd = 12,
  JeepFireSnd = 13,
  ToughFireSnd = 14,
  MomissileFireSnd = 15,
  RadarSnd = 16,
  RobotFactorySnd = 17,
  VehicleFactorySnd = 18,
  CompVehicleSnd = 19,
  CompRobotSnd = 20,
  CompGunSnd = 21,
  CompStartingManufactureSnd = 22,
  CompManufacturingCanceledSnd = 23,
  CompStartingRepairSnd = 24,
  CompVehicleRepairedSnd = 25,
  CompTerritoryLostSnd = 26,
  CompRadarActivatedSnd = 27,
  CompFortUnderAttack = 28,
  CompYourLosing0 = 29,
  CompYourLosing1 = 30,
  CompYourLosing2 = 31,
  CompYourLosing3 = 32,
  CompYourLosing4 = 33,
  CompYourLosing5 = 34,
  CompYourLosing6 = 35,
  CompYourLosing7 = 36,
  CompYourLosing8 = 37,
  CompYourLosing9 = 38,
  BatChirpSnd = 39,
  CrowSnd = 40,
  ThrowGrenadeSnd = 41,
  YesSir1Snd = 42,
  YesSir2Snd = 43,
  YesSir3Snd = 44,
  UnitReporting1Snd = 45,
  UnitReporting2Snd = 46,
  UnitReporting3Snd = 47,
  GruntsReportingSnd = 48,
  PsychosReportingSnd = 49,
  SnipersReportingSnd = 50,
  ToughsReportingSnd = 51,
  LasersReportingSnd = 52,
  PyrosReportingSnd = 53,
  WereOnOurWaySnd = 54,
  HereWeGoSnd = 55,
  YouGotItSnd = 56,
  MovingInSnd = 57,
  OkaySnd = 58,
  AlrightSnd = 59,
  NoProblemSnd = 60,
  OverAndOutSnd = 61,
  AffirmativeSnd = 62,
  GoingInSnd = 63,
  LetsDoItSnd = 64,
  LetsGetThemSnd = 65,
  WereUnderAttackSnd = 66,
  ISaidWereUnderAttackSnd = 67,
  HelpHelpSnd = 68,
  TheyreAllOverUsSnd = 69,
  WereLosingItSnd = 70,
  AaahhhSnd = 71,
  OhMyGodSnd = 72,
  ForChristSakeSnd = 73,
  YourJokingSnd = 74,
  NoWaySnd = 75,
  ForgetItSnd = 76,
  GetOuttaHereSnd = 77,
  TargetDestroyedSnd = 78,
  BridgeDestroyedSnd = 79,
  BuildingDestroyedSnd = 80,
  GoodHitSnd = 81,
  NiceOneSnd = 82,
  OhYeahSnd = 83,
  GotchaSnd = 84,
  SmokinSnd = 85,
  CoolSnd = 86,
  WipeOutSnd = 87,
  BridgeRepairedSnd = 88,
  BuildingRepairedSnd = 89,
  TerritoryTakenSnd = 90,
  FireExtinguishedSnd = 91,
  GunCapturedSnd = 92,
  VehicleCapturedSnd = 93,
  GrenadesCollectedSnd = 94,
  LetsTakeTheFortSnd = 95,
  LetsDoThemSnd = 96,
  TheyreOnTheRunSnd = 97,
  LetsFinishThemOffSnd = 98,
  WhatAreYouWaitingForSnd = 99,
  LetsEndItNowSnd = 100,
  LetsGoForItSnd = 101,
  YeehaaEndSnd = 102,
  NiceOneEndSnd = 103,
  AlrightEndSnd = 104,
  ExcelentEndSnd = 105,
  WeveDoneItEndSnd = 106,
  YeahhhEndSnd = 107,
  YoureCrapLoseSnd = 108,
  WeveLostItLoseSnd = 109,
  YouveBlownItLoseSnd = 110,
  WeHateYouLoseSnd = 111,
  MoronLoseSnd = 112,
  AssholeLoseSnd = 113,
  ItsOverLoseSnd = 114,
  LetsDoIt1StartSnd = 115,
  LetsDoIt2StartSnd = 116,
  MaxEngineSounds = 117,
}

/**
 * Port of upstream `music_danger_level`.
 * Role: Identifies the current music intensity level selected by the music engine.
 * Ledger: ENU-B8605B
 * Upstream: zmusic_engine.h:13-16
 */
export enum MusicDangerLevel {
  Calm = 0,
  Attacking = 1,
  Fort = 2,
  MaxDangerLevels = 3,
}

/**
 * Port of upstream `d_level_start_info`.
 * Role: Stores a danger-level music segment start position and length.
 * Ledger: CLS-7D80D5
 * Upstream: zmusic_engine.h:18-30
 */
export class DangerLevelStartInfo {
  position: number;
  length: number;

  constructor(position = 0, length = 0) {
    this.position = position;
    this.length = length;
  }
}

/**
 * Port of upstream `SetMusicOn`.
 * Role: Stores whether the music engine sound system is enabled.
 * Ledger: FUN-27AA31
 * Upstream: zmusic_engine.h:39
 */
export function setMusicEngineMusicOn(
  state: { soundSystemOn: boolean },
  musicOn: boolean,
): void {
  state.soundSystemOn = musicOn;
}

/**
 * Port of upstream `GetDangerLevel`.
 * Role: Reports the music engine's current danger level.
 * Ledger: FUN-2D51EC
 * Upstream: zmusic_engine.h:46
 */
export function getMusicEngineDangerLevel(state: {
  dangerLevel: MusicDangerLevel;
}): MusicDangerLevel {
  return state.dangerLevel;
}

/**
 * Browser-side replacement for an SDL music handle.
 * Role: Carries an opaque music asset for the playback backend.
 * Ledger: FUN-721511
 * Upstream: zsdl.cpp:411-417
 */
export type MusicHandle = object;

/**
 * Browser-side replacement for the `Mix_PlayMusic` callback.
 * Role: Starts playback for a music handle and returns the backend status code.
 * Ledger: FUN-721511
 * Upstream: zsdl.cpp:411-417
 */
export type MusicPlayer = (music: MusicHandle, loops: number) => number;

/**
 * Browser-side replacement for an SDL chunk handle.
 * Role: Carries an opaque sound effect asset for the playback backend.
 * Ledger: FUN-7E19BF
 * Upstream: zsdl.cpp:419-429
 */
export type SoundChunkHandle = object | null;

/**
 * Browser-side replacement for the `Mix_PlayChannel` callback.
 * Role: Starts playback for a sound chunk and returns the backend channel/status.
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
   * Role: Tracks whether music playback is currently allowed.
   * Ledger: FUN-480910
   * Upstream: zsdl.cpp:406-409
   */
  enabled = true;

  /**
   * Replacement for upstream `ZSDL_SetMusicOn`.
   * Role: Enables or disables music playback.
   * Ledger: FUN-480910
   * Upstream: zsdl.cpp:406-409
   */
  setMusicOn(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Replacement for upstream `ZSDL_PlayMusic`.
   * Role: Plays a music asset only when music playback is enabled and a handle is available.
   * Ledger: FUN-721511
   * Upstream: zsdl.cpp:411-417
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
   * Role: Plays a sound chunk on a requested channel when audio playback is enabled.
   * Ledger: FUN-7E19BF
   * Upstream: zsdl.cpp:419-429
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
