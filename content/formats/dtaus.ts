import { registerFormat } from '@/lib/formats/registry';
import type { StructureNode } from '@/lib/formats/types';

const structure: StructureNode[] = [
  {
    name: 'A-Satz — Header',
    card: '1',
    type: 'Fixed 128 Byte',
    desc: 'Datei-Kopfsatz. Felder: Satzlänge (0128), Satzart (A), Kennzeichen (GK=Gutschrift/Credit, LK=Lastschrift/Debit), BLZ Auftraggeber (8n), Kontonummer Auftraggeber (10n), Auftraggeber-Name (27 Byte, alphanumerisch groß), Datum Erstellung (DDMMJJ), optional Ausführungsdatum (DDMMJJJJ in Reservefeld).',
  },
  {
    name: 'C-Satz — Einzeltransaktion',
    card: '1..N',
    type: 'Fixed 187 Byte + N × 29 Byte Erweiterung',
    desc: 'Zahlungssatz. C-Satz-Teil 1 (187 Byte) enthält Pflichtfelder. Bei mehr als einem Verwendungszweck, Empfänger-Namen >27 Zeichen oder Fremdwährung werden Erweiterungsteile mit je 29 Byte angehängt (bis zu 15 Stück, Satzlänge max 187+15×29 = 622 Byte).',
    children: [
      { name: 'Satzart / Kennzeichen', card: '1', type: '1 char', desc: 'C — markiert Zahlungssatz.' },
      { name: 'BLZ erstbeteiligtes Institut', card: '1', type: '8n', desc: 'Bundesbank-BLZ der Gegenbank (Zahlungspflichtiger bei LK, Empfänger bei GK).' },
      { name: 'Kontonummer Zahlungspflichtiger/Begünstigter', card: '1', type: '10n', desc: 'Deutsche Kontonummer (rechtsbündig, mit führenden Nullen).' },
      { name: 'Textschlüssel', card: '1', type: '5n', desc: '05000 Überweisung, 04000 Abbuchungsauftrag, 05000 Einzugsermächtigung, 51000 Gehalt, 54000 Vermögensbildung, 56000 öffentl. Kasse. Ergänzung +000 für Standard.' },
      { name: 'Betrag', card: '1', type: '11n', desc: 'Betrag in Cent (DEM bis 2001, danach EUR), rechtsbündig.' },
      { name: 'Name Zahlungspflichtiger/Begünstigter', card: '1', type: '27 char', desc: 'Name, bei Überlänge → Erweiterungssatz Typ 01.' },
      { name: 'Verwendungszweck', card: '1', type: '27 char', desc: 'Erster Zweckzeile, bis zu 14 weitere im Erweiterungsteil Typ 02.' },
      { name: 'Währungskennzeichen', card: '1', type: '1 char', desc: '"D" DEM (bis 2001), " " bzw. "1" EUR (ab 2002).' },
      { name: 'Erweiterungsteil Typ 01', card: '0..1', type: '29 Byte', desc: 'Name-Fortsetzung (Begünstigter/Zahlungspflichtiger Teil 2).' },
      { name: 'Erweiterungsteil Typ 02', card: '0..N', type: '29 Byte', desc: 'Zusätzliche Verwendungszweck-Zeilen (max 14 Zeilen total).' },
      { name: 'Erweiterungsteil Typ 03', card: '0..1', type: '29 Byte', desc: 'Auftraggeber-Name-Fortsetzung.' },
    ],
  },
  {
    name: 'E-Satz — Kontrollsatz',
    card: '1',
    type: 'Fixed 128 Byte',
    desc: 'Kontroll-Trailer. Felder: Anzahl C-Sätze (7n), Summe Beträge EUR (13n), Kontroll-Summe Kontonummern (17n), Kontroll-Summe BLZ (17n). Dient der Integritätsprüfung durch die Bank (Hash-Totals).',
  },
];

