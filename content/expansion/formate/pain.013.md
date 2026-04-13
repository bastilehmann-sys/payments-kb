---
format_name: pain.013
aktuelle_version: "001.001.09"
nachrichtentyp: CreditorPaymentActivationRequest
familie_standard: ISO 20022 / pain
datenrichtung: Ausgehend (Creditor/Bank → Debtor-Bank)
sap_relevanz: SAP S/4HANA / Request-to-Pay (RTP), SEPA RTP, Digital Invoice Presentment
status: Aktiv (EPC SEPA Request-to-Pay Rulebook 2023)
---

# pain.013 — Creditor Payment Activation Request (Request-to-Pay)

**Stand:** April 2026 | **Quellen:** ISO 20022, EPC SEPA Request-to-Pay Rulebook v2.0, SWIFT, SAP

## Zweck & Verwendung

### Experte

pain.013 ist die ISO-20022-Nachricht für den **Request-to-Pay (RTP)**-Prozess: Der Gläubiger (Creditor) sendet dem Schuldner (Debtor) über dessen Zahlungsdienstleister eine digitale Zahlungsanforderung mit konkretem Betrag, Fälligkeitsdatum und Zahlungsreferenz. Der Debtor genehmigt oder lehnt die Anforderung ab (Response: pain.014). Der Prozess ersetzt nicht die eigentliche Zahlung — er initiiert sie als **Push-Payment** auf Debtor-Initiative nach Zustimmung. Wesentliche Elemente: `ReqdExctnDt` (gefordertes Ausführungsdatum), `RtpId` (eindeutige RTP-Referenz), `CdtrAcct` (Empfängerkonto), `LclInstrm/Cd=SRTP` (EPC SEPA RTP-Kennung). Die aktuellen Versionen 001.001.07–009 wurden im Rahmen des EPC SEPA RTP Rulebook 2023 standardisiert.

### Einsteiger

pain.013 ist eine "Zahlungsaufforderung" in digitaler Form: Anstatt eine Rechnung per E-Mail zu schicken und auf den Geldeingang zu warten, sendet der Lieferant (Creditor) dem Kunden (Debtor) direkt über das Bankensystem eine strukturierte Zahlungsanforderung. Der Kunde sieht diese in seiner Banking-App und kann mit einem Klick zustimmen (Zahlung wird automatisch ausgelöst) oder ablehnen. Es ist wie eine digitale, interaktive Rechnung — modern und sehr sicher.

## Versionshistorie

| Version | Jahr | Änderungen |
|---|---|---|
| 001.001.01 | 2012 | Erstveröffentlichung ISO — generischer Creditor Payment Activation Request |
| 001.001.02 | 2013 | Ergänzung `ExpiryDt`, `Purp`-Codes erweitert |
| 001.001.03 | 2015 | SEPA-Alignment: `SvcLvl/Cd=SEPA`, `LclInstrm`-Block |
| 001.001.04 | 2017 | UETR-Pflicht für RTP-Tracking; `CdtrSchmeId` optional für SEPA |
| 001.001.05 | 2019 | `RmtInf/Strd`-Pflicht bei strukturierten Rechnungsreferenzen |
| 001.001.06 | 2020 | BICFI statt BIC; LEI-Unterstützung in `InitgPty` |
| 001.001.07 | 2021 | EPC SEPA RTP Rulebook v1.0: `RtpId`, Expiry-Window, pain.014-Referenz |
| 001.001.08 | 2022 | Alignment mit CBPR+: strukturierte Adressen, `CtrySubDvsn` |
| 001.001.09 | 2023 | Aktuell: EPC SEPA RTP v2.0 — `MndtRltdInf` optional für Recurring RTP, `DueDt` als ISO-Datum-Pflichtfeld |

## Wichtige Felder (technisch)

| XML-Element | Bedeutung | Pflicht |
|---|---|---|
| `GrpHdr/MsgId` | Eindeutige Nachrichtenreferenz | Ja |
| `GrpHdr/NbOfTxs` | Anzahl RTP-Anforderungen | Ja |
| `CdtTrfTxInf/PmtId/RtpId` | Eindeutige RTP-Referenz | Ja (EPC RTP) |
| `CdtTrfTxInf/RqdExctnDt/Dt` | Gewünschtes Zahlungsdatum | Ja |
| `CdtTrfTxInf/XpryDt/Dt` | Verfallsdatum der Anforderung | Ja |
| `CdtTrfTxInf/Amt/InstdAmt` | Betrag und Währung | Ja |
| `CdtTrfTxInf/CdtrAcct/Id/IBAN` | Empfänger-IBAN | Ja |
| `CdtTrfTxInf/PmtTpInf/LclInstrm/Cd` | `SRTP` für SEPA RTP | Ja (SEPA) |
| `CdtTrfTxInf/RmtInf/Strd/CdtrRefInf/Ref` | Strukturierte Rechnungsreferenz | Empfohlen |

