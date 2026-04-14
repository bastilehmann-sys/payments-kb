import { registerFormat } from '@/lib/formats/registry';
import type { StructureNode } from '@/lib/formats/types';

const structure: StructureNode[] = [
  {
    name: 'Sequence A — General Information',
    card: '1',
    type: 'Sequence',
    desc: 'Standard-Block des MT202 (General Financial Institution Transfer, FI-to-FI).',
    children: [
      { name: ':20:', card: '1', type: '16x', desc: 'Transaction Reference Number — Referenz des sendenden FI.' },
      { name: ':21:', card: '1', type: '16x', desc: 'Related Reference — Bezug auf Original-Kundentransaktion (z.B. :20: des zugehörigen MT103).' },
      { name: ':13C:', card: '0..N', type: '/8c/4!n1!x4!n', desc: 'Time Indication — CLSTIME, RNCTIME, SNDTIME.' },
      { name: ':32A:', card: '1', type: '6!n3!a15d', desc: 'Value Date / Currency / Amount — Settlement-Betrag.' },
      { name: ':52a:', card: '0..1', type: 'Option A/D', desc: 'Ordering Institution — beauftragendes FI (wenn ≠ Sender).' },
      { name: ':53a:', card: '0..1', type: 'Option A/B/D', desc: 'Sender’s Correspondent.' },
      { name: ':54a:', card: '0..1', type: 'Option A/B/D', desc: 'Receiver’s Correspondent.' },
      { name: ':56a:', card: '0..1', type: 'Option A/D', desc: 'Intermediary Institution.' },
      { name: ':57a:', card: '0..1', type: 'Option A/B/D', desc: 'Account With Institution — FI, das Begünstigten-Bank-Konto führt.' },
      { name: ':58a:', card: '1', type: 'Option A/D', desc: 'Beneficiary Institution — empfangendes FI (Unterschied zu MT103: Empfänger ist Bank, nicht Kunde).' },
      { name: ':72:', card: '0..1', type: '6*35x', desc: 'Sender to Receiver Information — /ACC/, /INS/, /UETR/ Codewords.' },
    ],
  },
  {
    name: 'Sequence B — Underlying Customer Credit Transfer (nur MT202 COV)',
    card: '0..1',
    type: 'Sequence',
    desc: 'Cover-Payment: enthält Spiegel-Infos der zugrunde liegenden Kundenzahlung für AML-Transparenz (FATF Recommendation 16 / SWIFT SR 2009+).',
    children: [
      { name: ':50a:', card: '1', type: 'Option A/F/K', desc: 'Ordering Customer — Original-Auftraggeber der Kundenzahlung.' },
      { name: ':52a:', card: '0..1', type: 'Option A/D', desc: 'Ordering Institution der Kundenzahlung.' },
      { name: ':56a:', card: '0..1', type: 'Option A/C/D', desc: 'Intermediary Institution der Kundenzahlung.' },
      { name: ':57a:', card: '0..1', type: 'Option A/B/C/D', desc: 'Account With Institution der Kundenzahlung.' },
      { name: ':59a:', card: '1', type: 'Option no-letter/A/F', desc: 'Beneficiary Customer — Original-Empfänger.' },
      { name: ':70:', card: '0..1', type: '4*35x', desc: 'Remittance Information aus der Kundenzahlung.' },
      { name: ':72:', card: '0..1', type: '6*35x', desc: 'Sender to Receiver Info der Kundenzahlung.' },
      { name: ':33B:', card: '0..1', type: '3!a15d', desc: 'Currency / Instructed Amount der Original-Kundenzahlung.' },
    ],
  },
];

registerFormat({
  formatName: 'MT202',
  region: 'Global / SWIFT FIN (Legacy)',
  characterSet: 'swift-x',
  rejectCodeGroup: 'swift-mt',
  schemaUriPattern: undefined,
  structure,
  migrations: [
    {
      label: 'SWIFT MT202 → pacs.009 (CBPR+, Nov 2025)',
      fromVersion: 'MT202 / MT202 COV',
      toVersion: 'pacs.009.001.08 (CORE / COV / ADV)',
      changes: [
        { field: 'Nachrichtenformat', oldValue: 'MT202 Tag-basiert', newValue: 'pacs.009 FinancialInstitutionCreditTransfer XML', type: 'changed' },
        { field: 'Cover-Flag', oldValue: 'Implizit via Sequenz B (MT202 COV)', newValue: 'Explizit über <BizMsgIdr> + UndrlygCstmrCdtTrf-Block', type: 'changed' },
        { field: 'UETR', oldValue: ':121: Block 3 (seit gpi)', newValue: 'UETR native im PmtId (Pflicht)', type: 'changed' },
        { field: 'Beneficiary Institution', oldValue: ':58a:', newValue: 'Cdtr (BranchAndFinancialInstitutionIdentification6)', type: 'changed' },
        { field: 'Underlying Customer Fields', oldValue: 'Sequenz B :50a:/:59a: Freitext', newValue: 'UndrlygCstmrCdtTrf mit strukturierten Dbtr/Cdtr + PostalAddress24', type: 'changed' },
      ],
    },
  ],
  featureDefs: [
    {
      match: /MT\s*202\s*COV|Cover\s*Payment/i,
      name: 'MT202 COV (Cover Payment)',
      what: 'Cover-Variante mit Sequenz B — spiegelt Original-Kunde/Empfänger für AML-Transparenz. Ab SWIFT 2009 Pflicht für Serial-Cover-Payments statt Serial-MT103.',
      tokens: ['MT202 COV', 'Cover', 'Sequence B'],
    },
    {
      match: /SWIFT\s*gpi|UETR/i,
      name: 'gpi für FI-Leg',
      what: 'UETR wird aus dem Customer-Leg (MT103) durchgereicht — ermöglicht End-to-End-Tracking über Interbank-Hops via gpi Tracker.',
      tokens: ['UETR', 'gpi'],
    },
    {
      match: /Nostro|Vostro|Correspondent/i,
      name: 'Nostro/Vostro-Settlement',
      what: ':53a:/:54a: modellieren Korrespondenzbank-Settlement — :53a: = unser Konto bei ihnen (Nostro), :54a: = ihr Konto bei uns (Vostro).',
      tokens: ['53a', '54a', 'Nostro', 'Vostro'],
    },
    {
      match: /SAP\s*(BCM|MBC|FSN)/i,
      name: 'SAP BCM / FSN Interbank',
      what: 'SAP Bank Communication Management bzw. Financial Services Network erzeugen/empfangen MT202 für Interbank-Settlement — z.B. bei In-House Cash oder Treasury-Disposition.',
      tokens: ['SAP BCM', 'FSN', 'Interbank'],
    },
  ],
});
