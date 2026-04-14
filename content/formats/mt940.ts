import { registerFormat } from '@/lib/formats/registry';
import type { StructureNode } from '@/lib/formats/types';

const structure: StructureNode[] = [
  { name: ':20:', card: '1', type: '16x', desc: 'Transaction Reference Number — eindeutige Referenz des Auszugs.' },
  { name: ':21:', card: '0..1', type: '16x', desc: 'Related Reference — Bezug auf vorherige Nachricht (bei Korrektur/Nachlieferung).' },
  { name: ':25:', card: '1', type: '35x', desc: 'Account Identification — IBAN oder Konto-ID (DE-Banken: BLZ/Konto-Nr).' },
  { name: ':28C:', card: '1', type: '5n[/5n]', desc: 'Statement Number / Sequence Number — laufende Auszugsnummer, optional mit Teilauszug-Nr.' },
  { name: ':60a:', card: '1', type: '1!a6!n3!a15d', desc: 'Opening Balance — :60F: = Final (Anfangssaldo neuer Auszug), :60M: = Intermediate (Teilauszug).' },
  {
    name: ':61:',
    card: '0..N',
    type: '6!n[4!n]2a[1!a]15d1!a3!c16x[//16x][34x]',
    desc: 'Statement Line — Buchungszeile (repeating): Value Date, Entry Date, Debit/Credit Mark (D/C/RD/RC), Amount, Transaction Type ID (N/F/S + 3 Chars), Customer Ref, Bank Ref, Supplementary Details.',
  },
  { name: ':86:', card: '0..1', type: '6*65x', desc: 'Information to Account Owner — Detailinfo zur vorangehenden :61: Zeile. DE-Banken: SWIFT-GVC-Codes (?00 Buchungstext, ?20-29 Verwendungszweck, ?30 BLZ, ?31 Konto-Nr, ?32-33 Name).' },
  { name: ':62a:', card: '1', type: '1!a6!n3!a15d', desc: 'Closing Balance (Booked) — :62F: = Final, :62M: = Intermediate.' },
  { name: ':64:', card: '0..1', type: '1!a6!n3!a15d', desc: 'Closing Available Balance — valutierter Schlusssaldo (verfügbarer Saldo).' },
  { name: ':65:', card: '0..N', type: '1!a6!n3!a15d', desc: 'Forward Available Balance — Vorschau-Saldo pro Folge-Valutatag.' },
  { name: ':86:', card: '0..1', type: '6*65x', desc: 'Information to Account Owner (Footer) — Gesamtinformation zum Auszug (Gebühren, Hinweise).' },
];

registerFormat({
  formatName: 'MT940',
  region: 'Global / SWIFT FIN (Legacy)',
  characterSet: 'swift-x',
  rejectCodeGroup: 'swift-mt',
  schemaUriPattern: undefined,
  structure,
  migrations: [
    {
      label: 'SWIFT MT940 → camt.053 (CBPR+, Nov 2025)',
      fromVersion: 'MT940',
      toVersion: 'camt.053.001.08',
      changes: [
        { field: 'Nachrichtenformat', oldValue: 'MT940 Tag-basiert, 65-Zeichen-Zeilen', newValue: 'camt.053 BankToCustomerStatement XML', type: 'changed' },
        { field: 'Buchungs-Entry', oldValue: ':61: + :86: Freitext mit GVC-Subfeldern', newValue: 'Ntry + NtryDtls + TxDtls (volle Struktur: RltdPties, RmtInf, Refs, Amt)', type: 'changed' },
        { field: 'Bank Transaction Code', oldValue: 'Transaction Type ID in :61: (N/F/S + 3 chars) + :86:?00', newValue: 'BkTxCd mit Domn/Fmly/SubFmlyCd (ISO 20022 External Code Set)', type: 'changed' },
        { field: 'Balance', oldValue: ':60F/62F/64/65: Codes', newValue: 'Bal mit Tp (OPBD/CLBD/CLAV/FWAV)', type: 'changed' },
        { field: 'Zeichenlimit', oldValue: '65 Zeichen pro Zeile SWIFT-X', newValue: 'UTF-8, praktisch unbegrenzte Feldlängen', type: 'changed' },
        { field: 'EndToEndId / UETR', oldValue: '— als Freitext in :86:?20-29', newValue: 'EndToEndId + UETR als strukturierte Refs', type: 'new' },
      ],
    },
  ],
  featureDefs: [
    {
      match: /GVC|Gesch.ftsvorfall|SWIFT\s*MT940\s*DE/i,
      name: 'GVC-Codes (DE-spezifisch)',
      what: 'Deutsche Banken codieren in :86: Geschäftsvorfall-Codes (3-stellig, ?00 Buchungstext) + Subfelder ?20-?29 (Verwendungszweck), ?30-?33 (Gegenkonto). Grundlage der SAP FEBAN/FEBA-Interpretation.',
      tokens: ['GVC', '?00', '?20', 'Geschäftsvorfall'],
    },
    {
      match: /FEBA|FF\.5|Kontoauszug/i,
      name: 'SAP FEBA / FF.5 Import',
      what: 'SAP T-Code FF.5 liest MT940-Files, FEBAN/FEBA zeigt elektronische Kontoauszüge. Buchungsregeln über Posting Rules (OT83) pro GVC/BTC.',
      tokens: ['FEBA', 'FF.5', 'FEBAN', 'OT83'],
    },
    {
      match: /:60F:|:62F:|Opening\s*Balance/i,
      name: 'Final vs Intermediate Balance (F/M)',
      what: ':60F:/:62F: bei vollständigem Tagesauszug, :60M:/:62M: bei Teil-/Intermediate-Auszug (Multi-File-Day). Wichtig für korrekte Saldenfortschreibung.',
      tokens: ['60F', '62F', '60M', '62M'],
    },
    {
      match: /BAI2|MT940\.65/i,
      name: 'MT940-Varianten (BAI2, Banken-Dialekte)',
      what: 'Proprietäre Erweiterungen: DB "MT940 Structured", UniCredit mit 65-Zeichen-Extension. BAI2 ist das US-Pendant (nicht SWIFT). Parser müssen dialect-aware sein.',
      tokens: ['BAI2', 'Structured', 'MT940.65'],
    },
  ],
});
