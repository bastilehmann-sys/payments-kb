---
code: US
name: USA
complexity: high
currency: USD
summary: Vollständig andere Zahlungsinfrastruktur ohne IBAN, ohne SEPA — ACH für Massenzahlungen, Fedwire/CHIPS für Großbetrag, kein ISO 20022-Standard vor 2025, höchster SAP-Projektaufwand aller westlichen Länder.
---

# Global Payments Datenbank — Länderprofil: USA (US)

**Stand:** April 2026 | **Quellen:** Federal Reserve, NACHA, BIS, The Clearing House, OCC | **Komplexität:** ★★★★★ Sehr Hoch (Score 8/10)

## BLOCK 1 — Country Master

### Grunddaten

| Eigenschaft | Wert | Quelle | Hinweis |
|---|---|---|---|
| ISO-Ländercode | US / USA | ISO 3166-1 | Alpha-2 / Alpha-3 |
| Währung | USD ($) | ISO 4217 | Kein EUR — Weltweit bedeutendste Reservewährung |
| IBAN-Format | KEINES | — | USA nutzt kein IBAN-Format; ABA Routing Number + Account Number |
| ABA Routing Number | 9-stellig numerisch (XXXXXXXXC = 8 Routing + 1 Prüfziffer) | ABA | Äquivalent zur deutschen BLZ |
| Kontonummer | Bankintern, 8–17 Stellen | Bankspezifisch | Kein einheitliches Format |
| Zentralbank | Federal Reserve System (Fed) | federalreserve.gov | 12 Distrikt-Reservebanken |
| Aufsichtsbehörde | OCC, Fed, FDIC, CFPB, FinCEN, SEC | — | Zersplitterte Aufsicht auf Bundes- und Staatsebene |
| Zeitzone | EST (UTC-5) / EDT (UTC-4) bis PST (UTC-8) / PDT (UTC-7) | | Multiple Zeitzonen! |
| Besonderheit | Kein SEPA, kein IBAN, eigenes ACH-System (NACHA) | | Größtes Zahlungsvolumen weltweit |
| Gläubiger-ID (CI) | Entfällt — kein SEPA | — | US-Lastschriften über ACH Direct Debit |

### US-Bankidentifikation statt IBAN

```
ABA Routing Number: [8 Stellen Routing][1 Prüfziffer] — 9 Stellen gesamt
Kontonummer: 8–17 Stellen, bankspezifisch formatiert

Prüfziffer-Algorithmus ABA (Modulo 10):
3×[1] + 7×[2] + 1×[3] + 3×[4] + 7×[5] + 1×[6] + 3×[7] + 7×[8] + 1×[9] = Vielfaches von 10
```

**MICR-Code auf US-Schecks:** ABA-Routing-Number und Kontonummer sind im MICR-Format (Magnetic Ink Character Recognition) auf Schecks aufgedruckt — wichtig beim Einlesen von US-Scheckzahlungen.

### Hauptbanken USA

- JPMorgan Chase Bank (ABA: 021000021) — größte US-Bank; führend im Corporate-Treasury
- Bank of America (ABA: 026009593) — zweitgrößte; starkes Corporate Banking
- Citibank N.A. (ABA: 021000089) — sehr starkes internationales Corporate-Netzwerk
- Wells Fargo Bank (ABA: 121000248) — Fokus US-Midwest und Corporate
- Goldman Sachs Bank USA — Investment-fokussiert; Treasury Services
- Morgan Stanley Bank — Investment-fokussiert
- U.S. Bank N.A. — Regional stark; Corporate-Services
- PNC Bank — Mittelgroß; starkes Midwest-Geschäft
- Truist Bank — Fusion BB&T + SunTrust; regionaler Fokus

**Für Multinationals empfohlen:** JPMorgan Chase, Citibank oder Bank of America — alle drei bieten starke internationale Cash-Management-Plattformen und SAP-Integration.

### US-Feiertage (Federal Holidays)

| Datum | Bezeichnung | Hinweis |
|---|---|---|
| 01.01 | New Year's Day | |
| 3. Montag Januar | Martin Luther King Jr. Day | NICHT in DE! |
| 3. Montag Februar | Presidents' Day | NICHT in DE! |
| letzter Montag Mai | Memorial Day | NICHT in DE! |
| 19.06 | Juneteenth National Independence Day | NICHT in DE! (seit 2021) |
| 04.07 | Independence Day | NICHT in DE! |
| 1. Montag September | Labor Day | NICHT in DE! |
| 2. Montag Oktober | Columbus Day | NICHT in DE! (nicht alle Bundesstaaten) |
| 11.11 | Veterans Day | NICHT in DE! |
| 4. Donnerstag November | Thanksgiving | NICHT in DE! |
| 25.12 | Christmas Day | |

