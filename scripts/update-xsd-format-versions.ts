/**
 * update-xsd-format-versions.ts
 *
 * DB updates for official XSD-derived samples:
 * 1. Ensure pain.002.001.15 exists in format_versions (INSERT if missing)
 * 2. Ensure pain.007 exists in format_entries (INSERT if missing)
 * 3. Ensure pain.007.001.13 exists in format_versions, is_current=true
 * 4. Mark pain.001.001.13, pain.008.001.12 as is_current=true; demote older
 *
 * Run: pnpm tsx scripts/update-xsd-format-versions.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL required');

const sql = neon(process.env.DATABASE_URL);

async function main() {
  console.log('Updating format_versions and format_entries for XSD-derived samples...\n');

  // ── 1. Ensure pain.002.001.15 exists in format_versions ──────────────────
  const existing002_15 = await sql`
    SELECT id FROM format_versions
    WHERE format_name = 'pain.002' AND version = '001.001.15'
    LIMIT 1
  `;

  if (existing002_15.length === 0) {
    await sql`
      INSERT INTO format_versions (format_name, version, released, sample_file, is_current, notes, schema_uri, source_standard)
      VALUES (
        'pain.002',
        '001.001.15',
        '2025',
        '/samples/formate/pain.002.001.15.xml',
        true,
        'Official ISO 20022 XSD-derived sample. Aktuelle HVPS+/CBPR+ Version: GroupHeader128 mit optionalem InitgPty, DbtrAgt, CdtrAgt. PaymentTransaction178 mit TrackerData7-Block für SWIFT Tracker-Integration. Pflicht-UETR-Referenz.',
        'urn:iso:std:iso:20022:tech:xsd:pain.002.001.15',
        'ISO 20022 Payments Initiation 2025/2026'
      )
    `;
    console.log('[+] Inserted pain.002.001.15 into format_versions');
  } else {
    await sql`
      UPDATE format_versions SET
        sample_file = '/samples/formate/pain.002.001.15.xml',
        is_current = true,
        released = '2025',
        notes = 'Official ISO 20022 XSD-derived sample. Aktuelle HVPS+/CBPR+ Version: GroupHeader128 mit optionalem InitgPty, DbtrAgt, CdtrAgt. PaymentTransaction178 mit TrackerData7-Block für SWIFT Tracker-Integration. Pflicht-UETR-Referenz.',
        schema_uri = 'urn:iso:std:iso:20022:tech:xsd:pain.002.001.15',
        source_standard = 'ISO 20022 Payments Initiation 2025/2026'
      WHERE format_name = 'pain.002' AND version = '001.001.15'
    `;
    console.log('[~] Updated pain.002.001.15 in format_versions');
  }

  // Demote other pain.002 versions
  await sql`
    UPDATE format_versions SET is_current = false
    WHERE format_name = 'pain.002' AND version != '001.001.15'
  `;
  console.log('[~] Demoted older pain.002 versions (is_current = false)');

  // ── 2. Ensure pain.007 exists in format_entries ───────────────────────────
  const existing007_entry = await sql`
    SELECT id FROM format_entries
    WHERE format_name ILIKE 'pain.007%'
    LIMIT 1
  `;

  if (existing007_entry.length === 0) {
    await sql`
      INSERT INTO format_entries (
        format_name, nachrichtentyp, familie_standard, aktuelle_version,
        beschreibung_experte, beschreibung_einsteiger,
        wichtige_felder, pflichtfelder,
        datenrichtung, sap_relevanz,
        fehlerquellen_experte, fehlerquellen_einsteiger,
        status
      ) VALUES (
        'pain.007',
        'CustomerPaymentReversal',
        'ISO 20022 Payments Initiation',
        'pain.007.001.13',
        'CustomerPaymentReversal (pain.007) erlaubt die Stornierung einer zuvor initiierten Zahlung (pain.001). Das Nachrichtenformat enthält den GroupHeader, eine Referenz auf die Originalgruppe (OrgnlGrpInf mit OrgnlMsgId/OrgnlMsgNmId) und optionale OriginalPaymentInstruction-Blöcke mit individuellen Transaktionsstornierungen. Ab Version .13: GrpRvsl-Indikator, UETR-Referenz, vollständig strukturierte Adressen, PaymentTransaction174 mit OrgnlTxRef.',
        'pain.007 ist die ISO-20022-Nachricht zum Stornieren von Zahlungen. Wenn eine Zahlung falsch war (z.B. falscher Betrag, falsches Konto), schickt der Auftraggeber eine pain.007 an seine Bank. Die Nachricht enthält die Referenz der Originalnachricht und den Grund der Stornierung (z.B. DUPL = Doppelbuchung, FRAU = Betrug).',
        'GrpHdr.MsgId, GrpHdr.NbOfTxs, OrgnlGrpInf.OrgnlMsgId, OrgnlGrpInf.OrgnlMsgNmId, RvslRsnInf.Rsn.Cd, OrgnlPmtInfAndRvsl.OrgnlPmtInfId',
        'GrpHdr.MsgId, GrpHdr.CreDtTm, GrpHdr.NbOfTxs, OrgnlGrpInf.OrgnlMsgId, OrgnlGrpInf.OrgnlMsgNmId, OrgnlPmtInfAndRvsl.OrgnlPmtInfId (wenn Einzelstorno)',
        'outbound',
        'medium',
        'Stornoanfrage nach Buchungsdatum der Bank zu spät; fehlende UETR-Referenz in OrgnlTxRef; GrpRvsl=true bei Einzelstorno gesetzt; Storno-Reason-Code nicht in zulässiger Liste (DUPL/FRAU/TECH/FRAD/TXNR)',
        'Storno zu spät eingereicht — Bank hat bereits gebucht. Falscher Storno-Grund angegeben. Falsche OrgnlMsgId — Bank findet Originalzahlung nicht.',
        'aktiv'
      )
    `;
    console.log('[+] Inserted pain.007 into format_entries');
  } else {
    console.log('[=] pain.007 already exists in format_entries — skipping');
  }

  // ── 3. Ensure pain.007.001.13 exists in format_versions ──────────────────
  const existing007_13 = await sql`
    SELECT id FROM format_versions
    WHERE format_name = 'pain.007' AND version = '001.001.13'
    LIMIT 1
  `;

  if (existing007_13.length === 0) {
    await sql`
      INSERT INTO format_versions (format_name, version, released, sample_file, is_current, notes, schema_uri, source_standard)
      VALUES (
        'pain.007',
        '001.001.13',
        '2025',
        '/samples/formate/pain.007.001.13.xml',
        true,
        'Official ISO 20022 XSD-derived sample. CustomerPaymentReversal V13: GroupHeader124 mit GrpRvsl-Indikator und optionalen DbtrAgt/CdtrAgt, OriginalGroupHeader20 mit Pflicht-OrgnlMsgId/OrgnlMsgNmId, PaymentTransaction174 für Einzelstorno mit OrgnlUETR und vollständigem OrgnlTxRef.',
        'urn:iso:std:iso:20022:tech:xsd:pain.007.001.13',
        'ISO 20022 Payments Initiation 2025/2026'
      )
    `;
    console.log('[+] Inserted pain.007.001.13 into format_versions');
  } else {
    await sql`
      UPDATE format_versions SET
        sample_file = '/samples/formate/pain.007.001.13.xml',
        is_current = true,
        released = '2025',
        notes = 'Official ISO 20022 XSD-derived sample. CustomerPaymentReversal V13: GroupHeader124 mit GrpRvsl-Indikator und optionalen DbtrAgt/CdtrAgt, OriginalGroupHeader20 mit Pflicht-OrgnlMsgId/OrgnlMsgNmId, PaymentTransaction174 für Einzelstorno mit OrgnlUETR und vollständigem OrgnlTxRef.',
        schema_uri = 'urn:iso:std:iso:20022:tech:xsd:pain.007.001.13',
        source_standard = 'ISO 20022 Payments Initiation 2025/2026'
      WHERE format_name = 'pain.007' AND version = '001.001.13'
    `;
    console.log('[~] Updated pain.007.001.13 in format_versions');
  }

  // ── 4a. Mark pain.001.001.13 as is_current=true ───────────────────────────
  const res001_13 = await sql`
    UPDATE format_versions SET
      is_current = true,
      notes = 'Official ISO 20022 XSD-derived sample. Aktuellste ISO-20022-HVPS+/CBPR+-Version (2025/2026): vollständig strukturierte Adressen (PostalAddress27 mit Room-Feld) Pflicht für grenzüberschreitende Zahlungen. LEI auf Creditor-Ebene Standard, UETR-Pflichtfeld für TARGET2/HVPS+. GroupHeader114, PaymentInstruction51, CreditTransferTransaction76.',
      source_standard = 'ISO 20022 Payments Initiation 2025/2026'
    WHERE format_name = 'pain.001' AND version = '001.001.13'
  `;
  console.log('[~] Set pain.001.001.13 is_current=true');

  // Demote all other pain.001 versions
  await sql`
    UPDATE format_versions SET is_current = false
    WHERE format_name = 'pain.001' AND version != '001.001.13'
  `;
  console.log('[~] Demoted older pain.001 versions (is_current = false)');

  // ── 4b. Mark pain.008.001.12 as is_current=true ───────────────────────────
  const existing008_12 = await sql`
    SELECT id FROM format_versions
    WHERE format_name = 'pain.008' AND version = '001.001.12'
    LIMIT 1
  `;

  if (existing008_12.length === 0) {
    await sql`
      INSERT INTO format_versions (format_name, version, released, sample_file, is_current, notes, schema_uri, source_standard)
      VALUES (
        'pain.008',
        '001.001.12',
        '2025',
        '/samples/formate/pain.008.001.12.xml',
        true,
        'Official ISO 20022 XSD-derived sample. CustomerDirectDebitInitiation V12: GroupHeader118 mit Pflicht-InitgPty, PaymentInstruction50 mit Pflicht-ReqdColltnDt (Einzugsdatum), DirectDebitTransactionInformation34 mit Pflicht-InstdAmt/DbtrAgt/Dbtr/DbtrAcct. Vollständige MandateRelatedInformation16, B2B und CORE SEPA-Lastschrift.',
        'urn:iso:std:iso:20022:tech:xsd:pain.008.001.12',
        'ISO 20022 Payments Initiation 2025/2026'
      )
    `;
    console.log('[+] Inserted pain.008.001.12 into format_versions');
  } else {
    await sql`
      UPDATE format_versions SET
        sample_file = '/samples/formate/pain.008.001.12.xml',
        is_current = true,
        notes = 'Official ISO 20022 XSD-derived sample. CustomerDirectDebitInitiation V12: GroupHeader118 mit Pflicht-InitgPty, PaymentInstruction50 mit Pflicht-ReqdColltnDt (Einzugsdatum), DirectDebitTransactionInformation34 mit Pflicht-InstdAmt/DbtrAgt/Dbtr/DbtrAcct. Vollständige MandateRelatedInformation16, B2B und CORE SEPA-Lastschrift.',
        schema_uri = 'urn:iso:std:iso:20022:tech:xsd:pain.008.001.12',
        source_standard = 'ISO 20022 Payments Initiation 2025/2026'
      WHERE format_name = 'pain.008' AND version = '001.001.12'
    `;
    console.log('[~] Updated pain.008.001.12 in format_versions');
  }

  // Demote other pain.008 versions
  await sql`
    UPDATE format_versions SET is_current = false
    WHERE format_name = 'pain.008' AND version != '001.001.12'
  `;
  console.log('[~] Demoted older pain.008 versions (is_current = false)');

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n=== Summary of current versions ===');
  const currentVersions = await sql`
    SELECT format_name, version, released, is_current, sample_file
    FROM format_versions
    WHERE format_name IN ('pain.001', 'pain.002', 'pain.007', 'pain.008')
    AND is_current = true
    ORDER BY format_name, version
  `;
  for (const row of currentVersions) {
    console.log(`  ${row.format_name}.${row.version} (${row.released}) → ${row.sample_file}`);
  }

  const pain007Count = await sql`
    SELECT COUNT(*) as cnt FROM format_entries WHERE format_name ILIKE 'pain.007%'
  `;
  console.log(`\n  pain.007 format_entries: ${pain007Count[0].cnt} row(s)`);

  console.log('\nDone.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
