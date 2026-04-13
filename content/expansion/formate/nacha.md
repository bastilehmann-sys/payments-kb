---
format_name: NACHA
aktuelle_version: "NACHA ACH File Format 2024 (Fixed-Width 94-Zeichen-Record)"
nachrichtentyp: US ACH (Automated Clearing House) — Batch-Zahlungsdatei für Überweisungen und Lastschriften
familie_standard: US ACH
datenrichtung: Ausgehend (Corporate → ODFI → ACH Network) + Eingehend (ACH Network → RDFI → Corporate)
sap_relevanz: SAP ERP / S/4HANA — via DMEE (Format "ACH CCD+", "ACH PPD", "ACH CTX") oder Custom-ABAP; F110-Zahlungsprogramm mit US-ACH-Variante; kein natives SAP-ACH-Format; US-Bankadapter erforderlich
status: Aktiv — Kernformat für US-Massenzahlungen (> 30 Mrd. Transaktionen p.a.); ISO 20022-Migration (Fed NOW) parallel im Aufbau
---

# NACHA — US ACH File Format (NACHA — National Automated Clearing House Association)

**Stand:** April 2026 | **Quellen:** NACHA (nacha.org), Federal Reserve, US Treasury FMSP

## Zweck & Verwendung

### Experte

**NACHA** (National Automated Clearing House Association) definiert das Dateiformat und die Regeln für den **US ACH (Automated Clearing House) Network** — das zentrale US-amerikanische elektronische Massenzahlungssystem, betrieben durch das Federal Reserve (FedACH) und The Clearing House (EPN). Das NACHA-Dateiformat ist ein **Fixed-Width-Format** mit 94-Zeichen-Records (ASCII), strukturiert in:

- **File Header Record** (Typ 1): Routing-Informationen der ODFI (Originating Depository Financial Institution)
- **Batch Header Record** (Typ 5): Zahlungstyp-Klassifikation (SEC Code) und Batch-Metadaten
- **Entry Detail Record** (Typ 6): Einzeltransaktion mit ABA Routing Number, Kontonummer, Betrag
- **Addenda Record** (Typ 7): Optional — Remittance Information (für CCD+, CTX)
- **Batch Control Record** (Typ 8): Batch-Summe und Record Count
- **File Control Record** (Typ 9): Datei-Gesamtsumme

**SEC Codes** (Standard Entry Class Codes) definieren den Transaktionstyp:
- `CCD` (Corporate Credit or Debit): B2B-Überweisungen und Lastschriften ohne Addenda
- `CCD+` (CCD with Addenda): B2B mit 80-Zeichen-Remittance-Information
- `CTX` (Corporate Trade Exchange): B2B mit bis zu 9.999 Addenda-Records (ISO-820-kompatibel)
- `PPD` (Prearranged Payment and Deposit): Gehaltsauszahlungen, Verbraucher-Lastschriften
- `IAT` (International ACH Transaction): Grenzüberschreitende ACH-Zahlungen (OFAC-Prüfung obligatorisch)
- `WEB` (Internet-initiated Entry): Online-autorisierte Lastschriften

**Clearing-Zyklus**: Same-Day ACH (NACHA-Erweiterung 2016–2021) ermöglicht bis zu 3 Clearing-Fenster täglich; Standard ACH = Next Business Day.

### Einsteiger

NACHA-ACH ist das amerikanische Äquivalent zu SEPA in Europa — ein standardisiertes System für Überweisungen und Lastschriften zwischen US-Banken. Das Format ist eine alte Textdatei mit festen Spaltenbreiten (94 Zeichen pro Zeile), die SAP oder eine externe Software erzeugt. Fast alle US-Gehaltsabrechnungen und Lieferantenzahlungen laufen über ACH. SAP kann ACH-Dateien erzeugen, braucht dafür aber eine spezielle Konfiguration und oft einen Bankadapter.

## Versionshistorie / Standard-Entwicklung

| Zeitraum | Ereignis |
|---|---|
| 1974 | NACHA als National Automated Clearing House Association gegründet |
| 1978 | Standardisierung des 94-Zeichen-Formats |
| 2000er | Einführung IAT (International ACH Transaction) |
| 2016 | Same-Day ACH Phase 1: Credits bis USD 25.000 |
| 2018 | Same-Day ACH Phase 3: Debits; Limite erhöht auf USD 100.000 |
| 2021 | Same-Day ACH Limit USD 1.000.000 |
| 2022 | WEB Debit Account Validation Rule (KYC-Pflicht für Online-Lastschriften) |
| 2023 | FedNow Service Launch (ISO 20022, Echtzeit-Alternative zu ACH) |
| 2024 | NACHA-Regeln: Account Validation, Risk Management-Verschärfungen |

## Wichtige Felder (technisch)

