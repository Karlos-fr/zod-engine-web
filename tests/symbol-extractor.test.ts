import { describe, expect, it } from "vitest";
import { extractSymbols } from "../tools/zport/symbol-extractor.ts";

describe("symbol extractor", () => {
  it("extracts class forward declarations as single-line symbols", () => {
    const symbols = extractSymbols(
      "sample.h",
      [
        "class ZObject;",
        "",
        "class ZOLists",
        "{",
        "public:",
        "  void Init();",
        "};",
        "",
      ].join("\n"),
    );

    expect(symbols).toMatchObject([
      {
        type: "class",
        symbol: "`ZObject`",
        lines: "1-1",
      },
      {
        type: "class",
        symbol: "`ZOLists`",
        lines: "3-7",
      },
    ]);
  });
});
