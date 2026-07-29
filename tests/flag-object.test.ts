import { describe, expect, it } from "vitest";
import { MapObjectType } from "../src/world/MapFormat";
import { BuildingType, CannonType } from "../src/simulation/SimulationConstants";
import {
  FLAG_ANIMATION_INTERVAL_SECONDS,
  flagHasRadar,
  OFLAG_HEADER_GUARD_PORTED,
  processFlagObject,
  type FlagConnectedObject,
  type FlagProcessState,
} from "../src/simulation/FlagObject";

describe("flag object", () => {
  it("adapts the oflag.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/FlagObject");
    const secondImport = await import("../src/simulation/FlagObject");

    expect(OFLAG_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.OFLAG_HEADER_GUARD_PORTED).toBe(firstImport.OFLAG_HEADER_GUARD_PORTED);
  });

  it("ports int_time as the flag animation frame interval", () => {
    expect(FLAG_ANIMATION_INTERVAL_SECONDS).toBe(0.2);
  });

  it("keeps the flag frame unchanged before the animation interval", () => {
    const state: FlagProcessState = {
      lastProcessTime: 10,
      flagIndex: 2,
    };

    expect(processFlagObject(state, 10.199)).toBe(1);
    expect(state).toEqual({
      lastProcessTime: 10,
      flagIndex: 2,
    });
  });

  it("advances the flag frame at the animation interval", () => {
    const state: FlagProcessState = {
      lastProcessTime: 0,
      flagIndex: 2,
    };

    expect(processFlagObject(state, FLAG_ANIMATION_INTERVAL_SECONDS)).toBe(1);

    expect(state.lastProcessTime).toBe(FLAG_ANIMATION_INTERVAL_SECONDS);
    expect(state.flagIndex).toBe(3);
  });

  it("wraps the flag frame after the fourth frame", () => {
    const state: FlagProcessState = {
      lastProcessTime: 0,
      flagIndex: 3,
    };

    expect(processFlagObject(state, FLAG_ANIMATION_INTERVAL_SECONDS)).toBe(1);

    expect(state.lastProcessTime).toBe(FLAG_ANIMATION_INTERVAL_SECONDS);
    expect(state.flagIndex).toBe(0);
  });

  it("reports no radar when the flag has no connected objects", () => {
    expect(flagHasRadar([])).toBe(false);
  });

  it("ignores connected objects that are not radar buildings", () => {
    const connectedObjects: FlagConnectedObject[] = [
      {
        getObjectId: () => ({
          objectType: MapObjectType.Building,
          objectId: BuildingType.Repair,
        }),
      },
      {
        getObjectId: () => ({
          objectType: MapObjectType.Cannon,
          objectId: CannonType.Gatling,
        }),
      },
    ];

    expect(flagHasRadar(connectedObjects)).toBe(false);
  });

  it("ports OFlag HasRadar by detecting a connected radar building", () => {
    const connectedObjects: FlagConnectedObject[] = [
      {
        getObjectId: () => ({
          objectType: MapObjectType.Cannon,
          objectId: CannonType.Gatling,
        }),
      },
      {
        getObjectId: () => ({
          objectType: MapObjectType.Building,
          objectId: BuildingType.Radar,
        }),
      },
    ];

    expect(flagHasRadar(connectedObjects)).toBe(true);
  });
});
