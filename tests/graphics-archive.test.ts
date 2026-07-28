import { describe, expect, it } from "vitest";
import {
  GRAPHICS_ARCHIVE_PATH,
  ZGFILE_HEADER_GUARD_PORTED,
} from "../src/assets/GraphicsArchive";
import type { GraphicsArchiveEntry } from "../src/assets/GraphicsArchive";

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
});
