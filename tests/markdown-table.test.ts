import { describe, expect, it } from "vitest";
import { parseMarkdownTable, renderMarkdownTable } from "../tools/zport/markdown-table.ts";

describe("markdown table", () => {
  it("round-trips escaped cells", () => {
    const markdown = renderMarkdownTable([
      {
        ID: "FUN-000001",
        Type: "function",
        Symbole: "`A|B`",
        Fichier: "src/a.cpp",
        Lignes: "1-2",
        Décision: "PORTER",
        "Domaine cible": "simulation",
        Statut: "todo",
        Lot: "",
        "Cible TS": "",
        Notes: "line one\nline two",
        "Depends On": "CLS-1",
        "Blocked By": "",
      },
    ]);

    expect(parseMarkdownTable(markdown)).toEqual([
      {
        ID: "FUN-000001",
        Type: "function",
        Symbole: "`A|B`",
        Fichier: "src/a.cpp",
        Lignes: "1-2",
        Décision: "PORTER",
        "Domaine cible": "simulation",
        Statut: "todo",
        Lot: "",
        "Cible TS": "",
        Notes: "line one\nline two",
        "Depends On": "CLS-1",
        "Blocked By": "",
      },
    ]);
  });
});
