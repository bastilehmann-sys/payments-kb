import type { RejectCode } from './types';

export const ISO20022_REJECT_CODES: RejectCode[] = [
  { code: 'AC01', name: 'IncorrectAccountNumber', meaning: 'IBAN syntaktisch oder per Prüfziffer falsch.', remediation: 'IBAN-Validierung mit ISO 7064 vor Versand. SAP: BAdI BANK_VALIDATION.', group: 'Account' },
  { code: 'AC04', name: 'ClosedAccountNumber', meaning: 'Konto existiert nicht (mehr) bei Empfänger-Bank.', remediation: 'Lieferantenstamm aktualisieren, Kontaktaufnahme mit Empfänger.', group: 'Account' },
  { code: 'AC06', name: 'BlockedAccount', meaning: 'Konto gesperrt (Insolvenz, Pfändung, Verdacht).', remediation: 'Mit Empfänger / Bank klären.', group: 'Account' },
  { code: 'AG01', name: 'TransactionForbidden', meaning: 'Service-Level vom Empfänger-PSP nicht unterstützt.', remediation: 'Auf SCT (Standard) ausweichen oder SvcLvl prüfen.', group: 'Agent' },
  { code: 'AG02', name: 'InvalidBankOperationCode', meaning: 'Local Instrument ungültig.', remediation: 'PmtTpInf/LclInstrm prüfen.', group: 'Agent' },
  { code: 'AM05', name: 'Duplication', meaning: 'Identische Zahlung schon mal gesendet.', remediation: 'EndToEndId muss eindeutig sein.', group: 'Amount' },
  { code: 'BE05', name: 'UnrecognisedInitiatingParty', meaning: 'InitgPty bei der Bank nicht freigeschaltet.', remediation: 'EBICS-User mit Hausbank klären.', group: 'Beneficiary' },
  { code: 'CUST', name: 'CancelledByCustomer', meaning: 'Auftraggeber hat zurückgezogen.', remediation: 'Kein Fehler — bewusst storniert.', group: 'Customer' },
  { code: 'DT01', name: 'InvalidDate', meaning: 'ReqdExctnDt liegt in der Vergangenheit oder am Bank-Feiertag.', remediation: 'Fabrikkalender SCAL synchron mit TARGET2.', group: 'Date' },
  { code: 'FF01', name: 'InvalidFileFormat', meaning: 'XML-Schema-Verletzung.', remediation: 'Schema-Validierung in DMEEX vor Ausgang.', group: 'FileFormat' },
  { code: 'MS03', name: 'NotSpecifiedReason', meaning: 'Generisch — Bank gibt Detail nur auf Nachfrage.', remediation: 'Hausbank kontaktieren.', group: 'Misc' },
  { code: 'NARR', name: 'Narrative', meaning: 'Kein Standard-Code — Erläuterung im Freitext.', remediation: 'pain.002 manuell auswerten.', group: 'Narrative' },
  { code: 'RC01', name: 'BankIdentifierIncorrect', meaning: 'BICFI ungültig oder nicht im SWIFT-Verzeichnis.', remediation: 'BIC-Stamm-Update.', group: 'Routing' },
  { code: 'RR04', name: 'RegulatoryReason', meaning: 'Sanktions-/Embargo-Treffer.', remediation: 'GTS-Screening prüfen.', group: 'Regulatory' },
];

export const SWIFT_MT_NAK_CODES: RejectCode[] = [
  { code: 'F00', name: 'FormatError-Generic', meaning: 'Nachricht entspricht nicht dem MT-Format.', remediation: 'Tag-Reihenfolge / Pflichttag prüfen.', group: 'Format' },
  { code: 'T13', name: 'InvalidValueDate', meaning: 'Valutadatum am Bank-Feiertag.', remediation: 'TARGET-Kalender beachten.', group: 'Date' },
  { code: 'T26', name: 'InvalidBIC', meaning: 'BIC ungültig.', remediation: 'BIC-Update aus SWIFT BIC Directory.', group: 'Routing' },
  { code: 'T50', name: 'InvalidAccount', meaning: 'IBAN/Konto ungültig.', remediation: 'IBAN-Validation.', group: 'Account' },
  { code: 'T62', name: 'InvalidCurrency', meaning: 'Währung nicht handelbar / falsch.', remediation: 'ISO-4217-Code prüfen.', group: 'Amount' },
  { code: 'D49', name: 'DuplicateMessage', meaning: 'Identische MT bereits gesendet.', remediation: 'Reference (Tag 20) eindeutig vergeben.', group: 'Misc' },
];

export const SEPA_LATIN_CHARSET = {
  allowed: 'a-z A-Z 0-9 / - ? : ( ) . , \' + Leerzeichen',
  examples: [
    { wrong: 'Müller GmbH',     right: 'Mueller GmbH' },
    { wrong: 'Übersee Logistik', right: 'Uebersee Logistik' },
    { wrong: 'Café & Bar',       right: 'Cafe und Bar' },
  ],
  source: { label: 'EPC EBS204', url: 'https://www.europeanpaymentscouncil.eu/document-library' },
};
