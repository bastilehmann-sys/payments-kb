---
code: DE
name: Deutschland
complexity: low
currency: EUR
summary: Hochstandardisiertes SEPA-Land, vollständig ISO 20022-kompatibel, EBICS als dominanter Bankkanal — geringer Projektaufwand durch einheitliche Infrastruktur.
---

# Global Payments Datenbank — Länderprofil: Deutschland (DE)

**Stand:** April 2026 | **Quellen:** Deutsche Bundesbank, BaFin, EPC, DZ Bank, EBICS-Gesellschaft | **Komplexität:** ★☆☆☆☆ Niedrig (Score 3/10)

## BLOCK 1 — Country Master

### Grunddaten

| Eigenschaft | Wert | Quelle | Hinweis |
|---|---|---|---|
| ISO-Ländercode | DE / DEU | ISO 3166-1 | Alpha-2 / Alpha-3 |
| Währung | EUR (€) | ISO 4217 | Eurozone-Mitglied seit 01.01.1999 |
| IBAN-Format | DE + 2 Prüfziffern + 8 BLZ + 10 Kontonr = 22 Stellen | Bundesbank | Längste IBAN-Nummer unter den einfachen SEPA-Ländern |
| BIC-Format | 8 oder 11 Zeichen — AAAADEBBXXX | SWIFT | DE = Ländercode |
| Zentralbank | Deutsche Bundesbank | bundesbank.de | Eurosystem-Mitglied, NCB |
| Aufsichtsbehörde | BaFin (Finanzaufsicht), Bundesbank (Bankenaufsicht) | bafin.de | Gemeinsame Aufsicht nach ZAG / KWG |
| Zeitzone | CET (UTC+1) / CEST (UTC+2) | | Umstellung letzter Sonntag März/Oktober |
| Fabrikkalender | 9 gesetzliche Feiertage national + bis zu 4 regional | | Bayern: 13, Brandenburg: 9 |
| Gläubiger-ID (CI) | DE + 2 Prüfziffern + ZZZ + 11-stellige CI | Bundesbank | Für SEPA SDD; bei Bundesbank beantragen |

### IBAN-Struktur

```
DE  [2 Prüfziffern]  [8 Bankleitzahl]  [10 Kontonummer]
 ^        ^^               ^^^^^^^^          ^^^^^^^^^^
 Ländercode  Prüfsumme (ISO 7064 MOD97-10)  Kontonr. linksbündig mit Nullen aufgefüllt
```

Gesamtlänge: **22 Zeichen**. Die Bankleitzahl (BLZ) ist das Kernidentifikationsmerkmal; sie ist kein direktes Routing-Attribut mehr, aber historisch in vielen Systemen verankert.

### Hauptbanken

- Deutsche Bank AG (BIC: DEUTDEFFXXX) — größte deutsche Privatbank, starker Corporate-Treasury-Service
- Commerzbank AG (BIC: COBADEFFXXX) — Mittelstandsbank, starker EBICS-Support
- DZ BANK AG (BIC: GENODEFFXXX) — Zentralinstitut der Volksbanken/Raiffeisenbanken
- Landesbank Baden-Württemberg (BIC: SOLADEST600) — größte Landesbank
- UniCredit Bank AG / HypoVereinsbank (BIC: HYVEDEMM) — Teil UniCredit-Gruppe
- KfW Bankengruppe (BIC: KFWIDEFF) — Förderbank, für Förderkredite relevant
- ING-DiBa AG — Online-Fokus, aber Corporate-Produkte verfügbar
- Santander Consumer Bank — Teils Corporate relevant
- Sparkassen und Volksbanken — über DZ BANK / Deka als Zentrale erreichbar

### Nationale Feiertage (gesetzlich)

| Datum | Bezeichnung | National? | Besonderheit |
|---|---|---|---|
| 01.01 | Neujahr | Ja | |
| Karfreitag | variabel | Ja | |
| Ostermontag | variabel | Ja | |
| 01.05 | Tag der Arbeit | Ja | |
| Himmelfahrt | variabel | Ja | |
| Pfingstmontag | variabel | Ja | |
| 03.10 | Tag der Deutschen Einheit | Ja | |
| 25.12 | 1. Weihnachtstag | Ja | |
| 26.12 | 2. Weihnachtstag | Ja | |
| 06.01 | Heilige Drei Könige | Nur BW, BY, ST | |
| 15.08 | Mariä Himmelfahrt | Nur BY (kath. Gemeinden) | |
| 01.11 | Allerheiligen | BW, BY, NW, RP, SL | |
| 31.10 | Reformationstag | BB, HB, HH, MV, NI, SN, ST, SH, TH | |

