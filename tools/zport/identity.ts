import crypto from "node:crypto";
import type { LedgerRow } from "./ledger.ts";

const symbolPrefixes: Record<string, string> = {
  class: "CLS",
  struct: "STR",
  enum: "ENU",
  method: "MET",
  function: "FUN",
  constant: "CON",
  macro: "MAC",
  global: "GLB",
};

export function makeSymbolId(row: Pick<LedgerRow, "type" | "symbol" | "file" | "lines">): string {
  const prefix = symbolPrefixes[row.type] || "SYM";
  const hash = crypto
    .createHash("sha1")
    .update(makeSourceKey(row))
    .digest("hex")
    .slice(0, 10);

  return `${prefix}-${hash}`.toUpperCase();
}

export function makeSourceKey(
  row: Pick<LedgerRow, "type" | "symbol" | "file" | "lines">,
): string {
  return [
    normalizeIdentityPart(row.type),
    normalizeIdentityPart(row.file),
    normalizeSymbol(row.symbol),
    normalizeIdentityPart(row.lines),
  ].join(":");
}

export function normalizeSymbol(symbol: string): string {
  return normalizeIdentityPart(symbol.replace(/^`|`$/g, ""));
}

function normalizeIdentityPart(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}
