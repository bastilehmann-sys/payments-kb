---
format_name: Faster Payments
aktuelle_version: "FPS ISO 20022 MX (pacs.008 / pain.001-basiert, Pay.UK NPA-Vorbereitung)"
nachrichtentyp: UK Faster Payments Service — Echtzeit-Einzelzahlungen (7/24, < 15 Sek.)
familie_standard: UK Legacy
datenrichtung: Ausgehend (Corporate → Bank → FPS) + Eingehend (FPS → Bank → Corporate)
sap_relevanz: SAP ERP / S/4HANA — kein natives FPS-Format; Integration über Bankadapter (Barclays, Lloyds, HSBC API) oder ISO 20022-basierte Schnittstelle; F110 nicht geeignet für Echtzeit
status: Aktiv — 3,8 Mrd. Transaktionen p.a. (2023); NPA (New Payments Architecture) als ISO-20022-Nachfolger in Entwicklung
---

# Faster Payments — UK Faster Payments Service (FPS)

**Stand:** April 2026 | **Quellen:** Pay.UK (fasterpayments.org.uk), Bank of England, UK Finance

## Zweck & Verwendung

### Experte

**Faster Payments Service (FPS)** ist das britische Echtzeit-Zahlungssystem für Überweisungen bis GBP 1.000.000 (Limit variiert nach Bank). Betrieben von **Pay.UK** (früher Faster Payments Scheme Limited), ermöglicht FPS Zahlungen in unter 15 Sekunden rund um die Uhr (24/7/365). FPS unterscheidet sich von Bacs durch sofortige Buchung statt 3-Tage-Clearing.

**Technische Grundlage**: FPS wurde 2008 auf Basis des **SWIFT MT-Nachrichtenformats** (MT103-ähnlich, proprietär angepasst) gestartet. Die Migration zu ISO 20022 (MX) ist mit dem **New Payments Architecture (NPA)**-Programm von Pay.UK in Vorbereitung (geplant ab 2025+). NPA wird `pacs.008` und `pacs.004` als Kern-Nachrichtentypen für FPS verwenden.

**Zugangswege für Corporates**:
- Direkte Teilnahme (Sponsoring durch Settlement Bank): Großunternehmen reichen via SWIFT FileAct oder API direkt bei FPS ein.
- Indirekte Teilnahme: Über Hausbank-API (Barclays PayConnect, Lloyds API Banking, HSBC Global Payments).
- Open Banking: FPS ist Rückgrat der UK Open Banking-Initiative (PSD2-Umsetzung im UK); Zahlungsinitiierung über PISP (Payment Initiation Service Provider).

**Transaktionslimits**: Standard-Limit 1 Mio. GBP (Banken können niedrigere Limits setzen). Keine Sammelzahlungen (Batch) — jede Transaktion wird einzeln eingereicht.

### Einsteiger

Faster Payments ist das britische Äquivalent zu SEPA Instant — Geld wird in Sekunden transferiert, rund um die Uhr, auch an Wochenenden. Für Unternehmen ist FPS wichtig für dringende Lieferantenzahlungen, Gehaltsergänzungen oder Echtzeit-Kundenerstattungen. Im Gegensatz zu Bacs (3 Tage Vorlauf) ist FPS sofort. SAP selbst kann FPS nicht direkt auslösen — dafür braucht man entweder eine Bank-API oder einen Middleware-Service.

## Versionshistorie / Standard-Entwicklung

| Zeitraum | Ereignis |
|---|---|
| 2008 | FPS Launch — 3 Gründungsbanken (Barclays, HSBC, Lloyds TSB) |
| 2012 | Ausbau auf 10+ Teilnehmerbanken; Limit GBP 100.000 |
| 2015 | Limit auf GBP 250.000 erhöht |
| 2017 | UK Open Banking Initiative startet auf FPS-Basis (PSD2 UK) |
| 2019 | Limit GBP 1.000.000 für große Teilnehmer |
| 2021 | Pay.UK kündigt NPA (New Payments Architecture) mit ISO 20022 an |
| 2023 | FPS 3,8 Mrd. Transaktionen p.a.; NPA-Pilotphase beginnt |
| 2025+ | NPA-Migration: FPS auf pacs.008 / pacs.004 ISO 20022 MX-Basis |

## Wichtige Felder (technisch)

