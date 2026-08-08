import { describe, expect, it } from "vitest";
import { ZSettings } from "../src/data/ZSettingsData";
import {
  type CannonDeathEffectSpawn,
  CannonDeathObject,
} from "../src/simulation/CannonDeathEffect";
import { GameEntity } from "../src/simulation/entities/GameEntity";
import {
  canCannonSetWaypoints,
  CannonEntity,
  CGATLING_HEADER_GUARD_PORTED,
  CGUN_HEADER_GUARD_PORTED,
  CHOWITZER_HEADER_GUARD_PORTED,
  CMISSILECANNON_HEADER_GUARD_PORTED,
  doGatlingCannonDeathEffect,
  doGunCannonDeathEffect,
  doHowitzerCannonDeathEffect,
  doMissileCannonDeathEffect,
  fireGatlingCannonTurrentMissile,
  fireGunCannonMissile,
  type GatlingCannonRenderMap,
  type GatlingCannonRenderState,
  GATLING_CANNON_UNIT_X_PIXELS,
  GATLING_CANNON_UNIT_Y_PIXELS,
  fireHowitzerCannonMissile,
  fireHowitzerCannonTurrentMissile,
  fireMissileCannonMissile,
  GatlingCannonEntity,
  fireGunCannonTurrentMissile,
  GUN_CANNON_UNIT_X_PIXELS,
  GUN_CANNON_UNIT_Y_PIXELS,
  initGatlingCannon,
  initGunCannon,
  renderGatlingCannon,
  renderGunCannon,
  type GunCannonRenderMap,
  type GunCannonRenderState,
  type GunCannonProcessState,
  HowitzerCannonEntity,
  type HowitzerCannonRenderMap,
  type HowitzerCannonRenderState,
  type HowitzerCannonProcessState,
  HOWITZER_CANNON_UNIT_X_PIXELS,
  HOWITZER_CANNON_UNIT_Y_PIXELS,
  initCannonPlacementImages,
  initHowitzerCannon,
  renderHowitzerCannon,
  fireMissileCannonTurrentMissile,
  initMissileCannon,
  MissileCannonEntity,
  type MissileCannonRenderMap,
  type MissileCannonRenderState,
  type MissileCannonProcessState,
  MISSILE_CANNON_UNIT_X_PIXELS,
  MISSILE_CANNON_UNIT_Y_PIXELS,
  processGunCannon,
  processHowitzerCannon,
  processMissileCannon,
  renderMissileCannon,
  ZCANNON_HEADER_GUARD_PORTED,
} from "../src/simulation/entities/CannonTypes";
import { ObjectMode } from "../src/simulation/entities/EntityTypes";
import type { VehicleRestrictedSoundCommand } from "../src/simulation/entities/VehicleEntity";
import {
  ACTIVE_TEAM_TYPE_COUNT,
  MAX_ANGLE_TYPES,
  MAX_UNIT_HEALTH,
  RobotType,
  TeamType,
} from "../src/simulation/SimulationConstants";
import type { LightRocketEffectSpawn } from "../src/simulation/LightRocketEffect";
import type { MissileCannonRocketsEffectSpawn } from "../src/simulation/MissileCannonRocketsEffect";
import { SoundEngineSound } from "../src/audio/AudioService";

type CannonRenderImage = { name: string };

function createGunCannonRenderState(
  overrides: Partial<GunCannonRenderState<CannonRenderImage>> = {},
): GunCannonRenderState<CannonRenderImage> {
  return {
    position: { x: 320, y: 240 },
    destroyed: false,
    mode: ObjectMode.Rotating,
    owner: TeamType.Blue,
    direction: 3,
    placeIndex: 0,
    doHitEffect: true,
    wastedImage: { name: "wasted" },
    initPlaceImages: [
      { name: "init-place-0" },
      { name: "init-place-1" },
      { name: "init-place-2" },
    ],
    placeImages: [
      null,
      [],
      [
        { name: "blue-place-0" },
        { name: "blue-place-1" },
        { name: "blue-place-2" },
        { name: "blue-place-3" },
      ],
    ],
    passiveImages: [
      null,
      [],
      [
        { name: "blue-passive-0" },
        { name: "blue-passive-1" },
        { name: "blue-passive-2" },
        { name: "blue-passive-3" },
      ],
    ],
    ...overrides,
  };
}

function createGatlingCannonRenderState(
  overrides: Partial<GatlingCannonRenderState<CannonRenderImage>> = {},
): GatlingCannonRenderState<CannonRenderImage> {
  return {
    ...createGunCannonRenderState({
      direction: 0,
      passiveImages: [
        null,
        [],
        [
          { name: "blue-passive-0" },
          { name: "blue-passive-1" },
          { name: "blue-passive-2" },
          { name: "blue-passive-3" },
          { name: "blue-passive-4" },
        ],
      ],
    }),
    renderFire: false,
    fireImages: [
      null,
      [],
      [
        { name: "blue-fire-0" },
        { name: "blue-fire-1" },
        { name: "blue-fire-2" },
        { name: "blue-fire-3" },
        { name: "blue-fire-4" },
      ],
    ],
    ...overrides,
  };
}

function createHowitzerCannonRenderState(
  overrides: Partial<HowitzerCannonRenderState<CannonRenderImage>> = {},
): HowitzerCannonRenderState<CannonRenderImage> {
  return {
    ...createGatlingCannonRenderState({
      direction: 5,
      passiveImages: [
        null,
        [],
        [
          { name: "blue-howitzer-passive-0" },
          { name: "blue-howitzer-passive-1" },
          { name: "blue-howitzer-passive-2" },
          { name: "blue-howitzer-passive-3" },
          { name: "blue-howitzer-passive-4" },
          { name: "blue-howitzer-passive-5" },
        ],
      ],
      fireImages: [
        null,
        [],
        [
          { name: "blue-howitzer-fire-0" },
          { name: "blue-howitzer-fire-1" },
          { name: "blue-howitzer-fire-2" },
          { name: "blue-howitzer-fire-3" },
          { name: "blue-howitzer-fire-4" },
          { name: "blue-howitzer-fire-5" },
        ],
      ],
    }),
    ...overrides,
  };
}

function createMissileCannonRenderState(
  overrides: Partial<MissileCannonRenderState<CannonRenderImage>> = {},
): MissileCannonRenderState<CannonRenderImage> {
  return {
    ...createGatlingCannonRenderState({
      direction: 2,
      passiveImages: [
        null,
        [],
        [
          { name: "blue-missile-passive-0" },
          { name: "blue-missile-passive-1" },
          { name: "blue-missile-passive-2" },
        ],
      ],
      fireImages: [
        null,
        [],
        [
          { name: "blue-missile-fire-0" },
          { name: "blue-missile-fire-1" },
          { name: "blue-missile-fire-2" },
        ],
      ],
    }),
    wastedImages: [
      null,
      { name: "red-missile-wasted" },
      { name: "blue-missile-wasted" },
    ],
    ...overrides,
  };
}

