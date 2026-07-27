import { describe, expect, it } from "vitest";
import { MAX_RENDERABLE_STORED_GUNS } from "../src/rendering/ComponentMessageRendering";

describe("component message rendering constants", () => {
  it("replaces the max renderable stored guns macro", () => {
    expect(MAX_RENDERABLE_STORED_GUNS).toBe(8);
  });
});
