---
code: ES
name: Spanien
complexity: medium
currency: EUR
summary: SEPA-Land mit starker Instant-Payment-Kultur (Bizum), CaixaBank/Santander dominieren, mittlere SAP-Komplexität durch regionale Bankstrukturen und NIF/CIF-Steuer-IDs in Zahlungen.
---

# Global Payments Datenbank — Länderprofil: Spanien (ES)

**Stand:** April 2026 | **Quellen:** Banco de España, Ministerio de Hacienda, EPC, Bizum S.L. | **Komplexität:** ★★★☆☆ Mittel (Score 5/10)

## BLOCK 1 — Country Master

### Grunddaten

| Eigenschaft | Wert | Quelle | Hinweis |
|---|---|---|---|
| ISO-Ländercode | ES / ESP | ISO 3166-1 | Alpha-2 / Alpha-3 |
| Währung | EUR (€) | ISO 4217 | Eurozone seit 01.01.1999 |
| IBAN-Format | ES + 2 + 4 Bankcode + 4 Filialcode + 2 Prüfziffern + 10 Kontonr = 24 Stellen | Banco de España | CCC (Código Cuenta Cliente) ist die historische ES-Kontonummer |
| BIC-Format | AAAAAESBBBB | SWIFT | ES = Ländercode |
| Zentralbank | Banco de España | bde.es | Eurosystem-Mitglied, NCB |
| Aufsichtsbehörde | Banco de España (Banken), CNMV (Kapitalmarkt) | bde.es / cnmv.es | |
| Zeitzone | CET (UTC+1) / CEST (UTC+2) | | Gleich wie DE trotz geografischer Lage |
| Sprache | Spanisch (Kastilisch), regional: Katalanisch, Baskisch, Galicisch | | Vertragssprache: Castellano |
| Gläubiger-ID (CI) | ES + 2 Prüfziffern + ZZZ + 11-stellige CI | Banco de España | |

### IBAN-Struktur Spanien

```
ES  [2 IBAN-Prüfz.]  [4 Bankcode]  [4 Filialcode]  [2 CCC-Prüfz.]  [10 Kontonummer]
     ^                                                 ^
  ISO 7064 MOD 97-10                          Spanische interne Prüfziffer
```

**CCC (Código Cuenta Cliente):** Die historische ES-Kontonummer — Bankcode (4) + Filialcode (4) + 2 CCC-Prüfziffern + 10 Kontonr. Bei alten ES-Lieferantendaten: CCC liegt oft vor statt IBAN; Konvertierung notwendig.

**CCC-Prüfziffer-Algorithmus:**
```
Prüfziffern Position 1: Prüft Bankcode + Filialcode (Modulo 11)
Prüfziffer Position 2: Prüft Kontonummer (Modulo 11)
```

### Hauptbanken

- CaixaBank (BIC: CAIXESBBXXX) — nach Bankia-Übernahme 2021 größte ES-Retailbank
- Banco Santander (BIC: BSCHESMMXXX) — internationale Großbank; starker Corporate-Service
- BBVA (BIC: BBVAESMMXXX) — zweitgrößte ES-Bank; sehr gute EBICS-Unterstützung
- Sabadell (BIC: BSABESBBXXX) — stark im KMU-Geschäft; nach geplanter BBVA-Fusion beobachten
- Bankinter (BIC: BKBKESMMXXX) — Innovations- und Digitalbank
- Kutxabank / Ibercaja — Regionale Sparkassen (Cajas); baskisch bzw. aragonesisch
- Cajamar — Genossenschaftliche Agrarbank; relevant für Agrarsektor

### Nationale Feiertage

| Datum | Bezeichnung | National? | Hinweis |
|---|---|---|---|
| 01.01 | Año Nuevo | Ja | |
| 06.01 | Epifanía del Señor | Ja | NICHT in DE! Dreikönigstag — wichtig! |
| Karfreitag | variabel | Ja | |
| 01.05 | Día del Trabajador | Ja | |
| 15.08 | Asunción de la Virgen | Ja | NICHT in DE! |
| 12.10 | Fiesta Nacional de España | Ja | NICHT in DE! Nationalfeiertag |
| 01.11 | Todos los Santos | Ja | NICHT in DE! |
| 06.12 | Día de la Constitución | Ja | NICHT in DE! |
| 08.12 | Inmaculada Concepción | Ja | NICHT in DE! |
| 25.12 | Navidad | Ja | |

