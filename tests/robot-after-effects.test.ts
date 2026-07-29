import { describe, expect, it } from "vitest";
import {
  doGruntAfterEffects,
  doLaserAfterEffects,
  doPsychoAfterEffects,
  doPyroAfterEffects,
  doSniperAfterEffects,
  doToughAfterEffects,
} from "../src/simulation/RobotAfterEffects";

describe("robot after effects", () => {
  it("ports RGrunt DoAfterEffects as an empty post-render hook", () => {
    const map = { touched: false };
    const destination = { drawCalls: 0 };

    expect(doGruntAfterEffects(map, destination, 12, 24)).toBeUndefined();
    expect(map).toEqual({ touched: false });
    expect(destination).toEqual({ drawCalls: 0 });
  });

  it("ports RLaser DoAfterEffects as an empty post-render hook", () => {
    const map = { touched: false };
    const destination = { drawCalls: 0 };

    expect(doLaserAfterEffects(map, destination, 8, 16)).toBeUndefined();
    expect(map).toEqual({ touched: false });
    expect(destination).toEqual({ drawCalls: 0 });
  });

  it("ports RPsycho DoAfterEffects as an empty post-render hook", () => {
    const map = { touched: false };
    const destination = { drawCalls: 0 };

    expect(doPsychoAfterEffects(map, destination, 4, 12)).toBeUndefined();
    expect(map).toEqual({ touched: false });
    expect(destination).toEqual({ drawCalls: 0 });
  });

  it("ports RPyro DoAfterEffects as an empty post-render hook", () => {
    const map = { touched: false };
    const destination = { drawCalls: 0 };

    expect(doPyroAfterEffects(map, destination, 2, 6)).toBeUndefined();
    expect(map).toEqual({ touched: false });
    expect(destination).toEqual({ drawCalls: 0 });
  });

  it("ports RSniper DoAfterEffects as an empty post-render hook", () => {
    const map = { touched: false };
    const destination = { drawCalls: 0 };

    expect(doSniperAfterEffects(map, destination, 1, 3)).toBeUndefined();
    expect(map).toEqual({ touched: false });
    expect(destination).toEqual({ drawCalls: 0 });
  });

  it("ports RTough DoAfterEffects as an empty post-render hook", () => {
    const map = { touched: false };
    const destination = { drawCalls: 0 };

    expect(doToughAfterEffects(map, destination, 0, 1)).toBeUndefined();
    expect(map).toEqual({ touched: false });
    expect(destination).toEqual({ drawCalls: 0 });
  });
});
