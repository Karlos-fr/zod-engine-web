import { describe, expect, it } from "vitest";
import { GameEntity } from "../src/simulation/entities/GameEntity";
import { JeepVehicleEntity } from "../src/simulation/entities/JeepVehicleEntity";

describe("jeep vehicle entity", () => {
  it("ports VJeep SetAttackObject as target assignment and render-fire reset", () => {
    const jeep = new JeepVehicleEntity({
      id: "jeep-1",
      kind: "vehicle",
      position: { x: 0, y: 0 },
    });
    const target = new GameEntity({
      id: "target-1",
      kind: "robot",
      position: { x: 10, y: 10 },
    });

    jeep.setAttackObject(target);
    expect(jeep.attackObject).toBe(target);

    jeep.renderFire = true;
    jeep.setAttackObject(null);

    expect(jeep.attackObject).toBeNull();
    expect(jeep.renderFire).toBe(false);
  });
});
