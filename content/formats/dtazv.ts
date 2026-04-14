import { registerFormat } from '@/lib/formats/registry';
import type { StructureNode } from '@/lib/formats/types';

const structure: StructureNode[] = [
  {
    name: 'Q-Satz — Logischer Dateivorsatz',
    card: '1',
    type: 'Fixed 256 Byte',
    desc: 'Dateikopfsatz. Felder: Satzart (Q), BLZ Auftraggeber (8n), Auftraggeber-Name (35 char), Datum Erstellung (JJJJMMTD), Referenznummer Auftraggeber (16x), Ausführungsdatum (JJJJMMTD), Währungskennzeichen Kontobelastung (EUR/USD/...).',
  },
  {
    name: 'T-Satz — Einzeltransaktion',
    card: '1..N',
    type: 'Fixed 768 Byte (Q=256 + T=768 + Z=256)',
    desc: 'Zahlungssatz. Enthält Empfänger-Bank (BIC), Empfänger-Konto (IBAN Pflicht seit 01.02.2016 für SEPA-Raum, sonst Accountnummer bis 34x), Betrag, Zielwährung, Verwendungszweck, Regulatorik (AWV-Meldung Z4).',
    children: [
      { name: 'Satzart', card: '1', type: '1 char', desc: 'T — markiert Zahlungssatz.' },
      { name: 'Auftraggeber-Konto (BLZ + Konto)', card: '1', type: '8n + 10n', desc: 'Belastungskonto Auftraggeber bei der ausführenden Bank.' },
      { name: 'Bankleitzahl Empfängerbank', card: '0..1', type: '11x BIC', desc: 'SWIFT-BIC der Empfängerbank (Pflicht bei SEPA-Raum + USA + CAN; Freitext sonst).' },
      { name: 'Empfänger-Bank-Name', card: '1', type: '4×35 char', desc: 'Adresse Empfängerbank (Name, Ort, Land) — 4 Zeilen à 35 char.' },
      { name: 'Empfänger-Konto / IBAN', card: '1', type: '34x', desc: 'Empfänger-IBAN (SEPA + erweiterter Raum) oder ausländische Kontonummer. Seit 01.02.2016 IBAN-Pflicht für EWR.' },
      { name: 'Empfänger-Name', card: '1', type: '4×35 char', desc: 'Name + Adresse Empfänger, 4 Zeilen.' },
      { name: 'Betrag', card: '1', type: '14n', desc: 'Betrag in Zielwährung, 2 Dezimalstellen (Annahme), rechtsbündig.' },
      { name: 'Währungskennzeichen', card: '1', type: '3 char', desc: 'ISO 4217 (EUR/USD/GBP/JPY/...).' },
      { name: 'Verwendungszweck', card: '1', type: '4×35 char', desc: 'Zahlungsgrund, bis zu 4×35 char. Bei SEPA-Ausland via DTAZV möglich.' },
      { name: 'Weisungsschlüssel Entgeltregelung', card: '1', type: '2 char', desc: '00 = SHA (geteilt), 01 = OUR (Auftraggeber), 02 = BEN (Empfänger). Bei SEPA-Raum nur SHA zulässig.' },
      { name: 'Meldepflicht Z4 / Z10', card: '0..1', type: 'Meldegruppe', desc: 'AWV-Außenwirtschafts-Meldepflicht: Kennzeichen, Land, Meldeschlüssel (4n), Meldebetrag. Pflicht ab 12.500 EUR gemäß §67 AWV.' },
    ],
  },
  {
    name: 'Z-Satz — Logischer Dateinachsatz',
    card: '1',
    type: 'Fixed 256 Byte',
    desc: 'Kontroll-Trailer. Summen: Anzahl T-Sätze, Gesamtbetrag Kontobelastung in EUR (15n), Euro-Gegenwert Fremdwährungsbeträge.',
  },
];

