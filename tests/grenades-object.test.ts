import { describe, expect, it } from "vitest";
import {
  GRENADES_OBJECT_IMAGE_PATH,
  GRENADES_MISSILE_MAX_HORIZONTAL_SPREAD_PIXELS,
  GRENADES_MISSILE_MAX_VERTICAL_SPREAD_PIXELS,
  getGrenadesObjectAmount,
  initGrenadesObjectImage,
  OGRENADES_HEADER_GUARD_PORTED,
  processGrenadesObject,
  setGrenadesObjectAmount,
  setGrenadesObjectOwner,
} from "../src/simulation/GrenadesObject";

describe("grenades object", () => {
  it("adapts the ogrenades.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/GrenadesObject");
    const secondImport = await import("../src/simulation/GrenadesObject");

    expect(OGRENADES_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.OGRENADES_HEADER_GUARD_PORTED).toBe(
      firstImport.OGRENADES_HEADER_GUARD_PORTED,
    );
  });

  it("ports missile spread limits for spawned grenade missiles", () => {
    expect(GRENADES_MISSILE_MAX_HORIZONTAL_SPREAD_PIXELS).toBe(130);
    expect(GRENADES_MISSILE_MAX_VERTICAL_SPREAD_PIXELS).toBe(130);
  });

  it("ports SetGrenadeAmount as grenade pickup inventory assignment", () => {
    const state = { grenadeAmount: 0 };

    setGrenadesObjectAmount(state, 6);

    expect(state.grenadeAmount).toBe(6);
  });

  it("ports GetGrenadeAmount as grenade pickup inventory read", () => {
    const state = { grenadeAmount: 6 };

    expect(getGrenadesObjectAmount(state)).toBe(6);
  });

  it("ports OGrenades Init as grenade pickup image loading", () => {
    const state = { renderImage: null as { id: string } | null };
    const loadedPaths: string[] = [];

    initGrenadesObjectImage(state, (path) => {
      loadedPaths.push(path);
      return { id: path };
    });

    expect(loadedPaths).toEqual([GRENADES_OBJECT_IMAGE_PATH]);
    expect(state.renderImage).toEqual({ id: GRENADES_OBJECT_IMAGE_PATH });
  });

  it("ports OGrenades Process as a no-op result", () => {
    expect(processGrenadesObject()).toBe(0);
  });

  it("ports OGrenades SetOwner as an ownership no-op", () => {
    expect(setGrenadesObjectOwner(2)).toBeUndefined();
  });
});
