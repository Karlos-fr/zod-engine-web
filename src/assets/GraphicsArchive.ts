/**
 * Ported from Zod Engine.
 * Upstream: zgfile.h
 */

/**
 * Port of upstream `_ZGFILE_H_`.
 * Role: Marks an upstream header boundary.
 * Ledger: MAC-6BE21F
 * Upstream: zgfile.h:2
 */
export const ZGFILE_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ZGFILE_NAME`.
 * Role: Defines the sprite archive path for the graphics file loader.
 * Ledger: MAC-E27ABD
 * Upstream: zgfile.h:9
 */
export const GRAPHICS_ARCHIVE_PATH = "assets/sprites.zgfx";

/**
 * Port of upstream `ZGFileEntry`.
 * Role: Stores one indexed sprite entry in the graphics archive.
 * Ledger: STR-E5F3A3
 * Upstream: zgfile.h:11-16
 */
export type GraphicsArchiveEntry = {
  filename: string;
  w: number;
  h: number;
  fileOffset: number;
};
