import { describe, expect, it } from "vitest";
import {
  ETRACK_HEADER_GUARD_PORTED,
  TrackEffectType,
} from "../src/simulation/TrackEffect";

describe("track effect", () => {
  it("adapts the etrack.h include guard to an ES module marker", async () => {
    const firstImport = await import("../src/simulation/TrackEffect");
    const secondImport = await import("../src/simulation/TrackEffect");

    expect(ETRACK_HEADER_GUARD_PORTED).toBe(true);
    expect(secondImport.ETRACK_HEADER_GUARD_PORTED).toBe(
      firstImport.ETRACK_HEADER_GUARD_PORTED,
    );
  });

  it("ports ETRACK_TYPE as track effect identifiers", () => {
    expect(TrackEffectType.Tank).toBe(0);
    expect(TrackEffectType.Jeep).toBe(1);
    expect(TrackEffectType.MaxTrackTypes).toBe(2);
  });
});
