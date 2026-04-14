import { registerFormat } from '@/lib/formats/registry';
import type { StructureNode, MigrationChange } from '@/lib/formats/types';

const structure: StructureNode[] = [
  {
    name: 'CBPR+ Usage Guidelines',
    card: '1',
    type: 'UsageGuideline',
    desc: 'CBPR+ ist KEIN eigenes Schema — sondern ein Market-Practice-Layer über pacs.008 / pacs.009 / pacs.002 / camt.053 / camt.054 etc. Definiert Pflichtfelder, Truncation- und Usage-Rules für SWIFT Cross-Border.',
    children: [
      {
        name: 'pacs.008.001.08',
        card: '1',
        type: 'FIToFICustomerCreditTransfer',
        desc: 'Customer Credit Transfer (Ersatz für MT103). Zentrale CBPR+-Nachricht.',
        children: [
          { name: 'GrpHdr', card: '1', type: 'GroupHeader93', desc: 'CBPR+: MsgId eindeutig, NbOfTxs = 1 (Single-Transaction pro Message ist CBPR+-Konvention).' },
          { name: 'CdtTrfTxInf', card: '1', type: 'CreditTransferTransaction39', desc: 'CBPR+: genau EINE Transaktion pro pacs.008-Message. UETR Pflicht.' },
          { name: 'CdtTrfTxInf/PmtId/UETR', card: '1', type: 'UUIDv4', desc: 'Pflicht — Unique End-to-end Transaction Reference.', versionFlag: 'CBPR+' },
          { name: 'CdtTrfTxInf/Dbtr/PstlAdr', card: '1', type: 'PostalAddress24', desc: 'Strukturierte Adresse Pflicht ab Nov 2025 (TwnNm + Ctry mindestens).', versionFlag: 'CBPR+' },
          { name: 'CdtTrfTxInf/Cdtr/PstlAdr', card: '1', type: 'PostalAddress24', desc: 'Strukturierte Adresse Pflicht ab Nov 2025.', versionFlag: 'CBPR+' },
          { name: 'CdtTrfTxInf/RmtInf/Ustrd', card: '0..1', type: 'Max140Text', desc: 'CBPR+ Truncation-Rule: nur 1 Instanz × 140 Zeichen (MT103 Feld 70 Äquivalent).' },
        ],
      },
      {
        name: 'pacs.009.001.08',
        card: '1',
        type: 'FinancialInstitutionCreditTransfer',
        desc: 'FI-to-FI Credit Transfer (Ersatz für MT202 / MT202COV). Core, Cover, Advice-Varianten.',
        children: [
          { name: 'CdtTrfTxInf (CORE)', card: '1', type: 'CreditTransferTransaction36', desc: 'Reiner Bank-zu-Bank-Transfer.' },
          { name: 'CdtTrfTxInf (COVE)', card: '1', type: 'CreditTransferTransaction37', desc: 'Cover Payment — begleitet pacs.008 mit UndrlygCstmrCdtTrf.', versionFlag: 'CBPR+' },
          { name: 'UndrlygCstmrCdtTrf', card: '0..1', type: 'CreditTransferTransaction38', desc: 'Referenz auf zugrundeliegende Kundenzahlung (COV-Variante).' },
        ],
      },
      {
        name: 'pacs.002.001.10',
        card: '1',
        type: 'FIToFIPaymentStatusReport',
        desc: 'Interbank Status Report (Ersatz für MT199 / Reject-Messages). ACSC/RJCT/PDNG/ACWP.',
      },
      {
        name: 'camt.056.001.08',
        card: '1',
        type: 'FIToFIPaymentCancellationRequest',
        desc: 'Payment Cancellation Request (Ersatz für MT192/MT292). Mit AssgnmtDtls + CaseId.',
      },
      {
        name: 'camt.029.001.09',
        card: '1',
        type: 'ResolutionOfInvestigation',
        desc: 'Antwort auf Cancellation / Investigation (Ersatz für MT196/MT296).',
      },
      {
        name: 'camt.053.001.08',
        card: '1',
        type: 'BankToCustomerStatement',
        desc: 'Kontoauszug (Ersatz für MT940). CBPR+: strukturierte RltdPties, BkTxCd mit Domain/Family/SubFamily.',
      },
      {
        name: 'camt.054.001.08',
        card: '1',
        type: 'BankToCustomerDebitCreditNotification',
        desc: 'Credit/Debit Notification (Ersatz für MT900/MT910).',
      },
    ],
  },
];

