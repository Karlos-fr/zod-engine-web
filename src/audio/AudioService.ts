/**
 * Upstream: zsdl.cpp / zmusic_engine.h / zsound_engine.h
 */
import { PlanetType } from "../simulation/SimulationConstants";

/**
 * Port of upstream `_ZMUSIC_ENGINE_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: zmusic_engine.h:2
 */
export const ZMUSIC_ENGINE_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `_ZSOUND_ENGINE_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: zsound_engine.h:2
 */
export const ZSOUND_ENGINE_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ZSOUND_MIX_CHANNELS`.
 * Role: Defines the SDL mixer channel count for the sound engine.
 * Upstream: zsound_engine.h:6
 */
export const SOUND_ENGINE_MIX_CHANNELS = 32;

/**
 * Port of upstream `MAX_COMP_LOSING_MESSAGES`.
 * Role: Defines how many computer losing voice lines are available.
 * Upstream: zsound_engine.h:8
 */
export const SOUND_ENGINE_MAX_COMP_LOSING_MESSAGES = 10;

/**
 * Replacement for upstream `sound_setting`.
 * Role: Identifies the fixed volume presets available to the SDL audio layer.
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
 * Browser-side replacement for upstream `Mix_Volume`.
 * Role: Applies a volume to one mixer channel or all channels when the channel is -1.
 * Upstream: zplayer.cpp:3914
 */
export type ChannelVolumeSetter = (channel: number, volume: number) => void;

/**
 * Browser-side replacement for upstream `Mix_VolumeMusic`.
 * Role: Applies a volume to music playback.
 * Upstream: zplayer.cpp:3915
 */
export type MusicVolumeSetter = (volume: number) => void;

/**
 * Port of upstream `ZPlayer::SetSoundSetting` mutable field.
 * Role: Stores the active player audio setting.
 * Upstream: zplayer.cpp:3906
 */
export type PlayerAudioSettingState = {
  soundSetting: SoundSetting | number;
};

/**
 * Port of upstream `sound_engine_sound`.
 * Role: Identifies every sound effect slot managed in the sound engine.
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
 * Upstream: zmusic_engine.h:46
 */
export function getMusicEngineDangerLevel(state: {
  dangerLevel: MusicDangerLevel;
}): MusicDangerLevel {
  return state.dangerLevel;
}

/**
 * Port of upstream `ZMusicEngine::SetDangerLevel` mutable fields.
 * Role: Stores the currently selected music danger level.
 * Upstream: zmusic_engine.cpp:327-329
 */
export type MusicDangerLevelState = {
  dangerLevel: MusicDangerLevel;
};

/**
 * Port of upstream `ZMusicEngine::ResetMusic` call target.
 * Role: Restarts music selection after a danger-level change.
 * Upstream: zmusic_engine.cpp:331
 */
export type MusicResetter = () => void;

/**
 * Browser-side replacement for upstream `Mix_SetMusicPosition`.
 * Role: Seeks the active music stream to a segment start position.
 * Upstream: zmusic_engine.cpp:355
 */
export type MusicPositionSetter = (position: number) => number;

/**
 * Browser-side replacement for upstream `Mix_GetError`.
 * Role: Supplies backend error text after a failed music seek.
 * Upstream: zmusic_engine.cpp:356
 */
export type MusicErrorReader = () => string;

/**
 * Port of upstream `ZMusicEngine::SetDangerLevel`.
 * Role: Applies a valid danger-level change and resets music when the level changes.
 * Upstream: zmusic_engine.cpp:320-332
 */
export function setMusicEngineDangerLevel(
  state: MusicDangerLevelState,
  dangerLevel: number,
  resetMusic: MusicResetter,
): void {
  if (dangerLevel < 0) return;
  if (dangerLevel >= MusicDangerLevel.MaxDangerLevels) return;
  if (dangerLevel === state.dangerLevel) return;

  state.dangerLevel = dangerLevel;
  resetMusic();
}

/**
 * Browser-side replacement for an SDL music handle.
 * Role: Carries an opaque music asset for the playback backend.
 * Upstream: zsdl.cpp:411-417
 */
export type MusicHandle = object;

