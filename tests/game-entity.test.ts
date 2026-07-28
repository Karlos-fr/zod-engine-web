import { describe, expect, it } from "vitest";
import { GameEntity } from "../src/simulation/entities/GameEntity";
import { TeamType } from "../src/simulation/SimulationConstants";

describe("GameEntity", () => {
  it("sets the last AI build time", () => {
    const entity = new GameEntity({
      id: "factory-1",
      kind: "factory",
      position: { x: 0, y: 0 },
    });

    entity.setLastAiBuildTime(12.5);

    expect(entity.getLastAiBuildTime()).toBe(12.5);
  });

  it("gets the initial health percentage", () => {
    const entity = new GameEntity({
      id: "tank-1",
      kind: "tank",
      position: { x: 0, y: 0 },
    });
    entity.initialHealthPercent = 75;

    expect(entity.getInitialHealthPercent()).toBe(75);
  });

  it("returns a copy of its coordinates", () => {
    const entity = new GameEntity({
      id: "robot-1",
      kind: "robot",
      position: { x: 4, y: 9 },
    });

    const coordinates = entity.getCoordinates();
    coordinates.x = 100;

    expect(entity.position).toEqual({ x: 4, y: 9 });
  });

  it("gets its attack radius", () => {
    const entity = new GameEntity({
      id: "cannon-1",
      kind: "cannon",
      position: { x: 0, y: 0 },
    });
    entity.attackRadius = 160;

    expect(entity.getAttackRadius()).toBe(160);
  });

  it("records whether it just left a cannon", () => {
    const entity = new GameEntity({
      id: "robot-2",
      kind: "robot",
      position: { x: 0, y: 0 },
    });

    entity.setJustLeftCannon(true);

    expect(entity.justLeftCannon).toBe(true);
  });

  it("returns its pixel dimensions", () => {
    const entity = new GameEntity({
      id: "building-1",
      kind: "building",
      position: { x: 0, y: 0 },
    });
    entity.pixelWidth = 64;
    entity.pixelHeight = 48;

    expect(entity.getPixelDimensions()).toEqual({ width: 64, height: 48 });
  });

  it("gets its owner team", () => {
    const entity = new GameEntity({
      id: "robot-3",
      kind: "robot",
      position: { x: 0, y: 0 },
      owner: TeamType.Blue,
    });

    expect(entity.getOwner()).toBe(TeamType.Blue);
  });
});