Zusätzlich: **Regionale Feiertage** je Autonomer Gemeinschaft (17 Comunidades Autónomas). Katalonien, das Baskenland, Madrid und Andalusien haben teils abweichende Feiertage. SAP-Fabrikkalender ES: mindestens 10 nationale + relevante regionale Feiertage pflegen.

---

## BLOCK 2 — Regulatorik Spanien

### PSD2-Umsetzung (RDL 19/2018 / Ley 21/2011)

Die PSD2 wurde in Spanien durch das **Real Decreto-ley 19/2018** vom 23. November 2018 in nationales Recht umgesetzt, ergänzt durch die frühere **Ley 16/2009** für Zahlungsdienste:

- **Starke Kundenauthentifizierung (SCA):** In ES vollständig umgesetzt. B2B-SCA-Ausnahme muss mit der ES-Hausbank vereinbart werden; Banco de España überwacht Compliance.
- **Open Banking ES:** APIs der großen ES-Banken (CaixaBank, Santander, BBVA) sind gut; kleinere Cajas variieren. BBVA gilt als PSD2-API-Vorreiter in ES.
- **POBO in ES:** Zulässig, aber schriftliche Vereinbarung mit ES-Hausbank und rechtliche Prüfung auf Steuerimplikationen (Körperschaftsteuer IS) erforderlich.
- **Bizum-Integration:** Bizum (das spanische Instant-Payment-System) ist technisch über PSD2-APIs zugänglich; für Corporate-Massennutzung aber noch begrenzt.

### AML (Ley 10/2010 Anti-Blanqueo)

- **Ley 10/2010**, geändert durch Real Decreto-Ley 11/2018: Umsetzung der EU-AML-Richtlinien
- **SEPBLAC** (Servicio Ejecutivo de la Comisión de Prevención del Blanqueo de Capitales e Infracciones Monetarias): Spanische FIU; Verdachtsmeldungen bei SEPBLAC
- **UBO-Register:** Registro de titulares reales — Teil des Mercantil-Registers (Handelsregister)
- **Bargeldobergrenze:** EUR 1.000 für Transaktionen zwischen Unternehmern (Gesetz 7/2012, verstärkt 2021); für Konsumenten EUR 1.000; Sonderregel: Touristen aus Nicht-EU max. EUR 10.000
- **NIF-Übermittlung:** Nucleo de Identificación Fiscal bei grenzüberschreitenden Zahlungen relevant

### Steuer-IDs Spanien

| ID | Format | Bedeutung | SAP-Feld |
|---|---|---|---|
| NIF (Personas Jurídicas) | A/B/C...+7 Ziffern+Prüfbuchst. | Steuernummer Unternehmen | STCD1 |
| NIF (Autónomos) | Wie DNI: 8 Ziffern+Buchst. | Steuernummer Selbständige | STCD1 |
| CIF (alt) | Synonym für NIF jur. Personen | Veraltet, aber noch gebräuchlich | |
| DNI | 8 Ziffern + Buchstabe | Personalausweis natürl. Personen | |
| NIE | X/Y/Z + 7 Ziffern + Buchst. | Ausländer-ID | |
| NIF-IVA | ES + NIF | EU-USt-ID | STCEG |

**NIF-Format Unternehmen:** Erstes Zeichen = Buchstabe (Rechtsform): A=AG, B=GmbH, C=Genossenschaft usw. + 7 Ziffern + 1 Prüfbuchstabe. Gesamtlänge: 9 Zeichen.

### DORA / NIS2 (ES-Umsetzung)

- DORA direkt anwendbar ab 17.01.2025
- NIS2: Transposición in ES durch **Real Decreto** (Stand April 2026: noch in parlamentarischer Beratung; ENISA-Umsetzungsfrist wurde von ES nicht vollständig eingehalten)
- Banco de España hat eigene TIBER-ES-Übungen (Threat Intelligence-based Ethical Red Teaming) für systemrelevante ES-Banken

---

## BLOCK 3 — Clearing & Banken Spanien

### Nationale Clearing-Systeme

| System | Typ | Betreiber | Währung | Besonderheit |
|---|---|---|---|---|
| SNCE (Sistema Nacional de Compensación Electrónica) | ACH/DNS | Iberpay (früher CECA/EBA) | EUR | ES-nationales Retail-Clearing |
| STEP2 | ACH/DNS | EBA Clearing | EUR | Paneuropäisches SEPA |
| TARGET2 / T2 | RTGS | EZB / Banco de España | EUR | Großbetrag |
| TIPS | Instant RTGS | EZB | EUR | Bizum-Backend (teilweise) |
| Bizum | P2P / A2A Instant | Iberpay | EUR | ES-spezifisches Instant-System |