/**
 * Browser-side replacement for upstream `MUS_Load_Error`.
 * Role: Loads a music asset path and returns its opaque backend handle.
 * Upstream: zmusic_engine.cpp:24, zmusic_engine.cpp:29
 */
export type MusicLoader<TMusic extends MusicHandle = MusicHandle> = (
  filename: string,
) => TMusic | null;

/**
 * Port of upstream `ZMusicEngine::Init` mutable fields.
 * Role: Holds loaded splash and planet music handles.
 * Upstream: zmusic_engine.cpp:20-40
 */
export type MusicEngineInitState<TMusic extends MusicHandle = MusicHandle> = {
  splashMusic: TMusic | null;
  planetMusic: Array<TMusic | null>;
};

/**
 * Browser-side replacement for the `Mix_PlayMusic` callback.
 * Role: Starts playback for a music handle and returns the backend status code.
 * Upstream: zsdl.cpp:411-417
 */
export type MusicPlayer = (music: MusicHandle, loops: number) => number;

/**
 * Browser-side replacement for an SDL chunk handle.
 * Role: Carries an opaque sound effect asset for the playback backend.
 * Upstream: zsdl.cpp:419-429
 */
export type SoundChunkHandle = object | null;

/**
 * Browser-side replacement for an SDL chunk volume field.
 * Role: Carries the mutable volume applied after a sound effect is loaded.
 * Upstream: zsound_engine.cpp:55-56
 */
export type SoundChunkWithVolume = {
  volume: number;
};

/**
 * Browser-side replacement for upstream `MIX_Load_Error`.
 * Role: Loads a sound effect asset by filename and returns the backend chunk handle.
 * Upstream: zsound_engine.cpp:53
 */
export type SoundChunkLoader<TChunk extends SoundChunkWithVolume> = (
  filename: string,
) => TChunk | null;

/**
 * Browser-side replacement for the `Mix_PlayChannel` callback.
 * Role: Starts playback for a sound chunk and returns the backend channel/status.
 * Upstream: zsdl.cpp:419-429
 */
export type ChannelPlayer = (
  channel: number,
  chunk: SoundChunkHandle,
  repeat: number,
) => number;

/**
 * Browser-side replacement for the `Mix_HaltChannel` callback.
 * Role: Stops playback on a backend channel.
 * Upstream: zsound_engine.cpp:101-109
 */
export type ChannelHalter = (channel: number) => void;

/**
 * Browser-side replacement for upstream `Mix_Playing`.
 * Role: Reports whether one mixer channel is currently active.
 * Upstream: zsound_engine.cpp:88
 */
export type ChannelPlayingChecker = (channel: number) => boolean;

/**
 * Port of upstream `ZMap::WithinView` dependency surface.
 * Role: Reports whether a sound source rectangle intersects the current view.
 * Upstream: zsound_engine.cpp:290
 */
export type SoundViewMap = {
  withinView(x: number, y: number, width: number, height: number): boolean;
};

/**
 * Port of upstream `ZSoundEngine::PlayWav` call target.
 * Role: Starts playback for one sound-engine slot after higher-level guards pass.
 * Upstream: zsound_engine.cpp:292
 */
export type WavPlayer = (sound: SoundEngineSound | number) => void;

/**
 * Port of upstream `ZSound::StopRepeatSound` mutable field.
 * Role: Tracks the repeating sound channel or `-1` when no repeat is active.
 * Upstream: zsound_engine.cpp:101-109
 */
export type RepeatSoundState = {
  repeatChannel: number;
};

/**
 * Port of upstream `ZSound::RepeatSound` mutable fields.
 * Role: Holds the loaded sound chunk and repeat channel marker.
 * Upstream: zsound_engine.cpp:81-97
 */
export type RepeatLoadedSoundState<TChunk extends SoundChunkWithVolume> =
  RepeatSoundState & {
    soundChunk: TChunk | null;
  };

/**
 * Port of upstream `ZSound::RepeatSound` call target.
 * Role: Starts or maintains repeat playback for one sound slot.
 * Upstream: zsound_engine.cpp:261, zsound_engine.cpp:264
 */
export type RepeatSoundStarter = {
  repeatSound(): void;
};

