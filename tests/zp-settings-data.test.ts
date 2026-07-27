import { describe, expect, it } from "vitest";
import {
  PLAYER_SETTINGS_READ_BUFFER_SIZE,
  ZPSETTINGS_HEADER_GUARD_PORTED,
} from "../src/data/ZPSettingsData";

describe("zp settings data", () => {
  it("ports the player settings read buffer size", () => {
    expect(PLAYER_SETTINGS_READ_BUFFER_SIZE).toBe(500);
  });

  it("adapts the zpsettings header guard to module boundaries", async () => {
    const firstImport = await import("../src/data/ZPSettingsData");
    const secondImport = await import("../src/data/ZPSettingsData");

    expect(ZPSETTINGS_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZPSETTINGS_HEADER_GUARD_PORTED).toBe(
      firstImport.ZPSETTINGS_HEADER_GUARD_PORTED,
    );
  });
});
