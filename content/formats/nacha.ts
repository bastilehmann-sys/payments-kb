import { registerFormat } from '@/lib/formats/registry';
import type { StructureNode, Migration } from '@/lib/formats/types';

const structure: StructureNode[] = [
  {
    name: 'File Header Record (Type 1)',
    card: '1',
    type: 'Fixed 94 char',
    desc: 'Datei-Header. Felder: Immediate Destination (10n, RDFI-Routing mit führendem Blank), Immediate Origin (10n, ODFI/Company-ID), File Creation Date (YYMMDD), File Creation Time (HHMM), File ID Modifier (1A), Record Size=094, Blocking Factor=10, Format Code=1.',
  },
  {
    name: 'Batch Header Record (Type 5)',
    card: '1..N',
    type: 'Fixed 94 char',
    desc: 'Batch-Header mit Service Class Code (200=Mixed, 220=Credits only, 225=Debits only), Company Name (16), Company Identifier (10), Standard Entry Class Code (3a — siehe SEC Codes), Company Entry Description (10), Effective Entry Date (YYMMDD), Originating DFI Identification (8n), Batch Number (7n).',
    children: [
      { name: 'SEC Code PPD', card: '0..N', type: '3a', desc: 'Prearranged Payment and Deposit — Consumer (Payroll, Social Security, Rent). Einzel-Authorization.' },
      { name: 'SEC Code CCD', card: '0..N', type: '3a', desc: 'Corporate Credit or Debit — B2B. Max 1 Addenda-Record.' },
      { name: 'SEC Code CTX', card: '0..N', type: '3a', desc: 'Corporate Trade Exchange — B2B mit bis zu 9.999 Addenda-Records, die ISO 20022 pain-Remittance tragen (Strd RmtInf).' },
      { name: 'SEC Code WEB', card: '0..N', type: '3a', desc: 'Internet-Initiated Entry — Consumer-Debit via Web-Auth. Commercially Reasonable Fraud Detection erforderlich (NACHA Rule 2021).' },
      { name: 'SEC Code TEL', card: '0..N', type: '3a', desc: 'Telephone-Initiated Entry — Consumer-Debit mit oral/written Authorization.' },
      { name: 'SEC Code IAT', card: '0..N', type: '3a', desc: 'International ACH Transaction — OFAC-Screening Pflicht; 7 Addenda-Records für BSA Travel Rule Daten.' },
    ],
  },
  {
    name: 'Entry Detail Record (Type 6)',
    card: '1..N',
    type: 'Fixed 94 char',
    desc: 'Einzel-Entry. Transaction Code (22=Checking Credit, 27=Checking Debit, 32=Savings Credit, 37=Savings Debit), Receiving DFI Identification (9n mit ABA-MOD-10-Prüfziffer an Pos. 9), DFI Account Number (17A), Amount (10n in Cents), Individual ID Number (15A), Individual Name (22A), Addenda Record Indicator (1n), Trace Number (15n).',
  },
  {
    name: 'Addenda Record (Type 7)',
    card: '0..N',
    type: 'Fixed 94 char',
    desc: 'Zusatzinformationen. Addenda Type Code 05=Standard PPD/CCD Remittance (80A Free-Form), 07=CCD/CTX Structured mit ISO 20022 XML-Tags (ISA/IEA X12-820 oder pain.001 RmtInf), 98=Notification of Change, 99=Return Reason.',
  },
  {
    name: 'Batch Control Record (Type 8)',
    card: '1..N',
    type: 'Fixed 94 char',
    desc: 'Batch-Trailer: Entry/Addenda Count, Entry Hash (Sum der RDFI-Routing-Numbers, rightmost 10 Digits), Total Debit Amount, Total Credit Amount, Company Identifier, Originating DFI Identification.',
  },
  {
    name: 'File Control Record (Type 9)',
    card: '1',
    type: 'Fixed 94 char',
    desc: 'Datei-Trailer: Batch Count, Block Count (Records/10, mit 9-Filler aufgefüllt), Entry/Addenda Count, Entry Hash, Total Debit/Credit Amount. Prüfsumme für ODFI-Validation vor Einreichung.',
  },
];

const migrations: Migration[] = [
  {
    label: 'Same Day ACH Rollout 2016-2022',
    fromVersion: 'Next-Day ACH',
    toVersion: 'Same Day ACH (Phase 1-3 + Limit Increase)',
    changes: [
      { field: 'Phase 1 (Sep 2016)', oldValue: 'Nur Next-Day Settlement', newValue: 'Same Day Credits, 10:30 AM ET Cut-Off', type: 'new' },
      { field: 'Phase 2 (Sep 2017)', oldValue: 'Credits only Same Day', newValue: 'Same Day Debits aufgenommen', type: 'changed' },
      { field: 'Phase 3 (Mar 2018)', oldValue: '2 Settlement Windows', newValue: '3. Window 16:45 PM ET Cut-Off, RDFI Funds-Availability 17:00 PM', type: 'new' },
      { field: 'Limit (Mar 2020)', oldValue: '$25.000 per Entry', newValue: '$100.000 per Entry', type: 'changed' },
      { field: 'Limit (Mar 2022)', oldValue: '$100.000 per Entry', newValue: '$1.000.000 per Entry', type: 'changed' },
    ],
  },
  {
    label: 'IAT SEC Code Expansion (BSA/OFAC)',
    fromVersion: 'CBR/PBR Legacy',
    toVersion: 'IAT (Sep 2009)',
    changes: [
      { field: 'OFAC-Screening', oldValue: 'Optional', newValue: 'Pflicht für ODFI und RDFI bei jedem IAT Entry (31 CFR)', type: 'new' },
      { field: 'Addenda-Records', oldValue: '0-1 (CBR/PBR)', newValue: '7 Pflicht-Addenda (Originator Name/Address, Beneficiary Name/Address, Correspondent Bank, Foreign Currency)', type: 'new' },
      { field: 'Legacy CBR/PBR', oldValue: 'Cross-Border Credit/Debit SEC', newValue: 'Ersetzt durch IAT — CBR/PBR retired', type: 'removed' },
    ],
  },
  {
    label: 'NACHA Rule 2021 — WEB Fraud Detection',
    fromVersion: 'WEB (pre-2021)',
    toVersion: 'WEB (ab 19.03.2021)',
    changes: [
      { field: 'Account Validation', oldValue: 'Empfehlung, nicht durchgesetzt', newValue: 'ODFI muss "Commercially Reasonable Fraudulent Transaction Detection" für erste Debit-Nutzung einsetzen (Account-Status-Check oder Prenotification)', type: 'new' },
    ],
  },
];

