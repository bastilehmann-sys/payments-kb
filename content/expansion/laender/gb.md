---
code: GB
name: Großbritannien
complexity: high
currency: GBP
summary: Post-Brexit-Land mit vollständig eigenem Zahlungsinfrastruktur (Faster Payments, Bacs, CHAPS), kein SEPA-Zugang mehr, GBP/Nicht-EUR-Handling, hohe SAP-Komplexität durch separate Formate und Systeme.
---

# Global Payments Datenbank — Länderprofil: Großbritannien (GB)

**Stand:** April 2026 | **Quellen:** Bank of England, FCA, Pay.UK, CHAPS Company, PSR (Payment Systems Regulator) | **Komplexität:** ★★★★☆ Hoch (Score 7/10)

## BLOCK 1 — Country Master

### Grunddaten

| Eigenschaft | Wert | Quelle | Hinweis |
|---|---|---|---|
| ISO-Ländercode | GB / GBR | ISO 3166-1 | Alpha-2 / Alpha-3 |
| Währung | GBP (£) | ISO 4217 | Kein EUR! Seit 01.01.2021 kein SEPA-Zugang |
| IBAN-Format | GB + 2 + 4 Bankcode + 6 Sort Code + 8 Kontonr = 22 Stellen | Pay.UK | Sort Code ist die UK-interne Bankleitzahl |
| Sort Code | 6-stellig numerisch (XX-XX-XX) | Pay.UK | Zentrales Routing-Attribut in GB |
| BIC-Format | AAAAGB2LXXX | SWIFT | GB = Ländercode; 2L = London-Region |
| Zentralbank | Bank of England (BoE) | bankofengland.co.uk | |
| Aufsichtsbehörde | FCA (Financial Conduct Authority), PRA (Prudential Regulation Authority) | fca.org.uk | FCA = Conduct; PRA = Aufsicht unter BoE |
| Zeitzone | GMT (UTC+0) / BST (UTC+1) | | Umstellung: letzter Sonntag März/Oktober (andere Regel als EU!) |
| Besonderheit | Post-Brexit: GB ist seit 01.01.2021 kein SEPA-Mitglied mehr | | SEPA-Zahlungen sind grenzüberschreitende SWIFT-Zahlungen |
| Gläubiger-ID (CI) | ENTFÄLLT für GB — kein SEPA SDD möglich | | Für GBP-Lastschriften: Bacs Direct Debit |

### IBAN-Struktur Großbritannien

```
GB  [2 IBAN-Prüfz.]  [4 Bankcode (BIC-Präfix)]  [6 Sort Code]  [8 Kontonummer]
```

Gesamtlänge: **22 Zeichen**. WICHTIG: Obwohl GB IBAN-Format technisch existiert, wird es im **Inlandsverkehr kaum genutzt**. GB-Banken kommunizieren intern über **Sort Code + Account Number**. Für SWIFT-Auslandszahlungen nach GB: IBAN verwenden.

### Hauptbanken

- Barclays Bank (BIC: BARCGB22XXX) — Großbank; sehr guter Corporate-Treasury-Service
- HSBC UK (BIC: HBUKGB4BXXX) — International, starkes Corporate-Banking
- Lloyds Bank (BIC: LOYDGB2LXXX) — Retailfokus; Corporate-Banking
- NatWest / Royal Bank of Scotland (BIC: NWBKGB2LXXX) — Große Corporate-Bank
- Standard Chartered (BIC: SCBLGB2LXXX) — International, Trade Finance
- Santander UK (BIC: ABBYGB2LXXX) — Tochter der Santander Group
- Nationwide Building Society — Größte Bausparkasse; Corporate-Banking begrenzt
- Starling Bank / Monzo — Digitalbanken; für Corporate derzeit begrenzt

### Nationale Feiertage (England & Wales)

| Datum | Bezeichnung | Hinweis |
|---|---|---|
| 01.01 | New Year's Day | |
| Karfreitag | Good Friday | variabel |
| Ostermontag | Easter Monday | variabel; Schottland: andere Regel |
| Frühjahrs-Bank Holiday | Early May Bank Holiday | 1. Montag Mai |
| Spring Bank Holiday | variabel | letzter Montag Mai |
| Summer Bank Holiday | variabel | letzter Montag August |
| 25.12 | Christmas Day | |
| 26.12 | Boxing Day | |

