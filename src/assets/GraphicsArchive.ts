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

/**
 * Port of upstream `ZGFile` entry storage.
 * Role: Stores the loaded sprite archive entries for lookup.
 * Upstream: zgfile.cpp:3, zgfile.h:31
 */
export type GraphicsArchiveState = {
  entries: GraphicsArchiveEntry[];
};

/**
 * Port of upstream `sizeof(ZGFileEntry)`.
 * Role: Defines the fixed binary header size before each archived RGBA sprite payload.
 * Upstream: zgfile.h:11-16
 */
export const GRAPHICS_ARCHIVE_ENTRY_HEADER_BYTES = 512 + 4 + 4 + 4;

const GRAPHICS_ARCHIVE_FILENAME_BYTES = 512;
const GRAPHICS_ARCHIVE_RGBA_BYTES_PER_PIXEL = 4;

function readNullTerminatedAscii(
  bytes: Uint8Array,
  offset: number,
  maxLength: number,
): string {
  let length = 0;

  while (length < maxLength && bytes[offset + length] !== 0) {
    length += 1;
  }

  return new TextDecoder("ascii").decode(bytes.subarray(offset, offset + length));
}

/**
 * Port of upstream `ZGFile::LoadEntryList`.
 * Role: Loads the sprite archive entry table by walking fixed entry headers and RGBA payload sizes.
 * Upstream: zgfile.cpp:15-62
 */
export function loadGraphicsArchiveEntryList(
  archive: ArrayBufferLike,
): GraphicsArchiveEntry[] {
  const bytes = new Uint8Array(archive);
  const view = new DataView(archive);
  const entries: GraphicsArchiveEntry[] = [];
  let offset = 0;

  while (offset + GRAPHICS_ARCHIVE_ENTRY_HEADER_BYTES <= bytes.byteLength) {
    const filename = readNullTerminatedAscii(
      bytes,
      offset,
      GRAPHICS_ARCHIVE_FILENAME_BYTES,
    );
    const w = view.getInt32(offset + GRAPHICS_ARCHIVE_FILENAME_BYTES, true);
    const h = view.getInt32(offset + GRAPHICS_ARCHIVE_FILENAME_BYTES + 4, true);
    const fileOffset = offset + GRAPHICS_ARCHIVE_ENTRY_HEADER_BYTES;

    entries.push({ filename, w, h, fileOffset });

    offset = fileOffset + w * h * GRAPHICS_ARCHIVE_RGBA_BYTES_PER_PIXEL;
  }

  return entries;
}

/**
 * Port of upstream `ZGFile::Init`.
 * Role: Initializes the graphics archive entry list from archive bytes.
 * Upstream: zgfile.cpp:10-13
 */
export function initGraphicsArchive(
  state: GraphicsArchiveState,
  archive: ArrayBufferLike,
): void {
  state.entries = loadGraphicsArchiveEntryList(archive);
}

/**
 * Port of upstream `ZGFile::FindEntry`.
 * Role: Finds the first archive entry whose filename exactly matches the request.
 * Upstream: zgfile.cpp:222-230
 */
export function findGraphicsArchiveEntry(
  entries: Pick<GraphicsArchiveEntry, "filename">[],
  filename: string,
): number {
  for (let i = 0; i < entries.length; i += 1) {
    if (filename === entries[i].filename) {
      return i;
    }
  }

  return -1;
}
