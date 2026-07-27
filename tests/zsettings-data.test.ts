import { describe, expect, it } from "vitest";
import {
  GLOBAL_SETTINGS_READ_BUFFER_SIZE,
  RUN_PAST_RADIUS,
  ZSETTINGS_HEADER_GUARD_PORTED,
} from "../src/data/ZSettingsData";

describe("z settings data", () => {
  it("ports the run past radius", () => {
    expect(RUN_PAST_RADIUS).toBe(1.3);
  });

  it("ports the global settings read buffer size", () => {
    expect(GLOBAL_SETTINGS_READ_BUFFER_SIZE).toBe(500);
  });

  it("adapts the zsettings header guard to module boundaries", async () => {
    const firstImport = await import("../src/data/ZSettingsData");
    const secondImport = await import("../src/data/ZSettingsData");

    expect(ZSETTINGS_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZSETTINGS_HEADER_GUARD_PORTED).toBe(
      firstImport.ZSETTINGS_HEADER_GUARD_PORTED,
    );
  });
});
