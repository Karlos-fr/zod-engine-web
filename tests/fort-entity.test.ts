import { describe, expect, it } from "vitest";
import { FortEntity } from "../src/simulation/entities/FortEntity";
import {
  BuildingType,
  PlanetType,
  TeamType,
} from "../src/simulation/SimulationConstants";

describe("fort entity", () => {
  it("ports BFort SetIsFront as front fort dimensions and production offsets", () => {
    const entity = new FortEntity({
      id: "fort-front",
      kind: "fort",
      position: { x: 100, y: 200 },
    });

    entity.setIsFront(true);

    expect(entity.isFront).toBe(true);
    expect(entity.objectId).toBe(BuildingType.FortFront);
    expect(entity.width).toBe(10);
    expect(entity.height).toBe(12);
    expect(entity.pixelWidth).toBe(160);
    expect(entity.pixelHeight).toBe(192);
    expect(entity.unitCreateX).toBe(80);
    expect(entity.unitCreateY).toBe(128);
    expect(entity.unitMoveX).toBe(80);
    expect(entity.unitMoveY).toBe(208);
    expect(entity.centerX).toBe(180);
    expect(entity.centerY).toBe(296);
  });

  it("ports BFort SetIsFront as jungle front fort height adjustment", () => {
    const entity = new FortEntity({
      id: "fort-jungle-front",
      kind: "fort",
      position: { x: 100, y: 200 },
    });
    entity.palette = PlanetType.Jungle;

    entity.setIsFront(true);

    expect(entity.objectId).toBe(BuildingType.FortFront);
    expect(entity.height).toBe(11);
    expect(entity.pixelHeight).toBe(176);
    expect(entity.centerY).toBe(288);
  });

  it("ports BFort SetIsFront as back fort dimensions and production offsets", () => {
    const entity = new FortEntity({
      id: "fort-back",
      kind: "fort",
      position: { x: 100, y: 200 },
    });

    entity.setIsFront(false);

    expect(entity.isFront).toBe(false);
    expect(entity.objectId).toBe(BuildingType.FortBack);
    expect(entity.width).toBe(10);
    expect(entity.height).toBe(11);
    expect(entity.pixelWidth).toBe(160);
    expect(entity.pixelHeight).toBe(176);
    expect(entity.unitCreateX).toBe(80);
    expect(entity.unitCreateY).toBe(32);
    expect(entity.unitMoveX).toBe(80);
    expect(entity.unitMoveY).toBe(-16);
    expect(entity.centerX).toBe(180);
    expect(entity.centerY).toBe(288);
  });

  it("ports BFort CanSetRallypoints as enabled rally points", () => {
    const entity = new FortEntity({
      id: "fort-1",
      kind: "fort",
      position: { x: 0, y: 0 },
    });

    expect(entity.canSetRallypoints()).toBe(true);
  });

  it("ports BFort ProducesUnits as enabled unit production", () => {
    const entity = new FortEntity({
      id: "fort-2",
      kind: "fort",
      position: { x: 0, y: 0 },
    });

    expect(entity.producesUnits()).toBe(true);
  });

  it("ports BFort CanEnterFort as enemy-only access for live forts", () => {
    const entity = new FortEntity({
      id: "fort-3",
      kind: "fort",
      position: { x: 0, y: 0 },
      owner: TeamType.Red,
    });
    entity.maxHealth = 100;
    entity.health = 100;

    expect(entity.canEnterFort(TeamType.Red)).toBe(false);
    expect(entity.canEnterFort(TeamType.Blue)).toBe(true);

    entity.health = 0;
    expect(entity.canEnterFort(TeamType.Blue)).toBe(false);
  });

  it("ports BFort UnderCursorCanAttack as fort body hit areas", () => {
    const entity = new FortEntity({
      id: "fort-attack",
      kind: "fort",
      position: { x: 100, y: 200 },
    });

    expect(entity.underCursorCanAttack(116, 216)).toBe(true);
    expect(entity.underCursorCanAttack(100, 248)).toBe(true);
    expect(entity.underCursorCanAttack(116, 200)).toBe(true);
    expect(entity.underCursorCanAttack(212, 200)).toBe(true);
    expect(entity.underCursorCanAttack(132, 328)).toBe(true);
    expect(entity.underCursorCanAttack(212, 328)).toBe(true);
    expect(entity.underCursorCanAttack(100, 200)).toBe(false);
  });

  it("ports BFort UnderCursorFortCanEnter as front fort entry rectangle", () => {
    const entity = new FortEntity({
      id: "fort-front-entry",
      kind: "fort",
      position: { x: 100, y: 200 },
      objectId: BuildingType.FortFront,
    });

    expect(entity.underCursorFortCanEnter(164, 232)).toBe(true);
    expect(entity.underCursorFortCanEnter(196, 328)).toBe(true);
    expect(entity.underCursorFortCanEnter(163, 232)).toBe(false);
  });

  it("ports BFort UnderCursorFortCanEnter as back fort entry rectangle", () => {
    const entity = new FortEntity({
      id: "fort-back-entry",
      kind: "fort",
      position: { x: 100, y: 200 },
      objectId: BuildingType.FortBack,
    });

    expect(entity.underCursorFortCanEnter(164, 216)).toBe(true);
    expect(entity.underCursorFortCanEnter(196, 280)).toBe(true);
    expect(entity.underCursorFortCanEnter(164, 215)).toBe(false);
  });

  it("ports BFort CannonNotPlacable as fort mount point exceptions", () => {
    const entity = new FortEntity({
      id: "fort-4",
      kind: "fort",
      position: { x: 100, y: 200 },
    });
    entity.pixelWidth = 160;
    entity.pixelHeight = 96;

    expect(
      entity.cannonNotPlacable({ left: 116, right: 132, top: 200, bottom: 216 }),
    ).toBe(false);
    expect(
      entity.cannonNotPlacable({ left: 212, right: 228, top: 248, bottom: 264 }),
    ).toBe(false);
    expect(
      entity.cannonNotPlacable({ left: 140, right: 156, top: 220, bottom: 236 }),
    ).toBe(true);
    expect(
      entity.cannonNotPlacable({ left: 300, right: 316, top: 220, bottom: 236 }),
    ).toBe(false);
  });
});
