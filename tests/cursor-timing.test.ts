import { describe, expect, it } from "vitest";
import { CURSOR_FRAME_INTERVAL_SECONDS } from "../src/input/CursorTiming";

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
});