/**
 * Port of upstream `ZMusicEngine::PlaySplashMusic` mutable fields.
 * Role: Holds the splash music handle and whether planet music is currently active.
 * Upstream: zmusic_engine.cpp:184-192
 */
export type SplashMusicState = {
  soundSystemOn: boolean;
  splashMusic: MusicHandle | null;
  playingPlanetMusic: boolean;
};

/**
 * Port of upstream `ZMusicEngine::PlayPlanetMusic` mutable fields.
 * Role: Holds planet music handles and current music playback state.
 * Upstream: zmusic_engine.cpp:196-210
 */
export type PlanetMusicState = {
  soundSystemOn: boolean;
  planetMusic: Array<MusicHandle | null>;
  planetType: PlanetType;
  playingPlanetMusic: boolean;
  doNextReset: boolean;
  dangerLevel: MusicDangerLevel;
};

/**
 * Port of upstream `ZMusicEngine::ResetMusic` mutable fields.
 * Role: Stores planet playback state, danger-level starts, and scheduled reset times.
 * Upstream: zmusic_engine.cpp:334-370
 */
export type MusicResetState = {
  playingPlanetMusic: boolean;
  planetType: PlanetType | number;
  dangerLevel: MusicDangerLevel | number;
  dangerLevelStarts: readonly (
    | readonly (readonly DangerLevelStartInfo[] | undefined)[]
    | undefined
  )[];
  doNextReset: boolean;
  nextResetTime: number;
  nextChangeDangerLevelTime: number;
};

/**
 * Port of upstream `ZSoundEngine::StopRepeatWav` mutable fields.
 * Role: Holds repeat-capable sound channels managed by the sound engine.
 * Upstream: zsound_engine.cpp:269-282
 */
export type StopRepeatWavState = {
  finishedInit: boolean;
  radar: RepeatSoundState;
  robotFactory: RepeatSoundState;
};

/**
 * Port of upstream `ZSoundEngine::RepeatWav` mutable fields.
 * Role: Holds repeat-capable sound slots managed by the sound engine.
 * Upstream: zsound_engine.cpp:256-264
 */
export type RepeatWavState = {
  finishedInit: boolean;
  radar: RepeatSoundStarter;
  robotFactory: RepeatSoundStarter;
};

/**
 * Port of upstream `ZSoundEngine::PlayWavRestricted` mutable fields.
 * Role: Holds initialization and map visibility dependencies for restricted sound playback.
 * Upstream: zsound_engine.cpp:286-290
 */
export type PlayWavRestrictedState = {
  finishedInit: boolean;
  zmap: SoundViewMap | null;
};

/**
 * Port of upstream `ZSound::LoadSound` mutable fields.
 * Role: Stores loaded sound playback parameters and the loaded chunk handle.
 * Upstream: zsound_engine.cpp:48-57
 */
export type LoadSoundState<TChunk extends SoundChunkWithVolume> = {
  baseVolume: number;
  volumeShift: number;
  playTimeShift: number;
  soundChunk: TChunk | null;
};

/**
 * Port of upstream `ZSound::PlaySound` mutable fields.
 * Role: Stores loaded sound playback timing and randomized volume parameters.
 * Upstream: zsound_engine.cpp:63-72
 */
export type PlaySoundState<TChunk extends SoundChunkWithVolume> =
  LoadSoundState<TChunk> & {
    nextPlayTime: number;
  };

/**
 * Port of upstream `ZSound`.
 * Role: Holds one loaded sound slot, playback timing, volume jitter, and repeat channel.
 * Upstream: zsound_engine.h:43-59
 */
export type SoundState<TChunk extends SoundChunkWithVolume = SoundChunkWithVolume> =
  PlaySoundState<TChunk> &
    RepeatLoadedSoundState<TChunk>;

/**
 * Browser-side replacement for upstream `current_time`.
 * Role: Supplies the current audio clock time for sound playback throttling.
 * Upstream: zsound_engine.cpp:65
 */
export type AudioClock = () => number;

/**
 * Browser-side replacement for upstream `rand() % max`.
 * Role: Supplies bounded random jitter for sound timing and volume.
 * Upstream: zsound_engine.cpp:69, zsound_engine.cpp:72
 */
