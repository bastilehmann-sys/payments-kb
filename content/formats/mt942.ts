import { registerFormat } from '@/lib/formats/registry';
import type { StructureNode } from '@/lib/formats/types';

const structure: StructureNode[] = [
  { name: ':20:', card: '1', type: '16x', desc: 'Transaction Reference Number — Referenz dieses Intraday-Reports.' },
  { name: ':21:', card: '0..1', type: '16x', desc: 'Related Reference — Bezug auf vorherige Nachricht.' },
  { name: ':25:', card: '1', type: '35x', desc: 'Account Identification — IBAN oder Konto-ID.' },
  { name: ':28C:', card: '1', type: '5n[/5n]', desc: 'Statement Number / Sequence Number — Intraday-Report kann mehrfach pro Tag gesendet werden (z.B. stündlich).' },
  { name: ':34F:', card: '1..N', type: '3!a[1!a]15d', desc: 'Floor Limit — Mindestbetrag pro Debit bzw. Credit. Bei einem Tag: beide Richtungen; bei zwei Tags: :34F: DEBIT + :34F: CREDIT getrennt.' },
  { name: ':13D:', card: '1', type: '6!n4!n1!x4!n', desc: 'Date/Time Indication — Zeitstempel der Report-Erstellung mit UTC-Offset (z.B. 2604131430+0100).' },
  {
    name: ':61:',
    card: '0..N',
    type: '6!n[4!n]2a[1!a]15d1!a3!c16x[//16x][34x]',
    desc: 'Statement Line — Buchungszeile (repeating, identisch zu MT940: Value Date, Entry Date, D/C, Amount, Transaction Type, Refs).',
  },
  { name: ':86:', card: '0..1', type: '6*65x', desc: 'Information to Account Owner — Detailinfo zur :61: Zeile (GVC-Codes bei DE-Banken).' },
  { name: ':90D:', card: '0..1', type: '5n3!a15d', desc: 'Number and Sum of Debit Entries — Anzahl und Summe aller Debit-Buchungen im Report.' },
  { name: ':90C:', card: '0..1', type: '5n3!a15d', desc: 'Number and Sum of Credit Entries — Anzahl und Summe aller Credit-Buchungen.' },
  { name: ':86:', card: '0..1', type: '6*65x', desc: 'Information to Account Owner (Footer) — Gesamtinformation zum Intraday-Report.' },
];

registerFormat({
  formatName: 'MT942',
  region: 'Global / SWIFT FIN (Legacy)',
  characterSet: 'swift-x',
  rejectCodeGroup: 'swift-mt',
  schemaUriPattern: undefined,
  structure,
  migrations: [
    {
      label: 'SWIFT MT942 → camt.052 (CBPR+, Nov 2025)',
      fromVersion: 'MT942',
      toVersion: 'camt.052.001.08',
      changes: [
        { field: 'Nachrichtenformat', oldValue: 'MT942 Tag-basiert', newValue: 'camt.052 BankToCustomerAccountReport XML', type: 'changed' },
        { field: 'Floor Limit', oldValue: ':34F: DEBIT/CREDIT', newValue: 'Entfällt — camt.052 nutzt RptgSeq mit FrDtTm/ToDtTm für Filterung', type: 'removed' },
        { field: 'Summen', oldValue: ':90D:/:90C:', newValue: 'TxsSummry (TtlNtries / TtlCdtNtries / TtlDbtNtries)', type: 'changed' },
        { field: 'Timestamp', oldValue: ':13D: 6!n4!n1!x4!n', newValue: 'CreDtTm (ISODateTime mit Timezone)', type: 'changed' },
        { field: 'Buchungs-Entry', oldValue: ':61: + :86:', newValue: 'Ntry + NtryDtls + TxDtls', type: 'changed' },
      ],
    },
  ],
  featureDefs: [
    {
      match: /Intraday|MT942/i,
      name: 'Intraday Reporting',
      what: 'Zwischenauszug mehrfach pro Tag (stündlich / bei jeder Bewegung). Treasury nutzt MT942 für Liquiditäts-Cutoff-Steuerung und Cash-Concentration.',
      tokens: ['Intraday', 'Liquidity', 'Cutoff'],
    },
    {
      match: /Floor\s*Limit|:34F:/i,
      name: 'Floor Limit (:34F:)',
      what: 'Nur Buchungen oberhalb des Floor Limit werden gemeldet — spart Volumen bei Retail-Konten mit vielen Kleinbeträgen. Kann pro Richtung (DEBIT/CREDIT) unterschiedlich sein.',
      tokens: ['34F', 'Floor Limit'],
    },
    {
      match: /SAP\s*(FF\.5|FEBAN|BAM|In-House\s*Cash)/i,
      name: 'SAP FF.5 Intraday + BAM / IHC',
      what: 'SAP importiert MT942 via FF.5 oder BCM, Bank Account Management (BAM) nutzt Intraday-Saldi für Liquiditäts-Dashboard, In-House Cash bucht Intercompany-Zahlungen auf Basis MT942.',
      tokens: ['FF.5', 'BAM', 'IHC', 'In-House Cash'],
    },
    {
      match: /GVC|Geschäftsvorfall/i,
      name: 'GVC-Codes in :86: (DE)',
      what: 'Wie MT940: DE-Banken nutzen 3-stellige Geschäftsvorfall-Codes + Subfelder ?20-?29 (Verwendungszweck), ?30/?31 (Gegenkonto-BLZ/Nr).',
      tokens: ['GVC', '?00', '?20'],
    },
  ],
});