**11 Federal Holidays** — Fed, ACH, Fedwire, CHIPS geschlossen an diesen Tagen. SAP: US-Fabrikkalender muss alle 11 Federal Holidays plus ggf. bundesstaatliche Feiertage enthalten.

---

## BLOCK 2 — Regulatorik USA

### Fragmentierte Aufsichtsstruktur

Die US-Finanzaufsicht ist historisch zersplittert — kein einzelnes Äquivalent zur BaFin:

| Behörde | Zuständigkeit | Relevant für |
|---|---|---|
| OCC (Office of the Comptroller of the Currency) | Bundesbank-Zulassung und -Aufsicht | National Charters |
| Federal Reserve | Systemrelevante Banken, Zahlungssysteme | Fed-Mitglieder |
| FDIC (Federal Deposit Insurance Corporation) | Einlagensicherung | Alle Banken |
| FinCEN (Financial Crimes Enforcement Network) | AML/BSA | Geldwäscheprävention |
| CFPB (Consumer Financial Protection Bureau) | Verbraucherschutz | Retail-Zahlungen |
| SEC | Kapitalmarkt | |
| Staatliche Aufsichtsbehörden | je Bundesstaat | Money Transmitter Licenses |

### Bank Secrecy Act (BSA) / AML

Das primäre US-AML-Gesetz:

- **Bank Secrecy Act (BSA), 31 U.S.C. § 5311 ff.:** Gesetzliche Grundlage für AML/KYC
- **USA PATRIOT Act (2001):** Erweiterung BSA; Section 314(b) für Informationsaustausch zwischen Institutionen
- **AML Act of 2020:** Modernisierung BSA; stärkt FinCEN-Kompetenzen
- **CTR (Currency Transaction Report):** Pflichtmeldung für Bartransaktionen > USD 10.000
- **SAR (Suspicious Activity Report):** Verdachtsmeldung an FinCEN; Schwellenwert USD 5.000
- **UBO-Register:** Corporate Transparency Act (CTA, ab 01.01.2024): UBOs mit > 25% Anteil oder erheblichem Einfluss müssen bei FinCEN gemeldet werden. Für EU-Konzerne mit US-Tochter relevant!
- **OFAC (Office of Foreign Assets Control):** US-Sanktionen — besonders wichtig; OFAC-SDN-Liste ist breiter als EU-Sanktionen. USD-Transaktionen weltweit unterliegen OFAC-Jurisdiction!

### Dodd-Frank Act und Zahlungsregulierung

- **Dodd-Frank Act (2010):** Nachfolge der Finanzkrise; Regulation E (Electronic Fund Transfers) für ACH relevant
- **Regulation E:** Verbraucherschutz bei ACH-Transaktionen; Error Resolution Procedures
- **Regulation CC:** Funds Availability für Scheckzahlungen
- **Electronic Fund Transfer Act (EFTA):** Grundlage für ACH

### OFAC — Der US-Sanktions-Wild-Card

Für alle USD-Zahlungen weltweit (auch außerhalb der USA!) gilt: Die abwickelnde Korrespondenzbank ist in der Pflicht, OFAC-Screening durchzuführen. Eine DE-Zahlung in USD an einen Empfänger außerhalb der USA, die über eine US-Korrespondenzbank läuft, unterliegt OFAC-Recht.

**Praxis-Folge:** Alle USD-Zahlungen — unabhängig ob aus DE nach US oder anderswohin — müssen gegen OFAC-SDN-Liste gescreent werden. SAP: OFAC-Screening-Integration zwingend.

---

## BLOCK 3 — Clearing & Banken USA

### US-Zahlungssysteme im Überblick

