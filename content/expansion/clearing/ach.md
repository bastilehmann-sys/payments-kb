---
name: Automated Clearing House (USA)
abkuerzung: US ACH
region: USA
typ: Deferred Net Settlement (Batch)
waehrung: USD
betreiber: "Nacha (National Automated Clearing House Association); Betrieb über zwei Operatoren: Federal Reserve (FedACH) und The Clearing House (EPN)"
status: Operativ, seit 1972; Same-Day ACH seit 2016
beschreibung_experte: |
  Das US ACH Network ist das standardisierte Batch-Zahlungssystem für Kleinbetragszahlungen in den USA. Es verarbeitet täglich Milliarden von Transaktionen in standardisierten Nacha-Dateien (NACHA Operating Rules, CTX- und CCD-Formate für Corporate-Zahlungen). ACH wird für Gehaltszahlungen (Direct Deposit), B2B-Zahlungen (CCD/CTX), Lastschriften (PPD, CCD Debit) und Government-Zahlungen eingesetzt. Das Netz settlement erfolgt in Batches über die Federal Reserve oder The Clearing House (EPN). Same-Day ACH (eingeführt 2016, erweitert 2022) erlaubt Beträge bis 1 Mio. USD taggleich. Standard-ACH settelt am nächsten Geschäftstag. Die Nacha Operating Rules (jährlich aktualisiert) legen Haftung, Rückgabefristen und Corporate-Entry-Typen fest.
beschreibung_einsteiger: |
  ACH ist das amerikanische Gegenstück zur SEPA-Lastschrift und SEPA-Überweisung zusammen. Wenn ein US-Unternehmen Gehälter zahlt oder Mieten per Lastschrift einzieht, läuft das über ACH. Es ist langsamer als Fedwire oder CHIPS (1–2 Tage), aber sehr günstig. Same-Day ACH macht es seit 2016 auch für eilige kleinere Zahlungen nutzbar.
aufbau: |
  Zwei konkurrierende Betreiber: FedACH (Federal Reserve) und EPN (Electronic Payments Network, betrieben von The Clearing House). Beide sind interoperabel. Nacha setzt die Regeln (Operating Rules & Guidelines), ist aber selbst kein Betreiber. Dateiformate: NACHA-Standard (Fixed-Width ASCII, 94-Zeichen-Zeilen). Corporate Entries: CCD (Corporate Credit or Debit), CTX (Corporate Trade Exchange, bis 9.999 Addenda-Records), PPD (Preteauthorized Payment and Deposit für Consumer). Standard-Entry Class Codes definieren Zahlungsart und Haftungsregeln.
settlement_modell: |
  Deferred Net Settlement in Batch-Zyklen. Standard ACH: Settlement am nächsten Geschäftstag (Next Day). Same-Day ACH: drei tägliche Processing-Fenster (8:00, 12:00, 16:45 ET), Settlement am selben Tag bis 17:30 ET. Rückgabefristen: Unauthorized Debit-Rückgaben bis zu 60 Tage (Consumer) bzw. 2 Geschäftstage (Corporate).
cut_off: |
  Standard ACH Einreicheschluss (FedACH): typisch 17:00–19:00 ET für Next-Day Settlement.
  Same-Day ACH: 3 Fenster — 10:30 ET (Settlement 13:00), 14:45 ET (Settlement 17:00), 16:45 ET (Settlement 18:00). Limits Same-Day ACH: max. 1.000.000 USD pro Transaktion (seit März 2022).
teilnehmer: |
  Über 10.000 ODFI (Originating Depository Financial Institutions) und RDFI (Receiving Depository Financial Institutions). Nacha-Mitglieder: Banken, Credit Unions, Savings Institutions. Corporates sind keine direkten Teilnehmer — sie sind "Originatoren" die über ihre ODFI-Bank einreichen.