**Wichtig:** Schottland und Nordirland haben abweichende Feiertage. GB hat deutlich weniger gesetzliche Feiertage (8 für England) als viele EU-Länder.

**Zeitzonendifferenz zu DE:** GMT vs. CET = 1 Stunde Differenz (Winter); BST vs. CEST = 0 Stunden (Sommer). **ACHTUNG bei Umstellungswochenenden:** GB stellt oft 1 Woche früher/später um als die EU — in diesen Wochen gilt temporär eine andere Differenz!

---

## BLOCK 2 — Regulatorik Großbritannien (Post-Brexit)

### Post-Brexit Zahlungsverkehr — Überblick

Seit dem **31.01.2020** (Brexit) und dem Ende der Übergangsperiode am **31.12.2020** ist das Vereinigte Königreich kein EU-Mitglied mehr. Die Konsequenzen für den Zahlungsverkehr sind erheblich:

| Aspekt | Vor Brexit | Nach Brexit |
|---|---|---|
| SEPA-Teilnahme | Ja (GB-Banken in STEP2) | Nein — GB ist kein SEPA-Land |
| SEPA-Überweisungen nach GB | Direktes SEPA SCT | Jetzt: SWIFT-Überweisung (grenzüberschreitend) |
| SEPA-Lastschriften von GB | SEPA SDD möglich | Nicht mehr möglich ohne IBAN aus SEPA-Raum |
| Gebühren | SEPA-Gebühren (günstig) | SWIFT-Korrespondenzgebühren (teurer) |
| EU-Datenübertragung | DSGVO | UK-GDPR (Adequacy Decision vorhanden, aber unsicher) |
| PSD2-Passporting | EU-weiter Pass | Kein EU-Passporting mehr; UK-eigenes Lizenzregime |

**Praxis-Folge:** Zahlungen von einer EU-Gesellschaft an eine GB-Gesellschaft sind **keine SEPA-Zahlungen** mehr — sie werden als SWIFT-Auslandszahlungen (SWIFT MT103 → pacs.008) abgewickelt. Dies hat direkte SAP-Auswirkungen: Zahlungsweg, Format, Gebühren, Cut-Off-Zeiten alles anders.

### FCA-Regulierung (Financial Conduct Authority)

- **Payment Services Regulations 2017 (PSRs 2017):** UK-Umsetzung der PSD2; nach Brexit weiterhin in Kraft als UK-eigenes Recht
- **Payment Services Regulations 2024 (PSR 2024):** Update; UK PSD3-Äquivalent; stärkt Open Banking und SCA-Regeln
- **Strong Customer Authentication (SCA):** In UK seit 14.03.2022 vollständig durchgesetzt
- **Open Banking UK:** Durch CMA Order 2017 vorangetrieben — 9 größte UK-Banken verpflichtet; über OBIE (Open Banking Implementation Entity) standardisiert. **Qualität:** Sehr hoch — UK gilt als Open Banking Weltmarktführer.
- **UK GDPR / Data Protection Act 2018:** Eigenes Datenschutzrecht; EU hat Adequacy Decision gewährt, aber politische Unsicherheit besteht (jederzeit widerrufbar)

### AML (UK Money Laundering Regulations 2017)

- **MLR 2017 (Money Laundering, Terrorist Financing and Transfer of Funds Regulations 2017):** Gesetzliche AML-Grundlage
- **HMRC und NCA (National Crime Agency):** Verdachtsmeldungen (SARs — Suspicious Activity Reports) an NCA
- **UBO-Register:** Companies House — Register of People with Significant Control (PSC-Register); öffentlich zugänglich
- **Bargeldobergrenze:** UK hat keine gesetzliche Bargeldobergrenze (im Gegensatz zur EU), aber Banken haben interne Schwellenwerte; HMRC überwacht über MTD (Making Tax Digital)
- **Sanctions:** UK Office of Financial Sanctions Implementation (OFSI) — eigene UK-Sanktionsliste nach Brexit (nicht mehr EU-Liste); **beide** Listen prüfen!

