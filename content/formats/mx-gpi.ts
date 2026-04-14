import { registerFormat } from '@/lib/formats/registry';
import type { StructureNode, MigrationChange } from '@/lib/formats/types';

const structure: StructureNode[] = [
  {
    name: 'MX gpi Baseline (pacs.008 + gpi-Service)',
    card: '1',
    type: 'FIToFICustomerCreditTransfer + gpi SLA',
    desc: 'MX gpi = pacs.008.001.xx mit verpflichtenden gpi-Elementen. Settlement-SLA via SWIFT gpi Tracker (Observer) überwacht.',
    children: [
      {
        name: 'GrpHdr',
        card: '1',
        type: 'GroupHeader93',
        desc: 'Standard-Header; Instructing/Instructed Agent müssen gpi-Member (SCORE) sein.',
        children: [
          { name: 'MsgId', card: '1', type: 'Max35Text', desc: 'Eindeutige Message-ID.' },
          { name: 'CreDtTm', card: '1', type: 'ISODateTime', desc: 'Erstellungs-Zeitstempel — Basis für SLA-Uhr (30 Min).' },
          { name: 'InstgAgt', card: '1', type: 'BranchAndFinancialInstitutionIdentification6', desc: 'gpi-Member-BIC Sender.' },
          { name: 'InstdAgt', card: '1', type: 'BranchAndFinancialInstitutionIdentification6', desc: 'gpi-Member-BIC Empfänger.' },
        ],
      },
      {
        name: 'CdtTrfTxInf',
        card: '1',
        type: 'CreditTransferTransaction39',
        desc: 'gpi: genau EINE Transaktion pro Nachricht (analog CBPR+).',
        children: [
          {
            name: 'PmtId',
            card: '1',
            type: 'PaymentIdentification7',
            desc: 'gpi-kritischer Block — UETR ist Pflicht.',
            children: [
              { name: 'InstrId', card: '0..1', type: 'Max35Text', desc: 'Instruction-ID.' },
              { name: 'EndToEndId', card: '1', type: 'Max35Text', desc: 'End-to-End-Referenz durchgereicht.' },
              { name: 'UETR', card: '1', type: 'UUIDv4', desc: 'Pflicht — Schlüssel für gpi Tracker. Identisch über gesamte Zahlungskette.', versionFlag: 'gpi' },
            ],
          },
          {
            name: 'PmtTpInf',
            card: '1',
            type: 'PaymentTypeInformation28',
            desc: 'Service-Level deklariert gpi-Variante.',
            children: [
              {
                name: 'SvcLvl',
                card: '1..N',
                type: 'ServiceLevel8Choice',
                desc: 'gpi-Service-Level-Codes.',
                children: [
                  { name: 'Cd = G001', card: '1', type: 'Code', desc: 'gpi Customer Credit Transfer (pacs.008).', versionFlag: 'gpi' },
                  { name: 'Cd = G002', card: '1', type: 'Code', desc: 'gpi Financial Institution Transfer (pacs.009).', versionFlag: 'gpi' },
                  { name: 'Cd = G003', card: '1', type: 'Code', desc: 'gpi Cover Payment (pacs.009 COV).', versionFlag: 'gpi' },
                  { name: 'Cd = G004', card: '1', type: 'Code', desc: 'gpi Stop & Recall (camt.056).', versionFlag: 'gpi' },
                ],
              },
            ],
          },
          { name: 'IntrBkSttlmAmt', card: '1', type: 'ActiveCurrencyAndAmount', desc: 'Settlement-Betrag — SLA: Credit innerhalb 30 Min (gpi-Standard).' },
          { name: 'IntrBkSttlmDt', card: '1', type: 'ISODate', desc: 'Settlement-Datum.' },
          { name: 'SttlmTmIndctn', card: '1', type: 'SettlementDateTimeIndication1', desc: 'DbtDtTm + CdtDtTm — exakte Zeitstempel für Tracker/SLA-Monitoring.', versionFlag: 'gpi' },
          { name: 'InstdAmt', card: '0..1', type: 'ActiveOrHistoricCurrencyAndAmount', desc: 'Instruierter Betrag bei Currency-Conversion.' },
          { name: 'XchgRate', card: '0..1', type: 'BaseOneRate', desc: 'Verwendeter Wechselkurs — Fee-Transparency.' },
          { name: 'ChrgBr', card: '1', type: 'ChargeBearerType1Code', desc: 'SHAR / DEBT / CRED — steuert gpi Fee-Model.' },
          { name: 'ChrgsInf', card: '0..N', type: 'Charges7', desc: 'Strukturierte Gebühren pro Agent — gpi Fee-Transparency.', versionFlag: 'gpi' },
          { name: 'PrvsInstgAgt1', card: '0..1', type: 'BranchAndFinancialInstitutionIdentification6', desc: 'Vorheriger instruierender Agent — gpi Tracker nutzt dies für Hop-Chain.' },
          { name: 'IntrmyAgt1', card: '0..1', type: 'BranchAndFinancialInstitutionIdentification6', desc: 'Korrespondenzbank. Alle Hops loggen UETR beim Tracker.' },
          { name: 'Dbtr', card: '1', type: 'PartyIdentification135', desc: 'Zahler — strukturierte Adresse.' },
          { name: 'DbtrAgt', card: '1', type: 'BranchAndFinancialInstitutionIdentification6', desc: 'Zahler-Bank (gpi-Member).' },
          { name: 'CdtrAgt', card: '1', type: 'BranchAndFinancialInstitutionIdentification6', desc: 'Empfänger-Bank (gpi-Member).' },
          { name: 'Cdtr', card: '1', type: 'PartyIdentification135', desc: 'Empfänger — strukturierte Adresse.' },
          { name: 'CdtrAcct', card: '1', type: 'CashAccount40', desc: 'Empfänger-Konto.' },
          { name: 'RmtInf', card: '0..1', type: 'RemittanceInformation16', desc: 'Verwendungszweck.' },
        ],
      },
    ],
  },
  {
    name: 'gpi Tracker API (Off-Band)',
    card: '1',
    type: 'SWIFT gpi Observer / Tracker',
    desc: 'Jeder Hop sendet Status-Update via Tracker-API: accepted, confirmed, settled. Abrufbar via SWIFT gpi Observer-API (JSON/REST).',
    children: [
      { name: 'UETR', card: '1', type: 'UUIDv4', desc: 'Schlüssel für Tracker-Abfrage.' },
      { name: 'Status', card: '1..N', type: 'TrackerStatus', desc: 'ACSP (accepted for settlement), ACSC (settled), RJCT (rejected).' },
      { name: 'Charges', card: '0..N', type: 'TrackerCharges', desc: 'Pro Hop: abgezogene Gebühr + FX-Rate.' },
      { name: 'Confirmation', card: '0..1', type: 'TrackerConfirmation', desc: 'Finale Credit-Bestätigung des Beneficiary-PSPs.' },
    ],
  },
];

