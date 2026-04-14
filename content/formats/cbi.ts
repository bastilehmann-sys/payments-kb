import { registerFormat } from '@/lib/formats/registry';
import type { StructureNode, FeatureDef, Migration } from '@/lib/formats/types';

const structure: StructureNode[] = [
  {
    name: 'Document — CBI-Envelope',
    card: '1',
    type: 'XML Root',
    desc: 'CBI-spezifischer Document-Wrapper (urn:CBI:xsd:...). CBI hat eigene XSDs, die auf ISO-20022 aufsetzen, aber Namespaces, zusaetzliche Pflicht-Felder und italienische Fiscal-Identifier ergaenzen. Publiziert vom Konsortium CBI S.c.p.a. (Corporate Banking Interbancario).',
    children: [
      {
        name: 'CBIPaymentRequest / CBIBdyPaymentRequest',
        card: '1',
        type: 'Complex',
        desc: 'Body fuer SCT/Bonifico-Initiierung (CBI-Bonifico). Enthaelt GrpHdr, PmtInf, CdtTrfTxInf analog pain.001, jedoch mit CBI-Pflicht-Erweiterungen: InitgPty/Id/OrgId/Othr mit Codice Fiscale (11-stellig) oder Partita IVA.',
      },
      {
        name: 'CBIBdySDDReqLogMsg — Direct Debit Initiation',
        card: '0..1',
        type: 'Complex',
        desc: 'CBI-Variante der pain.008 fuer SDD-Incassi. Umfasst SEDA-Mandats-Referenzen sowie italienische RID/SDD-Migrations-Konstrukte.',
      },
      {
        name: 'GrpHdr — Group Header',
        card: '1',
        type: 'Complex',
        desc: 'MsgId, CreDtTm, NbOfTxs, CtrlSum, InitgPty. Im CBI-Kontext verpflichtend InitgPty/Id/OrgId/Othr/Id mit SchmeNm/Prtry = "CBI" und Wert = ABI-Code + Sub-Code des einreichenden Unternehmens.',
      },
      {
        name: 'PmtInf — Payment Information Block',
        card: '1..N',
        type: 'Complex',
        desc: 'Enthaelt Dbtr / Cdtr (je nach Richtung) mit italienischen Tax-IDs. IBAN zwingend IT.. Prefix. DbtrAgt/FinInstnId/ClrSysMmbId/MmbId = ABI-Code (5 Digits) + CAB-Code (5 Digits) als italienische Bank-Identifier.',
        children: [
          {
            name: 'InitgPty / Dbtr / Cdtr — Party Identification',
            card: '1',
            type: 'Complex',
            desc: 'Pflicht: Nm (Ragione Sociale), PstlAdr (Sede Legale), Id/OrgId/Othr/Id = Codice Fiscale (natuerliche Personen, 16 alphanumerisch) oder Partita IVA (juristische Personen, 11 numerisch).',
          },
          {
            name: 'CdtTrfTxInf / DrctDbtTxInf — Transaction Detail',
            card: '1..N',
            type: 'Complex',
            desc: 'EndToEndId nutzt CBI-Konvention fuer Referenzierung zur FatturaPA ueber SDI-Protokoll (z.B. SDI-IdSdiTrasmissione). RmtInf/Strd/RfrdDocInf verweist auf FatturaPA-Progressivo.',
          },
        ],
      },
    ],
  },
  {
    name: 'CBI-Tracciato (Legacy Flat)',
    card: '0..N',
    type: 'Fixed 120 char (CBI-STD)',
    desc: 'Historisches Flat-File-Format "Tracciato CBI" (vor XML-Migration): Saetze IB (Testata), 14/20/30/40/50 Analogue RiBa, EF (Coda). Teilweise noch produktiv bei mittelstaendischen IT-Buchungskreisen. In SAP via Custom-DMEE-Baum mit Fixed-Length-Nodes erzeugt.',
  },
];

