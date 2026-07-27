import { describe, expect, it } from "vitest";
import {
  AHUTANIMAL_HEADER_GUARD_PORTED,
  HUT_ANIMAL_STATE_COUNT,
  HUT_ANIMAL_TYPE_COUNT,
  type HutAnimalHomeCoordsState,
  type HutAnimalHomeState,
  HutAnimalState,
  HutAnimalType,
  isHutAnimalGoingHome,
  setHutAnimalHomeCoords,
} from "../src/simulation/entities/HutAnimalTypes";

describe("hut animal types", () => {
  it("ports the ahutanimal.h header guard as module traceability", async () => {
    const firstImport = await import(
      "../src/simulation/entities/HutAnimalTypes"
    );
    const secondImport = await import(
      "../src/simulation/entities/HutAnimalTypes"
    );

    expect(AHUTANIMAL_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.AHUTANIMAL_HEADER_GUARD_PORTED).toBe(
      firstImport.AHUTANIMAL_HEADER_GUARD_PORTED,
    );
  });

  it("ports hut_animal_type with upstream enum ordinals", () => {
    expect(HutAnimalType.GreenSnake).toBe(0);
    expect(HutAnimalType.GreenLizard).toBe(1);
    expect(HutAnimalType.DesertRabbit).toBe(2);
    expect(HutAnimalType.Raptor).toBe(3);
    expect(HutAnimalType.MiniRaptor).toBe(4);
    expect(HutAnimalType.PigDino).toBe(5);
    expect(HutAnimalType.YellowWorm).toBe(6);
    expect(HutAnimalType.ArcticRabbit).toBe(7);
    expect(HutAnimalType.Penguin).toBe(8);
    expect(HutAnimalType.WhiteWolf).toBe(9);
    expect(HutAnimalType.Ostrich).toBe(10);
    expect(HutAnimalType.Rat).toBe(11);
    expect(HutAnimalType.Turtle).toBe(12);
    expect(HutAnimalType.RedWorm).toBe(13);
    expect(HutAnimalType.GreenEyedFox).toBe(14);
  });

  it("ports MAX_HUT_ANIMAL_TYPES as the hut animal type count", () => {
    expect(HUT_ANIMAL_TYPE_COUNT).toBe(15);
  });

  it("ports hut_animal_state with upstream enum ordinals", () => {
    expect(HutAnimalState.Nothing).toBe(0);
    expect(HutAnimalState.Walking).toBe(1);
    expect(HutAnimalState.Looking).toBe(2);
  });

  it("ports MAX_HA_STATES as the hut animal state count", () => {
    expect(HUT_ANIMAL_STATE_COUNT).toBe(3);
  });

  it("ports IsGoingHome as a hut animal home-state accessor", () => {
    const goingHome: HutAnimalHomeState = { goingHome: true };
    const wandering: HutAnimalHomeState = { goingHome: false };

    expect(isHutAnimalGoingHome(goingHome)).toBe(true);
    expect(isHutAnimalGoingHome(wandering)).toBe(false);
  });

  it("ports SetHomeCoords as a hut animal home-coordinate replacement", () => {
    const state: HutAnimalHomeCoordsState = { homeX: 4, homeY: 8 };

    const nextState = setHutAnimalHomeCoords(state, 12, 16);

    expect(nextState).toEqual({ homeX: 12, homeY: 16 });
    expect(state).toEqual({ homeX: 4, homeY: 8 });
  });
});
