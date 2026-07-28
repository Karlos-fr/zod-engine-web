import fs from "node:fs";
import path from "node:path";
import { projectRoot } from "./config.ts";
import type { LedgerRow } from "./ledger.ts";

export type SourceMatch = {
  file: string;
  line: number;
  text: string;
};

const ignoredDirectories = new Set([
  ".git",
  "dist",
  "download",
  "node_modules",
]);

/**
 * Role: Finds compact local source references for a ledger symbol.
 */
export function findExistingSourceMatches(row: LedgerRow, limit = 8): SourceMatch[] {
  const needles = symbolNeedles(row);
  if (!needles.length) {
    return [];
  }

  const matches: SourceMatch[] = [];
  for (const file of listTypeScriptFiles(path.join(projectRoot, "src"))) {
    const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
    for (const [index, line] of lines.entries()) {
      if (!needles.some((needle) => line.includes(needle))) {
        continue;
      }
      matches.push({
        file: path.relative(projectRoot, file),
        line: index + 1,
        text: line.trim(),
      });
      if (matches.length >= limit) {
        return matches;
      }
    }
  }
  return matches;
}

function symbolNeedles(row: LedgerRow): string[] {
  const symbol = stripTicks(row.symbol);
  const unqualified = symbol.split("::").pop() ?? symbol;
  return [...new Set([symbol, unqualified].filter((value) => value && value.length > 2))];
}

function listTypeScriptFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const files: string[] = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (ignoredDirectories.has(entry.name)) {
      continue;
    }
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...listTypeScriptFiles(fullPath));
      continue;
    }
    if (entry.isFile() && fullPath.endsWith(".ts")) {
      files.push(fullPath);
    }
  }
  return files.sort();
}

function stripTicks(value: string): string {
  return value.replace(/^`|`$/g, "");
}