---

## BLOCK 2 — Regulatorik Deutschland

### ZAG — Zahlungsdiensteaufsichtsgesetz

Die PSD2 wurde in Deutschland durch das **Zahlungsdiensteaufsichtsgesetz (ZAG)** vom 17. Juli 2017 (BGBl. I S. 2446) in nationales Recht umgesetzt. Wesentliche Aspekte:

- **§ 1 ZAG**: Erlaubnispflicht für Zahlungsdienstleister — Unternehmen, die Zahlungsdienste erbringen, benötigen BaFin-Zulassung
- **§ 17 ZAG**: Starke Kundenauthentifizierung (SCA) — Für Online-Zahlungen zwingend; B2B-Ausnahmen (§ 17 Abs. 2) müssen mit der Hausbank explizit vereinbart werden
- **§ 26 ZAG**: Sorgfaltspflichten — AML-Maßnahmen für Zahlungsdienstleister
- **§ 55 ZAG**: Zugangsrecht zu Zahlungskonten — Open Banking, PSD2-API-Verpflichtung
- PSD3 (EU-Entwurf, Umsetzung 2026/2027 erwartet): IBAN-Namensabgleich wird Pflicht — Kontoinhaber-Name und IBAN müssen übereinstimmen. Deutsche Banken wie Deutsche Bank und Commerzbank haben bereits CoP-Piloten (Confirmation of Payee) gestartet.

**Praxis-Hinweis SAP:** B2B-SCA-Ausnahme (§ 17 Abs. 2 ZAG) mit allen deutschen Hausbankverbindungen schriftlich fixieren. POBO-Vereinbarungen brauchen keinen separaten ZAG-Rider, sind aber bankvertraglich abzusichern.

### KWG / GwG — Geldwäscheprävention

Das **Gesetz über das Kreditwesen (KWG)** und das **Geldwäschegesetz (GwG)** bilden das AML-Grundgerüst:

- **§ 25h KWG**: Interne Sicherungsmaßnahmen — Banken müssen auffällige Transaktionen monitoren
- **GwG § 10**: Sorgfaltspflichten (KYC) — bei neuen Geschäftsbeziehungen mit deutschen Banken
- **GwG § 43**: Verdachtsmeldungen an FIU (Financial Intelligence Unit beim Zoll)
- **Bargeldobergrenze**: 10.000 EUR (EU-Standard); ab 2027 geplant 3.000 EUR nach neuer EU-AML-VO
- **UBO-Register**: Transparenzregister (§ 18 ff. GwG) — wirtschaftlich Berechtigte müssen eingetragen sein
- **GwG § 9**: Gruppenweite Sorgfaltspflichten — relevant für multinationale Konzerne mit DE-Holding

**SAP-Relevanz:** Sanktionsscreening über SAP Financial Compliance Management oder externe Lösung. DE ist kein Hochrisikoland; Standard-Screening ausreichend.

### DSGVO / BDSG — Datenschutz für Zahlungsdaten

- **BDSG (Bundesdatenschutzgesetz)** ergänzt die DSGVO mit deutschen Besonderheiten
- Zahlungsdaten sind personenbezogene Daten; Auftraggeber-/Empfänger-IBAN unterliegen DSGVO
- **§ 26 BDSG**: Beschäftigtendatenschutz — relevant für Gehaltszahlungen
- Datenweitergabe an SWIFT: Basis ist berechtigtes Interesse (Art. 6 Abs. 1 f DSGVO)
- Aufbewahrungsfristen für Zahlungsbelege: 10 Jahre (§ 147 AO, § 257 HGB)

### SEPA-Verordnung (EU 260/2012)

Deutschland hat SEPA vollständig umgesetzt. Seit **01.02.2014** sind DTAUS und DTAZV für inländische Zahlungen durch SEPA SCT/SDD abgelöst. DTAZV wird noch für bestimmte Auslandsüberweisungen bei kleineren Banken unterstützt.

