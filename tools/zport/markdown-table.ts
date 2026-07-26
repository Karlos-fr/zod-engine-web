export type TableRow = Record<string, string>;

export const ledgerColumns = [
  "ID",
  "Type",
  "Symbole",
  "Fichier",
  "Lignes",
  "Décision",
  "Domaine cible",
  "Statut",
  "Lot",
  "Cible TS",
  "Notes",
  "Depends On",
  "Blocked By",
];

export function escapeCell(value: string | undefined): string {
  return (value ?? "")
    .replaceAll("\\", "\\\\")
    .replaceAll("|", "\\|")
    .replaceAll("\n", "<br>");
}

export function unescapeCell(value: string): string {
  return value
    .replaceAll("<br>", "\n")
    .replaceAll("\\|", "|")
    .replaceAll("\\\\", "\\");
}

export function parseMarkdownTable(content: string): TableRow[] {
  const lines = content.split(/\r?\n/);
  const headerIndex = lines.findIndex((line) =>
    line.trim().startsWith("| ID | Type | Symbole |"),
  );

  if (headerIndex === -1 || headerIndex + 2 >= lines.length) {
    return [];
  }

  const rows: TableRow[] = [];

  for (const line of lines.slice(headerIndex + 2)) {
    if (!line.trim().startsWith("|")) {
      continue;
    }

    const cells = splitRow(line);
    if (cells.length < 11) {
      continue;
    }

    const row: TableRow = {};
    ledgerColumns.forEach((column, index) => {
      row[column] = unescapeCell((cells[index] ?? "").trim());
    });
    rows.push(row);
  }

  return rows;
}

export function renderMarkdownTable(rows: TableRow[]): string {
  const header = `| ${ledgerColumns.join(" | ")} |`;
  const separator = `|${ledgerColumns.map(() => "---").join("|")}|`;
  const body = rows.map((row) => {
    const cells = ledgerColumns.map((column) => escapeCell(row[column]));
    return `| ${cells.join(" | ")} |`;
  });
  return [header, separator, ...body].join("\n");
}

function splitRow(line: string): string[] {
  const trimmed = line.trim();
  const body = trimmed.startsWith("|") ? trimmed.slice(1, -1) : trimmed;
  const cells: string[] = [];
  let current = "";
  let escaped = false;

  for (const char of body) {
    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }
    if (char === "\\") {
      current += char;
      escaped = true;
      continue;
    }
    if (char === "|") {
      cells.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  cells.push(current);

  return cells;
}