export type BoundedRandomInt = (maxExclusive: number) => number;

const PLAYER_SOUND_SETTING_VOLUME: Readonly<
  Record<number, { channelVolume: number; musicVolume: number; news: string }>
> = {
  [SoundSetting.Sound0]: {
    channelVolume: 0,
    musicVolume: 0,
    news: "volume off",
  },
  [SoundSetting.Sound25]: {
    channelVolume: 128 / 4,
    musicVolume: 80 / 4,
    news: "volume 25%",
  },
  [SoundSetting.Sound50]: {
    channelVolume: 128 / 2,
    musicVolume: 80 / 2,
    news: "volume 50%",
  },
  [SoundSetting.Sound75]: {
    channelVolume: (128 * 3) / 4,
    musicVolume: (80 * 3) / 4,
    news: "volume 75%",
  },
  [SoundSetting.Sound100]: {
    channelVolume: 128,
    musicVolume: 80,
    news: "volume full",
  },
};

const MUSIC_ENGINE_PLANET_TYPE_NAMES = [
  "desert",
  "volcanic",
  "arctic",
  "jungle",
  "city",
] as const;

/**
 * Port of upstream `ZSound::StopRepeatSound`.
 * Role: Stops the repeating channel once and clears the repeat marker.
 * Upstream: zsound_engine.cpp:101-109
 */
export function stopRepeatSound(
  state: RepeatSoundState,
  haltChannel: ChannelHalter,
): void {
  if (state.repeatChannel === -1) return;

  haltChannel(state.repeatChannel);
  state.repeatChannel = -1;
}

/**
 * Port of upstream `ZSound::RepeatSound`.
 * Role: Starts looped playback on the first available mixer channel.
 * Upstream: zsound_engine.cpp:77-99
 */
export function repeatSound<TChunk extends SoundChunkWithVolume>(
  state: RepeatLoadedSoundState<TChunk>,
  isChannelPlaying: ChannelPlayingChecker,
  playChannel: ChannelPlayer,
): void {
  if (!state.soundChunk) return;
  if (state.repeatChannel !== -1) return;

  let channel = 0;
  while (channel < SOUND_ENGINE_MIX_CHANNELS && isChannelPlaying(channel)) {
    channel += 1;
  }

  if (channel === SOUND_ENGINE_MIX_CHANNELS) return;

  state.repeatChannel = channel;
  playChannel(state.repeatChannel, state.soundChunk, -1);
}

/**
 * Port of upstream `ZSound` construction.
 * Role: Creates an unloaded sound slot with no repeat channel.
 * Upstream: zsound_engine.cpp:42-46
 */
export function createSoundState<
  TChunk extends SoundChunkWithVolume = SoundChunkWithVolume,
>(): SoundState<TChunk> {
  return {
    soundChunk: null,
    nextPlayTime: 0,
    playTimeShift: 0,
    baseVolume: 0,
    volumeShift: 0,
    repeatChannel: -1,
  };
}

/**
 * Port of upstream `ZMusicEngine::Init`.
 * Role: Loads splash and planet music, applies paired fallbacks, and initializes danger-level starts.
 * Upstream: zmusic_engine.cpp:20-40
 */
export function initMusicEngine<TMusic extends MusicHandle>(
  state: MusicEngineInitState<TMusic>,
  loadMusic: MusicLoader<TMusic>,
  initDangerLevelStarts: () => void,
): void {
  state.splashMusic = loadMusic("assets/sounds/ABATTLE.mp3");

  for (let planet = 0; planet < PlanetType.Max; planet += 1) {
    state.planetMusic[planet] = loadMusic(
      `assets/sounds/music_${MUSIC_ENGINE_PLANET_TYPE_NAMES[planet]}.ogg`,
    );
  }

  if (!state.planetMusic[PlanetType.Desert]) {
    state.planetMusic[PlanetType.Desert] =
      state.planetMusic[PlanetType.Arctic] ?? null;
  }
  if (!state.planetMusic[PlanetType.Arctic]) {
    state.planetMusic[PlanetType.Arctic] =
      state.planetMusic[PlanetType.Desert] ?? null;
  }

  if (!state.planetMusic[PlanetType.Volcanic]) {
    state.planetMusic[PlanetType.Volcanic] =
      state.planetMusic[PlanetType.City] ?? null;
  }
  if (!state.planetMusic[PlanetType.City]) {
    state.planetMusic[PlanetType.City] =
      state.planetMusic[PlanetType.Volcanic] ?? null;
  }

  initDangerLevelStarts();
}

