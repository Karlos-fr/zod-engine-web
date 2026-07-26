import fs from "node:fs";
import path from "node:path";
import { upstreamSourceRoot } from "./config.ts";
import type { LedgerRow } from "./ledger.ts";

export type DependencyContext = {
  includes: string[];
  calls: string[];
};

export function readDependencyContext(row: LedgerRow): DependencyContext {
  const fullPath = path.join(upstreamSourceRoot, row.file);
  const content = fs.existsSync(fullPath) ? fs.readFileSync(fullPath, "utf8") : "";
  return {
    includes: extractIncludes(content),
    calls: extractCalls(content).slice(0, 30),
  };
}

export function extractIncludes(content: string): string[] {
  return [...content.matchAll(/^\s*#\s*include\s+[<"]([^>"]+)[>"]/gm)].map(
    (match) => match[1],
  );
}

export function extractCalls(content: string): string[] {
  const calls = new Set<string>();
  for (const match of content.matchAll(/\b([A-Za-z_][\w]*(?:::[A-Za-z_][\w]*)?)\s*\(/g)) {
    const name = match[1];
    if (!["if", "for", "while", "switch", "return"].includes(name)) {
      calls.add(name);
    }
  }
  return [...calls].sort();
}
