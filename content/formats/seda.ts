import { registerFormat } from '@/lib/formats/registry';
import type { StructureNode, FeatureDef, Migration } from '@/lib/formats/types';

const structure: StructureNode[] = [
  {
    name: 'Document — SEDA-Envelope (CBI-Namespace)',
    card: '1',
    type: 'XML Root',
    desc: 'SEDA (SEPA Compliant Electronic Database Alignment) ist ein proprietaeres italienisches Interbank-Protokoll zum Austausch von SDD-Mandats-Informationen zwischen Cdtr-Bank und Dbtr-Bank. Aufgesetzt vom CBI-Konsortium, parallel zum ISO 20022 Mandats-Management. Namespace urn:CBI:xsd:CBISDDInitialMandateInformation.00.01.00 (und analoge fuer Amendment/Cancellation).',
    children: [
      {
        name: 'CBISDDInitialMandateInformation',
        card: '0..1',
        type: 'Complex',
        desc: 'SEDA-Message-Typ 1: Initial Mandate Information — Cdtr-Bank meldet neues SDD-Mandat an Dbtr-Bank zur Validierung.',
      },
      {
        name: 'CBISDDAmendmentMandateInformation',
        card: '0..1',
        type: 'Complex',
        desc: 'SEDA-Message-Typ 2: Mandats-Aenderung (IBAN-Wechsel, Glaeubiger-Umfirmierung, Mandats-Referenz-Update).',
      },
      {
        name: 'CBISDDCancellationMandateInformation',
        card: '0..1',
        type: 'Complex',
        desc: 'SEDA-Message-Typ 3: Mandats-Kuendigung durch Cdtr oder Dbtr. Konsequenz: kuenftige Einzuege werden von Dbtr-Bank abgelehnt (AC04/MD01).',
      },
      {
        name: 'CBISDDValidationMandateInformation',
        card: '0..1',
        type: 'Complex',
        desc: 'SEDA-Message-Typ 4: Validierungs-Antwort der Dbtr-Bank (Accept / Reject mit Reason Code).',
      },
      {
        name: 'CBISDDAlignmentMandateInformation',
        card: '0..1',
        type: 'Complex',
        desc: 'SEDA-Message-Typ 5: Bestandsabgleich — periodische Gesamt-Synchronisation aller aktiven Mandate zwischen den Banken.',
      },
      {
        name: 'GrpHdr — Group Header',
        card: '1',
        type: 'Complex',
        desc: 'MsgId, CreDtTm, InitgPty (immer eine CBI-teilnehmende Bank, identifiziert via ABI-Code). Bank-zu-Bank-Nachricht, nie Corporate-initiiert.',
      },
      {
        name: 'MndtInitnReq / MndtAmdmntReq / MndtCxlReq — Mandate Block',
        card: '1..N',
        type: 'Complex',
        desc: 'Pro Mandat: MndtReqId, Mndt/MndtId (Umbrella-Referenz), Cdtr (mit Identificativo Creditore SDD — IT..ZZZ..), Dbtr + DbtrAcct (IT-IBAN), DbtrAgt, Amdmnt-Informationen bei Type 2. Analog zu pain.009/pain.010 aber in CBI-Naming.',
        children: [
          { name: 'Identificativo Creditore SDD (CID)', card: '1', type: 'String(35)', desc: 'Italienischer SEPA-Creditor-Identifier, Format IT+Pruefziffern+"ZZZ"+Codice Fiscale/P.IVA (23 Zeichen).' },
          { name: 'Tipo SEDA', card: '1', type: 'Code', desc: 'Produkt-Subtyp: B2B (SEDA B2B) oder CORE (SEDA CORE). Bestimmt Ruekgabefristen analog SEPA Rulebook.' },
        ],
      },
    ],
  },
];

const migrations: Migration[] = [
  {
    label: 'SEDA-Protokoll ↔ ISO 20022 pain.009/pain.010 (bilateraler Mandats-Austausch)',
    fromVersion: 'CBI-SEDA 00.01.00',
    toVersion: 'pain.009.001 / pain.010.001 (Mandate Initiation / Amendment / Cancellation)',
    changes: [
      { field: 'Namespace', oldValue: 'urn:CBI:xsd:CBISDDInitialMandateInformation.00.01.00', newValue: 'urn:iso:std:iso:20022:tech:xsd:pain.009.001.0x', type: 'changed' },
      { field: 'Message-Typ-Mapping', oldValue: 'Initial / Amendment / Cancellation / Validation / Alignment', newValue: 'pain.009 (Initiation), pain.010 (Amendment), pain.011 (Cancellation), pain.012 (Acceptance)', type: 'changed' },
      { field: 'Alignment-Bulk', oldValue: 'CBI-proprietaerer Abgleich', newValue: 'kein direktes ISO-Aequivalent — bleibt italienische Spezialitaet', type: 'removed' },
    ],
  },
  {
    label: 'Phasing-out in EU-Kontext (diskutiert ab 2024)',
    fromVersion: 'SEDA als Pflicht fuer IT-SDD-Mandate',
    toVersion: 'freiwillig / Ersatz durch EPC Mandate-Exchange (CMF)',
    changes: [
      { field: 'Verbindlichkeit', oldValue: 'Italienische Banken MUESSEN SEDA unterstuetzen (CBI-Beschluss)', newValue: 'EPC Creditor Mandate Flow (CMF) als EU-weiter Standard konkurriert', type: 'changed' },
      { field: 'Reichweite', oldValue: 'nur IT-IT Bank-Paare', newValue: 'CMF deckt SEPA-weit ab', type: 'changed' },
    ],
  },
];

