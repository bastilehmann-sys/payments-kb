/**
 * Import Excel sheets 01-05 into typed DB tables.
 *
 * Sheet layout:
 *   Row 1: Title
 *   Row 2: Legend / meta
 *   Row 3: Section group headers (IDENTIFIKATION, BESCHREIBUNG, ...)
 *   Row 4 (index 3): Column sub-headers (actual field names)
 *   Row 5+ (index 4+): Data rows, with group-header rows where only col[0] is set
 *
 * Run: pnpm tsx scripts/import-excel-structured.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import * as XLSX from 'xlsx';
import { db } from '@/db/client';
import {
  regulatorikEntries,
  formatEntries,
  clearingEntries,
  zahlungsartEntries,
  ihbEntries,
} from '@/db/schema';
import { sql } from 'drizzle-orm';

const XLSX_PATH = path.join(
  process.env.HOME ?? '',
  'Downloads/global_payments_db.xlsx'
);

function str(v: unknown): string {
  if (v === null || v === undefined) return '';
  return String(v).trim();
}

function strOrNull(v: unknown): string | null {
  const s = str(v);
  return s.length > 0 ? s : null;
}

function readSheet(wb: XLSX.WorkBook, sheetName: string): (string | number)[][] {
  const ws = wb.Sheets[sheetName];
  if (!ws) throw new Error(`Sheet "${sheetName}" not found`);
  return XLSX.utils.sheet_to_json(ws, {
    header: 1,
    defval: '',
    blankrows: true,
  }) as (string | number)[][];
}

/** Returns true if this row is a group-header row (only col[0] set, rest empty) */
function isGroupHeaderRow(row: (string | number)[]): boolean {
  const first = str(row[0]);
  if (!first) return false;
  const rest = row.slice(1).some((v) => str(v).length > 0);
  return !rest;
}

async function importRegulatoik(wb: XLSX.WorkBook) {
  console.log('\n--- Sheet 01: Regulatorik-Glossar ---');
  const rows = readSheet(wb, '01_Regulatorik-Glossar');

  // Truncate
  await db.execute(sql`TRUNCATE TABLE regulatorik_entries`);

  const toInsert: (typeof regulatorikEntries.$inferInsert)[] = [];

  // Data starts at row index 4 (0-based), row 5 in Excel
  for (let i = 4; i < rows.length; i++) {
    const row = rows[i];
    if (isGroupHeaderRow(row)) continue;

    const name = str(row[1]);
    if (!name) continue; // skip completely empty rows

    toInsert.push({
      kuerzel: strOrNull(row[0]),
      name,
      kategorie: strOrNull(row[2]),
      typ: strOrNull(row[3]),
      beschreibung_experte: strOrNull(row[4]),
      beschreibung_einsteiger: strOrNull(row[5]),
      geltungsbereich: strOrNull(row[6]),
      status_version: strOrNull(row[7]),
      in_kraft_seit: strOrNull(row[8]),
      naechste_aenderung: strOrNull(row[9]),
      behoerde_link: strOrNull(row[10]),
      betroffene_abteilungen: strOrNull(row[11]),
      auswirkungen_experte: strOrNull(row[12]),
      auswirkungen_einsteiger: strOrNull(row[13]),
      pflichtmassnahmen_experte: strOrNull(row[14]),
      pflichtmassnahmen_einsteiger: strOrNull(row[15]),
      best_practice_experte: strOrNull(row[16]),
      best_practice_einsteiger: strOrNull(row[17]),
      risiken_experte: strOrNull(row[18]),
      risiken_einsteiger: strOrNull(row[19]),
      source_row: i + 1, // 1-based Excel row number
    });
  }

  if (toInsert.length > 0) {
    await db.insert(regulatorikEntries).values(toInsert);
  }

  console.log(`  Inserted: ${toInsert.length} rows`);
  return toInsert.length;
}

