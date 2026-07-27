import { describe, expect, it } from "vitest";
import { ZGMM_MULTIPLAYER_HEADER_GUARD_PORTED } from "../src/ui/MainMenuMultiplayer";

describe("main menu multiplayer", () => {
  it("adapts the gmm_multiplayer.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/ui/MainMenuMultiplayer");
    const secondImport = await import("../src/ui/MainMenuMultiplayer");

    expect(ZGMM_MULTIPLAYER_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZGMM_MULTIPLAYER_HEADER_GUARD_PORTED).toBe(
      firstImport.ZGMM_MULTIPLAYER_HEADER_GUARD_PORTED,
    );
  });
});