const gpiBaselineToExtended: MigrationChange[] = [
  { field: 'UETR', oldValue: 'optional (gpi Baseline 2017, Block 3 Tag 121)', newValue: 'Pflicht in PmtId/UETR (ab 2018 alle FIN/FINplus)', type: 'changed' },
  { field: 'Service-Level-Codes', oldValue: 'gpi-SCORE-Flag (intern)', newValue: 'Explizite SvcLvl/Cd: G001-G004', type: 'changed' },
  { field: 'Fee-Transparency', oldValue: 'Nur Feld 71F/71G (MT)', newValue: 'ChrgsInf (Charges7) strukturiert pro Agent', type: 'new' },
  { field: 'Settlement-SLA', oldValue: 'Best Effort', newValue: 'gpi-Standard: Credit ≤ 30 Min für ≥ 50% der Zahlungen', type: 'new' },
  { field: 'Tracker-Updates', oldValue: 'manuell / MT199', newValue: 'Automatische Status-Updates jedes Hops via Tracker-API', type: 'new' },
  { field: 'gpi Cover (gCOV)', oldValue: '— nicht definiert', newValue: 'SvcLvl/Cd = G003 auf pacs.009 COV mit UETR-Linking zur pacs.008', type: 'new' },
  { field: 'Stop & Recall (gSRP)', oldValue: 'MT192/MT292', newValue: 'SvcLvl/Cd = G004 + camt.056 mit Original-UETR', type: 'new' },
];

