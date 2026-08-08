import { describe, expect, it } from "vitest";
import {
  initRocketsObjectImage,
  OROCKETS_HEADER_GUARD_PORTED,
  processRocketsObject,
  renderRocketsObject,
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

  it("replaces ORockets DoRender with a map-relative rocket pickup command", () => {
    const renderImage = { id: "rockets" };
    const calls: unknown[] = [];

    const command = renderRocketsObject(
      {
        renderImage,
        position: { x: 64, y: 96 },
      },
      {
        renderZSurface: (surface, x, y) => {
          calls.push({ surface, x, y });
          return { surface, x: x - 12, y: y - 20 };
        },
      },
    );

    expect(command).toEqual({
      surface: renderImage,
      x: 52,
      y: 76,
    });
    expect(calls).toEqual([{ surface: renderImage, x: 64, y: 96 }]);
  });

  it("replaces ORockets DoRender as no command without a loaded image", () => {
    expect(
      renderRocketsObject(
        {
          renderImage: null,
          position: { x: 0, y: 0 },
        },
        {
          renderZSurface: () => {
            throw new Error("renderZSurface should not be called");
          },
        },
      ),
    ).toBeNull();
  });

  it("ports ORockets Process as a no-op result", () => {
    expect(processRocketsObject()).toBe(0);
  });

  it("ports ORockets SetOwner as an ownership no-op", () => {
    expect(setRocketsObjectOwner(2)).toBeUndefined();
  });
});
