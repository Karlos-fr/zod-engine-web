import { describe, expect, it } from "vitest";
import {
  SELECTION_BOX_CORNER_LENGTH_PIXELS,
  SELECTION_BOX_PADDING_PIXELS,
} from "../src/rendering/SelectionBoxRendering";

describe("selection box rendering constants", () => {
  it("replaces the selection padding constant", () => {
    expect(SELECTION_BOX_PADDING_PIXELS).toBe(3);
  });

  it("replaces the selection corner length constant", () => {
    expect(SELECTION_BOX_CORNER_LENGTH_PIXELS).toBe(5);
  });
});
