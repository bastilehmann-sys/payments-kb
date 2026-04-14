import { registerFormat } from '@/lib/formats/registry';
import type { StructureNode, MigrationChange } from '@/lib/formats/types';

const structure: StructureNode[] = [
  {
    name: 'GrpHdr',
    card: '1',
    type: 'GroupHeader',
    desc: 'Header der Nachricht — gilt für ALLE Zahlungen im File.',
    children: [
      { name: 'MsgId', card: '1', type: 'Max35Text', desc: 'Eindeutige Message-ID des Senders. Konvention: <BUKRS>-<JJJJMMTT>-<lfd>.' },
      { name: 'CreDtTm', card: '1', type: 'ISODateTime', desc: 'Erstellungs-Zeitstempel. SAP: aus DMEEX zum Lauf-Zeitpunkt.' },
      { name: 'NbOfTxs', card: '1', type: 'Max15NumericText', desc: 'Anzahl Einzeltransaktionen im File (Summe aller CdtTrfTxInf).' },
      { name: 'CtrlSum', card: '0..1', type: 'DecimalNumber', desc: 'Kontrollsumme aller InstdAmt-Beträge. Optional, aber stark empfohlen.' },
      {
        name: 'InitgPty',
        card: '1',
        type: 'PartyIdentification135',
        desc: 'Auftraggebende Partei (i.d.R. Konzern-Treasury / Hausbankzugang).',
        children: [
          { name: 'Nm', card: '0..1', type: 'Max140Text', desc: 'Name der Initiating Party.' },
          { name: 'PstlAdr', card: '0..1', type: 'PostalAddress24', desc: 'Strukturierte Adresse — alle Subfelder einzeln.', versionFlag: 'v.09' },
          { name: 'Id', card: '0..1', type: 'Party38Choice', desc: 'OrgId (LEI/BIC/Other) oder PrvtId.', versionFlag: 'v.09' },
        ],
      },
      { name: 'FwdgAgt', card: '0..1', type: 'BranchAndFinancialInstitutionIdentification6', desc: 'Forwarding Agent — wenn Zwischen-PSP eingeschaltet.' },
      { name: 'InitnSrc', card: '0..1', type: 'PaymentInitiationSource1', desc: 'Quelle (Software-Name + Version) — neu in v.09.', versionFlag: 'v.09' },
    ],
  },
  {
    name: 'PmtInf',
    card: '1..N',
    type: 'PaymentInstruction34',
    desc: 'Zahlungsblock — gruppiert Transaktionen mit gleichem Auftraggeberkonto, Ausführungsdatum und Service-Level.',
    children: [
      { name: 'PmtInfId', card: '1', type: 'Max35Text', desc: 'ID des Zahlungsblocks (Batch-Id).' },
      { name: 'PmtMtd', card: '1', type: 'PaymentMethod3Code', desc: 'TRF (Transfer), DD (Direct Debit), CHK (Cheque). Für SEPA SCT immer TRF.' },
      { name: 'BtchBookg', card: '0..1', type: 'BatchBookingIndicator', desc: 'true = Sammelbuchung, false = Einzelbuchungen auf Konto.' },
      { name: 'NbOfTxs', card: '0..1', type: 'Max15NumericText', desc: 'Anzahl Transaktionen in diesem Block.' },
      { name: 'CtrlSum', card: '0..1', type: 'DecimalNumber', desc: 'Kontrollsumme dieses Blocks.' },
      {
        name: 'PmtTpInf',
        card: '0..1',
        type: 'PaymentTypeInformation26',
        desc: 'Service-Level / Local Instrument / Category Purpose.',
        children: [
          { name: 'InstrPrty', card: '0..1', type: 'Priority2Code', desc: 'NORM oder HIGH.' },
          { name: 'SvcLvl', card: '0..N', type: 'ServiceLevel8Choice', desc: 'SEPA, INST (Instant), URGP, SDVA.' },
          { name: 'LclInstrm', card: '0..1', type: 'LocalInstrument2Choice', desc: 'B2B vs CORE bei SDD; CN-spezifische Codes.' },
          { name: 'CtgyPurp', card: '0..1', type: 'CategoryPurpose1Choice', desc: 'CASH, CORT, GOVT, SUPP, TAXS — beeinflusst Settlement.' },
        ],
      },
      { name: 'ReqdExctnDt', card: '1', type: 'DateAndDateTime2Choice', desc: 'Gewünschtes Ausführungsdatum — komplexes Element mit <Dt> oder <DtTm>.', versionFlag: 'v.09' },
      { name: 'PoolgAdjstmntDt', card: '0..1', type: 'ISODate', desc: 'Adjustierungsdatum bei Pooled-Konten.' },
      {
        name: 'Dbtr',
        card: '1',
        type: 'PartyIdentification135',
        desc: 'Schuldner = Kontoinhaber. SAP: aus T001 (Buchungskreis-Stammdaten).',
        children: [
          { name: 'Nm', card: '0..1', type: 'Max140Text', desc: 'Name laut Kontoinhaber-Stammdaten.' },
          { name: 'PstlAdr', card: '0..1', type: 'PostalAddress24', desc: 'Strukturierte Adresse — Pflicht ab EPC SCT 2025!', versionFlag: 'v.09' },
          { name: 'Id', card: '0..1', type: 'Party38Choice', desc: 'OrgId mit LEI / BIC / Other (Tax-ID, USCI bei CN).', versionFlag: 'v.09' },
          { name: 'CtryOfRes', card: '0..1', type: 'CountryCode', desc: 'ISO-Ländercode der Ansässigkeit.' },
        ],
      },
      {
        name: 'DbtrAcct',
        card: '1',
        type: 'CashAccount38',
        desc: 'Schuldner-Konto.',
        children: [
          { name: 'Id', card: '1', type: 'AccountIdentification4Choice', desc: '<IBAN> oder <Othr><Id> für Non-IBAN-Länder (CN, US, JP).' },
          { name: 'Tp', card: '0..1', type: 'CashAccountType2Choice', desc: 'CACC, SVGS, etc.' },
          { name: 'Ccy', card: '0..1', type: 'ActiveOrHistoricCurrencyCode', desc: 'Konto-Währung.' },
        ],
      },
      {
        name: 'DbtrAgt',
        card: '1',
        type: 'BranchAndFinancialInstitutionIdentification6',
        desc: 'Schuldner-Bank.',
        children: [
          { name: 'FinInstnId', card: '1', type: 'FinancialInstitutionIdentification18', desc: 'BICFI (ersetzt BIC) + ggf. ClrSysMmbId.', versionFlag: 'v.09' },
        ],
      },
      { name: 'ChrgBr', card: '0..1', type: 'ChargeBearerType1Code', desc: 'SLEV (für SEPA), SHAR, CRED, DEBT.' },
      { name: 'UltmtDbtr', card: '0..1', type: 'PartyIdentification135', desc: 'Original-Auftraggeber bei POBO — neu strukturiert in v.09.', versionFlag: 'v.09' },
      {
        name: 'CdtTrfTxInf',
        card: '1..N',
        type: 'CreditTransferTransaction40',
        desc: 'Einzelne Zahlung — eine pro Transaktion.',
        children: [
          {
            name: 'PmtId',
            card: '1',
            type: 'PaymentIdentification6',
            desc: 'IDs der Einzelzahlung.',
            children: [
              { name: 'InstrId', card: '0..1', type: 'Max35Text', desc: 'Instruction-ID — interne Referenz zwischen Sender und Bank.' },
              { name: 'EndToEndId', card: '1', type: 'Max35Text', desc: 'Pflicht — Ende-zu-Ende-Referenz, durchgereicht bis Empfänger.' },
              { name: 'UETR', card: '0..1', type: 'UUID', desc: 'Unique End-to-end Transaction Reference (gpi-Tracking).', versionFlag: 'v.09' },
            ],
          },
          {
            name: 'Amt',
            card: '1',
            type: 'AmountType4Choice',
            desc: 'Betrag mit Währung.',
            children: [
              { name: 'InstdAmt', card: '0..1', type: 'ActiveOrHistoricCurrencyAndAmount', desc: 'Vom Auftraggeber instruierter Betrag (Standardfall).' },
              { name: 'EqvtAmt', card: '0..1', type: 'EquivalentAmount2', desc: 'Bei Cross-Currency: Gegenwert in anderer Währung.' },
            ],
          },
          { name: 'ChrgBr', card: '0..1', type: 'ChargeBearerType1Code', desc: 'Kann pro Transaktion vom PmtInf-Default abweichen.' },
          {
            name: 'CdtrAgt',
            card: '0..1',
            type: 'BranchAndFinancialInstitutionIdentification6',
            desc: 'Empfänger-Bank.',
            children: [
              { name: 'FinInstnId', card: '1', type: 'FinancialInstitutionIdentification18', desc: 'BICFI des Empfänger-PSPs.', versionFlag: 'v.09' },
            ],
          },
          {
            name: 'Cdtr',
            card: '1',
            type: 'PartyIdentification135',
            desc: 'Empfänger.',
            children: [
              { name: 'Nm', card: '0..1', type: 'Max140Text', desc: 'Name des Empfängers — bei PSD3-CoP entscheidend!' },
              { name: 'PstlAdr', card: '0..1', type: 'PostalAddress24', desc: 'Strukturierte Adresse.', versionFlag: 'v.09' },
              { name: 'Id', card: '0..1', type: 'Party38Choice', desc: 'OrgId (LEI/USCI/Tax-ID) oder PrvtId.', versionFlag: 'v.09' },
            ],
          },
          {
            name: 'CdtrAcct',
            card: '1',
            type: 'CashAccount38',
            desc: 'Empfänger-Konto (IBAN für SEPA, Othr für Non-IBAN).',
          },
          { name: 'UltmtCdtr', card: '0..1', type: 'PartyIdentification135', desc: 'Tatsächlicher End-Empfänger bei COBO.' },
          { name: 'Purp', card: '0..1', type: 'Purpose2Choice', desc: 'External Purpose Code (z.B. SUPP, SALA, INTC).' },
          { name: 'RgltryRptg', card: '0..N', type: 'RegulatoryReporting3', desc: 'AWV-Z4 / SAFE-Codes für Cross-Border-Reporting.' },
          {
            name: 'RmtInf',
            card: '0..1',
            type: 'RemittanceInformation16',
            desc: 'Verwendungszweck.',
            children: [
              { name: 'Ustrd', card: '0..N', type: 'Max140Text', desc: 'Freitext-Verwendungszweck (mehrfach möglich).' },
              { name: 'Strd', card: '0..N', type: 'StructuredRemittanceInformation16', desc: 'Strukturierter Verwendungszweck — Pflicht für SEPA SDD-Mandate, Rechnungsreferenz.' },
            ],
          },
        ],
      },
    ],
  },
];

