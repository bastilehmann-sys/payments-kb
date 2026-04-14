import { registerFormat } from '@/lib/formats/registry';
import type { StructureNode } from '@/lib/formats/types';

const structure: StructureNode[] = [
  {
    name: 'Sequence A — General Information',
    card: '1',
    type: 'Sequence',
    desc: 'Einmaliger Kopfblock pro MT101 — gilt für alle Transaktionen in der Nachricht. Auftraggeber → Bank zur Ausführung als MT103/MT202.',
    children: [
      { name: ':20:', card: '1', type: '16x', desc: 'Sender’s Reference — eindeutige Referenz des Auftraggebers (analog EndToEndId).' },
      { name: ':21R:', card: '0..1', type: '16x', desc: 'Customer Specified Reference — Referenz des Kunden gegenüber der ausführenden Bank.' },
      { name: ':28D:', card: '1', type: '5n/5n', desc: 'Message Index / Total — "1/1" für Einzel-Message, "1/3" etc. bei Splitting.' },
      { name: ':50a:', card: '0..1', type: 'Option C/G/H/L', desc: 'Instructing Party — die auftraggebende Partei (nur falls ≠ Ordering Customer).' },
      { name: ':50a:', card: '1', type: 'Option F/G/H', desc: 'Ordering Customer — Auftraggeber (Kontoinhaber). Option F = Freitext+Adresse, G/H = Account+BIC.' },
      { name: ':52a:', card: '0..1', type: 'Option A/C', desc: 'Account Servicing Institution — kontoführende Bank des Auftraggebers.' },
      { name: ':51A:', card: '0..1', type: 'BIC', desc: 'Sending Institution — nur bei FileAct/FINCopy relevant.' },
      { name: ':30:', card: '1', type: '6!n (YYMMDD)', desc: 'Requested Execution Date — gewünschtes Ausführungsdatum für alle Transaktionen.' },
      { name: ':25:', card: '0..1', type: '35x', desc: 'Authorisation — Autorisierungsangabe (z.B. Limitfreigabe).' },
    ],
  },
  {
    name: 'Sequence B — Transaction Details (repeating)',
    card: '1..N',
    type: 'Sequence',
    desc: 'Wiederholbarer Block pro Einzeltransaktion. SAP DMEE-Baumtyp MT101 bildet diese Sequenz je Zahlung ab.',
    children: [
      { name: ':21:', card: '1', type: '16x', desc: 'Transaction Reference — pro Einzeltransaktion eindeutig.' },
      { name: ':21F:', card: '0..1', type: '16x', desc: 'F/X Deal Reference — FX-Kontrakt-Referenz bei Devisengeschäften.' },
      { name: ':23E:', card: '0..N', type: '4!c[/30x]', desc: 'Instruction Code — CHQB, CORT, HOLD, PHOB, REPA, URGP usw.' },
      { name: ':32B:', card: '1', type: '3!a15d', desc: 'Currency / Transaction Amount — ISO-Währung und Betrag der Einzeltransaktion.' },
      { name: ':50a:', card: '0..1', type: 'Option C/F/G/H/L', desc: 'Instructing Party — überschreibt Sequenz-A-Wert pro Transaktion.' },
      { name: ':50a:', card: '0..1', type: 'Option F/G/H', desc: 'Ordering Customer — falls auf Transaktions-Ebene abweichend (POBO).' },
      { name: ':52a:', card: '0..1', type: 'Option A/C', desc: 'Account Servicing Institution für diese Einzeltransaktion.' },
      { name: ':56a:', card: '0..1', type: 'Option A/C/D', desc: 'Intermediary — zwischengeschaltete Bank.' },
      { name: ':57a:', card: '0..1', type: 'Option A/C/D', desc: 'Account With Institution — empfängerseitige Bank.' },
      { name: ':59a:', card: '1', type: 'Option no-letter/A/F', desc: 'Beneficiary — Empfänger (Name, Adresse, IBAN/Account).' },
      { name: ':70:', card: '0..1', type: '4*35x', desc: 'Remittance Information — Verwendungszweck (max. 4×35 Zeichen).' },
      { name: ':77B:', card: '0..1', type: '3*35x', desc: 'Regulatory Reporting — AWV-Z4-Meldung, Tax-ID, Capital-Controls-Codes.' },
      { name: ':33B:', card: '0..1', type: '3!a15d', desc: 'Currency / Instructed Amount — ursprünglich instruierter Betrag vor FX.' },
      { name: ':71A:', card: '1', type: '3!a', desc: 'Details of Charges — OUR / SHA / BEN.' },
      { name: ':25A:', card: '0..1', type: '/34x', desc: 'Charges Account — abweichendes Gebührenkonto.' },
      { name: ':36:', card: '0..1', type: '12d', desc: 'Exchange Rate — wenn :33B: ≠ :32B: Währung.' },
    ],
  },
];

