import { describe, expect, it } from "vitest";
import { selectNext } from "../tools/zport/task-selector";
import type { LedgerRow } from "../tools/zport/ledger";

function row(patch: Partial<LedgerRow>): LedgerRow {
  return {
    id: "ID-000000",
    type: "function",
    symbol: "`symbol`",
    file: "common.cpp",
    lines: "1-1",
    decision: "PORTER",
    targetDomain: "simulation",
    status: "todo",
    batch: "",
    targetTs: "",
    notes: "",
    dependsOn: "",
    blockedBy: "",
    ...patch,
  };
}

describe("task selector", () => {
  it("selects rows whose stored block list is stale but dynamically clear", () => {
    const selected = selectNext([
      row({
        id: "FUN-CLEAR",
        symbol: "`sort_string_func`",
        file: "common.cpp",
        lines: "391-394",
        blockedBy: "FUN-OLD",
      }),
    ]);

    expect(selected?.id).toBe("FUN-CLEAR");
  });
});
