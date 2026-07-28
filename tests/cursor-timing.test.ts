import { describe, expect, it } from "vitest";
import {
  CURSOR_FRAME_INTERVAL_SECONDS,
  CursorType,
} from "../src/input/CursorTiming";

describe("cursor timing", () => {
  it("replaces the cursor header guard with module boundaries", async () => {
    const firstImport = await import("../src/input/CursorTiming");
    const secondImport = await import("../src/input/CursorTiming");

    expect(secondImport.CURSOR_FRAME_INTERVAL_SECONDS).toBe(
      firstImport.CURSOR_FRAME_INTERVAL_SECONDS,
    );
  });

  it("ports the cursor animation frame interval", () => {
    expect(CURSOR_FRAME_INTERVAL_SECONDS).toBe(0.2);
  });

  it("ports cursor interaction types", () => {
    expect(CursorType.Cursor).toBe(0);
    expect(CursorType.Attack).toBe(3);
    expect(CursorType.Grenaded).toBe(8);
    expect(CursorType.Cannon).toBe(12);
    expect(CursorType.Exited).toBe(17);
    expect(CursorType.MaxCursorTypes).toBe(18);
  });
});
