import { describe, expect, it } from "vitest";
import { readLedger, type LedgerRow } from "../tools/zport/ledger";
import { selectNext, selectRecoveryCandidates } from "../tools/zport/task-selector";

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

describe("zport recovery candidates", () => {
  it("surfaces direct class/method cycles when strict next has no unblocked task", () => {
    const rows = readLedger();
    const zportrait = requiredRow(rows, {
      file: "zportrait.h",
      symbol: "`ZPortrait`",
      lines: "143-201",
    });
    const startAnim = requiredRow(rows, {
      file: "zportrait.cpp",
      symbol: "`ZPortrait::StartAnim`",
      lines: "191-201",
    });
    const ids = [zportrait.id, startAnim.id];
    const rowsWithTodo = withTodoStatuses(rows, ids);
    const candidates = selectRecoveryCandidates(rows, {
      file: "zportrait",
      limit: 20,
    });

    const todoCandidates = selectRecoveryCandidates(rowsWithTodo, {
      file: "zportrait",
      limit: 20,
    });

    expect(todoCandidates.some((candidate) => candidate.row.id === zportrait.id)).toBe(
      true,
    );
    expect(todoCandidates.some((candidate) => candidate.row.id === startAnim.id)).toBe(true);
    expect(
      todoCandidates
        .filter((candidate) => ids.includes(candidate.row.id))
        .every((candidate) => candidate.reason.includes("direct-cycle")),
    ).toBe(true);
    expect(candidates.length).toBeGreaterThan(0);
  });

  it("surfaces small blocked methods that can be inspected manually", () => {
    const rows = readLedger();
    const gmmwButton = requiredRow(rows, {
      file: "zgui_main_menu_widgets.h",
      symbol: "`GMMWButton`",
      lines: "97-139",
    });
    const determineDimensions = requiredRow(rows, {
      file: "gmmw_button.cpp",
      symbol: "`GMMWButton::DetermineDimensions`",
      lines: "216-225",
    });
    const rowsWithTodo = withTodoStatuses(rows, [gmmwButton.id, determineDimensions.id]);
    const candidates = selectRecoveryCandidates(rows, {
      file: "gmmw_button",
      limit: 20,
    });

    const candidate = selectRecoveryCandidates(rowsWithTodo, {
      file: "gmmw_button",
      limit: 20,
    }).find(
      (recoveryCandidate) => recoveryCandidate.row.id === determineDimensions.id,
    );

    expect(candidate).toBeDefined();
    expect(candidate?.reason).toContain("small-blocked-symbol");
    expect(candidates.length).toBeGreaterThan(0);
  });
});

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
    targetSymbol: "",
    targetTs: "",
    notes: "",
    dependsOn: "",
    blockedBy: "",
    ...patch,
  };
}

function withTodoStatuses(rows: LedgerRow[], ids: string[]): LedgerRow[] {
  const selectedIds = new Set(ids);
  return rows.map((row) =>
    selectedIds.has(row.id)
      ? { ...row, status: "todo", targetTs: "", notes: "" }
      : row,
  );
}

function requiredRow(
  rows: LedgerRow[],
  match: Pick<LedgerRow, "file" | "symbol" | "lines">,
): LedgerRow {
  const row = rows.find(
    (candidate) =>
      candidate.file === match.file &&
      candidate.symbol === match.symbol &&
      candidate.lines === match.lines,
  );

  if (!row) {
    throw new Error(`${match.file}:${match.lines} ${match.symbol} not found`);
  }

  return row;
}
