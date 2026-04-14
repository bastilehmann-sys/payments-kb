import { registerFormat } from '@/lib/formats/registry';
import type { StructureNode } from '@/lib/formats/types';

const structure: StructureNode[] = [
  {
    name: 'FPS Submission (Bank-H2H-Layer)',
    card: '1',
    type: 'Bank-spezifisch (ISO 8583 intern, MT-like oder XML extern)',
    desc: 'Faster Payments kennt kein einheitliches Corporate-Einreichformat. Jede Teilnehmerbank definiert ihr Host-to-Host-Protokoll: HSBCnet, Barclays.Net, NatWest Bankline, Lloyds Commercial Banking — jeweils als JSON/XML-API oder SWIFT-MT-ähnliche Datei. Im FPS-Netz intern läuft die Clearing-Message als ISO 8583-Variante (Pay.UK Single Immediate Payment).',
  },
  {
    name: 'Payment Instruction (Kern-Felder)',
    card: '1..N',
    type: 'Pflichtfelder je Bank-Schema',
    desc: 'Fachliche Mindestfelder. Jede Bank mapped sie in ihr Schema.',
    children: [
      { name: 'Debtor Sort Code', card: '1', type: '6n', desc: 'UK Sort Code Auftraggeber-Bank (2n Bank + 2n Area + 2n Branch).' },
      { name: 'Debtor Account Number', card: '1', type: '8n', desc: 'UK Kontonummer Auftraggeber.' },
      { name: 'Creditor Sort Code', card: '1', type: '6n', desc: 'UK Sort Code Empfänger-Bank — muss FPS-Teilnehmer sein (Lookup via Pay.UK Directory).' },
      { name: 'Creditor Account Number', card: '1', type: '8n', desc: 'UK Kontonummer Empfänger.' },
      { name: 'Creditor Name', card: '1', type: 'Max140Text', desc: 'Empfänger-Name — ab 2020 CoP-Abgleich (Confirmation of Payee) gegen Name-on-Account der Empfänger-Bank.' },
      { name: 'Amount', card: '1', type: 'GBP 2dec', desc: 'Betrag in GBP. Limit seit 01.02.2022: £1.000.000 je Transaktion (Pay.UK Board Decision).' },
      { name: 'Reference', card: '1', type: '18x', desc: 'Zahlungsreferenz — erscheint im Kontoauszug des Empfängers. Kurz, auf 18 char Legacy begrenzt (manche Bank-APIs erlauben 35/140).' },
      { name: 'Payment Type', card: '1', type: 'Code', desc: 'SIP (Single Immediate Payment), FDP (Forward Dated Payment), SOP (Standing Order Payment), RTN (Return).' },
      { name: 'End-to-End ID / UETR', card: '0..1', type: 'UUID', desc: 'Ab New Payments Architecture (NPA / ISO 20022 Migration 2027+) wird UETR Pflichtfeld.' },
    ],
  },
];