registerFormat({
  formatName: 'DTAZV',
  region: 'Deutschland (aktiv — Auslandszahlungsverkehr)',
  characterSet: 'us-ascii',
  rejectCodeGroup: null,
  schemaUriPattern: undefined,
  structure,
  migrations: [],
  featureDefs: [
    {
      match: /aktiv|current|in use/i,
      name: 'Lifecycle: weiterhin aktiv',
      what: 'DTAZV ist NICHT durch SEPA abgelöst — das Format ist der Standard der Deutschen Bundesbank für den Auslandszahlungsverkehr (AZV) und wird von allen deutschen Banken weiterhin akzeptiert. Parallel existiert pain.001 (ISO 20022) als moderner Kanal; viele Corporates nutzen beides (EUR-SEPA via pain.001, Non-EUR via DTAZV).',
      tokens: ['DTAZV', 'AZV', 'aktiv', 'Bundesbank'],
    },
    {
      match: /AWV|Z4|Meldepflicht/i,
      name: 'AWV-Meldepflicht (Z4/Z10)',
      what: 'Nach §67 AWV sind Zahlungen >12.500 EUR ins Ausland meldepflichtig. Im DTAZV werden Meldegruppen Z4 (Zahlungsverkehr) bzw. Z10 (Wertpapierverkehr) direkt im T-Satz mit Meldeschlüssel (z.B. 521 Dienstleistungen, 400 Warenverkehr) gefüllt. Alternative Meldewege: AMS-Portal Bundesbank, eStatistik.',
      tokens: ['AWV', 'Z4', 'Z10', '§67 AWV', 'Meldeschlüssel'],
    },
    {
      match: /IBAN|BIC/i,
      name: 'IBAN-Pflicht seit 01.02.2016',
      what: 'Für alle EWR-Länder (SEPA-Raum + CH, LI, MC, SM, AD, VA) IBAN-Pflicht im DTAZV-T-Satz. Für Drittländer (USA, JP, CN, ...) weiterhin Account-String 34x + BIC. BIC-Only erlaubt, wenn Empfängerland keine IBAN kennt.',
      tokens: ['IBAN', 'BIC', 'EWR', 'Drittland'],
    },
    {
      match: /Weisungsschlüssel|Entgelt|Charges/i,
      name: 'Weisungsschlüssel Entgeltregelung',
      what: '00 SHA (Gebühren geteilt — Standard/SEPA-Pflicht), 01 OUR (Auftraggeber trägt alle Gebühren), 02 BEN (Empfänger trägt alle). SEPA-Raum: SHA zwingend. Drittland: OUR/BEN möglich; "OUR" generiert oft Zusatzkosten bei Korrespondenzbanken.',
      tokens: ['SHA', 'OUR', 'BEN', 'Charges'],
    },
    {
      match: /DMEE\b/i,
      name: 'SAP DMEE-Baum DTAZV',
      what: 'Standard-DMEE-Baum DTAZV (nicht DMEEX) in SAP aktiv und produktiv. Aufruf via F110 mit Format DTAZV + Zahlweg "A" (Auslandsüberweisung). Spezial: Z4-Meldewerte werden aus VBRK/BSEG bzw. BSIK-Feldern (LZBKZ, LANDL) ermittelt und im T-Satz gefüllt. Parallel nutzen viele Kunden ISO20022 via pain.001.001.09 (CBPR+) für gpi-fähige Auslandszahlungen.',
      tokens: ['DMEE', 'DTAZV', 'F110', 'LZBKZ', 'LANDL'],
    },
    {
      match: /Non-EUR|Fremdwährung|FX/i,
      name: 'Non-EUR / FX-Zahlungen',
      what: 'Zahlungen in USD, GBP, JPY, CHF etc. laufen fast ausschließlich via DTAZV (oder MT101/pain.001-CBPR+). SEPA deckt nur EUR im EWR ab. Bei FX: Bank führt Konvertierung zum Spot durch; Betrag im T-Satz in Zielwährung, Euro-Gegenwert im Z-Satz.',
      tokens: ['FX', 'Non-EUR', 'Fremdwährung', 'Spot'],
    },
  ],
});
