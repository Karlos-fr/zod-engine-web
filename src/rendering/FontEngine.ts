/**
 * Upstream: zfont.h / zfont_engine.h
 */

/**
 * Port of upstream `_ZFONT_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: zfont.h:2
 */
export const ZFONT_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `MAX_CHARACTERS`.
 * Role: Defines the highest character slot available to the font renderer.
 * Upstream: zfont.h:6
 */
export const FONT_MAX_CHARACTERS = 255;

/**
 * Port of upstream `font_type`.
 * Role: Identifies the font atlas for text rendering.
 * Upstream: zfont.h:8-13
 */
export enum FontType {
  BigWhite = 0,
  SmallWhite = 1,
  GreenBuilding = 2,
  LoadingWhite = 3,
  YellowMenu = 4,
  MaxFontTypes = 5,
}

const FONT_TYPE_ASSET_NAMES: readonly string[] = [
  "big_white",
  "small_white",
  "green_building",
  "loading_white",
  "yellow_menu",
];

/**
 * Port of upstream `ZFont::type`.
 * Role: Holds the selected font atlas type.
 * Upstream: zfont.h:20
 */
export type FontState = {
  type: FontType | number;
  charImages?: Array<unknown | null>;
  finishedInit?: boolean;
};

/**
 * Minimal state consumed by ported `ZFontEngine::Init`.
 * Role: Stores the per-atlas font instances initialized by the font engine.
 * Upstream: zfont_engine.h:12, zfont_engine.cpp:14-17
 */
export type FontEngineState = {
  fonts: FontState[];
};

export type FontImageLoader = (filename: string) => unknown | null;

/**
 * Port of upstream `ZFont::SetType`.
 * Role: Stores the selected font atlas type.
 * Upstream: zfont.cpp:73-76
 */
export function setFontType(state: FontState, type: FontType | number): void {
  state.type = type;
}

/**
 * Port of upstream `ZFont::Init`.
 * Role: Loads all character images for the selected font atlas.
 * Upstream: zfont.cpp:8-23
 */
export function initFont(state: FontState, loadImage: FontImageLoader): void {
  const fontTypeName =
    FONT_TYPE_ASSET_NAMES[state.type as FontType] ?? String(state.type);

  state.charImages = Array.from({ length: FONT_MAX_CHARACTERS }, (_, index) =>
    loadImage(
      `assets/fonts/${fontTypeName}/char_${index.toString().padStart(3, "0")}.png`,
    ),
  );
  state.finishedInit = true;
}

/**
 * Port of upstream `_ZFONT_ENGINE_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: zfont_engine.h:2
 */
export const ZFONT_ENGINE_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ZFontEngine::Init`.
 * Role: Assigns each engine font slot its atlas type and initializes its images.
 * Upstream: zfont_engine.cpp:10-19
 */
export function initFontEngine(
  state: FontEngineState,
  loadImage: FontImageLoader,
): void {
  for (let i = 0; i < FontType.MaxFontTypes; i += 1) {
    const font = state.fonts[i] ?? { type: i };
    state.fonts[i] = font;
    setFontType(font, i);
    initFont(font, loadImage);
  }
}