registerFormat({
  formatName: 'MT101',
  region: 'Global / SWIFT FIN (Legacy)',
  characterSet: 'swift-x',
  rejectCodeGroup: 'swift-mt',
  schemaUriPattern: undefined,
  structure,
  migrations: [
    {
      label: 'SWIFT MT → MX Migration (CBPR+, Nov 2025)',
      fromVersion: 'MT101',
      toVersion: 'pain.001.001.09 (CBPR+)',
      changes: [
        { field: 'Nachrichtenformat', oldValue: 'SWIFT FIN Tag-basiert (Blöcke 1-5)', newValue: 'ISO 20022 XML (pain.001 für Customer-Initiation, pacs.008 im Interbank-Leg)', type: 'changed' },
        { field: 'Adressen', oldValue: ':50a:/:59a: Freitext 4*35x', newValue: 'Strukturierte PostalAddress24 (StrtNm, BldgNb, PstCd, TwnNm, Ctry)', type: 'changed' },
        { field: 'Zeichensatz', oldValue: 'SWIFT-X (begrenzter ASCII)', newValue: 'UTF-8 / Latin-1 Erweiterung', type: 'changed' },
        { field: 'Tracking-ID', oldValue: '— nicht vorhanden', newValue: 'UETR (UUID) als Pflicht-Feld', type: 'new' },
        { field: 'Remittance Information', oldValue: ':70: max. 4×35 Zeichen Freitext', newValue: 'Ustrd 0..N × 140 oder Strd-Block mit Referenzen', type: 'changed' },
      ],
    },
  ],
  featureDefs: [
    {
      match: /SWIFT\s*gpi|UETR/i,
      name: 'SWIFT gpi / UETR-Forward',
      what: 'Obwohl MT101 selbst kein UETR-Feld hat, generiert die ausführende Bank für den nachgelagerten MT103 eine UETR für gpi-Tracking.',
      tokens: ['gpi', 'UETR'],
    },
    {
      match: /POBO|Payments\s*on\s*behalf/i,
      name: 'POBO via :50a: Instructing Party',
      what: 'Payment-on-Behalf-of: Konzern-Treasury (Instructing Party) beauftragt Bank im Namen einer Tochter (Ordering Customer). Klassisches IHB-Szenario.',
      tokens: ['Instructing Party', 'Ordering Customer', 'POBO'],
    },
    {
      match: /DMEE\b/i,
      name: 'SAP DMEE-Baum MT101',
      what: 'SAP F110 erzeugt MT101 via DMEE-Baum (nicht DMEEX) — Sequence B wird pro Zahlung iteriert. Ausgabe als FIN-Datei oder via SAP BCM / Host-to-Host.',
      tokens: ['DMEE', 'F110', 'BCM'],
    },
    {
      match: /:28D:|Message Index/i,
      name: 'Message Index / Splitting',
      what: ':28D: erlaubt das Splitten einer logischen Order über mehrere physische Messages (z.B. "1/3", "2/3", "3/3") bei >10 Einzeltransaktionen.',
      tokens: ['28D', 'Message Index'],
    },
  ],
});
