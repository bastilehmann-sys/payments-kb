/**
 * Import Excel sheet 07_Land_Italien into country_blocks table.
 *
 * Sheet layout:
 *   Row 1: Title
 *   Row 2: Meta / source info
 *   Row 3+: Alternating BLOCK headers and data rows
 *
 * BLOCK header rows: col 0 contains "  BLOCK N — Title", other cols empty.
 * Each block has a column-header row (Feld / Wert / Erläuterung / SAP-Relevanz) — skipped.
 * Data rows: col 0 = Feld, col 1 = Experte, col 2 = Einsteiger, col 3 = Praxis/SAP
 *
 * Run: DOTENV_CONFIG_PATH=.env.local pnpm tsx scripts/import-italien-blocks.ts
 */
import 'dotenv/config';
import { config } from 'dotenv';
import * as path from 'path';
config({ path: '.env.local' });

import * as XLSX from 'xlsx';
import { db } from '@/db/client';
import { countryBlocks, countries } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

const XLSX_PATH = path.join(
  process.env.HOME ?? '',
  'Downloads/global_payments_db.xlsx'
);

const COUNTRY_CODE = 'IT';
const SHEET_NAME = '07_Land_Italien';

function str(v: unknown): string {
  if (v === null || v === undefined) return '';
  return String(v).trim();
}

function strOrNull(v: unknown): string | null {
  const s = str(v);
  return s.length > 0 ? s : null;
}

/** Header row patterns to skip */
const HEADER_ROW_PATTERNS = [
  /^feld$/i,
  /^regelwerk/i,
  /^system\s*\/\s*bank/i,
  /^sap-thema/i,
  /^instrument/i,
  /^phase/i,
  /^bereich/i,
];

function isHeaderRow(row: unknown[]): boolean {
  const col0 = str(row[0]).toLowerCase();
  return HEADER_ROW_PATTERNS.some((p) => p.test(col0));
}

async function main() {
  console.log('=== Import Italien Blocks ===');
  console.log(`Reading: ${XLSX_PATH}`);
  console.log(`Sheet: ${SHEET_NAME}\n`);

  const wb = XLSX.readFile(XLSX_PATH);
  const ws = wb.Sheets[SHEET_NAME];
  if (!ws) throw new Error(`Sheet "${SHEET_NAME}" not found`);

  const rows = XLSX.utils.sheet_to_json(ws, {
    header: 1,
    defval: '',
    blankrows: true,
  }) as unknown[][];

  console.log(`Total rows in sheet: ${rows.length}`);

  // Truncate existing IT blocks
  console.log(`Truncating country_blocks for ${COUNTRY_CODE}...`);
  await db.delete(countryBlocks).where(eq(countryBlocks.country_code, COUNTRY_CODE));

  let currentBlockNo = 0;
  let currentBlockTitle = '';
  let rowOrder = 0;
  let insertedTotal = 0;

  const toInsert: (typeof countryBlocks.$inferInsert)[] = [];
  const blockCounts: Record<number, number> = {};

  // Walk rows starting at index 2 (row 3 in Excel, skip title + meta)
  for (let i = 2; i < rows.length; i++) {
    const row = rows[i];
    const col0 = str(row[0]);

    // Detect BLOCK header
    const blockMatch = col0.match(/BLOCK\s+(\d+)(?:\s*\([^)]*\))?\s*(?:—|-)\s*(.*)/i);
    if (blockMatch) {
      currentBlockNo = parseInt(blockMatch[1], 10);
      currentBlockTitle = blockMatch[2]?.trim() ?? `Block ${currentBlockNo}`;
      rowOrder = 0;
      blockCounts[currentBlockNo] = 0;
      console.log(`  Found BLOCK ${currentBlockNo}: "${currentBlockTitle}"`);
      continue;
    }

    // Skip if no block context yet
    if (currentBlockNo === 0) continue;

    // Skip header rows (e.g. "Feld | Wert / Details | Erläuterung | SAP-Relevanz")
    if (isHeaderRow(row)) {
      console.log(`    Skipping header row ${i + 1}: "${col0.substring(0, 40)}"`);
      continue;
    }

    // Skip completely empty rows
    if (!col0 && !str(row[1]) && !str(row[2]) && !str(row[3])) continue;

    // Skip if feld is empty
    if (!col0) continue;

    toInsert.push({
      country_code: COUNTRY_CODE,
      block_no: currentBlockNo,
      block_title: currentBlockTitle,
      row_order: rowOrder++,
      feld: col0,
      experte: strOrNull(row[1]),
      einsteiger: strOrNull(row[2]),
      praxis: strOrNull(row[3]),
    });

    blockCounts[currentBlockNo] = (blockCounts[currentBlockNo] ?? 0) + 1;
  }

  // Insert in batches of 50
  const BATCH = 50;
  for (let i = 0; i < toInsert.length; i += BATCH) {
    const batch = toInsert.slice(i, i + BATCH);
    await db.insert(countryBlocks).values(batch);
    insertedTotal += batch.length;
  }

  // Null out the document_id for IT (blocks replace the markdown)
  console.log('\nNulling out document_id for IT country...');
  await db
    .update(countries)
    .set({ document_id: null })
    .where(eq(countries.code, COUNTRY_CODE));

  console.log('\n=== Summary ===');
  for (const [blockNo, count] of Object.entries(blockCounts)) {
    console.log(`  Block ${blockNo}: ${count} rows`);
  }
  console.log(`  TOTAL rows inserted: ${insertedTotal}`);
  console.log('  IT document_id: set to null');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
