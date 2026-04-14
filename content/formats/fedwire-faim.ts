import { registerFormat } from '@/lib/formats/registry';
import type { StructureNode, Migration } from '@/lib/formats/types';

const structure: StructureNode[] = [
  {
    name: 'Message Disposition & IMAD/OMAD',
    card: '1',
    type: 'Fixed-Width Tags',
    desc: 'Input Message Accountability Data (IMAD, 22 char) vom Sender, Output Message Accountability Data (OMAD) vom Fed-System. Eindeutige Ende-zu-Ende-Referenz jeder Fedwire-Message im Tagessegment.',
  },
  {
    name: 'Field 1510 — Type/Subtype Code',
    card: '1',
    type: '4n',
    desc: 'Message Type + Subtype. Üblich: 1000 Customer Transfer, 1500 Bank-to-Bank, 1600 Customer Transfer Plus (mit Bene-Info). Subtype 00=Basic, 02=Reversal, 07=Credit Request, 08=Credit Request Reversal.',
  },
  {
    name: 'Field 2000 — Amount',
    card: '1',
    type: '12n',
    desc: 'Amount in USD-Cents, rechtsbündig zero-padded. Max 9.999.999.999,99 USD pro Fedwire-Message (National Settlement).',
  },
  {
    name: 'Field 3100 — Sender DI (ABA Routing Number)',
    card: '1',
    type: '9n + Name',
    desc: 'Sender Depository Institution: 9-stellige ABA Routing Number mit MOD-10-Prüfziffer (3*d1 + 7*d2 + 1*d3 + 3*d4 + 7*d5 + 1*d6 + 3*d7 + 7*d8 + 1*d9 mod 10 = 0) plus Sender-Name.',
  },
  {
    name: 'Field 3400 — Receiver DI',
    card: '1',
    type: '9n + Name',
    desc: 'Receiver Depository Institution: ABA Routing Number des empfangenden Instituts + Name. Muss im Fed Participant Directory (FedACH/Fedwire Membership) registriert sein.',
  },
  {
    name: 'Field 3600 — Business Function Code',
    card: '1',
    type: '3a',
    desc: 'Geschäftszweck der Zahlung. CTR=Customer Transfer, BTR=Bank Transfer, DEP=Deposit to Sender Account, DRB=Bank-to-Bank Draw-Down, CKS=Check Same-Day Settlement, FFR=Fed Funds Returned, FFS=Fed Funds Sold.',
  },
  {
    name: 'Field 4200 — Beneficiary',
    card: '0..1',
    type: 'ID Code + Identifier + Name/Address (4×35)',
    desc: 'Endbegünstigter. ID Code: B=Account, C=CHIPS Participant, D=DDA, F=BIC, T=TIN, U=UID. Name und Adresse in 4 Zeilen à 35 Zeichen.',
  },
  {
    name: 'Field 5000 — Originator',
    card: '0..1',
    type: 'ID Code + Identifier + Name/Address (4×35)',
    desc: 'Auftraggeber. Struktur analog Beneficiary. Bei Travel Rule Threshold ($3.000) Pflichtangaben nach 31 CFR §1010.410.',
  },
  {
    name: 'Field 6000 — Originator to Beneficiary Information (OBI)',
    card: '0..1',
    type: '4×35 char',
    desc: 'Freitext vom Auftraggeber an Endbegünstigten. Max 140 Zeichen (4 Lines × 35). In pacs.008-Migration → RmtInf/Ustrd bzw. Strd.',
  },
  {
    name: 'Field 5100/6100 — Intermediary FI / Beneficiary FI',
    card: '0..1',
    type: 'ID Code + Identifier + Name/Address',
    desc: 'Korrespondenzbank-Kette, wenn Beneficiary nicht direkt am Fedwire teilnimmt.',
  },
  {
    name: 'Field 3320 — Sender Reference',
    card: '0..1',
    type: '16x',
    desc: 'Eindeutige Auftraggeber-Referenz (analog EndToEndId). Wird in pacs.008-Migration zu UETR gemappt.',
  },
];