/**
 * Port of upstream `ZMusicEngine::PlaySplashMusic`.
 * Role: Plays splash music in a loop and leaves planet music mode.
 * Upstream: zmusic_engine.cpp:184-192
 */
export function playSplashMusic(
  state: SplashMusicState,
  playMusic: MusicPlayer,
): number {
  if (!state.soundSystemOn) return 0;

  const result = new AudioService().playMusic(state.splashMusic, -1, playMusic);
  state.playingPlanetMusic = false;
  return result;
}

/**
 * Port of upstream `ZMusicEngine::PlayPlanetMusic`.
 * Role: Plays the selected planet music in a loop and resets planet music state.
 * Upstream: zmusic_engine.cpp:194-211
 */
export function playPlanetMusic(
  state: PlanetMusicState,
  planetType: number,
  playMusic: MusicPlayer,
): number {
  if (!state.soundSystemOn) return 0;
  if (planetType < 0) return 0;
  if (planetType >= PlanetType.Max) return 0;

  state.planetType = planetType;
  const result = new AudioService().playMusic(state.planetMusic[planetType] ?? null, -1, playMusic);
  state.playingPlanetMusic = true;
  state.doNextReset = false;
  state.dangerLevel = MusicDangerLevel.Calm;
  return result;
}

/**
 * Port of upstream `ZMusicEngine::ResetMusic`.
 * Role: Seeks planet music to a random segment for the current danger level and schedules the next reset/change times.
 * Upstream: zmusic_engine.cpp:334-370
 */
export function resetMusicEngine(
  state: MusicResetState,
  setMusicPosition: MusicPositionSetter,
  currentTime: AudioClock,
  randomInt: BoundedRandomInt,
  getMusicError: MusicErrorReader = () => "",
  onMusicPositionError: (message: string) => void = (): void => undefined,
): void {
  if (!state.playingPlanetMusic) return;
  if (state.dangerLevel < 0) return;
  if (state.dangerLevel >= MusicDangerLevel.MaxDangerLevels) return;

  const starts = state.dangerLevelStarts[state.planetType]?.[state.dangerLevel];

  if (!starts?.length) {
    return;
  }

  const randomStartIndex = randomInt(starts.length) % starts.length;
  const start = starts[randomStartIndex];

  if (!start) return;

  if (setMusicPosition(start.position) === -1) {
    onMusicPositionError(getMusicError());
  }

  const theTime = currentTime();
  state.doNextReset = true;
  state.nextResetTime = theTime + start.length;

  switch (state.dangerLevel) {
    case MusicDangerLevel.Calm:
      state.nextChangeDangerLevelTime = theTime + 5;
      break;
    case MusicDangerLevel.Attacking:
      state.nextChangeDangerLevelTime = theTime + 7;
      break;
    case MusicDangerLevel.Fort:
      state.nextChangeDangerLevelTime = theTime + 3;
      break;
    default:
      state.nextChangeDangerLevelTime = theTime + 7;
      break;
  }
}

/**
 * Port of upstream `ZSoundEngine::StopRepeatWav`.
 * Role: Stops repeat playback for repeat-capable sound engine slots.
 * Upstream: zsound_engine.cpp:269-282
 */
export function stopRepeatWav(
  state: StopRepeatWavState,
  sound: SoundEngineSound,
  haltChannel: ChannelHalter,
): void {
  if (!state.finishedInit) return;

  switch (sound) {
    case SoundEngineSound.RadarSnd:
      stopRepeatSound(state.radar, haltChannel);
      break;
    case SoundEngineSound.RobotFactorySnd:
      stopRepeatSound(state.robotFactory, haltChannel);
      break;
  }
}

/**
 * Port of upstream `ZSoundEngine::RepeatWav`.
 * Role: Starts repeat playback for repeat-capable sound engine slots.
 * Upstream: zsound_engine.cpp:254-267
 */