**Iberpay** (früher bekannt als CECA — Confederación Española de Cajas de Ahorros in Zahlungsverkehrsfunktion) betreibt sowohl SNCE als auch die Bizum-Infrastruktur.

### Bizum — Das spanische Killer-Feature

**Bizum** ist das spanische Echtzeit-Bezahlsystem, das 2016 von den spanischen Banken gemeinsam als B2C-Lösung gestartet wurde:

- **Nutzer (April 2026):** Über 26 Millionen registrierte Nutzer; größtes mobiles Zahlungssystem Spaniens
- **Technische Basis:** Verbindung über Mobilnummer (MSISDN) zu IBAN; Backend über SNCE/TIPS
- **Limits:** Privat: max. EUR 1.000 pro Zahlung, EUR 2.000/Tag; Business (Bizum Empresas): bis EUR 50.000
- **Bizum Empresas:** Corporate-Lösung für Unternehmen — Kundenzahlungen per Bizum empfangen (E-Commerce, POS)
- **SAP-Integration:** Noch kein Standard-SAP-Connector für Bizum. API-Integration über Iberpay oder Bankgateway nötig.
- **Tipp:** Bei ES-B2C-Gesellschaften (Retail, Gastronomie): Bizum als Zahlungseingang erwägen — hohe Akzeptanzrate bei ES-Konsumenten.

### Cut-Off-Zeiten Spanien

| Zahlungsart | Cut-Off | Valuta |
|---|---|---|
| SEPA SCT | 15:00 CET | D+1 |
| SEPA SCT Inst | 24/7/365 | Sofort |
| SEPA SDD CORE RCUR | D-2 Bankarbeitstage | D |
| T2 Dringend (URGP) | 17:00 CET | D |
| Bizum (privat/business) | Echtzeit | Sofort |

---

## BLOCK 4 — SAP-Besonderheiten Spanien

### Customizing-Hotspots

**Zahlungsmethoden ES in FBZP:**
- Zahlungsmethode "T" oder "B": SEPA CT (pain.001)
- Zahlungsmethode "D": SEPA SDD Core
- Kein Standard für Bizum; manuelle Prozesse oder Bank-API-Integration

**NIF/CIF in SAP:**
- Kreditorenstamm (LFA1): STCD1 = NIF (9-stellig)
- Debitorenstamm (KNA1): STCD1 = NIF
- Eigene ES-Gesellschaft (T001): STCEG = ES + NIF = EU-USt-ID
- DMEE pain.001: Feld Tax/Dbtr/TaxId = NIF der zahlenden ES-Gesellschaft (bei POBO)
- Custom Validation: NIF-Prüfbuchstabe-Algorithmus (Modulo 23) in SAP implementieren empfohlen

**CCC → IBAN Konvertierung:**
- Alte CCC-Kontonummern aus ES-Kreditorenstamm per IBAN-Konverter migrieren
- Banco de España stellt offiziellen CCC→IBAN-Konverter bereit

**Bankkanäle ES:**
- EBICS: CaixaBank, BBVA, Santander — Standard für Corporate
- SWIFT FileAct: Santander International, BBVA Corporate
- H2H: Einige Cajas (Kutxabank) nutzen proprietäre Verbindungen

### Typische Projektfehler Spanien

1. **06.01 (Epifanía):** Im DE-Kontext unbekannt — einer der wichtigsten ES-Feiertage; SAP-Kalender muss ihn enthalten
2. **CCC statt IBAN:** ES-Lieferanten liefern CCC — Konvertierung vor Datenmigration notwendig
3. **NIF-Validierung:** Prüfbuchstabe nicht validiert → unvalide NIFs im Stamm → Probleme bei E-Rechnung-Pflicht (ab 2025 für große Unternehmen in ES)
4. **Regionale Feiertage:** Besonders Katalonien (Sant Jordi 23.04, Diada 11.09) und Baskenland abweichend
5. **Bizum ignoriert:** Bei ES-B2C-Töchtern Bizum als Zahlungseingang nicht berücksichtigt → Kundenzufriedenheit sinkt

### IHB / POBO Spanien