### CHAPS — Systemic Risk

CHAPS (Clearing House Automated Payment System) wird von der **Bank of England** direkt betrieben (seit 2017 übernommen). CHAPS ist SRVB (Systemically Important Retail Payment System) und unterliegt direkter BoE-Aufsicht nach Payment and Settlement Systems Act 2009.

---

## BLOCK 3 — Clearing & Banken Großbritannien

### Nationale Clearing-Systeme

| System | Typ | Betreiber | Währung | Beschreibung |
|---|---|---|---|---|
| Faster Payments (FPS) | Echtzeit RTGS | Pay.UK / VocaLink | GBP | 24/7 Instant Payments; Standard für Retail und Corporate |
| Bacs | ACH/DNS | Pay.UK | GBP | Direct Debit und Direct Credit; D+3 Settlement |
| CHAPS | RTGS | Bank of England | GBP | Großbetrag; same-day |
| CREST | Wertpapier-Settlement | Euroclear UK & Ireland | GBP | Wertpapierlieferung; nicht Zahlungsverkehr |
| SWIFT | Netzwerk | SWIFT | Multi | Auslandsüberweisungen; pacs.008 nach ISO 20022 |

### Faster Payments Service (FPS) — Das GB-Pendant zu SCT Inst

FPS ist seit **27. Mai 2008** in Betrieb — damit war GB **8 Jahre vor der EU** mit Echtzeit-Zahlungen live. Kernmerkmale:

- **Limit:** GBP 1.000.000 pro Zahlung (Standardlimit; bankintern teils niedriger, z.B. Barclays GBP 250.000)
- **Laufzeit:** Unter 15 Sekunden, meist unter 2 Sekunden
- **Verfügbarkeit:** 24/7/365
- **Teilnehmer (April 2026):** Über 40 Direktteilnehmer; alle Großbanken

**FPS für Corporates:** Viele UK-Corporates nutzen FPS für Lieferantenzahlungen. Limite und Verfügbarkeit mit Hausbank prüfen.

### Bacs — Direct Debit und Salary Payments

Bacs ist das primäre System für:
- **Direct Debit (DD):** Lastschriften — der UK-Standard; über 4 Milliarden Transaktionen/Jahr
- **Direct Credit (DC):** Überweisungen — Gehaltszahlungen, Rentenzahlungen
- **Vorlaufzeit:** D+3 (Einreichung T = Valuta T+3)
- **SUN (Service User Number):** Pflicht für Direct Debit — beantragt beim eigenen Sponsor-Bank; ähnlich der SEPA-Gläubiger-ID

**Bacs-Format:** `.STD18` (Standardformat, 18-Zeichen-Satzformat) oder neueres ISO 20022-basiertes Format. SAP Standard: kein fertiger Bacs-Connector; Add-On oder Custom-DMEE erforderlich.

### CHAPS — Großbetrag und Immobilien

CHAPS abwickelt täglich ca. GBP 400 Milliarden und ist primär für:
- Immobilientransaktionen (Conveyancing)
- Interbank-Settlement
- Großbetragszahlungen (typisch ab GBP 250.000)
- Staatszahlungen

**CHAPS-Cut-Off:** Kundenzahlungen bis 15:00 GMT/BST; Verarbeitung bis 17:00 GMT/BST.

### Cut-Off-Zeiten GB

| Zahlungsart | Cut-Off | Valuta | Hinweis |
|---|---|---|---|
| Faster Payments | 24/7/365 | Sofort | Standard für Corporate bis GBP 1 Mio. |
| Bacs Direct Credit | D-2 Bankarbeitstage | D+3 | Lohnläufe z.B. |
| Bacs Direct Debit | D-2 Bankarbeitstage (AUDDIS + D+3) | D | SUN erforderlich |
| CHAPS | 15:00 GMT/BST | Same Day | Großbetrag |
| SWIFT Ausland (von DE) | 14:00 CET | D+1–D+2 | GBP-SWIFT-Zahlung |

