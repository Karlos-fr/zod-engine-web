import { describe, expect, it } from "vitest";
import {
  GATLING_CANNON_UNIT_X_PIXELS,
  GATLING_CANNON_UNIT_Y_PIXELS,
} from "../src/simulation/entities/CannonTypes";

describe("cannon types", () => {
  it("ports the gatling cannon unit x offset", () => {
    expect(GATLING_CANNON_UNIT_X_PIXELS).toBe(0);
  });

  it("ports the gatling cannon unit y offset", () => {
    expect(GATLING_CANNON_UNIT_Y_PIXELS).toBe(-7);
  });
});