**Aktuell (April 2026):**
- SEPA SCT: Vollständig, alle Banken
- SEPA SCT Inst: Empfangspflicht seit Oktober 2025 (EU-Instant-Payments-VO 2024/886); DE-Großbanken: vollständig
- SEPA SDD Core / B2B: Vollständig
- Preisparität SCT/SCT Inst: ab Oktober 2025 Pflicht

### DORA / NIS2 (DE-Umsetzung)

- **DORA** (Digital Operational Resilience Act): Direkt anwendbar ab 17.01.2025; DE-Banken in Scope
- **NIS2**: In DE umgesetzt durch **NIS2UmsuCG** (Umsetzungsgesetz, in Kraft seit Oktober 2024)
- Anforderungen: EBICS-Server und H2H-Verbindungen in Business Continuity Plan dokumentieren
- DE-Banken fordern neue DORA-Klauseln in Bankverträgen

---

## BLOCK 3 — Clearing & Banken Deutschland

### Nationale Clearing-Systeme

| System | Typ | Währung | Betreiber | Teilnehmer | Settlement |
|---|---|---|---|---|---|
| TARGET2 (T2) | RTGS | EUR | EZB / Bundesbank | Banken direkt | Brutto, sofort |
| STEP2 (EBA Clearing) | ACH/DNS | EUR | EBA Clearing | Alle SEPA-Banken | DNS täglich |
| TIPS | Instant RTGS | EUR | EZB | Banken / PSPs | Brutto, Echtzeit |
| RPS (Bundesbank) | Retail | EUR | Bundesbank | Sparkassen, Genossenschaftsbanken | DNS |

**TARGET2 → T2 Migration:** Die Bundesbank und alle deutschen Banken haben den T2-Konsolidierungsschritt (März 2023) abgeschlossen. T2 ist der Nachfolger von TARGET2 mit erweitertem ISO 20022-Messaging.

### Cut-Off-Zeiten (repräsentativ, April 2026)

| Zahlungsart | Cut-Off | Valuta Auftraggeber | Valuta Empfänger |
|---|---|---|---|
| SEPA SCT (Standard) | 15:00 CET | D | D+1 |
| SEPA SCT (Express / URGP) | 17:00 CET via T2 | D | D |
| SEPA SCT Instant | 24/7/365 | Sofort | Sofort |
| SEPA SDD CORE FRST | D-5 Bankarbeitstage | | D (Einzug) |
| SEPA SDD CORE RCUR | D-2 Bankarbeitstage | | D (Einzug) |
| SEPA SDD B2B | D-1 Bankarbeitstag | | D (Einzug) |
| Auslandsüberw. SWIFT | 14:00 CET | D | D+1–D+2 |
| T2 Großbetrag (URGP) | 17:00 CET | D | D |

### IBAN-Validierung

```
Prüfziffer ISO 7064 MOD 97-10:
1. Verschiebe Prüfziffern ans Ende: [8 BLZ][10 KtNr][DE][00]
2. Ersetze Buchstaben: D=13, E=14
3. Berechne MOD 97 des Ergebnisses
4. Prüfziffern = 98 - (Ergebnis MOD 97)
```

### EBICS — Der deutsche Standard-Bankkanal

EBICS (Electronic Banking Internet Communication Standard) wurde in Deutschland entwickelt und ist hier der **dominierende Bankverbindungsstandard** für Corporates. Alle deutschen Großbanken unterstützen EBICS 3.0 (Stand 2023).

**EBICS-Auftragsarten (aktuell, EBICS 3.0):**

| Auftragsart (BTF) | Inhalt | Richtung |
|---|---|---|
| CCT | SEPA Credit Transfer pain.001 | Upload |
| CDD / CDC | SEPA Direct Debit Core/B2B pain.008 | Upload |
| STA | MT940-Kontoauszug | Download |
| C53 | camt.053 Kontoauszug | Download |
| C52 | camt.052 Intraday-Bericht | Download |
| C54 | camt.054 Buchungsbenachrichtigung | Download |
| HAC | Auftragsannahme-Quittung | Download |

**EBICS-Sicherheitsstufen:**
- T: Transport-Signatur (veraltet, nicht mehr empfohlen)
- TS: Transport + Auftragsunterschrift (Standard)
- ES: Elektronische Signatur (für 4-Augen-Prinzip mit zwei Unterzeichnern)