| System | Typ | Betreiber | Währung | Limit | Besonderheit |
|---|---|---|---|---|---|
| ACH (Automated Clearing House) | ACH/Batch | NACHA / Fed / EPN | USD | USD 1 Mio./Tag (Standard), USD 100.000 (Same Day) | Massenzahlungen; Direct Debit und Credit |
| Fedwire Funds Service | RTGS | Federal Reserve | USD | Unbegrenzt | Großbetrag, same-day |
| CHIPS (Clearing House Interbank Payments System) | RTGS/Net | The Clearing House | USD | Unbegrenzt | Interbank-Großbetrag; ~95% des USD-Interbankverkehrs |
| RTP (Real-Time Payments) | Instant | The Clearing House | USD | USD 1.000.000 | 24/7; noch im Aufbau |
| FedNow | Instant | Federal Reserve | USD | USD 500.000 | Gestartet Juli 2023; 24/7 |
| Zelle | P2P | EWS (Early Warning Services) | USD | Bankintern | B2C; nicht für Corporate-Treasury |
| Schecks | Papier/Elektronisch | Fed Check Services | USD | Unbegrenzt | Noch überraschend relevant in USA |

### ACH — Das US-Arbeitspferd für Massenzahlungen

Das **Automated Clearing House (ACH)** Netzwerk wird durch **NACHA** (National Automated Clearing House Association) geregelt:

**ACH-Transaktionsklassen (Standard Entry Class Codes):**

| SEC Code | Beschreibung | Verwendung |
|---|---|---|
| PPD (Prearranged Payment and Deposit) | Verbraucher Direct Debit/Credit | Gehälter, Konsumentenzahlungen |
| CCD (Corporate Credit or Debit) | B2B-Zahlungen und -Lastschriften | Lieferantenzahlungen, B2B |
| CTX (Corporate Trade Exchange) | B2B mit EDI-Informationen (bis 9.999 Addenda) | Komplexe B2B mit Rechnungsreferenzen |
| WEB (Internet Initiated) | Online-ACH | E-Commerce |
| TEL (Telephone Initiated) | Telefonisch autorisiert | |
| ARC (Accounts Receivable Check) | Scheckkonvertierung AR | |
| BOC (Back Office Conversion) | Scheckkonvertierung POS | |

**ACH-Fristen (NACHA 2024):**
- Standard ACH: Einreichung T; Settlement T+1 (Credit) oder T+2 (Debit)
- Same Day ACH (SDA): Drei Einreichungsfenster täglich; Settlement same day; Limit USD 1.000.000/Transaktion (erhöht 2022 von USD 100.000)

### Fedwire — US-Großbetrag RTGS

Fedwire ist das US-RTGS-System:
- Betrieben von der **Federal Reserve**
- **Öffnungszeiten:** Montag–Freitag 21:00 ET (Vortag) bis 18:30 ET; Samstag: 9:00–17:00 ET
- **Settlement:** Sofort (Brutto-Echtzeit)
- **Format:** Fedwire-proprietäres Format + ISO 20022 Migration läuft (Fedwire ISO 20022 Go-Live: 2025)
- **Nutzung:** Immobilientransaktionen, Großbetrag-Lieferantenzahlungen, Interbank

### CHIPS — Interbanken-Netting

CHIPS (The Clearing House):
- Verarbeitet ca. 95% des USD-Interbankenvolumens (~USD 1,8 Billionen/Tag)
- Netting-System mit Partial RTGS-Abgleich
- Nur für direkte CHIPS-Mitglieder (ca. 40 Banken) — Corporates indirekt
- **CHIPS-UID:** 10-Zeichen-Referenz die Zahlungen durch CHIPS begleitet

### RTP und FedNow — US Instant Payments

| Aspekt | RTP (The Clearing House) | FedNow (Fed) |
|---|---|---|
| Start | 2017 | Juli 2023 |
| Limit | USD 1.000.000 | USD 500.000 |
| Verfügbarkeit | 24/7/365 | 24/7/365 |
| Teilnehmer (2026) | ~400 Banken | ~700 Banken |
| Verbreitung | Großbanken | Wachsend |
| Corporate-Zugang | Über Hausbank | Über Hausbank |

**Wichtig:** Sowohl RTP als auch FedNow sind auf ISO 20022 basiert — die erste US-Infrastruktur mit nativem ISO 20022. SWIFT-Zahlungen nach USA laufen dagegen erst seit November 2025 auf pacs.008 ISO 20022.

---

## BLOCK 4 — SAP-Besonderheiten USA

### Grundkonfiguration