const featureDefs: FeatureDef[] = [
  {
    match: /SEDA|Database\s*Alignment/i,
    name: 'SEDA — SEPA Compliant Electronic Database Alignment',
    what: 'Italien-spezifisches Interbank-Protokoll fuer SDD-Mandats-Austausch zwischen Cdtr- und Dbtr-Bank. Zweck: Dbtr-Bank prueft Mandat VOR dem ersten Einzug (Pre-Validation), reduziert R-Transaktionen (AC04, MD01, MD07). Eingefuehrt 2013 parallel zum SEPA-SDD-Start.',
    tokens: ['SEDA', 'Pre-Validation', 'Database Alignment'],
  },
  {
    match: /Identificativo\s*Creditore|\bCID\b/i,
    name: 'Identificativo Creditore SDD (CID)',
    what: 'Italienische Auspraegung des SEPA Creditor Identifier. Format IT + 2 Pruefziffern + ZZZ (oder 3-stellige Business-Kennung) + Codice Fiscale / P.IVA. Beantragt ueber die Cdtr-Bank beim Banca d\'Italia. Pflicht fuer jeden SEDA-Mandats-Austausch.',
    tokens: ['CID', 'Creditor Identifier', 'Banca d\'Italia'],
  },
  {
    match: /SEDA\s*CORE|SEDA\s*B2B/i,
    name: 'SEDA CORE vs SEDA B2B',
    what: 'Zwei Produkt-Varianten analog zum SEPA-Rulebook: SEDA CORE (Verbraucher, 8 Wochen No-Questions-Asked-Rueckgabe) und SEDA B2B (nur Unternehmen, keine Rueckgabe nach Autorisierung, kuerzere D-2-Einreichung). Tipo-SEDA-Feld im XML differenziert.',
    tokens: ['SEDA CORE', 'SEDA B2B', 'Rueckgabefristen'],
  },
  {
    match: /Mandats[- ]?Austausch|Mandate\s*Exchange/i,
    name: '5 Message-Typen im SEDA-Lifecycle',
    what: 'Initial (neue Mandats-Anlage), Amendment (IBAN-Wechsel / Re-Direct), Cancellation (Kuendigung), Validation (Dbtr-Bank-Antwort Accept/Reject), Alignment (periodischer Gesamtabgleich). Jede Message hat eigenes XSD mit gemeinsamem CBI-Body-Pattern.',
    tokens: ['Initial Mandate', 'Amendment', 'Cancellation', 'Validation', 'Alignment'],
  },
  {
    match: /CBI\s*Globe|EPC\s*CMF|Creditor\s*Mandate\s*Flow/i,
    name: 'Abgrenzung zum EPC Creditor Mandate Flow (CMF)',
    what: 'Der EPC definiert mit CMF einen SEPA-weiten Mandats-Flow-Standard, der konzeptionell SEDA entspricht. SEDA bleibt jedoch praktisch in Italien der De-facto-Standard fuer IT-IT-SDDs; CMF-Migration ist diskutiert, aber ohne festes Zieldatum.',
    tokens: ['EPC CMF', 'Creditor Mandate Flow', 'SEPA-weit'],
  },
  {
    match: /SAP|BCM|DMEE|Treasury/i,
    name: 'SAP-Kontext fuer SEDA',
    what: 'Kein SAP-Standard fuer SEDA — Mandats-Austausch erfolgt Bank-zu-Bank. Corporate-Seite muss SEDA-Pre-Validation in der Cdtr-Bank lediglich triggern (meist via Bank-Portal oder CBI-Globe-API). SAP FSCM Biller Direct / FI-CA pflegen die Mandate-ID; Bankeninformation ueber Pre-Validation-Status kommt via MT940/camt.054 (Sperrkennzeichen).',
    tokens: ['FSCM', 'FI-CA', 'CBI Globe API', 'Pre-Validation'],
  },
];

registerFormat({
  formatName: 'SEDA',
  region: 'Italien',
  characterSet: 'utf-8',
  rejectCodeGroup: null,
  schemaUriPattern: 'urn:CBI:xsd:CBISDDInitialMandateInformation.00.01.00',
  structure,
  migrations,
  featureDefs,
});
