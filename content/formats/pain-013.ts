import { registerFormat } from '@/lib/formats/registry';

registerFormat({
  formatName: 'pain.013',
  region: 'Global / SEPA',
  characterSet: 'sepa-latin',
  rejectCodeGroup: 'iso20022',
  schemaUriPattern: 'urn:iso:std:iso:20022:tech:xsd:pain.013.001.<v>',
  structure: [
    {
      name: 'CdtrPmtActvtnReq',
      card: '1',
      desc: 'Root: Creditor Payment Activation Request (CPA) — Zahlungsaufforderung des Gläubigers an den Schuldner (z.B. Request-to-Pay, elektronische Rechnung).',
      children: [
        {
          name: 'GrpHdr',
          card: '1',
          desc: 'Nachrichtenkopf.',
          children: [
            { name: 'MsgId', card: '1', desc: 'Eindeutige Message-ID.' },
            { name: 'CreDtTm', card: '1', desc: 'Erstellungszeitpunkt.' },
            { name: 'NbOfTxs', card: '1', desc: 'Anzahl angeforderter Zahlungen.' },
            { name: 'CtrlSum', card: '0..1', desc: 'Summe aller angeforderten Beträge.' },
            { name: 'InitgPty', card: '1', desc: 'Auslöser der Anforderung (Creditor).' },
            { name: 'FwdgAgt', card: '0..1', desc: 'Weiterleitender Dienstleister (BICFI).' },
          ],
        },
        {
          name: 'PmtInf',
          card: '1..N',
          desc: 'Payment-Request-Block — Batch pro Debtor-Konto.',
          children: [
            { name: 'PmtInfId', card: '1', desc: 'Batch-ID des Creditors.' },
            { name: 'PmtMtd', card: '1', desc: 'TRF (Credit Transfer) — der Debtor soll eine Überweisung auslösen.' },
            { name: 'ReqdExctnDt', card: '1', desc: 'Gewünschtes Ausführungsdatum / Fälligkeit.' },
            { name: 'XpryDt', card: '0..1', desc: 'Ablauf der Anforderung — danach verfällt die Zahlungsaufforderung.' },
            {
              name: 'PmtTpInf',
              card: '0..1',
              desc: 'Zahlungsart.',
              children: [
                { name: 'InstrPrty', card: '0..1', desc: 'HIGH / NORM.' },
                { name: 'SvcLvl/Cd', card: '0..1', desc: 'SEPA, INST (Instant).' },
                { name: 'CtgyPurp/Cd', card: '0..1', desc: 'Kategorie-Zweck.' },
              ],
            },
            { name: 'Dbtr', card: '1', desc: 'Angefragter Schuldner — Nm + PstlAdr (PostalAddress24).' },
            { name: 'DbtrAcct/Id/IBAN', card: '0..1', desc: 'Bekannte IBAN des Schuldners (falls vom Creditor gepflegt).' },
            { name: 'DbtrAgt/FinInstnId/BICFI', card: '0..1', desc: 'Bekannte Debtor-Bank.' },
            { name: 'UltmtDbtr', card: '0..1', desc: 'Tatsächlicher Zahler (POBO).' },
            {
              name: 'CdtTrfTx',
              card: '1..N',
              desc: 'Einzelne Zahlungsanforderung.',
              children: [
                {
                  name: 'PmtId',
                  card: '1',
                  desc: 'Payment-Identifier der Anforderung.',
                  children: [
                    { name: 'InstrId', card: '0..1', desc: 'Interne ID.' },
                    { name: 'EndToEndId', card: '1', desc: 'Ende-zu-Ende-Referenz — wird bei ausgelöster Zahlung zurückgespiegelt.' },
                    { name: 'UETR', card: '0..1', desc: 'UETR (ab v.08).' },
                  ],
                },
                { name: 'PmtTpInf', card: '0..1', desc: 'TX-spezifische Zahlungsart.' },
                { name: 'Amt/InstdAmt', card: '1', desc: 'Angeforderter Betrag + Währung.' },
                { name: 'ChrgBr', card: '0..1', desc: 'Gebührenregelung (SLEV für SEPA).' },
                { name: 'CdtrAgt/FinInstnId/BICFI', card: '0..1', desc: 'Bank des Zahlungsempfängers.' },
                { name: 'Cdtr', card: '1', desc: 'Zahlungsempfänger — Nm + PstlAdr.' },
                { name: 'CdtrAcct/Id/IBAN', card: '1', desc: 'IBAN des Empfängerkontos.' },
                { name: 'UltmtCdtr', card: '0..1', desc: 'Eigentlicher Empfänger.' },
                { name: 'InstrForCdtrAgt', card: '0..N', desc: 'Anweisungen an die Creditor-Bank.' },
                { name: 'Purp/Cd', card: '0..1', desc: 'Zweck-Code.' },
                { name: 'RgltryRptg', card: '0..N', desc: 'Meldepflicht-Daten.' },
                {
                  name: 'RmtInf',
                  card: '0..1',
                  desc: 'Verwendungszweck (Ustrd oder Strd mit Rechnungs-Referenz).',
                  children: [
                    { name: 'Ustrd', card: '0..N', desc: 'Freitext (140 Zeichen SEPA).' },
                    { name: 'Strd/RfrdDocInf', card: '0..N', desc: 'Strukturiert: Rechnungs-Nummer, -Datum (CINV).' },
                    { name: 'Strd/CdtrRefInf', card: '0..1', desc: 'Creditor-Reference (RF nach ISO 11649).' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  migrations: [],
  featureDefs: [
    { match: /Request[- ]?to[- ]?Pay|RTP|SRTP/i, name: 'Request-to-Pay / SRTP', what: 'pain.013 ist technische Grundlage für EPC SRTP (SEPA Request-to-Pay). In DE marginal, stärker in IT/NL im E-Commerce.', tokens: ['SRTP', 'pain.013'] },
    { match: /XpryDt/i, name: 'Ablaufdatum', what: 'XpryDt begrenzt Gültigkeit der Anforderung. Nach Ablauf keine Annahme durch Debtor-Bank.', tokens: ['XpryDt'] },
    { match: /pain\.014/i, name: 'Antwort via pain.014', what: 'Debtor antwortet mit pain.014 (CreditorPaymentActivationRequestStatusReport) — Status ACCP/RJCT analog pain.002.', tokens: ['pain.014'] },
    { match: /INST|Instant/i, name: 'Instant-Variante', what: 'SvcLvl/Cd=INST kombiniert mit pain.013 → Request-to-Pay Instant. In DE: RT1/TIPS-Clearing erforderlich.', tokens: ['INST'] },
    { match: /Strd|RfrdDocInf|CdtrRefInf/i, name: 'Strukturierter Remittance', what: 'Für maschinelle Rechnungs-Reconciliation: RfrdDocInf mit CINV-Typ + Nummer, oder CdtrRefInf mit RF-Kennung (ISO 11649).', tokens: ['Strd', 'RfrdDocInf', 'CdtrRefInf'] },
  ],
});
