import { describe, expect, it } from "vitest";
import type { BridgeTurrentEffectSpawn } from "../src/simulation/BridgeTurretEffect";
import {
  BuildingType,
  PlanetType,
  TeamType,
} from "../src/simulation/SimulationConstants";
import {
  BridgeEntity,
  renderBridgeBase,
  type BridgeRenderMap,
  type BridgeRenderState,
  initBridgePlanetTemplates,
} from "../src/simulation/entities/BridgeEntity";

type BridgeRenderImage = { name: string };

function createBridgeRenderState(
  overrides: Partial<BridgeRenderState<BridgeRenderImage>> = {},
): BridgeRenderState<BridgeRenderImage> {
  return {
    position: { x: 48, y: 80 },
    health: 80,
    maxHealth: 100,
    dontStamp: false,
    doRerender: false,
    doBaseRerender: true,
    renderImage: { name: "bridge-base" },
    renderDamagedImage: { name: "bridge-damaged" },
    renderDestroyedImage: { name: "bridge-destroyed" },
    ...overrides,
  };
}

describe("bridge entity", () => {
  it("ports BBridge Init as bridge planet template loading", () => {
    const loaded: string[] = [];
    const templates = Array.from({ length: PlanetType.Max }, () => ({
      loadBaseImage: (filename: string) => loaded.push(filename),
    }));

    initBridgePlanetTemplates(templates);

    expect(loaded).toEqual([
      "assets/planets/bridge_desert.png",
      "assets/planets/bridge_volcanic.png",
      "assets/planets/bridge_arctic.png",
      "assets/planets/bridge_jungle.png",
      "assets/planets/bridge_city.png",
    ]);
  });

  it("ports BBridge GetExtraLinks as extra bridge link count", () => {
    const bridge = new BridgeEntity({
      id: "bridge-1",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    bridge.extraLinks = 3;

    expect(bridge.getExtraLinks()).toBe(3);
  });

  it("ports BBridge ChangePalette as palette update with rerender invalidation", () => {
    const bridge = new BridgeEntity({
      id: "bridge-palette",
      kind: "building",
      position: { x: 0, y: 0 },
    });

    bridge.changePalette(PlanetType.Desert);
    expect(bridge.palette).toBe(PlanetType.Desert);
    expect(bridge.doRerender).toBe(false);

    bridge.changePalette(PlanetType.Arctic);
    expect(bridge.palette).toBe(PlanetType.Arctic);
    expect(bridge.doRerender).toBe(true);
  });

  it("ports BBridge SetOwner as null-team ownership", () => {
    const bridge = new BridgeEntity({
      id: "bridge-2",
      kind: "building",
      position: { x: 0, y: 0 },
      owner: TeamType.Red,
    });

    bridge.setOwner(TeamType.Blue);

    expect(bridge.owner).toBe(TeamType.Null);
  });

  it("replaces BBridge UnRenderImages as render cache unload and invalidation", () => {
    const bridge = new BridgeEntity({
      id: "bridge-unrender",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    const unloaded: string[] = [];
    bridge.renderImage = { unload: () => unloaded.push("render") };
    bridge.renderDamagedImage = { unload: () => unloaded.push("damaged") };
    bridge.renderDestroyedImage = { unload: () => unloaded.push("destroyed") };
    bridge.doRerender = false;

    bridge.unRenderImages();

    expect(unloaded).toEqual(["render", "damaged", "destroyed"]);
    expect(bridge.doRerender).toBe(true);
  });

  it("replaces BBridge IndividualReRender by allocating a missing render surface", () => {
    const bridge = new BridgeEntity({
      id: "bridge-rerender-missing",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    bridge.pixelWidth = 80;
    bridge.pixelHeight = 64;
    const loaded: Array<{ width: number; height: number }> = [];
    const surface = {
      getBaseSurface: () => null,
      loadNewSurface: (width: number, height: number) =>
        loaded.push({ width, height }),
    };

    bridge.individualReRender(surface);

    expect(loaded).toEqual([{ width: 80, height: 64 }]);
  });

  it("replaces BBridge IndividualReRender by resizing mismatched render surfaces", () => {
    const bridge = new BridgeEntity({
      id: "bridge-rerender-resize",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    bridge.pixelWidth = 96;
    bridge.pixelHeight = 48;
    const loaded: Array<{ width: number; height: number }> = [];
    const surface = {
      getBaseSurface: () => ({ w: 80, h: 48 }),
      loadNewSurface: (width: number, height: number) =>
        loaded.push({ width, height }),
    };

    bridge.individualReRender(surface);

    expect(loaded).toEqual([{ width: 96, height: 48 }]);
  });

  it("keeps BBridge IndividualReRender render surface when dimensions already match", () => {
    const bridge = new BridgeEntity({
      id: "bridge-rerender-match",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    bridge.pixelWidth = 96;
    bridge.pixelHeight = 48;
    const loaded: Array<{ width: number; height: number }> = [];
    const surface = {
      getBaseSurface: () => ({ width: 96, height: 48 }),
      loadNewSurface: (width: number, height: number) =>
        loaded.push({ width, height }),
    };

    bridge.individualReRender(surface);

    expect(loaded).toEqual([]);
  });

  it("ports BBridge GetCraneCenter as the bridge pixel center", () => {
    const bridge = new BridgeEntity({
      id: "bridge-3",
      kind: "building",
      position: { x: 48, y: 80 },
    });
    bridge.pixelWidth = 64;
    bridge.pixelHeight = 32;

    expect(bridge.getCraneCenter()).toEqual({
      hasCenter: true,
      x: 80,
      y: 96,
    });
  });

  it("ports BBridge GetCraneEntrance for vertical bridge endpoints", () => {
    const bridge = new BridgeEntity({
      id: "bridge-crane-vertical",
      kind: "building",
      position: { x: 48, y: 80 },
    });
    bridge.isVertical = true;
    bridge.pixelHeight = 96;

    expect(bridge.getCraneEntrance()).toEqual({
      canEnter: true,
      x: 80,
      y: 48,
      exitX: 80,
      exitY: 208,
    });
  });

  it("ports BBridge GetCraneEntrance for horizontal bridge endpoints", () => {
    const bridge = new BridgeEntity({
      id: "bridge-crane-horizontal",
      kind: "building",
      position: { x: 48, y: 80 },
    });
    bridge.isVertical = false;
    bridge.pixelWidth = 112;

    expect(bridge.getCraneEntrance()).toEqual({
      canEnter: true,
      x: 17,
      y: 111,
      exitX: 192,
      exitY: 112,
    });
  });

  it("ports BBridge ResetStats for vertical bridge dimensions", () => {
    const bridge = new BridgeEntity({
      id: "bridge-reset-vertical",
      kind: "building",
      position: { x: 32, y: 48 },
    });
    bridge.extraLinks = 2;
    bridge.isVertical = true;

    bridge.resetStats();

    expect(bridge.width).toBe(4);
    expect(bridge.height).toBe(7);
    expect(bridge.objectId).toBe(BuildingType.BridgeVertical);
    expect(bridge.pixelWidth).toBe(64);
    expect(bridge.pixelHeight).toBe(112);
    expect(bridge.centerX).toBe(64);
    expect(bridge.centerY).toBe(104);
  });

  it("ports BBridge ResetStats for horizontal bridge dimensions", () => {
    const bridge = new BridgeEntity({
      id: "bridge-reset-horizontal",
      kind: "building",
      position: { x: 32, y: 48 },
    });
    bridge.extraLinks = 3;
    bridge.isVertical = false;

    bridge.resetStats();

    expect(bridge.width).toBe(8);
    expect(bridge.height).toBe(4);
    expect(bridge.objectId).toBe(BuildingType.BridgeHorizontal);
    expect(bridge.pixelWidth).toBe(128);
    expect(bridge.pixelHeight).toBe(64);
    expect(bridge.centerX).toBe(96);
    expect(bridge.centerY).toBe(80);
  });

  it("keeps BBridge SetIsVertical unchanged when orientation is already selected", () => {
    const bridge = new BridgeEntity({
      id: "bridge-set-vertical-noop",
      kind: "building",
      position: { x: 32, y: 48 },
    });
    bridge.isVertical = false;
    bridge.doRerender = false;
    bridge.width = 9;
    bridge.height = 9;

    bridge.setIsVertical(false);

    expect(bridge.isVertical).toBe(false);
    expect(bridge.doRerender).toBe(false);
    expect(bridge.width).toBe(9);
    expect(bridge.height).toBe(9);
  });

  it("ports BBridge SetIsVertical as orientation update and stat reset", () => {
    const bridge = new BridgeEntity({
      id: "bridge-set-vertical",
      kind: "building",
      position: { x: 32, y: 48 },
    });
    bridge.extraLinks = 1;

    bridge.setIsVertical(true);

    expect(bridge.isVertical).toBe(true);
    expect(bridge.doRerender).toBe(true);
    expect(bridge.width).toBe(4);
    expect(bridge.height).toBe(6);
    expect(bridge.objectId).toBe(BuildingType.BridgeVertical);
    expect(bridge.pixelWidth).toBe(64);
    expect(bridge.pixelHeight).toBe(96);
    expect(bridge.centerX).toBe(64);
    expect(bridge.centerY).toBe(96);
  });

  it("keeps BBridge SetExtraLinks unchanged when link count is already selected", () => {
    const bridge = new BridgeEntity({
      id: "bridge-set-extra-links-noop",
      kind: "building",
      position: { x: 32, y: 48 },
    });
    bridge.extraLinks = 2;
    bridge.doRerender = false;
    bridge.width = 9;
    bridge.height = 9;

    bridge.setExtraLinks(2);

    expect(bridge.extraLinks).toBe(2);
    expect(bridge.doRerender).toBe(false);
    expect(bridge.width).toBe(9);
    expect(bridge.height).toBe(9);
  });

  it("ports BBridge SetExtraLinks as link count update and stat reset", () => {
    const bridge = new BridgeEntity({
      id: "bridge-set-extra-links",
      kind: "building",
      position: { x: 32, y: 48 },
    });

    bridge.setExtraLinks(2);

    expect(bridge.extraLinks).toBe(2);
    expect(bridge.doRerender).toBe(true);
    expect(bridge.width).toBe(7);
    expect(bridge.height).toBe(4);
    expect(bridge.objectId).toBe(BuildingType.BridgeHorizontal);
    expect(bridge.pixelWidth).toBe(112);
    expect(bridge.pixelHeight).toBe(64);
    expect(bridge.centerX).toBe(88);
    expect(bridge.centerY).toBe(80);
  });

  it("ports BBridge DoTurrentEffect for vertical bridge spans", () => {
    const bridge = new BridgeEntity({
      id: "bridge-vertical-effects",
      kind: "building",
      position: { x: 100, y: 200 },
    });
    bridge.pixelHeight = 50;
    bridge.palette = PlanetType.Volcanic;
    bridge.isVertical = true;
    const effects: BridgeTurrentEffectSpawn[] = [];
    const randomValues = [2, 7, 4, 1, 3];

    bridge.doTurrentEffect(true, effects, (maxExclusive) => {
      expect(maxExclusive === 10 || maxExclusive === 32).toBe(true);
      const value = randomValues.shift();
      if (value === undefined) throw new Error("unexpected random call");
      return value;
    });

    expect(effects).toEqual([
      {
        x: 123,
        y: 223,
        palette: PlanetType.Volcanic,
        width: 140,
        height: 140,
        isReversed: true,
      },
      {
        x: 117,
        y: 232,
        palette: PlanetType.Volcanic,
        width: 140,
        height: 140,
        isReversed: true,
      },
    ]);
    expect(randomValues).toEqual([]);
  });

  it("ports BBridge DoTurrentEffect for horizontal bridge spans", () => {
    const bridge = new BridgeEntity({
      id: "bridge-horizontal-effects",
      kind: "building",
      position: { x: 40, y: 80 },
    });
    bridge.pixelWidth = 50;
    bridge.palette = PlanetType.Arctic;
    bridge.isVertical = false;
    const effects: BridgeTurrentEffectSpawn[] = [];
    const randomValues = [3, 5, 4, 12, 6];

    bridge.doTurrentEffect(false, effects, (maxExclusive) => {
      expect(maxExclusive === 10 || maxExclusive === 32).toBe(true);
      const value = randomValues.shift();
      if (value === undefined) throw new Error("unexpected random call");
      return value;
    });

    expect(effects).toEqual([
      {
        x: 64,
        y: 101,
        palette: PlanetType.Arctic,
        width: 140,
        height: 140,
        isReversed: false,
      },
      {
        x: 73,
        y: 108,
        palette: PlanetType.Arctic,
        width: 140,
        height: 140,
        isReversed: false,
      },
    ]);
    expect(randomValues).toEqual([]);
  });

  it("ports BBridge DoExplosions as non-reversed turret effects", () => {
    const bridge = new BridgeEntity({
      id: "bridge-explosions",
      kind: "building",
      position: { x: 40, y: 80 },
    });
    bridge.pixelWidth = 50;
    bridge.palette = PlanetType.City;
    const effects: BridgeTurrentEffectSpawn[] = [];
    const randomValues = [3, 5, 4, 12, 6];

    bridge.doExplosions(effects, (maxExclusive) => {
      expect(maxExclusive === 10 || maxExclusive === 32).toBe(true);
      const value = randomValues.shift();
      if (value === undefined) throw new Error("unexpected random call");
      return value;
    });

    expect(effects).toEqual([
      {
        x: 64,
        y: 101,
        palette: PlanetType.City,
        width: 140,
        height: 140,
        isReversed: false,
      },
      {
        x: 73,
        y: 108,
        palette: PlanetType.City,
        width: 140,
        height: 140,
        isReversed: false,
      },
    ]);
    expect(randomValues).toEqual([]);
  });

  it("ports BBridge DoDeathEffect as explosions plus base rerender invalidation", () => {
    const bridge = new BridgeEntity({
      id: "bridge-death",
      kind: "building",
      position: { x: 40, y: 80 },
    });
    bridge.pixelWidth = 50;
    bridge.palette = PlanetType.Jungle;
    const effects: BridgeTurrentEffectSpawn[] = [];
    const randomValues = [3, 5, 4, 12, 6];

    bridge.doDeathEffect(true, true, effects, (maxExclusive) => {
      expect(maxExclusive === 10 || maxExclusive === 32).toBe(true);
      const value = randomValues.shift();
      if (value === undefined) throw new Error("unexpected random call");
      return value;
    });

    expect(bridge.doBaseRerender).toBe(true);
    expect(effects).toEqual([
      {
        x: 64,
        y: 101,
        palette: PlanetType.Jungle,
        width: 140,
        height: 140,
        isReversed: false,
      },
      {
        x: 73,
        y: 108,
        palette: PlanetType.Jungle,
        width: 140,
        height: 140,
        isReversed: false,
      },
    ]);
    expect(randomValues).toEqual([]);
  });

  it("ports BBridge Process as half-health explosion transition", () => {
    const bridge = new BridgeEntity({
      id: "bridge-process-half-health",
      kind: "building",
      position: { x: 40, y: 80 },
    });
    bridge.pixelWidth = 50;
    bridge.palette = PlanetType.City;
    bridge.maxHealth = 100;
    bridge.lastProcessHealth = 50;
    bridge.health = 49;
    const effects: BridgeTurrentEffectSpawn[] = [];
    const randomValues = [3, 5, 4, 12, 6];

    const result = bridge.process(10, effects, (maxExclusive) => {
      expect(maxExclusive === 10 || maxExclusive === 32).toBe(true);
      const value = randomValues.shift();
      if (value === undefined) throw new Error("unexpected random call");
      return value;
    });

    expect(result).toBe(1);
    expect(bridge.lastProcessHealth).toBe(49);
    expect(bridge.doBaseRerender).toBe(true);
    expect(effects).toEqual([
      {
        x: 64,
        y: 101,
        palette: PlanetType.City,
        width: 140,
        height: 140,
        isReversed: false,
      },
      {
        x: 73,
        y: 108,
        palette: PlanetType.City,
        width: 140,
        height: 140,
        isReversed: false,
      },
    ]);
    expect(randomValues).toEqual([]);
  });

  it("ports BBridge Process as health bookkeeping without death explosion", () => {
    const bridge = new BridgeEntity({
      id: "bridge-process-zero-health",
      kind: "building",
      position: { x: 40, y: 80 },
    });
    bridge.pixelWidth = 50;
    bridge.maxHealth = 100;
    bridge.lastProcessHealth = 50;
    bridge.health = 0;
    const effects: BridgeTurrentEffectSpawn[] = [];

    expect(bridge.process(10, effects)).toBe(1);

    expect(bridge.lastProcessHealth).toBe(0);
    expect(bridge.doBaseRerender).toBe(false);
    expect(effects).toEqual([]);
  });

  it("ports BBridge Process as delayed revive rerender completion", () => {
    const bridge = new BridgeEntity({
      id: "bridge-process-revive",
      kind: "building",
      position: { x: 40, y: 80 },
    });
    bridge.doReviveRerender = true;
    bridge.nextReviveRerenderTime = 12;

    bridge.process(11.99);

    expect(bridge.doReviveRerender).toBe(true);
    expect(bridge.doBaseRerender).toBe(false);

    bridge.process(12);

    expect(bridge.doReviveRerender).toBe(false);
    expect(bridge.doBaseRerender).toBe(true);
  });

  it("ports BBridge DoReviveEffect as revive rerender scheduling plus reversed effects", () => {
    const bridge = new BridgeEntity({
      id: "bridge-revive",
      kind: "building",
      position: { x: 40, y: 80 },
    });
    bridge.pixelWidth = 50;
    bridge.palette = PlanetType.Desert;
    const effects: BridgeTurrentEffectSpawn[] = [];
    const randomValues = [3, 5, 4, 12, 6];

    bridge.doReviveEffect(20, effects, (maxExclusive) => {
      expect(maxExclusive === 10 || maxExclusive === 32).toBe(true);
      const value = randomValues.shift();
      if (value === undefined) throw new Error("unexpected random call");
      return value;
    });

    expect(bridge.doReviveRerender).toBe(true);
    expect(bridge.nextReviveRerenderTime).toBe(22.25);
    expect(effects).toEqual([
      {
        x: 64,
        y: 101,
        palette: PlanetType.Desert,
        width: 140,
        height: 140,
        isReversed: true,
      },
      {
        x: 73,
        y: 108,
        palette: PlanetType.Desert,
        width: 140,
        height: 140,
        isReversed: true,
      },
    ]);
    expect(randomValues).toEqual([]);
  });

  it("keeps BBridge DoTurrentEffect safe when no effect list is attached", () => {
    const bridge = new BridgeEntity({
      id: "bridge-no-effects",
      kind: "building",
      position: { x: 10, y: 20 },
    });
    bridge.pixelWidth = 55;
    const randomValues = [0, 1, 2, 3];

    bridge.doTurrentEffect(false, null, (maxExclusive) => {
      expect(maxExclusive).toBe(10);
      const value = randomValues.shift();
      if (value === undefined) throw new Error("unexpected random call");
      return value;
    });

    expect(randomValues).toEqual([]);
  });

  it("ports BBridge ImpassCenter for vertical bridge center tiles", () => {
    const bridge = new BridgeEntity({
      id: "bridge-vertical-impass-center",
      kind: "building",
      position: { x: 32, y: 48 },
    });
    bridge.isVertical = true;
    bridge.width = 4;
    bridge.height = 3;
    const calls: Array<[number, number, boolean | undefined]> = [];

    bridge.impassCenter(
      {
        setImpassable: (x, y, impassable) => calls.push([x, y, impassable]),
      },
      true,
    );

    expect(calls).toEqual([
      [3, 3, true],
      [4, 3, true],
      [3, 4, true],
      [4, 4, true],
      [3, 5, true],
      [4, 5, true],
    ]);
  });

  it("ports BBridge ImpassCenter for horizontal bridge center tiles", () => {
    const bridge = new BridgeEntity({
      id: "bridge-horizontal-impass-center",
      kind: "building",
      position: { x: 32, y: 48 },
    });
    bridge.isVertical = false;
    bridge.width = 3;
    bridge.height = 4;
    const calls: Array<[number, number, boolean | undefined]> = [];

    bridge.impassCenter(
      {
        setImpassable: (x, y, impassable) => calls.push([x, y, impassable]),
      },
      false,
    );

    expect(calls).toEqual([
      [2, 4, false],
      [2, 5, false],
      [3, 4, false],
      [3, 5, false],
      [4, 4, false],
      [4, 5, false],
    ]);
  });

  it("ports BBridge SetMapImpassables for vertical bridge edge rails", () => {
    const bridge = new BridgeEntity({
      id: "bridge-set-map-vertical",
      kind: "building",
      position: { x: 32, y: 48 },
    });
    bridge.isVertical = true;
    bridge.width = 4;
    bridge.height = 3;
    const calls: Array<[number, number]> = [];

    bridge.setMapImpassables({
      setImpassable: (x, y) => calls.push([x, y]),
    });

    expect(calls).toEqual([
      [2, 3],
      [5, 3],
      [2, 4],
      [5, 4],
      [2, 5],
      [5, 5],
    ]);
  });

  it("ports BBridge SetMapImpassables for horizontal bridge edge rails", () => {
    const bridge = new BridgeEntity({
      id: "bridge-set-map-horizontal",
      kind: "building",
      position: { x: 32, y: 48 },
    });
    bridge.isVertical = false;
    bridge.width = 3;
    bridge.height = 4;
    const calls: Array<[number, number]> = [];

    bridge.setMapImpassables({
      setImpassable: (x, y) => calls.push([x, y]),
    });

    expect(calls).toEqual([
      [2, 3],
      [2, 6],
      [3, 3],
      [3, 6],
      [4, 3],
      [4, 6],
    ]);
  });

  it("ports BBridge SetDestroyMapImpassables by marking bridge center tiles", () => {
    const bridge = new BridgeEntity({
      id: "bridge-set-destroy-impassables",
      kind: "building",
      position: { x: 32, y: 48 },
    });
    bridge.isVertical = false;
    bridge.width = 2;
    bridge.height = 4;
    const calls: Array<[number, number, boolean | undefined]> = [];

    bridge.setDestroyMapImpassables({
      setImpassable: (x, y, impassable) => calls.push([x, y, impassable]),
    });

    expect(calls).toEqual([
      [2, 4, true],
      [2, 5, true],
      [3, 4, true],
      [3, 5, true],
    ]);
  });

  it("ports BBridge UnSetDestroyMapImpassables by clearing bridge center tiles", () => {
    const bridge = new BridgeEntity({
      id: "bridge-unset-destroy-impassables",
      kind: "building",
      position: { x: 32, y: 48 },
    });
    bridge.isVertical = false;
    bridge.width = 2;
    bridge.height = 4;
    const calls: Array<[number, number, boolean | undefined]> = [];

    bridge.unsetDestroyMapImpassables({
      setImpassable: (x, y, impassable) => calls.push([x, y, impassable]),
    });

    expect(calls).toEqual([
      [2, 4, false],
      [2, 5, false],
      [3, 4, false],
      [3, 5, false],
    ]);
  });

  it("ports BBridge UnderCursorCanAttack as true when destroyed", () => {
    const bridge = new BridgeEntity({
      id: "bridge-attack-destroyed",
      kind: "building",
      position: { x: 32, y: 48 },
    });
    bridge.setDestroyed(true);

    expect(bridge.underCursorCanAttack(1000, 1000)).toBe(true);
  });

  it("ports BBridge UnderCursorCanAttack for vertical edge sections", () => {
    const bridge = new BridgeEntity({
      id: "bridge-attack-vertical",
      kind: "building",
      position: { x: 32, y: 48 },
    });
    bridge.isVertical = true;
    bridge.pixelHeight = 96;

    expect(bridge.underCursorCanAttack(32, 48)).toBe(true);
    expect(bridge.underCursorCanAttack(48, 144)).toBe(true);
    expect(bridge.underCursorCanAttack(80, 80)).toBe(true);
    expect(bridge.underCursorCanAttack(96, 144)).toBe(true);
    expect(bridge.underCursorCanAttack(64, 80)).toBe(false);
  });

  it("ports BBridge UnderCursorCanAttack for horizontal edge sections", () => {
    const bridge = new BridgeEntity({
      id: "bridge-attack-horizontal",
      kind: "building",
      position: { x: 32, y: 48 },
    });
    bridge.isVertical = false;
    bridge.pixelWidth = 112;

    expect(bridge.underCursorCanAttack(32, 48)).toBe(true);
    expect(bridge.underCursorCanAttack(144, 64)).toBe(true);
    expect(bridge.underCursorCanAttack(32, 96)).toBe(true);
    expect(bridge.underCursorCanAttack(144, 112)).toBe(true);
    expect(bridge.underCursorCanAttack(64, 80)).toBe(false);
  });

  it("replaces BBridge DoRender by rerendering and stamping the healthy bridge image", () => {
    const state = createBridgeRenderState({ doRerender: true });
    const rerenders: string[] = [];
    const stampCalls: Array<{ x: number; y: number; surface: BridgeRenderImage }> =
      [];
    const map: BridgeRenderMap<BridgeRenderImage> = {
      permStamp(x, y, surface) {
        stampCalls.push({ x, y, surface });
        return true;
      },
      renderZSurface() {
        throw new Error("renderZSurface should not be called");
      },
    };

    expect(renderBridgeBase(state, map, () => rerenders.push("rerender"))).toBeNull();

    expect(rerenders).toEqual(["rerender"]);
    expect(stampCalls).toEqual([
      { x: 48, y: 80, surface: { name: "bridge-base" } },
    ]);
    expect(state.doBaseRerender).toBe(false);
  });

  it("keeps BBridge DoRender base rerender pending when permanent stamping fails", () => {
    const state = createBridgeRenderState();
    const map: BridgeRenderMap<BridgeRenderImage> = {
      permStamp() {
        return false;
      },
      renderZSurface() {
        throw new Error("renderZSurface should not be called");
      },
    };

    expect(renderBridgeBase(state, map)).toBeNull();

    expect(state.doBaseRerender).toBe(true);
  });

  it("replaces BBridge DoRender by rendering the damaged bridge image when stamping is disabled", () => {
    const state = createBridgeRenderState({
      health: 49,
      dontStamp: true,
    });
    const map: BridgeRenderMap<BridgeRenderImage> = {
      permStamp() {
        throw new Error("permStamp should not be called");
      },
      renderZSurface(surface, x, y, renderHit, aboutCenter) {
        return { surface, x, y, renderHit, aboutCenter };
      },
    };

    expect(renderBridgeBase(state, map)).toEqual({
      surface: { name: "bridge-damaged" },
      x: 48,
      y: 80,
      renderHit: false,
      aboutCenter: false,
    });
    expect(state.doBaseRerender).toBe(true);
  });

  it("replaces BBridge DoRender by rendering the destroyed bridge image", () => {
    const state = createBridgeRenderState({
      health: 0,
      dontStamp: true,
    });
    const map: BridgeRenderMap<BridgeRenderImage> = {
      permStamp() {
        throw new Error("permStamp should not be called");
      },
      renderZSurface(surface, x, y, renderHit, aboutCenter) {
        return { surface, x, y, renderHit, aboutCenter };
      },
    };

    expect(renderBridgeBase(state, map)).toEqual({
      surface: { name: "bridge-destroyed" },
      x: 48,
      y: 80,
      renderHit: false,
      aboutCenter: false,
    });
  });

  it("replaces BBridge DoRender as no command when the selected image is missing", () => {
    const state = createBridgeRenderState({
      health: 49,
      renderDamagedImage: null,
      dontStamp: true,
    });
    const map: BridgeRenderMap<BridgeRenderImage> = {
      permStamp() {
        throw new Error("permStamp should not be called");
      },
      renderZSurface() {
        throw new Error("renderZSurface should not be called");
      },
    };

    expect(renderBridgeBase(state, map)).toBeNull();
  });
});
