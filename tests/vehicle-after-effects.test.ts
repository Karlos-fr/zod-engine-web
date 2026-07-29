import { describe, expect, it } from "vitest";
import {
  doApcAfterEffects,
  doCraneAfterEffects,
  doHeavyAfterEffects,
  doJeepAfterEffects,
  doLightAfterEffects,
  doMediumAfterEffects,
  doMissileLauncherAfterEffects,
} from "../src/simulation/VehicleAfterEffects";

describe("vehicle after effects", () => {
  it("ports VAPC DoAfterEffects as an empty post-render hook", () => {
    const map = { touched: false };
    const destination = { drawCalls: 0 };

    expect(doApcAfterEffects(map, destination, 14, 28)).toBeUndefined();
    expect(map).toEqual({ touched: false });
    expect(destination).toEqual({ drawCalls: 0 });
  });

  it("ports VCrane DoAfterEffects as an empty post-render hook", () => {
    const map = { touched: false };
    const destination = { drawCalls: 0 };

    expect(doCraneAfterEffects(map, destination, 10, 20)).toBeUndefined();
    expect(map).toEqual({ touched: false });
    expect(destination).toEqual({ drawCalls: 0 });
  });

  it("ports VHeavy DoAfterEffects as an empty post-render hook", () => {
    const map = { touched: false };
    const destination = { drawCalls: 0 };

    expect(doHeavyAfterEffects(map, destination, 6, 18)).toBeUndefined();
    expect(map).toEqual({ touched: false });
    expect(destination).toEqual({ drawCalls: 0 });
  });

  it("ports VJeep DoAfterEffects as an empty post-render hook", () => {
    const map = { touched: false };
    const destination = { drawCalls: 0 };

    expect(doJeepAfterEffects(map, destination, 12, 24)).toBeUndefined();
    expect(map).toEqual({ touched: false });
    expect(destination).toEqual({ drawCalls: 0 });
  });

  it("ports VLight DoAfterEffects as an empty post-render hook", () => {
    const map = { touched: false };
    const destination = { drawCalls: 0 };

    expect(doLightAfterEffects(map, destination, 8, 16)).toBeUndefined();
    expect(map).toEqual({ touched: false });
    expect(destination).toEqual({ drawCalls: 0 });
  });

  it("ports VMedium DoAfterEffects as an empty post-render hook", () => {
    const map = { touched: false };
    const destination = { drawCalls: 0 };

    expect(doMediumAfterEffects(map, destination, 4, 12)).toBeUndefined();
    expect(map).toEqual({ touched: false });
    expect(destination).toEqual({ drawCalls: 0 });
  });

  it("ports VMissileLauncher DoAfterEffects as an empty post-render hook", () => {
    const map = { touched: false };
    const destination = { drawCalls: 0 };

    expect(doMissileLauncherAfterEffects(map, destination, 2, 10)).toBeUndefined();
    expect(map).toEqual({ touched: false });
    expect(destination).toEqual({ drawCalls: 0 });
  });
});