describe("cannon types", () => {
  it("adapts the cgatling header guard to module boundaries", async () => {
    const firstImport = await import("../src/simulation/entities/CannonTypes");
    const secondImport = await import("../src/simulation/entities/CannonTypes");

    expect(CGATLING_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.CGATLING_HEADER_GUARD_PORTED).toBe(
      firstImport.CGATLING_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the cgun header guard to module boundaries", async () => {
    const firstImport = await import("../src/simulation/entities/CannonTypes");
    const secondImport = await import("../src/simulation/entities/CannonTypes");

    expect(CGUN_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.CGUN_HEADER_GUARD_PORTED).toBe(
      firstImport.CGUN_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the chowitzer header guard to module boundaries", async () => {
    const firstImport = await import("../src/simulation/entities/CannonTypes");
    const secondImport = await import("../src/simulation/entities/CannonTypes");

    expect(CHOWITZER_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.CHOWITZER_HEADER_GUARD_PORTED).toBe(
      firstImport.CHOWITZER_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the cmissilecannon header guard to module boundaries", async () => {
    const firstImport = await import("../src/simulation/entities/CannonTypes");
    const secondImport = await import("../src/simulation/entities/CannonTypes");

    expect(CMISSILECANNON_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.CMISSILECANNON_HEADER_GUARD_PORTED).toBe(
      firstImport.CMISSILECANNON_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the zcannon header guard to module boundaries", async () => {
    const firstImport = await import("../src/simulation/entities/CannonTypes");
    const secondImport = await import("../src/simulation/entities/CannonTypes");

    expect(ZCANNON_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZCANNON_HEADER_GUARD_PORTED).toBe(
      firstImport.ZCANNON_HEADER_GUARD_PORTED,
    );
  });

  it("ports ZCannon CanSetWaypoints as enabled waypoint orders", () => {
    expect(canCannonSetWaypoints()).toBe(true);
  });

  it("replaces CGun DoRender with the passive image and clears hit effect", () => {
    const state = createGunCannonRenderState();
    const map: GunCannonRenderMap<CannonRenderImage> = {
      renderZSurface(surface, x, y, renderHit, aboutCenter) {
        return { surface, x, y, renderHit, aboutCenter };
      },
    };

    expect(renderGunCannon(state, map)).toEqual({
      surface: { name: "blue-passive-3" },
      x: 320 + GUN_CANNON_UNIT_X_PIXELS,
      y: 240 + GUN_CANNON_UNIT_Y_PIXELS,
      renderHit: true,
      aboutCenter: false,
    });
    expect(state.doHitEffect).toBe(false);
  });

  it("replaces CGun DoRender with the wasted image while destroyed", () => {
    const state = createGunCannonRenderState({
      destroyed: true,
      doHitEffect: false,
    });
    const map: GunCannonRenderMap<CannonRenderImage> = {
      renderZSurface(surface, x, y, renderHit, aboutCenter) {
        return { surface, x, y, renderHit, aboutCenter };
      },
    };

    expect(renderGunCannon(state, map)).toEqual({
      surface: { name: "wasted" },
      x: 320 + GUN_CANNON_UNIT_X_PIXELS,
      y: 240 + GUN_CANNON_UNIT_Y_PIXELS,
      renderHit: false,
      aboutCenter: false,
    });
  });

  it("replaces CGun DoRender with initial placement frames before team frames", () => {
    const state = createGunCannonRenderState({
      mode: ObjectMode.JustPlaced,
      placeIndex: 2,
    });
    const map: GunCannonRenderMap<CannonRenderImage> = {
      renderZSurface(surface, x, y, renderHit, aboutCenter) {
        return { surface, x, y, renderHit, aboutCenter };
      },
    };

    expect(renderGunCannon(state, map)?.surface).toEqual({
      name: "init-place-2",
    });
    expect(state.doHitEffect).toBe(false);
  });

  it("replaces CGun DoRender with team placement frames after initial placement", () => {
    const state = createGunCannonRenderState({
      mode: ObjectMode.JustPlaced,
      placeIndex: 5,
    });
    const map: GunCannonRenderMap<CannonRenderImage> = {
      renderZSurface(surface, x, y, renderHit, aboutCenter) {
        return { surface, x, y, renderHit, aboutCenter };
      },
    };

    expect(renderGunCannon(state, map)?.surface).toEqual({
      name: "blue-place-2",
    });
    expect(state.doHitEffect).toBe(false);
  });

  it("replaces CGun DoRender as no command when the selected image is missing", () => {
    const state = createGunCannonRenderState({
      passiveImages: [],
      doHitEffect: true,
    });
    const map: GunCannonRenderMap<CannonRenderImage> = {
      renderZSurface() {
        throw new Error("renderZSurface should not be called");
      },
    };

    expect(renderGunCannon(state, map)).toBeNull();
    expect(state.doHitEffect).toBe(false);
  });

  it("replaces CGatling DoRender with the passive image and direction x offset", () => {
    const state = createGatlingCannonRenderState();
    const map: GatlingCannonRenderMap<CannonRenderImage> = {
      renderZSurface(surface, x, y, renderHit, aboutCenter) {
        return { surface, x, y, renderHit, aboutCenter };
      },
    };

    expect(renderGatlingCannon(state, map)).toEqual({
      surface: { name: "blue-passive-0" },
      x: 320 + GATLING_CANNON_UNIT_X_PIXELS + 1,
      y: 240 + GATLING_CANNON_UNIT_Y_PIXELS,
      renderHit: true,
      aboutCenter: false,
    });
    expect(state.doHitEffect).toBe(false);
  });

  it("replaces CGatling DoRender with the fire image while firing", () => {
    const state = createGatlingCannonRenderState({
      direction: 4,
      renderFire: true,
    });
    const map: GatlingCannonRenderMap<CannonRenderImage> = {
      renderZSurface(surface, x, y, renderHit, aboutCenter) {
        return { surface, x, y, renderHit, aboutCenter };
      },
    };

    expect(renderGatlingCannon(state, map)).toEqual({
      surface: { name: "blue-fire-4" },
      x: 320 + GATLING_CANNON_UNIT_X_PIXELS - 1,
      y: 240 + GATLING_CANNON_UNIT_Y_PIXELS,
      renderHit: true,
      aboutCenter: false,
    });
    expect(state.doHitEffect).toBe(false);
  });

  it("replaces CGatling DoRender with the wasted image while destroyed", () => {
    const state = createGatlingCannonRenderState({
      destroyed: true,
      renderFire: true,
      doHitEffect: false,
    });
    const map: GatlingCannonRenderMap<CannonRenderImage> = {
      renderZSurface(surface, x, y, renderHit, aboutCenter) {
        return { surface, x, y, renderHit, aboutCenter };
      },
    };

    expect(renderGatlingCannon(state, map)).toEqual({
      surface: { name: "wasted" },
      x: 320 + GATLING_CANNON_UNIT_X_PIXELS + 1,
      y: 240 + GATLING_CANNON_UNIT_Y_PIXELS,
      renderHit: false,
      aboutCenter: false,
    });
  });

  it("replaces CGatling DoRender with placement frames while just placed", () => {
    const state = createGatlingCannonRenderState({
      mode: ObjectMode.JustPlaced,
      placeIndex: 5,
      renderFire: true,
    });
    const map: GatlingCannonRenderMap<CannonRenderImage> = {
      renderZSurface(surface, x, y, renderHit, aboutCenter) {
        return { surface, x, y, renderHit, aboutCenter };
      },
    };

    expect(renderGatlingCannon(state, map)?.surface).toEqual({
      name: "blue-place-2",
    });
    expect(state.doHitEffect).toBe(false);
  });

  it("replaces CGatling DoRender as no command when the selected image is missing", () => {
    const state = createGatlingCannonRenderState({
      fireImages: [],
      renderFire: true,
      doHitEffect: true,
    });
    const map: GatlingCannonRenderMap<CannonRenderImage> = {
      renderZSurface() {
        throw new Error("renderZSurface should not be called");
      },
    };

    expect(renderGatlingCannon(state, map)).toBeNull();
    expect(state.doHitEffect).toBe(false);
  });

  it("replaces CHowitzer DoRender with the passive image and direction offsets", () => {
    const state = createHowitzerCannonRenderState();
    const map: HowitzerCannonRenderMap<CannonRenderImage> = {
      renderZSurface(surface, x, y, renderHit, aboutCenter) {
        return { surface, x, y, renderHit, aboutCenter };
      },
    };

    expect(renderHowitzerCannon(state, map)).toEqual({
      surface: { name: "blue-howitzer-passive-5" },
      x: 320 + HOWITZER_CANNON_UNIT_X_PIXELS + 2,
      y: 240 + HOWITZER_CANNON_UNIT_Y_PIXELS + 3,
      renderHit: true,
      aboutCenter: false,
    });
    expect(state.doHitEffect).toBe(false);
  });

  it("replaces CHowitzer DoRender with the fire image while firing", () => {
    const state = createHowitzerCannonRenderState({
      direction: 0,
      renderFire: true,
    });
    const map: HowitzerCannonRenderMap<CannonRenderImage> = {
      renderZSurface(surface, x, y, renderHit, aboutCenter) {
        return { surface, x, y, renderHit, aboutCenter };
      },
    };

    expect(renderHowitzerCannon(state, map)).toEqual({
      surface: { name: "blue-howitzer-fire-0" },
      x: 320 + HOWITZER_CANNON_UNIT_X_PIXELS + 5,
      y: 240 + HOWITZER_CANNON_UNIT_Y_PIXELS,
      renderHit: true,
      aboutCenter: false,
    });
    expect(state.doHitEffect).toBe(false);
  });

  it("replaces CHowitzer DoRender with the wasted image while destroyed", () => {
    const state = createHowitzerCannonRenderState({
      destroyed: true,
      renderFire: true,
      doHitEffect: false,
    });
    const map: HowitzerCannonRenderMap<CannonRenderImage> = {
      renderZSurface(surface, x, y, renderHit, aboutCenter) {
        return { surface, x, y, renderHit, aboutCenter };
      },
    };

    expect(renderHowitzerCannon(state, map)).toEqual({
      surface: { name: "wasted" },
      x: 320 + HOWITZER_CANNON_UNIT_X_PIXELS + 2,
      y: 240 + HOWITZER_CANNON_UNIT_Y_PIXELS + 3,
      renderHit: false,
      aboutCenter: false,
    });
  });

  it("replaces CHowitzer DoRender as no command when the selected image is missing", () => {
    const state = createHowitzerCannonRenderState({
      passiveImages: [],
      doHitEffect: true,
    });
    const map: HowitzerCannonRenderMap<CannonRenderImage> = {
      renderZSurface() {
        throw new Error("renderZSurface should not be called");
      },
    };

    expect(renderHowitzerCannon(state, map)).toBeNull();
    expect(state.doHitEffect).toBe(false);
  });

  it("replaces CMissileCannon DoRender with the passive image", () => {
    const state = createMissileCannonRenderState();
    const map: MissileCannonRenderMap<CannonRenderImage> = {
      renderZSurface(surface, x, y, renderHit, aboutCenter) {
        return { surface, x, y, renderHit, aboutCenter };
      },
    };

    expect(renderMissileCannon(state, map)).toEqual({
      surface: { name: "blue-missile-passive-2" },
      x: 320 + MISSILE_CANNON_UNIT_X_PIXELS,
      y: 240 + MISSILE_CANNON_UNIT_Y_PIXELS,
      renderHit: true,
      aboutCenter: false,
    });
    expect(state.doHitEffect).toBe(false);
  });

  it("replaces CMissileCannon DoRender with the fire image while firing", () => {
    const state = createMissileCannonRenderState({ renderFire: true });
    const map: MissileCannonRenderMap<CannonRenderImage> = {
      renderZSurface(surface, x, y, renderHit, aboutCenter) {
        return { surface, x, y, renderHit, aboutCenter };
      },
    };

    expect(renderMissileCannon(state, map)?.surface).toEqual({
      name: "blue-missile-fire-2",
    });
    expect(state.doHitEffect).toBe(false);
  });

  it("replaces CMissileCannon DoRender with the owner wasted image while destroyed", () => {
    const state = createMissileCannonRenderState({
      destroyed: true,
      owner: TeamType.Red,
      renderFire: true,
      doHitEffect: false,
    });
    const map: MissileCannonRenderMap<CannonRenderImage> = {
      renderZSurface(surface, x, y, renderHit, aboutCenter) {
        return { surface, x, y, renderHit, aboutCenter };
      },
    };

    expect(renderMissileCannon(state, map)).toEqual({
      surface: { name: "red-missile-wasted" },
      x: 320 + MISSILE_CANNON_UNIT_X_PIXELS,
      y: 240 + MISSILE_CANNON_UNIT_Y_PIXELS,
      renderHit: false,
      aboutCenter: false,
    });
  });

  it("replaces CMissileCannon DoRender with placement frames while just placed", () => {
    const state = createMissileCannonRenderState({
      mode: ObjectMode.JustPlaced,
      placeIndex: 1,
      renderFire: true,
    });
    const map: MissileCannonRenderMap<CannonRenderImage> = {
      renderZSurface(surface, x, y, renderHit, aboutCenter) {
        return { surface, x, y, renderHit, aboutCenter };
      },
    };

    expect(renderMissileCannon(state, map)?.surface).toEqual({
      name: "init-place-1",
    });
    expect(state.doHitEffect).toBe(false);
  });

  it("replaces CMissileCannon DoRender as no command when the selected image is missing", () => {
    const state = createMissileCannonRenderState({
      wastedImages: [],
      destroyed: true,
      doHitEffect: true,
    });
    const map: MissileCannonRenderMap<CannonRenderImage> = {
      renderZSurface() {
        throw new Error("renderZSurface should not be called");
      },
    };

    expect(renderMissileCannon(state, map)).toBeNull();
    expect(state.doHitEffect).toBe(false);
  });

  it("ports ZCannon Init as cannon placement image loading", () => {
    const loadedFilenames = Array.from({ length: 3 }, () => "");
    const placementImages = loadedFilenames.map((_, index) => ({
      loadBaseImage(filename: string) {
        loadedFilenames[index] = filename;
      },
    }));

    initCannonPlacementImages(placementImages);

    expect(loadedFilenames).toEqual([
      "assets/units/cannons/init-place_n00.png",
      "assets/units/cannons/init-place_n01.png",
      "assets/units/cannons/init-place_n02.png",
    ]);
  });

  it("ports CGun Init as gun cannon image loading and team recoloring", () => {
    type Surface = { id: string };
    type LoadedImage = {
      source: string | Surface | null;
      getBaseSurface(): Surface | null;
      loadBaseImage(source: string | Surface | null): void;
    };
    const loadCalls: string[] = [];
    const madeSurfaces: Array<[number, Surface | null]> = [];
    const createImage = (): LoadedImage => ({
      source: null,
      getBaseSurface() {
        if (typeof this.source === "string") return { id: this.source };
        return this.source;
      },
      loadBaseImage(source) {
        this.source = source;
      },
    });
    const state = {
      wasted: createImage(),
      passive: Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, () =>
        Array.from({ length: MAX_ANGLE_TYPES }, createImage),
      ),
      fire: Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, () =>
        Array.from({ length: MAX_ANGLE_TYPES }, createImage),
      ),
      place: Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, () =>
        Array.from({ length: 4 }, createImage),
      ),
      loadImage(filename: string): Surface {
        loadCalls.push(filename);
        return { id: `loaded:${filename}` };
      },
    };

    initGunCannon(state, (team, surface) => {
      madeSurfaces.push([team, surface]);
      return { id: `team-${team}-${surface?.id ?? "null"}` };
    });

    expect(state.wasted.source).toBe("assets/units/cannons/gun/wasted.png");
    expect(loadCalls).toEqual(["assets/units/cannons/gun/empty.png"]);
    expect(state.passive[TeamType.Null]![0]!.source).toEqual({
      id: "loaded:assets/units/cannons/gun/empty.png",
    });
    expect(state.fire[TeamType.Null]![7]!.source).toEqual({
      id: "loaded:assets/units/cannons/gun/empty.png",
    });
    expect(state.place[TeamType.Null]![3]!.source).toEqual({
      id: "loaded:assets/units/cannons/gun/empty.png",
    });
    expect(state.place[TeamType.Red]![0]!.source).toBe(
      "assets/units/cannons/gun/place_red_n00.png",
    );
    expect(state.place[TeamType.Blue]![0]!.source).toEqual({
      id: "team-2-assets/units/cannons/gun/place_red_n00.png",
    });
    expect(state.passive[TeamType.Red]![3]!.source).toBe(
      "assets/units/cannons/gun/equiped_red_r135.png",
    );
    expect(state.passive[TeamType.Blue]![3]!.source).toEqual({
      id: "team-2-assets/units/cannons/gun/equiped_red_r135.png",
    });
    expect(state.fire[TeamType.Blue]![3]!.source).toEqual({
      id: "team-2-assets/units/cannons/gun/equiped_red_r135.png",
    });
    expect(madeSurfaces).toHaveLength((ACTIVE_TEAM_TYPE_COUNT - 2) * 12);
  });

  it("ports CHowitzer Init as howitzer image loading and team recoloring", () => {
    type Surface = { id: string };
    type LoadedImage = {
      source: string | Surface | null;
      getBaseSurface(): Surface | null;
      loadBaseImage(source: string | Surface | null): void;
    };
    const loadCalls: string[] = [];
    const madeSurfaces: Array<[number, Surface | null]> = [];
    const createImage = (): LoadedImage => ({
      source: null,
      getBaseSurface() {
        if (typeof this.source === "string") return { id: this.source };
        return this.source;
      },
      loadBaseImage(source) {
        this.source = source;
      },
    });
    const state = {
      wasted: createImage(),
      passive: Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, () =>
        Array.from({ length: MAX_ANGLE_TYPES }, createImage),
      ),
      fire: Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, () =>
        Array.from({ length: MAX_ANGLE_TYPES }, createImage),
      ),
      place: Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, () =>
        Array.from({ length: 4 }, createImage),
      ),
      loadImage(filename: string): Surface {
        loadCalls.push(filename);
        return { id: `loaded:${filename}` };
      },
    };

    initHowitzerCannon(state, (team, surface) => {
      madeSurfaces.push([team, surface]);
      return { id: `team-${team}-${surface?.id ?? "null"}` };
    });

    expect(state.wasted.source).toBe(
      "assets/units/cannons/howitzer/wasted.png",
    );
    expect(loadCalls).toEqual([
      "assets/units/cannons/howitzer/empty_r000.png",
      "assets/units/cannons/howitzer/empty_r045.png",
      "assets/units/cannons/howitzer/empty_r090.png",
      "assets/units/cannons/howitzer/empty_r135.png",
      "assets/units/cannons/howitzer/empty_r180.png",
      "assets/units/cannons/howitzer/empty_r225.png",
      "assets/units/cannons/howitzer/empty_r270.png",
      "assets/units/cannons/howitzer/empty_r315.png",
    ]);
    expect(state.passive[TeamType.Null]![3]!.source).toEqual({
      id: "loaded:assets/units/cannons/howitzer/empty_r135.png",
    });
    expect(state.fire[TeamType.Null]![3]!.source).toEqual({
      id: "loaded:assets/units/cannons/howitzer/empty_r135.png",
    });
    expect(state.place[TeamType.Null]![0]!.source).toEqual({
      id: "loaded:assets/units/cannons/howitzer/empty_r180.png",
    });
    expect(state.place[TeamType.Red]![2]!.source).toBe(
      "assets/units/cannons/howitzer/place_red_n02.png",
    );
    expect(state.place[TeamType.Blue]![2]!.source).toEqual({
      id: "team-2-assets/units/cannons/howitzer/place_red_n02.png",
    });
    expect(state.passive[TeamType.Red]![3]!.source).toBe(
      "assets/units/cannons/howitzer/fire_red_r135_n00.png",
    );
    expect(state.fire[TeamType.Red]![3]!.source).toBe(
      "assets/units/cannons/howitzer/fire_red_r135_n01.png",
    );
    expect(state.passive[TeamType.Blue]![3]!.source).toEqual({
      id: "team-2-assets/units/cannons/howitzer/fire_red_r135_n00.png",
    });
    expect(state.fire[TeamType.Blue]![3]!.source).toEqual({
      id: "team-2-assets/units/cannons/howitzer/fire_red_r135_n01.png",
    });
    expect(madeSurfaces).toHaveLength((ACTIVE_TEAM_TYPE_COUNT - 2) * 20);
  });

  it("ports CGatling Init as gatling image loading and team recoloring", () => {
    type Surface = { id: string };
    type LoadedImage = {
      source: string | Surface | null;
      getBaseSurface(): Surface | null;
      loadBaseImage(source: string | Surface | null): void;
    };
    const loadCalls: string[] = [];
    const madeSurfaces: Array<[number, Surface | null]> = [];
    const createImage = (): LoadedImage => ({
      source: null,
      getBaseSurface() {
        if (typeof this.source === "string") return { id: this.source };
        return this.source;
      },
      loadBaseImage(source) {
        this.source = source;
      },
    });
    const state = {
      wasted: createImage(),
      passive: Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, () =>
        Array.from({ length: MAX_ANGLE_TYPES }, createImage),
      ),
      fire: Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, () =>
        Array.from({ length: MAX_ANGLE_TYPES }, createImage),
      ),
      place: Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, () =>
        Array.from({ length: 4 }, createImage),
      ),
      loadImage(filename: string): Surface {
        loadCalls.push(filename);
        return { id: `loaded:${filename}` };
      },
    };

    initGatlingCannon(state, (team, surface) => {
      madeSurfaces.push([team, surface]);
      return { id: `team-${team}-${surface?.id ?? "null"}` };
    });

    expect(state.wasted.source).toBe(
      "assets/units/cannons/gatling/wasted.png",
    );
    expect(loadCalls).toEqual([
      "assets/units/cannons/gatling/empty_r000.png",
      "assets/units/cannons/gatling/empty_r045.png",
      "assets/units/cannons/gatling/empty_r090.png",
      "assets/units/cannons/gatling/empty_r135.png",
      "assets/units/cannons/gatling/empty_r180.png",
      "assets/units/cannons/gatling/empty_r225.png",
      "assets/units/cannons/gatling/empty_r270.png",
      "assets/units/cannons/gatling/empty_r315.png",
    ]);
    expect(state.fire[TeamType.Null]![3]!.source).toEqual({
      id: "loaded:assets/units/cannons/gatling/empty_r135.png",
    });
    expect(state.passive[TeamType.Null]![3]!.source).toEqual({
      id: "loaded:assets/units/cannons/gatling/empty_r135.png",
    });
    expect(state.place[TeamType.Null]![3]!.source).toEqual({
      id: "loaded:assets/units/cannons/gatling/empty_r180.png",
    });
    expect(state.place[TeamType.Red]![1]!.source).toBe(
      "assets/units/cannons/gatling/place_red_n01.png",
    );
    expect(state.place[TeamType.Blue]![1]!.source).toEqual({
      id: "team-2-assets/units/cannons/gatling/place_red_n01.png",
    });
    expect(state.passive[TeamType.Red]![3]!.source).toBe(
      "assets/units/cannons/gatling/fire_red_r135_n00.png",
    );
    expect(state.fire[TeamType.Red]![3]!.source).toBe(
      "assets/units/cannons/gatling/fire_red_r135_n01.png",
    );
    expect(state.passive[TeamType.Blue]![3]!.source).toEqual({
      id: "team-2-assets/units/cannons/gatling/fire_red_r135_n00.png",
    });
    expect(state.fire[TeamType.Blue]![3]!.source).toEqual({
      id: "team-2-assets/units/cannons/gatling/fire_red_r135_n01.png",
    });
    expect(madeSurfaces).toHaveLength((ACTIVE_TEAM_TYPE_COUNT - 2) * 20);
  });

  it("ports CMissileCannon Init as missile-cannon image loading and team recoloring", () => {
    type Surface = { id: string };
    type LoadedImage = {
      source: string | Surface | null;
      getBaseSurface(): Surface | null;
      loadBaseImage(source: string | Surface | null): void;
    };
    const loadCalls: string[] = [];
    const madeSurfaces: Array<[number, Surface | null]> = [];
    const createImage = (): LoadedImage => ({
      source: null,
      getBaseSurface() {
        if (typeof this.source === "string") return { id: this.source };
        return this.source;
      },
      loadBaseImage(source) {
        this.source = source;
      },
    });
    const state = {
      wasted: Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, createImage),
      passive: Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, () =>
        Array.from({ length: MAX_ANGLE_TYPES }, createImage),
      ),
      fire: Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, () =>
        Array.from({ length: MAX_ANGLE_TYPES }, createImage),
      ),
      place: Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, () =>
        Array.from({ length: 4 }, createImage),
      ),
      empty: Array.from({ length: ACTIVE_TEAM_TYPE_COUNT }, () =>
        Array.from({ length: MAX_ANGLE_TYPES }, createImage),
      ),
      loadImage(filename: string): Surface {
        loadCalls.push(filename);
        return { id: `loaded:${filename}` };
      },
    };

    initMissileCannon(state, (team, surface) => {
      madeSurfaces.push([team, surface]);
      return { id: `team-${team}-${surface?.id ?? "null"}` };
    });

    expect(state.wasted[TeamType.Null]!.source).toBeNull();
    expect(state.wasted[TeamType.Red]!.source).toBe(
      "assets/units/cannons/missile_cannon/wasted_red.png",
    );
    expect(state.wasted[TeamType.Blue]!.source).toEqual({
      id: "team-2-assets/units/cannons/missile_cannon/wasted_red.png",
    });
    expect(loadCalls).toEqual([
      "assets/units/cannons/missile_cannon/empty_null.png",
    ]);
    expect(state.empty[TeamType.Null]![3]!.source).toEqual({
      id: "loaded:assets/units/cannons/missile_cannon/empty_null.png",
    });
    expect(state.fire[TeamType.Null]![3]!.source).toEqual({
      id: "loaded:assets/units/cannons/missile_cannon/empty_null.png",
    });
    expect(state.passive[TeamType.Null]![3]!.source).toEqual({
      id: "loaded:assets/units/cannons/missile_cannon/empty_null.png",
    });
    expect(state.place[TeamType.Null]![0]!.source).toEqual({
      id: "loaded:assets/units/cannons/missile_cannon/empty_null.png",
    });
    expect(state.place[TeamType.Red]![1]!.source).toBe(
      "assets/units/cannons/missile_cannon/place_red_n01.png",
    );
    expect(state.passive[TeamType.Red]![3]!.source).toBe(
      "assets/units/cannons/missile_cannon/equiped_red_r135.png",
    );
    expect(state.fire[TeamType.Blue]![3]!.source).toEqual({
      id: "team-2-assets/units/cannons/missile_cannon/equiped_red_r135.png",
    });
    expect(state.empty[TeamType.Red]![3]!.source).toBe(
      "assets/units/cannons/missile_cannon/empty_red_r135.png",
    );
    expect(state.empty[TeamType.Blue]![3]!.source).toEqual({
      id: "team-2-assets/units/cannons/missile_cannon/empty_red_r135.png",
    });
    expect(madeSurfaces).toHaveLength((ACTIVE_TEAM_TYPE_COUNT - 2) * 21);
  });

  it("ports CGun Process as throttled placement animation", () => {
    const state: GunCannonProcessState = {
      mode: ObjectMode.JustPlaced,
      lastProcessTime: 10,
      placeIndex: 5,
      owner: TeamType.Blue,
      attackObject: null,
      position: { x: 10, y: 10 },
      direction: 2,
      directionFromLocation: () => {
        throw new Error("placement does not calculate direction");
      },
    };

    expect(processGunCannon(state, 10.05)).toBe(1);
    expect(state).toMatchObject({
      mode: ObjectMode.JustPlaced,
      lastProcessTime: 10,
      placeIndex: 5,
      direction: 2,
    });

    expect(processGunCannon(state, 10.1)).toBe(1);
    expect(state).toMatchObject({
      mode: ObjectMode.JustPlaced,
      lastProcessTime: 10.1,
      placeIndex: 6,
      direction: 2,
    });

    processGunCannon(state, 10.2);
    expect(state).toMatchObject({
      mode: ObjectMode.Rotating,
      lastProcessTime: 10.2,
      placeIndex: 0,
      direction: 2,
    });
  });

  it("ports CGun Process as neutral rotating cannon wait", () => {
    const state: GunCannonProcessState = {
      mode: ObjectMode.Rotating,
      lastProcessTime: 10,
      placeIndex: 0,
      owner: TeamType.Null,
      attackObject: null,
      position: { x: 10, y: 10 },
      direction: 7,
      directionFromLocation: () => 0,
    };

    processGunCannon(state, 12);

    expect(state).toMatchObject({
      lastProcessTime: 10,
      direction: 7,
    });
  });

  it("ports CGun Process as periodic idle rotation", () => {
    const state: GunCannonProcessState = {
      mode: ObjectMode.Rotating,
      lastProcessTime: 10,
      placeIndex: 0,
      owner: TeamType.Red,
      attackObject: null,
      position: { x: 10, y: 10 },
      direction: 7,
      directionFromLocation: () => {
        throw new Error("idle rotation does not calculate direction");
      },
    };

    processGunCannon(state, 10.5);
    expect(state.direction).toBe(7);
    expect(state.lastProcessTime).toBe(10);

    processGunCannon(state, 11);
    expect(state.direction).toBe(0);
    expect(state.lastProcessTime).toBe(11);
  });

  it("ports CGun Process as target-facing rotation", () => {
    const target = new GameEntity({
      id: "gun-target",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    target.centerX = 10;
    target.centerY = 30;
    const state: GunCannonProcessState = {
      mode: ObjectMode.Rotating,
      lastProcessTime: 10,
      placeIndex: 0,
      owner: TeamType.Red,
      attackObject: target,
      position: { x: 10, y: 10 },
      direction: 3,
      directionFromLocation(deltaX: number, deltaY: number) {
        expect([deltaX, deltaY]).toEqual([0, 20]);
        return 6;
      },
    };

    processGunCannon(state, 11);
    expect(state.direction).toBe(6);
    expect(state.lastProcessTime).toBe(11);

    state.attackObject = { centerX: 10, centerY: 10 };
    state.directionFromLocation = () => -1;
    processGunCannon(state, 12);
    expect(state.direction).toBe(6);
  });

  it("ports CHowitzer Process as fire-render timeout before shared processing", () => {
    const state: HowitzerCannonProcessState = {
      mode: ObjectMode.Rotating,
      lastProcessTime: 10,
      placeIndex: 0,
      owner: TeamType.Red,
      attackObject: null,
      position: { x: 10, y: 10 },
      direction: 7,
      renderFire: true,
      endRenderFireTime: 11,
      directionFromLocation: () => {
        throw new Error("idle rotation does not calculate direction");
      },
    };

    expect(processHowitzerCannon(state, 10.5)).toBe(1);
    expect(state.renderFire).toBe(true);
    expect(state.direction).toBe(7);

    processHowitzerCannon(state, 11);
    expect(state.renderFire).toBe(false);
    expect(state.direction).toBe(0);
    expect(state.lastProcessTime).toBe(11);
  });

  it("ports CHowitzer Process as placement animation with active fire frame", () => {
    const state: HowitzerCannonProcessState = {
      mode: ObjectMode.JustPlaced,
      lastProcessTime: 10,
      placeIndex: 6,
      owner: TeamType.Blue,
      attackObject: null,
      position: { x: 10, y: 10 },
      direction: 2,
      renderFire: true,
      endRenderFireTime: 20,
      directionFromLocation: () => {
        throw new Error("placement does not calculate direction");
      },
    };

    processHowitzerCannon(state, 10.1);

    expect(state).toMatchObject({
      mode: ObjectMode.Rotating,
      lastProcessTime: 10.1,
      placeIndex: 0,
      direction: 2,
      renderFire: true,
    });
  });

  it("ports CMissileCannon Process as fire-render timeout before shared processing", () => {
    const state: MissileCannonProcessState = {
      mode: ObjectMode.Rotating,
      lastProcessTime: 10,
      placeIndex: 0,
      owner: TeamType.Red,
      attackObject: null,
      position: { x: 10, y: 10 },
      direction: 6,
      renderFire: true,
      endRenderFireTime: 11,
      directionFromLocation: () => {
        throw new Error("idle rotation does not calculate direction");
      },
    };

    expect(processMissileCannon(state, 10.5)).toBe(1);
    expect(state.renderFire).toBe(true);
    expect(state.direction).toBe(6);

    processMissileCannon(state, 11);
    expect(state.renderFire).toBe(false);
    expect(state.direction).toBe(7);
    expect(state.lastProcessTime).toBe(11);
  });

  it("ports CMissileCannon Process as target-facing rotation", () => {
    const target = new GameEntity({
      id: "missile-cannon-target",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    target.centerX = 30;
    target.centerY = 10;
    const state: MissileCannonProcessState = {
      mode: ObjectMode.Rotating,
      lastProcessTime: 10,
      placeIndex: 0,
      owner: TeamType.Blue,
      attackObject: target,
      position: { x: 10, y: 10 },
      direction: 3,
      renderFire: true,
      endRenderFireTime: 20,
      directionFromLocation(deltaX: number, deltaY: number) {
        expect([deltaX, deltaY]).toEqual([20, 0]);
        return 0;
      },
    };

    processMissileCannon(state, 11);

    expect(state.renderFire).toBe(true);
    expect(state.direction).toBe(0);
    expect(state.lastProcessTime).toBe(11);
  });

  it("ports ZCannon SetEjectableCannon as cannon ejection state", () => {
    const cannon = new CannonEntity({
      id: "cannon-1",
      kind: "cannon",
      position: { x: 0, y: 0 },
    });

    expect(cannon.ejectableCannon).toBe(true);

    cannon.setEjectableCannon(false);

    expect(cannon.ejectableCannon).toBe(false);
  });

  it("ports ZCannon CanEjectDrivers as the ejectable cannon state", () => {
    const cannon = new CannonEntity({
      id: "cannon-1",
      kind: "cannon",
      position: { x: 0, y: 0 },
    });

    expect(cannon.canEjectDrivers()).toBe(true);

    cannon.setEjectableCannon(false);

    expect(cannon.canEjectDrivers()).toBe(false);
  });

  it("ports ZCannon SetInitialDrivers as no drivers for neutral cannons", () => {
    const cannon = new CannonEntity({
      id: "cannon-initial-drivers-neutral",
      kind: "cannon",
      position: { x: 0, y: 0 },
      owner: TeamType.Null,
    });
    let resetCount = 0;
    cannon.driverType = RobotType.Psycho;
    cannon.driverInfo.push({ health: 10, nextAttackTime: 5 });
    cannon.resetDamageInfo = () => {
      resetCount += 1;
    };

    cannon.setInitialDrivers(new ZSettings());

    expect(cannon.driverType).toBe(RobotType.Grunt);
    expect(cannon.driverInfo).toEqual([]);
    expect(resetCount).toBe(1);
  });

  it("ports ZCannon SetInitialDrivers as grunt driver for owned cannons", () => {
    const cannon = new CannonEntity({
      id: "cannon-initial-drivers-owned",
      kind: "cannon",
      position: { x: 0, y: 0 },
      owner: TeamType.Blue,
    });
    const settings = new ZSettings();
    settings.robotSettings[RobotType.Grunt].health = 0.35;

    cannon.setInitialDrivers(settings);

    expect(cannon.driverType).toBe(RobotType.Grunt);
    expect(cannon.driverInfo).toEqual([
      { health: 0.35 * MAX_UNIT_HEALTH, nextAttackTime: 0 },
    ]);
  });

  it("ports ZCannon CanBeSniped as sniped flag, driver, and ejectable checks", () => {
    const cannon = new CannonEntity({
      id: "cannon-1",
      kind: "cannon",
      position: { x: 0, y: 0 },
    });

    expect(cannon.canBeSniped()).toBe(false);

    cannon.canBeSnipedFlag = true;
    expect(cannon.canBeSniped()).toBe(false);

    cannon.driverInfo.push({ health: 20, nextAttackTime: 0 });
    expect(cannon.canBeSniped()).toBe(true);

    cannon.setEjectableCannon(false);
    expect(cannon.canBeSniped()).toBe(false);
  });

  it("ports ZCannon SetAttackObject as target assignment and direction refresh", () => {
    const cannon = new CannonEntity({
      id: "cannon-attack",
      kind: "cannon",
      position: { x: 10, y: 10 },
    });
    cannon.direction = 4;

    const target = new GameEntity({
      id: "target",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    target.centerX = 10;
    target.centerY = 20;

    cannon.setAttackObject(target);

    expect(cannon.attackObject).toBe(target);
    expect(cannon.direction).toBe(6);
  });

  it("ports ZCannon SetAttackObject null and zero-vector direction handling", () => {
    const cannon = new CannonEntity({
      id: "cannon-attack-null",
      kind: "cannon",
      position: { x: 10, y: 10 },
    });
    cannon.direction = 2;

    cannon.setAttackObject(null);
    expect(cannon.attackObject).toBeNull();
    expect(cannon.direction).toBe(2);

    const target = new GameEntity({
      id: "target-same",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    target.centerX = 10;
    target.centerY = 10;

    cannon.setAttackObject(target);
    expect(cannon.attackObject).toBe(target);
    expect(cannon.direction).toBe(2);
  });

  it("ports CGatling SetAttackObject as target assignment and direction refresh", () => {
    const cannon = new GatlingCannonEntity({
      id: "gatling-attack",
      kind: "cannon",
      position: { x: 10, y: 10 },
    });
    cannon.direction = 4;

    const target = new GameEntity({
      id: "target",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    target.centerX = 20;
    target.centerY = 10;

    cannon.setAttackObject(target);

    expect(cannon.attackObject).toBe(target);
    expect(cannon.direction).toBe(0);
  });

  it("ports CGatling SetAttackObject null handling as fire-render reset", () => {
    const cannon = new GatlingCannonEntity({
      id: "gatling-null",
      kind: "cannon",
      position: { x: 10, y: 10 },
    });
    cannon.direction = 6;
    cannon.renderFire = true;

    cannon.setAttackObject(null);

    expect(cannon.attackObject).toBeNull();
    expect(cannon.direction).toBe(6);
    expect(cannon.renderFire).toBe(false);
  });

  it("ports CHowitzer SetAttackObject as target assignment and direction refresh", () => {
    const cannon = new HowitzerCannonEntity({
      id: "howitzer-attack",
      kind: "cannon",
      position: { x: 10, y: 10 },
    });
    cannon.direction = 4;

    const target = new GameEntity({
      id: "target",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    target.centerX = 0;
    target.centerY = 10;

    cannon.setAttackObject(target);

    expect(cannon.attackObject).toBe(target);
    expect(cannon.direction).toBe(4);
  });

  it("ports CHowitzer SetAttackObject null handling as fire-render reset", () => {
    const cannon = new HowitzerCannonEntity({
      id: "howitzer-null",
      kind: "cannon",
      position: { x: 10, y: 10 },
    });
    cannon.direction = 6;
    cannon.renderFire = true;

    cannon.setAttackObject(null);

    expect(cannon.attackObject).toBeNull();
    expect(cannon.direction).toBe(6);
    expect(cannon.renderFire).toBe(false);
  });

  it("ports CMissileCannon SetAttackObject as target assignment and direction refresh", () => {
    const cannon = new MissileCannonEntity({
      id: "missile-cannon-attack",
      kind: "cannon",
      position: { x: 10, y: 10 },
    });
    cannon.direction = 4;

    const target = new GameEntity({
      id: "target",
      kind: "robot",
      position: { x: 0, y: 0 },
    });
    target.centerX = 10;
    target.centerY = 0;

    cannon.setAttackObject(target);

    expect(cannon.attackObject).toBe(target);
    expect(cannon.direction).toBe(2);
  });

  it("ports CMissileCannon SetAttackObject null handling as fire-render reset", () => {
    const cannon = new MissileCannonEntity({
      id: "missile-cannon-null",
      kind: "cannon",
      position: { x: 10, y: 10 },
    });
    cannon.direction = 6;
    cannon.renderFire = true;

    cannon.setAttackObject(null);

    expect(cannon.attackObject).toBeNull();
    expect(cannon.direction).toBe(6);
    expect(cannon.renderFire).toBe(false);
  });

  it("ports CGatling FireTurrentMissile as no effect without an effect list", () => {
    const ztime = { tick: 55 };
    const state = {
      ztime,
      position: { x: 18, y: 26 },
    };

    expect(() =>
      fireGatlingCannonTurrentMissile(state, null, 100, 120, 3.25),
    ).not.toThrow();
  });

  it("ports CGatling FireTurrentMissile as a front-inserted cannon death spawn", () => {
    const ztime = { tick: 55 };
    const existing = {
      ztime: null,
      startX: 1,
      startY: 2,
      targetX: 3,
      targetY: 4,
      offsetTime: 5,
      object: CannonDeathObject.Howitzer,
    };
    const effects: CannonDeathEffectSpawn<typeof ztime>[] = [existing];
    const state = {
      ztime,
      position: { x: 18, y: 26 },
    };

    fireGatlingCannonTurrentMissile(state, effects, 100, 120, 3.25);

    expect(effects).toEqual([
      {
        ztime,
        startX: 18,
        startY: 26,
        targetX: 100,
        targetY: 120,
        offsetTime: 3.25,
        object: CannonDeathObject.Gatling,
      },
      existing,
    ]);
  });

  it("ports CHowitzer FireTurrentMissile as no effect without an effect list", () => {
    const ztime = { tick: 56 };
    const state = {
      ztime,
      position: { x: 20, y: 28 },
    };

    expect(() =>
      fireHowitzerCannonTurrentMissile(state, null, 110, 130, 4.25),
    ).not.toThrow();
  });

  it("ports CHowitzer FireTurrentMissile as a front-inserted cannon death spawn", () => {
    const ztime = { tick: 56 };
    const existing = {
      ztime: null,
      startX: 1,
      startY: 2,
      targetX: 3,
      targetY: 4,
      offsetTime: 5,
      object: CannonDeathObject.Gun,
    };
    const effects: CannonDeathEffectSpawn<typeof ztime>[] = [existing];
    const state = {
      ztime,
      position: { x: 20, y: 28 },
    };

    fireHowitzerCannonTurrentMissile(state, effects, 110, 130, 4.25);

    expect(effects).toEqual([
      {
        ztime,
        startX: 20,
        startY: 28,
        targetX: 110,
        targetY: 130,
        offsetTime: 4.25,
        object: CannonDeathObject.Howitzer,
      },
      existing,
    ]);
  });

  it("ports CMissileCannon FireTurrentMissile as no effect without an effect list", () => {
    const ztime = { tick: 57 };
    const state = {
      ztime,
      position: { x: 22, y: 30 },
    };

    expect(() =>
      fireMissileCannonTurrentMissile(state, null, 120, 140, 5.25),
    ).not.toThrow();
  });

  it("ports CMissileCannon FireTurrentMissile as a front-inserted cannon death spawn", () => {
    const ztime = { tick: 57 };
    const existing = {
      ztime: null,
      startX: 1,
      startY: 2,
      targetX: 3,
      targetY: 4,
      offsetTime: 5,
      object: CannonDeathObject.Gatling,
    };
    const effects: CannonDeathEffectSpawn<typeof ztime>[] = [existing];
    const state = {
      ztime,
      position: { x: 22, y: 30 },
    };

    fireMissileCannonTurrentMissile(state, effects, 120, 140, 5.25);

    expect(effects).toEqual([
      {
        ztime,
        startX: 22,
        startY: 30,
        targetX: 120,
        targetY: 140,
        offsetTime: 5.25,
        object: CannonDeathObject.Missile,
      },
      existing,
    ]);
  });

  it("ports CGatling DoDeathEffect as no effect for null owner", () => {
    const effects: CannonDeathEffectSpawn<{ tick: number }>[] = [];

    doGatlingCannonDeathEffect(
      { owner: TeamType.Null },
      effects,
      true,
      true,
    );

    expect(effects).toEqual([]);
  });

  it("ports CGatling DoDeathEffect as upstream commented-out no-op", () => {
    const ztime = { tick: 58 };
    const existing = {
      ztime,
      startX: 1,
      startY: 2,
      targetX: 3,
      targetY: 4,
      offsetTime: 5,
      object: CannonDeathObject.Gun,
    };
    const effects: CannonDeathEffectSpawn<typeof ztime>[] = [existing];

    doGatlingCannonDeathEffect(
      { owner: TeamType.Blue },
      effects,
      false,
      false,
    );

    expect(effects).toEqual([existing]);
  });

  it("ports CGun DoDeathEffect as no effect for null owner", () => {
    const effects: CannonDeathEffectSpawn<{ tick: number }>[] = [];

    doGunCannonDeathEffect({ owner: TeamType.Null }, effects, true, true);

    expect(effects).toEqual([]);
  });

  it("ports CGun DoDeathEffect as upstream commented-out no-op", () => {
    const ztime = { tick: 59 };
    const existing = {
      ztime,
      startX: 6,
      startY: 7,
      targetX: 8,
      targetY: 9,
      offsetTime: 10,
      object: CannonDeathObject.Gatling,
    };
    const effects: CannonDeathEffectSpawn<typeof ztime>[] = [existing];

    doGunCannonDeathEffect({ owner: TeamType.Red }, effects, false, false);

    expect(effects).toEqual([existing]);
  });

  it("ports CHowitzer DoDeathEffect as no effect for null owner", () => {
    const effects: CannonDeathEffectSpawn<{ tick: number }>[] = [];

    doHowitzerCannonDeathEffect(
      { owner: TeamType.Null },
      effects,
      true,
      true,
    );

    expect(effects).toEqual([]);
  });

  it("ports CHowitzer DoDeathEffect as upstream commented-out no-op", () => {
    const ztime = { tick: 60 };
    const existing = {
      ztime,
      startX: 11,
      startY: 12,
      targetX: 13,
      targetY: 14,
      offsetTime: 15,
      object: CannonDeathObject.Missile,
    };
    const effects: CannonDeathEffectSpawn<typeof ztime>[] = [existing];

    doHowitzerCannonDeathEffect({ owner: TeamType.Green }, effects, false, false);

    expect(effects).toEqual([existing]);
  });

  it("ports CMissileCannon DoDeathEffect as no effect for null owner", () => {
    const effects: CannonDeathEffectSpawn<{ tick: number }>[] = [];

    doMissileCannonDeathEffect(
      { owner: TeamType.Null },
      effects,
      true,
      true,
    );

    expect(effects).toEqual([]);
  });

  it("ports CMissileCannon DoDeathEffect as upstream commented-out no-op", () => {
    const ztime = { tick: 61 };
    const existing = {
      ztime,
      startX: 16,
      startY: 17,
      targetX: 18,
      targetY: 19,
      offsetTime: 20,
      object: CannonDeathObject.Howitzer,
    };
    const effects: CannonDeathEffectSpawn<typeof ztime>[] = [existing];

    doMissileCannonDeathEffect(
      { owner: TeamType.Yellow },
      effects,
      false,
      false,
    );

    expect(effects).toEqual([existing]);
  });

  it("ports CGun FireMissile as restricted sound without effect list", () => {
    const sounds: VehicleRestrictedSoundCommand[] = [];

    fireGunCannonMissile(
      {
        ztime: { tick: 55 },
        position: { x: 16, y: 24 },
        direction: 0,
        missileSpeed: 80,
        pixelWidth: 32,
        pixelHeight: 48,
      },
      null,
      100,
      120,
      sounds,
    );

    expect(sounds).toEqual([
      {
        sound: SoundEngineSound.GunFireSnd,
        x: 16,
        y: 24,
        width: 32,
        height: 48,
      },
    ]);
  });

  it("ports CGun FireMissile as light rocket spawning with gun flags", () => {
    const ztime = { tick: 55 };
    const effects: LightRocketEffectSpawn<typeof ztime>[] = [];
    const sounds: VehicleRestrictedSoundCommand[] = [];

    fireGunCannonMissile(
      {
        ztime,
        position: { x: 16, y: 24 },
        direction: 1,
        missileSpeed: 80,
        pixelWidth: 32,
        pixelHeight: 48,
      },
      effects,
      100,
      120,
      sounds,
    );

    expect(effects).toEqual([
      {
        ztime,
        startX: 45,
        startY: 26,
        targetX: 100,
        targetY: 120,
        speed: 80,
        extraSmall: 0,
        extraLarge: 1,
        extraExtraLarge: 0,
      },
    ]);
    expect(sounds).toEqual([
      {
        sound: SoundEngineSound.GunFireSnd,
        x: 16,
        y: 24,
        width: 32,
        height: 48,
      },
    ]);
  });

  it("ports CHowitzer FireMissile as render timing and restricted sound without effect list", () => {
    const sounds: VehicleRestrictedSoundCommand[] = [];
    const state = {
      ztime: { tick: 55 },
      position: { x: 16, y: 24 },
      direction: 0,
      endRenderFireTime: 0,
      renderFire: false,
      missileSpeed: 120,
      pixelWidth: 32,
      pixelHeight: 48,
    };

    fireHowitzerCannonMissile(state, 10, null, 100, 120, sounds, () => 50);

    expect(state.renderFire).toBe(true);
    expect(state.endRenderFireTime).toBeCloseTo(10.065);
    expect(sounds).toEqual([
      {
        sound: SoundEngineSound.HeavyFireSnd,
        x: 16,
        y: 24,
        width: 32,
        height: 48,
      },
    ]);
  });

  it("ports CHowitzer FireMissile as light rocket spawning with howitzer flags", () => {
    const ztime = { tick: 55 };
    const effects: LightRocketEffectSpawn<typeof ztime>[] = [];
    const sounds: VehicleRestrictedSoundCommand[] = [];
    const state = {
      ztime,
      position: { x: 16, y: 24 },
      direction: 1,
      endRenderFireTime: 0,
      renderFire: false,
      missileSpeed: 120,
      pixelWidth: 32,
      pixelHeight: 48,
    };

    fireHowitzerCannonMissile(
      state,
      10,
      effects,
      100,
      120,
      sounds,
      () => 99,
    );

    expect(state.renderFire).toBe(true);
    expect(state.endRenderFireTime).toBeCloseTo(10.0797);
    expect(effects).toEqual([
      {
        ztime,
        startX: 45,
        startY: 26,
        targetX: 100,
        targetY: 120,
        speed: 120,
        extraSmall: 1,
        extraLarge: 1,
        extraExtraLarge: 0,
      },
    ]);
    expect(sounds).toEqual([
      {
        sound: SoundEngineSound.HeavyFireSnd,
        x: 16,
        y: 24,
        width: 32,
        height: 48,
      },
    ]);
  });

  it("ports CMissileCannon FireMissile as render timing and restricted sound without effect list", () => {
    const sounds: VehicleRestrictedSoundCommand[] = [];
    const state = {
      ztime: { tick: 55 },
      position: { x: 16, y: 24 },
      direction: 0,
      endRenderFireTime: 0,
      pixelWidth: 32,
      pixelHeight: 48,
    };

    fireMissileCannonMissile(state, 10, null, 100, 120, sounds, () => 50);

    expect(state.endRenderFireTime).toBeCloseTo(10.065);
    expect(sounds).toEqual([
      {
        sound: SoundEngineSound.MomissileFireSnd,
        x: 16,
        y: 24,
        width: 32,
        height: 48,
      },
    ]);
  });

  it("ports CMissileCannon FireMissile as missile-cannon rocket spawning", () => {
    const ztime = { tick: 55 };
    const effects: MissileCannonRocketsEffectSpawn<typeof ztime>[] = [];
    const sounds: VehicleRestrictedSoundCommand[] = [];
    const state = {
      ztime,
      position: { x: 16, y: 24 },
      direction: 1,
      endRenderFireTime: 0,
      pixelWidth: 32,
      pixelHeight: 48,
    };

    fireMissileCannonMissile(
      state,
      10,
      effects,
      100,
      120,
      sounds,
      () => 99,
    );

    expect(state.endRenderFireTime).toBeCloseTo(10.0797);
    expect(effects).toEqual([
      {
        ztime,
        startX: 45,
        startY: 26,
        targetX: 100,
        targetY: 120,
      },
    ]);
    expect(sounds).toEqual([
      {
        sound: SoundEngineSound.MomissileFireSnd,
        x: 16,
        y: 24,
        width: 32,
        height: 48,
      },
    ]);
  });

  it("ports CGun FireTurrentMissile as no effect without an effect list", () => {
    const ztime = { tick: 55 };
    const state = {
      ztime,
      position: { x: 16, y: 24 },
    };

    expect(() =>
      fireGunCannonTurrentMissile(state, null, 100, 120, 3.25),
    ).not.toThrow();
  });

  it("ports CGun FireTurrentMissile as a front-inserted cannon death spawn", () => {
    const ztime = { tick: 55 };
    const existing = {
      ztime: null,
      startX: 1,
      startY: 2,
      targetX: 3,
      targetY: 4,
      offsetTime: 5,
      object: CannonDeathObject.Howitzer,
    };
    const effects: CannonDeathEffectSpawn<typeof ztime>[] = [existing];
    const state = {
      ztime,
      position: { x: 16, y: 24 },
    };

    fireGunCannonTurrentMissile(state, effects, 100, 120, 3.25);

    expect(effects).toEqual([
      {
        ztime,
        startX: 16,
        startY: 24,
        targetX: 100,
        targetY: 120,
        offsetTime: 3.25,
        object: CannonDeathObject.Gun,
      },
      existing,
    ]);
  });

  it("ports the gatling cannon unit x offset", () => {
    expect(GATLING_CANNON_UNIT_X_PIXELS).toBe(0);
  });

  it("ports the gun cannon unit x offset", () => {
    expect(GUN_CANNON_UNIT_X_PIXELS).toBe(0);
  });

  it("ports the gun cannon unit y offset", () => {
    expect(GUN_CANNON_UNIT_Y_PIXELS).toBe(0);
  });

  it("ports the howitzer cannon unit x offset", () => {
    expect(HOWITZER_CANNON_UNIT_X_PIXELS).toBe(-2);
  });

  it("ports the howitzer cannon unit y offset", () => {
    expect(HOWITZER_CANNON_UNIT_Y_PIXELS).toBe(-12);
  });

  it("ports the missile cannon unit x offset", () => {
    expect(MISSILE_CANNON_UNIT_X_PIXELS).toBe(0);
  });

  it("ports the missile cannon unit y offset", () => {
    expect(MISSILE_CANNON_UNIT_Y_PIXELS).toBe(-8);
  });

  it("ports the gatling cannon unit y offset", () => {
    expect(GATLING_CANNON_UNIT_Y_PIXELS).toBe(-7);
  });
});
