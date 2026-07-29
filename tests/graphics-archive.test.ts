import { describe, expect, it } from "vitest";
import {
  findGraphicsArchiveEntry,
  GRAPHICS_ARCHIVE_ENTRY_HEADER_BYTES,
  GRAPHICS_ARCHIVE_PATH,
  initGraphicsArchive,
  loadGraphicsArchiveEntryList,
  ZGFILE_HEADER_GUARD_PORTED,
} from "../src/assets/GraphicsArchive";
import type {
  GraphicsArchiveEntry,
  GraphicsArchiveState,
} from "../src/assets/GraphicsArchive";

function writeArchiveEntry(
  buffer: ArrayBuffer,
  offset: number,
  filename: string,
  w: number,
  h: number,
): number {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);
  const encodedFilename = new TextEncoder().encode(filename);

  bytes.set(encodedFilename, offset);
  view.setInt32(offset + 512, w, true);
  view.setInt32(offset + 516, h, true);
  view.setInt32(offset + 520, -1, true);

  return offset + GRAPHICS_ARCHIVE_ENTRY_HEADER_BYTES + w * h * 4;
}

describe("graphics archive", () => {
  it("adapts the zgfile.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/assets/GraphicsArchive");
    const secondImport = await import("../src/assets/GraphicsArchive");

    expect(ZGFILE_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ZGFILE_HEADER_GUARD_PORTED).toBe(
      firstImport.ZGFILE_HEADER_GUARD_PORTED,
    );
  });

  it("adapts the upstream sprite archive path", () => {
    expect(GRAPHICS_ARCHIVE_PATH).toBe("assets/sprites.zgfx");
  });

  it("ports graphics archive entries", () => {
    const entry: GraphicsArchiveEntry = {
      filename: "units/robot.png",
      w: 32,
      h: 48,
      fileOffset: 1024,
    };

    expect(entry).toEqual({
      filename: "units/robot.png",
      w: 32,
      h: 48,
      fileOffset: 1024,
    });
  });

  it("ports ZGFile LoadEntryList as a sequential binary archive scan", () => {
    const firstPayloadBytes = 2 * 3 * 4;
    const archive = new ArrayBuffer(
      GRAPHICS_ARCHIVE_ENTRY_HEADER_BYTES +
        firstPayloadBytes +
        GRAPHICS_ARCHIVE_ENTRY_HEADER_BYTES +
        1 * 1 * 4,
    );
    const secondHeaderOffset = writeArchiveEntry(
      archive,
      0,
      "units/grunt.png",
      2,
      3,
    );
    writeArchiveEntry(archive, secondHeaderOffset, "effects/smoke.png", 1, 1);

    expect(loadGraphicsArchiveEntryList(archive)).toEqual([
      {
        filename: "units/grunt.png",
        w: 2,
        h: 3,
        fileOffset: GRAPHICS_ARCHIVE_ENTRY_HEADER_BYTES,
      },
      {
        filename: "effects/smoke.png",
        w: 1,
        h: 1,
        fileOffset: secondHeaderOffset + GRAPHICS_ARCHIVE_ENTRY_HEADER_BYTES,
      },
    ]);
  });

  it("stops loading entries when fewer than one full header remains", () => {
    const archive = new ArrayBuffer(GRAPHICS_ARCHIVE_ENTRY_HEADER_BYTES + 10);
    writeArchiveEntry(archive, 0, "units/grunt.png", 1, 1);

    expect(loadGraphicsArchiveEntryList(archive)).toEqual([
      {
        filename: "units/grunt.png",
        w: 1,
        h: 1,
        fileOffset: GRAPHICS_ARCHIVE_ENTRY_HEADER_BYTES,
      },
    ]);
  });

  it("ports ZGFile Init as archive entry list initialization", () => {
    const archive = new ArrayBuffer(GRAPHICS_ARCHIVE_ENTRY_HEADER_BYTES + 4);
    const state: GraphicsArchiveState = {
      entries: [
        {
          filename: "stale.png",
          w: 99,
          h: 99,
          fileOffset: 99,
        },
      ],
    };

    writeArchiveEntry(archive, 0, "units/grunt.png", 1, 1);

    initGraphicsArchive(state, archive);

    expect(state.entries).toEqual([
      {
        filename: "units/grunt.png",
        w: 1,
        h: 1,
        fileOffset: GRAPHICS_ARCHIVE_ENTRY_HEADER_BYTES,
      },
    ]);
  });

  it("ports ZGFile FindEntry as first exact filename match", () => {
    const entries = [
      { filename: "units/grunt.png" },
      { filename: "units/laser.png" },
      { filename: "units/grunt.png" },
    ];

    expect(findGraphicsArchiveEntry(entries, "units/grunt.png")).toBe(0);
    expect(findGraphicsArchiveEntry(entries, "units/laser.png")).toBe(1);
    expect(findGraphicsArchiveEntry(entries, "units")).toBe(-1);
    expect(findGraphicsArchiveEntry([], "units/grunt.png")).toBe(-1);
  });
});