registerFormat({
  formatName: 'Faster Payments',
  region: 'UK',
  characterSet: 'swift-x',
  rejectCodeGroup: null,
  schemaUriPattern: undefined,
  structure,
  migrations: [
    {
      label: 'FPS ISO 8583 → ISO 20022 (New Payments Architecture, geplant)',
      fromVersion: 'FPS Legacy (ISO 8583 intern)',
      toVersion: 'pacs.008 / pain.001 (NPA)',
      changes: [
        { field: 'Nachrichten-Standard', oldValue: 'ISO 8583 im Clearing + bank-spezifische H2H-Einreichung', newValue: 'ISO 20022 durchgängig (pacs.008 Clearing, pain.001 Initiation)', type: 'changed' },
        { field: 'UETR-Tracking', oldValue: 'Nur interne FPS-Trace-ID', newValue: 'UETR (UUID) Pflicht — SWIFT-gpi-kompatibel für Cross-Currency Relay', type: 'new' },
        { field: 'Remittance Information', oldValue: '18 char Reference', newValue: 'Ustrd 0..N × 140 char + Strd-Block (RemtInf)', type: 'changed' },
        { field: 'Character Set', oldValue: 'SWIFT-X / ASCII', newValue: 'UTF-8 / Latin-1 erweitert', type: 'changed' },
      ],
    },
  ],
  featureDefs: [
    {
      match: /CoP|Confirmation of Payee/i,
      name: 'Confirmation of Payee (CoP)',
      what: 'Pflicht-Abgleich Empfänger-Name gegen Name-on-Account der Empfänger-Bank — seit 2020 stufenweise eingeführt, seit 2024 für alle FPS-Teilnehmer verbindlich (Pay.UK CoP Phase 2). Response-Codes: Match, Close Match (Tippfehler), No Match, Unable to check. Reduziert APP Fraud (Authorised Push Payment).',
      tokens: ['CoP', 'Confirmation of Payee', 'Name Check', 'APP Fraud'],
    },
    {
      match: /£1m|1\s*million|limit/i,
      name: 'Transaktions-Limit £1.000.000',
      what: 'Seit 01.02.2022 Limit £1m je Einzeltransaktion (vorher £250k, davor £100k). Für größere Beträge CHAPS (Real-Time Gross Settlement via Bank of England). Banken können intern niedrigere Limits setzen (z.B. £25k für Retail-Online-Banking).',
      tokens: ['£1m', 'CHAPS', 'Transaktionslimit'],
    },
    {
      match: /24\/?7|Real[- ]?time|Echtzeit/i,
      name: '24/7-Echtzeit-Verarbeitung',
      what: 'Faster Payments clearing-settled innerhalb Sekunden, 24/7/365. Keine Cut-off-Zeiten. Settlement zwischen Banken erfolgt mehrmals täglich netto in Reserve-Konten der BoE. SLA Pay.UK: 2 Stunden, Realität meist <10 Sekunden.',
      tokens: ['24/7', 'Real-time', 'Pay.UK', 'BoE'],
    },
    {
      match: /APP\s*fraud|Reimbursement/i,
      name: 'APP Fraud Reimbursement (seit 07.10.2024)',
      what: 'Pay.UK Mandatory Reimbursement Rules: bei Authorised Push Payment Fraud haften Sender- und Empfängerbank je 50% bis £85.000 (ursprünglich £415k geplant, reduziert). Gilt für Faster Payments + CHAPS. Treibt CoP-Nutzung und Real-Time-Fraud-Scoring bei allen Teilnehmern.',
      tokens: ['APP Fraud', 'Reimbursement', '£85k', 'PSR'],
    },
    {
      match: /DMEE\b/i,
      name: 'SAP DMEE-Anbindung Faster Payments',
      what: 'Kein SAP-Standard-DMEE-Baum für FPS — Einreichung läuft praktisch immer über pain.001 (CBPR+ oder UK-Local-Variante, je nach Bank). Custom-Implementierungen: DMEEX für pain.001.001.09 + Bank-API-Adapter (PI/CPI/BTP) zur Übersetzung in HSBCnet JSON oder Barclays XML. CoP-Call vor Submission via Bank-SOAP-Service.',
      tokens: ['DMEE', 'DMEEX', 'pain.001', 'Bank-API', 'CPI'],
    },
    {
      match: /NPA|New Payments Architecture/i,
      name: 'New Payments Architecture (NPA)',
      what: 'Pay.UK-Programm zur Ablösung der FPS-Legacy-Infrastruktur durch ISO-20022-basierte Plattform. Ursprünglich 2023 geplant, mehrfach verschoben; aktuelle Erwartung 2027-2028. Bringt pacs.008-Clearing, strukturierte Remittance und UETR-Tracking. Bacs + FPS sollen auf NPA konvergieren.',
      tokens: ['NPA', 'Pay.UK', 'ISO 20022', 'Konvergenz'],
    },
  ],
});
