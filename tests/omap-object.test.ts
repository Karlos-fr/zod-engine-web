import { describe, expect, it } from "vitest";
import {
  ObjectMapObject,
  OMAP_OBJECT_HEADER_GUARD_PORTED,
} from "../src/world/OMapObject";

describe("object map object", () => {
  it("adapts the omapobject header guard to module boundaries", async () => {
    const firstImport = await import("../src/world/OMapObject");
    const secondImport = await import("../src/world/OMapObject");

    expect(OMAP_OBJECT_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.OMAP_OBJECT_HEADER_GUARD_PORTED).toBe(
      firstImport.OMAP_OBJECT_HEADER_GUARD_PORTED,
    );
  });

  it("ports OMapObject IsDestroyableImpass as true", () => {
    expect(new ObjectMapObject().isDestroyableImpassable()).toBe(true);
  });
});