registerFormat({
  formatName: 'MX gpi',
  schemaUriPattern: 'urn:iso:std:iso:20022:tech:xsd:pacs.008.001.<v> (+ SWIFT gpi Service-Level G001-G004)',
  region: 'Global / SWIFT GPI',
  characterSet: 'utf-8',
  rejectCodeGroup: 'iso20022',
  structure,
  migrations: [
    {
      label: 'gpi Baseline (2017) → gpi Extended / Tracker Mandatory (2020–2021)',
      fromVersion: 'gpi-2017',
      toVersion: 'gpi-2021',
      changes: gpiBaselineToExtended,
    },
  ],
  featureDefs: [
    {
      match: /UETR|Tracker/i,
      name: 'UETR-Tracker (End-to-End)',
      what: 'UUID v4 im PmtId/UETR wird jedem Hop mitgegeben. SWIFT gpi Tracker erhält pro Stop Status-Update (ACSP/ACSC/RJCT) und fusioniert Chain zur Live-View.',
      tokens: ['UETR', 'Tracker', 'Observer', 'Hop'],
    },
    {
      match: /G001|G002|G003|G004|SvcLvl/i,
      name: 'gpi Service-Level-Codes (G001-G004)',
      what: 'G001 = Customer Credit Transfer (pacs.008); G002 = FI Transfer (pacs.009); G003 = Cover (pacs.009 COV, gCOV); G004 = Stop & Recall (camt.056, gSRP).',
      tokens: ['G001', 'G002', 'G003', 'G004', 'SvcLvl'],
    },
    {
      match: /30 ?Min|SLA|gpi Standard/i,
      name: 'SLA gpi-Standard (30 Min Settlement)',
      what: 'SWIFT gpi Service-Level-Agreement: ≥ 50% aller gpi-Zahlungen werden innerhalb von 30 Minuten dem Empfänger gutgeschrieben. Messung über SttlmTmIndctn.',
      tokens: ['SLA', '30 Min', 'gpi-Standard', 'SttlmTmIndctn'],
    },
    {
      match: /Observer/i,
      name: 'SWIFT gpi Observer',
      what: 'Compliance-Tool von SWIFT: misst SLA-Erfüllung der gpi-Member — durchschnittliche Settlement-Zeit, Fee-Transparency-Quote, STP-Quote. Öffentliche League-Tables.',
      tokens: ['Observer', 'gpi League', 'SLA-Monitoring'],
    },
    {
      match: /gCOV|Cover Payment/i,
      name: 'gpi Cover (gCOV) — SLA gpi-Cover',
      what: 'Cover-Payment (pacs.009 COV mit SvcLvl G003). UETR verknüpft pacs.008 (Customer) und pacs.009 COV (Cover). Gleiche 30-Min-SLA für Cover-Leg.',
      tokens: ['gCOV', 'G003', 'pacs.009 COV', 'UndrlygCstmrCdtTrf'],
    },
    {
      match: /Fee[- ]?Transparency|ChrgsInf/i,
      name: 'Fee-Transparency (ChrgsInf)',
      what: 'Pflicht-Publikation aller angefallenen Agent-Gebühren in ChrgsInf (Amount + Agent-BIC). Empfänger sieht wer welche Gebühr abgezogen hat — Basis für gpi-Scoring.',
      tokens: ['ChrgsInf', 'Fee Transparency', 'Charges7'],
    },
  ],
});
