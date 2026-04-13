/**
 * Seed format_versions table with per-version metadata for ISO 20022 format families.
 *
 * Run: pnpm db:seed:format-versions
 */
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL required');

const sql = neon(process.env.DATABASE_URL);

interface Row {
  format_name: string;
  version: string;
  released: string;
  sample_file: string;
  is_current: boolean;
  notes: string;
  schema_uri: string;
  source_standard: string;
}

const ROWS: Row[] = [
  // ── pain.001 ────────────────────────────────────────────────────────────────
  {
    format_name: 'pain.001', version: '001.001.03', released: '2009',
    sample_file: '/samples/formate/pain.001.001.03.xml', is_current: false,
    notes: 'Original EPC SEPA SCT-Basisversion (2009), weit verbreitet in SAP-Altinstallationen. Verwendet BICOrBEI im InitgPty und unstrukturierte Adresszeilen.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pain.001.001.03', source_standard: 'ISO 20022 EPC SEPA SCT 2009',
  },
  {
    format_name: 'pain.001', version: '001.001.04', released: '2010',
    sample_file: '/samples/formate/pain.001.001.04.xml', is_current: false,
    notes: 'Kleinere Erweiterungen: OrgId-Identifikation über Othr-Element, InstrId im PmtId-Block ergänzt. Kaum noch produktiv genutzt.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pain.001.001.04', source_standard: 'ISO 20022',
  },
  {
    format_name: 'pain.001', version: '001.001.05', released: '2013',
    sample_file: '/samples/formate/pain.001.001.05.xml', is_current: false,
    notes: 'SEPA CT v6.0 – LclInstrm/CORE und ChrgBr/SLEV als explizite Pflichtangaben für SEPA. Einführung strukturierter CtgyPurp-Codes.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pain.001.001.05', source_standard: 'ISO 20022 EPC SEPA SCT 2013',
  },
  {
    format_name: 'pain.001', version: '001.001.06', released: '2016',
    sample_file: '/samples/formate/pain.001.001.06.xml', is_current: false,
    notes: 'Einführung des UETR (Unique End-to-End Transaction Reference) als optionales Feld für End-to-End-Tracking. Beginn der SWIFT GPI-Kompatibilität.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pain.001.001.06', source_standard: 'ISO 20022',
  },
  {
    format_name: 'pain.001', version: '001.001.07', released: '2017',
    sample_file: '/samples/formate/pain.001.001.07.xml', is_current: false,
    notes: 'UltimateDebtor auf PmtInf-Ebene eingeführt – ermöglicht POBO/On-Behalf-Of-Szenarien. UETR wird empfohlen.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pain.001.001.07', source_standard: 'ISO 20022',
  },
  {
    format_name: 'pain.001', version: '001.001.08', released: '2019',
    sample_file: '/samples/formate/pain.001.001.08.xml', is_current: false,
    notes: 'Strukturierte Remittance Information (Strd/CdtrRefInf) als Alternative zu Ustrd empfohlen. SupplementaryData-Block erlaubt bankspezifische Erweiterungen.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pain.001.001.08', source_standard: 'ISO 20022',
  },
  {
    format_name: 'pain.001', version: '001.001.09', released: '2019',
    sample_file: '/samples/formate/pain.001.001.09.xml', is_current: true,
    notes: 'Aktueller EPC SEPA-Standard (SCT Rulebook 2023). BICFI ersetzt BIC/BICOrBEI, LEI-Unterstützung, UltimateOriginator für POBO, ReqdExctnDt als strukturiertes Datum.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pain.001.001.09', source_standard: 'ISO 20022 EPC SEPA SCT 2023',
  },
  {
    format_name: 'pain.001', version: '001.001.10', released: '2021',
    sample_file: '/samples/formate/pain.001.001.10.xml', is_current: false,
    notes: 'HVPS+/CBPR+-Erweiterungsversion: FinInstnId mit Nm und PstlAdr, LEI auf Debtor-Ebene, erweiterte Identifikationsoptionen für High-Value-Payments.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pain.001.001.10', source_standard: 'ISO 20022 HVPS+ / CBPR+',
  },
  {
    format_name: 'pain.001', version: '001.001.11', released: '2022',
    sample_file: '/samples/formate/pain.001.001.11.xml', is_current: false,
    notes: 'CPP-Konzept: strukturierte Postanschriften (StrtNm, BldgNb, PstCd, TwnNm) für grenzüberschreitende Zahlungen empfohlen.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pain.001.001.11', source_standard: 'ISO 20022 CBPR+',
  },
  {
    format_name: 'pain.001', version: '001.001.12', released: '2023',
    sample_file: '/samples/formate/pain.001.001.12.xml', is_current: false,
    notes: 'CBPR+-Harmonisierung: AddtlRmtInf im Strd-Block, Pflicht-UETR für TARGET2/T2-Zahlungen, CtrySubDvsn optional ergänzt.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pain.001.001.12', source_standard: 'ISO 20022 CBPR+',
  },
  {
    format_name: 'pain.001', version: '001.001.13', released: '2024',
    sample_file: '/samples/formate/pain.001.001.13.xml', is_current: false,
    notes: 'Aktuellste ISO-20022-HVPS+/CBPR+-Version: vollständig strukturierte Adressen Pflicht für grenzüberschreitende Zahlungen, LEI auf Creditor-Ebene.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pain.001.001.13', source_standard: 'ISO 20022 HVPS+ / CBPR+ 2024',
  },
  // ── pain.002 ────────────────────────────────────────────────────────────────
  {
    format_name: 'pain.002', version: '001.001.03', released: '2009',
    sample_file: '/samples/formate/pain.002.001.03.xml', is_current: false,
    notes: 'EPC SEPA-Standardversion (2009) für Zahlungsstatusrückmeldungen. Status-Codes ACCP/RJCT/PDNG auf Gruppen- und Transaktionsebene.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pain.002.001.03', source_standard: 'ISO 20022 EPC SEPA 2009',
  },
  {
    format_name: 'pain.002', version: '001.001.04', released: '2012',
    sample_file: '/samples/formate/pain.002.001.04.xml', is_current: false,
    notes: 'StatusReasonInformation auf Transaktionsebene, zusätzliche Rejection-Reason-Codes. Bessere Differenzierung zwischen ACCP und ACTC.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pain.002.001.04', source_standard: 'ISO 20022',
  },
  {
    format_name: 'pain.002', version: '001.001.05', released: '2014',
    sample_file: '/samples/formate/pain.002.001.05.xml', is_current: false,
    notes: 'OrgnlCreDtTm optional, verbesserte Fehlercode-Liste für SEPA-Rückgaben (R-Transaktionen). Parallelnutzung mit .03 in vielen Netzen.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pain.002.001.05', source_standard: 'ISO 20022 EPC SEPA',
  },
  {
    format_name: 'pain.002', version: '001.001.06', released: '2016',
    sample_file: '/samples/formate/pain.002.001.06.xml', is_current: false,
    notes: 'AcctSvcrRef auf Transaktionsebene für Bank-Referenzverfolgung. Erweiterter Ablehnungsgrund-Katalog (AC06, AG01, MD07).',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pain.002.001.06', source_standard: 'ISO 20022',
  },
  {
    format_name: 'pain.002', version: '001.001.07', released: '2017',
    sample_file: '/samples/formate/pain.002.001.07.xml', is_current: false,
    notes: 'UETR-Referenz in Transaktionsdetails, Alignment mit SWIFT GPI-Statusmeldungen. OrgnlUETR-Weitergabe ermöglicht.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pain.002.001.07', source_standard: 'ISO 20022',
  },
  {
    format_name: 'pain.002', version: '001.001.08', released: '2019',
    sample_file: '/samples/formate/pain.002.001.08.xml', is_current: false,
    notes: 'BICFI ersetzt BIC, LEI-Unterstützung in InitgPty, Status-Code PART (partial acceptance) für Sammler-Zahlungen.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pain.002.001.08', source_standard: 'ISO 20022',
  },
  {
    format_name: 'pain.002', version: '001.001.09', released: '2019',
    sample_file: '/samples/formate/pain.002.001.09.xml', is_current: true,
    notes: 'Aktueller EPC SEPA-Standard für Statusrückmeldungen (SCT Rulebook 2023). Vollständige Alignment mit pain.001.001.09-Referenzierung.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pain.002.001.09', source_standard: 'ISO 20022 EPC SEPA SCT 2023',
  },
  {
    format_name: 'pain.002', version: '001.001.10', released: '2021',
    sample_file: '/samples/formate/pain.002.001.10.xml', is_current: false,
    notes: 'HVPS+-Erweiterung: OriginalTransactionReference vollständig, Correspondent-Bank-Statuskette, erweiterte Intermediary-Statusinformationen.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pain.002.001.10', source_standard: 'ISO 20022 HVPS+',
  },
  {
    format_name: 'pain.002', version: '001.001.11', released: '2022',
    sample_file: '/samples/formate/pain.002.001.11.xml', is_current: false,
    notes: 'Strukturierte Adressen für RejectedParties, Erweiterung für CBPR+-Rückmeldeketten mit mehreren Intermediary-Statusblöcken.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pain.002.001.11', source_standard: 'ISO 20022 CBPR+',
  },
  {
    format_name: 'pain.002', version: '001.001.12', released: '2023',
    sample_file: '/samples/formate/pain.002.001.12.xml', is_current: false,
    notes: 'Aktuellste CBPR+-Version: vollständige Statusketten über SWIFT-Netzwerk, OriginalUETR-Pflichtfeld für TARGET2-Payments.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pain.002.001.12', source_standard: 'ISO 20022 CBPR+ 2023',
  },
  // ── pain.008 ────────────────────────────────────────────────────────────────
  {
    format_name: 'pain.008', version: '001.001.02', released: '2009',
    sample_file: '/samples/formate/pain.008.001.02.xml', is_current: false,
    notes: 'Ursprüngliche EPC SEPA-Lastschriftversion (2009). Mandatsreferenz, CdtrSchmeId und SeqTp (FRST/RCUR/OOFF/FNAL) als Kernfelder.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pain.008.001.02', source_standard: 'ISO 20022 EPC SEPA SDD 2009',
  },
  {
    format_name: 'pain.008', version: '001.001.03', released: '2012',
    sample_file: '/samples/formate/pain.008.001.03.xml', is_current: false,
    notes: 'B2B-Lastschrift-Unterstützung (LclInstrm/B2B), MandateAmendmentIndicator für geänderte Mandate. SEPA SDD Core v4.0.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pain.008.001.03', source_standard: 'ISO 20022 EPC SEPA SDD 2012',
  },
  {
    format_name: 'pain.008', version: '001.001.04', released: '2015',
    sample_file: '/samples/formate/pain.008.001.04.xml', is_current: false,
    notes: 'UltimateCreditor/UltimateDebtor eingeführt, verbesserter Rücklastschrift-Handling. ReqdColltnDt-Validierungsregeln verschärft.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pain.008.001.04', source_standard: 'ISO 20022 EPC SEPA SDD',
  },
  {
    format_name: 'pain.008', version: '001.001.05', released: '2017',
    sample_file: '/samples/formate/pain.008.001.05.xml', is_current: false,
    notes: 'Strukturierte Remittance Information (Strd), AmendmentInformation-Block für Mandatsänderungen erweitert.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pain.008.001.05', source_standard: 'ISO 20022 EPC SEPA SDD',
  },
  {
    format_name: 'pain.008', version: '001.001.06', released: '2019',
    sample_file: '/samples/formate/pain.008.001.06.xml', is_current: false,
    notes: 'BICFI-Umstellung, LEI-Unterstützung, EPC SEPA SDD COR1 (1-Tages-Vorlauf) als optionales Instrumentkennzeichen.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pain.008.001.06', source_standard: 'ISO 20022 EPC SEPA SDD 2019',
  },
  {
    format_name: 'pain.008', version: '001.001.07', released: '2019',
    sample_file: '/samples/formate/pain.008.001.07.xml', is_current: true,
    notes: 'Aktueller EPC SEPA-Standard für Lastschriften (SDD Rulebook 2023). Vollständiges Alignment mit SDD Core und B2B, strukturierte Adressen optional.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pain.008.001.07', source_standard: 'ISO 20022 EPC SEPA SDD 2023',
  },
  {
    format_name: 'pain.008', version: '001.001.08', released: '2021',
    sample_file: '/samples/formate/pain.008.001.08.xml', is_current: false,
    notes: 'HVPS+-Erweiterung: MandateRelatedInformation erweitert, ElectronicSignature-Block für E-Mandate.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pain.008.001.08', source_standard: 'ISO 20022 HVPS+',
  },
  {
    format_name: 'pain.008', version: '001.001.09', released: '2022',
    sample_file: '/samples/formate/pain.008.001.09.xml', is_current: false,
    notes: 'Strukturierte Postanschriften (CPP-Konzept) für Creditor und Debtor, MandateAuthentication für PSD2-konforme E-Mandate.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pain.008.001.09', source_standard: 'ISO 20022 CBPR+',
  },
  {
    format_name: 'pain.008', version: '001.001.10', released: '2023',
    sample_file: '/samples/formate/pain.008.001.10.xml', is_current: false,
    notes: 'Weitgehende CBPR+-Harmonisierung, UETR-Tracking für Lastschriften, CtrySubDvsn ergänzt.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pain.008.001.10', source_standard: 'ISO 20022 CBPR+ 2023',
  },
  {
    format_name: 'pain.008', version: '001.001.11', released: '2024',
    sample_file: '/samples/formate/pain.008.001.11.xml', is_current: false,
    notes: 'Aktuellste ISO-20022-Version: vollständig strukturierte Adressen Pflicht, LEI auf Creditor- und Debtor-Ebene.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:pain.008.001.11', source_standard: 'ISO 20022 CBPR+ 2024',
  },
  // ── camt.052 ────────────────────────────────────────────────────────────────
  {
    format_name: 'camt.052', version: '001.001.02', released: '2009',
    sample_file: '/samples/formate/camt.052.001.02.xml', is_current: false,
    notes: 'Erste SEPA-taugliche Intraday-Kontoberichtversion. Saldo (OPBD) und Buchungen mit BkTxCd-Domänenstruktur (PMTS/ICDT/ESCT).',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:camt.052.001.02', source_standard: 'ISO 20022 EPC SEPA 2009',
  },
  {
    format_name: 'camt.052', version: '001.001.03', released: '2012',
    sample_file: '/samples/formate/camt.052.001.03.xml', is_current: false,
    notes: 'Erweiterter TxDtls-Block mit RltdPties, Paginierungsunterstützung (MsgPgntn) für große Kontoberichte.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:camt.052.001.03', source_standard: 'ISO 20022 EPC SEPA 2012',
  },
  {
    format_name: 'camt.052', version: '001.001.04', released: '2014',
    sample_file: '/samples/formate/camt.052.001.04.xml', is_current: false,
    notes: 'ChargesInformation und InterestInformation in Transaktionsdetails. Verbesserte Buchungstyp-Kodierung (BkTxCd).',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:camt.052.001.04', source_standard: 'ISO 20022',
  },
  {
    format_name: 'camt.052', version: '001.001.05', released: '2016',
    sample_file: '/samples/formate/camt.052.001.05.xml', is_current: false,
    notes: 'Strukturierter Saldo-Typ-Block, TechInputChannel für elektronische Einreichung, erweiterte Kontoinhaber-Identifikation.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:camt.052.001.05', source_standard: 'ISO 20022',
  },
  {
    format_name: 'camt.052', version: '001.001.06', released: '2018',
    sample_file: '/samples/formate/camt.052.001.06.xml', is_current: false,
    notes: 'Erweiterter EntryStatus (PDNG/FUTR), ReportEntry-Attachment-Möglichkeit, Unterstützung mehrerer Konten in einem Bericht.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:camt.052.001.06', source_standard: 'ISO 20022',
  },
  {
    format_name: 'camt.052', version: '001.001.07', released: '2019',
    sample_file: '/samples/formate/camt.052.001.07.xml', is_current: false,
    notes: 'BICFI-Umstellung, LEI für Kontoinhaber, UETR-Referenz in Transaktionsdetails für GPI-Tracking.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:camt.052.001.07', source_standard: 'ISO 20022 EPC / SWIFT GPI',
  },
  {
    format_name: 'camt.052', version: '001.001.08', released: '2019',
    sample_file: '/samples/formate/camt.052.001.08.xml', is_current: true,
    notes: 'Aktueller EPC SEPA-Standard für Intraday-Berichte (2023). Vollständiges Alignment mit pain.001.001.09, strukturierte Remittance-Information.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:camt.052.001.08', source_standard: 'ISO 20022 EPC SEPA 2023',
  },
  {
    format_name: 'camt.052', version: '001.001.09', released: '2021',
    sample_file: '/samples/formate/camt.052.001.09.xml', is_current: false,
    notes: 'HVPS+-Erweiterung: vollständige Korrespondenzbank-Kette, Interbanken-Buchungsreferenzen, mehrstufige EntryDetails.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:camt.052.001.09', source_standard: 'ISO 20022 HVPS+',
  },
  {
    format_name: 'camt.052', version: '001.001.10', released: '2022',
    sample_file: '/samples/formate/camt.052.001.10.xml', is_current: false,
    notes: 'CPP-konforme strukturierte Postanschriften für RltdPties, CtrySubDvsn ergänzt, erweiterter BkTxCd-Katalog.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:camt.052.001.10', source_standard: 'ISO 20022 CBPR+',
  },
  {
    format_name: 'camt.052', version: '001.001.11', released: '2023',
    sample_file: '/samples/formate/camt.052.001.11.xml', is_current: false,
    notes: 'Pflicht-UETR für TARGET2-Buchungen, vollständige LEI-Unterstützung für alle beteiligten Parteien.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:camt.052.001.11', source_standard: 'ISO 20022 CBPR+ 2023',
  },
  {
    format_name: 'camt.052', version: '001.001.12', released: '2024',
    sample_file: '/samples/formate/camt.052.001.12.xml', is_current: false,
    notes: 'Aktuellste ISO-Version: vollständig strukturierte Adressen Pflicht, erweiterter AttachmentReference-Block für digitale Belege.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:camt.052.001.12', source_standard: 'ISO 20022 CBPR+ 2024',
  },
  // ── camt.053 ────────────────────────────────────────────────────────────────
  {
    format_name: 'camt.053', version: '001.001.02', released: '2009',
    sample_file: '/samples/formate/camt.053.001.02.xml', is_current: false,
    notes: 'Original End-of-Day-Kontoauszugsformat (2009). OPBD/CLBD-Salden, Buchungen mit NtryDtls und RltdPties. MT940-Ablöser in SEPA.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:camt.053.001.02', source_standard: 'ISO 20022 EPC SEPA 2009',
  },
  {
    format_name: 'camt.053', version: '001.001.03', released: '2012',
    sample_file: '/samples/formate/camt.053.001.03.xml', is_current: false,
    notes: 'ChargesInformation und InterestInformation im Buchungsblock. Erweiterte Saldotyp-Codes (ITBD, PRCD, FWAV).',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:camt.053.001.03', source_standard: 'ISO 20022 EPC SEPA 2012',
  },
  {
    format_name: 'camt.053', version: '001.001.04', released: '2014',
    sample_file: '/samples/formate/camt.053.001.04.xml', is_current: false,
    notes: 'Verbesserter BkTxCd-Block mit proprietären Erweiterungen, strukturierte Buchungsreferenzen (AcctSvcrRef), verbesserte Paginierung.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:camt.053.001.04', source_standard: 'ISO 20022',
  },
  {
    format_name: 'camt.053', version: '001.001.05', released: '2016',
    sample_file: '/samples/formate/camt.053.001.05.xml', is_current: false,
    notes: 'TechInputChannel für elektronische Zustellung, erweiterter EntryStatus, StatementFrequency-Feld für Reporting-Konfiguration.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:camt.053.001.05', source_standard: 'ISO 20022',
  },
  {
    format_name: 'camt.053', version: '001.001.06', released: '2018',
    sample_file: '/samples/formate/camt.053.001.06.xml', is_current: false,
    notes: 'AvailableDateBalance, FutureDatedBooking-Unterstützung für vorgebuchte Transaktionen.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:camt.053.001.06', source_standard: 'ISO 20022',
  },
  {
    format_name: 'camt.053', version: '001.001.07', released: '2019',
    sample_file: '/samples/formate/camt.053.001.07.xml', is_current: false,
    notes: 'BICFI-Umstellung, LEI für Kontoinhaber, UETR in Transaktionsdetails, SWIFT GPI-Statusintegration in Buchungsreferenzen.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:camt.053.001.07', source_standard: 'ISO 20022 EPC / SWIFT GPI',
  },
  {
    format_name: 'camt.053', version: '001.001.08', released: '2019',
    sample_file: '/samples/formate/camt.053.001.08.xml', is_current: true,
    notes: 'Aktueller EPC SEPA-Standard für Tageskontoauszüge (2023). Vollständige Remittance Information structured/unstructured, pain.001.001.09-Alignment.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:camt.053.001.08', source_standard: 'ISO 20022 EPC SEPA 2023',
  },
  {
    format_name: 'camt.053', version: '001.001.09', released: '2021',
    sample_file: '/samples/formate/camt.053.001.09.xml', is_current: false,
    notes: 'HVPS+-Erweiterung: mehrstufige RltdPties-Kette für Korrespondenzbank-Buchungen, erweiterte Interbanken-Referenzierung.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:camt.053.001.09', source_standard: 'ISO 20022 HVPS+',
  },
  {
    format_name: 'camt.053', version: '001.001.10', released: '2022',
    sample_file: '/samples/formate/camt.053.001.10.xml', is_current: false,
    notes: 'CPP-konforme strukturierte Postanschriften für RltdPties, CtrySubDvsn, erweiterter LEI-Support auf Buchungsebene.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:camt.053.001.10', source_standard: 'ISO 20022 CBPR+',
  },
  {
    format_name: 'camt.053', version: '001.001.11', released: '2023',
    sample_file: '/samples/formate/camt.053.001.11.xml', is_current: false,
    notes: 'Pflicht-UETR-Referenz für T2-Buchungen, digitale Anhänge (AttachmentReference), erweiterter Buchungstyp-Katalog.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:camt.053.001.11', source_standard: 'ISO 20022 CBPR+ 2023',
  },
  {
    format_name: 'camt.053', version: '001.001.12', released: '2024',
    sample_file: '/samples/formate/camt.053.001.12.xml', is_current: false,
    notes: 'Aktuellste ISO-Version: vollständig strukturierte Adresspflicht, FinancialInstrument-Buchungen ergänzt, harmonisierter BkTxCd-Katalog.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:camt.053.001.12', source_standard: 'ISO 20022 CBPR+ 2024',
  },
  // ── camt.054 ────────────────────────────────────────────────────────────────
  {
    format_name: 'camt.054', version: '001.001.02', released: '2009',
    sample_file: '/samples/formate/camt.054.001.02.xml', is_current: false,
    notes: 'Ursprüngliche Echtzeit-Buchungsbenachrichtigung (2009). Einzelbuchung pro Nachricht, BkTxCd mit PMTS/ICDT/ESCT.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:camt.054.001.02', source_standard: 'ISO 20022 EPC SEPA 2009',
  },
  {
    format_name: 'camt.054', version: '001.001.03', released: '2012',
    sample_file: '/samples/formate/camt.054.001.03.xml', is_current: false,
    notes: 'Mehrere Buchungen pro Nachricht möglich, ChargesInformation ergänzt, AcctSvcrRef für Bankrückrufungen eingeführt.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:camt.054.001.03', source_standard: 'ISO 20022 EPC SEPA 2012',
  },
  {
    format_name: 'camt.054', version: '001.001.04', released: '2014',
    sample_file: '/samples/formate/camt.054.001.04.xml', is_current: false,
    notes: 'Erweiterte NtryDtls mit batch-fähigem TxDtls-Block, verbesserte Identifikation für Sammelgutschriften.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:camt.054.001.04', source_standard: 'ISO 20022',
  },
  {
    format_name: 'camt.054', version: '001.001.05', released: '2016',
    sample_file: '/samples/formate/camt.054.001.05.xml', is_current: false,
    notes: 'Strukturierte Remittance Information in Transaktionsdetails, TechInputChannel, StatusCode PDNG für vorgebuchte Notifikationen.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:camt.054.001.05', source_standard: 'ISO 20022',
  },
  {
    format_name: 'camt.054', version: '001.001.06', released: '2018',
    sample_file: '/samples/formate/camt.054.001.06.xml', is_current: false,
    notes: 'Saldo-Block nach Buchung, FutureDatedBooking, verbesserte Proprietary-BkTxCd-Abbildung.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:camt.054.001.06', source_standard: 'ISO 20022',
  },
  {
    format_name: 'camt.054', version: '001.001.07', released: '2019',
    sample_file: '/samples/formate/camt.054.001.07.xml', is_current: false,
    notes: 'BICFI-Umstellung, LEI für Kontoinhaber und Servicer, UETR in TxDtls für Echtzeit-Buchungsbenachrichtigungen (SCTInst).',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:camt.054.001.07', source_standard: 'ISO 20022 EPC / SWIFT GPI',
  },
  {
    format_name: 'camt.054', version: '001.001.08', released: '2019',
    sample_file: '/samples/formate/camt.054.001.08.xml', is_current: true,
    notes: 'Aktueller EPC SEPA-Standard für Buchungsbenachrichtigungen (2023). Verpflichtend für SCTInst-Banken, strukturierte Remittance-Pflicht empfohlen.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:camt.054.001.08', source_standard: 'ISO 20022 EPC SEPA 2023',
  },
  {
    format_name: 'camt.054', version: '001.001.09', released: '2021',
    sample_file: '/samples/formate/camt.054.001.09.xml', is_current: false,
    notes: 'HVPS+-Variante: Korrespondenzbank-Benachrichtigungskette, Interbanken-Buchungsreferenzen, mehrstufige RltdPties-Blöcke.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:camt.054.001.09', source_standard: 'ISO 20022 HVPS+',
  },
  {
    format_name: 'camt.054', version: '001.001.10', released: '2022',
    sample_file: '/samples/formate/camt.054.001.10.xml', is_current: false,
    notes: 'CPP-konforme strukturierte Adressen für Buchungsparteien, erweiterter BkTxCd-Katalog, CtrySubDvsn für Adressdaten.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:camt.054.001.10', source_standard: 'ISO 20022 CBPR+',
  },
  {
    format_name: 'camt.054', version: '001.001.11', released: '2023',
    sample_file: '/samples/formate/camt.054.001.11.xml', is_current: false,
    notes: 'Pflicht-UETR für T2-Echtzeit-Notifikationen, LEI durchgehend für alle Parteien, AttachmentReference für digitale Quittungen.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:camt.054.001.11', source_standard: 'ISO 20022 CBPR+ 2023',
  },
  {
    format_name: 'camt.054', version: '001.001.12', released: '2024',
    sample_file: '/samples/formate/camt.054.001.12.xml', is_current: false,
    notes: 'Aktuellste ISO-Version: vollständig strukturierte Adresspflicht, FinancialInstrument-Benachrichtigungen, harmonisierter Buchungstyp-Katalog.',
    schema_uri: 'urn:iso:std:iso:20022:tech:xsd:camt.054.001.12', source_standard: 'ISO 20022 CBPR+ 2024',
  },
  // ── MT103 ────────────────────────────────────────────────────────────────────
  {
    format_name: 'MT103', version: 'legacy', released: '1995',
    sample_file: '/samples/formate/MT103.txt', is_current: false,
    notes: 'SWIFT-FIN-Format für internationale Kundenüberweisungen. Wird bis November 2025 parallel zu ISO 20022 betrieben (CBPR+ Coexistence), danach abgelöst.',
    schema_uri: '', source_standard: 'SWIFT FIN MT-Standard',
  },
];

async function main() {
  console.log(`Seeding ${ROWS.length} format_versions rows...`);

  for (const row of ROWS) {
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
      [row.format_name, row.version, row.released, row.sample_file, row.is_current, row.notes, row.schema_uri, row.source_standard]
    );
  }

  console.log(`Done. ${ROWS.length} rows upserted into format_versions.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
