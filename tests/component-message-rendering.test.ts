import { describe, expect, it } from "vitest";
import {
  ComponentMessage,
  MAX_RENDERABLE_STORED_GUNS,
  ZCOMP_MESSAGE_ENGINE_HEADER_GUARD_PORTED,
} from "../src/rendering/ComponentMessageRendering";

describe("component message rendering constants", () => {
  it("adapts the zcomp_message_engine.h include guard to module boundaries", async () => {
    const firstImport = await import("../src/rendering/ComponentMessageRendering");
    const secondImport = await import("../src/rendering/ComponentMessageRendering");

    expect(ZCOMP_MESSAGE_ENGINE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZCOMP_MESSAGE_ENGINE_HEADER_GUARD_PORTED).toBe(
      firstImport.ZCOMP_MESSAGE_ENGINE_HEADER_GUARD_PORTED,
    );
  });

  it("replaces the max renderable stored guns macro", () => {
    expect(MAX_RENDERABLE_STORED_GUNS).toBe(8);
  });

  it("ports component message categories", () => {
    expect(ComponentMessage.RobotManufactured).toBe(0);
    expect(ComponentMessage.VehicleManufactured).toBe(1);
    expect(ComponentMessage.GunManufactured).toBe(2);
    expect(ComponentMessage.Fort).toBe(3);
  });
});
