import { registerFormat } from '@/lib/formats/registry';

registerFormat({
  formatName: 'pain.003',
  region: 'Global / SEPA',
  characterSet: 'sepa-latin',
  rejectCodeGroup: 'iso20022',
  schemaUriPattern: 'urn:iso:std:iso:20022:tech:xsd:pain.003.001.<v>',
  structure: [
    {
      name: 'MndtInitnReq',
      card: '1',
      desc: 'Root: Mandate Initiation Request — Einreichung eines SEPA-SDD-Mandats vom Creditor an seine Bank.',
      children: [
        {
          name: 'GrpHdr',
          card: '1',
          desc: 'Nachrichtenkopf.',
          children: [
            { name: 'MsgId', card: '1', desc: 'Eindeutige Message-ID (max 35 Zeichen).' },
            { name: 'CreDtTm', card: '1', desc: 'Erstellungszeitpunkt.' },
            { name: 'InitgPty', card: '1', desc: 'Auslöser der Nachricht — i.d.R. Creditor oder dessen Dienstleister.' },
            { name: 'InstgAgt', card: '0..1', desc: 'Sendende Bank (BICFI).' },
            { name: 'InstdAgt', card: '0..1', desc: 'Empfangende Bank / Debtor-Bank (BICFI).' },
          ],
        },
        {
          name: 'Mndt',
          card: '1..N',
          desc: 'Ein oder mehrere einzureichende Mandate.',
          children: [
            { name: 'MndtId', card: '1', desc: 'Mandatsreferenz (UMR — Unique Mandate Reference, max 35 Zeichen).' },
            { name: 'MndtReqId', card: '0..1', desc: 'Technische Request-ID des Creditors.' },
            {
              name: 'Tp',
              card: '0..1',
              desc: 'Mandats-Typ.',
              children: [
                { name: 'SvcLvl/Cd', card: '0..1', desc: 'SEPA-Service-Level (z.B. SEPA).' },
                { name: 'LclInstrm/Cd', card: '0..1', desc: 'CORE oder B2B (SEPA Core vs SEPA Business-to-Business).' },
              ],
            },
            {
              name: 'Ocrncs',
              card: '1',
              desc: 'Wiederholungs-Muster des Mandats.',
              children: [
                { name: 'SeqTp', card: '1', desc: 'OOFF (einmalig), RCUR (wiederkehrend), FRST, FNAL.' },
                { name: 'Frqcy', card: '0..1', desc: 'Frequenz bei wiederkehrend (MNTH, YEAR, …).' },
                { name: 'Drtn/FrDt', card: '0..1', desc: 'Gültigkeitsbeginn.' },
                { name: 'Drtn/ToDt', card: '0..1', desc: 'Gültigkeitsende.' },
                { name: 'FrstColltnDt', card: '0..1', desc: 'Erstes Einzugsdatum.' },
                { name: 'FnlColltnDt', card: '0..1', desc: 'Letztes Einzugsdatum.' },
              ],
            },
            { name: 'MaxAmt', card: '0..1', desc: 'Maximaler Einzugsbetrag pro Einzug.' },
            { name: 'Rsn/Cd', card: '0..1', desc: 'Mandats-Zweck (z.B. SDVA, INTC).' },
            {
              name: 'CdtrSchmeId',
              card: '1',
              desc: 'Gläubiger-Identifikation (Creditor-ID, in DE DE-Creditor-ID 18-stellig, gepflegt in FBZP).',
              children: [
                { name: 'Id/PrvtId/Othr/Id', card: '1', desc: 'Creditor-ID.' },
                { name: 'SchmeNm/Prtry', card: '0..1', desc: 'Schema (SEPA).' },
              ],
            },
            { name: 'Cdtr', card: '1', desc: 'Gläubiger — Nm + PstlAdr (PostalAddress24 strukturiert).' },
            { name: 'CdtrAcct/Id/IBAN', card: '0..1', desc: 'IBAN des Gläubigerkontos.' },
            { name: 'CdtrAgt/FinInstnId/BICFI', card: '1', desc: 'BIC der Gläubigerbank.' },
            { name: 'UltmtCdtr', card: '0..1', desc: 'Eigentlicher Zahlungsempfänger (POBO-Konstruktion).' },
            { name: 'Dbtr', card: '1', desc: 'Zahlungspflichtiger — Nm + PstlAdr.' },
            { name: 'DbtrAcct/Id/IBAN', card: '1', desc: 'IBAN des belasteten Kontos.' },
            { name: 'DbtrAgt/FinInstnId/BICFI', card: '1', desc: 'BIC der Debtor-Bank.' },
            { name: 'UltmtDbtr', card: '0..1', desc: 'Tatsächlicher Schuldner (bei abweichendem Kontoinhaber).' },
            { name: 'RfrdDoc', card: '0..N', desc: 'Verweis auf Dokumente (Vertrag, Rechnung).' },
          ],
        },
        {
          name: 'Authstn',
          card: '0..N',
          desc: 'Signatur-/Autorisierungs-Nachweis. Bei eMandate (SDD eMandate Scheme) elektronisch, sonst Papier-Referenz.',
          children: [
            { name: 'Cd', card: '0..1', desc: 'Autorisierungs-Code (z.B. AUT1, AUT2).' },
            { name: 'Prtry', card: '0..1', desc: 'Proprietärer Autorisierungs-Text.' },
          ],
        },
      ],
    },
  ],
  migrations: [],
  featureDefs: [
    { match: /CORE|B2B/i, name: 'SDD Core vs B2B', what: 'LclInstrm/Cd=CORE: Verbraucher-Lastschrift mit 8-Wochen-Rückruf. B2B: Firmen-Lastschrift ohne Rückruf, Mandat muss bei Debtor-Bank hinterlegt sein.', tokens: ['CORE', 'B2B', 'LclInstrm'] },
    { match: /CdtrSchmeId|Creditor[- ]?ID/i, name: 'Creditor-Scheme-Identifier', what: 'SEPA Creditor-ID (in DE 18-stellig, von der Bundesbank vergeben). In SAP in FBZP unter Hausbank-Identifikationen gepflegt.', tokens: ['CdtrSchmeId', 'Creditor-ID'] },
    { match: /eMandate|eMandat/i, name: 'eMandate Scheme', what: 'Elektronisches SEPA-Mandat via Debtor-Online-Banking — keine Unterschrift nötig, Authstn-Block mit digitalem Nachweis.', tokens: ['eMandate', 'Authstn'] },
    { match: /Ocrncs|SeqTp/i, name: 'Occurrence-Muster', what: 'OOFF/FRST/RCUR/FNAL steuern Lebenszyklus. Erster Einzug FRST, Folge RCUR, letzter FNAL — wichtig für Pre-Notification-Pflicht.', tokens: ['Ocrncs', 'SeqTp', 'FRST', 'RCUR', 'FNAL'] },
    { match: /UltmtDbtr|UltmtCdtr/i, name: 'Ultimate-Parties', what: 'Abweichender Zahler/Empfänger — relevant bei Konzernkonten und Treuhand-Konstruktionen.', tokens: ['UltmtDbtr', 'UltmtCdtr'] },
  ],
});