registerFormat({
  formatName: 'NACHA',
  region: 'USA',
  characterSet: 'us-ascii',
  rejectCodeGroup: 'nacha',
  schemaUriPattern: undefined,
  structure,
  migrations,
  featureDefs: [
    {
      match: /SEC\s*Code|Standard\s*Entry\s*Class/i,
      name: 'Standard Entry Class Codes',
      what: 'Der SEC Code im Batch Header (Pos. 51-53) bestimmt Authorization-Regeln, Return-Fristen und Addenda-Limits. PPD/WEB/TEL = Consumer (60-Tage-Rückgabe bei Unauthorized R10). CCD/CTX = Corporate (2 Banking Days R29). IAT = International mit OFAC-Pflicht. Falscher SEC Code führt zu R05-Return bei Consumer/Corporate-Mix.',
      tokens: ['PPD', 'CCD', 'CTX', 'WEB', 'TEL', 'IAT', 'SEC'],
    },
    {
      match: /Addenda/i,
      name: 'Addenda Records (Type 05 / 07)',
      what: 'Type 05 = 80 Zeichen Free-Form für PPD/CCD (z. B. Invoice-Nummer). Type 07 = CCD/CTX Structured mit X12-820-EDI oder ISO 20022 pain-Remittance-Tags — trägt strukturierte Rechnungsdaten. CTX erlaubt bis 9.999 Addenda pro Entry = Multi-Invoice-Payments. SAP FSCM-BCM NACHA-Connector mappt pain.001/RmtInf/Strd → Type-07-Addenda.',
      tokens: ['Addenda 05', 'Addenda 07', 'CTX Remittance', 'X12-820'],
    },
    {
      match: /Same\s*Day\s*ACH|SDA/i,
      name: 'Same Day ACH Cut-Offs',
      what: 'Drei Processing-Windows: 10:30 AM ET, 14:45 PM ET, 16:45 PM ET (seit Phase 3 März 2021). Settlement am selben Banking Day; RDFI Funds-Availability bis 17:00 PM ET (Rule 2021). Per-Entry-Limit seit März 2022 bei $1 Mio. IAT und Entries > $1M gehen weiterhin Next-Day. Effective Entry Date = heute → Same Day; = +1 → Next Day.',
      tokens: ['Same Day', 'SDA', 'Cut-Off', '10:30 AM', '16:45 PM'],
    },
    {
      match: /Prefunding|Pre[- ]?funding/i,
      name: 'Prefunding Rules für Credit-Originators',
      what: 'Nach Fed Reg-E + NACHA-Risk-Management müssen viele ODFIs Credit-Originators pre-funden (ODFI debitet Originator-Account vor Settlement). Alternative: Approved-Credit-Line mit Exposure-Limits. Betrifft Same Day ACH Credits besonders, weil Settlement-Timing verkürzt ist.',
      tokens: ['Prefunding', 'Exposure Limit', 'ODFI Credit'],
    },
    {
      match: /R\d{2}|Return\s*Code/i,
      name: 'R-Code Returns',
      what: 'RDFI retourniert via Addenda-Type-99 mit R-Code. Fristen: 2 Banking Days (Standard), 60 Kalendertage (R07/R10 Consumer Unauthorized), 2 Banking Days (R29 Corporate Unauthorized). Dishonored Returns (R61-R69) mit 5-Banking-Days-Frist. SAP FSCM-BCM NACHA-Connector parst ACH-Return-File und matcht Trace-Number zurück auf Original-Zahlung.',
      tokens: ['R01', 'R10', 'R29', 'Addenda 99', 'Dishonored'],
    },
    {
      match: /FSCM[- ]?BCM|NACHA[- ]?Connector/i,
      name: 'SAP FSCM-BCM NACHA-Connector',
      what: 'Bank Communication Management mit NACHA-Connector: F110 → DMEE-Baum (nicht DMEEX, da Flat-File) → 94-Byte-Fixed-Width-File → SFTP/ftpS an ODFI. Inbound Returns (ACH Return File) werden via Payment Status Management in FSCM importiert, Trace Number matcht Auftrag in REGUH/REGUP. Entry-Hash-Validierung (rechte 10 Digits der ABA Routing Sum) vor Versand.',
      tokens: ['FSCM-BCM', 'DMEE', 'F110', 'ODFI'],
    },
  ],
});
