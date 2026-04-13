---
code: BE
name: Belgien
complexity: medium
currency: EUR
summary: SEPA-Land mit mehrsprachiger Besonderheit (Niederländisch/Französisch/Deutsch), Bancontact als dominantes Kartensystem, NBB als Clearing-Betreiber, mittlere Komplexität durch tri-linguale Anforderungen.
---

# Global Payments Datenbank — Länderprofil: Belgien (BE)

**Stand:** April 2026 | **Quellen:** Nationale Bank van België / Banque Nationale de Belgique (NBB/BNB), FSMA, CEC/CPA, Febelfin | **Komplexität:** ★★★☆☆ Mittel (Score 4/10)

## BLOCK 1 — Country Master

### Grunddaten

| Eigenschaft | Wert | Quelle | Hinweis |
|---|---|---|---|
| ISO-Ländercode | BE / BEL | ISO 3166-1 | Alpha-2 / Alpha-3 |
| Währung | EUR (€) | ISO 4217 | Eurozone seit 01.01.1999 |
| IBAN-Format | BE + 2 + 3 Bankcode + 7 Kontonr + 2 Prüfziffern = 16 Stellen | NBB/BNB | Zweitkürzeste IBAN neben NL (18) |
| BIC-Format | AAAABEBBBBB | SWIFT | BE = Ländercode |
| Zentralbank | Nationale Bank van België / Banque Nationale de Belgique (NBB/BNB) | nbb.be | Eurosystem-Mitglied; NBB ist zugleich Clearing-Betreiber |
| Aufsichtsbehörde | NBB/BNB (Prudential), FSMA (Conduct) | nbb.be / fsma.be | FSMA = Finanzielle Dienstleistungen und Märkte |
| Zeitzone | CET (UTC+1) / CEST (UTC+2) | | Gleich wie DE |
| Amtssprachen | Niederländisch (Flämisch), Französisch, Deutsch | | 3 Amtssprachen — relevant für Kommunikation |
| Gläubiger-ID (CI) | BE + 2 + ZZZ + 11-stellige CI | NBB/BNB | Bei NBB/BNB beantragen |

### IBAN-Struktur Belgien

```
BE  [2 Prüfziffern]  [3 Bankcode]  [7 Kontonummer]  [2 nationale Prüfziffern]
                                                        ^
                          (Belgische interne Prüfziffer, Modulo 97)
```

Gesamtlänge: **16 Zeichen** — sehr kurze IBAN. Die letzten 2 Ziffern der IBAN (Positionen 15–16) sind die nationalen belgischen Prüfziffern (nicht identisch mit den IBAN-Prüfziffern in Positionen 3–4).

**Belgische Kontonummer-Format (historisch):**
```
XXX-YYYYYYY-ZZ
3 Bankcode + 7 Kontonummer + 2 Prüfziffern
```

### Mehrsprachigkeit — Besonderheit Belgien

Belgien hat **drei Amtssprachen**, was für Zahlungsverkehr und SAP-Projekte besondere Anforderungen stellt:

| Region | Sprache | Relevanz |
|---|---|---|
| Flandern (Norden) | Niederländisch (Flämisch) | Bevölkerungsmehrheit; wirtschaftlich stärker |
| Wallonien (Süden) | Französisch | Industrie traditionell stark |
| Brüssel (Hauptstadt) | Beide (offiziell); de facto Französisch dominant | EU-Institutionen; internationale Business |
| Ostbelgien | Deutsch | Kleine deutsche Gemeinschaft |

**Praktische Konsequenz:** Bankverträge, KYC-Unterlagen, Steuerformulare können je nach Sitz der BE-Gesellschaft auf Flämisch oder Französisch ausgestellt werden. SAP-Texte/Formulare ggf. in beiden Sprachen konfigurieren.

### Hauptbanken

- BNP Paribas Fortis (BIC: GEBABEBB) — größte BE-Bank; Teil BNP Paribas-Gruppe; sehr gutes Corporate Banking
- KBC Group (BIC: KREDBEBB) — stark in Flandern; Corporate Banking gut
- ING Belgium (BIC: BBRUBEBB) — Teil ING-Gruppe; Corporate Treasury exzellent
- Belfius Bank (BIC: GKCCBEBB) — ehemals Dexia; staatlicher Anteilseigner; öffentliche Auftraggeber
- Argenta (BIC: ARSPBE22) — Retailfokus; weniger Corporate
- Triodos Bank Belgium — Nachhaltigkeitsfokus
- Nagelmackers — Privatbank; Wealth Management