registerFormat({
  formatName: 'DTAUS',
  region: 'Deutschland (abgekündigt)',
  characterSet: 'us-ascii',
  rejectCodeGroup: null,
  schemaUriPattern: undefined,
  structure,
  migrations: [
    {
      label: 'DTAUS → SEPA SCT/SDD (Stichtag 01.02.2014)',
      fromVersion: 'DTAUS 2002',
      toVersion: 'pain.001.001.03 (SCT) / pain.008.001.02 (SDD)',
      changes: [
        { field: 'Format', oldValue: 'DTAUS Flat-File fixed 128/187 Byte', newValue: 'ISO 20022 XML (UTF-8, variable Länge)', type: 'changed' },
        { field: 'Kontoidentifikation', oldValue: 'BLZ (8n) + Kontonummer (10n)', newValue: 'IBAN (DE + 20n, Prüfziffer MOD-97)', type: 'changed' },
        { field: 'Bank-Identifikation Gegenbank', oldValue: 'BLZ in :BLZ erstbeteiligtes Institut:', newValue: 'BIC (8/11 char) — seit 01.02.2016 für DE-inland nicht mehr verpflichtend', type: 'changed' },
        { field: 'Transaktionstyp', oldValue: 'Textschlüssel 5n (05000, 04000, 51000...)', newValue: 'Keine 1:1-Entsprechung — wird über CategoryPurpose + Purpose + Service Level (SEPA/INST) ausgedrückt', type: 'changed' },
        { field: 'Abbuchungs-Typen', oldValue: 'Einzugsermächtigung (05000), Abbuchungsauftrag (04000)', newValue: 'CORE (Consumer), B2B (Unternehmer) + Pflicht-Mandat mit MandateId und DateOfSignature', type: 'changed' },
        { field: 'Verwendungszweck', oldValue: 'max 14×27 char = 378 char, umlautfrei', newValue: 'Ustrd max 140 char je Zeile + UTF-8 SEPA-Latin-Subset', type: 'changed' },
        { field: 'Einreichungskanal', oldValue: 'Datenträger (Diskette/Tape), DTA-Fernauftrag EBICS FT', newValue: 'EBICS CCT/CDD Auftragsarten, ISO-20022-XML-Payload', type: 'changed' },
        { field: 'Lebenszyklus', oldValue: 'Aktiv bis 31.01.2014', newValue: 'Abgekündigt — deutsche Banken nehmen keine DTAUS-Dateien mehr an', type: 'removed' },
      ],
    },
  ],
  featureDefs: [
    {
      match: /Textschlüssel|TSL\b/i,
      name: 'Textschlüssel-Codes',
      what: 'Deutscher 5-stelliger Textschlüssel (z.B. 51000 Gehalt, 53000 Kapitalertrag, 54000 VWL, 56000 öffentliche Kasse, 04000 Abbuchungsauftrag, 05000 Einzugsermächtigung). SEPA kennt diese nicht mehr — Mapping auf ISO Purpose Codes (SALA, CBFF, VAT) im SAP OBBC-Customizing bzw. im DMEE-Baum.',
      tokens: ['Textschlüssel', 'TSL', 'Purpose Code', 'OBBC'],
    },
    {
      match: /Erweiterungsteil|C-Satz-Erweiterung/i,
      name: 'C-Satz-Erweiterungen (Typ 01/02/03)',
      what: 'Bis zu 15 Erweiterungssätze à 29 Byte: Typ 01 = Name-Fortsetzung, Typ 02 = zusätzliche Verwendungszweck-Zeilen, Typ 03 = Auftraggeber-Name-Fortsetzung. Berechnung: Satzlänge = 187 + (Anzahl Erweiterungen × 29). Kritisch bei DMEE-Trees, da Feld "Satzlänge" dynamisch gefüllt werden muss.',
      tokens: ['Erweiterungsteil', 'Satzlänge', 'C-Satz'],
    },
    {
      match: /DMEE\b/i,
      name: 'SAP DMEE-Baum DTAUS (Legacy)',
      what: 'Standard-DMEE-Bäume DTAUS und DTAUS0 bleiben im SAP-System vorhanden, aber ohne produktive Clearing-Anbindung. Werden oft für interne Archiv-Exports oder Migrationstests weiterverwendet. Aufruf via F110 → Zahlwegebene → Format DTAUS. Wichtig: keine DMEEX — DTAUS nutzt den älteren DMEE-Baumtyp.',
      tokens: ['DMEE', 'DTAUS', 'F110', 'OBPM4'],
    },
    {
      match: /Archiv|GoBD/i,
      name: 'GoBD-Archivierungspflicht',
      what: 'Obwohl DTAUS seit 2014 abgekündigt ist, müssen Bestandsdateien gemäß §147 AO / GoBD 10 Jahre revisionssicher archiviert werden — meist in SAP ArchiveLink oder OpenText. Zugriff nur über Reload-Parser, da aktuelle SAP-DMEE-Engine keine DTAUS-Files mehr einliest.',
      tokens: ['GoBD', 'Archivierung', 'ArchiveLink'],
    },
  ],
});
