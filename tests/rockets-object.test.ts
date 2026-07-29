import { describe, expect, it } from "vitest";
import {
  initRocketsObjectImage,
  OROCKETS_HEADER_GUARD_PORTED,
  processRocketsObject,
  ROCKETS_OBJECT_IMAGE_PATH,
  setRocketsObjectOwner,
} from "../src/simulation/RocketsObject";

describe("rockets object", () => {
  it("adapts the orockets.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/RocketsObject");
    const secondImport = await import("../src/simulation/RocketsObject");

    expect(OROCKETS_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.OROCKETS_HEADER_GUARD_PORTED).toBe(
      firstImport.OROCKETS_HEADER_GUARD_PORTED,
    );
  });

  it("ports ORockets Init as rocket pickup image loading", () => {
    const state = { renderImage: null as { id: string } | null };
    const loadedPaths: string[] = [];

    initRocketsObjectImage(state, (path) => {
      loadedPaths.push(path);
      return { id: path };
    });

    expect(loadedPaths).toEqual([ROCKETS_OBJECT_IMAGE_PATH]);
    expect(state.renderImage).toEqual({ id: ROCKETS_OBJECT_IMAGE_PATH });
  });

  it("ports ORockets Process as a no-op result", () => {
    expect(processRocketsObject()).toBe(0);
  });

  it("ports ORockets SetOwner as an ownership no-op", () => {
    expect(setRocketsObjectOwner(2)).toBeUndefined();
  });
});
