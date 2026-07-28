import fs from "node:fs";
import path from "node:path";
import { upstreamSourceRoot } from "./config.ts";
import { extractCalls } from "./dependency-graph.ts";
import type { LedgerRow } from "./ledger.ts";
import { extractRange } from "./symbol-extractor.ts";

export type DependencyResolution = {
  dependsOn: string[];
  blockedBy: string[];
  unresolvedCalls: string[];
};

const ignoredCalls = new Set([
  "begin",
  "c_str",
  "end",
  "fclose",
  "fopen",
  "fread",
  "free",
  "fwrite",
  "malloc",
  "memcpy",
  "memset",
  "printf",
  "sprintf",
  "rand",
  "size",
  "if",
  "for",
  "while",
  "switch",
  "return",
  "sizeof",
]);

export function annotateDependencies(rows: LedgerRow[]): LedgerRow[] {
  const index = buildSymbolIndex(rows);
  return rows.map((row) => {
    const resolution = resolveDependencies(row, rows, index);
    return {
      ...row,
      dependsOn: resolution.dependsOn.join(","),
      blockedBy: resolution.blockedBy.join(","),
    };
  });
}

export function resolveDependencies(
  row: LedgerRow,
  rows: LedgerRow[],
  index = buildSymbolIndex(rows),
): DependencyResolution {
  const excerpt = readExcerpt(row);
  const localDefinitions = extractLocalFunctionDefinitions(excerpt);
  const currentSymbol = unqualifiedName(stripTicks(row.symbol));
  const calls = extractCalls(excerpt).filter(
    (call) =>
      !ignoredCalls.has(call) &&
      !isCurrentSymbolCall(call, currentSymbol) &&
      !localDefinitions.has(unqualifiedName(call)),
  );
  const references = extractSymbolReferences(excerpt, rows, row);
  const dependencies = new Set<string>();
  const unresolvedCalls: string[] = [];

  references.forEach((id) => dependencies.add(id));

  for (const call of calls) {
    const ids = index.get(call) ?? index.get(unqualifiedName(call));
    const filtered = (ids ?? []).filter((id) => id !== row.id);
    if (!filtered.length) {
      unresolvedCalls.push(call);
      continue;
    }
    filtered.forEach((id) => dependencies.add(id));
  }

  const byId = new Map(rows.map((entry) => [entry.id, entry]));
  const blockedBy = [...dependencies].filter((id) => {
    const dependency = byId.get(id);
    if (!dependency) {
      return true;
    }
    if (["ported", "verified", "ignored"].includes(dependency.status)) {
      return false;
    }
    if (["REPLACE", "IGNORE", "DEFER"].includes(dependency.decision)) {
      return !dependency.notes;
    }
    return true;
  });

  return {
    dependsOn: [...dependencies].sort(),
    blockedBy: blockedBy.sort(),
    unresolvedCalls: unresolvedCalls.sort(),
  };
}

export function isDependencyClear(row: LedgerRow): boolean {
  return !row.blockedBy.trim();
}

function buildSymbolIndex(rows: LedgerRow[]): Map<string, string[]> {
  const index = new Map<string, string[]>();
  for (const row of rows) {
    const symbol = stripTicks(row.symbol);
    addIndex(index, symbol, row.id);
    addIndex(index, unqualifiedName(symbol), row.id);
  }
  return index;
}

function extractSymbolReferences(
  excerpt: string,
  rows: LedgerRow[],
  currentRow: LedgerRow,
): string[] {
  const currentSymbol = stripTicks(currentRow.symbol);
  const references = new Set<string>();
  const eligible = rows.filter((row) =>
    ["class", "struct", "enum", "constant", "macro", "global"].includes(row.type),
  );

  for (const row of eligible) {
    if (row.id === currentRow.id) {
      continue;
    }

    const symbol = stripTicks(row.symbol);
    if (!symbol || symbol === currentSymbol) {
      continue;
    }

    if (hasWord(excerpt, symbol)) {
      references.add(row.id);
    }
  }

  return [...references].sort();
}

function hasWord(text: string, word: string): boolean {
  return new RegExp(`(^|[^A-Za-z0-9_])${escapeRegExp(word)}([^A-Za-z0-9_]|$)`).test(text);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function addIndex(index: Map<string, string[]>, key: string, id: string): void {
  if (!key) {
    return;
  }
  const list = index.get(key) ?? [];
  if (!list.includes(id)) {
    list.push(id);
  }
  index.set(key, list);
}

function readExcerpt(row: LedgerRow): string {
  const fullPath = path.join(upstreamSourceRoot, row.file);
  if (!fs.existsSync(fullPath)) {
    return "";
  }
  return extractRange(fs.readFileSync(fullPath, "utf8"), row.lines);
}

function stripTicks(value: string): string {
  return value.replace(/^`|`$/g, "");
}

function unqualifiedName(value: string): string {
  const parts = value.split("::");
  return parts[parts.length - 1] ?? value;
}

function isCurrentSymbolCall(call: string, currentSymbol: string): boolean {
  return unqualifiedName(call) === currentSymbol;
}

function extractLocalFunctionDefinitions(excerpt: string): Set<string> {
  const definitions = new Set<string>();
  const source = stripExtractRangeLineNumbers(excerpt);
  for (const match of source.matchAll(
    /^\s*(?:(?:static|virtual|inline|constexpr|const|bool|char|double|float|int|void|unsigned|signed|long|short|[A-Za-z_][\w:<>*&\s]*)\s+)?([A-Za-z_][\w]*)\s*\([^;{}]*\)\s*(?:const\s*)?(?:\{|$)/gm,
  )) {
    definitions.add(match[1]);
  }
  return definitions;
}

function stripExtractRangeLineNumbers(excerpt: string): string {
  return excerpt.replace(/^\s*\d+\s/gm, "");
}