**Buchungskreis USA:**
- Hauswährung USD
- Bewertungsbereich GAAP (US-GAAP) oder IFRS (bei EU-Konzern parallel)
- Chart of Accounts: US-spezifisch (oft CAUS oder firmeneigener Chart)
- Steuerart: US-Sales Tax (SAP: Steuerverfahren TAXUS oder extern über Vertex/Avalara)

**Zahlungsmethoden USA in FBZP:**
- Kein SEPA — vollständig andere Zahlungsmethoden
- ACH Credit (CCD/CTX): Zahlungsmethode A oder T (bankspezifisch)
- ACH Debit: Zahlungsmethode D
- Fedwire/Check: Zahlungsmethode C (Check) oder W (Wire)
- Keine pain.001-Datei — NACHA-Format oder proprietäres Bankformat

### NACHA-Format für ACH

Das NACHA-Format ist ein **festes 94-Zeichen-Satzformat** (kein XML!):

```
Record Types:
1: File Header Record
5: Batch Header Record
6: Entry Detail Record (mit ABA Routing + Account Number)
7: Addenda Record (optional; für Remittance Info)
8: Batch Control Record
9: File Control Record
```

**NACHA-Felder für Corporate-Zahlungen (CCD):**
- Field 3: Routing Transit Number (9-stellige ABA)
- Field 4: Account Number (bis 17 Stellen)
- Field 5: Amount in Cents
- Field 6: Individual Identification Number (Referenz)
- Field 7: Individual Name (Empfängername)
- Field 9: Transaction Code (22=Credit Checking, 27=Debit Checking, 32=Credit Savings, 37=Debit Savings)

**SAP-NACHA-DMEE:**
- SAP bietet NACHA-DMEE-Templates (NACHA_CT, NACHA_DD)
- Bankspezifische Abweichungen möglich — immer mit US-Hausbank testen
- Addenda-Records für CTX: Bis 9.999 Addenda möglich; für Remittance Information bei B2B-Zahlungen

### Check-Processing in USA

Schecks sind in den USA noch überraschend präsent — ca. 3,4 Milliarden Schecks/Jahr (2023, stark rückläufig aber weiterhin signifikant):

- **Check 21 (2003):** Ermöglicht elektronische Scheckbearbeitung (Image Cash Letter)
- **SAP Check-Printing:** Standard-Funktionalität; US-Scheckformulare (MICR) konfigurieren
- **Positive Pay:** Betrugsschutz-Service US-Banken — Bank vergleicht ausgestellte Schecks mit Datei; SAP muss Positive Pay-Datei generieren
- **MICR-Zeichen:** Spezielle Schriftart für Drucker; SAP-Formular-Konfiguration nötig

### ACH Payment Factory / SAP Treasury

Für US-Zahlungen in einer Payment-Factory-Struktur (POBO/IHB):

- **ACH-Autorisierungen (Authorization):** Für ACH Debit muss eine schriftliche oder elektronische Genehmigung des Zahlungspflichtigen vorliegen (NACHA Rules)
- **NOC (Notification of Change):** Bank schickt NOC wenn ABA oder Kontonummer veraltet — SAP muss NOC verarbeiten und Stammdaten aktualisieren
- **Return Reason Codes:** ACH-Rejects haben eigene NACHA-Return-Codes (R01–R85); SAP muss diese verarbeiten

### Typische Projektfehler USA

1. **IBAN-Feld leer/falsch:** Team pflegt IBAN-Feld für US-Lieferanten — US hat kein IBAN; Feld leer lassen oder ABA+Account in richtigen Feldern
2. **NACHA-Format nicht angepasst:** Standard-SAP-NACHA-DMEE ohne bankspezifische Anpassung — Rejects wegen Format-Fehler
3. **ACH-Autorisierung fehlt:** Erstes ACH-Debit ohne gültige Autorisierung — Return Code R10 (Customer Advises Not Authorized)
4. **Positive Pay vergessen:** Kein Positive Pay-Format für US-Schecks konfiguriert — Betrugsgefahr
5. **OFAC-Screening:** Nur EU-Sanktionsliste gescreent, nicht OFAC-SDN-Liste
6. **Thanksgiving Week:** 4. Donnerstag November + Freitag danach — De-facto 2-Tage-Pause; Lieferantenkomm. anpassen
7. **Same Day ACH Limit:** Team plant USD 500.000 Same Day ACH-Zahlung — Limit war USD 1 Mio. (seit März 2022), aber manche Banken haben tiefere eigene Limits
8. **ACH NOC-Verarbeitung:** Notification of Change nicht in SAP verarbeitet — künftige Zahlungen mit veralteten Bankdaten

