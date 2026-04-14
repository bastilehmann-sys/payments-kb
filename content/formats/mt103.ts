import { registerFormat } from '@/lib/formats/registry';
import type { StructureNode } from '@/lib/formats/types';

const structure: StructureNode[] = [
  { name: ':20:', card: '1', type: '16x', desc: 'Sender’s Reference — eindeutige Transaktions-Referenz des sendenden Instituts.' },
  { name: ':13C:', card: '0..N', type: '/8c/4!n1!x4!n', desc: 'Time Indication — CLSTIME, RNCTIME, SNDTIME (Cut-Off-Zeitstempel).' },
  { name: ':23B:', card: '1', type: '4!c', desc: 'Bank Operation Code — CRED (normal), CRTS (Test), SPAY, SPRI, SSTD.' },
  { name: ':23E:', card: '0..N', type: '4!c[/30x]', desc: 'Instruction Code — CHQB, CORT, HOLD, INTC, PHON, REPA, TELE, SDVA, URGP.' },
  { name: ':26T:', card: '0..1', type: '3!c', desc: 'Transaction Type Code — nationale Codes (z.B. DE AWV-Schlüssel).' },
  { name: ':32A:', card: '1', type: '6!n3!a15d', desc: 'Value Date / Currency / Interbank Settled Amount — z.B. "260413EUR1234,56".' },
  { name: ':33B:', card: '0..1', type: '3!a15d', desc: 'Currency / Instructed Amount — Original-Auftragsbetrag (vor FX/Charges). Pflicht im EEA-Raum.' },
  { name: ':36:', card: '0..1', type: '12d', desc: 'Exchange Rate — bei :33B: ≠ :32A: Währung.' },
  { name: ':50a:', card: '1', type: 'Option A/F/K', desc: 'Ordering Customer — Auftraggeber. Option F (strukturiert) ist seit SR 2020 FATF-compliant bevorzugt.' },
  { name: ':51A:', card: '0..1', type: 'BIC', desc: 'Sending Institution — bei FileAct.' },
  { name: ':52a:', card: '0..1', type: 'Option A/D', desc: 'Ordering Institution — wenn Sender ≠ Bank des Auftraggebers.' },
  { name: ':53a:', card: '0..1', type: 'Option A/B/D', desc: 'Sender’s Correspondent — Nostro-Beziehung.' },
  { name: ':54a:', card: '0..1', type: 'Option A/B/D', desc: 'Receiver’s Correspondent — Loro/Vostro.' },
  { name: ':55a:', card: '0..1', type: 'Option A/B/D', desc: 'Third Reimbursement Institution — bei 3-Bank-Cover.' },
  { name: ':56a:', card: '0..1', type: 'Option A/C/D', desc: 'Intermediary Institution — zwischengeschaltet vor Account With Institution.' },
  { name: ':57a:', card: '0..1', type: 'Option A/B/C/D', desc: 'Account With Institution — empfängerseitige Bank.' },
  { name: ':59a:', card: '1', type: 'Option no-letter/A/F', desc: 'Beneficiary Customer — Empfänger. Option F = strukturierte Adresse (SR 2020+).' },
  { name: ':70:', card: '0..1', type: '4*35x', desc: 'Remittance Information — Verwendungszweck (max. 4×35 Zeichen).' },
  { name: ':71A:', card: '1', type: '3!a', desc: 'Details of Charges — OUR (Auftraggeber trägt alle), BEN (Empfänger trägt alle), SHA (geteilt).' },
  { name: ':71F:', card: '0..N', type: '3!a15d', desc: 'Sender’s Charges — bei SHA/BEN abgezogene Gebühren.' },
  { name: ':71G:', card: '0..1', type: '3!a15d', desc: 'Receiver’s Charges — bei OUR prognostizierte Empfänger-Gebühren.' },
  { name: ':72:', card: '0..1', type: '6*35x', desc: 'Sender to Receiver Information — /ACC/, /INS/, /INT/, /REC/, /UETR/ Codewords.' },
  { name: ':77B:', card: '0..1', type: '3*35x', desc: 'Regulatory Reporting — AWV-Z4, BdF, SAFE, Tax-ID Meldungen.' },
];

registerFormat({
  formatName: 'MT103',
  region: 'Global / SWIFT FIN (Legacy)',
  characterSet: 'swift-x',
  rejectCodeGroup: 'swift-mt',
  schemaUriPattern: undefined,
  structure,
  migrations: [
    {
      label: 'SWIFT MT103 → pacs.008 (CBPR+, Nov 2025)',
      fromVersion: 'MT103',
      toVersion: 'pacs.008.001.08 (CBPR+)',
      changes: [
        { field: 'Nachrichtenformat', oldValue: 'MT103 Tag-basiert (FIN-Block 4)', newValue: 'pacs.008 FIToFICstmrCdtTrf ISO 20022 XML', type: 'changed' },
        { field: 'Ordering Customer :50a:', oldValue: 'Freitext Name/Adresse 4*35x', newValue: 'Dbtr + PostalAddress24 strukturiert', type: 'changed' },
        { field: 'UETR', oldValue: ':121: im FIN-Block 3 (seit gpi 2018 retrofitted)', newValue: 'UETR native im PmtId-Block (Pflicht)', type: 'changed' },
        { field: 'Remittance', oldValue: ':70: 4×35 Zeichen', newValue: 'Ustrd 0..N × 140 oder Strd-Block', type: 'changed' },
        { field: 'Charges', oldValue: ':71A: Code + :71F/G: getrennt', newValue: 'ChrgBr + ChrgsInf strukturiert', type: 'changed' },
        { field: 'Regulatory Reporting', oldValue: ':77B: Freitext', newValue: 'RgltryRptg mit Code/Ctry/Auth-Struktur', type: 'changed' },
      ],
    },
  ],
  featureDefs: [
    {
      match: /SWIFT\s*gpi|UETR/i,
      name: 'SWIFT gpi + UETR (Block 3 :121:)',
      what: 'Unique End-to-End Transaction Reference — seit 2018 Pflicht in FIN-Block 3 für gpi-Tracking via Tracker-API.',
      tokens: ['UETR', 'gpi', '121'],
    },
    {
      match: /Option\s*F|FATF|SR\s*2020/i,
      name: 'Option F (FATF-16 Compliance)',
      what: ':50F:/:59F: mit strukturierten Zeilen-Codes (1/Name, 2/Adresse, 3/Country+Subdivision). Pflicht seit SWIFT Standards Release 2020.',
      tokens: ['50F', '59F', 'FATF'],
    },
    {
      match: /OUR|BEN|SHA/,
      name: 'Charges-Modell OUR/SHA/BEN',
      what: 'MT103 :71A: definiert Gebührentragung — in pacs.008 als ChrgBr-Code (DEBT/CRED/SHAR/SLEV) abgebildet.',
      tokens: ['71A', 'OUR', 'SHA', 'BEN'],
    },
    {
      match: /DMEE|F110/,
      name: 'SAP DMEE-Baum MT103',
      what: 'SAP-Ausgang via DMEE-Baum MT103 (klassisch), alternativ via SAP BCM / Host-to-Host-Connector. Inbound über FEBA/FEBKO möglich (selten).',
      tokens: ['DMEE', 'F110', 'BCM'],
    },
  ],
});
