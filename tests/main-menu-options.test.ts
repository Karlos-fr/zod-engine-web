import { describe, expect, it } from "vitest";
import { ZGMM_OPTIONS_HEADER_GUARD_PORTED } from "../src/ui/MainMenuOptions";

describe("main menu options", () => {
  it("adapts the gmm_options.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/ui/MainMenuOptions");
    const secondImport = await import("../src/ui/MainMenuOptions");

    expect(ZGMM_OPTIONS_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZGMM_OPTIONS_HEADER_GUARD_PORTED).toBe(
      firstImport.ZGMM_OPTIONS_HEADER_GUARD_PORTED,
    );
  });
});
