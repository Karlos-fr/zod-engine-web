import { describe, expect, it } from "vitest";
import {
  APC_TURRET_FRAME_INTERVAL_SECONDS,
  CRANE_HOOK_FRAME_INTERVAL_SECONDS,
  CRANE_TURRET_FRAME_INTERVAL_SECONDS,
  VAPC_HEADER_GUARD_PORTED,
  VCRANE_HEADER_GUARD_PORTED,
} from "../src/simulation/entities/VehicleTypes";

describe("vehicle types", () => {
  it("ports the APC turret animation interval", () => {
    expect(APC_TURRET_FRAME_INTERVAL_SECONDS).toBe(0.2);
  });

  it("ports the crane hook animation interval", () => {
    expect(CRANE_HOOK_FRAME_INTERVAL_SECONDS).toBe(0.7);
  });

  it("ports the crane turret animation interval", () => {
    expect(CRANE_TURRET_FRAME_INTERVAL_SECONDS).toBe(1.0);
  });

  it("adapts the vapc header guard to module boundaries", async () => {
    const firstImport = await import("../src/simulation/entities/VehicleTypes");
    const secondImport = await import("../src/simulation/entities/VehicleTypes");

    expect(VAPC_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.VAPC_HEADER_GUARD_PORTED).toBe(
      firstImport.VAPC_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the vcrane header guard to module boundaries", async () => {
    const firstImport = await import("../src/simulation/entities/VehicleTypes");
    const secondImport = await import("../src/simulation/entities/VehicleTypes");

    expect(VCRANE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.VCRANE_HEADER_GUARD_PORTED).toBe(
      firstImport.VCRANE_HEADER_GUARD_PORTED,
    );
  });
});
