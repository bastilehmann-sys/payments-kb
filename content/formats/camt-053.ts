import { registerFormat } from '@/lib/formats/registry';

registerFormat({
  formatName: 'camt.053',
  region: 'Global / SEPA',
  characterSet: 'sepa-latin',
  rejectCodeGroup: null,
  schemaUriPattern: 'urn:iso:std:iso:20022:tech:xsd:camt.053.001.<v>',
  structure: [
    {
      name: 'BkToCstmrStmt',
      card: '1',
      desc: 'Bank-to-Customer Statement. End-of-Day Tagesauszug, rechtsverbindlicher Ersatz für MT940. Eine MsgId pro File, ein oder mehrere Statements pro Konto/Buchungstag.',
      children: [
        {
          name: 'GrpHdr',
          card: '1',
          desc: 'MsgId, CreDtTm, MsgRcpt, MsgPgntn. MsgPgntn wird bei Continuation-Files für große Statements mit vielen Buchungen zwingend (PgNb, LastPgInd).',
        },
        {
          name: 'Stmt',
          card: '1..N',
          desc: 'Statement-Block. Ein Konto kann pro Tag mehrere Statements haben (z.B. ein Stmt je Währung bei Multi-Currency-Konto oder bei Continuation).',
          children: [
            { name: 'Id', card: '1', desc: 'Statement-Id, bankseitig. In SAP FEBA als externer Auszugs-Key.' },
            { name: 'ElctrncSeqNb', card: '0..1', desc: 'Fortlaufende elektronische Auszugsnummer je Konto. FF.5 prüft Lücken und bricht bei fehlenden Nummern ab.' },
            { name: 'LglSeqNb', card: '0..1', desc: 'Rechtliche Auszugsnummer (Print-Auszug). Sequenz i.d.R. pro Kalenderjahr.' },
            { name: 'CreDtTm', card: '1', desc: 'Erstellungs-Zeitstempel.' },
            { name: 'FrToDt', card: '0..1', desc: 'Berichtszeitraum FrDtTm/ToDtTm. Bei Tages-EoD = Buchungstag 00:00 bis 24:00.' },
            {
              name: 'Acct',
              card: '1',
              desc: 'Konto.',
              children: [
                { name: 'Id', card: '1', desc: 'IBAN (Standard) oder Othr/Id mit SchmeNm (BBAN, Domestic). SAP-Match via T012K (Hausbank-Konto) oder FEBKO.' },
                { name: 'Ccy', card: '0..1', desc: 'Kontowährung. Bei Multi-Ccy-Konten: separates Stmt je Ccy.' },
                { name: 'Ownr', card: '0..1', desc: 'Nm + PstlAdr + optional Id (OrgId mit LEI/BIC).' },
                { name: 'Svcr', card: '0..1', desc: 'Kontoführende Bank (FinInstnId/BICFI).' },
              ],
            },
            { name: 'RltdAcct', card: '0..1', desc: 'Verbundenes Konto (z.B. Cash-Pool-Partner, Kreditlinie).' },
            {
              name: 'Bal',
              card: '1..N',
              desc: 'Salden — mindestens OPBD (Opening Booked) und CLBD (Closing Booked) Pflicht. CGI-MP empfiehlt zusätzlich CLAV. Summe der Ntry-Beträge muss OPBD → CLBD überleiten (Plausi-Check).',
              children: [
                { name: 'Tp/CdOrPrtry/Cd', card: '1', desc: 'OPBD, CLBD, CLAV, FWAV, ITBD, PRCD (Previously Closed Booked = OPBD des Folgetages).' },
                { name: 'Amt', card: '1', desc: 'Saldobetrag mit Ccy-Attribut.' },
                { name: 'CdtDbtInd', card: '1', desc: 'CRDT/DBIT. Kontokorrent-Negativsaldo = DBIT.' },
                { name: 'Dt', card: '1', desc: 'Valutadatum des Saldos.' },
              ],
            },
            { name: 'TxsSummry', card: '0..1', desc: 'Summen-Block (TtlNtries, TtlCdtNtries, TtlDbtNtries, TtlNtriesPerBkTxCd). Wichtig für schnelle Batch-Validierung vor Einzel-Verarbeitung.' },
            {
              name: 'Ntry',
              card: '0..N',
              desc: 'Buchungen. Bei EoD alle mit Sts=BOOK. Reihenfolge: chronologisch nach BookgDt, dann AcctSvcrRef. Reconciliation-Anker für CSV-Export / SAP FEBA.',
              children: [
                { name: 'Amt', card: '1', desc: 'Buchungsbetrag (brutto, immer positiv).' },
                { name: 'CdtDbtInd', card: '1', desc: 'CRDT=Eingang, DBIT=Ausgang. Mapping OT83 → Soll/Haben-Kennzeichen.' },
                { name: 'RvslInd', card: '0..1', desc: 'Reversal-Indikator (true = Rücklastschrift/Storno).' },
                { name: 'Sts', card: '1', desc: 'BOOK=gebucht (Pflicht im camt.053 EoD).' },
                { name: 'BookgDt', card: '1', desc: 'Buchungsdatum (Dt oder DtTm).' },
                { name: 'ValDt', card: '1', desc: 'Valutadatum.' },
                { name: 'AcctSvcrRef', card: '0..1', desc: 'Bankreferenz. Eindeutig pro Konto — Duplikats-Check in FF.5.' },
                { name: 'BkTxCd', card: '1', desc: 'Domn/Fmly/SubFmlyCd (z.B. PMNT/RCDT/ESCT = SEPA Credit eingegangen). Proprietary: bank-spezifisch (Deutsche Bank NTRF, Commerzbank 051). SAP-Mapping in T028G.' },
                {
                  name: 'NtryDtls',
                  card: '0..N',
                  desc: 'Details. Bei Batch (z.B. Sammel-SDD) ein NtryDtls mit vielen TxDtls.',
                  children: [
                    { name: 'Btch', card: '0..1', desc: 'Batch-Info (PmtInfId, NbOfTxs, TtlAmt) bei BatchBookg-Summenbuchung.' },
                    {
                      name: 'TxDtls',
                      card: '0..N',
                      desc: 'Einzel-Tx.',
                      children: [
                        { name: 'Refs', card: '0..1', desc: 'MsgId, AcctSvcrRef, InstrId, EndToEndId, UETR, MndtId, ChqNb, ClrSysRef.' },
                        { name: 'AmtDtls', card: '0..1', desc: 'InstdAmt, TxAmt, CntrValAmt mit FX-Rate.' },
                        { name: 'Chrgs', card: '0..1', desc: 'Bank-Gebühren (wichtig für DTAZV-Ablöse / Cross-Border Reporting).' },
                        { name: 'RltdPties', card: '0..1', desc: 'Dbtr/DbtrAcct/Cdtr/CdtrAcct/UltmtDbtr/UltmtCdtr.' },
                        { name: 'RmtInf', card: '0..1', desc: 'Ustrd (bis 4× 140 Zeichen) oder Strd (CdtrRefInf mit RF-Referenz ISO 11649). Auto-Clearing in SAP via F.13.' },
                      ],
                    },
                  ],
                },
                { name: 'AddtlNtryInf', card: '0..1', desc: 'Free-Text bank-spezifisch (z.B. MT940 :86:-Äquivalent).' },
              ],
            },
            { name: 'AddtlStmtInf', card: '0..1', desc: 'Zusätzliche Statement-Informationen.' },
          ],
        },
      ],
    },
  ],
  migrations: [
    {
      label: 'camt.053.001.02 → camt.053.001.08',
      fromVersion: '053.001.02',
      toVersion: '053.001.08',
      changes: [
        { field: 'Refs/UETR', oldValue: 'nicht vorhanden', newValue: 'UETR (UUIDv4) für SWIFT gpi End-to-End Tracking', type: 'new' },
        { field: 'Refs/ClrSysRef', oldValue: 'nicht vorhanden', newValue: 'Clearing System Reference', type: 'new' },
        { field: 'BkTxCd External Code Set', oldValue: 'v1 (PMNT/CAMT/ACMT)', newValue: 'aktuelle ISO External Code Sets mit neuen SubFamilies (INST für SCT Inst, FICT)', type: 'changed' },
        { field: 'Ownr/Id/OrgId', oldValue: 'BICOrBEI', newValue: 'AnyBIC + LEI (ISO 17442)', type: 'changed' },
        { field: 'RmtInf/Strd', oldValue: 'CdtrRefInf single', newValue: 'CdtrRefInf erweitert (RF ISO 11649, multiple Strd blocks)', type: 'changed' },
        { field: 'PstlAdr', oldValue: 'unstrukturiert AdrLine', newValue: 'strukturiert (StrtNm, BldgNb, PstCd, TwnNm, Ctry) — CBPR+ Pflicht ab Nov 2025', type: 'changed' },
        { field: 'CharSet', oldValue: 'UTF-8 frei', newValue: 'SEPA Latin Character Set (FinTS-DK Whitelist)', type: 'changed' },
      ],
    },
  ],
  featureDefs: [
    {
      match: /MT940|MT ?940|Migration/i,
      name: 'MT940-Migration',
      what: 'camt.053 ersetzt MT940 als EoD-Auszug. Feld-Mapping: :20: → Stmt/Id, :25: → Acct/Id, :28C: → ElctrncSeqNb, :60F/:62F: → Bal OPBD/CLBD, :61: → Ntry, :86: → AddtlNtryInf + strukturierte RmtInf. SWIFT MT-Retirement ursprünglich 2025, verlängert auf Co-Existence.',
      tokens: ['MT940', ':20:', ':25:', ':28C:', ':60F:', ':62F:', ':61:', ':86:'],
    },
    {
      match: /BkTxCd|T028G|External Code/i,
      name: 'BkTxCd-Mapping T028G',
      what: 'ISO Domain/Family/SubFamily → interner SAP-Vorgangscode. Beispiel: PMNT/RCDT/ESCT (SEPA CT credit) → 051 Überweisungseingang. Proprietary-Codes bank-spezifisch konfigurieren. Customizing: OT83 (Buchungsregel) + T028G (Externe Transaktionsart).',
      tokens: ['T028G', 'OT83', 'Domn', 'Fmly', 'SubFmlyCd', 'PMNT', 'RCDT', 'ESCT'],
    },
    {
      match: /Multi-Currency|Multi-Ccy/i,
      name: 'Multi-Currency-Statements',
      what: 'Bei Fremdwährungs-Konten liefert die Bank pro Währung ein eigenes Stmt innerhalb desselben Files. FF.5 verarbeitet je Acct/Ccy-Kombi einen Auszug. Hausbank-Konto in T012K pro Ccy anlegen.',
      tokens: ['Multi-Ccy', 'T012K', 'CntrValAmt'],
    },
    {
      match: /Continuation|MsgPgntn|Pagination/i,
      name: 'Continuation-Files',
      what: 'Bei sehr großen Statements (>10.000 Ntry) wird ein Statement über mehrere Files paginiert (MsgPgntn/PgNb + LastPgInd). Alle Seiten haben dieselbe Stmt/Id. SAP FF.5 muss alle Files der Pagination vor Verarbeitung empfangen haben.',
      tokens: ['MsgPgntn', 'PgNb', 'LastPgInd', 'Continuation'],
    },
    {
      match: /FF\.5|FEBA|FEBP|OT83|F\.13/i,
      name: 'SAP-Processing',
      what: 'FF.5 (Import + Verarbeitung), FEBA (Auszugs-Anzeige/Postprocessing), FEBP (Buchung im Batch), F.13 (Automatisches Clearing offener Posten via EndToEndId/RF-Referenz). Customizing: OT83 (Buchungsregeln), T028G (externe TA), OT51 (Auszugs-Varianten).',
      tokens: ['FF.5', 'FEBA', 'FEBP', 'F.13', 'OT83', 'T028G', 'OT51'],
    },
    {
      match: /Reconcile|Reconciliation|CSV/i,
      name: 'CSV-Reconcile-Relevanz',
      what: 'Ntry/AcctSvcrRef + EndToEndId + RmtInf/Strd/CdtrRefInf sind Haupt-Reconcile-Anker. Für CSV-Export: BookgDt, ValDt, Amt, CdtDbtInd, BkTxCd/Prtry, AcctSvcrRef, EndToEndId, UETR, Dbtr/Cdtr-Name, RmtInf konkatenieren.',
      tokens: ['AcctSvcrRef', 'EndToEndId', 'UETR', 'CdtrRefInf', 'RF'],
    },
  ],
});