---

## BLOCK 4 — SAP-Besonderheiten Großbritannien

### Währungskonfiguration GBP

- Buchungskreis GB: Hauswährung GBP (nicht EUR)
- Wechselkurs-Management: GBP/EUR täglich aktualisieren (EZB-Referenzkurse oder Reuters-Feed)
- SAP-Währungsrisikomanagement: Hedge Accounting für GBP-Positionen relevant
- Intercompany-Zahlungen DE → GB: Fremdwährungszahlung in SAP; Wechselkursdifferenzen buchen

### Zahlungsmethoden und DMEE für GB

**Wichtig: KEIN SEPA für GB!** Zahlungen von EU nach GB = SWIFT-Auslandszahlungen.

**Für EU → GB Zahlungen (SWIFT):**
- Zahlungsmethode in FBZP: SWIFT (F oder W je nach Customizing)
- Format: pacs.008.001.09 (nach November 2025 MT-Sunset) oder SWIFT MT103 (Legacy)
- Hausbank mit SWIFT-Korrespondenz zu GB-Banken erforderlich

**Für GB-interne Zahlungen (von UK-Buchungskreis):**
- Faster Payments: Kein Standard-SAP-Format; SWIFT FIN oder proprietary H2H
- Bacs: Custom DMEE oder Add-On (Bottomline Technologies sehr stark in UK)
- CHAPS: SWIFT-basiert; über SWIFT FileAct oder H2H

**Bottomline Technologies:** Marktführer für UK-Zahlungsverkehrs-Software; sehr gut integriert mit SAP. Bei UK-Projekten immer evaluieren.

### IBAN vs. Sort Code + Account Number

- **Sort Code + Account Number:** UK-Inlandsverkehr; 6+8 Stellen
- **IBAN:** Für EU-Auslandsüberweisungen nach GB verwendet, aber UK-Banken akzeptieren intern Sort Code+Kontonummer
- SAP: Im Kreditorenstamm IBAN und Sort Code/Kontonummer parallel pflegen
- SWIFT-Nachrichten nach GB: IBAN in Field 59 (Beneficiary) und Sort Code in Field 57 (Account with Institution BIC)

### Typische Projektfehler GB

1. **SEPA für GB:** Team versucht GB-Zahlung über SEPA SCT-Weg — funktioniert nicht; GB ist kein SEPA-Land
2. **Währung:** Buchungskreis GB auf EUR belassen statt GBP — alle Buchungen falsch
3. **Sort Code vergessen:** Nur IBAN im Stamm aber kein Sort Code; manche UK-Banken brauchen beides im SWIFT-Feld
4. **Bacs SUN:** Service User Number nicht beantragt vor erstem Direct Debit → Bacs-Lauf scheitert
5. **Zeitzonen-Mismatch:** Cut-Off-Zeiten in CET (DE) für GB-Zahlungen angesetzt — aber GB ist in GMT, also 1h früher; Zahllauf zu spät
6. **UK OFSI Sanktionen:** Nur EU-Sanktionsliste gescreent, nicht UK OFSI — Compliance-Risiko
7. **Boxing Day (26.12):** Im DE-Kontext unbekannt; GB-Bank an diesem Tag geschlossen; Dezember-Zahlungsplanung anpassen

### IHB / POBO GB (Post-Brexit)

- POBO für GB-Gesellschaft aus EU: Technisch möglich, regulatorisch komplex
- UK FCA: Lizenzpflicht prüfen — zahlt die EU-Holding für UK-Gesellschaft, könnte als UK-Zahlungsdienstleistung gewertet werden
- Legal Review zwingend: UK-Anwalt einbeziehen bei POBO-Arrangements mit UK-Beteiligung
- Steuerimplikationen: HMRC prüft Intercompany-Gebühren; Transfer Pricing Documentation

---

## BLOCK 5 — Lokale Formate Großbritannien

### UK-Zahlungsformate

