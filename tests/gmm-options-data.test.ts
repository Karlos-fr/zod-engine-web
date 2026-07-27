import { describe, expect, it } from "vitest";
import { MAX_GMM_OPTIONS_SPEED_SETTINGS } from "../src/data/GmmOptionsData";

describe("gmm options data", () => {
  it("ports the maximum number of speed settings", () => {
    expect(MAX_GMM_OPTIONS_SPEED_SETTINGS).toBe(7);
  });
});
