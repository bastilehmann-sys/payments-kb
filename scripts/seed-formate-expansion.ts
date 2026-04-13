/**
 * Seed format_entries and format_versions with new formats from content/expansion/formate/.
 *
 * Reads every *.md in that directory, parses frontmatter via gray-matter,
 * upserts into format_entries (keyed on format_name), and inserts a single
 * "current version" row into format_versions for each new format.
 *
 * Run:
 *   DOTENV_CONFIG_PATH=.env.local pnpm tsx scripts/seed-formate-expansion.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import fs from 'node:fs';
import matter from 'gray-matter';
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL required');

const sql = neon(process.env.DATABASE_URL);

// ────────────────────────────────────────────────────────────
// Configuration: one record per new format
// ────────────────────────────────────────────────────────────

interface FormatVersionSeed {
  format_name: string;
  version: string;
  released: string;
  is_current: boolean;
  notes: string;
  schema_uri: string;
  source_standard: string;
  sample_file: string;
}

const FORMAT_VERSIONS: FormatVersionSeed[] = [
  {
    format_name: 'pain.003',
    version: '001.001.02',
    released: '2013',
    is_current: true,
    notes:
      'Aktueller EPC SEPA SDD Reversal Standard. Strukturierter RevrslRsnInf-Block mit EPC-Codes (DUPL/FRAD/TECH/CUST). Referenziert Originaltransaktion via OrgnlEndToEndId + OrgnlMndtId. Deadline: D+5 nach Fälligkeitstag.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pain.003.001.02',
    source_standard: 'ISO 20022 EPC SEPA SDD Reversal Rulebook 2013',
    sample_file: '/samples/formate/pain.003.001.02.xml',
  },
  {
    format_name: 'pain.013',
    version: '001.001.09',
    released: '2023',
    is_current: true,
    notes:
      'EPC SEPA Request-to-Pay Rulebook v2.0 (2023). LclInstrm/Cd=SRTP für SEPA RTP, RtpId als eindeutige RTP-Referenz, XpryDt als Verfalldatum, DueDt als ISO-Datum-Pflichtfeld. Response per pain.014.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pain.013.001.09',
    source_standard: 'ISO 20022 EPC SEPA RTP Rulebook v2.0 2023',
    sample_file: '/samples/formate/pain.013.001.09.xml',
  },
  {
    format_name: 'MX gpi',
    version: 'pacs.008.001.08',
    released: '2022',
    is_current: true,
    notes:
      'SWIFT gpi (Global Payments Innovation) auf pacs.008.001.08-Basis mit SWIFT gpi Service Reference Header (gSRP). UETR (UUID v4) Pflichtfeld. Tracking via SWIFT gpi Tracker. CBPR+ Pflicht ab November 2025.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pacs.008.001.08',
    source_standard: 'SWIFT gpi / ISO 20022 CBPR+ 2023',
    sample_file: '/samples/formate/mx-gpi.xml',
  },
  {
    format_name: 'CBPR+',
    version: 'pacs.008.001.08',
    released: '2022',
    is_current: true,
    notes:
      'SWIFT CBPR+ (Cross-Border Payments and Reporting Plus) Usage Guidelines 2023. BIC-basiertes Routing, Pflicht-AppHdr (BAH), UETR-Pflicht, strukturierte CPP-Adressen (StrtNm/BldgNb/PstCd/TwnNm/Ctry). Verbindlich für alle SWIFT-Mitglieder ab November 2025.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pacs.008.001.08',
    source_standard: 'SWIFT CBPR+ Implementation Guidelines 2023',
    sample_file: '/samples/formate/cbpr-plus.xml',
  },
  {
    format_name: 'MT940',
    version: 'legacy',
    released: '1974',
    is_current: false,
    notes:
      'SWIFT FIN MT940 Customer Statement Message. Field-tagged Format (:20:/:25:/:60F:/:61:/:62F:/:86:). Verbreitet per EBICS (Auftragsart STA) in Deutschland. SAP-Import via FF_5/RFEBKA00. MultiCash-Konvention für :86:-Subfelder. Wird durch camt.053 abgelöst.',
    schema_uri: '',
    source_standard: 'SWIFT FIN MT-Standard (Legacy)',
    sample_file: '/samples/formate/MT940.txt',
  },
];

// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────

function readMdFiles(dir: string): Array<{ filePath: string; data: Record<string, string>; content: string }> {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
  return files.map((file) => {
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(raw);
    return {
      filePath,
      data: parsed.data as Record<string, string>,
      content: parsed.content,
    };
  });
}

// ────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────

async function main() {
  const expansionDir = path.join(process.cwd(), 'content', 'expansion', 'formate');
  const mds = readMdFiles(expansionDir);

  console.log(`Found ${mds.length} MD files in ${expansionDir}`);

  // ── 1. Upsert format_entries ──────────────────────────────
  let entriesUpserted = 0;
  for (const { filePath, data, content } of mds) {
    const format_name = data.format_name;
    if (!format_name) {
      console.warn(`  SKIP ${filePath} — missing format_name in frontmatter`);
      continue;
    }

    // format_entries has no UNIQUE constraint on format_name —
    // delete existing row(s) first, then insert fresh.
    await sql.query(`DELETE FROM format_entries WHERE format_name = $1`, [format_name]);

    await sql.query(
      `INSERT INTO format_entries (
         format_name, nachrichtentyp, familie_standard, aktuelle_version,
         versionshistorie, beschreibung_experte, beschreibung_einsteiger,
         wichtige_felder, pflichtfelder, datenrichtung, sap_relevanz,
         fehlerquellen_experte, fehlerquellen_einsteiger,
         sap_mapping_experte, sap_mapping_einsteiger,
         projektfehler_experte, projektfehler_einsteiger,
         status
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
      [
        format_name,
        data.nachrichtentyp ?? null,
        data.familie_standard ?? null,
        data.aktuelle_version ?? null,
        null, // versionshistorie — extracted from body if needed; kept null for now
        extractSection(content, 'Experte', 'Einsteiger') ?? content.slice(0, 1000),
        extractSection(content, 'Einsteiger', '##') ?? null,
        null, // wichtige_felder — MD tables not mapped to single field
        null, // pflichtfelder
        data.datenrichtung ?? null,
        data.sap_relevanz ?? null,
        extractSection(content, 'Typische Fehlerquellen\n\n### Experte', 'Typische Fehlerquellen\n\n### Einsteiger') ?? null,
        extractSection(content, 'Typische Fehlerquellen\n\n### Einsteiger', '## Häufige') ?? null,
        extractSection(content, 'SAP-Mapping\n\n### Experte', 'SAP-Mapping\n\n### Einsteiger') ?? null,
        extractSection(content, 'SAP-Mapping\n\n### Einsteiger', '## Typische') ?? null,
        extractSection(content, 'Häufige Projektfehler\n\n### Experte', 'Häufige Projektfehler\n\n### Einsteiger') ?? null,
        extractSection(content, 'Häufige Projektfehler\n\n### Einsteiger', null) ?? null,
        data.status ?? null,
      ]
    );

    console.log(`  Upserted format_entries: ${format_name}`);
    entriesUpserted++;
  }

  // ── 2. Upsert format_versions ─────────────────────────────
  let versionsUpserted = 0;
  for (const row of FORMAT_VERSIONS) {
    await sql.query(
      `INSERT INTO format_versions (format_name, version, released, sample_file, is_current, notes, schema_uri, source_standard)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (format_name, version) DO UPDATE SET
         released        = EXCLUDED.released,
         sample_file     = EXCLUDED.sample_file,
         is_current      = EXCLUDED.is_current,
         notes           = EXCLUDED.notes,
         schema_uri      = EXCLUDED.schema_uri,
         source_standard = EXCLUDED.source_standard`,
      [
        row.format_name,
        row.version,
        row.released,
        row.sample_file,
        row.is_current,
        row.notes,
        row.schema_uri,
        row.source_standard,
      ]
    );

    console.log(`  Upserted format_versions: ${row.format_name} @ ${row.version}`);
    versionsUpserted++;
  }

  console.log(`\nDone. ${entriesUpserted} format_entries + ${versionsUpserted} format_versions upserted.`);
}

/**
 * Extract a section of markdown content between two heading markers.
 * Returns the text between the start marker and the end marker (exclusive).
 */
function extractSection(content: string, startMarker: string, endMarker: string | null): string | null {
  const startIdx = content.indexOf(startMarker);
  if (startIdx === -1) return null;
  const afterStart = content.slice(startIdx + startMarker.length).trimStart();
  if (!endMarker) return afterStart.trim();
  const endIdx = afterStart.indexOf(endMarker);
  if (endIdx === -1) return afterStart.trim();
  return afterStart.slice(0, endIdx).trim();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
