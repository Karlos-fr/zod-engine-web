import { describe, expect, it } from "vitest";
import { ZGMM_WARNING_HEADER_GUARD_PORTED } from "../src/ui/MainMenuWarning";

describe("main menu warning", () => {
  it("adapts the gmm_warning.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/ui/MainMenuWarning");
    const secondImport = await import("../src/ui/MainMenuWarning");

    expect(ZGMM_WARNING_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZGMM_WARNING_HEADER_GUARD_PORTED).toBe(
      firstImport.ZGMM_WARNING_HEADER_GUARD_PORTED,
    );
  });
});
