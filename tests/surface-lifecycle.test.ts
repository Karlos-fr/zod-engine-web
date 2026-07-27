import { describe, expect, it } from "vitest";
import { freeSdlSurface } from "../src/rendering/SurfaceLifecycle";

describe("surface lifecycle", () => {
  it("replaces ZSDL_FreeSurface by disposing and clearing the reference", () => {
    const released: string[] = [];
    const surface = { current: { id: "surface-1" } };

    freeSdlSurface(surface, (value) => {
      released.push(value.id);
    });

    expect(released).toEqual(["surface-1"]);
    expect(surface.current).toBeNull();
  });

  it("does nothing for an empty surface reference", () => {
    const released: string[] = [];
    const surface = { current: null as { id: string } | null };

    freeSdlSurface(surface, (value) => {
      released.push(value.id);
    });

    expect(released).toEqual([]);
    expect(surface.current).toBeNull();
  });
});
