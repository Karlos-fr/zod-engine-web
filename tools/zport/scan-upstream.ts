import fs from "node:fs";
import path from "node:path";
import {
  ignoredPathParts,
  sourceExtensions,
  upstreamSourceRoot,
} from "./config.ts";
import { inspectFile } from "./large-file-policy.ts";
import { mergeRows, readLedger, writeLedger, type LedgerRow } from "./ledger.ts";
import { extractSymbols } from "./symbol-extractor.ts";
import { annotateDependencies } from "./dependencies.ts";

export type ScanResult = {
  files: number;
  symbols: number;
  largeFiles: number;
  rows: LedgerRow[];
};

export function scanUpstream(): ScanResult {
  const files = collectSourceFiles(upstreamSourceRoot);
  const rows: LedgerRow[] = [];
  let largeFiles = 0;

  for (const filePath of files) {
    const inspection = inspectFile(filePath);
    if (inspection.policy === "binary") {
      continue;
    }
    if (inspection.policy === "large" || inspection.policy === "huge") {
      largeFiles += 1;
    }
    const content = fs.readFileSync(filePath, "utf8");
    const relativeFile = path.relative(upstreamSourceRoot, filePath);
    rows.push(...extractSymbols(relativeFile, content));
  }

  const merged = annotateDependencies(mergeRows(readLedger(), rows));
  writeLedger(merged);

  return {
    files: files.length,
    symbols: merged.length,
    largeFiles,
    rows: merged,
  };
}

export function collectSourceFiles(root: string): string[] {
  const output: string[] = [];

  function walk(directory: string): void {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name);
      if (shouldIgnore(fullPath)) {
        continue;
      }
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (sourceExtensions.has(path.extname(entry.name))) {
        output.push(fullPath);
      }
    }
  }

  walk(root);
  return output.sort();
}

function shouldIgnore(filePath: string): boolean {
  return ignoredPathParts.some((part) => filePath.includes(part));
}