async function importFormate(wb: XLSX.WorkBook) {
  console.log('\n--- Sheet 02: Format-Bibliothek ---');
  const rows = readSheet(wb, '02_Format-Bibliothek');

  await db.execute(sql`TRUNCATE TABLE format_entries`);

  const toInsert: (typeof formatEntries.$inferInsert)[] = [];

  for (let i = 4; i < rows.length; i++) {
    const row = rows[i];
    if (isGroupHeaderRow(row)) continue;

    const format_name = str(row[0]);
    if (!format_name) continue;

    toInsert.push({
      format_name,
      nachrichtentyp: strOrNull(row[1]),
      familie_standard: strOrNull(row[2]),
      aktuelle_version: strOrNull(row[3]),
      versionshistorie: strOrNull(row[4]),
      beschreibung_experte: strOrNull(row[5]),
      beschreibung_einsteiger: strOrNull(row[6]),
      wichtige_felder: strOrNull(row[7]),
      pflichtfelder: strOrNull(row[8]),
      datenrichtung: strOrNull(row[9]),
      sap_relevanz: strOrNull(row[10]),
      fehlerquellen_experte: strOrNull(row[11]),
      fehlerquellen_einsteiger: strOrNull(row[12]),
      sap_mapping_experte: strOrNull(row[13]),
      sap_mapping_einsteiger: strOrNull(row[14]),
      projektfehler_experte: strOrNull(row[15]),
      projektfehler_einsteiger: strOrNull(row[16]),
      status: strOrNull(row[17]),
      source_row: i + 1,
    });
  }

  if (toInsert.length > 0) {
    await db.insert(formatEntries).values(toInsert);
  }

  console.log(`  Inserted: ${toInsert.length} rows`);
  return toInsert.length;
}

async function importClearing(wb: XLSX.WorkBook) {
  console.log('\n--- Sheet 03: Clearing-Systeme ---');
  const rows = readSheet(wb, '03_Clearing-Systeme');

  await db.execute(sql`TRUNCATE TABLE clearing_entries`);

  const toInsert: (typeof clearingEntries.$inferInsert)[] = [];

  for (let i = 4; i < rows.length; i++) {
    const row = rows[i];
    if (isGroupHeaderRow(row)) continue;

    const name = str(row[0]);
    if (!name) continue;

    toInsert.push({
      name,
      abkuerzung: strOrNull(row[1]),
      typ: strOrNull(row[2]),
      region: strOrNull(row[3]),
      betreiber: strOrNull(row[4]),
      beschreibung_experte: strOrNull(row[5]),
      beschreibung_einsteiger: strOrNull(row[6]),
      nachrichtenformat: strOrNull(row[7]),
      settlement_modell: strOrNull(row[8]),
      cut_off: strOrNull(row[9]),
      teilnehmer: strOrNull(row[10]),
      relevanz_experte: strOrNull(row[11]),
      relevanz_einsteiger: strOrNull(row[12]),
      corporate_zugang_experte: strOrNull(row[13]),
      corporate_zugang_einsteiger: strOrNull(row[14]),
      status: strOrNull(row[15]),
      source_row: i + 1,
    });
  }

  if (toInsert.length > 0) {
    await db.insert(clearingEntries).values(toInsert);
  }

  console.log(`  Inserted: ${toInsert.length} rows`);
  return toInsert.length;
}

