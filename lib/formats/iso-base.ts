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

export const NACHA_RETURN_CODES: RejectCode[] = [
  { code: 'R01', name: 'InsufficientFunds', meaning: 'Verfügbares Guthaben des Receivers reicht nicht.', remediation: 'Re-Present max. 2× innerhalb 180 Tagen (NACHA Rule).', group: 'NACHA' },
  { code: 'R02', name: 'AccountClosed', meaning: 'Empfängerkonto wurde geschlossen.', remediation: 'Lieferanten-/Payroll-Stamm aktualisieren, keine Re-Presentation.', group: 'NACHA' },
  { code: 'R03', name: 'NoAccountUnableToLocate', meaning: 'Kontonummer existiert nicht am angegebenen RDFI.', remediation: 'Kontonummer & Routing Number prüfen (ABA MOD-10).', group: 'NACHA' },
  { code: 'R04', name: 'InvalidAccountNumber', meaning: 'Kontonummer-Struktur ungültig beim RDFI.', remediation: 'Account Number Feld (17 char) korrigieren.', group: 'NACHA' },
  { code: 'R05', name: 'UnauthorizedDebitConsumer', meaning: 'Consumer-Lastschrift auf Consumer-Konto ohne gültige Autorisierung (CCD/CTX statt PPD).', remediation: 'SEC Code korrigieren oder PPD-Authorization einholen.', group: 'NACHA' },
  { code: 'R06', name: 'ReturnedPerODFIRequest', meaning: 'ODFI hat Rückruf angefordert (ODFI Request for Return).', remediation: 'Bilateral mit ODFI klären.', group: 'NACHA' },
  { code: 'R07', name: 'AuthorizationRevokedByCustomer', meaning: 'Consumer hat Autorisierung schriftlich widerrufen.', remediation: 'Mandate im Debitor-Stamm deaktivieren.', group: 'NACHA' },
  { code: 'R08', name: 'PaymentStopped', meaning: 'Stop Payment Order vom Receiver erteilt.', remediation: 'Mit Receiver klären, ggf. alternative Zahlungsart.', group: 'NACHA' },
  { code: 'R09', name: 'UncollectedFunds', meaning: 'Guthaben vorhanden, aber noch nicht verfügbar (Uncollected).', remediation: 'Re-Present nach 1-2 Banking Days.', group: 'NACHA' },
  { code: 'R10', name: 'CustomerAdvisesNotAuthorized', meaning: 'Receiver bestreitet Autorisierung (Unauthorized).', remediation: 'Return-Frist 60 Tage für Consumer; NACHA-Rule-Verstoß bei fehlender Autorisierung.', group: 'NACHA' },
  { code: 'R16', name: 'AccountFrozen', meaning: 'Konto gesperrt (OFAC-Block, Pfändung, Rechtsstreit).', remediation: 'Kein Re-Submit; OFAC-Screening prüfen.', group: 'NACHA' },
  { code: 'R20', name: 'NonTransactionAccount', meaning: 'Konto erlaubt keine ACH-Transaktionen (z. B. Savings-Account mit Reg-D-Limit überschritten).', remediation: 'Alternativen Account-Typ verwenden.', group: 'NACHA' },
  { code: 'R29', name: 'CorporateCustomerAdvisesNotAuthorized', meaning: 'Corporate Receiver (CCD/CTX) bestreitet Autorisierung.', remediation: 'Return-Frist 2 Banking Days; Corporate-Agreement prüfen.', group: 'NACHA' },
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
