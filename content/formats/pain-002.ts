import { registerFormat } from '@/lib/formats/registry';

registerFormat({
  formatName: 'pain.002',
  region: 'Global / SEPA',
  characterSet: 'sepa-latin',
  rejectCodeGroup: 'iso20022',
  schemaUriPattern: 'urn:iso:std:iso:20022:tech:xsd:pain.002.001.<v>',
  structure: [
    {
      name: 'CstmrPmtStsRpt',
      card: '1',
      desc: 'Root: Customer Payment Status Report — Status-Antwort der Bank auf eine eingereichte pain.001/pain.008.',
      children: [
        {
          name: 'GrpHdr',
          card: '1',
          desc: 'Kopf des Status-Reports.',
          children: [
            { name: 'MsgId', card: '1', desc: 'Eindeutige Report-Message-ID (von der Bank vergeben).' },
            { name: 'CreDtTm', card: '1', desc: 'Erstellungszeitpunkt des Reports.' },
            { name: 'InitgPty', card: '0..1', desc: 'Absender des Reports (i.d.R. Bank-BIC).' },
            { name: 'DbtrAgt', card: '0..1', desc: 'Kontoführende Bank — BICFI der Schuldnerbank.' },
            { name: 'CdtrAgt', card: '0..1', desc: 'Gläubigerbank (bei Gutschrifts-Status).' },
          ],
        },
        {
          name: 'OrgnlGrpInfAndSts',
          card: '1',
          desc: 'Status auf Gruppen-Ebene der ursprünglichen pain.001/008.',
          children: [
            { name: 'OrgnlMsgId', card: '1', desc: 'Referenz auf GrpHdr/MsgId der Original-Datei.' },
            { name: 'OrgnlMsgNmId', card: '1', desc: 'z.B. pain.001.001.09 — Nachrichtentyp der Original-Datei.' },
            { name: 'OrgnlCreDtTm', card: '0..1', desc: 'Ursprungs-CreDtTm (für eindeutiges Matching).' },
            { name: 'OrgnlNbOfTxs', card: '0..1', desc: 'Ursprungs-Transaktionszahl.' },
            { name: 'OrgnlCtrlSum', card: '0..1', desc: 'Ursprungs-Kontrollsumme.' },
            { name: 'GrpSts', card: '0..1', desc: 'Gruppen-Status: ACCP, ACSC, ACSP, PART, RJCT, RCVD.' },
            { name: 'StsRsnInf', card: '0..N', desc: 'Begründung bei RJCT/PART: Rsn/Cd aus ExternalStatusReason (z.B. AC01, AM04, CUST).' },
          ],
        },
        {
          name: 'OrgnlPmtInfAndSts',
          card: '0..N',
          desc: 'Status pro Payment-Information-Block (Batch-Ebene) der Original-pain.001.',
          children: [
            { name: 'OrgnlPmtInfId', card: '1', desc: 'Referenz auf PmtInfId der Original-Datei.' },
            { name: 'OrgnlNbOfTxs', card: '0..1', desc: 'Anzahl Transaktionen im Batch.' },
            { name: 'OrgnlCtrlSum', card: '0..1', desc: 'Summe im Batch.' },
            { name: 'PmtInfSts', card: '0..1', desc: 'Status auf Batch-Ebene (ACCP/RJCT/PART…).' },
            { name: 'StsRsnInf', card: '0..N', desc: 'Reject/Partial-Begründung auf Batch-Ebene.' },
            {
              name: 'TxInfAndSts',
              card: '0..N',
              desc: 'Status pro Einzeltransaktion.',
              children: [
                { name: 'StsId', card: '0..1', desc: 'Status-ID (von der Bank vergeben).' },
                { name: 'OrgnlInstrId', card: '0..1', desc: 'Referenz auf InstrId der Original-Transaktion.' },
                { name: 'OrgnlEndToEndId', card: '0..1', desc: 'Referenz auf EndToEndId — Kern-Matching-Key in SAP (BSEG-XBLNR).' },
                { name: 'OrgnlUETR', card: '0..1', desc: 'gpi-UETR der Ursprungs-Transaktion (ab pain.002.001.10).' },
                { name: 'TxSts', card: '0..1', desc: 'Transaktions-Status: ACCP, ACSP, ACSC, ACWC, RJCT, PDNG.' },
                { name: 'StsRsnInf', card: '0..N', desc: 'Rsn/Cd + AddtlInf: Grund des Status (z.B. AC01 IBAN ungültig, AM04 Deckung, CUST storniert).' },
                { name: 'OrgnlTxRef', card: '0..1', desc: 'Auszug der Original-Transaktionsdaten (Betrag, ReqdExctnDt, Parteien).' },
              ],
            },
          ],
        },
      ],
    },
  ],
  migrations: [
    {
      label: 'pain.002.001.03 → .10',
      fromVersion: '001.001.03',
      toVersion: '001.001.10',
      changes: [
        { field: 'OrgnlUETR', oldValue: '—', newValue: 'neu in TxInfAndSts', type: 'new' },
        { field: 'StsRsnInf/Rsn', oldValue: 'ISO20022-Reason-Codes (eingeschränkt)', newValue: 'ExternalStatusReason1Code (erweiterter Code-Set)', type: 'changed' },
        { field: 'PstlAdr', oldValue: 'unstrukturiert (AdrLine)', newValue: 'PostalAddress24 strukturiert', type: 'changed' },
      ],
    },
  ],
  featureDefs: [
    { match: /OrgnlUETR|UETR/i, name: 'UETR-Matching', what: 'Ursprungs-UETR in pain.002 — erlaubt eindeutiges Mapping zu gpi-Trackern und SAP BKPF-UETR-Feld.', tokens: ['OrgnlUETR', 'UETR'] },
    { match: /RJCT|Rjct/i, name: 'Reject-Handling', what: 'TxSts=RJCT mit StsRsnInf/Rsn/Cd. In SAP F110 über DMEEX-Status-Import in REGUH/REGUP zurückschreiben.', tokens: ['RJCT', 'StsRsnInf'] },
    { match: /ACSC|ACSP|ACCP/i, name: 'Status-Lebenszyklus', what: 'ACCP (angenommen) → ACSP (in Verarbeitung) → ACSC (gebucht beim Gläubiger). Nur ACSC ist finaler Erfolg.', tokens: ['ACCP', 'ACSP', 'ACSC'] },
    { match: /ExternalStatusReason|StsRsnInf/i, name: 'ExternalStatusReason-Codes', what: 'Standardisierte Reason-Codes AC01/AC04/AM04/CUST/DUPL/FRAD — Grundlage für Rückweisungs-Auswertung.', tokens: ['StsRsnInf', 'Rsn', 'Cd'] },
    { match: /PART/i, name: 'Partial-Acceptance', what: 'GrpSts/PmtInfSts=PART: nur Teil der Datei angenommen. Detail-Status pro TxInfAndSts prüfen.', tokens: ['PART'] },
  ],
});
