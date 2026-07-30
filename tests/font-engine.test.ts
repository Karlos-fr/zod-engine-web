import { describe, expect, it } from "vitest";
import {
  FONT_MAX_CHARACTERS,
  FontType,
  type FontState,
  initFont,
  setFontType,
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

  it("ports font atlas types", () => {
    expect(FontType.BigWhite).toBe(0);
    expect(FontType.SmallWhite).toBe(1);
    expect(FontType.GreenBuilding).toBe(2);
    expect(FontType.LoadingWhite).toBe(3);
    expect(FontType.YellowMenu).toBe(4);
    expect(FontType.MaxFontTypes).toBe(5);
  });

  it("ports ZFont SetType as font atlas type assignment", () => {
    const state: FontState = { type: FontType.BigWhite };

    setFontType(state, FontType.YellowMenu);

    expect(state.type).toBe(FontType.YellowMenu);
  });

  it("ports ZFont Init as character image loading for the selected atlas", () => {
    const state: FontState = { type: FontType.GreenBuilding };
    const loadedFilenames: string[] = [];

    initFont(state, (filename) => {
      loadedFilenames.push(filename);
      return { filename };
    });

    expect(state.finishedInit).toBe(true);
    expect(state.charImages).toHaveLength(FONT_MAX_CHARACTERS);
    expect(loadedFilenames).toHaveLength(FONT_MAX_CHARACTERS);
    expect(loadedFilenames[0]).toBe(
      "assets/fonts/green_building/char_000.png",
    );
    expect(loadedFilenames[254]).toBe(
      "assets/fonts/green_building/char_254.png",
    );
    expect(state.charImages?.[0]).toEqual({
      filename: "assets/fonts/green_building/char_000.png",
    });
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