const mtToMxMigration: MigrationChange[] = [
  { field: 'MT103 Feld 20 (Transaction Reference)', oldValue: 'Max16Text', newValue: 'PmtId/InstrId (Max35Text) + UETR (UUID)', type: 'changed' },
  { field: 'MT103 Feld 23B (Bank Operation Code)', oldValue: 'CRED / CRTS / SPAY / SPRI / SSTD', newValue: 'PmtTpInf/SvcLvl/Cd (G001-G004) + ChrgBr', type: 'changed' },
  { field: 'MT103 Feld 32A (Value Date / Currency / Amount)', oldValue: 'YYMMDD + CCY + 15d', newValue: 'IntrBkSttlmDt + IntrBkSttlmAmt (ActiveCurrencyAndAmount)', type: 'changed' },
  { field: 'MT103 Feld 50 (Ordering Customer)', oldValue: 'Freitext 4×35 (Name + Address)', newValue: 'Dbtr/Nm + strukturierte PstlAdr (StrtNm, BldgNb, PstCd, TwnNm, Ctry)', type: 'changed' },
  { field: 'MT103 Feld 59 (Beneficiary)', oldValue: 'Freitext 4×35', newValue: 'Cdtr/Nm + strukturierte PstlAdr — Pflicht ab Nov 2025', type: 'changed' },
  { field: 'MT103 Feld 70 (Remittance Information)', oldValue: '4×35 Freitext', newValue: 'RmtInf/Ustrd (Max140Text, 1 Instanz) ODER RmtInf/Strd', type: 'changed' },
  { field: 'MT103 Feld 71A (Details of Charges)', oldValue: 'BEN / OUR / SHA', newValue: 'ChrgBr (CRED / DEBT / SHAR / SLEV)', type: 'changed' },
  { field: 'MT103 Feld 71F/71G (Charges)', oldValue: 'Einzelfelder', newValue: 'ChrgsInf (Charges7) — strukturiert mit Agent + Amount', type: 'changed' },
  { field: 'MT103 Feld 72 (Sender to Receiver)', oldValue: '6×35 mit Codes /ACC/, /INS/, /INT/, /REC/', newValue: 'InstrForNxtAgt + InstrForCdtrAgt + PrvsInstgAgt/IntrmyAgt', type: 'changed' },
  { field: 'MT202 COV', oldValue: 'MT202 mit Feldern 50a/59a', newValue: 'pacs.009 COV mit UndrlygCstmrCdtTrf-Block', type: 'changed' },
  { field: 'UETR', oldValue: '— nur via Feld 121 Block 3 (gpi)', newValue: 'Pflicht in CdtTrfTxInf/PmtId/UETR', type: 'new' },
  { field: 'Character Set', oldValue: 'SWIFT-X (beschränkter ASCII-Satz)', newValue: 'UTF-8 (voller Unicode, Latin-1-Äquivalenz empfohlen)', type: 'changed' },
];

registerFormat({
  formatName: 'CBPR+',
  schemaUriPattern: 'CBPR+ Usage Guidelines über urn:iso:std:iso:20022:tech:xsd:pacs/camt.<msg>.001.<v>',
  region: 'Global / Cross-Border',
  characterSet: 'utf-8',
  rejectCodeGroup: 'iso20022',
  structure,
  migrations: [
    {
      label: 'MT103 / MT202 → CBPR+ pacs.008 / pacs.009 (SWIFT Nov 2025)',
      fromVersion: 'MT',
      toVersion: 'MX-CBPR+',
      changes: mtToMxMigration,
    },
  ],
  featureDefs: [
    {
      match: /CBPR\+|Usage Rules?|Market Practice/i,
      name: 'CBPR+ Usage Rules',
      what: 'CBPR+ ist KEIN Schema, sondern ein Market-Practice-Layer. Definiert Einschränkungen gegenüber Base-Schema (z.B. NbOfTxs=1, Single-Transaction, Pflichtfelder, Code-Sets).',
      tokens: ['CBPR+', 'Usage Guideline', 'Market Practice'],
    },
    {
      match: /Truncation/i,
      name: 'Truncation Rules',
      what: 'CBPR+-Regeln für MT→MX-Konversion: z.B. Ustrd max 1×140 (nicht 4×35 wie MT), Adressfelder max 35 Zeichen pro Subfeld, Name max 140.',
      tokens: ['Truncation', 'Max140Text', 'Ustrd'],
    },
    {
      match: /BIC[- ]?Address|Hybrid Address/i,
      name: 'BIC Address Format / Hybrid Adresse',
      what: 'Übergangsregel bis Nov 2025: entweder strukturierte PstlAdr ODER hybride Adresse (TwnNm + Ctry + optional AdrLine). Ab Nov 2025 vollstrukturiert.',
      tokens: ['PstlAdr', 'StrtNm', 'TwnNm', 'Ctry', 'AdrLine'],
    },
    {
      match: /Enhanced Charges|Fee Transparency/i,
      name: 'Enhanced Charges / Fee Transparency',
      what: 'ChrgsInf strukturiert jede Gebühr mit Amount + Agent (BIC) — volle Transparenz welcher Korrespondent welche Gebühr abgezogen hat. Basis für SWIFT gpi SLA.',
      tokens: ['ChrgsInf', 'Charges7', 'Fee Transparency'],
    },
    {
      match: /UETR/,
      name: 'UETR Pflicht (CBPR+)',
      what: 'Unique End-to-end Transaction Reference (UUID v4) — in CBPR+ Pflicht auf jeder pacs.008/009-Transaktion. Verknüpft mit gpi Tracker.',
      tokens: ['UETR', 'gpi', 'PmtId'],
    },
    {
      match: /MT103|MT202|Legacy MT/i,
      name: 'MT→MX Coexistence (bis Nov 2025)',
      what: 'Während Coexistence-Phase akzeptiert SWIFT beide Formate. Ab 22. November 2025 End-of-Coexistence: nur noch MX-Nachrichten über FINplus erlaubt.',
      tokens: ['MT103', 'MT202', 'FINplus', 'Coexistence'],
    },
  ],
});
