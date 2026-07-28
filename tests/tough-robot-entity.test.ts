import { describe, expect, it } from "vitest";
import { ToughRobotEntity } from "../src/simulation/entities/ToughRobotEntity";

describe("tough robot entity", () => {
  it("ports RTough CanPickupGrenades as disabled grenade pickup", () => {
    const entity = new ToughRobotEntity({
      id: "tough-0",
      kind: "tough",
      position: { x: 0, y: 0 },
    });

    expect(entity.canPickupGrenades()).toBe(false);
  });

  it("ports RTough CanHaveGrenades as disabled grenade inventory", () => {
    const entity = new ToughRobotEntity({
      id: "tough-1",
      kind: "tough",
      position: { x: 0, y: 0 },
    });

    expect(entity.canHaveGrenades()).toBe(false);
  });

  it("ports RTough CanThrowGrenades as disabled grenade attacks", () => {
    const entity = new ToughRobotEntity({
      id: "tough-2",
      kind: "tough",
      position: { x: 0, y: 0 },
    });

    expect(entity.canThrowGrenades()).toBe(false);
  });
});