| Format | System | Verwendung | Status |
|---|---|---|---|
| Bacs STD18 | Bacs | Direct Debit / Direct Credit | UK-Standard für Massenzahlungen |
| SWIFT MT103 | SWIFT | Auslandszahlungen (Legacy) | Abgelöst durch pacs.008 ab Nov. 2025 |
| pacs.008.001.09 | SWIFT ISO 20022 | Auslandszahlungen aktuell | Standard ab Nov. 2025 |
| ISO 20022 (FPS) | Faster Payments | Inlandszahlungen UK | Modernisierung läuft (FPS Next Generation) |
| CREST DVP | Wertpapier | Aktien-Settlement | Nicht Zahlungsverkehr |
| MT940 / camt.053 | SWIFT / EBICS | Kontoauszug | Parallel in Übergang |

### Faster Payments Next Generation (FPNG)

Pay.UK treibt die Modernisierung von FPS auf Basis von **ISO 20022** voran (Programm "New Payments Architecture" — NPA):
- Geplanter Go-Live: 2026–2027
- Wird FPS auf vollständige ISO 20022-Basis heben
- Für Corporates: Übergangsplan mit UK-Hausbank abstimmen

### UK-spezifische Referenzfelder in SWIFT

Für Zahlungen nach GB wichtige SWIFT-Felder:

| SWIFT-Feld | Inhalt | UK-Besonderheit |
|---|---|---|
| Field 56 (Intermediary) | Korrespondenzbank | Bei kleineren UK-Banken nötig |
| Field 57 (Account with) | Empfängerbank BIC | Sort Code kann als Clearing Code angegeben werden |
| Field 59 (Beneficiary) | Empfänger + IBAN | UK-IBAN + Sort Code im Feld |
| Field 70 (Remittance) | Verwendungszweck | Max. 4 × 35 Zeichen |
| Field 71A (Charges) | Gebühren | SHA (geteilt) Standard; OUR (Auftraggeber) möglich |

---

## BLOCK 6 — Go-Live Checkliste Großbritannien

### Vorbereitung

- [ ] GB-Buchungskreis mit Hauswährung GBP konfiguriert
- [ ] GBP/EUR Wechselkurs-Feed aktiv (EZB oder Reuters)
- [ ] SWIFT-Korrespondenzbank für GBP-Zahlungen identifiziert und in SAP-Hausbank hinterlegt
- [ ] pacs.008 Format für SWIFT-Zahlungen konfiguriert (nach MT-Sunset Nov. 2025)
- [ ] IBAN + Sort Code + Kontonummer aller GB-Lieferanten im Stamm gepflegt
- [ ] GB-Fabrikkalender in SCAL: 8 nationale Feiertage inkl. Boxing Day (26.12)
- [ ] Zeitzone GMT (nicht CET) für GB-Cut-Off-Planung berücksichtigt
- [ ] UK OFSI Sanktionsliste in Screening-Lösung eingebunden (zusätzlich zu EU-Liste)
- [ ] Legal Review POBO/IHB: UK-Anwalt bei GB-Einbeziehung
- [ ] Bacs SUN (Service User Number) beantragt falls Bacs Direct Debit nötig

### Produktivsetzung

- [ ] Testübertragung SWIFT pacs.008 nach GB-Bank erfolgreich
- [ ] CHAPS-Testzahlung (falls Großbetrag-Szenario) validiert
- [ ] Faster Payments über UK-Buchungskreis / UK-Hausbank getestet
- [ ] GBP-Kontoauszug (camt.053 oder MT940) empfangen und korrekt verbucht
- [ ] Wechselkursbuchung Intercompany DE → GB korrekt

### Laufender Betrieb

- [ ] OFSI-Sanktionsliste regelmäßig aktualisieren (UK-eigene Liste, unabhängig von EU)
- [ ] FPS Next Generation (NPA): Entwicklung beobachten; ISO 20022 Migration für UK-interne Zahlungen planen
- [ ] UK GDPR Adequacy Decision: Politische Entwicklung beobachten; Datentransfer-Basis sicherstellen
- [ ] Jährlich: Fabrikkalender aktualisieren (Bank Holidays werden von UK-Regierung festgesetzt)
- [ ] EBICS für UK: Nicht Standard; SWIFT oder proprietäres H2H als Alternative