### Nationale Feiertage

| Datum | Bezeichnung (NL / FR) | National | Hinweis |
|---|---|---|---|
| 01.01 | Nieuwjaar / Jour de l'An | Ja | |
| Ostermontag | Paasmaandag / Lundi de Pâques | Ja | |
| 01.05 | Dag van de Arbeid / Fête du Travail | Ja | |
| Himmelfahrt | Hemelvaart / Ascension | Ja | |
| Pfingstmontag | Pinkstermaandag / Lundi de Pentecôte | Ja | |
| 21.07 | Nationale Feestdag / Fête Nationale | Ja | NICHT in DE! Belgischer Nationalfeiertag |
| 15.08 | Onze-Lieve-Vrouw Hemelvaart / Assomption | Ja | NICHT in DE! |
| 01.11 | Allerheiligen / Toussaint | Ja | NICHT in DE! |
| 11.11 | Wapenstilstand / Armistice | Ja | NICHT in DE! |
| 25.12 | Kerstmis / Noël | Ja | |

**Wichtig:** Belgien hat **10 nationale Feiertage** — davon 4 die es in Deutschland nicht gibt. Der **21.07 (Fête Nationale)** ist besonders wichtig — größter Nationalfeiertag BE.

---

## BLOCK 2 — Regulatorik Belgien

### PSD2-Umsetzung (Loi du 11 mars 2018 / Wet van 11 maart 2018)

Die PSD2 wurde durch das **Gesetz vom 11. März 2018 über den Status und die Kontrolle der Zahlungsinstitute** (sowohl auf Flämisch als auch auf Französisch) umgesetzt:

- **Zuständigkeit:** NBB/BNB für Prudential; FSMA für Conduct und Verbraucherschutz
- **SCA in BE:** Vollständig umgesetzt; BE-Banken waren EU-weit unter den ersten mit konformer SCA-Implementierung
- **Open Banking BE:** Qualität variiert; BNP Paribas Fortis, KBC und ING Belgium haben gute APIs; Belfius eher mittelmäßig
- **POBO in BE:** Zulässig; schriftliche Vereinbarung mit BE-Hausbank. NBB/BNB hat keine spezifischen POBO-Restriktionen für EU-Konzerne. Brüssel als EU-Hauptstadt macht BE beliebt als POBO-Zentrale.
- **itsme-Integration:** itsme® ist das belgische digitale Identitätssystem (ähnlich der deutschen eID) — für Open Banking-Authentifizierung in BE genutzt

### AML (Wet van 18 september 2017 / Loi du 18 septembre 2017)

- **Gesetz vom 18. September 2017:** BE-AML-Gesetz; Umsetzung EU-AML-Richtlinien
- **CFI (Cel voor Financiële Informatieverwerking / CTIF-CFI):** Belgische FIU; Verdachtsmeldungen bei CTIF-CFI
- **UBO-Register:** Belgisches UBO-Register (Ultimate Beneficial Owner Register) beim FPS Finance; verpflichtend für alle BE-Gesellschaften
- **Bargeldobergrenze:** EUR 3.000 für Bargeldgeschäfte im Geschäftsverkehr (strenger als EU-Standard)
- **Fiskalische Transparenz:** BE-Steueramt (FPS Finances / FOD Financiën) hat Meldesysteme für Zinseinnahmen und bestimmte Zahlungen

### Steuer-IDs Belgien

| ID | Format | Bedeutung | SAP-Feld |
|---|---|---|---|
| KBO/BCE-Nummer | BE + 10-stellig | Unternehmens-Registernummer (Kruispuntbank van Ondernemingen / Banque-Carrefour des Entreprises) | STCD1 |
| BTW/TVA-Nummer | BE + 10-stellig | EU-USt-ID | STCEG |
| Rijksregisternummer / Numéro de registre national | 11-stellig | Personennummer (nur Privatpersonen) | (nicht Corp.) |

**KBO/BCE-Nummer:** Einheitliche Unternehmens-Identifikationsnummer in Belgien — wird für alle behördlichen Zwecke genutzt. Format: BE0123456789 (mit vorangestelltem BE für EU-USt-ID = BTW/TVA-Nummer).

**Besonderheit:** KBO-Nummer und BTW-Nummer sind in BE identisch (BE + 10 Ziffern). Das vereinfacht SAP-Konfiguration (STCD1 und STCEG identisch).

### DORA / NIS2 (BE-Umsetzung)

