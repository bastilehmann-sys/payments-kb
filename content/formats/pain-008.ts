import { registerFormat } from '@/lib/formats/registry';

registerFormat({
  formatName: 'pain.008',
  region: 'Global / SEPA',
  characterSet: 'sepa-latin',
  rejectCodeGroup: 'iso20022',
  schemaUriPattern: 'urn:iso:std:iso:20022:tech:xsd:pain.008.001.<v>',
  structure: [
    {
      name: 'CstmrDrctDbtInitn',
      card: '1',
      desc: 'Root: Customer Direct Debit Initiation — Lastschrift-Auftrag vom Creditor an seine Bank (SEPA SDD Core/B2B).',
      children: [
        {
          name: 'GrpHdr',
          card: '1',
          desc: 'Nachrichtenkopf.',
          children: [
            { name: 'MsgId', card: '1', desc: 'Eindeutige Message-ID (max 35 Zeichen, in SAP F110-Lauf-ID-Referenz).' },
            { name: 'CreDtTm', card: '1', desc: 'Erstellungszeitpunkt.' },
            { name: 'NbOfTxs', card: '1', desc: 'Gesamt-Transaktionszahl über alle PmtInf-Blöcke.' },
            { name: 'CtrlSum', card: '0..1', desc: 'Summe aller InstdAmt.' },
            { name: 'InitgPty', card: '1', desc: 'Auftraggeber (Creditor oder Dienstleister). In SAP i.d.R. Buchungskreis-Daten.' },
          ],
        },
        {
          name: 'PmtInf',
          card: '1..N',
          desc: 'Payment-Information-Block — Batch pro (Creditor-IBAN, SeqTp, ReqdColltnDt, LclInstrm).',
          children: [
            { name: 'PmtInfId', card: '1', desc: 'Batch-ID, in SAP = Zahlungsträger-ID.' },
            { name: 'PmtMtd', card: '1', desc: 'Fix: DD (Direct Debit).' },
            { name: 'BtchBookg', card: '0..1', desc: 'true=Sammelbuchung auf Kontoauszug, false=Einzelbuchungen.' },
            { name: 'NbOfTxs', card: '0..1', desc: 'Anzahl in diesem Batch.' },
            { name: 'CtrlSum', card: '0..1', desc: 'Summe in diesem Batch.' },
            {
              name: 'PmtTpInf',
              card: '1',
              desc: 'Zahlungsart-Details.',
              children: [
                { name: 'SvcLvl/Cd', card: '1', desc: 'SEPA für Standard-SEPA-Lastschrift.' },
                { name: 'LclInstrm/Cd', card: '1', desc: 'CORE (Verbraucher) oder B2B (Firmen). Beeinflusst Rückgabe-Fristen.' },
                { name: 'SeqTp', card: '1', desc: 'FRST, RCUR, OOFF, FNAL — Mandats-Sequenz-Typ.' },
                { name: 'CtgyPurp/Cd', card: '0..1', desc: 'Kategorie (SALA, SUPP, TAXS).' },
              ],
            },
            { name: 'ReqdColltnDt', card: '1', desc: 'Fälligkeitsdatum des Einzugs. Bei SEPA Instant SDD (SRTP) ggf. abweichend.' },
            { name: 'Cdtr', card: '1', desc: 'Gläubiger — Nm + PstlAdr (PostalAddress24 strukturiert ab v.08).' },
            { name: 'CdtrAcct/Id/IBAN', card: '1', desc: 'IBAN des Creditor-Kontos.' },
            { name: 'CdtrAgt/FinInstnId/BICFI', card: '1', desc: 'BIC der Gläubigerbank (pflicht ab v.08 nur noch bei Non-SEPA).' },
            { name: 'UltmtCdtr', card: '0..1', desc: 'Abweichender Zahlungsempfänger (POBO).' },
            { name: 'ChrgBr', card: '0..1', desc: 'Gebührenregelung — bei SEPA fix SLEV.' },
            {
              name: 'CdtrSchmeId',
              card: '1',
              desc: 'Gläubiger-Identifikation (Creditor-ID) — SEPA-Scheme.',
              children: [
                { name: 'Id/PrvtId/Othr/Id', card: '1', desc: 'Creditor-ID (DE: 18-stellig, in SAP FBZP unter Hausbank-ID gepflegt).' },
                { name: 'SchmeNm/Prtry', card: '1', desc: 'Wert: SEPA.' },
              ],
            },
            {
              name: 'DrctDbtTxInf',
              card: '1..N',
              desc: 'Einzel-Lastschrift-Transaktion.',
              children: [
                {
                  name: 'PmtId',
                  card: '1',
                  desc: 'Payment-Identifier.',
                  children: [
                    { name: 'InstrId', card: '0..1', desc: 'Interne Instruction-ID (Bank-zu-Bank, nicht weitergegeben).' },
                    { name: 'EndToEndId', card: '1', desc: 'Ende-zu-Ende-Referenz — Kern-Anchor, in SAP = BSEG-XBLNR.' },
                    { name: 'UETR', card: '0..1', desc: 'Unique End-to-End Transaction Reference (ab v.09).' },
                  ],
                },
                { name: 'InstdAmt', card: '1', desc: 'Einzugsbetrag + Ccy=EUR (SEPA).' },
                { name: 'ChrgBr', card: '0..1', desc: 'Gebühren-Override auf TX-Ebene.' },
                {
                  name: 'DrctDbtTx/MndtRltdInf',
                  card: '1',
                  desc: 'Mandatsbezogene Informationen.',
                  children: [
                    { name: 'MndtId', card: '1', desc: 'Mandatsreferenz (UMR).' },
                    { name: 'DtOfSgntr', card: '1', desc: 'Unterschriftsdatum des Mandats.' },
                    { name: 'AmdmntInd', card: '0..1', desc: 'true wenn Mandat geändert — AmdmntInfDtls folgt.' },
                    { name: 'AmdmntInfDtls', card: '0..1', desc: 'Was hat sich geändert (alte CdtrSchmeId, alte DbtrAcct, …).' },
                    { name: 'ElctrncSgntr', card: '0..1', desc: 'Elektronische Signatur bei eMandate.' },
                  ],
                },
                { name: 'DbtrAgt/FinInstnId/BICFI', card: '0..1', desc: 'BIC der Debtor-Bank (bei Non-SEPA pflicht).' },
                { name: 'Dbtr', card: '1', desc: 'Schuldner — Nm + PstlAdr.' },
                { name: 'DbtrAcct/Id/IBAN', card: '1', desc: 'IBAN des belasteten Kontos.' },
                { name: 'UltmtDbtr', card: '0..1', desc: 'Abweichender Schuldner (bei Fremdmandat).' },
                { name: 'Purp/Cd', card: '0..1', desc: 'Zweck-Code (CBFF, SUPP, TAXS).' },
                { name: 'RmtInf', card: '0..1', desc: 'Verwendungszweck: Ustrd (140 Zeichen) oder Strd (strukturiert mit RfrdDocInf/CdtrRefInf).' },
              ],
            },
          ],
        },
      ],
    },
  ],
  migrations: [
    {
      label: 'pain.008.001.02 → .08',
      fromVersion: '001.001.02',
      toVersion: '001.001.08',
      changes: [
        { field: 'PstlAdr', oldValue: 'AdrLine (unstrukturiert, max 2×70)', newValue: 'PostalAddress24 strukturiert (StrtNm, BldgNb, PstCd, TwnNm, Ctry)', type: 'changed' },
        { field: 'UETR', oldValue: '—', newValue: 'neu in PmtId (ab v.08)', type: 'new' },
        { field: 'CdtrAgt/BICFI', oldValue: 'pflicht', newValue: 'optional für SEPA (IBAN-only genügt)', type: 'changed' },
        { field: 'BICOrBEI', oldValue: 'BICOrBEI', newValue: 'BICFI', type: 'changed' },
      ],
    },
  ],
  featureDefs: [
    { match: /CORE|B2B/i, name: 'SDD Core vs B2B', what: 'LclInstrm/Cd=CORE: Verbraucher-Lastschrift, 8 Wochen Rückrufrecht. B2B: Firmen-Lastschrift, kein Rückruf, Mandat muss bei Debtor-Bank vorab deponiert sein.', tokens: ['CORE', 'B2B'] },
    { match: /SeqTp|FRST|RCUR|OOFF|FNAL/i, name: 'Sequenz-Typ', what: 'FRST (Erstlastschrift), RCUR (Folge), OOFF (einmalig), FNAL (letzte). Pre-Notification mind. 14 Tage vor FRST/OOFF.', tokens: ['SeqTp', 'FRST', 'RCUR', 'OOFF', 'FNAL'] },
    { match: /MndtRltdInf|MndtId/i, name: 'Mandatsreferenz', what: 'MndtId (UMR) + DtOfSgntr pflicht pro Transaktion. In SAP aus Mandats-Stammdaten (FBZP) gezogen.', tokens: ['MndtId', 'DtOfSgntr', 'MndtRltdInf'] },
    { match: /AmdmntInd|AmdmntInfDtls/i, name: 'Mandats-Änderung', what: 'AmdmntInd=true bei IBAN-Wechsel, Mandats-Transfer, Creditor-ID-Wechsel. Details in AmdmntInfDtls pflicht.', tokens: ['AmdmntInd', 'AmdmntInfDtls'] },
    { match: /UETR/i, name: 'UETR', what: 'Ab pain.008.001.08 auch in Direct Debit — 36-stelliger UUID zur Verfolgung über gpi / Instant-SDD-Tracker.', tokens: ['UETR'] },
    { match: /Instant|SRTP|SDD Inst/i, name: 'SEPA Instant SDD', what: 'Neueres EPC-Scheme (SRTP — SEPA Request-to-Pay) mit 10-Sekunden-Abwicklung. Andere Rulebook-Version, pain.008 bleibt strukturell gleich.', tokens: ['SRTP', 'Instant'] },
  ],
});
