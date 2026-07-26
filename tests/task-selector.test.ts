import { describe, expect, it } from "vitest";
import { selectNext } from "../tools/zport/task-selector.ts";
import type { LedgerRow } from "../tools/zport/ledger.ts";

describe("task selector", () => {
  it("skips symbols blocked by unported dependencies", () => {
    const rows: LedgerRow[] = [
      row({
        id: "MET-BLOCKED",
        symbol: "`ZMap::Write`",
        file: "zmap.cpp",
        blockedBy: "STR-MAP-ZONE",
      }),
      row({
        id: "STR-MAP-ZONE",
        type: "struct",
        symbol: "`map_zone`",
        file: "zmap.h",
      }),
    ];

    expect(selectNext(rows)?.id).toBe("STR-MAP-ZONE");
  });
});

function row(overrides: Partial<LedgerRow>): LedgerRow {
  return {
    id: "ID",
    type: "method",
    symbol: "`Symbol`",
    file: "file.cpp",
    lines: "1-1",
    decision: "PORTER",
    targetDomain: "world",
    status: "todo",
    batch: "map-core",
    targetTs: "",
    notes: "",
    dependsOn: "",
    blockedBy: "",
    ...overrides,
  };
}
