import { registerFormat } from '@/lib/formats/registry';
import type { StructureNode } from '@/lib/formats/types';

const structure: StructureNode[] = [
  {
    name: 'VOL1 — Volume Header Label',
    card: '1',
    type: 'Fixed 80 char',
    desc: 'ANSI-Label, identifiziert Datenträger/Datei. Enthält Volume Serial Number (SUN — Service User Number, 6 Digits) und Owner Identifier. Historisch von Magnetband übernommen; bei Bacstel-IP heute im File-Envelope transportiert.',
  },
  {
    name: 'UHL1 — User Header Label',
    card: '1',
    type: 'Fixed 80 char',
    desc: 'Datei-Header. Felder: Processing Date (Julian YDDD), Destination Sort Code, SUN, File Sequence Number. Legt fest, an welchem Verarbeitungstag die Records gecleart werden (3-Tage-Cycle: Input Day, Processing Day, Entry Day).',
  },
  {
    name: 'Batch Data Records',
    card: '1..N',
    type: 'Fixed 100 char',
    desc: 'Einzeltransaktionen. Jedes Record 100 Byte. Pflichtfelder: Destination Sort Code (6n), Destination Account Number (8n), Account Type (1n), Transaction Code (2n), Originator Sort Code (6n), Originator Account Number (8n), Reference (18x), Amount (11n in Pence), Originator Name (18x), User Reference (18x).',
    children: [
      { name: 'Transaction Code 99', card: '0..N', type: '2n', desc: 'Dummy / First Contra — Kontra-Buchung Originator-Konto.' },
      { name: 'Transaction Code 01', card: '0..N', type: '2n', desc: 'Direct Debit — Standard-Lastschrift.' },
      { name: 'Transaction Code 17', card: '0..N', type: '2n', desc: 'Direct Debit Re-presentation — Wiedervorlage nach Rückgabe.' },
      { name: 'Transaction Code 18/19', card: '0..N', type: '2n', desc: 'Direct Debit First/Final Collection (AUDDIS-Indikatoren).' },
      { name: 'Transaction Code 0N', card: '0..N', type: '2n', desc: 'Credit — Gehalt/Supplier Payment (Bacs Credit).' },
    ],
  },
  {
    name: 'EOF1 — End of File Label',
    card: '1',
    type: 'Fixed 80 char',
    desc: 'Schließt den Block der User Data ab. Enthält Block Count.',
  },
  {
    name: 'UTL1 — User Trailer Label',
    card: '1',
    type: 'Fixed 80 char',
    desc: 'Kontroll-Trailer. Summen: Debit Count, Credit Count, Debit Value, Credit Value — Hash-Totals für Integritätsprüfung durch Bacs Payment Services.',
  },
];

registerFormat({
  formatName: 'Bacs',
  region: 'UK',
  characterSet: 'us-ascii',
  rejectCodeGroup: null,
  schemaUriPattern: undefined,
  structure,
  migrations: [],
  featureDefs: [
    {
      match: /AUDDIS/i,
      name: 'AUDDIS — Automated Direct Debit Instruction Service',
      what: 'Elektronische Einreichung neuer DD-Mandate (seit 2013 Pflicht). Mandatsanlage via Transaction Code 0N → Bank des Zahlungspflichtigen registriert die DDI. Vergleichbar mit SEPA-Mandats-Setup, aber bilateral via Bacs-Netz.',
      tokens: ['AUDDIS', 'DDI', 'Direct Debit Instruction'],
    },
    {
      match: /Bacstel[- ]?IP/i,
      name: 'Bacstel-IP Secure Channel',
      what: 'Submission-Kanal über HTTPS/SOAP mit Smartcard-Authentifizierung (SmartGuardian). Hat Modem/X.25-Einreichung vollständig abgelöst. Datei-Payload bleibt Bacs-Standard-18 (Standard 18 Flat File).',
      tokens: ['Bacstel-IP', 'Standard 18', 'SmartGuardian'],
    },
    {
      match: /3-day\s*cycle|Bacs\s*cycle/i,
      name: 'Bacs 3-Day Processing Cycle',
      what: 'Input Day (Einreichung bis 22:30), Processing Day (Clearing), Entry Day (Gutschrift/Belastung). Keine Settlement am Wochenende. Unterschied zu Faster Payments: kein Echtzeit, aber Batch-geeignet für Gehälter.',
      tokens: ['Processing Day', 'Entry Day', 'Input Day'],
    },
    {
      match: /DMEE\b/i,
      name: 'SAP DMEE-Baum Bacs Standard 18',
      what: 'SAP F110 erzeugt Bacs-Flatfile via DMEE-Baum (nicht DMEEX). Payment Method Supplement für Bacs-spezifische Felder (SUN, Sort Code). Output als 100-char-Fixed-Record-Datei.',
      tokens: ['DMEE', 'SUN', 'F110', 'Standard 18'],
    },
  ],
});