const migrations: Migration[] = [
  {
    label: 'CBI-Bonifico 00.04.00 → 00.04.01 (2020er Release)',
    fromVersion: '00.04.00',
    toVersion: '00.04.01',
    changes: [
      { field: 'RgltryRptg', oldValue: 'optional', newValue: 'pflicht bei extra-EU-Zahlungen', type: 'changed' },
      { field: 'UltmtDbtr / UltmtCdtr', oldValue: '—', newValue: 'ergaenzende Tax-ID-Subelemente', type: 'new' },
      { field: 'SDI-Referenz in RmtInf/Strd', oldValue: 'freitextlich', newValue: 'strukturiert ueber CdtrRefInf/Tp/CdOrPrtry/Prtry = "SDI"', type: 'changed' },
    ],
  },
  {
    label: 'Parallel-Phase CBI-XML ↔ reiner SEPA SCT pain.001.001.09',
    fromVersion: 'CBI-proprietaer',
    toVersion: 'pain.001.001.09 (EPC-Standard)',
    changes: [
      { field: 'Namespace', oldValue: 'urn:CBI:xsd:CBIPaymentRequest.00.04.00', newValue: 'urn:iso:std:iso:20022:tech:xsd:pain.001.001.09', type: 'changed' },
      { field: 'Codice Fiscale / Partita IVA', oldValue: 'OrgId/Othr/Id + SchmeNm Prtry CBI', newValue: 'OrgId/Othr/Id + SchmeNm Cd = "TXID" oder "CUST"', type: 'changed' },
      { field: 'ABI+CAB', oldValue: 'ClrSysMmbId/MmbId (ABI 5n + CAB 5n)', newValue: 'ueberwiegend BICFI (ersetzt ABI/CAB im Interbank-Clearing)', type: 'changed' },
    ],
  },
];

const featureDefs: FeatureDef[] = [
  {
    match: /Codice\s*Fiscale|\bCF\b/i,
    name: 'Codice Fiscale (CF)',
    what: '16-stelliger alphanumerischer Steuercode (natuerliche Personen) oder 11-stelliger numerischer Code (juristische Personen). In CBI-XML in OrgId/Othr/Id oder PrvtId/Othr/Id mit SchmeNm/Prtry = "CF". Pflicht bei Inlands-SDD/SCT innerhalb IT.',
    tokens: ['Codice Fiscale', 'CF', 'OrgId/Othr/Id'],
  },
  {
    match: /Partita\s*IVA|\bP\.?\s*IVA\b|VAT\s*IT/i,
    name: 'Partita IVA (P.IVA)',
    what: '11-stellige numerische USt-IdNr. italienischer Unternehmen. In CBI-Kontext via OrgId/Othr/Id mit SchmeNm/Prtry = "PIVA" oder via Id/OrgId/Othr/Id/SchmeNm/Cd = "TXID". Pflicht fuer B2B-Bonifico.',
    tokens: ['Partita IVA', 'P.IVA', 'VAT'],
  },
  {
    match: /SDI|Sistema\s*di\s*Interscambio/i,
    name: 'SDI-Referenz-Einbettung',
    what: 'Verknuepfung Zahlung ↔ FatturaPA-E-Rechnung ueber SDI-Progressivo. In CdtTrfTxInf/RmtInf/Strd/CdtrRefInf mit Tp/CdOrPrtry/Prtry = "SDI" und Ref = IdSdiTrasmissione. Essenziell fuer Reconciliation in ERP (SAP via DRC-Event-Linkage).',
    tokens: ['SDI', 'IdSdiTrasmissione', 'Sistema di Interscambio', 'Progressivo'],
  },
  {
    match: /ABI|CAB/i,
    name: 'ABI/CAB-Bank-Identifier',
    what: 'Historische IT-Bank-Codes: ABI (5 Digits, Bank) + CAB (5 Digits, Filiale). In modernen CBI-XML meist redundant zum IBAN, aber fuer RiBa und Legacy-Incassi pflichtig. ClrSysMmbId/ClrSysId/Cd = "ITNCC" (NCC-Kode Italien).',
    tokens: ['ABI', 'CAB', 'ITNCC', 'ClrSysMmbId'],
  },
  {
    match: /CBI\s*Globe|CBI\s*Gateway/i,
    name: 'CBI Globe — PSD2 Gateway',
    what: 'Zentraler Access-to-Account-Hub des CBI-Konsortiums fuer PSD2 AISP/PISP-Zugriffe. API-Layer ueber die CBI-Payment-Formate. Relevant fuer Payment-Initiation-Services (PIS) von Corporates.',
    tokens: ['CBI Globe', 'PSD2', 'AISP', 'PISP'],
  },
  {
    match: /DMEE|SAP.*Italien|BCM.*Intesa|BCM.*UniCredit/i,
    name: 'SAP DMEE/DMEEX fuer CBI',
    what: 'Kein Standard-SAP-DMEEX-Tree fuer CBI-XML — typisch Custom-DMEEX mit Namespace-Overrides oder Add-On von Serrala / Hanse Orga / Payments Add-Ons. BCM IT-Bank-Connectoren fuer Intesa Sanpaolo, UniCredit, BancoBPM, BPER ueber Host-to-Host SFTP.',
    tokens: ['DMEEX', 'Serrala', 'Hanse Orga', 'BCM', 'Intesa Sanpaolo', 'UniCredit'],
  },
];

registerFormat({
  formatName: 'CBI',
  region: 'Italien',
  characterSet: 'utf-8',
  rejectCodeGroup: null,
  schemaUriPattern: 'urn:CBI:xsd:CBIPaymentRequest.00.04.00',
  structure,
  migrations,
  featureDefs,
});