- DORA direkt anwendbar ab 17.01.2025
- NIS2: In BE umgesetzt durch **Loi du 26 avril 2024 établissant un cadre pour la cybersécurité des réseaux et des systèmes d'information** (NIS2-Transpositionsgesetz)
- CCN (Centre for Cybersecurity Belgium): Belgische Cybersecurity-Behörde; NBB koordiniert für Finanzsector

---

## BLOCK 3 — Clearing & Banken Belgien

### Nationale Clearing-Systeme

| System | Typ | Betreiber | Währung | Besonderheit |
|---|---|---|---|---|
| CEC (Centre d'Échange et de Compensation) | ACH/DNS | NBB/BNB | EUR | BE-nationales Retail-Clearing; Betreiber ist die Zentralbank selbst |
| STEP2 | ACH/DNS | EBA Clearing | EUR | Paneuropäisches SEPA |
| TARGET2 / T2 | RTGS | EZB / NBB | EUR | Großbetrag |
| TIPS | Instant RTGS | EZB | EUR | SCT Inst |

**CEC (Centre d'Échange et de Compensation):** Ungewöhnlich — in BE betreibt die **Zentralbank (NBB/BNB) selbst** das nationale Retail-Clearing. CEC ist SEPA-kompatibel und verarbeitet alle BE-SEPA-Transaktionen. Direkte NBB-Beteiligung gibt dem System besondere regulatorische Stabilität.

### Bancontact — Das belgische Kartensystem

**Bancontact** ist das belgische Debitkartensystem und das meistgenutzte Zahlungsmittel in Belgien:

- **Betreiber:** Bancontact Company
- **Marktanteil:** Dominierend an belgischen POS-Terminals und im E-Commerce
- **Payconiq by Bancontact:** Mobile Payment App auf Bancontact-Basis; für Zahlungseingang relevant
- **Bancontact Online:** E-Commerce-Integration; neben iDEAL (NL) eines der stärksten nationalen Online-Systeme Europas
- **Für Corporate-Treasury:** Bancontact ist ein Zahlungseingangs-Instrument (B2C); für B2B-Zahlungsverkehr irrelevant

### Febelfin — BE-Bankenverband

**Febelfin** (Federatie van de Belgische financiële sector) ist der belgische Bankenverband:
- Gibt Empfehlungen für Zahlungsstandards in BE heraus
- Koordiniert SEPA-Migrations-Updates für den BE-Markt
- Fördert Open Banking und ISO 20022 Adoption

### Cut-Off-Zeiten Belgien

| Zahlungsart | Cut-Off | Valuta |
|---|---|---|
| SEPA SCT | 15:00 CET | D+1 |
| SEPA SCT Inst | 24/7/365 | Sofort |
| SEPA SDD CORE RCUR | D-2 Bankarbeitstage | D |
| T2 Dringend | 17:00 CET | D |

---

## BLOCK 4 — SAP-Besonderheiten Belgien

### Customizing-Hotspots

**FBZP Zahlungsmethoden BE:**
- SEPA CT und SDD: identisch zu DE-Konfiguration
- Keine nationalen Sonderformate wie FR (LCR) oder ES (Bizum)

**KBO/BTW in SAP:**
- Kreditorenstamm (LFA1): STCD1 = KBO-Nummer (10-stellig ohne BE-Präfix); STCEG = BE + KBO (=BTW-Nr.)
- Eigene BE-Gesellschaft: T001-STCEG = BTW-Nummer
- Custom Validation: KBO-Prüfziffer-Algorithmus (Modulo 97) prüfen

**Mehrsprachige Formulare:**
- SAP-Zahlungsformulare (Zahlungsavis) ggf. in Niederländisch und Französisch konfigurieren
- Flämische BE-Gesellschaft: NL-Texte bevorzugt
- Wallonische BE-Gesellschaft: FR-Texte bevorzugt
- Brüssel: Beide Sprachen typisch

**Bankkanal BE:**
- EBICS: BNP Paribas Fortis, ING Belgium, KBC — Standard
- Isabel/Ponto: Isabel ist das BE-eigenständige Multibank-Online-Banking-System; Ponto ist die API-Nachfolgelösung — für kleinere BE-Gesellschaften ohne EBICS

**Isabel / Ponto:**
- **Isabel** (isabel.eu): Traditionelle Multibank-Plattform in BE; ermöglicht mehrere BE-Banken in einer Oberfläche
- **Ponto** (myponto.com): Moderne API-Plattform; PSD2-basiert; Isabel-Nachfolger für digitale Integration
- **SAP-Integration Isabel:** SAP Add-On oder Custom-Connector nötig; nicht EBICS-basiert

### Typische Projektfehler Belgien

1. **21.07 (Fête Nationale):** Nicht im SAP-Fabrikkalender — vollständiger Bankfeiertag
2. **KBO-Format:** KBO-Nummer mit 0 am Anfang (0123456789 statt 123456789) — Validierungsprobleme
3. **Zweisprachige Kommunikation:** Standardbriefe nur auf Englisch — BE-Lieferanten aus Wallonien bevorzugen Französisch
4. **Isabel vs. EBICS:** Team konfiguriert EBICS, aber BE-Hausbank bietet nur Isabel-Kanal an → Add-On erforderlich
5. **Bancontact-Eingänge:** Bancontact-Kartenzahlungen laufen über PSP, nicht direkt als SEPA-Buchung; Verbuchungslogik abweichend

### IHB / POBO Belgien

- BE ist beliebter Standort für EU-Holding-Strukturen (EU-Institutionen in Brüssel; gutes Steuernetz)
- POBO aus BE-IHB sehr verbreitet; NBB hat keine Sonderhürden
- Bei POBO: UltmtDbtr + KBO der zahlenden BE-Gesellschaft in pain.001
- Belgian Coordination Center (historisch): Steuerstruktur für multinationale Treasury-Zentren in BE — heute weitgehend durch ATAD-Richtlinie begrenzt

---

## BLOCK 5 — Lokale Formate Belgien

### SEPA-Formate (Standard)

| Format | Verwendung |
|---|---|
| pain.001.001.03 / .09 | SEPA SCT |
| pain.008.001.02 | SEPA SDD |
| pain.002.001.03 | Zahlungsstatus |
| camt.053 | Kontoauszug |
| camt.052 | Intraday |

### BE-Spezifische Systeme

| System | Beschreibung | Corporate-Relevanz |
|---|---|---|
| Bancontact | Debitkartensystem; POS und Online | Zahlungseingang B2C; nicht B2B |
| Payconiq by Bancontact | Mobile Payment | B2C Zahlungseingang |
| Isabel 6 | Multibank-Online-Banking-Plattform | Bankkanal für Corporate ohne EBICS |
| Ponto | API-Bankzugang (PSD2-basiert) | Alternative zu Isabel für Integration |
| CODA-Format | Belgisches elektronisches Kontoauszug-Format | Legacy; wird durch camt.053 abgelöst |

**CODA-Format:**
Das belgische **CODA** (Coded Statement of Account) ist das traditionelle BE-Kontoauszug-Format. Es wird von den meisten BE-Banken noch parallel zu camt.053 unterstützt, ist aber formal durch ISO 20022 abgelöst. SAP: camt.053 bevorzugen; CODA nur wenn camt.053 nicht verfügbar.

---

## BLOCK 6 — Go-Live Checkliste Belgien

### Vorbereitung

- [ ] KBO-Nummer (10-stellig) und BTW-Nummer (BE + 10) aller BE-Lieferanten in Kreditorenstamm
- [ ] BTW der eigenen BE-Gesellschaft in T001/OBY6
- [ ] Gläubiger-ID (CI) bei NBB/BNB beantragt (falls SDD)
- [ ] EBICS mit BE-Hausbank (BNP PF / ING BE / KBC) konfiguriert; alternativ Isabel/Ponto evaluiert
- [ ] BE-Fabrikkalender in SCAL: 10 Feiertage inkl. 21.07, 15.08, 01.11, 11.11
- [ ] Mehrsprachige Formularkonfiguration: NL und FR Texte wo relevant
- [ ] UBO-Register NBB/BNB: Wirtschaftlich Berechtigte aller BE-Gesellschaften eingetragen
- [ ] KBO-Prüfziffer-Validierung in SAP implementiert

### Produktivsetzung

- [ ] Testübertragung EBICS / Isabel erfolgreich
- [ ] pain.001-Testdatei validiert
- [ ] camt.053 (oder CODA) von BE-Bank empfangen und korrekt verbucht
- [ ] BTW-Übermittlung in pain.001 verifiziert

### Laufender Betrieb

- [ ] Isabel → Ponto Migration: Neuinstallationen auf Ponto-API setzen
- [ ] CODA-Auszüge: Schrittweise Migration auf camt.053
- [ ] Bancontact-Eingänge: Verbuchungslogik über PSP-Auszug abstimmen
- [ ] 21.07 und 15.08 jährlich im Zahlungsplan vorplanen
- [ ] NIS2-Compliance: CCN-Anforderungen für BE-Gesellschaft prüfen
