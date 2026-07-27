import { describe, expect, it } from "vitest";
import {
  MAIN_OPTIONS_HEADER_GUARD_PORTED,
  XGETOPT_HEADER_GUARD_PORTED,
} from "../src/app/MainOptions";

describe("main options", () => {
  it("adapts the main.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/app/MainOptions");
    const secondImport = await import("../src/app/MainOptions");

    expect(MAIN_OPTIONS_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.MAIN_OPTIONS_HEADER_GUARD_PORTED).toBe(
      firstImport.MAIN_OPTIONS_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the xgetopt.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/app/MainOptions");
    const secondImport = await import("../src/app/MainOptions");

    expect(XGETOPT_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.XGETOPT_HEADER_GUARD_PORTED).toBe(
      firstImport.XGETOPT_HEADER_GUARD_PORTED,
    );
  });
});
