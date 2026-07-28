import { describe, expect, it } from "vitest";
import {
  canCannonSetWaypoints,
  CGATLING_HEADER_GUARD_PORTED,
  CGUN_HEADER_GUARD_PORTED,
  CHOWITZER_HEADER_GUARD_PORTED,
  CMISSILECANNON_HEADER_GUARD_PORTED,
  GATLING_CANNON_UNIT_X_PIXELS,
  GATLING_CANNON_UNIT_Y_PIXELS,
  GUN_CANNON_UNIT_X_PIXELS,
  GUN_CANNON_UNIT_Y_PIXELS,
  HOWITZER_CANNON_UNIT_X_PIXELS,
  HOWITZER_CANNON_UNIT_Y_PIXELS,
  MISSILE_CANNON_UNIT_X_PIXELS,
  MISSILE_CANNON_UNIT_Y_PIXELS,
  ZCANNON_HEADER_GUARD_PORTED,
} from "../src/simulation/entities/CannonTypes";

describe("cannon types", () => {
  it("adapts the cgatling header guard to module boundaries", async () => {
    const firstImport = await import("../src/simulation/entities/CannonTypes");
    const secondImport = await import("../src/simulation/entities/CannonTypes");

    expect(CGATLING_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.CGATLING_HEADER_GUARD_PORTED).toBe(
      firstImport.CGATLING_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the cgun header guard to module boundaries", async () => {
    const firstImport = await import("../src/simulation/entities/CannonTypes");
    const secondImport = await import("../src/simulation/entities/CannonTypes");

    expect(CGUN_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.CGUN_HEADER_GUARD_PORTED).toBe(
      firstImport.CGUN_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the chowitzer header guard to module boundaries", async () => {
    const firstImport = await import("../src/simulation/entities/CannonTypes");
    const secondImport = await import("../src/simulation/entities/CannonTypes");

    expect(CHOWITZER_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.CHOWITZER_HEADER_GUARD_PORTED).toBe(
      firstImport.CHOWITZER_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the cmissilecannon header guard to module boundaries", async () => {
    const firstImport = await import("../src/simulation/entities/CannonTypes");
    const secondImport = await import("../src/simulation/entities/CannonTypes");

    expect(CMISSILECANNON_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.CMISSILECANNON_HEADER_GUARD_PORTED).toBe(
      firstImport.CMISSILECANNON_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the zcannon header guard to module boundaries", async () => {
    const firstImport = await import("../src/simulation/entities/CannonTypes");
    const secondImport = await import("../src/simulation/entities/CannonTypes");

    expect(ZCANNON_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZCANNON_HEADER_GUARD_PORTED).toBe(
      firstImport.ZCANNON_HEADER_GUARD_PORTED,
    );
  });

  it("ports ZCannon CanSetWaypoints as enabled waypoint orders", () => {
    expect(canCannonSetWaypoints()).toBe(true);
  });

  it("ports the gatling cannon unit x offset", () => {
    expect(GATLING_CANNON_UNIT_X_PIXELS).toBe(0);
  });

  it("ports the gun cannon unit x offset", () => {
    expect(GUN_CANNON_UNIT_X_PIXELS).toBe(0);
  });

  it("ports the gun cannon unit y offset", () => {
    expect(GUN_CANNON_UNIT_Y_PIXELS).toBe(0);
  });

  it("ports the howitzer cannon unit x offset", () => {
    expect(HOWITZER_CANNON_UNIT_X_PIXELS).toBe(-2);
  });

  it("ports the howitzer cannon unit y offset", () => {
    expect(HOWITZER_CANNON_UNIT_Y_PIXELS).toBe(-12);
  });

  it("ports the missile cannon unit x offset", () => {
    expect(MISSILE_CANNON_UNIT_X_PIXELS).toBe(0);
  });

  it("ports the missile cannon unit y offset", () => {
    expect(MISSILE_CANNON_UNIT_Y_PIXELS).toBe(-8);
  });

  it("ports the gatling cannon unit y offset", () => {
    expect(GATLING_CANNON_UNIT_Y_PIXELS).toBe(-7);
  });
});
