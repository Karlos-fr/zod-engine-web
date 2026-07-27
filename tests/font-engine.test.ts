import { describe, expect, it } from "vitest";
import {
  FONT_MAX_CHARACTERS,
  ZFONT_ENGINE_HEADER_GUARD_PORTED,
  ZFONT_HEADER_GUARD_PORTED,
} from "../src/rendering/FontEngine";

describe("font engine", () => {
  it("adapts the zfont.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/rendering/FontEngine");
    const secondImport = await import("../src/rendering/FontEngine");

    expect(ZFONT_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZFONT_HEADER_GUARD_PORTED).toBe(
      firstImport.ZFONT_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the upstream max character slot", () => {
    expect(FONT_MAX_CHARACTERS).toBe(255);
  });

  it("adapts the zfont_engine.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/rendering/FontEngine");
    const secondImport = await import("../src/rendering/FontEngine");

    expect(ZFONT_ENGINE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZFONT_ENGINE_HEADER_GUARD_PORTED).toBe(
      firstImport.ZFONT_ENGINE_HEADER_GUARD_PORTED,
    );
  });
});
