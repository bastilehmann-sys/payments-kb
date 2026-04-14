import { registerFormat } from '@/lib/formats/registry';
import type { StructureNode, FeatureDef } from '@/lib/formats/types';

const structure: StructureNode[] = [
  {
    name: 'IB — Record di Testata (Header)',
    card: '1',
    type: 'Fixed 120 Byte',
    desc: 'Header-Satz der RiBa-Datei. Enthaelt ABI/CAB der Einreicher-Bank, Codice SIA der Cliente-Ordinante, Data di Creazione, Nome Supporto (eindeutige Datei-Kennung). Positionen 1-120 streng formatiert; Fuellzeichen Leerzeichen.',
  },
  {
    name: '14 — Record Fisso (Pflichtdaten Schuldner)',
    card: '1..N',
    type: 'Fixed 120 Byte',
    desc: 'Pflicht-Transaktions-Satz pro RiBa-Effetto. Felder: Progressivo (7n), Data Scadenza (6n DDMMAA), Importo (13n in Centesimi), ABI Debitore (5n), CAB Debitore (5n), Conto Debitore (12an), ABI Creditore/CAB Creditore, Numero Effetto, Tipo Effetto (10 = RiBa, 50 = Tratta).',
    children: [
      { name: 'Tipo Effetto 10', card: '0..N', type: '2n', desc: 'RiBa (Ricevuta Bancaria) — Standard-Inkasso-Variante.' },
      { name: 'Tipo Effetto 50', card: '0..N', type: '2n', desc: 'Tratta Non Accettata — Wechselaehnliches Instrument.' },
      { name: 'Tipo Effetto 51', card: '0..N', type: '2n', desc: 'Tratta Accettata — vom Schuldner bereits angenommen.' },
    ],
  },
  {
    name: '20 — Record Descrizione Merce (Verwendungszweck)',
    card: '0..N',
    type: 'Fixed 120 Byte',
    desc: 'Zwei Zeilen je 40 Zeichen Causale (Verwendungszweck), z.B. Rechnungsnummer, Faelligkeitsgrund. Padding Leerzeichen.',
  },
  {
    name: '30 — Record Dati Cliente Creditore',
    card: '0..N',
    type: 'Fixed 120 Byte',
    desc: 'Ergaenzende Daten des Cliente Ordinante (Creditore): Codice Fiscale / Partita IVA, Nome Cognome bzw. Ragione Sociale.',
  },
  {
    name: '40 — Record Indirizzo Debitore',
    card: '0..N',
    type: 'Fixed 120 Byte',
    desc: 'Adresse des Schuldners (Debitore): Via/Piazza, CAP, Comune, Provincia. Wichtig fuer papierbasierten Avviso-Druck, falls Debitor ohne Online-Banking.',
  },
  {
    name: '50 — Record Ulteriori Dati Settlement',
    card: '0..N',
    type: 'Fixed 120 Byte',
    desc: 'Bank-Settlement-Daten: Provisionen, Codice Supporto, interne Referenzen zwischen ABI-Einreicher und ABI-Praesentierer.',
  },
  {
    name: '70 — Record di Chiusura per Effetto',
    card: '1..N',
    type: 'Fixed 120 Byte',
    desc: 'Schluss-Satz pro RiBa-Effetto. Enthaelt Bollo-Kennzeichen (Stempelsteuer-Indikator) und evtl. Codice SIA Soggetto Creditore.',
  },
  {
    name: 'EF — Record di Coda (Footer)',
    card: '1',
    type: 'Fixed 120 Byte',
    desc: 'Datei-Footer: Numero Disposizioni (Anzahl Effetti), Totale Negativo (Summe Importi in Centesimi), Codice Divisa. Hash-Totals zur Integritaetspruefung.',
  },
];

