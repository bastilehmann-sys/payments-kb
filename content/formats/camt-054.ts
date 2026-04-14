import { registerFormat } from '@/lib/formats/registry';

registerFormat({
  formatName: 'camt.054',
  region: 'Global / SEPA',
  characterSet: 'sepa-latin',
  rejectCodeGroup: null,
  schemaUriPattern: 'urn:iso:std:iso:20022:tech:xsd:camt.054.001.<v>',
  structure: [
    {
      name: 'BkToCstmrDbtCdtNtfctn',
      card: '1',
      desc: 'Bank-to-Customer Debit/Credit Notification. Einzel-Avis für gutgeschriebene oder belastete Positionen — kein vollständiger Auszug, kein Saldo. Wird von Banken oft sofort bei Buchung gepusht (Near-Real-Time), insbesondere für hochvolumige Batch-Gutschriften (z.B. SEPA SDD Sammel, Lohn-Rückläufer).',
      children: [
        {
          name: 'GrpHdr',
          card: '1',
          desc: 'MsgId, CreDtTm, MsgRcpt, MsgPgntn. Ein File kann mehrere Ntfctn-Blöcke enthalten.',
        },
        {
          name: 'Ntfctn',
          card: '1..N',
          desc: 'Benachrichtigungs-Block pro Konto/Ereignis. Kein Bal (Salden), nur Buchungen — das unterscheidet camt.054 klar von camt.053.',
          children: [
            { name: 'Id', card: '1', desc: 'Notification-Id, bankseitig.' },
            { name: 'ElctrncSeqNb', card: '0..1', desc: 'Sequenznummer (optional, da camt.054 keine lückenlose Auszugs-Folge sein muss).' },
            { name: 'CreDtTm', card: '1', desc: 'Erstellung der Notification.' },
            { name: 'FrToDt', card: '0..1', desc: 'Erfassungszeitraum.' },
            {
              name: 'Acct',
              card: '1',
              desc: 'Empfänger-Konto der Notification.',
              children: [
                { name: 'Id', card: '1', desc: 'IBAN oder Othr/Id.' },
                { name: 'Ccy', card: '0..1', desc: 'Kontowährung.' },
                { name: 'Ownr', card: '0..1', desc: 'Kontoinhaber.' },
                { name: 'Svcr', card: '0..1', desc: 'Kontoführende Bank.' },
              ],
            },
            { name: 'RltdAcct', card: '0..1', desc: 'Verbundenes Konto.' },
            {
              name: 'Ntry',
              card: '1..N',
              desc: 'Buchungs-Ereignisse. Mindestens 1 Pflicht — im Gegensatz zu camt.053 kein "leerer Report" möglich. Häufig BatchBookg=true mit vielen TxDtls pro Ntry.',
              children: [
                { name: 'Amt', card: '1', desc: 'Buchungsbetrag (Summenbetrag bei Batch).' },
                { name: 'CdtDbtInd', card: '1', desc: 'CRDT=Gutschrift-Avis, DBIT=Belastungs-Avis (z.B. SDD-ERSS-Einzug durch Lastschrifteinreicher).' },
                { name: 'RvslInd', card: '0..1', desc: 'true bei Rücklastschrift / R-Transaction (Reversal).' },
                { name: 'Sts', card: '1', desc: 'BOOK oder PDNG. Bei pre-Advice auch INFO.' },
                { name: 'BookgDt', card: '0..1', desc: 'Buchungsdatum.' },
                { name: 'ValDt', card: '0..1', desc: 'Valuta.' },
                { name: 'AcctSvcrRef', card: '0..1', desc: 'Bankreferenz.' },
                { name: 'BtchBookg', card: '0..1', desc: 'true = Summenbuchung mit mehreren Einzel-TxDtls. Bei camt.054 sehr häufig (das ist der primäre Use-Case: Einzel-Avis zu einer Sammelbuchung).' },
                { name: 'BkTxCd', card: '1', desc: 'Domn/Fmly/SubFmlyCd. Typisch PMNT/RCDT/ESCT (SEPA CT Credit), PMNT/RDDT/ESDD (SEPA DD Direct Debit), PMNT/RCDT/SALA (Gehalt).' },
                {
                  name: 'NtryDtls',
                  card: '1..N',
                  desc: 'Details-Container.',
                  children: [
                    { name: 'Btch', card: '0..1', desc: 'Batch-Info: PmtInfId (aus ursprünglichem pain.008/pain.001), NbOfTxs, TtlAmt. Brücke zur Original-Einreichung — wichtig für SAP-Clearing.' },
                    {
                      name: 'TxDtls',
                      card: '1..N',
                      desc: 'Einzel-Transaktionen innerhalb des Batch — je Original-Zahlung eine TxDtls. Hier stehen die Einzel-Beträge, EndToEndId, Dbtr/Cdtr.',
                      children: [
                        { name: 'Refs', card: '0..1', desc: 'MsgId, AcctSvcrRef, InstrId, EndToEndId, UETR, MndtId (SDD!), ChqNb.' },
                        { name: 'Amt', card: '0..1', desc: 'Einzel-Betrag der Tx (in AmtDtls).' },
                        { name: 'AmtDtls', card: '0..1', desc: 'InstdAmt, TxAmt, CntrValAmt.' },
                        { name: 'BkTxCd', card: '0..1', desc: 'Tx-spezifischer Code (kann von Ntry/BkTxCd abweichen).' },
                        { name: 'Chrgs', card: '0..1', desc: 'Gebühren.' },
                        {
                          name: 'RltdPties',
                          card: '0..1',
                          desc: 'Originator-Info: Dbtr, DbtrAcct, UltmtDbtr (Originator bei SCT — wichtig für Identifikation des Absenders bei Sammelgutschrift), Cdtr, CdtrAcct, UltmtCdtr.',
                        },
                        { name: 'RmtInf', card: '0..1', desc: 'Ustrd / Strd mit CdtrRefInf (RF-Referenz) — Schlüssel für Auto-Clearing offener Posten in SAP F.13.' },
                        { name: 'RtrInf', card: '0..1', desc: 'Return Information bei R-Transactions (RvslInd=true): OrgnlBkTxCd, Rsn/Cd (z.B. AM04 Insufficient Funds, MS03 No Reason, AC06 Blocked Account), AddtlInf.' },
                      ],
                    },
                  ],
                },
                { name: 'AddtlNtryInf', card: '0..1', desc: 'Free-Text bank-spezifisch.' },
              ],
            },
          ],
        },
      ],
    },
  ],
  migrations: [
    {
      label: 'camt.054.001.02 → camt.054.001.08',
      fromVersion: '054.001.02',
      toVersion: '054.001.08',
      changes: [
        { field: 'Refs/UETR', oldValue: 'nicht vorhanden', newValue: 'UETR für SWIFT gpi / Instant Payment Tracking', type: 'new' },
        { field: 'RtrInf/Rsn/Cd', oldValue: 'External Return Reason Code v1', newValue: 'erweiterter External Return Reason Code Set (neue Codes wie AG09, FF05)', type: 'changed' },
        { field: 'BkTxCd External Code Set', oldValue: 'v1', newValue: 'aktuelle Version inkl. INST (SCT Inst), FICT (FI Credit Transfer)', type: 'changed' },
        { field: 'Ownr/Id/OrgId', oldValue: 'BICOrBEI', newValue: 'AnyBIC + LEI', type: 'changed' },
        { field: 'PstlAdr', oldValue: 'AdrLine unstrukturiert', newValue: 'strukturiert (StrtNm, BldgNb, PstCd, TwnNm, Ctry) — CBPR+ Pflicht', type: 'changed' },
        { field: 'CharSet', oldValue: 'UTF-8 frei', newValue: 'SEPA Latin Character Set', type: 'changed' },
      ],
    },
  ],
  featureDefs: [
    {
      match: /ERSS|R-Transaction|Return|Rücklastschrift/i,
      name: 'ERSS-Abbuchung-Notification',
      what: 'SEPA Direct Debit ERSS / R-Transaction Avis: RvslInd=true, RtrInf mit OrgnlBkTxCd + Rsn/Cd (z.B. AM04 Insufficient, AC01 Incorrect Account, MD06 Refund Request by End Customer). SAP: DMEE-Return-Parser (camt.054) → SDD-Rücklastschrift-Handling in F-28/F110-Rückläufer, OP-Wiederöffnung.',
      tokens: ['RvslInd', 'RtrInf', 'AM04', 'AC01', 'MD06', 'MS03', 'AC06', 'ERSS', 'SDD'],
    },
    {
      match: /BatchBookg|Batch|Sammel|Avis/i,
      name: 'BatchBookg-Einzel-Avis',
      what: 'Primärer camt.054 Use-Case: Bank bucht Sammel-Gutschrift (z.B. 500 SDD-Einzüge = 1 Ntry mit BtchBookg=true), camt.054 liefert aber alle 500 Einzel-TxDtls. camt.053 hätte nur 1 Sammel-Ntry. In SAP: Sammelbuchung aufs Hausbank-Verrechnungskonto via camt.053, Einzel-Clearing der OP via camt.054.',
      tokens: ['BtchBookg', 'NtryDtls', 'TxDtls', 'Btch', 'PmtInfId'],
    },
    {
      match: /Originator|UltmtDbtr|Dbtr/i,
      name: 'Originator-Info',
      what: 'RltdPties/Dbtr + UltmtDbtr identifizieren Absender einer Sammelgutschrift. Bei Lohn-Rückläufern oder Kunden-Sammeleinzug unerlässlich für automatisches Clearing. EndToEndId + RF-Referenz in RmtInf/Strd sind Haupt-Matching-Schlüssel.',
      tokens: ['UltmtDbtr', 'UltmtCdtr', 'EndToEndId', 'CdtrRefInf', 'RF'],
    },
    {
      match: /Pre-Advice|PDNG|Pending/i,
      name: 'Pre-Advice / Pending',
      what: 'Sts=PDNG bei vorangekündigten Buchungen (z.B. Wertstellung morgen). INFO für rein informative Avisierung ohne Buchungs-Effekt. FF.5 standardmäßig nur BOOK — PDNG/INFO-Handling in eigenem Cash-Management-Verarbeitung.',
      tokens: ['PDNG', 'INFO', 'BOOK', 'Sts'],
    },
    {
      match: /FF\.5|FEBA|F\.13|SAP/i,
      name: 'SAP-Processing',
      what: 'FF.5 importiert camt.054 parallel zu camt.053. Typisches Setup: camt.053 bucht aufs Bankverrechnungskonto (Summe), camt.054 führt das OP-Clearing auf Kundenebene durch (F.13 mit EndToEndId). BAdI FIEB_CUSTOM für individuelle Mapping-Regeln. Customizing: OT83 + T028G wie bei camt.053.',
      tokens: ['FF.5', 'FEBA', 'F.13', 'OT83', 'T028G', 'FIEB_CUSTOM'],
    },
  ],
});
