import type { LedgerRow } from "./ledger.ts";
import { resolveDependencies } from "./dependencies.ts";

const domainOrder = [
  "data",
  "world",
  "simulation",
  "rendering",
  "input",
  "assets",
  "audio",
  "ui",
  "network",
  "tooling",
];

const batchOrder = [
  "map-format",
  "map-core",
  "entity-core",
  "navigation-basic",
  "movement-basic",
  "rendering-basic",
  "selection-orders",
  "robot-basic",
  "vehicle-basic",
];

export function selectNext(rows: LedgerRow[]): LedgerRow | undefined {
  return rows
    .filter((row) => ["todo", "qualified"].includes(row.status))
    .filter((row) => !["IGNORE", "DEFER"].includes(row.decision))
    .filter((row) => isDependencyClear(row, rows))
    .sort(compareRows)[0];
}

export type ConstantBatchOptions = {
  limit?: number;
  file?: string;
  domain?: string;
  getSourceLine?: (row: LedgerRow) => string | undefined;
};

export function selectConstantBatch(
  rows: LedgerRow[],
  options: ConstantBatchOptions = {},
): LedgerRow[] {
  const limit = options.limit ?? 10;
  const candidates = uniqueById(
    rows
      .filter((row) => isBatchableConstant(row, options))
      .filter((row) => isDependencyClear(row, rows))
      .filter((row) => !options.file || row.file === options.file)
      .filter((row) => !options.domain || row.targetDomain === options.domain)
      .sort(compareRows),
  );

  const first = candidates[0];
  if (!first) {
    return [];
  }

  return candidates
    .filter((row) => row.file === first.file)
    .filter((row) => row.targetDomain === first.targetDomain)
    .slice(0, limit);
}

function isDependencyClear(row: LedgerRow, rows: LedgerRow[]): boolean {
  return resolveDependencies(row, rows).blockedBy.length === 0;
}

function compareRows(a: LedgerRow, b: LedgerRow): number {
  return (
    scoreMapFormat(a) - scoreMapFormat(b) ||
    scoreBatch(a.batch) - scoreBatch(b.batch) ||
    scoreDomain(a.targetDomain) - scoreDomain(b.targetDomain) ||
    a.file.localeCompare(b.file) ||
    a.id.localeCompare(b.id)
  );
}

function scoreMapFormat(row: LedgerRow): number {
  const text = `${row.file} ${row.symbol}`.toLowerCase();
  if (text.includes("zmap.h `map_basics`")) return 0;
  if (text.includes("zmap.h `zmap`")) return 1;
  if (text.includes("zmap.cpp `zmap::read`")) return 2;
  if (text.includes("zmap.cpp `zmap::write`")) return 3;
  if (text.includes("zmap.cpp") || text.includes("zmap.h")) return 10;
  return 50;
}

function scoreDomain(domain: string): number {
  const index = domainOrder.indexOf(domain);
  return index === -1 ? 999 : index;
}

function scoreBatch(batch: string): number {
  const index = batchOrder.indexOf(batch);
  return index === -1 ? 999 : index;
}

export function isBatchableConstant(
  row: LedgerRow,
  options: ConstantBatchOptions = {},
): boolean {
  return (
    ["todo", "qualified"].includes(row.status) &&
    ["constant", "macro"].includes(row.type) &&
    !["IGNORE", "DEFER"].includes(row.decision) &&
    isSingleLine(row.lines) &&
    !stripTicks(row.symbol).includes("(") &&
    !isMacroFunctionSource(row, options.getSourceLine?.(row))
  );
}

function isMacroFunctionSource(row: LedgerRow, sourceLine: string | undefined): boolean {
  if (row.type !== "macro" || !sourceLine) {
    return false;
  }
  const symbol = escapeRegExp(stripTicks(row.symbol));
  return new RegExp(`^\\s*#\\s*define\\s+${symbol}\\s*\\(`).test(sourceLine);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isSingleLine(lines: string): boolean {
  const [start, end = start] = lines.split("-");
  return start === end;
}

function stripTicks(value: string): string {
  return value.replace(/^`|`$/g, "");
}

function uniqueById(rows: LedgerRow[]): LedgerRow[] {
  const seen = new Set<string>();
  const uniqueRows: LedgerRow[] = [];
  for (const row of rows) {
    if (seen.has(row.id)) {
      continue;
    }
    seen.add(row.id);
    uniqueRows.push(row);
  }
  return uniqueRows;
}
