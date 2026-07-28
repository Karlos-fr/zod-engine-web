import { describe, expect, it } from "vitest";
import {
  BAR_Y_SHIFT,
  BAR_YELLOW_RED,
  BAR_RED,
  BAR_GREEN_RED,
  BAR_X_SHIFT,
  DOT_COUNT,
  ENTITY_PI_SHIFT_RADIANS,
  GLVL,
  HOVER_NAME_Y_SHIFT,
  MAX_BAR_DISTANCE,
  MAX_UNITS_PER_TYPE,
  MIN_STAMINA,
  Z_EPSILON,
  Z_FINE_EPSILON,
} from "../src/simulation/entities/EntityConstants";

describe("entity constants", () => {
  it("ports the maximum units in one type", () => {
    expect(MAX_UNITS_PER_TYPE).toBe(7);
  });

  it("ports the upstream glvl threshold", () => {
    expect(GLVL).toBe(170);
  });

  it("ports the minimum stamina threshold", () => {
    expect(MIN_STAMINA).toBe(0.3);
  });

  it("ports the local z epsilon", () => {
    expect(Z_EPSILON).toBe(0.00001);
  });

  it("ports the finer local z epsilon", () => {
    expect(Z_FINE_EPSILON).toBe(0.000001);
  });

  it("ports the entity bar vertical shift", () => {
    expect(BAR_Y_SHIFT).toBe(-8);
  });

  it("ports the entity bar horizontal shift", () => {
    expect(BAR_X_SHIFT).toBe(-3);
  });

  it("ports the entity bar red channel", () => {
    expect(BAR_RED).toBe(0);
  });

  it("ports the hovered entity name vertical shift", () => {
    expect(HOVER_NAME_Y_SHIFT).toBe(-19);
  });

  it("ports the entity indicator dot count", () => {
    expect(DOT_COUNT).toBe(10);
  });

  it("ports the entity indicator angular spacing", () => {
    expect(ENTITY_PI_SHIFT_RADIANS).toBeCloseTo(0.1570795);
  });

  it("ports the maximum entity bar distance", () => {
    expect(MAX_BAR_DISTANCE).toBe(36);
  });

  it("ports the yellow entity bar red channel", () => {
    expect(BAR_YELLOW_RED).toBe(247);
  });

  it("ports the green entity bar red channel", () => {
    expect(BAR_GREEN_RED).toBe(82);
  });
});
