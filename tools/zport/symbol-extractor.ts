import crypto from "node:crypto";
import path from "node:path";
import type { LedgerRow } from "./ledger.ts";

type RawSymbol = {
  type: string;
  symbol: string;
  start: number;
  end: number;
};

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

export function extractSymbols(relativeFile: string, content: string): LedgerRow[] {
  const lines = content.split(/\r?\n/);
  const raw = [
    ...extractClasses(lines),
    ...extractEnums(lines),
    ...extractMacros(lines),
    ...extractConstants(lines),
    ...extractFunctions(lines),
  ];

  const unique = new Map<string, RawSymbol>();
  for (const symbol of raw) {
    if (["if", "for", "while", "switch"].includes(symbol.symbol)) {
      continue;
    }
    unique.set(`${symbol.type}:${symbol.symbol}:${symbol.start}`, symbol);
  }

  return [...unique.values()].map((symbol) => ({
    id: makeId(symbol.type, relativeFile, symbol.symbol, symbol.start),
    type: symbol.type,
    symbol: `\`${symbol.symbol}\``,
    file: relativeFile,
    lines: `${symbol.start}-${symbol.end}`,
    decision: defaultDecision(symbol.type, relativeFile, symbol.symbol),
    targetDomain: inferDomain(relativeFile, symbol.symbol),
    status: "todo",
    batch: inferBatch(relativeFile, symbol.symbol),
    targetTs: "",
    notes: "",
    dependsOn: "",
    blockedBy: "",
  }));
}

export function extractRange(content: string, lineRange: string): string {
  const [startRaw, endRaw] = lineRange.split("-").map((value) => Number(value));
  const start = Math.max(1, startRaw || 1);
  const end = Math.max(start, endRaw || start);
  return content
    .split(/\r?\n/)
    .slice(start - 1, end)
    .map((line, index) => `${String(start + index).padStart(5, " ")} ${line}`)
    .join("\n");
}

