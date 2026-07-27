/**
 * Ported from Zod Engine.
 * Upstream: zfont.h / zfont_engine.h
 * Symbols: _ZFONT_H_, MAX_CHARACTERS, _ZFONT_ENGINE_H_
 */

/**
 * Adaptation of upstream `_ZFONT_H_`.
 * Role: Marks the TypeScript module boundary for upstream `zfont.h`.
 * Ledger: MAC-24468D
 * Upstream: zfont.h:2
 */
export const ZFONT_HEADER_GUARD_PORTED = true;

/**
 * Adaptation of upstream `MAX_CHARACTERS`.
 * Role: Defines the highest character slot available to the font renderer.
 * Ledger: MAC-5CA3BE
 * Upstream: zfont.h:6
 */
export const FONT_MAX_CHARACTERS = 255;

/**
 * Adaptation of upstream `_ZFONT_ENGINE_H_`.
 * Role: Marks the TypeScript module boundary for upstream `zfont_engine.h`.
 * Ledger: MAC-CFFCBD
 * Upstream: zfont_engine.h:2
 */
export const ZFONT_ENGINE_HEADER_GUARD_PORTED = true;