const featureDefs: FeatureDef[] = [
  {
    match: /\bABI\b/i,
    name: 'ABI-Code (Associazione Bancaria Italiana)',
    what: '5-stelliger Bank-Identifier des italienischen Bankenverbandes. In RiBa an mehreren Positionen jedes 14-Records (ABI Debitore, ABI Creditore, ABI Assuntrice). Aus IBAN ableitbar: IT + 2 Pruef + 1 CIN + 5 ABI + 5 CAB + 12 Konto.',
    tokens: ['ABI', 'Associazione Bancaria Italiana'],
  },
  {
    match: /\bCAB\b/i,
    name: 'CAB-Code (Codice di Avviamento Bancario)',
    what: '5-stelliger Filial-Identifier innerhalb einer Bank. Pflicht in allen RiBa-Satzarten, da RiBa bilateral zwischen ABI+CAB-Paaren geclearing wird. Seit IBAN-Pflicht redundant, aber im Flat-File behalten.',
    tokens: ['CAB', 'Codice di Avviamento Bancario'],
  },
  {
    match: /Tipo\s*Supporto|Codice\s*Supporto/i,
    name: 'Tipo Supporto / Codice Supporto',
    what: 'Datei-Transport-Kennung im IB/EF-Header. Historisch Magnetband / Diskette; heute elektronisch via Remote Banking (CBI Channel) oder SFTP. Nome Supporto muss pro Datum/Einreicher eindeutig sein.',
    tokens: ['Tipo Supporto', 'Nome Supporto', 'Codice SIA'],
  },
  {
    match: /Codice\s*SIA/i,
    name: 'Codice SIA',
    what: '5-stelliger alphanumerischer Code des Cliente Ordinante bei der Einreicher-Bank (analog DTA-Auftraggeber-ID). Von SIA S.p.A. (heute Nexi) vergeben. Identifiziert das Unternehmen gegenueber dem CBI-Netzwerk.',
    tokens: ['Codice SIA', 'Nexi', 'SIA S.p.A.'],
  },
  {
    match: /Effetto|Tratta|Pagher[òo]/i,
    name: 'Effetto-Tipologien',
    what: 'RiBa ist eine Kategorie innerhalb des weiteren Begriffs "Effetto" (Wechsel-aehnliche Instrumente). Tipi: 10 = RiBa, 50 = Tratta Non Accettata, 51 = Tratta Accettata, 80 = Pagher&ograve; (Solawechsel). Steuerrechtlich relevant (Bollo).',
    tokens: ['Effetto', 'Tratta', 'Pagherò', 'Bollo'],
  },
  {
    match: /CBI\s*RiBa|XML\s*RiBa/i,
    name: 'CBI-RiBa-XML (moderner Ersatz)',
    what: 'Das CBI-Konsortium hat eine XML-Variante des RiBa-Flows publiziert (urn:CBI:xsd:CBIRibaIncasso), die schrittweise den Flat-120-Standard abloest. Namespace und Struktur orientieren sich an pain.008 mit italienischen Erweiterungen. Flat und XML laufen parallel.',
    tokens: ['CBI RiBa XML', 'CBIRibaIncasso', 'Flat-120'],
  },
  {
    match: /DMEE|SAP.*RiBa|PMW/i,
    name: 'SAP DMEE-Baum RiBa (Custom)',
    what: 'Kein Standard-SAP-DMEEX-Tree fuer RiBa im Auslieferungszustand — typischerweise kundeneigener DMEE-Baum oder via Add-On (Serrala, Hanse Orga, IT-lokale Berater). Zahlweg R (Ricevuta Bancaria) im Lieferanten-/Kunden-Stamm. Einreichung via Remote Banking mit ABI/CAB-Paar.',
    tokens: ['DMEE', 'Serrala', 'Hanse Orga', 'Zahlweg R', 'Remote Banking'],
  },
  {
    match: /SEPA\s*SDD|Incasso\s*SDD|Migration/i,
    name: 'Phasing-Out zugunsten SEPA SDD',
    what: 'RiBa wird zunehmend durch SEPA SDD CORE/B2B ersetzt, bleibt aber im IT-Markt als Instrument mit rechtlicher Eigenheit bestehen (Wechsel-aehnliche Protestfaehigkeit). Hybrid-Landschaften verbreitet: grosse Kunden SDD, mittelstaendische Debitoren weiter RiBa.',
    tokens: ['SEPA SDD', 'SDD CORE', 'Protesto', 'Wechsel'],
  },
];

registerFormat({
  formatName: 'RIBA',
  region: 'Italien',
  characterSet: 'sepa-latin',
  rejectCodeGroup: null,
  schemaUriPattern: undefined,
  structure,
  migrations: [],
  featureDefs,
});
