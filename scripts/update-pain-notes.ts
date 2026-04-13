/**
 * Update format_versions.notes for all pain.001 versions with
 * accurate per-transition summaries based on ISO 20022 / CGI-MP / EPC research.
 *
 * Run: DOTENV_CONFIG_PATH=.env.local tsx scripts/update-pain-notes.ts
 *
 * Verified facts:
 * - .03→.09 was THE big jump: structured address (PostalAddress24), UETR, LEI, BICFI
 * - .09 already has ALL structured address fields (StrtNm/BldgNb/BldgNm/Flr/PstBx/
 *   Room/PstCd/TwnNm/TwnLctnNm/DstrctNm/CtrySubDvsn/Ctry) — PostalAddress24
 * - .10: minor — Proxy on accounts, RegulatoryReporting refinements
 * - .11: minor — CardTransaction extensions, AddtlRmtInf in Strd block
 * - .12: CGI-MP 2023 — hybrid address rules tightened, extended StructuredRemittanceInformation
 *        (RfrdDocInf, TaxRmt), new Purpose/CategoryPurpose codes. NO new address fields vs .09
 * - .13: HVPS+/CBPR+ alignment, structured-address hardening (mandatory cross-border),
 *        UETR propagation rules, LEI on Creditor side, bank PstlAdr common
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL required');

const sql = neon(process.env.DATABASE_URL);

interface NoteUpdate {
  format_name: string;
  version: string;
  notes: string;
}

const UPDATES: NoteUpdate[] = [
  {
    format_name: 'pain.001',
    version: '001.001.03',
    notes: 'Original EPC SEPA SCT-Basisversion (2009), weit verbreitet in SAP-Altinstallationen. Verwendet BICOrBEI (nicht BICFI) in InitgPty, BIC (nicht BICFI) in FinInstnId, nur unstrukturierte AdrLine — kein StrtNm/BldgNb/PstCd. Kein UETR, kein LEI. ReqdExctnDt als einfacher Datums-String.',
  },
  {
    format_name: 'pain.001',
    version: '001.001.04',
    notes: 'Kleinere Erweiterungen: OrgId-Identifikation über Othr-Element ergänzt, InstrId im PmtId-Block eingeführt. Weiterhin AdrLine-only (keine strukturierte Adresse), kein UETR, kein LEI. Kaum noch produktiv genutzt.',
  },
  {
    format_name: 'pain.001',
    version: '001.001.05',
    notes: 'SEPA CT v6.0 — LclInstrm/CORE und ChrgBr/SLEV als explizite Pflichtangaben für SEPA. Strukturierte CtgyPurp-Codes eingeführt. Adressierung weiterhin nur über AdrLine (unstrukturiert), kein UETR, kein LEI.',
  },
  {
    format_name: 'pain.001',
    version: '001.001.06',
    notes: 'Einführung des UETR (Unique End-to-End Transaction Reference) als optionales Feld für Payment-Tracking. Erste SWIFT GPI-Kompatibilität. Adressierung weiterhin AdrLine-only — strukturierte PostalAddress-Felder noch nicht vorhanden.',
  },
  {
    format_name: 'pain.001',
    version: '001.001.07',
    notes: 'UltimateDebtor auf PmtInf-Ebene eingeführt — ermöglicht POBO/On-Behalf-Of-Szenarien. UETR empfohlen. Adressierung weiterhin AdrLine, kein LEI. Übergangsversion vor der großen .09-Umstellung.',
  },
  {
    format_name: 'pain.001',
    version: '001.001.08',
    notes: 'Strukturierte Remittance Information (Strd/CdtrRefInf) als Alternative zu Ustrd eingeführt. SupplementaryData-Block für bankspezifische Erweiterungen ergänzt. Adressierung weiterhin über AdrLine — letzte Version vor der PostalAddress24-Umstellung in .09.',
  },
  {
    format_name: 'pain.001',
    version: '001.001.09',
    notes: 'DIE große Umstellung (CGI-MP 2019 / EPC SEPA SCT 2023). PostalAddress24 eingeführt — alle strukturierten Adressfelder bereits hier vorhanden: StrtNm, BldgNb, BldgNm, Flr, PstBx, Room, PstCd, TwnNm, TwnLctnNm, DstrctNm, CtrySubDvsn, Ctry. Außerdem: BICFI ersetzt BIC/BICOrBEI, LEI-Unterstützung in OrgId, UETR im PmtId-Block, ReqdExctnDt als komplexes Element mit <Dt>-Kind, UltimateOriginator für POBO.',
  },
  {
    format_name: 'pain.001',
    version: '001.001.10',
    notes: 'Kleine Erweiterung gegenüber .09. Proxy auf Kontoidentifikation (CdtrAcct.Prxy) für Alias-basierte Zahlungen (E-Mail, Telefon). RegulatoryReporting-Block verfeinert. FinInstnId darf nun Nm und PstlAdr tragen. Strukturierte Adresse (PostalAddress24) identisch mit .09 — keine neuen Adressfelder.',
  },
  {
    format_name: 'pain.001',
    version: '001.001.11',
    notes: 'Kleine Erweiterung gegenüber .10. CardTransaction-Ergänzungen via SupplementaryData. AddtlRmtInf innerhalb des Strd-Blocks (enhanced RemittanceInformation). Strukturierte Adresse identisch mit .09/.10 (PostalAddress24) — keine neuen Felder. Kommentar "CPP erst ab .11" in alten Samples war ein Fehler: PostalAddress24 existiert seit .09.',
  },
  {
    format_name: 'pain.001',
    version: '001.001.12',
    notes: 'CGI-MP 2023 / CBPR+-Harmonisierung. Erweiterte StructuredRemittanceInformation: RfrdDocInf (Rechnungsreferenz mit Typ/Nummer/Datum), RfrdDocAmt, TaxRmt für Steuer-Remittance. Neue Purpose- und CategoryPurpose-Codes (z.B. TAXS). Hybride Adressregel verschärft: AdrLine und strukturierte Felder dürfen nicht mehr gemischt werden. KEINE neuen Adressfelder gegenüber .09 — PostalAddress24 unverändert.',
  },
  {
    format_name: 'pain.001',
    version: '001.001.13',
    notes: 'HVPS+/CBPR+-Alignment (2024/2025). Strukturierte Adresse (PostalAddress24, seit .09 vorhanden) wird nun für grenzüberschreitende Zahlungen als Pflicht durchgesetzt. UETR-Propagation über gesamte Zahlungskette verpflichtend. CtrySubDvsn in breitem Einsatz. LEI auf Creditor-Seite Standard. Bankadressen (DbtrAgt/CdtrAgt PstlAdr) routinemäßig befüllt.',
  },
];

async function main() {
  console.log(`Updating notes for ${UPDATES.length} pain.001 versions…`);

  for (const u of UPDATES) {
    const result = await sql`
      UPDATE format_versions
      SET    notes = ${u.notes}
      WHERE  format_name = ${u.format_name}
        AND  version     = ${u.version}
    `;
    const affected = (result as unknown as { rowCount?: number })?.rowCount ?? '?';
    console.log(`  ${u.format_name} ${u.version} — ${affected} row(s) updated`);
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