---

## BLOCK 5 — Lokale Formate USA

### US-Zahlungsformate

| Format | System | Beschreibung | Status |
|---|---|---|---|
| NACHA (94-Char) | ACH | Massenzahlungen; festes Zeichenformat | Standard; aktiv |
| SWIFT MT103 | SWIFT | Auslandsüberweisungen | Abgelöst durch pacs.008 Nov. 2025 |
| pacs.008.001.09 | SWIFT ISO 20022 | Auslandsüberweisungen aktuell | Standard ab Nov. 2025 |
| Fedwire Format | Fedwire | Großbetrag-RTGS; proprietär | Übergang zu ISO 20022 läuft |
| RTP / FedNow | ISO 20022 | US Instant Payments | Wachsend |
| Image Cash Letter (ICL) | Check 21 | Elektronisches Scheckbild | Für Check-Scanning relevant |
| EDI 820 (ANSI X12) | EDI | Payment Order/Remittance Advice | In Industrien mit EDI-Infrastruktur |
| X12 835 | EDI | Healthcare Payment and Advice | Healthcare-Branche |

### Remittance Information USA

Ein kritisches Thema: Die **Übermittlung von Zahlungsreferenzen** ist in den USA weniger standardisiert als in Europa:

- ACH CCD: 1 Addenda-Record mit 80 Zeichen
- ACH CTX: Bis 9.999 Addenda-Records; EDI-formatiert (X12 820)
- Fedwire: Informationsfelder vorhanden aber begrenzt
- **ANSI ASC X12 820:** EDI-Format für Zahlungsadvice; in produzierenden Industrien verbreitet
- **820-Integration in SAP:** Über EDI-Subsystem (z.B. SAP NetWeaver PI/PO mit EDI-Adapter)

---

## BLOCK 6 — Go-Live Checkliste USA

### Vorbereitung

- [ ] US-Buchungskreis mit Hauswährung USD konfiguriert
- [ ] US-Chart of Accounts (GAAP/IFRS) aktiviert
- [ ] ABA Routing Number + Kontonummer aller US-Lieferanten im Stamm gepflegt (KEIN IBAN-Feld)
- [ ] NACHA-DMEE für ACH CCD konfiguriert; mit US-Hausbank abgestimmt
- [ ] CTX-Addenda-Records konfiguriert (falls EDI-Remittance benötigt)
- [ ] US-Fabrikkalender in SCAL: 11 Federal Holidays
- [ ] Positive Pay Format für US-Schecks konfiguriert (falls Check-Zahlungen)
- [ ] OFAC-SDN-Sanktionsliste in Screening-Lösung eingebunden
- [ ] ACH-Autorisierungen für alle ACH Debit-Empfänger dokumentiert
- [ ] Fedwire/CHIPS-Kanal mit US-Hausbank konfiguriert (für Großbetrag)
- [ ] USD/EUR Wechselkurs-Feed aktiv
- [ ] NOC-Verarbeitungsprozess definiert (wie werden NACHA-NOCs in SAP verarbeitet?)

### Produktivsetzung

- [ ] ACH-Testdatei an US-Bank gesendet und validiert
- [ ] Same Day ACH Limit mit Hausbank bestätigt (USD 1 Mio. NACHA-Standard; Hausbank-intern prüfen)
- [ ] Erster F110-ACH-Lauf; Return-Code-Verarbeitung getestet
- [ ] OFAC-Screening aktiv und nachweisbar
- [ ] Positive Pay aktiv: erste Datei nach Schecklauf gesendet

### Laufender Betrieb

- [ ] NACHA-Regeländerungen verfolgen (jährlich); NACHA-Rules-Updates einarbeiten
- [ ] FedNow / RTP: Wachstum beobachten; bei ausreichender Abdeckung als Instant-Alternative zu ACH evaluieren
- [ ] Fedwire ISO 20022 Migration: Timeline mit Hausbank abstimmen
- [ ] OFAC-Liste: Täglich aktuell halten; neue Sanktionsprogramme beobachten
- [ ] ACH Return Rate Monitoring: NACHA-Regeln begrenzen erlaubte Return-Rate (< 0,5% für ACH Debit)
- [ ] Same Day ACH: Evaluierung für zeitkritische US-Lieferantenzahlungen
