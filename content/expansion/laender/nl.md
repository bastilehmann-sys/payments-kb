---
code: NL
name: Niederlande
complexity: low
currency: EUR
summary: Hochentwickeltes SEPA-Land mit iDEAL als dominierendem Online-Zahlungsinstrument, sehr effizienter Infrastruktur und geringem SAP-Projektaufwand — gilt als Payment-Innovation-Hub Europas.
---

# Global Payments Datenbank — Länderprofil: Niederlande (NL)

**Stand:** April 2026 | **Quellen:** De Nederlandsche Bank (DNB), AFM, Betaalvereniging Nederland, Currence | **Komplexität:** ★★☆☆☆ Niedrig (Score 3/10)

## BLOCK 1 — Country Master

### Grunddaten

| Eigenschaft | Wert | Quelle | Hinweis |
|---|---|---|---|
| ISO-Ländercode | NL / NLD | ISO 3166-1 | Alpha-2 / Alpha-3 |
| Währung | EUR (€) | ISO 4217 | Eurozone seit 01.01.1999 |
| IBAN-Format | NL + 2 + 4 Bankcode + 10 Kontonr = 18 Stellen | DNB | Kürzeste IBAN im SEPA-Raum |
| BIC-Format | AAAANLBBXXX | SWIFT | NL = Ländercode |
| Zentralbank | De Nederlandsche Bank (DNB) | dnb.nl | Eurosystem-Mitglied, NCB |
| Aufsichtsbehörde | DNB (Prudential), AFM (Conduct) | dnb.nl / afm.nl | Duales Aufsichtsmodell |
| Zeitzone | CET (UTC+1) / CEST (UTC+2) | | Gleich wie DE |
| Sprache | Niederländisch | | Englisch als Businesssprache sehr weit verbreitet |
| Gläubiger-ID (CI) | NL + 2 + ZZZ + 11-stellige CI | DNB | Bei DNB beantragen |

### IBAN-Struktur Niederlande

```
NL  [2 Prüfziffern]  [4 Bankcode]  [10 Kontonummer]
```

Gesamtlänge: **18 Zeichen** — eine der kürzesten IBANs im SEPA-Raum. Der 4-stellige Bankcode entspricht den ersten 4 Buchstaben des BIC (z.B. ABNA für ABN AMRO, RABO für Rabobank).

### Hauptbanken

- ING Bank N.V. (BIC: INGBNL2AXXX) — größte NL-Bank; führend im Corporate-Treasury; sehr gutes EBICS und API-Angebot
- ABN AMRO Bank N.V. (BIC: ABNANL2AXXX) — starke Corporate-Banking-Tradition; Clearing-Partner für viele multinationale Konzerne
- Rabobank (BIC: RABONL2UXXX) — Genossenschaftsbank; sehr stark in Agrar und Nahrungsmittel; Cooperatief-Struktur
- Triodos Bank (BIC: TRIONL2UXXX) — Nachhaltigkeitsfokus; für ESG-Konzerne relevant
- de Volksbank / SNS (BIC: SNSBNL2AXXX) — staatlicher Anteilseigner; Retailfokus
- Bunq — Digitalbank; innovatives API-Angebot; Corporate-Produkte wachsend

### Nationale Feiertage

| Datum | Bezeichnung | Hinweis |
|---|---|---|
| 01.01 | Nieuwjaarsdag | |
| Karfreitag | Goede Vrijdag | Bankfeiertag, nicht gesetzlich |
| Ostersonntag | Eerste Paasdag | Bankfeiertag |
| Ostermontag | Tweede Paasdag | |
| 27.04 | Koningsdag (Königstag) | NICHT in DE! — WICHTIG |
| Himmelfahrt | Hemelvaartsdag | |
| Pfingstsonntag | Eerste Pinksterdag | Bankfeiertag |
| Pfingstmontag | Tweede Pinksterdag | |
| 25.12 | Eerste Kerstdag | |
| 26.12 | Tweede Kerstdag | |

**Koningsdag (27.04.):** Niederländischer Nationalfeiertag — Geburtstag von König Willem-Alexander. Einer der bedeutendsten NL-Feiertage; vollständiger Bankfeiertag. In SAP-Fabrikkalender unbedingt einpflegen!

---

## BLOCK 2 — Regulatorik Niederlande

### PSD2-Umsetzung (Wet betaaldiensten / Wft)

Die PSD2 wurde in den Niederlanden durch Änderungen des **Wet op het financieel toezicht (Wft)** und des **Wet handhaving consumentenbescherming** umgesetzt:

