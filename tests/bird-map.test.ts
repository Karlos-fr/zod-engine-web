import { describe, expect, it } from "vitest";
import {
  ABIRD_HEADER_GUARD_PORTED,
  AMBIENT_BIRD_SQUARE_TILES_PER_BIRD,
  BIRD_MAP_PADDING_PIXELS,
} from "../src/world/BirdMap";

describe("bird map", () => {
  it("ports the abird.h header guard as module traceability", async () => {
    const firstImport = await import("../src/world/BirdMap");
    const secondImport = await import("../src/world/BirdMap");

    expect(ABIRD_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ABIRD_HEADER_GUARD_PORTED).toBe(
      firstImport.ABIRD_HEADER_GUARD_PORTED,
    );
  });

  it("ports the square-tile budget per ambient bird", () => {
    expect(AMBIENT_BIRD_SQUARE_TILES_PER_BIRD).toBe(650);
  });

  it("ports the bird map padding", () => {
    expect(BIRD_MAP_PADDING_PIXELS).toBe(160);
  });
});