---

## BLOCK 4 — SAP-Besonderheiten Deutschland

### Customizing-Hotspots

**FBZP — Zahlungsmethodenkonfiguration DE:**
- Zahlungsmethode "B": SEPA CT (pain.001.001.03 oder .09)
- Zahlungsmethode "D": SEPA SDD Core (pain.008.001.02)
- Zahlungsmethode "E": SEPA SDD B2B (pain.008.001.02)
- Hausbanken: BIC immer pflegen — auch wenn technisch nicht mehr Pflicht für SEPA, für SWIFT-Korrespondenz erforderlich
- Gläubiger-ID (CI) in SAP hinterlegen: FBZP → Zahlungsweg → Weitere Daten

**Datenträgerformate:**
- `SEPA_CT`: Standard für SEPA-Überweisungen, pain.001.001.03
- `SEPA_CT_09`: Für pain.001.001.09 (aktuellste Version, ab 2023 empfohlen für Neuinstallationen)
- `SEPA_DD_CORE`: SEPA-Lastschrift Core
- `SEPA_DD_B2B`: SEPA-Lastschrift B2B
- `DTAZV`: Nur noch für Auslandszahlungen über ausgewählte Legacy-Banken; Ablösung durch SWIFT/ISO 20022

**BCM-Kanalkonfiguration:**
- EBICS: T-Code FIEB — Standard für alle DE-Großbanken
- SWIFT FileAct: Für internationale Konzerne mit SWIFT-Netzwerk
- H2H proprietär: Nur noch wenige Banken; Migrationsplan empfohlen

### Typische Projektfehler Deutschland

1. **Steuernummer vs. USt-IdNr.:** In XBLNR-Feld bei Kreditorenzahlungen die falsche Steuer-ID angegeben. SAP-Standard: STCEG = USt-IdNr (DE + 9 Ziffern); STCD1 = Steuernummer
2. **BLZ statt IBAN:** Alte BLZ/Kontonummer-Felder im SAP-Stamm gepflegt, IBAN-Feld leer — Zahlungen gehen aber nur über IBAN
3. **EBICS-Zertifikate:** Ablauf nicht überwacht — plötzliche Unterbrechung der Bankverbindung. Zertifikate alle 3 Jahre erneuern (bankspezifisch)
4. **SCAL-Kalender:** Deutschen Fabrikkalender nicht gepflegt (besonders regionale Feiertage) → Zahlungen auf Feiertage terminiert
5. **DMEE-Version:** SEPA_CT auf veralteter pain.001.001.03 Version statt aktueller .09 — bei Banken mit neuem ISO-20022-Gateway kommen Fehlermeldungen
6. **Gläubiger-ID:** CI nicht in SAP BCM hinterlegt vor erstem SDD-Lauf → Lastschriften werden von Banken abgelehnt
7. **SDD Fristen:** FRST-Mandat mit RCUR-Frist (2 statt 5 Bankarbeitstage vor Einzug) eingereicht — Rückgabe wegen verspäteter Voranmeldung

### Fabrikkalender SAP SCAL

```
DE-Kalender Minimum:
- 9 nationale Feiertage (siehe Block 1)
- Regionale Feiertage je nach Buchungskreis-Standort
- Bayern (BY): zusätzlich 06.01, 15.08, 01.11, 02.11 (Allerseelen, optional)
- Nordrhein-Westfalen (NW): zusätzlich 01.11
- Sachsen (SN): zusätzlich 31.10, Buß- und Bettag (variabel)
```

---

## BLOCK 5 — Lokale Formate Deutschland

### SEPA-Standardformate (aktuell)

| Format | Version | Verwendung | Status |
|---|---|---|---|
| pain.001.001.03 | SEPA SCT | Ausgehende Überweisungen | Aktuell, weit verbreitet |
| pain.001.001.09 | SEPA SCT | Ausgehende Überweisungen | Empfohlen ab 2023, Migration läuft |
| pain.008.001.02 | SEPA SDD Core/B2B | Lastschriften | Aktuell |
| pain.002.001.03 | Zahlungsstatus | Rückgaben, Rejects | Aktuell |
| camt.052.001.02+ | Intraday-Kontoauszug | Liquiditätsmonitoring | Standard |
| camt.053.001.02+ | Tagesauszug | Buchungsdaten | Standard |
| camt.054.001.02+ | Buchungsbenachrichtigung | Echtzeit-Notifikation | Standard |
| pacs.008.001.09 | SWIFT ISO 20022 | Auslandsüberweisungen | Ab Nov. 2025 Pflicht |

