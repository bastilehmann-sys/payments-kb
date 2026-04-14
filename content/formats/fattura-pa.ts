import { registerFormat } from '@/lib/formats/registry';
import type { StructureNode, FeatureDef, Migration } from '@/lib/formats/types';

const structure: StructureNode[] = [
  {
    name: 'FatturaElettronica — Root',
    card: '1',
    type: 'XML Root',
    desc: 'Wurzel-Element mit Attribut versione (FPA12 = Fattura PA, FPR12 = Fattura Privata / B2B). Namespace http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2.',
    children: [
      {
        name: 'FatturaElettronicaHeader',
        card: '1',
        type: 'Complex',
        desc: 'Metadaten fuer SDI-Transmission und Parteien.',
        children: [
          {
            name: 'DatiTrasmissione',
            card: '1',
            type: 'Complex',
            desc: 'Uebertragungs-Kopf fuer SDI.',
            children: [
              { name: 'IdTrasmittente', card: '1', type: 'IdFiscaleIVA', desc: 'IdPaese (ISO 3166-1 alpha-2) + IdCodice (P.IVA/CF des Uebertragenden).' },
              { name: 'ProgressivoInvio', card: '1', type: 'String(10)', desc: 'Eindeutige Uebertragungs-Nummer pro Trasmittente.' },
              { name: 'FormatoTrasmissione', card: '1', type: 'Code', desc: 'FPA12 = Fattura verso PA, FPR12 = Fattura verso privati (B2B/B2C).' },
              { name: 'CodiceDestinatario', card: '1', type: 'String(6|7)', desc: '6 Zeichen fuer PA (IPA-Code), 7 Zeichen fuer B2B (SDI-Channel-Code). "0000000" wenn nur PEC genutzt wird.' },
              { name: 'PECDestinatario', card: '0..1', type: 'String', desc: 'Fallback-PEC-Adresse, wenn CodiceDestinatario = "0000000". SDI stellt dann via zertifizierter E-Mail zu.' },
            ],
          },
          {
            name: 'CedentePrestatore',
            card: '1',
            type: 'Complex',
            desc: 'Rechnungssteller (Lieferant/Leistender).',
            children: [
              { name: 'DatiAnagrafici/IdFiscaleIVA', card: '1', type: 'Complex', desc: 'IdPaese + IdCodice = Partita IVA.' },
              { name: 'DatiAnagrafici/CodiceFiscale', card: '0..1', type: 'String(11|16)', desc: 'Steuernummer (abweichend von P.IVA, z.B. Einzelunternehmer).' },
              { name: 'DatiAnagrafici/Anagrafica', card: '1', type: 'Complex', desc: 'Denominazione (Firmenname) oder Nome/Cognome + Titolo.' },
              { name: 'DatiAnagrafici/RegimeFiscale', card: '1', type: 'Code (RF01..RF19)', desc: 'Steuerregime (RF01 = Ordinario, RF02 = Regime dei minimi, RF19 = Forfettario, etc.).' },
              { name: 'Sede', card: '1', type: 'Complex', desc: 'Adresse: Indirizzo, CAP, Comune, Provincia, Nazione.' },
            ],
          },
          {
            name: 'CessionarioCommittente',
            card: '1',
            type: 'Complex',
            desc: 'Rechnungsempfaenger (Kunde). Analoge Struktur zu CedentePrestatore mit IdFiscaleIVA/CodiceFiscale, Anagrafica, Sede.',
          },
        ],
      },
      {
        name: 'FatturaElettronicaBody',
        card: '1..N',
        type: 'Complex',
        desc: 'Ein Body pro Einzelrechnung — mehrere Bodies erlauben Sammelrechnungen mit identischen Parteien.',
        children: [
          {
            name: 'DatiGenerali/DatiGeneraliDocumento',
            card: '1',
            type: 'Complex',
            desc: 'Kopfdaten: TipoDocumento (TD01 Fattura, TD04 Nota Credito, TD24 Fattura differita, TD27 Autofattura, etc.), Divisa (EUR), Data, Numero, ImportoTotaleDocumento, Causale.',
          },
          {
            name: 'DatiBeniServizi/DettaglioLinee',
            card: '1..N',
            type: 'Complex',
            desc: 'Rechnungspositionen: NumeroLinea, Descrizione, Quantita, UnitaMisura, PrezzoUnitario, PrezzoTotale, AliquotaIVA, Natura (N1..N7 bei Nicht-Standard-IVA wie Reverse Charge N6.x).',
          },
          {
            name: 'DatiBeniServizi/DatiRiepilogo',
            card: '1..N',
            type: 'Complex',
            desc: 'Steuer-Summary je Aliquota/Natura: AliquotaIVA, ImponibileImporto, Imposta, EsigibilitaIVA (I = Immediata, D = Differita, S = Split Payment).',
          },
          {
            name: 'DatiPagamento',
            card: '0..N',
            type: 'Complex',
            desc: 'Zahlungsbedingungen. CondizioniPagamento (TP01 Rate, TP02 Komplett, TP03 Anzahlung) + DettaglioPagamento (ModalitaPagamento MP01..MP23, IBAN, BIC, DataScadenzaPagamento, ImportoPagamento).',
            children: [
              { name: 'ModalitaPagamento', card: '1', type: 'Code MP01..MP23', desc: 'MP05 = Bonifico SEPA, MP08 = Carta di pagamento, MP12 = RIBA, MP19 = SEPA Direct Debit, MP21 = SEPA Direct Debit CORE, MP22 = Trattenuta su somme gia riscosse.' },
              { name: 'IBAN', card: '0..1', type: 'String', desc: 'Zahlungsziel-IBAN (Format IT + 25 Digits).' },
              { name: 'DataScadenzaPagamento', card: '0..1', type: 'Date', desc: 'Faelligkeitsdatum.' },
            ],
          },
        ],
      },
    ],
  },
];

