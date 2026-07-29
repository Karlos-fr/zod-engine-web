import { describe, expect, it } from "vitest";
import { FortEntity } from "../src/simulation/entities/FortEntity";
import { TeamType } from "../src/simulation/SimulationConstants";

describe("fort entity", () => {
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
