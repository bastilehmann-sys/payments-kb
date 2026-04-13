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
  // ── Country-specific formats ──────────────────────────────────────────────────
  {
    format_name: 'CBI',
    version: 'CBI Globe 2.0',
    released: '2021',
    is_current: true,
    notes: 'CBI Globe v2.0 — Interoperabilitätsstandard des Consorzio CBI für Open-Banking-Zahlungen und SEPA-Überweisungen in Italien. REST-API-basiert, löst ältere CBI Hub-Batch-Einreichung schrittweise ab.',
    schema_uri: '',
    source_standard: 'Consorzio CBI — CBI Globe Standard 2021',
    sample_file: 'null',
  },
  {
    format_name: 'CBI',
    version: 'CBI Hub Legacy',
    released: '2005',
    is_current: false,
    notes: 'CBI Hub — ältere Batch-Datei-Einreichung für SEPA SCT/SDD über das italienische CBI-Interbanknetz. XML-basiert mit CBI-spezifischen Namespaces. Weitgehend durch CBI Globe und direkte pain.001-Einreichung abgelöst.',
    schema_uri: '',
    source_standard: 'Consorzio CBI — CBI Hub Specification 2005',
    sample_file: 'null',
  },
  {
    format_name: 'RIBA',
    version: 'RI.BA. Standard',
    released: '1990',
    is_current: true,
    notes: 'Ricevuta Bancaria — elektronisches Wechseläquivalent im italienischen Zahlungsverkehr. Fixed-Width-Textformat (CBI/ABI-Spezifikation). Empfänger-initierte Einzugsanweisung (Pull) mit 30/60/90-Tage-Fälligkeit. Koexistiert mit SEPA SDD; kein Migrationsdatum.',
    schema_uri: '',
    source_standard: 'ABI / CBI — RIBA Spezifikation',
    sample_file: 'null',
  },
  {
    format_name: 'FatturaPA',
    version: 'v1.2.2',
    released: '2020',
    is_current: true,
    notes: 'FatturaPA v1.2.2 — aktueller Standard für die elektronische Rechnungsstellung über das SDI (Sistema di Interscambio) der Agenzia delle Entrate. Pflicht für alle B2B/B2G-Rechnungen in Italien seit 01.01.2019 (D.Lgs. 127/2015).',
    schema_uri: 'https://www.fatturapa.gov.it/export/documenti/fatturapa/v1.2.2/Schema_del_file_xml_FatturaPA_v1.2.2.xsd',
    source_standard: 'Agenzia delle Entrate — FatturaPA v1.2.2 (2020)',
    sample_file: 'null',
  },
  {
    format_name: 'FatturaPA',
    version: 'v1.2',
    released: '2019',
    is_current: false,
    notes: 'FatturaPA v1.2 — erste Pflichtversion für alle B2B-Transaktionen ab Januar 2019. Einführung CodiceDestinatario (7-stellig) für SDI-Routing. v1.2.2 ergänzte Fehlerkorrekturen und AleniaNumeroLicenza-Feld.',
    schema_uri: '',
    source_standard: 'Agenzia delle Entrate — FatturaPA v1.2 (2019)',
    sample_file: 'null',
  },
  {
    format_name: 'SEDA',
    version: 'SEDA 2.0',
    released: '2014',
    is_current: true,
    notes: 'SEDA 2.0 — SEPA-konforme Mandatsverwaltungsplattform der ABI/CBI für SEPA Direct Debit in Italien. Elektronischer Austausch von Mandatsdaten zwischen Creditor und Debtor Bank. Verpflichtend für SDD-Einreicher in Italien.',
    schema_uri: '',
    source_standard: 'ABI / CBI — SEDA Rulebook 2014',
    sample_file: 'null',
  },
  {
    format_name: 'Bacs',
    version: 'Standard 18 (aktuell)',
    released: '2021',
    is_current: true,
    notes: 'Bacs Standard 18 (2021 Revision) — erweiterte Felder für Zahlungsreferenz und Remittance-Information. Kernformat für UK Direct Credit (Gehaltsabrechnungen) und Direct Debit (Masseneinzüge). 3-Tage-Clearing-Zyklus über Bacstel-IP.',
    schema_uri: '',
    source_standard: 'Bacs Payment Schemes Limited / Pay.UK — Standard 18 (2021)',
    sample_file: 'null',
  },
  {
    format_name: 'Bacs',
    version: 'Standard 18 (1985)',
    released: '1985',
    is_current: false,
    notes: 'Ursprüngliche digitale Spezifikation des Bacs Standard 18 (18-Byte-Records). Einführung des elektronischen Datenträgeraustauschs für UK Massenzahlungen. Basis für alle späteren Revisionen.',
    schema_uri: '',
    source_standard: 'Bacs Payment Schemes Limited — Standard 18 (1985)',
    sample_file: 'null',
  },
  {
    format_name: 'Faster Payments',
    version: 'FPS v2 (2023)',
    released: '2023',
    is_current: true,
    notes: 'UK Faster Payments Service v2 — ISO 20022-basierte Nachrichtenstruktur (pain.001 ähnlich) für Echtzeitzahlungen bis GBP 1 Mio. 24/7-Clearing über Pay.UK FPS-Infrastruktur. Pflichtformat für alle UK-Banken für Einzelüberweisungen.',
    schema_uri: '',
    source_standard: 'Pay.UK — Faster Payments Scheme 2023',
    sample_file: 'null',
  },
  {
    format_name: 'Faster Payments',
    version: 'FPS v1 (2008)',
    released: '2008',
    is_current: false,
    notes: 'Ursprüngliche FPS-Einführung 2008 — proprietäres Nachrichtenformat für UK Echtzeitzahlungen. Limit GBP 10.000 (inzwischen auf GBP 1 Mio. erhöht). Basis für das heutige New Payments Architecture (NPA).',
    schema_uri: '',
    source_standard: 'VOCA / Pay.UK — Faster Payments Scheme v1 (2008)',
    sample_file: 'null',
  },
  {
    format_name: 'NACHA',
    version: 'NACHA ACH Rules 2024',
    released: '2024',
    is_current: true,
    notes: 'NACHA ACH Operating Rules 2024 — aktuell gültige Spezifikation für US ACH-Zahlungen. Fixed-Width 94-Zeichen-Format. Einführung Same Day ACH (SDA) für alle Kredit- und Lastschrifttransaktionen bis USD 1 Mio. Neue WEB Debit-Anforderungen (Account Validation).',
    schema_uri: '',
    source_standard: 'NACHA — ACH Operating Rules 2024',
    sample_file: 'null',
  },
  {
    format_name: 'NACHA',
    version: 'NACHA ACH (2016 — Same Day)',
    released: '2016',
    is_current: false,
    notes: 'NACHA Same Day ACH Phase 1 (2016) — Einführung von Same-Day-Clearing für Credits. SEC-Codes: PPD, CCD, WEB. Zwei Clearing-Fenster täglich. Phase 2 (2017) ergänzte Same Day Debits.',
    schema_uri: '',
    source_standard: 'NACHA — Same Day ACH Rules 2016',
    sample_file: 'null',
  },
  {
    format_name: 'Fedwire FAIM',
    version: 'FAIM 3.0',
    released: '2011',
    is_current: true,
    notes: 'Fedwire Funds Application Interface Manual (FAIM) 3.0 — aktuelles Nachrichtenformat für US-Großbetragszahlungen über das Federal Reserve Fedwire Funds Service. Tag-basiertes Textformat mit proprietären Fedwire-Tags ({1000}–{8000}). Migrationsziel: ISO 20022 (2025).',
    schema_uri: '',
    source_standard: 'Federal Reserve — FAIM 3.0 (2011)',
    sample_file: 'null',
  },
  {
    format_name: 'Fedwire FAIM',
    version: 'ISO 20022 (Transition)',
    released: '2025',
    is_current: false,
    notes: 'Federal Reserve ISO 20022-Migration für Fedwire Funds — pacs.008 als Nachfolger des FAIM-Formats. Parallel-Periode (Coexistence) 2025. Vollständige ISO-20022-Pflicht für Fedwire-Teilnehmer nach abgeschlossener Migration.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pacs.008.001.08',
    source_standard: 'Federal Reserve — ISO 20022 Transition 2025',
    sample_file: 'null',
  },
  {
    format_name: 'LCR-MAG',
    version: 'LCR-MAG (CFONB Standard)',
    released: '1985',
    is_current: true,
    notes: 'LCR-MAG (Lettre de Change Relevé Magnétique) — französisches Wechsel-/Scheckinkasso-Format des CFONB. Fixed-Width-Textformat mit 160-Byte-Records. Für Wechseleinzug (traites) und Scheckinkasso. Koexistiert mit SEPA; kein Ablösedatum definiert.',
    schema_uri: '',
    source_standard: 'CFONB — LCR-MAG Spezifikation',
    sample_file: 'null',
  },
  {
    format_name: 'Cuaderno 34',
    version: 'Cuaderno 34 SEPA (2014)',
    released: '2014',
    is_current: true,
    notes: 'Cuaderno 34 SEPA (AEB/CECA-Norm) — spanische SEPA-Adaption für Überweisungsaufträge. XML-basiert (pain.001 konform) mit spanischen Erweiterungen (Spanish National Body, SNB). Pflichtformat für SEPA-Überweisungen über spanische Banken.',
    schema_uri: '',
    source_standard: 'AEB / CECA — Cuaderno 34 SEPA 2014',
    sample_file: 'null',
  },
  {
    format_name: 'Cuaderno 34',
    version: 'Cuaderno 34 Legacy (pre-SEPA)',
    released: '1996',
    is_current: false,
    notes: 'Cuaderno 34 Legacy — pre-SEPA-Version für spanische Inlandsüberweisungen. Fixed-Width-Textformat mit CCC (Código Cuenta Cliente, 20-stellige spanische Kontonummer). Vollständig durch SEPA-Version abgelöst seit 2014.',
    schema_uri: '',
    source_standard: 'AEB / CECA — Cuaderno 34 Legacy',
    sample_file: 'null',
  },
  {
    format_name: 'CLIEOP',
    version: 'CLIEOP03 (letzte Version)',
    released: '2000',
    is_current: false,
    notes: 'CLIEOP03 — letzte Version des niederländischen Massenzahlungsformats (Client Opdrachten). Fixed-Width ASCII-Format für Überweisungen und Lastschriften. Vollständig durch SEPA pain.001/pain.008 abgelöst seit 01.02.2014.',
    schema_uri: '',
    source_standard: 'Betaalvereniging Nederland — CLIEOP03',
    sample_file: 'null',
  },
  {
    format_name: 'DTAZV',
    version: 'DTAZV V4.0',
    released: '2002',
    is_current: true,
    notes: 'DTAZV V4.0 (DK-Spezifikation 2002) — letzter offizieller Standard für deutsche Auslandsüberweisungen. Fixed-Width-Textformat mit A/Q/C/Z-Sätzen. BIC/IBAN-Felder ergänzt für SWIFT-Routing. Für Drittlandzahlungen weiterhin in SAP-Altsystemen aktiv; Nachfolger pain.001 (CBPR+).',
    schema_uri: '',
    source_standard: 'Deutsche Kreditwirtschaft — DTAZV V4.0 (2002)',
    sample_file: 'null',
  },
  {
    format_name: 'DTAUS',
    version: 'DTAUS (abgekündigt 2014)',
    released: '1985',
    is_current: false,
    notes: 'DTAUS — Datenträgeraustausch Inlandszahlungsverkehr (Deutsche Kreditwirtschaft). Fixed-Width A/C/E-Sätze. Vollständig abgekündigt zum 01.02.2014 (SEPA-Pflicht). Historisches Rückgrat des deutschen Massenzahlungsverkehrs für über 30 Jahre; ersetzt durch pain.001/pain.008.',
    schema_uri: '',
    source_standard: 'Deutsche Kreditwirtschaft — DTAUS Spezifikation',
    sample_file: 'null',
  },
  {
    format_name: 'MT942',
    version: 'legacy',
    released: '1980',
    is_current: false,
    notes: 'SWIFT FIN MT942 Intraday Transaction Report. Ergänzt MT940 um Intraday-Buchungsdaten (:34F: Floor Limit, :13D: Zeitstempel, :90C/:90D: Saldo-Zwischenstände). EBICS Auftragsart VMK. Wird durch camt.052 abgelöst.',
    schema_uri: '',
    source_standard: 'SWIFT FIN MT-Standard (Legacy)',
    sample_file: 'null',
  },
  {
    format_name: 'MT101',
    version: 'legacy',
    released: '1991',
    is_current: false,
    notes: 'SWIFT FIN MT101 Request for Transfer — Corporate-to-Bank-Überweisungsauftrag via SWIFT. Unterstützt Multi-Banking (Instructing Party ≠ Account Servicing Institution). Pflicht-UETR für GPI. Nachfolger pain.001 (CBPR+ / SWIFT MX).',
    schema_uri: '',
    source_standard: 'SWIFT FIN MT-Standard (Legacy)',
    sample_file: 'null',
  },
  {
    format_name: 'MT202',
    version: 'legacy',
    released: '1973',
    is_current: false,
    notes: 'SWIFT FIN MT202 General Financial Institution Transfer — Interbank-Zahlungsformat für Korrespondenzbanken und Nostro-Konten. MT202 COV (ab 2009) mit Pflicht-Auftraggeber/Empfänger-Daten für FATF-Compliance. Nachfolger pacs.009 (ISO 20022 CBPR+).',
    schema_uri: '',
    source_standard: 'SWIFT FIN MT-Standard (Legacy)',
    sample_file: 'null',
  },
  {
    format_name: 'MT202',
    version: 'COV (2009)',
    released: '2009',
    is_current: false,
    notes: 'MT202 COV — verpflichtende Erweiterung (2009) für Cover-Zahlungen: Auftraggeber (:50A/K:) und Empfänger (:59:) müssen vollständig enthalten sein (FATF Transparency Requirements). "Nacktes" MT202 ohne COV-Kennzeichnung für Cover-Flows nicht mehr zulässig.',
    schema_uri: '',
    source_standard: 'SWIFT FIN MT-Standard — COV Amendment 2009',
    sample_file: 'null',
  },
  {
    format_name: 'Zengin Text',
    version: 'Zengin 120-Byte (aktuell)',
    released: '1992',
    is_current: true,
    notes: 'Zengin File Format 120-Byte-Records (全銀協フォーマット) — aktueller Standard des japanischen Zengin Data Telecommunication System. 1/2/8/9-Satz-Struktur mit Bankcode (4-stellig), Filialcode (3-stellig), Kontonummer (7-stellig), Kontoinhaber in Katakana (Shift-JIS). Betrag in Yen (keine Dezimalstellen).',
    schema_uri: '',
    source_standard: '全国銀行協会 (Japanese Bankers Association) — Zengin Format',
    sample_file: 'null',
  },
  {
    format_name: 'Zengin Text',
    version: 'Zengin 80-Byte (Legacy)',
    released: '1973',
    is_current: false,
    notes: 'Ursprüngliches Zengin-Format mit 80-Byte-Records (Lochkarten-Ära). Magnetband-Austausch zwischen japanischen Banken. 1992 auf 120-Byte-Records erweitert um mehr Felder (Empfängername, Referenz). Nicht mehr in Verwendung.',
    schema_uri: '',
    source_standard: '全国銀行協会 — Zengin Format (Legacy)',
    sample_file: 'null',
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