const migrationChanges: MigrationChange[] = [
  { field: 'Adressfelder (Dbtr/Cdtr/InitgPty)', oldValue: 'PostalAddress6 (Freitext AdrLine)', newValue: 'PostalAddress24 (strukturiert: StrtNm, BldgNb, PstCd, TwnNm, Ctry)', type: 'changed' },
  { field: 'BIC-Element', oldValue: 'BIC oder BICOrBEI', newValue: 'BICFI', type: 'changed' },
  { field: 'OrgId', oldValue: 'BICOrBEI / Other', newValue: 'AnyBIC, LEI, Other', type: 'changed' },
  { field: 'PmtId/UETR', oldValue: '— nicht vorhanden', newValue: 'UETR (UUID) für gpi-Tracking', type: 'new' },
  { field: 'ReqdExctnDt', oldValue: 'ISODate (nur Datum)', newValue: 'DateAndDateTime2Choice (Datum ODER Datum+Zeit)', type: 'changed' },
  { field: 'GrpHdr/InitnSrc', oldValue: '— nicht vorhanden', newValue: 'PaymentInitiationSource1 (Software-Name + Version)', type: 'new' },
  { field: 'UltmtDbtr / UltmtCdtr', oldValue: 'PartyIdentification32 (eingeschränkt)', newValue: 'PartyIdentification135 (vollwertig, POBO/COBO-tauglich)', type: 'changed' },
  { field: 'CdtTrfTxInf/Tax', oldValue: 'TaxInformation3', newValue: 'TaxInformation8 (mit DueAmt-Struktur, MwSt-Aufschlüsselung)', type: 'changed' },
  { field: 'RmtInf/Strd/AddtlRmtInf', oldValue: 'Max140Text', newValue: 'Max140Text · 0..3 (vorher 0..1) — bis zu 3 Zusatztexte', type: 'changed' },
  { field: 'CtrlSum-Pflicht im PmtInf', oldValue: 'optional', newValue: 'optional, aber EPC-Business-Rule erzwingt sie für SEPA SCT', type: 'changed' },
];

