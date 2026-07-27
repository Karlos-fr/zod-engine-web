import { describe, expect, it } from "vitest";
import { EMAP_OBJECT_TURRENT_HEADER_GUARD_PORTED } from "../src/world/MapObjectTurretEffect";

describe("map object turret effect", () => {
  it("adapts the emapobjectturrent header guard to module boundaries", async () => {
    const firstImport = await import("../src/world/MapObjectTurretEffect");
    const secondImport = await import("../src/world/MapObjectTurretEffect");

    expect(EMAP_OBJECT_TURRENT_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.EMAP_OBJECT_TURRENT_HEADER_GUARD_PORTED).toBe(
      firstImport.EMAP_OBJECT_TURRENT_HEADER_GUARD_PORTED,
    );
  });
});
