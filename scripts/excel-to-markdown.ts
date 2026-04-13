/**
 * Convert all 7 sheets of global_payments_db.xlsx to Markdown files
 * in content/excel/
 *
 * Run: pnpm tsx scripts/excel-to-markdown.ts
 */

import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';

const XLSX_PATH = path.join(
  process.env.HOME ?? '',
  'Downloads/global_payments_db.xlsx'
);

const OUTPUT_DIR = path.join(process.cwd(), 'content/excel');

// Output filename per sheet
const SHEET_FILES: Record<string, string> = {
  '01_Regulatorik-Glossar': 'excel_01_regulatorik_glossar.md',
  '02_Format-Bibliothek': 'excel_02_format_bibliothek.md',
  '03_Clearing-Systeme': 'excel_03_clearing_systeme.md',
  '04_Zahlungsarten': 'excel_04_zahlungsarten.md',
  '05_IHB-POBO-COBO': 'excel_05_ihb_pobo_cobo.md',
  '06_Länderkomplexität-Matrix': 'excel_06_laenderkomplexitaet_matrix.md',
  '07_Land_Italien': 'excel_07_land_italien.md',
};

// --- Helpers ---

function cleanCell(val: unknown): string {
  if (val === null || val === undefined) return '';
  return String(val)
    .replace(/\r?\n/g, ' ')   // collapse newlines inside cells to space
    .replace(/\|/g, '\\|')    // escape pipes for markdown tables
    .trim();
}

/**
 * Forward-fill empty leading cells from previous row (merged cell simulation).
 * Only fills from column 0 if the current row col 0 is empty.
 */
function forwardFillGroups(rows: unknown[][]): string[][] {
  const out: string[][] = [];
  let lastGroupLabel = '';
  for (const row of rows) {
    const cells = row.map(c => cleanCell(c));
    if (cells[0].trim() === '' && lastGroupLabel) {
      cells[0] = lastGroupLabel;
    } else if (cells[0].trim() !== '') {
      lastGroupLabel = cells[0];
    }
    out.push(cells);
  }
  return out;
}

/**
 * Returns true if a row looks like a section/group header
 * (first cell non-empty, all other cells empty, and content starts with spaces or ALL CAPS block name).
 */
function isGroupHeader(row: unknown[]): boolean {
  const first = String(row[0] ?? '').trim();
  if (!first) return false;
  const rest = row.slice(1).map(c => String(c ?? '').trim());
  const allEmpty = rest.every(c => c === '');
  return allEmpty && (first.startsWith('BLOCK') || /^[A-ZÄÖÜ &\-\/]+$/.test(first) || first.length < 60);
}

/**
 * Render a table from header row + data rows.
 * If a data cell exceeds 200 chars it is truncated in the table and
 * appended as a long-form subsection.
 */
function renderTable(
  headers: string[],
  rows: string[][],
  longTexts: Array<{ identifier: string; colName: string; text: string }>
): string {
  const lines: string[] = [];

  // Sanitize headers
  const headerCells = headers.map(h => cleanCell(h) || '—');
  lines.push('| ' + headerCells.join(' | ') + ' |');
  lines.push('| ' + headerCells.map(() => '---').join(' | ') + ' |');

  for (const row of rows) {
    const cells = headers.map((_, i) => {
      const val = row[i] ?? '';
      if (val.length > 200) {
        // Save long text, put placeholder
        const identifier = `${cleanCell(row[0])}_${headerCells[i]}`.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').substring(0, 60);
        longTexts.push({ identifier, colName: headerCells[i], text: val });
        return `→ [Details unten: ${identifier}]`;
      }
      return val || '—';
    });
    lines.push('| ' + cells.join(' | ') + ' |');
  }

  return lines.join('\n');
}

/**
 * Split column indices into logical groups based on header groups (merged cells in row 2).
 * Returns array of {groupName, colIndices}.
 */