registerFormat({
  formatName: 'pain.001',
  schemaUriPattern: 'urn:iso:std:iso:20022:tech:xsd:pain.001.001.<v>',
  region: 'Global / SEPA',
  characterSet: 'sepa-latin',
  rejectCodeGroup: 'iso20022',
  structure,
  migrations: [
    {
      label: '001.001.03 → 001.001.09',
      fromVersion: '001.001.03',
      toVersion: '001.001.09',
      changes: migrationChanges,
    },
  ],
  featureDefs: [
    {
      match: /PostalAddress24/i,
      name: 'PostalAddress24 (strukturierte Adresse)',
      what: 'Alle Adressfelder einzeln strukturiert statt Freitext: StrtNm, BldgNb, PstCd, TwnNm, Ctry usw. Pflicht ab EPC SEPA SCT 2025.',
      tokens: ['PostalAddress24', 'StrtNm', 'BldgNb', 'PstCd', 'TwnNm', 'Ctry'],
    },
    {
      match: /BICFI/i,
      name: 'BICFI ersetzt BIC/BICOrBEI',
      what: 'ISO 20022 nutzt durchgängig BICFI (Business Identifier Code, Financial Institution). Alte Element-Namen sind veraltet.',
      tokens: ['BICFI', 'BIC'],
    },
    {
      match: /\bLEI\b/,
      name: 'LEI-Unterstützung in OrgId',
      what: 'Legal Entity Identifier (LEI) als Identifikation für juristische Personen — Voraussetzung für EMIR-Reporting und Wholesale-Trades.',
      tokens: ['LEI', 'OrgId'],
    },
    {
      match: /UETR/,
      name: 'UETR im PmtId-Block',
      what: 'Unique End-to-End Transaction Reference — globale Verfolgbarkeit über SWIFT gpi für Cross-Border-Zahlungen.',
      tokens: ['UETR', 'EndToEndId'],
    },
    {
      match: /ReqdExctnDt/,
      name: 'ReqdExctnDt als komplexes Element',
      what: 'Datum + Zeit + DateAndTimeChoice — präzise Steuerung des Ausführungs-Cut-Offs (vorher nur Date).',
      tokens: ['ReqdExctnDt'],
    },
    {
      match: /UltimateOriginator/i,
      name: 'UltimateOriginator (POBO-Support)',
      what: 'Original-Auftraggeber separat nachvollziehbar — Pflicht für Payment-on-Behalf-of-Konstruktionen (Konzern-IHB → Tochter).',
      tokens: ['UltimateOriginator'],
    },
  ],
});
