import { describe, expect, it } from "vitest";
import type { BridgeTurrentEffectSpawn } from "../src/simulation/BridgeTurretEffect";
import {
  BuildingType,
  PlanetType,
  TeamType,
} from "../src/simulation/SimulationConstants";
import {
  BridgeEntity,
  initBridgePlanetTemplates,
} from "../src/simulation/entities/BridgeEntity";

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
});
