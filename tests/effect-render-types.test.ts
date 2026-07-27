import { describe, expect, it } from "vitest";
import { CraneConstructionRenderItem } from "../src/rendering/EffectRenderTypes";

describe("effect render types", () => {
  it("replaces crane construction render-item identifiers", () => {
    expect(CraneConstructionRenderItem.Concrete).toBe(0);
    expect(CraneConstructionRenderItem.ConeVariant0).toBe(1);
    expect(CraneConstructionRenderItem.ConeVariant1).toBe(2);
    expect(CraneConstructionRenderItem.Jack).toBe(3);
    expect(CraneConstructionRenderItem.Paper).toBe(4);
    expect(CraneConstructionRenderItem.Sign).toBe(5);
    expect(CraneConstructionRenderItem.Count).toBe(6);
  });
});
