import { registerFormat } from '@/lib/formats/registry';

registerFormat({
  formatName: 'camt.052',
  region: 'Global / SEPA',
  characterSet: 'sepa-latin',
  rejectCodeGroup: null,
  schemaUriPattern: 'urn:iso:std:iso:20022:tech:xsd:camt.052.001.<v>',
  structure: [
    {
      name: 'BkToCstmrAcctRpt',
      card: '1',
      desc: 'Bank-to-Customer Account Report. Intraday-Report mit Zwischensalden, oft mehrmals täglich geliefert (typisch 07:00/12:00/17:00 Uhr, je nach Bank-Profil).',
      children: [
        {
          name: 'GrpHdr',
          card: '1',
          desc: 'Group Header mit MsgId, CreDtTm, MsgRcpt, MsgPgntn. MsgId muss innerhalb 90 Tagen eindeutig sein (CGI-MP).',
        },
        {
          name: 'Rpt',
          card: '1..N',
          desc: 'Ein Report-Block pro Konto/Zeitscheibe. Mehrere Rpt in einem File möglich (ein File = alle Intraday-Reports einer Bank).',
          children: [
            { name: 'Id', card: '1', desc: 'Report-Id, bankseitig vergeben. In SAP via FEBA als Auszugs-Nr. sichtbar.' },
            { name: 'ElctrncSeqNb', card: '0..1', desc: 'Elektronische Auszugs-Sequenznummer je Konto. Relevant für FF.5 Lückenerkennung.' },
            { name: 'LglSeqNb', card: '0..1', desc: 'Rechtliche Auszugsnummer (fortlaufend je Kalenderjahr).' },
            { name: 'CreDtTm', card: '1', desc: 'Erstellungs-Zeitstempel des Reports.' },
            { name: 'FrToDt', card: '0..1', desc: 'Berichtszeitraum FrDtTm / ToDtTm. Bei Intraday oft Tagesbeginn bis Snapshot-Zeit.' },
            { name: 'RptgSrc', card: '0..1', desc: 'Reporting Source, typisch "AMLT" (Account Management).' },
            {
              name: 'Acct',
              card: '1',
              desc: 'Konto, für das berichtet wird.',
              children: [
                { name: 'Id', card: '1', desc: 'IBAN oder Othr/Id (z.B. BBAN, DomesticAccount). SAP-Matching via T012K.' },
                { name: 'Ccy', card: '0..1', desc: 'Kontowährung (ISO 4217).' },
                { name: 'Ownr', card: '0..1', desc: 'Kontoinhaber (Nm, PstlAdr).' },
                { name: 'Svcr', card: '0..1', desc: 'Kontoführende Bank (FinInstnId/BIC).' },
              ],
            },
            { name: 'RltdAcct', card: '0..1', desc: 'Verwandtes Konto (z.B. Pooling-Master bei Cash-Pool Reports).' },
            { name: 'Intrst', card: '0..N', desc: 'Zinsinformationen (Rate, Tp).' },
            {
              name: 'Bal',
              card: '0..N',
              desc: 'Salden-Block. Bei Intraday mindestens OPBD (Opening Booked) + ITBD (Interim Booked). CLBD erst im EoD (camt.053).',
              children: [
                { name: 'Tp', card: '1', desc: 'Balance-Type: OPBD=Opening Booked, ITBD=Interim Booked, CLBD=Closing Booked, ITAV=Interim Available, CLAV=Closing Available, PRCD=Previously Closed Booked, FWAV=Forward Available.' },
                { name: 'Amt', card: '1', desc: 'Betrag mit Ccy-Attribut.' },
                { name: 'CdtDbtInd', card: '1', desc: 'CRDT=Guthaben, DBIT=Soll. Kombiniert mit Amt und Tp ergibt Vorzeichen-Logik.' },
                { name: 'Dt', card: '1', desc: 'Valutadatum des Saldos (Dt oder DtTm).' },
              ],
            },
            { name: 'TxsSummry', card: '0..1', desc: 'Transaction Summary (TtlNtries, TtlCdtNtries, TtlDbtNtries). Für Plausi-Check gegen Ntry-Summe.' },
            {
              name: 'Ntry',
              card: '0..N',
              desc: 'Einzelbuchung (Entry). Bei camt.052 oft vorläufig (Sts=PDNG für noch nicht gebuchte, BOOK für gebucht).',
              children: [
                { name: 'Amt', card: '1', desc: 'Buchungsbetrag mit Currency.' },
                { name: 'CdtDbtInd', card: '1', desc: 'CRDT/DBIT. SAP-Vorzeichen-Logik in OT83.' },
                { name: 'Sts', card: '1', desc: 'BOOK=gebucht, PDNG=pending, INFO=nur Info. FF.5 verarbeitet nur BOOK standardmäßig.' },
                { name: 'BookgDt', card: '0..1', desc: 'Buchungsdatum.' },
                { name: 'ValDt', card: '0..1', desc: 'Valutadatum (für Zins-Berechnung relevant).' },
                { name: 'BkTxCd', card: '1', desc: 'Bank Transaction Code. Domn/Fmly/SubFmlyCd (ISO 20022 External Codes) oder Prtry. Mapping auf SAP-Vorgangscode via T028G.' },
                { name: 'AcctSvcrRef', card: '0..1', desc: 'Bankseitige Referenz der Buchung. Eindeutig pro Konto.' },
                {
                  name: 'NtryDtls',
                  card: '0..N',
                  desc: 'Details-Container (bei BatchBookg=true nur 1, sonst pro Einzel-Tx).',
                  children: [
                    {
                      name: 'TxDtls',
                      card: '0..N',
                      desc: 'Transaction Details je Original-Zahlung.',
                      children: [
                        { name: 'Refs', card: '0..1', desc: 'MsgId, AcctSvcrRef, InstrId, EndToEndId, UETR, MndtId (für SDD).' },
                        { name: 'AmtDtls', card: '0..1', desc: 'InstdAmt / TxAmt mit FX-Rate bei Fremdwährung.' },
                        { name: 'RmtInf', card: '0..1', desc: 'Ustrd (max 140 Zeichen) oder Strd (CdtrRefInf für strukturierten Verwendungszweck/RF-Referenz).' },
                        { name: 'RltdPties', card: '0..1', desc: 'Dbtr, DbtrAcct, Cdtr, CdtrAcct, UltmtDbtr/UltmtCdtr.' },
                      ],
                    },
                  ],
                },
                { name: 'AddtlNtryInf', card: '0..1', desc: 'Free-Text, bank-spezifisch. In SAP BKPF-BKTXT oder BSEG-SGTXT nutzbar.' },
              ],
            },
          ],
        },
      ],
    },
  ],
  migrations: [
    {
      label: 'camt.052.001.02 → camt.052.001.08',
      fromVersion: '052.001.02',
      toVersion: '052.001.08',
      changes: [
        { field: 'UETR', oldValue: 'nicht vorhanden', newValue: 'Refs/UETR (UUIDv4, SWIFT gpi Tracking)', type: 'new' },
        { field: 'BkTxCd/Domn/Cd', oldValue: 'External Code Set v1', newValue: 'External Code Set aktuell (PMNT/CAMT/FEES/LDAS)', type: 'changed' },
        { field: 'Ownr/Id', oldValue: 'OrgId/BICOrBEI', newValue: 'OrgId/AnyBIC + LEI (ISO 17442)', type: 'changed' },
        { field: 'CharSet', oldValue: 'UTF-8 frei', newValue: 'SEPA Latin Character Set (FinTS-DK)', type: 'changed' },
        { field: 'RmtInf/Strd/CdtrRefInf/Tp/CdOrPrtry', oldValue: 'nicht vorhanden', newValue: 'erweitert für RF-Creditor-Reference ISO 11649', type: 'new' },
        { field: 'TxDtls/Refs/ClrSysRef', oldValue: 'optional lokal', newValue: 'Global Clearing System Reference', type: 'new' },
      ],
    },
  ],
  featureDefs: [
    {
      match: /intraday|IntraDay|Zwischensaldo/i,
      name: 'Intraday-Reporting',
      what: 'Mehrfach-tägliche Salden-Reports. OPBD + ITBD Pflicht, CLBD nicht vorhanden (erst in camt.053 EoD).',
      tokens: ['ITBD', 'ITAV', 'OPBD', 'Intraday'],
    },
    {
      match: /BkTxCd|Bank Transaction Code/i,
      name: 'Bank Transaction Code Mapping',
      what: 'ISO-Domain/Family/SubFamily oder Proprietary. In SAP via T028G auf internen Vorgangscode (z.B. "051" Überweisungseingang) gemappt.',
      tokens: ['BkTxCd', 'Domn', 'Fmly', 'SubFmlyCd', 'Prtry', 'T028G'],
    },
    {
      match: /Balance Type|OPBD|CLBD|ITBD/i,
      name: 'Balance-Type-Logik',
      what: 'OPBD=Tagesstart gebucht, ITBD=Zwischensaldo gebucht, CLBD=Tagesende gebucht (nur EoD), ITAV/CLAV=verfügbar inkl. Limits.',
      tokens: ['OPBD', 'ITBD', 'CLBD', 'ITAV', 'CLAV', 'PRCD', 'FWAV'],
    },
    {
      match: /CdtDbtInd/,
      name: 'CdtDbtInd-Vorzeichen',
      what: 'CRDT/DBIT bestimmt Vorzeichen — kein Minus im Amt-Feld. SAP-Customizing OT83 rechnet Vorzeichen in Soll/Haben um.',
      tokens: ['CRDT', 'DBIT', 'OT83'],
    },
    {
      match: /FEBA|FEBP|FF\.5/,
      name: 'SAP-Verarbeitung',
      what: 'FF.5 (elektronischer Kontoauszug Import), FEBA (Auszugs-Detail), FEBP (Postprocessing). camt.052 wird meist als Memo-Record für Cash Management (FF7A/FF7B) genutzt, nicht für Hauptbuchbuchung.',
      tokens: ['FF.5', 'FEBA', 'FEBP', 'FF7A', 'T028G', 'OT83'],
    },
  ],
});