function detectColumnGroups(
  groupHeaderRow: unknown[],
  subHeaderRow: unknown[]
): Array<{ groupName: string; cols: number[] }> {
  const groups: Array<{ groupName: string; cols: number[] }> = [];
  let currentGroup = '';
  let currentCols: number[] = [];

  for (let i = 0; i < subHeaderRow.length; i++) {
    const groupCell = cleanCell(groupHeaderRow[i]);
    if (groupCell) {
      // Save previous group
      if (currentCols.length > 0) {
        groups.push({ groupName: currentGroup, cols: currentCols });
      }
      currentGroup = groupCell;
      currentCols = [i];
    } else {
      currentCols.push(i);
    }
  }
  if (currentCols.length > 0) {
    groups.push({ groupName: currentGroup, cols: currentCols });
  }
  return groups;
}

/**
 * Sheet 07 (Italia) has blocks of data with 4 columns each; no column groups.
 */
function renderSheet07(rawRows: unknown[][]): string {
  const parts: string[] = [];
  const title = cleanCell(rawRows[0]?.[0]) || 'Land_Italien';
  const legend = cleanCell(rawRows[1]?.[0]) || '';

  parts.push(`# ${title}`);
  if (legend) parts.push(`\n> ${legend}`);

  let i = 2;
  while (i < rawRows.length) {
    const row = rawRows[i];
    const cell0 = String(row[0] ?? '').trim();

    // Block header (e.g. "  BLOCK 1 — Country Master")
    if (cell0.toUpperCase().includes('BLOCK') || /^\s+BLOCK/.test(String(row[0] ?? ''))) {
      const blockTitle = cell0.replace(/^\s+/, '');
      parts.push(`\n## ${blockTitle}`);
      i++;
      continue;
    }

    // Sub-header row (Feld | Wert | Erläuterung | SAP-Relevanz)
    const nextRow = rawRows[i + 1];
    if (nextRow && cell0 === 'Feld') {
      // This is a table header
      const headers = row.map(c => cleanCell(c) || '—');
      i++;
      const tableRows: string[][] = [];
      const longTexts: Array<{ identifier: string; colName: string; text: string }> = [];

      while (i < rawRows.length) {
        const dataRow = rawRows[i];
        const firstCell = String(dataRow[0] ?? '').trim();
        // Stop at next block header
        if (firstCell.toUpperCase().includes('BLOCK') || /^\s+BLOCK/.test(String(dataRow[0] ?? ''))) break;
        if (firstCell === 'Feld') break; // another header
        if (dataRow.every(c => String(c ?? '').trim() === '')) {
          i++;
          continue;
        }
        tableRows.push(dataRow.map(c => cleanCell(c)));
        i++;
      }

      if (tableRows.length > 0) {
        parts.push('\n' + renderTable(headers, tableRows, longTexts));
        for (const lt of longTexts) {
          parts.push(`\n### ${lt.identifier}\n\n${lt.text}`);
        }
      }
      continue;
    }

    // Generic data row — render as key-value if 4 cols
    if (cell0 && row.length >= 2) {
      const values = row.slice(1).map(c => cleanCell(c)).filter(v => v);
      if (values.length > 0) {
        parts.push(`\n**${cell0}**: ${values.join(' — ')}`);
      }
    }
    i++;
  }

  return parts.join('\n');
}

/**
 * Main conversion for sheets 01–06 (structured with group headers in row 2, sub-headers in row 3).
 */