- POBO in ES: Zulässig mit Vereinbarung; Banco de España prüft nicht explizit, aber Steueramt (AEAT) schaut auf Transaktionsstrukturen
- **AEAT (Agencia Tributaria):** Kann Transaktionshistorie prüfen; POBO-Dokumentation aufbewahren
- UltmtDbtr + NIF der ES-Tochter in pain.001 bei POBO

---

## BLOCK 5 — Lokale Formate Spanien

### SEPA-Formate (Standard)

| Format | Verwendung |
|---|---|
| pain.001.001.03 / .09 | SEPA SCT |
| pain.008.001.02 | SEPA SDD |
| pain.002.001.03 | Zahlungsstatus / Rejects |
| camt.053 | Kontoauszug (bevorzugt) |
| MT940 | Legacy Kontoauszug |

### ES-Spezifische Besonderheiten

| Format/System | Beschreibung | Status |
|---|---|---|
| SNCE-Format | ES-nationales CFONB-ähnliches Clearing-Format | Intern bei Iberpay; bankextern nur SEPA |
| Pagaré | Schuldversprechen (ähnlich Wechsel); noch im Handelsverkehr | Rückläufig; kein SAP-Standard |
| Confirming | Factoringähnliches Instrument der Banken; Lieferanten erhalten Frühauszahlung | Keine SEPA-Entsprechung; bankspezifisch |

**Confirming:** Sehr verbreitet in Spanien — eine Bank (typisch CaixaBank oder BBVA) übernimmt die Verbindlichkeit des Käufers und zahlt dem Lieferanten frühzeitig aus. Für SAP relevant: Confirming ist nicht im Standard; Add-Ons (z.B. Serrala Confirming) oder Custom-Entwicklung nötig.

### E-Rechnung Pflicht ES (ab 2025)

- **Ley Crea y Crece (Ley 18/2022):** E-Rechnung-Pflicht für B2B
- Für große Unternehmen (Umsatz > EUR 8 Mio.): Pflicht ab 01.01.2025 (Phase 1)
- Für alle anderen: ab 01.01.2026 (Phase 2)
- Format: **FacturaE** (XML basierend auf UBL / CEN EN 16931) oder **Facturae v3.2.2**
- Kanal: Privates Netzwerk oder offizielles ES-Portal **FACe** (für öffentliche Auftraggeber)
- **SAP-Relevanz:** SAP Document and Reporting Compliance (DRC) für ES verfügbar; Facturae-Format muss konfiguriert werden

---

## BLOCK 6 — Go-Live Checkliste Spanien

### Vorbereitung

- [ ] CCC → IBAN Konvertierung für alle ES-Lieferanten durchgeführt und validiert
- [ ] NIF/CIF aller ES-Lieferanten in Kreditorenstamm gepflegt (STCD1, 9-stellig)
- [ ] NIF der eigenen ES-Gesellschaft in T001 / OBY6 hinterlegt
- [ ] Gläubiger-ID (CI) bei Banco de España beantragt (falls SDD)
- [ ] EBICS mit ES-Hausbank (BBVA / CaixaBank) konfiguriert; INI-Brief ausgetauscht
- [ ] ES-Fabrikkalender in SCAL gepflegt (10 nationale + relevante regionale Feiertage)
- [ ] 06.01 (Epifanía) und 08.12 (Inmaculada) explizit im Kalender
- [ ] Regionale Feiertage je Gesellschaftsstandort ergänzt
- [ ] pain.001-Format auf ES-Bankanforderungen geprüft
- [ ] NIF-Validierungsroutine implementiert (Prüfbuchstabe)
- [ ] Confirming-Anforderungen mit ES-Hausbank abgeklärt

### Produktivsetzung

- [ ] Testübertragung EBICS Upload/Download erfolgreich
- [ ] pain.001-Testdatei mit ES-Bank validiert
- [ ] NIF-Übermittlung im pain.001-Feld Tax/Dbtr/TaxId korrekt
- [ ] camt.053 von ES-Bank empfangen und korrekt in SAP verbucht
- [ ] SDD-Ersteinzug FRST mit D-5 Vorlaufzeit eingereicht

### Laufender Betrieb

- [ ] Bizum Empresas: Evaluierung für ES-B2C-Gesellschaften
- [ ] FacturaE E-Rechnung: SAP DRC für ES konfiguriert und getestet
- [ ] Confirming-Lieferanten: Prozess mit ES-Hausbank dokumentiert
- [ ] Regionale Feiertage jährlich aktualisieren
- [ ] BBVA/CaixaBank: Neuigkeiten zu EBICS 3.0-Updates verfolgen
