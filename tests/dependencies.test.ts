import { describe, expect, it } from "vitest";
import { resolveDependencies } from "../tools/zport/dependencies";
import { readLedger, type LedgerRow } from "../tools/zport/ledger";

describe("zport dependency resolution", () => {
  it("does not treat constructor and local method calls as external blockers", () => {
    const rows = readLedger();
    const waypoint = requiredRow(rows, {
      file: "zobject.h",
      symbol: "`waypoint`",
      lines: "157-195",
    });
    const resolution = resolveDependencies(waypoint, rows);

    expect(resolution.unresolvedCalls).not.toContain("waypoint");
    expect(resolution.blockedBy).toEqual([]);
  });

  it("keeps forward declarations and full class definitions as distinct dependencies", () => {
    const rows = readLedger();
    const zobjectForwardDeclaration = requiredRow(rows, {
      file: "zobject.h",
      symbol: "`ZObject`",
      lines: "217-217",
    });
    const zobjectClassDefinition = requiredRow(rows, {
      file: "zobject.h",
      symbol: "`ZObject`",
      lines: "291-689",
    });
    const attackedOnlyByExplosives = requiredRow(rows, {
      file: "zobject.cpp",
      symbol: "`ZObject::AttackedOnlyByExplosives`",
      lines: "4536-4539",
    });

    expect(zobjectForwardDeclaration.id).not.toBe(zobjectClassDefinition.id);

    const resolution = resolveDependencies(attackedOnlyByExplosives, rows);

    expect(resolution.dependsOn).toContain(zobjectForwardDeclaration.id);
    expect(resolution.dependsOn).toContain(zobjectClassDefinition.id);
    expect(resolution.blockedBy).not.toContain(zobjectForwardDeclaration.id);
    expect(resolution.blockedBy).toContain(zobjectClassDefinition.id);
  });
});

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
