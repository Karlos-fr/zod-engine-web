import { describe, expect, it } from "vitest";
import { FortEntity } from "../src/simulation/entities/FortEntity";

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
});
