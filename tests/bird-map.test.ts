import { describe, expect, it } from "vitest";
import { BIRD_MAP_PADDING_PIXELS } from "../src/world/BirdMap";

describe("bird map", () => {
  it("ports the bird map padding", () => {
    expect(BIRD_MAP_PADDING_PIXELS).toBe(160);
  });
});