const migrations: Migration[] = [
  {
    label: 'FatturaPA v1.1 → v1.2 (Schema-Update 2017/2020)',
    fromVersion: '1.1',
    toVersion: '1.2',
    changes: [
      { field: 'TipoDocumento', oldValue: 'TD01..TD06', newValue: 'erweitert auf TD16..TD27 (Reverse Charge, Autofattura, Integrazione)', type: 'new' },
      { field: 'Natura', oldValue: 'N1..N7 flach', newValue: 'N6.1..N6.9 Sub-Kategorien fuer Reverse Charge', type: 'changed' },
      { field: 'DatiFattureCollegate', oldValue: 'optional einfach', newValue: 'pflicht bei TD16..TD19 und TD20..TD27', type: 'changed' },
      { field: 'Bollo virtuale', oldValue: '—', newValue: 'DatiBollo/BolloVirtuale + ImportoBollo (2 EUR ab 77,47 EUR)', type: 'new' },
    ],
  },
  {
    label: 'B2G (2015) → B2B/B2C Pflicht (Jan 2019)',
    fromVersion: 'FPA12 (nur Behoerden)',
    toVersion: 'FPR12 + FPA12 (alle Inlandsrechnungen)',
    changes: [
      { field: 'Anwendungsbereich', oldValue: 'Pubblica Amministrazione', newValue: 'alle IT-IT-Rechnungen inkl. privat', type: 'changed' },
      { field: 'CodiceDestinatario', oldValue: '6 Zeichen IPA', newValue: '7 Zeichen SDI-Channel fuer B2B', type: 'new' },
      { field: 'PEC-Fallback', oldValue: 'nicht vorgesehen', newValue: 'PECDestinatario bei CodiceDestinatario = 0000000', type: 'new' },
    ],
  },
  {
    label: 'Esterometro → SDI fuer grenzueberschreitend (2022)',
    fromVersion: 'Esterometro-Monatsmeldung',
    toVersion: 'SDI + TipoDocumento TD17/TD18/TD19',
    changes: [
      { field: 'Foreign Invoices', oldValue: 'separate Esterometro-XML', newValue: 'in FatturaPA via TD17 (Integrazione Servizi), TD18 (Integrazione Beni CE), TD19 (Integrazione Beni ex art.17)', type: 'changed' },
      { field: 'Abgabefrist', oldValue: 'quartalsweise', newValue: 'laufend ueber SDI', type: 'changed' },
    ],
  },
];