const migrations: Migration[] = [
  {
    label: 'Fedwire FAIM → ISO 20022 pacs.008 (10.03.2025)',
    fromVersion: 'FAIM-Proprietary',
    toVersion: 'pacs.008.001.08',
    changes: [
      { field: 'Message Envelope', oldValue: 'Fixed-Width Tagged FAIM', newValue: 'XML pacs.008.001.08 (Fed-CBPR+-Profile)', type: 'changed' },
      { field: 'Field 3100/3400 Party ID', oldValue: '9-digit ABA Routing Number', newValue: 'ClrSysMmbId/MmbId mit ClrSysId=USABA', type: 'changed' },
      { field: 'Field 3600 Business Function Code', oldValue: 'CTR, BTR, DRB, DEP (3-Letter)', newValue: 'LocalInstrument Code + PmtTpInf/CtgyPurp', type: 'changed' },
      { field: 'IMAD/OMAD', oldValue: 'Proprietäre Accountability-Data-Strings', newValue: 'UETR (End-to-End Unique Identifier, UUIDv4)', type: 'changed' },
      { field: 'Field 6000 OBI (140 char)', oldValue: '4×35 unstrukturierter Freitext', newValue: 'RmtInf/Strd (structured) oder Ustrd bis 9.000 Zeichen', type: 'changed' },
      { field: 'Hybrid Postal Address', oldValue: '4×35 freie Address-Lines', newValue: 'Strukturierte PstlAdr (StrtNm, TwnNm, PstCd, Ctry) — Pflicht ab 2025', type: 'new' },
      { field: 'Truncation Fee / Check-Same-Day (CKS)', oldValue: 'Eigene BFC', newValue: 'In pacs.008 nicht mehr — separate Fedwire-Securities-Nachrichten', type: 'removed' },
    ],
  },
];

registerFormat({
  formatName: 'Fedwire FAIM',
  region: 'USA',
  characterSet: 'us-ascii',
  rejectCodeGroup: null,
  schemaUriPattern: undefined,
  structure,
  migrations,
  featureDefs: [
    {
      match: /ABA|Routing\s*Number/i,
      name: 'ABA Routing Number (9-Digit MOD-10)',
      what: 'American Bankers Association Routing Transit Number. 9 Ziffern: Position 1-4 Federal Reserve Routing Symbol, 5-8 ABA Institution Identifier, 9 MOD-10-Prüfziffer. Validierungs-Checksum (3+7+1-Gewichtung) MUSS vor Fedwire-Einreichung laufen, sonst Field-1510-Reject.',
      tokens: ['ABA', 'Routing Number', 'MOD-10', 'RTN'],
    },
    {
      match: /Business\s*Function\s*Code|BFC/i,
      name: 'Business Function Codes',
      what: 'Klassifiziert den Geschäftsvorfall. CTR (Customer Transfer) für Commercial Payments, BTR (Bank Transfer) für Interbank Liquidity, DRB (Draw-Down Request) für Corporate Cash Concentration, DEP (Deposit) für Federal Reserve Account-Funding. Mapping zu ISO: LocalInstrument-Code + CtgyPurp in pacs.008.',
      tokens: ['BFC', 'CTR', 'BTR', 'DRB', 'DEP'],
    },
    {
      match: /OFAC/i,
      name: 'OFAC Screening (U.S. Treasury)',
      what: 'Office of Foreign Assets Control — verpflichtendes Sanktions-Screening gegen SDN List für jede Fedwire-Message. 31 CFR §501.603 verlangt Blockierung bei Hit; RDFI darf Zahlung nicht gutschreiben. In SAP FSCM-BCM via GTS-Compliance-Screening vor Message-Versand.',
      tokens: ['OFAC', 'SDN', 'Sanctions Screening'],
    },
    {
      match: /UETR/i,
      name: 'UETR in ISO-20022-Migration',
      what: 'Unique End-to-end Transaction Reference (UUIDv4, 36 char) — Pflichtfeld seit 10.03.2025 Fed ISO-20022-Umstellung. Ersetzt FAIM IMAD als End-to-End-Referenz über Korrespondenzbanken hinweg. Voraussetzung für gpi-Tracking wenn Fedwire-Leg → SWIFT-Leg.',
      tokens: ['UETR', 'ISO 20022', '2025-03-10'],
    },
    {
      match: /SAP\s*(FSN|Cloud\s*for\s*Fedwire)/i,
      name: 'SAP Cloud for Fedwire via FSN',
      what: 'SAP Financial Services Network (FSN) bietet Fedwire-Konnektivität über zertifizierte Bank-Partner (BofA, JPMC, Wells Fargo). FAIM-Output via DMEEX-Baum, ab 2025 pacs.008-XML. Inbound Acknowledgments (ACK/NAK) werden in FSCM-BCM Status Dashboard gematcht.',
      tokens: ['FSN', 'FSCM-BCM', 'DMEEX'],
    },
  ],
});
