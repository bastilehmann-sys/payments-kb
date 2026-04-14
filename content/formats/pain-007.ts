import { registerFormat } from '@/lib/formats/registry';

registerFormat({
  formatName: 'pain.007',
  region: 'Global / SEPA',
  characterSet: 'sepa-latin',
  rejectCodeGroup: 'iso20022',
  schemaUriPattern: 'urn:iso:std:iso:20022:tech:xsd:pain.007.001.<v>',
  structure: [
    {
      name: 'CstmrPmtRvsl',
      card: '1',
      desc: 'Root: Customer Payment Reversal — Stornierung einer bereits ausgeführten (Direct-Debit-) Zahlung durch den Initiator.',
      children: [
        {
          name: 'GrpHdr',
          card: '1',
          desc: 'Nachrichtenkopf der Reversal-Datei.',
          children: [
            { name: 'MsgId', card: '1', desc: 'Eindeutige Reversal-Message-ID.' },
            { name: 'CreDtTm', card: '1', desc: 'Erstellungszeitpunkt.' },
            { name: 'NbOfTxs', card: '1', desc: 'Anzahl zu stornierender Transaktionen.' },
            { name: 'CtrlSum', card: '0..1', desc: 'Kontrollsumme der Rückforderungsbeträge.' },
            { name: 'InitgPty', card: '1', desc: 'Auslöser der Reversal-Datei.' },
          ],
        },
        {
          name: 'OrgnlGrpInfAndRvsl',
          card: '0..1',
          desc: 'Reversal auf Gruppen-Ebene (komplette Original-Datei zurückgeben).',
          children: [
            { name: 'OrgnlMsgId', card: '1', desc: 'Referenz auf Original-GrpHdr/MsgId.' },
            { name: 'OrgnlMsgNmId', card: '1', desc: 'Original-Nachrichtentyp (z.B. pain.008.001.08).' },
            { name: 'OrgnlCreDtTm', card: '0..1', desc: 'Ursprungs-CreDtTm.' },
            { name: 'OrgnlNbOfTxs', card: '0..1', desc: 'Ursprungs-Anzahl.' },
            { name: 'OrgnlCtrlSum', card: '0..1', desc: 'Ursprungs-Summe.' },
            { name: 'GrpRvsl', card: '0..1', desc: 'Boolean: ganze Gruppe zurückrufen.' },
            { name: 'RvslRsnInf', card: '0..N', desc: 'Reversal-Grund: Rsn/Cd (AM05 Duplicate, AC04 ClosedAccount, FRAD Fraud, TECH etc.).' },
          ],
        },
        {
          name: 'OrgnlPmtInfAndRvsl',
          card: '0..N',
          desc: 'Reversal auf Payment-Information-Ebene.',
          children: [
            { name: 'OrgnlPmtInfId', card: '1', desc: 'Referenz auf ursprüngliche PmtInfId.' },
            { name: 'OrgnlNbOfTxs', card: '0..1', desc: 'Batch-Anzahl ursprünglich.' },
            { name: 'OrgnlCtrlSum', card: '0..1', desc: 'Batch-Summe ursprünglich.' },
            { name: 'PmtInfRvsl', card: '0..1', desc: 'Boolean: kompletter Batch zurückrufen.' },
            { name: 'RvslRsnInf', card: '0..N', desc: 'Grund auf Batch-Ebene.' },
            {
              name: 'TxInf',
              card: '0..N',
              desc: 'Einzel-Transaktion innerhalb des Reversal.',
              children: [
                { name: 'RvslId', card: '0..1', desc: 'Reversal-ID des Initiators.' },
                { name: 'OrgnlInstrId', card: '0..1', desc: 'Referenz auf InstrId.' },
                { name: 'OrgnlEndToEndId', card: '1', desc: 'Referenz auf EndToEndId — Kern-Match-Key.' },
                { name: 'OrgnlUETR', card: '0..1', desc: 'Ursprungs-UETR (ab v.10).' },
                { name: 'OrgnlInstdAmt', card: '0..1', desc: 'Ursprünglich instruierter Betrag.' },
                { name: 'RvsdInstdAmt', card: '0..1', desc: 'Tatsächlich zurückgeforderter Betrag (kann geringer sein).' },
                { name: 'ChrgBr', card: '0..1', desc: 'Gebührenregelung für den Reversal.' },
                { name: 'ChrgsInf', card: '0..N', desc: 'Einzelne Gebührenpositionen.' },
                { name: 'RvslRsnInf', card: '0..N', desc: 'Transaktions-spezifischer Grund (AM09 WrongAmount, DUPL Duplicate, FRAD Fraud).' },
                { name: 'OrgnlTxRef', card: '0..1', desc: 'Auszug der Original-Transaktionsdaten.' },
              ],
            },
          ],
        },
      ],
    },
  ],
  migrations: [],
  featureDefs: [
    { match: /AM05|DUPL|Duplicate/i, name: 'Duplicate-Reversal', what: 'RvslRsnInf/Rsn/Cd=AM05 oder DUPL: doppelt ausgeführte Zahlung. Häufigster Reversal-Grund bei Batch-Wiederholung.', tokens: ['AM05', 'DUPL'] },
    { match: /FRAD|Fraud/i, name: 'Fraud-Reversal', what: 'Rsn=FRAD: betrügerische Transaktion. Rückruf jederzeit zulässig, ohne Zustimmung des Empfängers.', tokens: ['FRAD'] },
    { match: /AM09|WrongAmount/i, name: 'Wrong-Amount', what: 'Rsn=AM09: falsch eingezogener Betrag. RvsdInstdAmt enthält Rückforderungs-Teilbetrag.', tokens: ['AM09', 'RvsdInstdAmt'] },
    { match: /GrpRvsl|PmtInfRvsl/i, name: 'Ebene des Reversal', what: 'Gruppe, Batch oder Einzeltransaktion — je nach gesetztem Indicator-Flag. Keine Mischung in einer Datei.', tokens: ['GrpRvsl', 'PmtInfRvsl'] },
    { match: /ChrgBr|ChrgsInf/i, name: 'Gebühren-Handling', what: 'Wer trägt die Reversal-Gebühr? ChrgBr=DEBT/CRED/SHAR. Relevant für Clearing-Abrechnung.', tokens: ['ChrgBr', 'ChrgsInf'] },
  ],
});