function renderSheet(sheetName: string, rawRows: unknown[][]): string {
  const parts: string[] = [];

  const title = cleanCell(rawRows[0]?.[0]) || sheetName;
  const legend = cleanCell(rawRows[1]?.[0]) || '';

  parts.push(`# ${title}`);
  if (legend) parts.push(`\n> ${legend}`);

  // Row index 2 = group headers (merged cells), row index 3 = sub-headers
  const groupHeaderRow = rawRows[2] ?? [];
  const subHeaderRow = rawRows[3] ?? [];

  // Detect column groups from merged header cells
  const colGroups = detectColumnGroups(groupHeaderRow, subHeaderRow);

  // Data rows start at index 4
  const dataRows = rawRows.slice(4).filter(row => {
    const first = String(row[0] ?? '').trim();
    // Keep group header rows as section breaks
    return true;
  });

  // Separate group-header rows from data rows
  const sections: Array<{ groupLabel: string; rows: unknown[][] }> = [];
  let currentSection: { groupLabel: string; rows: unknown[][] } = { groupLabel: '', rows: [] };

  for (const row of dataRows) {
    if (isGroupHeader(row)) {
      if (currentSection.rows.length > 0 || currentSection.groupLabel) {
        sections.push(currentSection);
      }
      const label = String(row[0] ?? '').trim();
      currentSection = { groupLabel: label, rows: [] };
    } else {
      currentSection.rows.push(row);
    }
  }
  if (currentSection.rows.length > 0 || currentSection.groupLabel) {
    sections.push(currentSection);
  }

  // If >10 columns, split into groups; otherwise single table
  const totalCols = subHeaderRow.length;
  const shouldSplitCols = totalCols > 10;

  for (const section of sections) {
    if (section.groupLabel) {
      parts.push(`\n## ${section.groupLabel}`);
    }

    const dataRowsCleaned = section.rows.map(row =>
      Array.from({ length: Math.max(row.length, subHeaderRow.length) }, (_, i) =>
        cleanCell(row[i])
      )
    );

    if (dataRowsCleaned.length === 0) continue;

    const longTexts: Array<{ identifier: string; colName: string; text: string }> = [];

    if (shouldSplitCols) {
      // Render one table per column group
      for (const group of colGroups) {
        const groupHeaders = group.cols.map(i => cleanCell(subHeaderRow[i]) || `Spalte ${i}`);
        const groupRows = dataRowsCleaned.map(row => group.cols.map(i => row[i] ?? ''));

        // Skip groups where all data is empty
        const hasData = groupRows.some(r => r.some(c => c !== ''));
        if (!hasData) continue;

        if (group.groupName) {
          parts.push(`\n### ${group.groupName}`);
        }
        parts.push('\n' + renderTable(groupHeaders, groupRows, longTexts));
      }
    } else {
      // Single table
      const headers = subHeaderRow.map((h, i) => cleanCell(h) || `Spalte ${i}`);
      parts.push('\n' + renderTable(headers, dataRowsCleaned, longTexts));
    }

    // Append long-text subsections
    for (const lt of longTexts) {
      parts.push(`\n### ${lt.identifier}\n\n${lt.text}`);
    }
  }

  return parts.join('\n');
}

// --- Main ---

async function main() {
  console.log('=== Excel to Markdown Conversion ===\n');
  console.log(`Reading: ${XLSX_PATH}`);

  const wb = XLSX.readFile(XLSX_PATH);

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created directory: ${OUTPUT_DIR}`);
  }

  const results: Array<{ file: string; size: number; rows: number }> = [];

  for (const sheetName of wb.SheetNames) {
    const outputFile = SHEET_FILES[sheetName];
    if (!outputFile) {
      console.warn(`  Warning: No output file mapping for sheet "${sheetName}", skipping.`);
      continue;
    }

    const ws = wb.Sheets[sheetName];
    const rawRows: unknown[][] = XLSX.utils.sheet_to_json(ws, {
      header: 1,
      defval: '',
      blankrows: true,
    });

    let md: string;
    if (sheetName === '07_Land_Italien') {
      md = renderSheet07(rawRows);
    } else {
      md = renderSheet(sheetName, rawRows);
    }

    const outputPath = path.join(OUTPUT_DIR, outputFile);
    fs.writeFileSync(outputPath, md, 'utf-8');

    const size = Buffer.byteLength(md, 'utf-8');
    results.push({ file: outputFile, size, rows: rawRows.length });
    console.log(`  ✓ ${outputFile} (${rawRows.length} rows, ${(size / 1024).toFixed(1)} KB)`);
  }

  const totalSize = results.reduce((acc, r) => acc + r.size, 0);
  console.log(`\nDone. Generated ${results.length} files, total ${(totalSize / 1024).toFixed(1)} KB`);
  console.log(`Output directory: ${OUTPUT_DIR}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