- **Starke Kundenauthentifizierung (SCA):** Vollständig umgesetzt; NL-Banken (besonders ING und ABN AMRO) waren europäische Vorreiter bei PSD2-konformer SCA
- **Open Banking NL:** NL gilt als europäischer Open Banking Vorreiter — ING und ABN AMRO haben exzellente PSD2-APIs; Rabobank solide. Das NL-Ökosystem hat viele FinTech-Integratoren (Adyen, Mollie, Stripe NL alle in Amsterdam).
- **POBO in NL:** Zulässig und gut etabliert; schriftliche Vereinbarung mit NL-Hausbank; DNB hat keine speziellen POBO-Restriktionen für EU-Konzerne
- **PSD3 (2026/2027):** IBAN-Namensabgleich bereits pilotiert in NL — ING und ABN AMRO sind Vorreiter bei Confirmation of Payee (CoP) in NL. IBAN-Name Check wurde in NL bereits als freiwilliger Service eingeführt.

### AML (Wwft — Wet ter voorkoming van witwassen en financieren van terrorisme)

- **Wwft (2008, letzte Novelle 2023):** NL-AML-Gesetz; Umsetzung EU-AML-Richtlinien
- **FIU-Nederland:** NL-Financial Intelligence Unit; Meldungen bei FIU-NL
- **UBO-Register:** Handelsregister (Kamer van Koophandel — KvK) führt UBO-Register; nach CJEU-Urteil (2022) eingeschränkte öffentliche Zugänglichkeit
- **Bargeldobergrenze:** EUR 3.000 für Bargeldgeschäfte zwischen Unternehmen (ab 2021); strenger als EU-Standard
- **NL-Banken und AML:** ING hat 2018 EUR 775 Mio. AML-Strafzahlung geleistet — seitdem extrem strenge interne AML-Kontrollen; KYC-Prozess bei ING sehr aufwändig

### Steuer-IDs Niederlande

| ID | Format | Bedeutung | SAP-Feld |
|---|---|---|---|
| KvK-Nummer | 8-stellig numerisch | Handelsregisternummer | STCD1 |
| RSIN | 9-stellig numerisch | Rechtspersonen-ID (steuerlich) | STCD2 |
| BTW-nummer (NL-USt-ID) | NL + 9-stellig + B + 2-stellig = NL999999999B01 | EU-USt-ID | STCEG |
| BSN | 9-stellig (nur Privatpersonen) | Bürgerservicenummer | (nicht Corp.) |

**BTW-Nummer:** Format ist NL + 9 + B + 2 — der Buchstabe "B" und die zweistellige Suffix-Nummer nach dem RSIN sind charakteristisch für NL und werden oft falsch im SAP-Stamm erfasst.

---

## BLOCK 3 — Clearing & Banken Niederlande

### Nationale Clearing-Systeme

| System | Typ | Betreiber | Währung | Besonderheit |
|---|---|---|---|---|
| iDEAL | Instant/Online | Currence | EUR | NL-spezifisches Online-Banking-Zahlungssystem |
| STEP2 | ACH/DNS | EBA Clearing | EUR | Paneuropäisches SEPA |
| TARGET2 / T2 | RTGS | EZB / DNB | EUR | Großbetrag |
| TIPS | Instant RTGS | EZB | EUR | SCT Inst |
| Equens / Worldline | ACH | Worldline (Equens-Nachfolger) | EUR | NL-Domestic-Processor; Teil Worldline-Gruppe |

### iDEAL — Das niederländische Zahlungswunder

**iDEAL** ist das bekannteste NL-Zahlungssystem und eines der erfolgreichsten nationalen Online-Zahlungssysteme weltweit:

- **Betreiber:** Currence (Gemeinschaftsunternehmen NL-Banken)
- **Marktanteil NL (2024):** Ca. 70% aller Online-Zahlungen in NL laufen über iDEAL
- **Volumen:** Über 1,5 Milliarden Transaktionen/Jahr (2024)
- **Funktionsweise:** Verbraucher wählt iDEAL, wird zu Online-Banking der eigenen Bank weitergeleitet, authentifiziert sich, zahlt sofort (SEPA SCT Inst im Hintergrund)
- **iDEAL 2.0 (ab 2025):** Vereinheitlichtes API-System; Open Banking-Standard; erleichtert Integration für Händler

**Für Corporates:**
- iDEAL ist ein **B2C-Instrument** — Verbraucher zahlen an Unternehmen
- Für B2B-Zahlungen irrelevant; Standard SEPA SCT wird genutzt
- NL-E-Commerce: Ohne iDEAL verliert man in NL ca. 70% der Online-Conversion

**SAP-Integration iDEAL:**
- Kein Standard-SAP-Connector für iDEAL
- Integration über Payment Service Provider (PSP) wie Adyen (Amsterdam!), Mollie oder Stripe
- Im SAP-Zahlungsverarbeitungskontext: iDEAL-Eingänge als SEPA SCT Inst verbuchen (camt.054)

### Cut-Off-Zeiten Niederlande

| Zahlungsart | Cut-Off | Valuta |
|---|---|---|
| SEPA SCT | 15:00 CET | D+1 |
| SEPA SCT Inst | 24/7/365 | Sofort |
| SEPA SDD CORE RCUR | D-2 Bankarbeitstage | D |
| T2 Dringend | 17:00 CET | D |
| iDEAL | Echtzeit | Sofort |