function extractClasses(lines: string[]): RawSymbol[] {
  const symbols: RawSymbol[] = [];
  const pattern = /^\s*(class|struct)\s+([A-Za-z_][\w]*)\b([^;{]*)[{:]?/;

  lines.forEach((line, index) => {
    const match = line.match(pattern);
    if (!match) {
      return;
    }
    symbols.push({
      type: match[1],
      symbol: match[2],
      start: index + 1,
      end: isForwardDeclaration(line) ? index + 1 : findBlockEnd(lines, index),
    });
  });

  return symbols;
}

function extractEnums(lines: string[]): RawSymbol[] {
  const symbols: RawSymbol[] = [];
  const pattern = /^\s*enum(?:\s+class)?\s+([A-Za-z_][\w]*)?/;

  lines.forEach((line, index) => {
    const match = line.match(pattern);
    if (!match) {
      return;
    }
    symbols.push({
      type: "enum",
      symbol: match[1] || `anonymous_enum_${index + 1}`,
      start: index + 1,
      end: findBlockEnd(lines, index),
    });
  });

  return symbols;
}

function extractMacros(lines: string[]): RawSymbol[] {
  const pattern = /^\s*#\s*define\s+([A-Za-z_][\w]*)\b(.*)$/;
  return lines.flatMap((line, index) => {
    const match = line.match(pattern);
    if (!match) {
      return [];
    }
    return [
      {
        type: "macro",
        symbol: match[1],
        start: index + 1,
        end: index + 1,
      },
    ];
  });
}

function extractConstants(lines: string[]): RawSymbol[] {
  const pattern =
    /^\s*(?:static\s+)?(?:const|constexpr)\s+[\w:<>,\s*&]+\s+([A-Za-z_][\w]*)\s*[=;]/;
  return lines.flatMap((line, index) => {
    const match = line.match(pattern);
    if (!match) {
      return [];
    }
    return [
      {
        type: "constant",
        symbol: match[1],
        start: index + 1,
        end: index + 1,
      },
    ];
  });
}

function extractFunctions(lines: string[]): RawSymbol[] {
  const symbols: RawSymbol[] = [];
  const pattern =
    /^\s*(?!if\b|for\b|while\b|switch\b)(?:[A-Za-z_][\w:<>,~*&\s]+\s+)+([A-Za-z_~][\w~]*(?:::[A-Za-z_~][\w~]*)?)\s*\([^;{}]*\)\s*(?:const\s*)?(?:{|$)/;

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (
      trimmed.startsWith("if ") ||
      trimmed.startsWith("for ") ||
      trimmed.startsWith("while ") ||
      trimmed.startsWith("switch ") ||
      trimmed.startsWith("return ")
    ) {
      return;
    }

    const match = line.match(pattern);
    if (!match) {
      return;
    }

    const name = match[1];
    const type = name.includes("::") ? "method" : "function";
    symbols.push({
      type,
      symbol: name,
      start: index + 1,
      end: findFunctionEnd(lines, index),
    });
  });

  return symbols;
}

function findFunctionEnd(lines: string[], startIndex: number): number {
  if (lines[startIndex].includes("{")) {
    return findBlockEnd(lines, startIndex);
  }

  for (let index = startIndex + 1; index < Math.min(lines.length, startIndex + 6); index += 1) {
    const trimmed = lines[index].trim();
    if (!trimmed) {
      continue;
    }
    if (trimmed.startsWith("{")) {
      return findBlockEnd(lines, index);
    }
    break;
  }

  return startIndex + 1;
}

function findBlockEnd(lines: string[], startIndex: number): number {
  let depth = 0;
  let seenOpen = false;

  for (let index = startIndex; index < lines.length; index += 1) {
    for (const char of stripLineComment(lines[index])) {
      if (char === "{") {
        seenOpen = true;
        depth += 1;
      } else if (char === "}") {
        depth -= 1;
        if (seenOpen && depth <= 0) {
          return index + 1;
        }
      }
    }
  }

  return startIndex + 1;
}

function stripLineComment(line: string): string {
  const index = line.indexOf("//");
  return index === -1 ? line : line.slice(0, index);
}

function isForwardDeclaration(line: string): boolean {
  return /^\s*(?:class|struct)\s+[A-Za-z_][\w]*\s*;/.test(stripLineComment(line));
}

function makeId(type: string, relativeFile: string, symbol: string, startLine: number): string {
  const prefix = symbolPrefixes[type] || "SYM";
  const base = `${relativeFile}:${symbol}:${startLine}`;
  const hash = crypto.createHash("sha1").update(base).digest("hex").slice(0, 6);
  return `${prefix}-${hash}`.toUpperCase();
}

function defaultDecision(type: string, file: string, symbol: string): string {
  const lower = `${file} ${symbol}`.toLowerCase();
  if (lower.includes("win") || lower.includes("tray")) {
    return "IGNORE";
  }
  if (lower.includes("sdl") || lower.includes("opengl") || lower.includes("render")) {
    return "REPLACE";
  }
  if (lower.includes("server") || lower.includes("client") || lower.includes("mysql")) {
    return "DEFER";
  }
  if (type === "macro") {
    return "ADAPT";
  }
  return "PORTER";
}

function inferDomain(file: string, symbol: string): string {
  const lower = `${file} ${symbol}`.toLowerCase();
  if (lower.includes("map") || lower.includes("tile") || lower.includes("path")) {
    return "world";
  }
  if (lower.includes("sdl") || lower.includes("opengl") || lower.includes("render")) {
    return "rendering";
  }
  if (lower.includes("sound") || lower.includes("music")) {
    return "audio";
  }
  if (lower.includes("gui") || lower.includes("hud") || lower.includes("menu")) {
    return "ui";
  }
  if (lower.includes("cursor") || lower.includes("input")) {
    return "input";
  }
  if (lower.includes("server") || lower.includes("client")) {
    return "network";
  }
  if (lower.includes("settings") || lower.includes("defines")) {
    return "data";
  }
  return "simulation";
}

function inferBatch(file: string, symbol: string): string {
  const lower = path.basename(file).toLowerCase();
  if (lower.includes("zmap")) return "map-core";
  if (lower.includes("path")) return "navigation-basic";
  if (lower.includes("zobject")) return "entity-core";
  if (lower.includes("zrobot") || /^r/.test(lower)) return "robot-basic";
  if (lower.includes("zvehicle") || /^v/.test(lower)) return "vehicle-basic";
  if (lower.includes("sdl") || symbol.toLowerCase().includes("render")) return "rendering-basic";
  if (lower.includes("cursor")) return "selection-orders";
  return "";
}