const featureDefs: FeatureDef[] = [
  {
    match: /SDI|Sistema\s*di\s*Interscambio/i,
    name: 'Sistema di Interscambio (SDI)',
    what: 'Zentrale Uebertragungs-Plattform der Agenzia delle Entrate. Alle FatturaPA werden zwingend via SDI geroutet (kein direkter Bilateral-Versand). SDI prueft Syntax/Semantik, vergibt IdSdiTrasmissione und leitet an Empfaenger via CodiceDestinatario oder PEC weiter.',
    tokens: ['SDI', 'Agenzia delle Entrate', 'IdSdiTrasmissione'],
  },
  {
    match: /CodiceDestinatario/i,
    name: 'CodiceDestinatario (7-Zeichen-Code)',
    what: 'SDI-Channel-Identifier fuer B2B-Empfaenger (7 alphanumerisch). Fuer PA: 6-stelliger IPA-Code aus Indice Pubblica Amministrazione. "0000000" = kein direkter Channel; SDI stellt dann via PECDestinatario oder Cassetto Fiscale zu.',
    tokens: ['CodiceDestinatario', 'IPA', 'Cassetto Fiscale'],
  },
  {
    match: /PEC|Posta\s*Elettronica\s*Certificata/i,
    name: 'PEC-Adresse als Fallback',
    what: 'Zertifizierte E-Mail (analog DE-Mail). Wird genutzt, wenn Empfaenger keinen SDI-Channel betreibt. PEC-Zustellung gilt rechtlich als Zustell-Nachweis (vergleichbar Einschreiben).',
    tokens: ['PEC', 'PECDestinatario'],
  },
  {
    match: /CADES|Digital\s*Signature|Firma\s*Digitale/i,
    name: 'Digitale Signatur CAdES-BES',
    what: 'Fuer FPA12 (Behoerdenrechnungen) pflichtig: XML wird via CAdES-BES (P7M-Container) oder XAdES digital signiert. Zertifikat von einer italienischen QTSP (z.B. Aruba, InfoCert, Namirial). Fuer FPR12 optional, aber empfohlen.',
    tokens: ['CAdES', 'XAdES', 'P7M', 'QTSP'],
  },
  {
    match: /Split\s*Payment|Scissione\s*dei\s*Pagamenti/i,
    name: 'Split Payment / Scissione dei Pagamenti',
    what: 'Bei Rechnungen an PA: USt geht direkt an Finanzamt, Netto an Lieferant (EsigibilitaIVA = "S"). Reduziert USt-Betrug, verlaengert aber Cashflow-Zyklus beim Lieferanten.',
    tokens: ['Split Payment', 'EsigibilitaIVA S', 'Scissione'],
  },
  {
    match: /Reverse\s*Charge|Autofattura|TD2[0-7]/i,
    name: 'Reverse Charge & Autofattura',
    what: 'TD16 (Integrazione reverse charge interno), TD17..TD19 (grenzueberschreitend/CE), TD20 (Autofattura denuncia), TD27 (Autofattura fuer Eigenverbrauch). Natura N6.1..N6.9 je Reverse-Charge-Fall. Kritisch fuer USt-Abwicklung B2B international.',
    tokens: ['Reverse Charge', 'Autofattura', 'TD16', 'TD17', 'TD27', 'Natura N6'],
  },
  {
    match: /SAP\s*DRC|Document\s*Reporting\s*Compliance/i,
    name: 'SAP Document and Reporting Compliance (DRC)',
    what: 'Standard-SAP-Loesung fuer FatturaPA ab S/4HANA 1909 (Vorgaenger: eDocument Framework). XML-Generierung aus FI-Beleg via eDocument-Cockpit, Signatur via DRC-Connector, Transmission an SDI ueber zertifizierten Service Provider (z.B. TeamSystem, IX-FE). Inbound analog.',
    tokens: ['DRC', 'eDocument', 'S/4HANA', 'TeamSystem', 'IX-FE'],
  },
];

registerFormat({
  formatName: 'FatturaPA',
  region: 'Italien',
  characterSet: 'utf-8',
  rejectCodeGroup: null,
  schemaUriPattern: 'http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2',
  structure,
  migrations,
  featureDefs,
});
