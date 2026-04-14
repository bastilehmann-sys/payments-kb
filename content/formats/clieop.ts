import { registerFormat } from '@/lib/formats/registry';
import type { StructureNode } from '@/lib/formats/types';

const structure: StructureNode[] = [
  {
    name: '0001 — Bestandsvoorlooprecord (File Header)',
    card: '1',
    type: 'Fixed 80 char',
    desc: 'Datei-Header. Felder: Record-Typ (0001), Variant-Code (A=Incasso Lastschrift, B=Betalingen Credit), Creation Date (DDMMYY), File Identification, Sender Identification (4-stellig Equens-ID).',
  },
  {
    name: '0010 — Batchvoorloopinformatie (Batch Header)',
    card: '1..N',
    type: 'Fixed 80 char',
    desc: 'Eröffnet eine Batch innerhalb der Datei. Felder: Transaction Group (10=Incasso, 00=Betalingen), Account Number Sender (10n, Bankrekening Opdrachtgever), Batch Sequence Number, Name Sender (35x).',
  },
  {
    name: '0020 — Vaste omschrijving (Fixed Description)',
    card: '0..1',
    type: 'Fixed 80 char',
    desc: 'Optionale feste Verwendungszweck-Zeile, gilt für alle Detailsätze der Batch. 32 Zeichen.',
  },
  {
    name: '0030 — Opdrachtgever (Originator)',
    card: '0..1',
    type: 'Fixed 80 char',
    desc: 'Erweiterte Opdrachtgever-Daten (Name, Ort).',
  },
  {
    name: '0100 — Betalingsinformatie (Detail Record)',
    card: '1..N',
    type: 'Fixed 80 char',
    desc: 'Einzeltransaktion. Felder: Amount (12n in Cent), Account Number Debtor (10n), Account Number Creditor (10n), MachtigingsKenmerk (16x, Mandats-Referenz bei Incasso), Reason-Code.',
    children: [
      { name: '0110 — Naam begunstigde', card: '0..1', type: 'Fixed 80 char', desc: 'Name Begünstigter (35x).' },
      { name: '0150 — Betalingskenmerk', card: '0..1', type: 'Fixed 80 char', desc: 'Variable Verwendungszweck-Referenz (16x numerisch).' },
      { name: '0160 — Omschrijving', card: '0..N', type: 'Fixed 80 char', desc: 'Freitext-Verwendungszweck (32x je Satz, max 4×).' },
    ],
  },
  {
    name: '9990 — Batchsluitrecord (Batch Trailer)',
    card: '1..N',
    type: 'Fixed 80 char',
    desc: 'Schließt Batch ab: Total Amount (18n), Total Account Numbers (Hash), Number of Posts.',
  },
  {
    name: '9999 — Bestandssluitrecord (File Trailer)',
    card: '1',
    type: 'Fixed 80 char',
    desc: 'Datei-Trailer mit Gesamtsummen über alle Batches.',
  },
];

registerFormat({
  formatName: 'CLIEOP',
  region: 'Niederlande (abgekündigt)',
  characterSet: 'us-ascii',
  rejectCodeGroup: null,
  schemaUriPattern: undefined,
  structure,
  migrations: [
    {
      label: 'CLIEOP03 → SEPA SCT/SDD (1. Februar 2014)',
      fromVersion: 'CLIEOP03',
      toVersion: 'pain.001.001.03 / pain.008.001.02',
      changes: [
        { field: 'Format', oldValue: 'CLIEOP Flat-File 80 char', newValue: 'ISO 20022 XML (pain.001 Credit, pain.008 Debit)', type: 'changed' },
        { field: 'Kontoidentifikation', oldValue: 'Niederländische Bankrekening 10n', newValue: 'IBAN (NL xx ABCD 0xxx xxxx xx, 18 char)', type: 'changed' },
        { field: 'MachtigingsKenmerk', oldValue: '16x numerisch, bilateral', newValue: 'MandateIdentification (Max35Text) mit DateOfSignature + Creditor Scheme ID', type: 'changed' },
        { field: 'Einreichungskanal', oldValue: 'Equens CLIEOP (Batch)', newValue: 'Equensworldline / Bank-Kanäle SEPA', type: 'changed' },
        { field: 'Lebenszyklus', oldValue: 'Aktiv bis 31.01.2014', newValue: 'Abgekündigt — nur noch Archiv/Altsystem-Migration', type: 'removed' },
      ],
    },
  ],
  featureDefs: [
    {
      match: /abgekündigt|deprecated|end[- ]of[- ]life/i,
      name: 'Lifecycle: abgekündigt seit 01.02.2014',
      what: 'CLIEOP wurde mit dem Ende der niederländischen SEPA-Migrationsfrist vollständig abgeschaltet. Equens (heute Equensworldline) nimmt keine CLIEOP-Dateien mehr an. Relevant nur noch für Altdaten-Migration, Archivpflicht (7 Jahre NL-Steuerrecht) und Forensik.',
      tokens: ['Abgekündigt', 'End-of-Life', '2014'],
    },
    {
      match: /MachtigingsKenmerk|Mandat/i,
      name: 'MachtigingsKenmerk → SEPA MandateId',
      what: 'Bei der SEPA-Migration wurde das 16-stellige MachtigingsKenmerk meist 1:1 als MandateIdentification übernommen. Datum der Erstmandatierung durfte gemäß Equens-Migrationsleitfaden fiktiv auf 01.11.2009 gesetzt werden ("Legacy Mandate Migration").',
      tokens: ['MachtigingsKenmerk', 'MandateId', 'Legacy Mandate'],
    },
    {
      match: /DMEE\b/i,
      name: 'SAP DMEE-Baum CLIEOP (historisch)',
      what: 'SAP-Standard-DMEE-Baum NL_CLIEOP03 wurde zum 01.02.2014 auf Wartungsstopp gesetzt. Re-Aktivierung nur via Custom-Kopie. Ersetzt durch SEPA-DMEE-Bäume (pain.001.001.03 / pain.008.001.02).',
      tokens: ['DMEE', 'NL_CLIEOP03', 'SAP OSS'],
    },
  ],
});
