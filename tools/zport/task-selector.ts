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

export type RecoveryCandidate = {
  row: LedgerRow;
  blockedBy: string[];
  reason: string;
  score: number;
};

export type RecoveryCandidateOptions = {
  limit?: number;
  domain?: string;
  file?: string;
};

export function selectRecoveryCandidates(
  rows: LedgerRow[],
  options: RecoveryCandidateOptions = {},
): RecoveryCandidate[] {
  const limit = options.limit ?? 20;
  const byId = buildRowsById(rows);
  const resolutionCache = new Map<string, string[]>();
  const getBlockedBy = (row: LedgerRow): string[] => {
    const cacheKey = `${row.id}:${row.file}:${row.lines}`;
    const cached = resolutionCache.get(cacheKey);
    if (cached) {
      return cached;
    }
    const blockedBy = mergeBlockedBy(
      resolveDependencies(row, rows).blockedBy,
      row.blockedBy,
      byId,
    );
    resolutionCache.set(cacheKey, blockedBy);
    return blockedBy;
  };

  return rows
    .filter((row) => ["todo", "qualified"].includes(row.status))
    .filter((row) => !["IGNORE", "DEFER"].includes(row.decision))
    .filter((row) => !options.domain || row.targetDomain === options.domain)
    .filter((row) => !options.file || row.file.includes(options.file))
    .map((row) => toRecoveryCandidate(row, getBlockedBy, byId))
    .filter((candidate): candidate is RecoveryCandidate => Boolean(candidate))
    .sort(compareRecoveryCandidates)
    .slice(0, limit);
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

function toRecoveryCandidate(
  row: LedgerRow,
  getBlockedBy: (row: LedgerRow) => string[],
  byId: Map<string, LedgerRow[]>,
): RecoveryCandidate | undefined {
  const blockedBy = getBlockedBy(row);
  if (!blockedBy.length) {
    return undefined;
  }

  const directCycle = blockedBy.some((id) =>
    (byId.get(id) ?? []).some((blockedRow) =>
      getBlockedBy(blockedRow).includes(row.id),
    ),
  );
  const lineCount = countLines(row.lines);
  const smallBlockedSymbol =
    ["function", "method"].includes(row.type) &&
    blockedBy.length <= 2 &&
    lineCount <= 20;
  const renderingReplacement =
    row.decision === "REPLACE" ||
    stripTicks(row.symbol).includes("DoRender") ||
    row.targetDomain === "rendering";

  if (!directCycle && !smallBlockedSymbol && !renderingReplacement) {
    return undefined;
  }

  const reason = [
    directCycle ? "direct-cycle" : "",
    smallBlockedSymbol ? "small-blocked-symbol" : "",
    renderingReplacement ? "rendering-replace" : "",
  ]
    .filter(Boolean)
    .join("+");

  return {
    row,
    blockedBy,
    reason,
    score:
      (directCycle ? 0 : 100) +
      (smallBlockedSymbol ? 0 : 25) +
      (renderingReplacement ? 10 : 0) +
      blockedBy.length * 5 +
      lineCount,
  };
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

function compareRecoveryCandidates(
  a: RecoveryCandidate,
  b: RecoveryCandidate,
): number {
  return (
    a.score - b.score ||
    compareRows(a.row, b.row) ||
    a.row.id.localeCompare(b.row.id)
  );
}

function buildRowsById(rows: LedgerRow[]): Map<string, LedgerRow[]> {
  const byId = new Map<string, LedgerRow[]>();
  for (const row of rows) {
    byId.set(row.id, [...(byId.get(row.id) ?? []), row]);
  }
  return byId;
}

function mergeBlockedBy(
  dynamicBlockedBy: string[],
  storedBlockedBy: string,
  byId: Map<string, LedgerRow[]>,
): string[] {
  const blockedBy = new Set(dynamicBlockedBy);
  for (const id of splitIds(storedBlockedBy)) {
    if (!isSatisfiedId(id, byId)) {
      blockedBy.add(id);
    }
  }
  return [...blockedBy].sort();
}

function isSatisfiedId(id: string, byId: Map<string, LedgerRow[]>): boolean {
  const rows = byId.get(id);
  if (!rows?.length) {
    return false;
  }
  return rows.some(
    (row) =>
      ["ported", "verified", "ignored"].includes(row.status) ||
      (["REPLACE", "IGNORE", "DEFER"].includes(row.decision) && Boolean(row.notes)),
  );
}

function splitIds(value: string): string[] {
  return value
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
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

function countLines(lines: string): number {
  const [startText, endText = startText] = lines.split("-");
  const start = Number(startText);
  const end = Number(endText);
  if (!Number.isInteger(start) || !Number.isInteger(end)) {
    return 999;
  }
  return Math.max(1, end - start + 1);
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