| FPS-Feld (aktuell, proprietär) | ISO-20022-Pendant (NPA) | Pflicht |
|---|---|---|
| Sort Code (6-stellig) | FinInstnId/ClrSysMmbId | Ja |
| Account Number (8-stellig) | CdtrAcct/Id/Othr | Ja |
| Amount (GBP, max. 1 Mio) | InstdAmt/Ccy=GBP | Ja |
| Payment Reference | EndToEndId | Ja |
| Faster Payments ID | UETR (NPA) | Ja |
| Payee Name | Cdtr/Nm | Ja |
| Confirmation of Payee (CoP) | Cdtr/Nm + Prxy | Seit 2020 Pflicht |

## Pflichtfelder (Kurzliste)

Sort Code · Account Number · Amount · Payee Name · Payment Reference · CoP-Bestätigung (seit 2020)

## SAP-Mapping

### Experte

SAP hat keine native FPS-Integration. Da FPS keine Batch-Datei-Einreichung unterstützt (jede Zahlung einzeln, Echtzeit), ist der typische F110-basierte Zahlungslauf nicht direkt anwendbar. Integration:
- **SAP Treasury / In-House Cash**: Manuelle oder halb-automatische Auslösung über Bank-API-Verbindung (Barclays PayConnect-API, Lloyds Transaction API).
- **Middleware**: Über SWIFT Alliance oder SAP Integration Suite (ehemals SAP CPI/HCI) als API-Gateway zwischen SAP-Zahlungsauftrag und FPS-Bank-API.
- **Payment Hub**: Moderne Zahlungshub-Lösungen (Serrala, Kyriba, SAP Multi-Bank Connectivity) unterstützen FPS-Routing über Bank-API.
- **Confirmation of Payee (CoP)**: Seit 2020 UK-Regulierungspflicht — Empfänger-Name muss gegen Bankdaten geprüft werden. CoP-API-Anbindung muss separat implementiert werden.

### Einsteiger

Für SAP und Faster Payments gibt es keine einfache fertige Lösung. FPS funktioniert nicht wie SEPA: SAP kann keine Batch-Dateien erzeugen und bei FPS einreichen — jede Zahlung muss einzeln und in Echtzeit ausgelöst werden. Das geht am besten über eine Bank-API (direkter digitaler Kanal zur Hausbank) oder über eine externe Zahlungsplattform, die SAP und die Bank verbindet.

## Typische Fehlerquellen

### Experte

- **Betrag überschreitet Transaktionslimit**: FPS-Limit variiert je nach Bank (manche Banken: GBP 25.000, andere GBP 1 Mio.) — Limit muss vor Einreichung geprüft werden.
- **Confirmation of Payee fehlgeschlagen**: Seit 2020 müssen Banken CoP-Prüfung durchführen; Name-Mismatch führt zu Warnung oder Ablehnung — SAP-Stammdaten-Qualität entscheidend.
- **Sort Code ungültig**: FPS prüft Sort Code gegen UK Sort Code-Verzeichnis (EISCD) — ungültige oder inaktive Sort Codes werden abgewiesen.
- **Zahlung überschreitet Cut-Off**: FPS ist 24/7, aber Bank-seitige API-Maintenance-Fenster können Zahlungen verzögern — Critical Payments müssen mit Backup-Kanal (CHAPS) geplant werden.

### Einsteiger

- Der Betrag ist zu hoch für FPS — die Bank lehnt ab, kein Fehlertext ist verständlich.
- Der Name des Empfängers stimmt nicht exakt mit dem Konto überein — CoP-Warnung blockiert die Zahlung.
- Zahlung geht nicht durch, weil die Sort Code des Empfängers nicht bei FPS teilnehmendem Institut liegt.

## Häufige Projektfehler

### Experte

- **FPS statt CHAPS für kritische Zahlungen**: FPS hat kein garantiertes Zeitfenster (< 15 Sek., aber kein SLA für große Beträge) — für kritische Zahlungen (z. B. Immobilienabschlüsse) sollte CHAPS genutzt werden.
- **CoP-Implementierung vergessen**: Confirmation of Payee ist seit 2020 Regulierungsanforderung (PSR Mandate) — Projekte ohne CoP-Integration riskieren Compliance-Verstöße.
- **NPA-Migration nicht auf Roadmap**: Pay.UK wird FPS auf ISO 20022 (NPA) migrieren — Projekte müssen NPA in der technischen Roadmap berücksichtigen, um keine Legacy-Schulden aufzubauen.

### Einsteiger

- Das Projekt plant UK-Zahlungen und implementiert nur Bacs — stellt fest, dass für dringende Zahlungen FPS benötigt wird (getrennte Integration).
- Die CoP-Anforderung wird übersehen — Zahlungen werden von der Bank wegen Name-Mismatch blockiert, Zahlung an falsches Konto möglich.
