/**
 * Upstream: zgfile.h
 */

/**
 * Port of upstream `_ZGFILE_H_`.
 * Role: Marks an upstream header boundary.
 * Upstream: zgfile.h:2
 */
export const ZGFILE_HEADER_GUARD_PORTED = true;

/**
 * Port of upstream `ZGFILE_NAME`.
 * Role: Defines the sprite archive path for the graphics file loader.
 * Upstream: zgfile.h:9
 */
export const GRAPHICS_ARCHIVE_PATH = "assets/sprites.zgfx";

/**
 * Port of upstream `ZGFileEntry`.
 * Role: Stores one indexed sprite entry in the graphics archive.
 * Upstream: zgfile.h:11-16
 */
export type GraphicsArchiveEntry = {
  filename: string;
  w: number;
  h: number;
  fileOffset: number;
};
