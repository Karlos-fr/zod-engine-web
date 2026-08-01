import { describe, expect, it } from "vitest";
import { PlanetType } from "../src/simulation/SimulationConstants";
import {
  AudioService,
  createSoundState,
  DangerLevelStartInfo,
  MusicDangerLevel,
  SoundSetting,
  SoundEngineSound,
  SOUND_ENGINE_MAX_COMP_LOSING_MESSAGES,
  SOUND_ENGINE_MIX_CHANNELS,
  type MusicResetState,
  type PlayerAudioSettingState,
  ZMUSIC_ENGINE_HEADER_GUARD_PORTED,
  ZSOUND_ENGINE_HEADER_GUARD_PORTED,
  getMusicEngineDangerLevel,
  initMusicEngine,
  loadSound,
  playPlanetMusic,
  playSound,
  playSplashMusic,
  playWavRestricted,
  repeatSound,
  repeatWav,
  resetMusicEngine,
  setPlayerSoundSetting,
  setMusicEngineDangerLevel,
  setMusicEngineMusicOn,
  stopRepeatSound,
  stopRepeatWav,
} from "../src/audio/AudioService";

describe("audio service", () => {
  it("adapts the zmusic_engine.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/audio/AudioService");
    const secondImport = await import("../src/audio/AudioService");

    expect(ZMUSIC_ENGINE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZMUSIC_ENGINE_HEADER_GUARD_PORTED).toBe(
      firstImport.ZMUSIC_ENGINE_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the zsound_engine.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/audio/AudioService");
    const secondImport = await import("../src/audio/AudioService");

    expect(ZSOUND_ENGINE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZSOUND_ENGINE_HEADER_GUARD_PORTED).toBe(
      firstImport.ZSOUND_ENGINE_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the sound engine channel and voice-line limits", () => {
    expect(SOUND_ENGINE_MIX_CHANNELS).toBe(32);
    expect(SOUND_ENGINE_MAX_COMP_LOSING_MESSAGES).toBe(10);
  });

  it("replaces sound_setting volume preset identifiers", () => {
    expect(SoundSetting.Sound0).toBe(0);
    expect(SoundSetting.Sound25).toBe(1);
    expect(SoundSetting.Sound50).toBe(2);
    expect(SoundSetting.Sound75).toBe(3);
    expect(SoundSetting.Sound100).toBe(4);
    expect(SoundSetting.MaxSoundSettings).toBe(5);
  });

  it("ports ZPlayer SetSoundSetting as mixer volume and news updates", () => {
    const cases = [
      [SoundSetting.Sound0, 0, 0, "volume off"],
      [SoundSetting.Sound25, 32, 20, "volume 25%"],
      [SoundSetting.Sound50, 64, 40, "volume 50%"],
      [SoundSetting.Sound75, 96, 60, "volume 75%"],
      [SoundSetting.Sound100, 128, 80, "volume full"],
    ] as const;

    for (const [setting, channelVolume, musicVolume, news] of cases) {
      const state: PlayerAudioSettingState = { soundSetting: SoundSetting.Sound0 };
      const calls: unknown[][] = [];

      setPlayerSoundSetting(
        state,
        setting,
        (channel, volume) => calls.push(["channel", channel, volume]),
        (volume) => calls.push(["music", volume]),
        (message) => calls.push(["news", message]),
      );

      expect(state.soundSetting).toBe(setting);
      expect(calls).toEqual([
        ["channel", -1, channelVolume],
        ["music", musicVolume],
        ["news", news],
      ]);
    }
  });

  it("ports ZPlayer SetSoundSetting as clamping invalid settings to sound off", () => {
    const state: PlayerAudioSettingState = { soundSetting: SoundSetting.Sound100 };
    const calls: unknown[][] = [];

    setPlayerSoundSetting(
      state,
      SoundSetting.MaxSoundSettings,
      (channel, volume) => calls.push(["channel", channel, volume]),
      (volume) => calls.push(["music", volume]),
      (message) => calls.push(["news", message]),
    );
    setPlayerSoundSetting(
      state,
      -1,
      (channel, volume) => calls.push(["channel", channel, volume]),
      (volume) => calls.push(["music", volume]),
      (message) => calls.push(["news", message]),
    );

    expect(state.soundSetting).toBe(SoundSetting.Sound0);
    expect(calls).toEqual([
      ["channel", -1, 0],
      ["music", 0],
      ["news", "volume off"],
      ["channel", -1, 0],
      ["music", 0],
      ["news", "volume off"],
    ]);
  });

  it("ports sound_engine_sound identifiers in upstream order", () => {
    const expectedNames = [
      "PsychoFireSnd",
      "RiochetSnd",
      "RandomExplosionSnd",
      "LightRandomExplosionSnd",
      "LightFireSnd",
      "MediumFireSnd",
      "HeavyFireSnd",
      "PyroFireSnd",
      "LaserFireSnd",
      "RifleFireSnd",
      "GunFireSnd",
      "GatlingFireSnd",
      "TurrentExplosionSnd",
      "JeepFireSnd",
      "ToughFireSnd",
      "MomissileFireSnd",
      "RadarSnd",
      "RobotFactorySnd",
      "VehicleFactorySnd",
      "CompVehicleSnd",
      "CompRobotSnd",
      "CompGunSnd",
      "CompStartingManufactureSnd",
      "CompManufacturingCanceledSnd",
      "CompStartingRepairSnd",
      "CompVehicleRepairedSnd",
      "CompTerritoryLostSnd",
      "CompRadarActivatedSnd",
      "CompFortUnderAttack",
      "CompYourLosing0",
      "CompYourLosing1",
      "CompYourLosing2",
      "CompYourLosing3",
      "CompYourLosing4",
      "CompYourLosing5",
      "CompYourLosing6",
      "CompYourLosing7",
      "CompYourLosing8",
      "CompYourLosing9",
      "BatChirpSnd",
      "CrowSnd",
      "ThrowGrenadeSnd",
      "YesSir1Snd",
      "YesSir2Snd",
      "YesSir3Snd",
      "UnitReporting1Snd",
      "UnitReporting2Snd",
      "UnitReporting3Snd",
      "GruntsReportingSnd",
      "PsychosReportingSnd",
      "SnipersReportingSnd",
      "ToughsReportingSnd",
      "LasersReportingSnd",
      "PyrosReportingSnd",
      "WereOnOurWaySnd",
      "HereWeGoSnd",
      "YouGotItSnd",
      "MovingInSnd",
      "OkaySnd",
      "AlrightSnd",
      "NoProblemSnd",
      "OverAndOutSnd",
      "AffirmativeSnd",
      "GoingInSnd",
      "LetsDoItSnd",
      "LetsGetThemSnd",
      "WereUnderAttackSnd",
      "ISaidWereUnderAttackSnd",
      "HelpHelpSnd",
      "TheyreAllOverUsSnd",
      "WereLosingItSnd",
      "AaahhhSnd",
      "OhMyGodSnd",
      "ForChristSakeSnd",
      "YourJokingSnd",
      "NoWaySnd",
      "ForgetItSnd",
      "GetOuttaHereSnd",
      "TargetDestroyedSnd",
      "BridgeDestroyedSnd",
      "BuildingDestroyedSnd",
      "GoodHitSnd",
      "NiceOneSnd",
      "OhYeahSnd",
      "GotchaSnd",
      "SmokinSnd",
      "CoolSnd",
      "WipeOutSnd",
      "BridgeRepairedSnd",
      "BuildingRepairedSnd",
      "TerritoryTakenSnd",
      "FireExtinguishedSnd",
      "GunCapturedSnd",
      "VehicleCapturedSnd",
      "GrenadesCollectedSnd",
      "LetsTakeTheFortSnd",
      "LetsDoThemSnd",
      "TheyreOnTheRunSnd",
      "LetsFinishThemOffSnd",
      "WhatAreYouWaitingForSnd",
      "LetsEndItNowSnd",
      "LetsGoForItSnd",
      "YeehaaEndSnd",
      "NiceOneEndSnd",
      "AlrightEndSnd",
      "ExcelentEndSnd",
      "WeveDoneItEndSnd",
      "YeahhhEndSnd",
      "YoureCrapLoseSnd",
      "WeveLostItLoseSnd",
      "YouveBlownItLoseSnd",
      "WeHateYouLoseSnd",
      "MoronLoseSnd",
      "AssholeLoseSnd",
      "ItsOverLoseSnd",
      "LetsDoIt1StartSnd",
      "LetsDoIt2StartSnd",
      "MaxEngineSounds",
    ] as const;

    expectedNames.forEach((name, index) => {
      expect(SoundEngineSound[name]).toBe(index);
    });
  });

  it("ports music danger level identifiers", () => {
    expect(MusicDangerLevel.Calm).toBe(0);
    expect(MusicDangerLevel.Attacking).toBe(1);
    expect(MusicDangerLevel.Fort).toBe(2);
    expect(MusicDangerLevel.MaxDangerLevels).toBe(3);
  });

  it("ports danger-level music segment metadata", () => {
    expect(new DangerLevelStartInfo()).toEqual({
      position: 0,
      length: 0,
    });
    expect(new DangerLevelStartInfo(12.5, 4.25)).toEqual({
      position: 12.5,
      length: 4.25,
    });
  });

  it("ports ZMusicEngine::SetMusicOn as music engine enablement state", () => {
    const state = { soundSystemOn: true };

    setMusicEngineMusicOn(state, false);
    expect(state.soundSystemOn).toBe(false);

    setMusicEngineMusicOn(state, true);
    expect(state.soundSystemOn).toBe(true);
  });

  it("ports ZMusicEngine::GetDangerLevel as a danger level accessor", () => {
    expect(
      getMusicEngineDangerLevel({
        dangerLevel: MusicDangerLevel.Attacking,
      }),
    ).toBe(MusicDangerLevel.Attacking);
  });

  it("keeps ZMusicEngine SetDangerLevel unchanged for invalid levels", () => {
    const state = { dangerLevel: MusicDangerLevel.Calm };
    let resetCount = 0;

    setMusicEngineDangerLevel(state, -1, () => {
      resetCount++;
    });
    setMusicEngineDangerLevel(state, MusicDangerLevel.MaxDangerLevels, () => {
      resetCount++;
    });

    expect(state.dangerLevel).toBe(MusicDangerLevel.Calm);
    expect(resetCount).toBe(0);
  });

  it("keeps ZMusicEngine SetDangerLevel unchanged for the current level", () => {
    const state = { dangerLevel: MusicDangerLevel.Attacking };
    let resetCount = 0;

    setMusicEngineDangerLevel(state, MusicDangerLevel.Attacking, () => {
      resetCount++;
    });

    expect(state.dangerLevel).toBe(MusicDangerLevel.Attacking);
    expect(resetCount).toBe(0);
  });

  it("ports ZMusicEngine SetDangerLevel as a level update and music reset", () => {
    const state = { dangerLevel: MusicDangerLevel.Calm };
    let resetCount = 0;

    setMusicEngineDangerLevel(state, MusicDangerLevel.Fort, () => {
      resetCount++;
    });

    expect(state.dangerLevel).toBe(MusicDangerLevel.Fort);
    expect(resetCount).toBe(1);
  });

  it("ports ZMusicEngine Init as splash and planet music loading", () => {
    const loadedPaths: string[] = [];
    const state = {
      splashMusic: null as { path: string } | null,
      planetMusic: [] as Array<{ path: string } | null>,
    };
    let initDangerLevelStartsCount = 0;

    initMusicEngine(
      state,
      (filename) => {
        loadedPaths.push(filename);
        return { path: filename };
      },
      () => {
        initDangerLevelStartsCount += 1;
      },
    );

    expect(state.splashMusic).toEqual({ path: "assets/sounds/ABATTLE.mp3" });
    expect(state.planetMusic).toEqual([
      { path: "assets/sounds/music_desert.ogg" },
      { path: "assets/sounds/music_volcanic.ogg" },
      { path: "assets/sounds/music_arctic.ogg" },
      { path: "assets/sounds/music_jungle.ogg" },
      { path: "assets/sounds/music_city.ogg" },
    ]);
    expect(loadedPaths).toEqual([
      "assets/sounds/ABATTLE.mp3",
      "assets/sounds/music_desert.ogg",
      "assets/sounds/music_volcanic.ogg",
      "assets/sounds/music_arctic.ogg",
      "assets/sounds/music_jungle.ogg",
      "assets/sounds/music_city.ogg",
    ]);
    expect(initDangerLevelStartsCount).toBe(1);
  });

  it("ports ZMusicEngine Init paired fallback fixes for missing planet music", () => {
    const arctic = { id: "arctic" };
    const city = { id: "city" };
    const state = {
      splashMusic: null as { id: string } | null,
      planetMusic: [] as Array<{ id: string } | null>,
    };

    initMusicEngine(
      state,
      (filename) => {
        if (filename.endsWith("music_arctic.ogg")) return arctic;
        if (filename.endsWith("music_city.ogg")) return city;
        return null;
      },
      () => undefined,
    );

    expect(state.planetMusic[PlanetType.Desert]).toBe(arctic);
    expect(state.planetMusic[PlanetType.Arctic]).toBe(arctic);
    expect(state.planetMusic[PlanetType.Volcanic]).toBe(city);
    expect(state.planetMusic[PlanetType.City]).toBe(city);
    expect(state.planetMusic[PlanetType.Jungle]).toBeNull();
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

  it("ports ZMusicEngine PlaySplashMusic as looped splash playback", () => {
    const music = { id: "splash" };
    const state = {
      soundSystemOn: true,
      splashMusic: music,
      playingPlanetMusic: true,
    };
    const calls: unknown[][] = [];

    const result = playSplashMusic(state, (handle, loops) => {
      calls.push([handle, loops]);
      return 1;
    });

    expect(result).toBe(1);
    expect(calls).toEqual([[music, -1]]);
    expect(state.playingPlanetMusic).toBe(false);
  });

  it("keeps ZMusicEngine PlaySplashMusic unchanged when the sound system is off", () => {
    const state = {
      soundSystemOn: false,
      splashMusic: { id: "splash" },
      playingPlanetMusic: true,
    };

    const result = playSplashMusic(state, () => {
      throw new Error("playMusic should not be called");
    });

    expect(result).toBe(0);
    expect(state.playingPlanetMusic).toBe(true);
  });

  it("keeps ZMusicEngine PlayPlanetMusic unchanged when disabled or out of range", () => {
    const state = {
      soundSystemOn: false,
      planetMusic: [{ id: "desert" }],
      planetType: PlanetType.Desert,
      playingPlanetMusic: false,
      doNextReset: true,
      dangerLevel: MusicDangerLevel.Attacking,
    };
    const player = (): number => {
      throw new Error("playMusic should not be called");
    };

    expect(playPlanetMusic(state, PlanetType.Desert, player)).toBe(0);
    state.soundSystemOn = true;
    expect(playPlanetMusic(state, -1, player)).toBe(0);
    expect(playPlanetMusic(state, PlanetType.Max, player)).toBe(0);

    expect(state).toEqual({
      soundSystemOn: true,
      planetMusic: [{ id: "desert" }],
      planetType: PlanetType.Desert,
      playingPlanetMusic: false,
      doNextReset: true,
      dangerLevel: MusicDangerLevel.Attacking,
    });
  });

  it("ports ZMusicEngine PlayPlanetMusic as looped planet playback and state reset", () => {
    const desertMusic = { id: "desert" };
    const arcticMusic = { id: "arctic" };
    const state = {
      soundSystemOn: true,
      planetMusic: [desertMusic, null, arcticMusic],
      planetType: PlanetType.Desert,
      playingPlanetMusic: false,
      doNextReset: true,
      dangerLevel: MusicDangerLevel.Fort,
    };
    const calls: unknown[][] = [];

    const result = playPlanetMusic(state, PlanetType.Arctic, (music, loops) => {
      calls.push([music, loops]);
      return 1;
    });

    expect(result).toBe(1);
    expect(calls).toEqual([[arcticMusic, -1]]);
    expect(state.planetType).toBe(PlanetType.Arctic);
    expect(state.playingPlanetMusic).toBe(true);
    expect(state.doNextReset).toBe(false);
    expect(state.dangerLevel).toBe(MusicDangerLevel.Calm);
  });

  it("keeps ZMusicEngine ResetMusic unchanged when planet music is not active or danger level is invalid", () => {
    const state: MusicResetState = {
      playingPlanetMusic: false,
      planetType: PlanetType.Desert,
      dangerLevel: MusicDangerLevel.Calm,
      dangerLevelStarts: [[[new DangerLevelStartInfo(10, 4)]]],
      doNextReset: false,
      nextResetTime: 1,
      nextChangeDangerLevelTime: 2,
    };

    resetMusicEngine(
      state,
      () => {
        throw new Error("setMusicPosition should not be called");
      },
      () => 20,
      () => 0,
    );
    state.playingPlanetMusic = true;
    state.dangerLevel = -1;
    resetMusicEngine(
      state,
      () => {
        throw new Error("setMusicPosition should not be called");
      },
      () => 20,
      () => 0,
    );
    state.dangerLevel = MusicDangerLevel.MaxDangerLevels;
    resetMusicEngine(
      state,
      () => {
        throw new Error("setMusicPosition should not be called");
      },
      () => 20,
      () => 0,
    );

    expect(state.doNextReset).toBe(false);
    expect(state.nextResetTime).toBe(1);
    expect(state.nextChangeDangerLevelTime).toBe(2);
  });

  it("keeps ZMusicEngine ResetMusic unchanged without start information", () => {
    const state: MusicResetState = {
      playingPlanetMusic: true,
      planetType: PlanetType.Jungle,
      dangerLevel: MusicDangerLevel.Attacking,
      dangerLevelStarts: [],
      doNextReset: false,
      nextResetTime: 1,
      nextChangeDangerLevelTime: 2,
    };

    resetMusicEngine(
      state,
      () => {
        throw new Error("setMusicPosition should not be called");
      },
      () => 20,
      () => 0,
    );

    expect(state.doNextReset).toBe(false);
    expect(state.nextResetTime).toBe(1);
    expect(state.nextChangeDangerLevelTime).toBe(2);
  });

  it("ports ZMusicEngine ResetMusic as random segment seek and reset scheduling", () => {
    const starts = [
      new DangerLevelStartInfo(12.5, 4),
      new DangerLevelStartInfo(30, 8.5),
    ];
    const state: MusicResetState = {
      playingPlanetMusic: true,
      planetType: PlanetType.Desert,
      dangerLevel: MusicDangerLevel.Fort,
      dangerLevelStarts: [
        [
          [],
          [],
          starts,
        ],
      ],
      doNextReset: false,
      nextResetTime: 0,
      nextChangeDangerLevelTime: 0,
    };
    const calls: unknown[][] = [];

    resetMusicEngine(
      state,
      (position) => {
        calls.push(["seek", position]);
        return 0;
      },
      () => 100,
      (maxExclusive) => {
        calls.push(["random", maxExclusive]);
        return 1;
      },
    );

    expect(calls).toEqual([
      ["random", 2],
      ["seek", 30],
    ]);
    expect(state.doNextReset).toBe(true);
    expect(state.nextResetTime).toBe(108.5);
    expect(state.nextChangeDangerLevelTime).toBe(103);
  });

  it("ports ZMusicEngine ResetMusic danger-level change delays", () => {
    const start = new DangerLevelStartInfo(0, 2);
    const state: MusicResetState = {
      playingPlanetMusic: true,
      planetType: PlanetType.Desert,
      dangerLevel: MusicDangerLevel.Calm,
      dangerLevelStarts: [[[start], [start], [start]]],
      doNextReset: false,
      nextResetTime: 0,
      nextChangeDangerLevelTime: 0,
    };

    resetMusicEngine(state, () => 0, () => 10, () => 0);
    expect(state.nextChangeDangerLevelTime).toBe(15);

    state.dangerLevel = MusicDangerLevel.Attacking;
    resetMusicEngine(state, () => 0, () => 10, () => 0);
    expect(state.nextChangeDangerLevelTime).toBe(17);
  });

  it("ports ZMusicEngine ResetMusic as reporting music seek backend errors", () => {
    const state: MusicResetState = {
      playingPlanetMusic: true,
      planetType: PlanetType.Desert,
      dangerLevel: MusicDangerLevel.Calm,
      dangerLevelStarts: [[[new DangerLevelStartInfo(45, 6)]]],
      doNextReset: false,
      nextResetTime: 0,
      nextChangeDangerLevelTime: 0,
    };
    const errors: string[] = [];

    resetMusicEngine(
      state,
      () => -1,
      () => 20,
      () => 0,
      () => "seek failed",
      (message) => {
        errors.push(message);
      },
    );

    expect(errors).toEqual(["seek failed"]);
    expect(state.doNextReset).toBe(true);
    expect(state.nextResetTime).toBe(26);
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

  it("ports ZSound LoadSound by loading a chunk and applying base volume", () => {
    const state = {
      baseVolume: 0,
      volumeShift: 0,
      playTimeShift: 0,
      soundChunk: null as { volume: number; id: string } | null,
    };
    const loadedFilenames: string[] = [];
    const chunk = { volume: 0, id: "laser" };

    loadSound(state, "assets/sounds/laser.wav", 64, 5, 0.25, (filename) => {
      loadedFilenames.push(filename);
      return chunk;
    });

    expect(loadedFilenames).toEqual(["assets/sounds/laser.wav"]);
    expect(state).toEqual({
      baseVolume: 64,
      volumeShift: 5,
      playTimeShift: 0.25,
      soundChunk: chunk,
    });
    expect(chunk.volume).toBe(64);
  });

  it("ports ZSound construction as an unloaded sound slot", () => {
    expect(createSoundState()).toEqual({
      soundChunk: null,
      nextPlayTime: 0,
      playTimeShift: 0,
      baseVolume: 0,
      volumeShift: 0,
      repeatChannel: -1,
    });
  });

  it("ports ZSound LoadSound null chunk handling", () => {
    const state = {
      baseVolume: 0,
      volumeShift: 0,
      playTimeShift: 0,
      soundChunk: { volume: 10, id: "old" } as {
        volume: number;
        id: string;
      } | null,
    };

    loadSound(state, "missing.wav", 32, -2, 1.5, () => null);

    expect(state).toEqual({
      baseVolume: 32,
      volumeShift: -2,
      playTimeShift: 1.5,
      soundChunk: null,
    });
  });

  it("keeps ZSound PlaySound silent without a loaded chunk", () => {
    const state = {
      baseVolume: 64,
      volumeShift: 5,
      playTimeShift: 0.25,
      nextPlayTime: 0,
      soundChunk: null as { volume: number } | null,
    };
    const calls: unknown[][] = [];

    playSound(
      state,
      () => 10,
      () => 0,
      (channel, chunk, repeat) => {
        calls.push([channel, chunk, repeat]);
        return 1;
      },
    );

    expect(calls).toEqual([]);
    expect(state.nextPlayTime).toBe(0);
  });

  it("keeps ZSound PlaySound silent before next play time", () => {
    const chunk = { volume: 10 };
    const state = {
      baseVolume: 64,
      volumeShift: 5,
      playTimeShift: 0.25,
      nextPlayTime: 12,
      soundChunk: chunk,
    };
    const calls: unknown[][] = [];

    playSound(
      state,
      () => 10,
      () => {
        throw new Error("randomInt should not be called");
      },
      (channel, wav, repeat) => {
        calls.push([channel, wav, repeat]);
        return 1;
      },
    );

    expect(calls).toEqual([]);
    expect(state.nextPlayTime).toBe(12);
    expect(chunk.volume).toBe(10);
  });

  it("ports ZSound PlaySound as cooldown update, volume jitter, and channel playback", () => {
    const chunk = { volume: 10 };
    const state = {
      baseVolume: 64,
      volumeShift: 5,
      playTimeShift: 0.25,
      nextPlayTime: 9,
      soundChunk: chunk,
    };
    const calls: unknown[][] = [];
    const randomValues = [7, 3];

    playSound(
      state,
      () => 10,
      (maxExclusive) => {
        calls.push(["random", maxExclusive]);
        return randomValues.shift() ?? 0;
      },
      (channel, wav, repeat) => {
        calls.push(["play", channel, wav, repeat]);
        return 1;
      },
    );

    expect(state.nextPlayTime).toBeCloseTo(10.32);
    expect(chunk.volume).toBe(67);
    expect(calls).toEqual([
      ["random", 31],
      ["random", 5],
      ["play", -1, chunk, 0],
    ]);
  });

  it("keeps repeat sound state unchanged when no repeat channel is active", () => {
    const state = { repeatChannel: -1 };
    const haltedChannels: number[] = [];

    stopRepeatSound(state, (channel) => {
      haltedChannels.push(channel);
    });

    expect(haltedChannels).toEqual([]);
    expect(state.repeatChannel).toBe(-1);
  });

  it("ports ZSound::StopRepeatSound by halting and clearing the repeat channel", () => {
    const state = { repeatChannel: 7 };
    const haltedChannels: number[] = [];

    stopRepeatSound(state, (channel) => {
      haltedChannels.push(channel);
    });

    expect(haltedChannels).toEqual([7]);
    expect(state.repeatChannel).toBe(-1);
  });

  it("keeps ZSound RepeatSound silent without a loaded chunk", () => {
    const state = { soundChunk: null as { volume: number } | null, repeatChannel: -1 };
    const calls: unknown[][] = [];

    repeatSound(
      state,
      () => {
        throw new Error("channel scan should not run");
      },
      (channel, chunk, repeat) => {
        calls.push([channel, chunk, repeat]);
        return channel;
      },
    );

    expect(state.repeatChannel).toBe(-1);
    expect(calls).toEqual([]);
  });

  it("keeps ZSound RepeatSound unchanged when already repeating", () => {
    const chunk = { volume: 10 };
    const state = { soundChunk: chunk, repeatChannel: 4 };
    const calls: unknown[][] = [];

    repeatSound(
      state,
      () => {
        throw new Error("channel scan should not run");
      },
      (channel, wav, repeat) => {
        calls.push([channel, wav, repeat]);
        return channel;
      },
    );

    expect(state.repeatChannel).toBe(4);
    expect(calls).toEqual([]);
  });

  it("keeps ZSound RepeatSound unchanged when no mixer channel is free", () => {
    const chunk = { volume: 10 };
    const state = { soundChunk: chunk, repeatChannel: -1 };
    const calls: unknown[][] = [];

    repeatSound(
      state,
      () => true,
      (channel, wav, repeat) => {
        calls.push([channel, wav, repeat]);
        return channel;
      },
    );

    expect(state.repeatChannel).toBe(-1);
    expect(calls).toEqual([]);
  });

  it("ports ZSound RepeatSound as first-free-channel looped playback", () => {
    const chunk = { volume: 10 };
    const state = { soundChunk: chunk, repeatChannel: -1 };
    const checkedChannels: number[] = [];
    const calls: unknown[][] = [];

    repeatSound(
      state,
      (channel) => {
        checkedChannels.push(channel);
        return channel < 3;
      },
      (channel, wav, repeat) => {
        calls.push([channel, wav, repeat]);
        return channel;
      },
    );

    expect(checkedChannels).toEqual([0, 1, 2, 3]);
    expect(state.repeatChannel).toBe(3);
    expect(calls).toEqual([[3, chunk, -1]]);
  });

  it("keeps ZSoundEngine RepeatWav unchanged before initialization finishes", () => {
    const calls: string[] = [];
    const state = {
      finishedInit: false,
      radar: { repeatSound: () => calls.push("radar") },
      robotFactory: { repeatSound: () => calls.push("robot-factory") },
    };

    repeatWav(state, SoundEngineSound.RadarSnd);

    expect(calls).toEqual([]);
  });

  it("ports ZSoundEngine RepeatWav for repeat-capable sound slots", () => {
    const calls: string[] = [];
    const state = {
      finishedInit: true,
      radar: { repeatSound: () => calls.push("radar") },
      robotFactory: { repeatSound: () => calls.push("robot-factory") },
    };

    repeatWav(state, SoundEngineSound.RadarSnd);
    repeatWav(state, SoundEngineSound.RobotFactorySnd);
    repeatWav(state, SoundEngineSound.GunFireSnd);

    expect(calls).toEqual(["radar", "robot-factory"]);
  });

  it("keeps ZSoundEngine StopRepeatWav unchanged before initialization finishes", () => {
    const state = {
      finishedInit: false,
      radar: { repeatChannel: 3 },
      robotFactory: { repeatChannel: 4 },
    };

    stopRepeatWav(state, SoundEngineSound.RadarSnd, () => {
      throw new Error("haltChannel should not be called");
    });

    expect(state.radar.repeatChannel).toBe(3);
    expect(state.robotFactory.repeatChannel).toBe(4);
  });

  it("ports ZSoundEngine StopRepeatWav for radar repeat sounds", () => {
    const state = {
      finishedInit: true,
      radar: { repeatChannel: 3 },
      robotFactory: { repeatChannel: 4 },
    };
    const haltedChannels: number[] = [];

    stopRepeatWav(state, SoundEngineSound.RadarSnd, (channel) => {
      haltedChannels.push(channel);
    });

    expect(haltedChannels).toEqual([3]);
    expect(state.radar.repeatChannel).toBe(-1);
    expect(state.robotFactory.repeatChannel).toBe(4);
  });

  it("ports ZSoundEngine StopRepeatWav for robot-factory repeat sounds", () => {
    const state = {
      finishedInit: true,
      radar: { repeatChannel: 3 },
      robotFactory: { repeatChannel: 4 },
    };
    const haltedChannels: number[] = [];

    stopRepeatWav(state, SoundEngineSound.RobotFactorySnd, (channel) => {
      haltedChannels.push(channel);
    });

    expect(haltedChannels).toEqual([4]);
    expect(state.radar.repeatChannel).toBe(3);
    expect(state.robotFactory.repeatChannel).toBe(-1);
  });

  it("ignores ZSoundEngine StopRepeatWav for non-repeat sound slots", () => {
    const state = {
      finishedInit: true,
      radar: { repeatChannel: 3 },
      robotFactory: { repeatChannel: 4 },
    };
    const haltedChannels: number[] = [];

    stopRepeatWav(state, SoundEngineSound.GunFireSnd, (channel) => {
      haltedChannels.push(channel);
    });

    expect(haltedChannels).toEqual([]);
    expect(state.radar.repeatChannel).toBe(3);
    expect(state.robotFactory.repeatChannel).toBe(4);
  });

  it("keeps ZSoundEngine PlayWavRestricted silent before initialization finishes", () => {
    const playedSounds: number[] = [];

    playWavRestricted(
      {
        finishedInit: false,
        zmap: {
          withinView: () => true,
        },
      },
      SoundEngineSound.GunFireSnd,
      10,
      20,
      30,
      40,
      (sound) => playedSounds.push(sound),
    );

    expect(playedSounds).toEqual([]);
  });

  it("keeps ZSoundEngine PlayWavRestricted silent without a map", () => {
    const playedSounds: number[] = [];

    playWavRestricted(
      {
        finishedInit: true,
        zmap: null,
      },
      SoundEngineSound.GunFireSnd,
      10,
      20,
      30,
      40,
      (sound) => playedSounds.push(sound),
    );

    expect(playedSounds).toEqual([]);
  });

  it("keeps ZSoundEngine PlayWavRestricted silent outside the map view", () => {
    const playedSounds: number[] = [];
    const viewChecks: unknown[] = [];

    playWavRestricted(
      {
        finishedInit: true,
        zmap: {
          withinView: (x, y, width, height) => {
            viewChecks.push(x, y, width, height);
            return false;
          },
        },
      },
      SoundEngineSound.GunFireSnd,
      10,
      20,
      30,
      40,
      (sound) => playedSounds.push(sound),
    );

    expect(viewChecks).toEqual([10, 20, 30, 40]);
    expect(playedSounds).toEqual([]);
  });

  it("ports ZSoundEngine PlayWavRestricted as visible sound playback", () => {
    const playedSounds: number[] = [];
    const viewChecks: unknown[] = [];

    playWavRestricted(
      {
        finishedInit: true,
        zmap: {
          withinView: (x, y, width, height) => {
            viewChecks.push(x, y, width, height);
            return true;
          },
        },
      },
      SoundEngineSound.GunFireSnd,
      10,
      20,
      30,
      40,
      (sound) => playedSounds.push(sound),
    );

    expect(viewChecks).toEqual([10, 20, 30, 40]);
    expect(playedSounds).toEqual([SoundEngineSound.GunFireSnd]);
  });
});