| Record-Typ | Feld | Position (Zeichen) | Pflicht |
|---|---|---|---|
| File Header (1) | Immediate Destination (ABA Routing #) | 4-13 | Ja |
| File Header (1) | Immediate Origin (ODFI ABA) | 14-23 | Ja |
| Batch Header (5) | SEC Code (CCD/PPD/CTX/IAT) | 51-53 | Ja |
| Batch Header (5) | Company Name | 5-20 | Ja |
| Batch Header (5) | Effective Entry Date (YYMMDD) | 70-75 | Ja |
| Entry Detail (6) | Routing Transit Number (9-stellig) | 4-12 | Ja |
| Entry Detail (6) | Account Number | 13-29 | Ja |
| Entry Detail (6) | Amount (in Cents) | 30-39 | Ja |
| Entry Detail (6) | Individual Name / Company Name | 55-76 | Ja |
| Entry Detail (6) | Transaction Code (22=Credit, 27=Debit etc.) | 2-3 | Ja |
| Addenda (7) | Payment Related Information | 4-83 | Nein (opt.) |

## Pflichtfelder (Kurzliste)

Routing Transit Number (ODFI) · ABA Routing Number (RDFI) · Account Number · Betrag (Cents) · SEC Code · Effective Entry Date · Company Name · Transaction Code

## SAP-Mapping

### Experte

SAP unterstützt ACH über das DMEE-Framework, erfordert aber US-spezifisches Customizing:
- **DMEE-Formate**: SAP liefert DMEE-Vorlagen für ACH CCD, CCD+, PPD, CTX. Konfiguration in Transaktion `DMEE` unter Format-Typ `ACH`.
- **F110**: US-ACH-Zahlungsweg konfiguriert mit Bankschlüssel = ABA Routing Number (9-stellig, Format XXXXXXXXX). SAP-Tabellen `T012` (Hausbank), `T012K` (Hausbankkonto) müssen ABA-Numbers enthalten.
- **ABA Routing Number**: In SAP als Bankschlüssel hinterlegt; Debitor/Kreditor-Bankdaten müssen ABA + Account Number statt IBAN enthalten.
- **Amount in Cents**: NACHA-Beträge sind in Cents (USD × 100) — DMEE-Mapping muss Betragsfeld entsprechend umrechnen.
- **IAT-Compliance**: International ACH Transactions erfordern Country-Code, OFAC-Screening-Felder — SAP-Standard deckt IAT nicht vollständig ab.
- **Same-Day ACH**: Effective Entry Date = Einreichungsdatum (nicht +1 wie Standard ACH) — Zahlungslauf-Konfiguration muss SDA-Flag unterstützen.
- **Prenote (Vorankündigungstransaktion)**: ACH-Best-Practice: Prenote (0-Betrag-Testbuchung) vor erster produktiver Transaktion — in SAP nicht standardmäßig automatisiert.

### Einsteiger

SAP kann ACH-Dateien erstellen, aber es braucht spezielle US-Einstellungen. Die wichtigsten Unterschiede zu Europa: Statt IBAN gibt es eine Routing-Nummer (ABA) und eine Kontonummer. Beträge werden in Cents angegeben (1 USD = 100). Der Zahlungsweg in SAP muss speziell für ACH konfiguriert sein. Viele US-Niederlassungen europäischer Konzerne nutzen externe Systeme (z. B. Kyriba oder die Bank-eigene Plattform), weil SAP-ACH-Konfiguration komplex ist.

## Typische Fehlerquellen

### Experte

- **ABA Routing Number falsch**: 9-stellige ABA-Nummer enthält Prüfziffer (Modulo-10-Algorithmus) — eine falsche Routing Number führt zur Rückgabe (Return Code R03).
- **Betrag in Dollar statt Cents**: NACHA-Betrag in Cents, SAP-Ausgabe in Dollars/Cents → 100-fach falscher Betrag.
- **Effective Entry Date Wochenende/Feiertag**: Effective Entry Date muss auf einen US-Bankarbeitstag fallen — automatische Anpassung muss implementiert sein (Federal Reserve Holiday Calendar).
- **Return Codes nicht verarbeitet**: ACH-Returns (R01–R99) werden von der RDFI zurückgesendet — ohne Return-Verarbeitung in SAP entstehen offene Posten ohne Storno.
- **IAT ohne OFAC-Screening**: International ACH Transactions ohne OFAC-Prüfung (US-Sanktionsliste) verstoßen gegen US-Recht — Compliance-Risiko.
- **Duplicate Detection fehlgeschlagen**: NACHA-Regeln fordern Duplikat-Erkennung — identische Dateien dürfen nicht zweimal eingereicht werden.

### Einsteiger

- Die Beträge kommen falsch an: SAP hat Dollar gesendet, aber die Datei erwartet Cents — alle Zahlungen sind um Faktor 100 zu niedrig.
- Eine Lieferantenzahlung wird abgewiesen (Return R03) — ABA Routing Number ist falsch, aber niemand wusste, wie man prüft ob eine ABA-Nummer gültig ist.
- ACH-Returns kommen zurück (Konto nicht vorhanden, Konto gesperrt), werden aber nicht in SAP verarbeitet — der Buchhalter merkt erst beim Monatsabschluss.

## Häufige Projektfehler

### Experte

- **Prenote-Prozess nicht implementiert**: ACH-Best-Practice ist Prenote (Testtransaktion mit 0-Betrag) vor erster Live-Zahlung — wird oft übersprungen und führt zu frühen Returns.
- **Return-Code-Handling fehlt**: NACHA-Returns (R01 bis R99) müssen automatisch verarbeitet werden; ohne automatisches Return-Handling entstehen manuelle Aufwände und Forderungsausfälle.
- **Same-Day ACH vs. Standard ACH**: Projekte unterscheiden nicht zwischen SDA (Effective Entry Date = heute) und Standard ACH (Effective Entry Date = morgen) — Bankgebühren und Cut-Off-Zeiten unterscheiden sich erheblich.
- **OFAC-Screening nicht integriert**: US-Recht verlangt OFAC-Screening für alle ACH-Zahlungen — Projekte setzen SAP GTS (Global Trade Services) nicht ein und riskieren Compliance-Verstöße.

### Einsteiger

- Das Projekt startet ACH-Live ohne Testphase (Prenotes) — erste Zahlungen kommen als Returns zurück, weil Kontodaten falsch sind.
- OFAC-Screening wird vergessen — das Unternehmen zahlt versehentlich an eine sanktionierte Partei, was hohe Strafen nach sich ziehen kann.
- Cut-Off-Zeiten für ACH werden nicht beachtet: Zahlung zu spät eingereicht → Buchung einen Tag später als geplant → Lieferant mahnt.
