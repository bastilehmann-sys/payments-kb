/**
 * Import Sheet 06_Länderkomplexität-Matrix from global_payments_db.xlsx
 * into the `countries` table (enrichment columns).
 *
 * Run: pnpm tsx scripts/import-excel-countries.ts
 */

// Load env FIRST before any db imports
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import * as XLSX from 'xlsx';
import { db } from '@/db/client';
import { countries } from '@/db/schema';
import { sql } from 'drizzle-orm';

const XLSX_PATH = path.join(
  process.env.HOME ?? '',
  'Downloads/global_payments_db.xlsx'
);

// Colour label → complexity mapping
function mapComplexity(label: string): string {
  const l = label.toLowerCase();
  if (l.includes('niedrig') || l.includes('gering')) return 'low';
  if (l.includes('mittel')) return 'medium';
  if (l.includes('hoch') || l.includes('sehr hoch')) return 'high';
  return 'medium';
}

// Extract ISO code from "DE / EUR" → "DE"
function extractCode(raw: string): string {
  return raw.split('/')[0].trim().replace(/\s+/g, '');
}

// Extract currency from "DE / EUR" → "EUR"
function extractCurrency(raw: string): string {
  const parts = raw.split('/');
  return parts.slice(1).join('/').trim();
}

// Build a combined summary for a group of columns
function joinFields(values: (string | number)[]): string {
  return values
    .map(v => String(v).trim())
    .filter(v => v.length > 0)
    .join(' | ');
}

interface CountryRow {
  code: string;
  name: string;
  currency: string;
  payment_infra: string;
  ihb_pobo_cobo: string;
  regulatorik: string;
  local_specifics: string;
  sap_effort: string;
  complexity: string;
  key_note: string;
}

async function main() {
  console.log('=== Excel Countries Import ===\n');
  console.log(`Reading: ${XLSX_PATH}`);

  const wb = XLSX.readFile(XLSX_PATH);
  const ws = wb.Sheets['06_Länderkomplexität-Matrix'];
  if (!ws) throw new Error('Sheet 06_Länderkomplexität-Matrix not found');

  // Read all rows as arrays (with blank cells preserved)
  const rawRows: (string | number)[][] = XLSX.utils.sheet_to_json(ws, {
    header: 1,
    defval: '',
    blankrows: true,
  });

  // Row 3 (index 3) = column headers:
  // 0:Land 1:ISO/Währung 2:Region 3:SEPA 4:Clearing 5:Instant 6:SWIFT
  // 7:IHB/POBO 8:COBO 9:Lok.Konto 10:Devisen 11:e-Invoicing 12:Steuer-ID
  // 13:Quellensteuer 14:Sanktionsrisiko 15:Lokales Format 16:SAP-Aufwand
  // 17:Gesamtkomplexität 18:Score 19:Wichtigster Hinweis

  const parsed: CountryRow[] = [];

  // Data starts at row index 4 (row 5 in Excel, 1-based)
  for (let i = 4; i < rawRows.length; i++) {
    const row = rawRows[i];
    const landRaw = String(row[0] ?? '').trim();

    // Skip group header rows (they look like "  DACH", "  Benelux" etc.)
    if (!landRaw || landRaw.startsWith('  ') || !row[1]) continue;

    const isoRaw = String(row[1] ?? '').trim();
    if (!isoRaw.includes('/')) continue; // safety check

    const code = extractCode(isoRaw);
    if (!code || code.length > 4) continue; // skip malformed

    const currency = extractCurrency(isoRaw);

    // Payment infra: Clearing + Instant + SWIFT
    const payment_infra = joinFields([row[4], row[5], row[6]]);

    // IHB/POBO/COBO: IHB/POBO + COBO/Netting + Lok. Konto erforderlich
    const ihb_pobo_cobo = joinFields([row[7], row[8], row[9]]);

    // Regulatorik: Devisen + e-Invoicing + Steuer-ID + Quellensteuer + Sanktionen
    const regulatorik = joinFields([row[10], row[11], row[12], row[13], row[14]]);

    // Local specifics: Lokales Format
    const local_specifics = String(row[15] ?? '').trim();

    // SAP effort
    const sap_effort = String(row[16] ?? '').trim();

    // Complexity from Gesamtkomplexität label (col 17)
    const complexityLabel = String(row[17] ?? '').trim();
    const complexity = mapComplexity(complexityLabel);

    // Key note
    const key_note = String(row[19] ?? '').trim();

    parsed.push({
      code,
      name: landRaw,
      currency,
      payment_infra,
      ihb_pobo_cobo,
      regulatorik,
      local_specifics,
      sap_effort,
      complexity,
      key_note,
    });
  }

  console.log(`Parsed ${parsed.length} country rows from Excel.\n`);

  let enriched = 0;
  let inserted = 0;

  for (const row of parsed) {
    // Upsert: update enrichment columns + complexity if country exists
    // Also insert if not present yet (code as unique key)
    const result = await db
      .insert(countries)
      .values({
        code: row.code,
        name: row.name,
        complexity: row.complexity,
        summary: null,
        document_id: null,
        currency: row.currency,
        payment_infra: row.payment_infra,
        ihb_pobo_cobo: row.ihb_pobo_cobo,
        regulatorik: row.regulatorik,
        local_specifics: row.local_specifics,
        sap_effort: row.sap_effort,
        key_note: row.key_note,
      })
      .onConflictDoUpdate({
        target: countries.code,
        set: {
          currency: row.currency,
          payment_infra: row.payment_infra,
          ihb_pobo_cobo: row.ihb_pobo_cobo,
          regulatorik: row.regulatorik,
          local_specifics: row.local_specifics,
          sap_effort: row.sap_effort,
          key_note: row.key_note,
          // Update complexity and name from excel as source of truth
          complexity: row.complexity,
          name: row.name,
        },
      })
      .returning({ id: countries.id, code: countries.code });

    if (result.length > 0) {
      enriched++;
    } else {
      inserted++;
    }

    process.stdout.write(`  ${row.code.padEnd(3)} — ${row.name}\n`);
  }

  // Final count
  const countResult = await db.execute(
    sql`SELECT COUNT(*) AS count, COUNT(key_note) AS enriched FROM countries`
  );
  const totals = (countResult.rows as Array<Record<string, unknown>>)[0];
  console.log(`\nDone.`);
  console.log(`  Countries upserted: ${parsed.length}`);
  console.log(`  Total in DB: ${totals['count']}`);
  console.log(`  With key_note (enriched): ${totals['enriched']}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