## Pflichtfelder (Kurzliste)

`MsgId` · `CreDtTm` · `NbOfTxs` · `RtpId` · `RqdExctnDt` · `XpryDt` · `InstdAmt` · `CdtrAcct/IBAN` · `LclInstrm/Cd=SRTP`

## SAP-Mapping

### Experte

In SAP S/4HANA ist pain.013 primär im Kontext der **SAP Digital Payments Add-On** und des **S/4HANA Finance for Banking**-Moduls relevant. Die native RTP-Unterstützung wurde in **SAP S/4HANA 2022 (OP) / 2023 (Cloud)** eingeführt. Technisch wird pain.013 über die **Payment Order Management**-Schnittstelle (Business Object `/FSCM/PORD`) erzeugt; die Abwicklung erfolgt über den **Bank Communication Manager (BCM)**, Transaktion `FIBP`. Die RTP-Response (pain.014) wird per **SWIFT Alliance Gateway** oder **EBICS**-Kanal zurückempfangen und über den BCM verarbeitet. Für FI-Integration: Offene Posten (FI-AR) bleiben offen bis Bestätigung der pain.014-Genehmigung.

### Einsteiger

SAP unterstützt pain.013 erst seit 2022 richtig. Wer es einsetzen will, braucht eine aktuelle SAP S/4HANA-Version. In der Praxis für KMUs meist noch wenig relevant — große Unternehmen in Telekommunikation, Utilities und B2B-Handel nutzen es für die digitale Rechnungsstellung an Geschäftskunden. Der Debitor genehmigt die Zahlung in seiner Banking-App, und SAP bucht dann den Offenen Posten automatisch aus, sobald das Geld eingeht.

## Typische Fehlerquellen

### Experte

- **Fehlender oder falscher `LclInstrm/Cd`**: Ohne `SRTP` wird die Nachricht von EPC-SEPA-kompatiblen Systemen nicht als RTP erkannt — fällt in den generischen Payment-Flow.
- **`XpryDt` vor `RqdExctnDt`**: Logischer Fehler — das Verfallsdatum muss nach dem gewünschten Zahlungsdatum liegen. Viele Implementierungen setzen Expiry = ReqdExctnDt (falsch).
- **UETR fehlt**: Für SWIFT-Routing von pain.013 im CBPR+-Kontext ist UETR Pflicht — wird in early SEPA-RTP-Implementierungen oft weggelassen.
- **pain.014-Response-Verarbeitung fehlt**: Ohne vollständige Implementierung der Antwort (Genehmigung/Ablehnung) bleibt der Prozess inkomplett — der offene Posten hängt im Unklaren.

### Einsteiger

- Das Verfallsdatum wird zu kurz gesetzt (z. B. nur 1 Tag) — der Kunde kann die Anforderung gar nicht rechtzeitig sehen und genehmigen.
- Die strukturierte Rechnungsreferenz fehlt — der Debitor kann nicht nachvollziehen, wofür er zahlen soll.
- Es wird pain.013 versendet, aber die Antwort (pain.014) wird im System nicht verarbeitet — das führt dazu, dass offene Posten nicht automatisch geschlossen werden.

## Häufige Projektfehler

### Experte

- **BCM-Konfiguration für pain.013 fehlt**: In bestehenden SAP-Projekten ist BCM oft nur für pain.001/002 konfiguriert — pain.013 braucht eigene Kommunikationsprofile und Formatdateien (DMEEX oder PMW).
- **Bank unterstützt kein SEPA RTP**: Trotz EPC-Standard ist die Bankunterstützung in vielen EU-Ländern (außer DE, NL, BE) noch lückenhaft — Projektplanung ohne Banken-Check führt zu Rollout-Delays.
- **Mandats-Confusion mit SDD**: pain.013 ist kein Lastschrift-Mandat — es braucht keine Creditor-ID. Teams aus dem SDD-Umfeld konfigurieren fälschlicherweise `CdtrSchmeId`.

### Einsteiger

- Unternehmen erwarten, dass pain.013 die Zahlung direkt auslöst — das tut es nicht; der Debitor muss erst zustimmen. Ohne diese Genehmigung passiert nichts.
- In SAP-Projekten wird pain.013 als "nice to have" geplant und erhält zu wenig Testzeit — die Testszenarien für Ablehnung (pain.014 RJCT) fehlen ganz.
- Debitor-seitig gibt es oft keine Banking-App-Unterstützung für RTP — dann muss doch eine klassische Zahlung erfolgen, und der Nutzen entfällt.