relevanz_experte: |
  1) Gehaltsabrechnungen für US-Mitarbeiter: Direct Deposit via PPD/ACH ist der Standard in den USA — SAP HR Payroll muss NACHA-Dateien erzeugen (Transaktion PC00_M10_CIPE oder entsprechende DME-Konfiguration).
  2) US B2B Massenzahlungen (Lieferantenzahlungen <1 Mio. USD): CCD/CTX über ACH günstiger als Wire Transfers — typisch 0,20–0,50 USD pro Transaktion vs. 15–25 USD für Fedwire.
  3) Direct Debit (CCD Debit / PPD): für US-Forderungseinzug relevant — Rückgaberisiko (Unauthorized Returns) und entsprechende Rücklagepflicht beachten.
  4) CTX-Format erlaubt bis zu 9.999 Addenda-Records (820-Format für Remittance Information) — für automatisierte Rechnungszuordnung in SAP AR relevant.
  5) Nacha WEB-Debit-Regeln (seit 2022 verschärft): Account-Validierungspflicht vor erstem Debit — Compliance-Thema für US-Subscription-Modelle.
relevanz_einsteiger: |
  Warum relevant: Wenn Ihr US-Unternehmen Gehälter zahlt oder Lieferanten überweist, läuft das über ACH. Es ist billig und automatisch. Als Treasurer müssen Sie nur wissen: ACH-Dateien müssen rechtzeitig bei der Bank eingereicht werden (meist einen Tag vorher), und Same-Day ACH ist möglich, aber teurer.
corporate_zugang_experte: |
  Corporates als "Originator": Einreichung von NACHA-Batch-Dateien (Fixed-Width, 94 Zeichen pro Record) über SFTP/H2H zur ODFI-Bank oder über die Bank-API. SAP: Payment Medium Workbench (PMW) mit NACHA-Format oder Drittanbieter-Add-on (z.B. Bottomline, GTreasury). Wichtige Felder: Company ID (9-stellig, IRS EIN oder assigned), SEC Code (CCD/CTX/PPD), Effective Entry Date. Rückgaben (Return Items) müssen in SAP verarbeitet werden — oft manuell oder via Bank-Statement-Import.
corporate_zugang_einsteiger: |
  Ihre Buchhaltungssoftware (SAP) erzeugt eine Datei mit allen Zahlungen, die dann zur Bank geschickt wird. Die Bank kümmert sich um den Rest. Sie müssen die Datei einen Tag vorher einreichen, damit das Geld pünktlich ankommt.
---

# US ACH — Zusätzliche Details

## Volumenstatistik 2024 (Nacha)

| Kennzahl | Wert |
|---|---|
| Jahresvolumen Transaktionen | ~31 Milliarden |
| Jahresvolumen USD | ~80 Billionen |
| Same-Day ACH Anteil | ~10 % der Transaktionen |
| Durchschnittsbetrag | ~2.600 USD |

## NACHA-Dateiformatstruktur

```
File Header Record (1 Record)
  Company/Batch Header (je Zahlungsbatch)
    Entry Detail Records (je Transaktion)
    Addenda Records (optional, CTX: bis 9.999)
  Company/Batch Control Record
File Control Record
```

## Wichtige Standard Entry Class Codes

| Code | Verwendung |
|---|---|
| CCD | Corporate Credit/Debit (B2B Standard) |
| CTX | Corporate Trade Exchange (mit Remittance) |
| PPD | Consumer Payments (Direct Deposit / Debit) |
| WEB | Internet-initiierte Consumer Debits |
| TEL | Telefonisch autorisierte Consumer Debits |

## Nacha Operating Rules — Updates 2024/2025

• Micro-Entry Rule: Validierungsbeträge (<1 USD) unterliegen seit 2021 gesonderten Regeln
• Account Validation: Verpflichtend für WEB Debits (seit 2022)
• Erhöhung Same-Day ACH Limit: von 100k auf 1 Mio. USD (März 2022)
