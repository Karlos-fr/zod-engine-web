import { describe, expect, it } from "vitest";
import {
  APC_TURRET_FRAME_INTERVAL_SECONDS,
  CRANE_HOOK_FRAME_INTERVAL_SECONDS,
  CRANE_TURRET_FRAME_INTERVAL_SECONDS,
  HEAVY_TURRET_FRAME_INTERVAL_SECONDS,
  JEEP_BASE_FRAME_INTERVAL_SECONDS,
  JEEP_TURRET_FRAME_INTERVAL_SECONDS,
  LIGHT_TURRET_FRAME_INTERVAL_SECONDS,
  MEDIUM_LID_RENDER_OFFSET_X_PIXELS,
  MEDIUM_LID_RENDER_OFFSET_Y_PIXELS,
  MEDIUM_TURRET_FRAME_INTERVAL_SECONDS,
  MISSILE_LAUNCHER_TURRET_FRAME_INTERVAL_SECONDS,
  VAPC_HEADER_GUARD_PORTED,
  VCRANE_HEADER_GUARD_PORTED,
  VHEAVY_HEADER_GUARD_PORTED,
  VJEEP_HEADER_GUARD_PORTED,
  VLIGHT_HEADER_GUARD_PORTED,
  VMEDIUM_HEADER_GUARD_PORTED,
  VMISSILE_LAUNCHER_HEADER_GUARD_PORTED,
  ZVEHICLE_HEADER_GUARD_PORTED,
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

  it("ports the heavy vehicle turret animation interval", () => {
    expect(HEAVY_TURRET_FRAME_INTERVAL_SECONDS).toBe(1.0);
  });

  it("ports the light vehicle turret animation interval", () => {
    expect(LIGHT_TURRET_FRAME_INTERVAL_SECONDS).toBe(1.0);
  });

  it("ports the medium vehicle turret animation interval", () => {
    expect(MEDIUM_TURRET_FRAME_INTERVAL_SECONDS).toBe(1.0);
  });

  it("ports the missile launcher turret animation interval", () => {
    expect(MISSILE_LAUNCHER_TURRET_FRAME_INTERVAL_SECONDS).toBe(1.0);
  });

  it("ports the medium vehicle lid render horizontal offset", () => {
    expect(MEDIUM_LID_RENDER_OFFSET_X_PIXELS).toBe(12);
  });

  it("ports the medium vehicle lid render vertical offset", () => {
    expect(MEDIUM_LID_RENDER_OFFSET_Y_PIXELS).toBe(-5);
  });

  it("ports the jeep turret animation interval", () => {
    expect(JEEP_TURRET_FRAME_INTERVAL_SECONDS).toBe(1.0);
  });

  it("ports the jeep base animation interval", () => {
    expect(JEEP_BASE_FRAME_INTERVAL_SECONDS).toBe(0.25);
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

  it("adapts the vheavy header guard to module boundaries", async () => {
    const firstImport = await import("../src/simulation/entities/VehicleTypes");
    const secondImport = await import("../src/simulation/entities/VehicleTypes");

    expect(VHEAVY_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.VHEAVY_HEADER_GUARD_PORTED).toBe(
      firstImport.VHEAVY_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the vjeep header guard to module boundaries", async () => {
    const firstImport = await import("../src/simulation/entities/VehicleTypes");
    const secondImport = await import("../src/simulation/entities/VehicleTypes");

    expect(VJEEP_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.VJEEP_HEADER_GUARD_PORTED).toBe(
      firstImport.VJEEP_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the vlight header guard to module boundaries", async () => {
    const firstImport = await import("../src/simulation/entities/VehicleTypes");
    const secondImport = await import("../src/simulation/entities/VehicleTypes");

    expect(VLIGHT_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.VLIGHT_HEADER_GUARD_PORTED).toBe(
      firstImport.VLIGHT_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the vmedium header guard to module boundaries", async () => {
    const firstImport = await import("../src/simulation/entities/VehicleTypes");
    const secondImport = await import("../src/simulation/entities/VehicleTypes");

    expect(VMEDIUM_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.VMEDIUM_HEADER_GUARD_PORTED).toBe(
      firstImport.VMEDIUM_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the vmissilelauncher header guard to module boundaries", async () => {
    const firstImport = await import("../src/simulation/entities/VehicleTypes");
    const secondImport = await import("../src/simulation/entities/VehicleTypes");

    expect(VMISSILE_LAUNCHER_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.VMISSILE_LAUNCHER_HEADER_GUARD_PORTED).toBe(
      firstImport.VMISSILE_LAUNCHER_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the zvehicle header guard to module boundaries", async () => {
    const firstImport = await import("../src/simulation/entities/VehicleTypes");
    const secondImport = await import("../src/simulation/entities/VehicleTypes");

    expect(ZVEHICLE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZVEHICLE_HEADER_GUARD_PORTED).toBe(
      firstImport.ZVEHICLE_HEADER_GUARD_PORTED,
    );
  });
});
