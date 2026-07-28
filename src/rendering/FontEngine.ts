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

/**
 * Port of upstream `_ZFONT_ENGINE_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: zfont_engine.h:2
 */
export const ZFONT_ENGINE_HEADER_GUARD_PORTED = true;