### Nationale Altformate (Legacy)

| Format | Beschreibung | Status |
|---|---|---|
| DTAUS | Inländischer Zahlungsverkehr | Abgelöst seit 01.02.2014 — nur für absolute Legacy-Altverträge |
| DTAZV | Auslandsüberweisungen | Noch aktiv bei kleineren Banken; Ablösung empfohlen |
| MT940 | SWIFT-Kontoauszug | Läuft parallel zu camt.053; Migration bis 2025 empfohlen |
| MT103 | SWIFT-Überweisung | Abgelöst durch pacs.008 im Nov. 2025 |

### SWIFT ISO 20022 Migration

Die SWIFT-MT-Sunset-Deadline war **November 2025**. Alle deutschen Banken mit SWIFT-Anbindung haben auf MX (ISO 20022 pacs/pain) migriert oder bieten Konvertierung an. DTAZV-basierte Auslandszahlungen über kleinere Landesbanken: individuelle Prüfung empfohlen.

---

## BLOCK 6 — Go-Live Checkliste Deutschland

### Vorbereitung (Pre-Go-Live)

- [ ] Hausbank-Accounts mit IBAN + BIC in SAP angelegt (FI12)
- [ ] EBICS-Vertrag mit DE-Hausbank abgeschlossen; EBICS-Parameter (User-ID, Partner-ID, Bank-URL) konfiguriert
- [ ] EBICS-Initialisierungsbrief (INI/HIA) mit Bank ausgetauscht; Zertifikate aktiviert
- [ ] SEPA_CT DMEE-Format konfiguriert und mit pain.001 Version der Bank abgestimmt
- [ ] Gläubiger-ID (CI) bei Bundesbank beantragt (falls SDD) und in FBZP hinterlegt
- [ ] SDD-Mandate im SAP-Mandatsstamm erfasst; MndtId eindeutig je CI
- [ ] DE-Fabrikkalender in SCAL gepflegt (9+ Feiertage, ggf. regional)
- [ ] Cut-Off-Zeiten der DE-Hausbank dokumentiert und in Zahllauf-Zeitplan eingebunden
- [ ] Zahlungsmethoden B (SCT) / D (SDD Core) / E (SDD B2B) in FBZP vollständig konfiguriert
- [ ] camt.053-Import konfiguriert (FF_5 oder BAM); Posting Rules für DE-Banken angelegt
- [ ] Sanktionsscreening-Lösung aktiv (SAP FCM oder externe Lösung)
- [ ] EBICS-Zertifikat-Ablaufdaten im Kalender; Erneuerungsprozess dokumentiert

### Produktivsetzung

- [ ] Testübertragungen mit DE-Hausbank erfolgreich (Upload + Download)
- [ ] pain.001-Testdatei mit Bank-Testsystem validiert
- [ ] Erster Zahllauf F110 in Produktion — Log auf Fehler prüfen
- [ ] SEPA SDD: Erster FRST-Einzug mit korrekter Vorlaufzeit (D-5) eingereicht
- [ ] camt.053-Auszug empfangen und korrekt in SAP verbucht
- [ ] Abstimmung Bankauszug vs. SAP-Buchungen durchgeführt
- [ ] EBICS-Quittungsdateien (HAC/pain.002) verarbeitet
- [ ] Monitoring: EBICS-Übertragungsstatus täglich geprüft

### Laufender Betrieb

- [ ] Jährlich: Fabrikkalender-Update für neue Feiertage (SCAL)
- [ ] Alle 3 Jahre: EBICS-Zertifikate prüfen und ggf. erneuern
- [ ] Bei PSD3-Umsetzung (erwartet 2026/2027): CoP-Implementierung für IBAN-Namensabgleich
- [ ] SWIFT MT → MX Migration abgeschlossen; DTAZV-Ablösung evaluieren
- [ ] SCT-Instant-Fähigkeit bestätigt: Hausbank sendet und empfängt INST (seit Oktober 2025 Pflicht)