async function importZahlungsarten(wb: XLSX.WorkBook) {
  console.log('\n--- Sheet 04: Zahlungsarten ---');
  const rows = readSheet(wb, '04_Zahlungsarten');

  await db.execute(sql`TRUNCATE TABLE zahlungsart_entries`);

  const toInsert: (typeof zahlungsartEntries.$inferInsert)[] = [];

  for (let i = 4; i < rows.length; i++) {
    const row = rows[i];
    if (isGroupHeaderRow(row)) continue;

    const name = str(row[0]);
    if (!name) continue;

    toInsert.push({
      name,
      kuerzel: strOrNull(row[1]),
      instrument_typ: strOrNull(row[2]),
      geltungsbereich_waehrung: strOrNull(row[3]),
      clearing_system: strOrNull(row[4]),
      nachrichtenformat: strOrNull(row[5]),
      beschreibung_experte: strOrNull(row[6]),
      beschreibung_einsteiger: strOrNull(row[7]),
      cut_off: strOrNull(row[8]),
      value_date_auftraggeber: strOrNull(row[9]),
      value_date_empfaenger: strOrNull(row[10]),
      fristen_vorlaufzeiten: strOrNull(row[11]),
      kosten: strOrNull(row[12]),
      limits: strOrNull(row[13]),
      corporate_relevanz_experte: strOrNull(row[14]),
      corporate_relevanz_einsteiger: strOrNull(row[15]),
      risiken_experte: strOrNull(row[16]),
      risiken_einsteiger: strOrNull(row[17]),
      laenderverfuegbarkeit: strOrNull(row[18]),
      laender_einschraenkungen: strOrNull(row[19]),
      source_row: i + 1,
    });
  }

  if (toInsert.length > 0) {
    await db.insert(zahlungsartEntries).values(toInsert);
  }

  console.log(`  Inserted: ${toInsert.length} rows`);
  return toInsert.length;
}

async function importIHB(wb: XLSX.WorkBook) {
  console.log('\n--- Sheet 05: IHB-POBO-COBO ---');
  const rows = readSheet(wb, '05_IHB-POBO-COBO');

  await db.execute(sql`TRUNCATE TABLE ihb_entries`);

  const toInsert: (typeof ihbEntries.$inferInsert)[] = [];

  for (let i = 4; i < rows.length; i++) {
    const row = rows[i];
    if (isGroupHeaderRow(row)) continue;

    const land = str(row[0]);
    if (!land) continue;

    toInsert.push({
      land,
      iso_waehrung: strOrNull(row[1]),
      region: strOrNull(row[2]),
      ihb_bewertung: strOrNull(row[3]),
      pobo_status: strOrNull(row[4]),
      cobo_status: strOrNull(row[5]),
      netting_erlaubt: strOrNull(row[6]),
      lokales_konto: strOrNull(row[7]),
      einschraenkungen_experte: strOrNull(row[8]),
      einschraenkungen_einsteiger: strOrNull(row[9]),
      rechtsgrundlage: strOrNull(row[10]),
      ihb_design_experte: strOrNull(row[11]),
      ihb_design_einsteiger: strOrNull(row[12]),
      sap_config_experte: strOrNull(row[13]),
      sap_config_einsteiger: strOrNull(row[14]),
      handlungsempfehlung: strOrNull(row[15]),
      source_row: i + 1,
    });
  }

  if (toInsert.length > 0) {
    await db.insert(ihbEntries).values(toInsert);
  }

  console.log(`  Inserted: ${toInsert.length} rows`);
  return toInsert.length;
}

async function main() {
  console.log('=== Structured Excel Import ===');
  console.log(`Reading: ${XLSX_PATH}\n`);

  const wb = XLSX.readFile(XLSX_PATH);

  const counts = {
    regulatorik: await importRegulatoik(wb),
    formate: await importFormate(wb),
    clearing: await importClearing(wb),
    zahlungsarten: await importZahlungsarten(wb),
    ihb: await importIHB(wb),
  };

  console.log('\n=== Summary ===');
  console.log(`  regulatorik_entries: ${counts.regulatorik}`);
  console.log(`  format_entries:      ${counts.formate}`);
  console.log(`  clearing_entries:    ${counts.clearing}`);
  console.log(`  zahlungsart_entries: ${counts.zahlungsarten}`);
  console.log(`  ihb_entries:         ${counts.ihb}`);
  console.log(`  TOTAL:               ${Object.values(counts).reduce((a, b) => a + b, 0)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