export function repeatWav(
  state: RepeatWavState,
  sound: SoundEngineSound,
): void {
  if (!state.finishedInit) return;

  switch (sound) {
    case SoundEngineSound.RadarSnd:
      state.radar.repeatSound();
      break;
    case SoundEngineSound.RobotFactorySnd:
      state.robotFactory.repeatSound();
      break;
  }
}

/**
 * Port of upstream `ZSoundEngine::PlayWavRestricted`.
 * Role: Plays a sound only after initialization and only when its world rectangle is visible.
 * Upstream: zsound_engine.cpp:284-293
 */
export function playWavRestricted(
  state: PlayWavRestrictedState,
  sound: SoundEngineSound | number,
  x: number,
  y: number,
  width: number,
  height: number,
  playWav: WavPlayer,
): void {
  if (!state.finishedInit) return;
  if (!state.zmap) return;
  if (!state.zmap.withinView(x, y, width, height)) return;

  playWav(sound);
}

/**
 * Port of upstream `ZSound::PlaySound`.
 * Role: Plays a loaded sound after its cooldown, then jitters the next play time and volume.
 * Upstream: zsound_engine.cpp:59-75
 */
export function playSound<TChunk extends SoundChunkWithVolume>(
  state: PlaySoundState<TChunk>,
  currentTime: AudioClock,
  randomInt: BoundedRandomInt,
  playChannel: ChannelPlayer,
): void {
  if (!state.soundChunk) return;

  const theTime = currentTime();
  if (theTime < state.nextPlayTime) return;

  state.nextPlayTime = theTime + state.playTimeShift + 0.01 * randomInt(31);
  state.soundChunk.volume = state.baseVolume + randomInt(state.volumeShift);
  playChannel(-1, state.soundChunk, 0);
}

/**
 * Port of upstream `ZPlayer::SetSoundSetting`.
 * Role: Normalizes the player sound preset, applies mixer volumes, and emits the volume news line.
 * Upstream: zplayer.cpp:3904-3939
 */
export function setPlayerSoundSetting(
  state: PlayerAudioSettingState,
  soundSetting: number,
  setChannelVolume: ChannelVolumeSetter,
  setMusicVolume: MusicVolumeSetter,
  addNewsEntry: (message: string) => void,
): void {
  state.soundSetting = soundSetting;

  if (state.soundSetting < 0) state.soundSetting = SoundSetting.Sound0;
  if (state.soundSetting >= SoundSetting.MaxSoundSettings) {
    state.soundSetting = SoundSetting.Sound0;
  }

  const volume = PLAYER_SOUND_SETTING_VOLUME[state.soundSetting];
  if (!volume) return;

  setChannelVolume(-1, volume.channelVolume);
  setMusicVolume(volume.musicVolume);
  addNewsEntry(volume.news);
}

/**
 * Port of upstream `ZSound::LoadSound`.
 * Role: Loads a sound chunk, stores playback parameters, and applies the base volume.
 * Upstream: zsound_engine.cpp:48-57
 */
export function loadSound<TChunk extends SoundChunkWithVolume>(
  state: LoadSoundState<TChunk>,
  filename: string,
  baseVolume: number,
  volumeShift: number,
  playTimeShift: number,
  loadChunk: SoundChunkLoader<TChunk>,
): void {
  state.baseVolume = baseVolume;
  state.volumeShift = volumeShift;
  state.playTimeShift = playTimeShift;
  state.soundChunk = loadChunk(filename);

  if (state.soundChunk) {
    state.soundChunk.volume = baseVolume;
  }
}

export class AudioService {
  /**
   * Browser-side audio enablement state.
   * Role: Tracks whether music playback is currently allowed.
   * Upstream: zsdl.cpp:406-409
   */
  enabled = true;

  /**
   * Replacement for upstream `ZSDL_SetMusicOn`.
   * Role: Enables or disables music playback.
   * Upstream: zsdl.cpp:406-409
   */
  setMusicOn(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Replacement for upstream `ZSDL_PlayMusic`.
   * Role: Plays a music asset only when music playback is enabled and a handle is available.
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