---

## BLOCK 4 — SAP-Besonderheiten Niederlande

### Customizing-Hotspots

**FBZP Zahlungsmethoden NL:**
- Zahlungsmethode "T" oder "B": SEPA CT — identisch zu DE-Konfiguration
- Zahlungsmethode "D": SEPA SDD Core
- iDEAL: Kein SAP-Standard; nur relevant für AR/Incoming-Zahlungen über PSP

**Bankkanal:**
- EBICS: ING, ABN AMRO, Rabobank — alle mit EBICS 3.0
- ING Connect: ING-eigene API-Plattform (exzellent); für multinationale ING-Kunden
- ABN AMRO API Gateway: Gut dokumentiert; für Treasury-Integration

**BTW-Nummer in SAP:**
- Kreditorenstamm (LFA1): STCEG = BTW-Nummer (NL999999999B01)
- Custom Validation: BTW-Format (NL + 9 + B + 2) prüfen — SAP prüft nicht automatisch
- KvK-Nummer als STCD1 erfassen

### Typische Projektfehler Niederlande

1. **Koningsdag (27.04.):** Nicht im SAP-Fabrikkalender — vollständiger Bankfeiertag; Zahlungen verspätet
2. **BTW-Nummer Format:** Das "B" und die zweistellige Endung werden oft falsch erfasst (z.B. NL123456789 statt NL123456789B01)
3. **iDEAL-Erwartung:** Team erwartet iDEAL als Zahlungsausgang — iDEAL ist nur für Zahlungseingang (Konsument → Unternehmen)
4. **KvK-Nummer vergessen:** Handelsregisternummer nicht im Stamm — für NL-Vertragsunterlagen und steuerliche Dokumente gebraucht
5. **ING AML-Intensität:** ING führt sehr intensive KYC-Prüfungen durch; Kontoeröffnung und Onboarding dauern länger als erwartet

### IHB / POBO NL

- POBO in NL: Gut etabliert; DNB unterstützt POBO in Konzernstrukturen
- NL-Holding als POBO-Zentrale sehr verbreitet (Amsterdam ist beliebter Standort für Europa-Holdings)
- UltmtDbtr in pain.001: BTW-Nummer der NL-Tochter bei POBO
- Steuerliche Vorteile NL-Holding: Tax ruling möglich (APA/ATR) — Treasury prüft NL-Strukturen häufig als IHB-Standort

---

## BLOCK 5 — Lokale Formate Niederlande

### SEPA-Formate (Standard)

| Format | Verwendung |
|---|---|
| pain.001.001.03 / .09 | SEPA SCT (Standard) |
| pain.008.001.02 | SEPA SDD |
| pain.002.001.03 | Zahlungsstatus |
| camt.053 | Kontoauszug (bevorzugt) |
| camt.052 | Intraday |
| camt.054 | Buchungsbenachrichtigung (für iDEAL-Eingänge) |

### NL-Spezifische Aspekte

| Aspekt | Beschreibung |
|---|---|
| iDEAL-Eingänge | Kommen als SEPA SCT Inst; in SAP via camt.054 verbuchen |
| Acceptgiro | Altformat für Rechnungszahlungen; vollständig durch SEPA ersetzt |
| PIN/Bancontact | Kartenzahlung an POS; für Zahlungseingang relevant, nicht Treasury |
| Tikkie | P2P-Zahlungsapp auf iDEAL-Basis; für Corporate irrelevant |

---

## BLOCK 6 — Go-Live Checkliste Niederlande

### Vorbereitung

- [ ] KvK-Nummer und BTW-Nummer (NL999999999B01) aller NL-Lieferanten im Stamm
- [ ] BTW der eigenen NL-Gesellschaft in T001/OBY6
- [ ] Gläubiger-ID (CI) bei DNB beantragt (falls SDD)
- [ ] EBICS mit NL-Hausbank (ING/ABN AMRO/Rabobank) konfiguriert
- [ ] NL-Fabrikkalender in SCAL: 10 Feiertage inkl. Koningsdag (27.04.)
- [ ] pain.001-Format konfiguriert (identisch DE)
- [ ] camt.054 für iDEAL-Eingänge konfiguriert (falls B2C)

### Produktivsetzung

- [ ] Testübertragung EBICS erfolgreich
- [ ] pain.001-Testdatei validiert
- [ ] camt.053 empfangen und verbucht

### Laufender Betrieb

- [ ] iDEAL 2.0 Update (2025): Händler-API-Integration aktualisieren falls relevant
- [ ] IBAN-Namensabgleich (CoP): ING/ABN AMRO führen CoP ein — PSD3-Vorbereitung
- [ ] Koningsdag jährlich im Zahlungsplan berücksichtigen (Ende April: großes NL-Volumen)
