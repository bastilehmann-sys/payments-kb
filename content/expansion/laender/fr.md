---
code: FR
name: Frankreich
complexity: medium
currency: EUR
summary: SEPA-Land mit ausgeprägter Tradition lokaler Instrumente (LCR, Chèque, TIP), mittlere Komplexität durch Altformate und spezifische Bankanforderungen an Zahlungsreferenzen.
---

# Global Payments Datenbank — Länderprofil: Frankreich (FR)

**Stand:** April 2026 | **Quellen:** Banque de France, ACPR, EPC, Comité Français d'Organisation et de Normalisation Bancaires (CFONB) | **Komplexität:** ★★★☆☆ Mittel (Score 5/10)

## BLOCK 1 — Country Master

### Grunddaten

| Eigenschaft | Wert | Quelle | Hinweis |
|---|---|---|---|
| ISO-Ländercode | FR / FRA | ISO 3166-1 | Alpha-2 / Alpha-3 |
| Währung | EUR (€) | ISO 4217 | Eurozone seit 01.01.1999 |
| IBAN-Format | FR + 2 + 5 Bankcode + 5 Filialcode + 11 Kontonr + 2 Prüfziffern = 27 Stellen | Banque de France | RIB (Relevé d'Identité Bancaire) enthält gleiche Daten |
| BIC-Format | AAAAFRBBBBB | SWIFT | FR = Ländercode |
| Zentralbank | Banque de France | banque-france.fr | Eurosystem-Mitglied, NCB |
| Aufsichtsbehörde | ACPR (Autorité de contrôle prudentiel et de résolution), AMF | acpr.banque-france.fr | ACPR = Bankenaufsicht; AMF = Kapitalmarkt |
| Zeitzone | CET (UTC+1) / CEST (UTC+2) | | Gleich wie DE |
| Sprache | Französisch | | Vertragssprache FR-Banken oft nur Französisch |
| Gläubiger-ID (CI) | FR + 2 Prüfziffern + ZZZ + 11-stellige ID | Banque de France | Beantragen: banque-france.fr |

### IBAN-Struktur Frankreich

```
FR  [2 Prüfz.]  [5 Bankcode]  [5 Filialcode]  [11 Kontonummer]  [2 Prüfziffern (Clé RIB)]
```

Gesamtlänge: **27 Zeichen**. Der **RIB** (Relevé d'Identité Bancaire) ist das traditionelle FR-Bankidentifikationsdokument — enthält Bankcode, Filialcode, Kontonummer und Clé RIB. Bei FR-Lieferanten immer nach RIB fragen; daraus lässt sich die IBAN ableiten.

**Clé RIB:** 2-stellige Prüfziffern am Ende des RIB (Positionen 24–25 der IBAN). Berechnung nach Modulo-97-Verfahren. Achtung: Clé RIB ≠ IBAN-Prüfziffern (Positionen 3–4).

### Hauptbanken

- BNP Paribas (BIC: BNPAFRPPXXX) — größte FR-Bank, sehr starker Corporate-Treasury-Service
- Société Générale (BIC: SOGEFRPPXXX) — zweite Großbank; Strukturierungsgeschäft
- Crédit Agricole / LCL (BIC: AGRIFRPPXXX) — genossenschaftliche Struktur; starke Regionalbanken
- Crédit Mutuel (BIC: CMCIFRPPXXX) — Genossenschaftsbank, sehr starkes Privatkundennetz
- BPCE / Natixis / Caisse d'Épargne (BIC: CEPAFRPPXXX) — genossenschaftliche Gruppe
- La Banque Postale (BIC: PSSTFRPPXXX) — Bank der Post; für öffentliche Auftraggeber relevant
- CIC (BIC: CMCIFRPPXXX) — Teil Crédit Mutuel

### Nationale Feiertage

| Datum | Bezeichnung | Hinweis |
|---|---|---|
| 01.01 | Jour de l'An | |
| Ostermontag | variabel | |
| 01.05 | Fête du Travail | |
| 08.05 | Fête de la Victoire 1945 | NICHT in DE! |
| Himmelfahrt | variabel | |
| Pfingstmontag | variabel | |
| 14.07 | Fête Nationale (Bastille) | NICHT in DE! |
| 15.08 | Assomption | NICHT in DE! |
| 01.11 | Toussaint (Allerheiligen) | NICHT in DE! |
| 11.11 | Armistice 1918 | NICHT in DE! |
| 25.12 | Noël | |

Frankreich hat **11 nationale Feiertage** — davon 5, die es in Deutschland nicht gibt. SAP-Fabrikkalender FR muss diese vollständig abbilden.

---

## BLOCK 2 — Regulatorik Frankreich

### PSD2-Umsetzung (Ordonnance 2017-1252)

Die PSD2 wurde durch **Ordonnance n° 2017-1252** vom 9. August 2017 und das begleitende **Décret n° 2017-1313** in französisches Recht umgesetzt. Kernaspekte:

- **Starke Kundenauthentifizierung (SCA):** In FR über ACPR-Regulierung konkretisiert. B2B-Ausnahme (Art. 17 PSD2) ist in FR mit Hausbankvertrag vereinbar; ACPR hat klare Leitlinien herausgegeben.
- **Open Banking:** FR-Banken haben PSD2-APIs über Skalierbare API-Hubs bereitgestellt. Qualität variiert: BNP Paribas und Société Générale haben gute APIs; kleinere Sparkassen (Caisses d'Épargne) teils eingeschränkt.
- **POBO in FR:** Schriftliche Vereinbarung mit der FR-Hausbank erforderlich (POBO-Rider). ACPR prüft POBO-Arrangements in Konzernstrukturen; Dokumentation kritisch.
- **PSD3 (2026/2027):** IBAN-Namensabgleich (Virement Instantané) — FR-Banken testen Confirmation of Payee; Banque de France treibt Piloten aktiv voran.

### AML / LCB-FT (Lutte contre le Blanchiment de Capitaux et le Financement du Terrorisme)

Frankreich gilt als eines der strengsten AML-Länder in der EU (TRACFIN als nationale FIU):

- **Code Monétaire et Financier (CMF), Art. L. 561-1 ff.:** Gesetzliche Grundlage AML/KYC in FR
- **TRACFIN** (Traitement du renseignement et action contre les circuits financiers clandestins): FR-FIU; Meldungen an TRACFIN sind bankseitig verpflichtend bei Verdachtsfällen
- **UBO-Register:** Registre des bénéficiaires effectifs (RBE) beim Handelsregister (RCS/Infogreffe) — Pflicht für alle FR-Gesellschaften
- **Bargeldobergrenze:** EUR 1.000 (Privatkunden, Nicht-EU-Touristen EUR 10.000); für Unternehmen im B2B-Bereich EUR 1.000 — strenger als EU-Durchschnitt
- **KYC FR-Banken:** Intensive Prüfung, besonders bei Nicht-FR-Konzernstrukturen; Unterlagen auf Französisch bevorzugt

**SAP-Relevanz:** Konzerne mit FR-Gesellschaft: UBO im RBE eintragen. Transaktionsmonitoring für FR-Zahlungen: Standard-Sanktionslisten (EU/OFAC) ausreichend; TRACFIN-spezifische Auffälligkeiten sind bankseitig gemeldet.

### Spezifische FR-Regulatorik: Chèque und LCR

Frankreich hat eine historisch ausgeprägte **Scheckkultur** und nutzt den **Chèque** (Scheck) und die **LCR** (Lettre de Change Relevé — elektronischer Wechsel) weit über den EU-Durchschnitt hinaus:

- **Chèque**: In FR gibt es keine gesetzliche Scheckgebühr (im Gegensatz zu DE). Scheckbetrug ist ein reales Risiko; FR-Banken haben Sicherheitssysteme (FNCI — Fichier national des chèques irréguliers).
- **LCR (Lettre de Change Relevé):** Elektronischer Wechsel; kein physisches Papier mehr seit 1970er Jahren; der Aussteller zieht per Bankeinzug ein. Format: CFONB LCR XML (proprietary). Zahlungsziel: 30–90 Tage üblich. Rückläufig aber besonders in Textil, Handel, Bauwirtschaft noch präsent.
- **BOR (Billet à Ordre Relevé):** Umgekehrt zur LCR: Schuldner stellt BOR aus und bietet der Bank ein. Weniger verbreitet als LCR.
- **TIP (Titre Interbancaire de Paiement):** Ähnlich Lastschrift; wird in Zusammenhang mit Papier-Rechnungen genutzt; faktisch auslaufend.

**CFONB** (Comité Français d'Organisation et de Normalisation Bancaires) — das FR-Bankenstandard-Gremium — pflegt die technischen Spezifikationen für LCR, BOR, TIP.

---

## BLOCK 3 — Clearing & Banken Frankreich

### Nationale Clearing-Systeme

| System | Typ | Betreiber | Währung | Besonderheit |
|---|---|---|---|---|
| CORE (FR) | ACH/DNS | STET | EUR | FR-nationales Retail-Clearing für SEPA + LCR/BOR |
| STEP2 | ACH/DNS | EBA Clearing | EUR | Paneuropäisches SEPA-Clearing |
| TARGET2 / T2 | RTGS | EZB / Banque de France | EUR | Großbetrag und dringende Zahlungen |
| TIPS | Instant RTGS | EZB | EUR | SCT Inst Echtzeit |

**CORE (FR):** Das FR-spezifische Clearing-System für Retail-Zahlungen. Betrieben von **STET** (Système Technologique d'Échange et de Traitement). CORE verarbeitet neben SEPA-Zahlungen auch LCR und BOR-Transaktionen im elektronischen Format. Wichtig: CORE hat eigene technische Spezifikationen und Fristen die von STEP2 abweichen können.

### Cut-Off-Zeiten Frankreich (repräsentativ)

| Zahlungsart | Cut-Off | Valuta | Hinweis |
|---|---|---|---|
| SEPA SCT | 15:00 CET | D+1 | BNP Paribas / SocGen |
| SEPA SCT Inst | 24/7/365 | Sofort | Alle Großbanken |
| SEPA SDD CORE FRST | D-5 Bankarbeitstage | | |
| SEPA SDD CORE RCUR | D-2 Bankarbeitstage | | |
| LCR-Einzug | D-1 über CORE | D | Bankspezifisch |
| T2 Dringend (URGP) | 17:00 CET | D | |

### IBAN-Validierung Frankreich

Die Clé RIB (Positionen 24–25 der 27-stelligen IBAN) wird nach folgender Formel geprüft:
```
(89 × Bankcode + 15 × Filialcode + 3 × Kontonummer) MOD 97 → Rest = Clé RIB
```
SAP führt die Standard-IBAN-Prüfung (ISO 7064 MOD 97-10) durch; die separate Clé RIB-Validierung ist eine FR-Besonderheit die in SAP nicht automatisch geprüft wird — Custom Validation empfohlen bei hohem LCR/RIB-Volumen.

---

## BLOCK 4 — SAP-Besonderheiten Frankreich

### Zahlungsformate und DMEE

**Standard SEPA (für 80%+ der FR-Zahlungen):**
- Ausgehende SCT: `SEPA_CT` (pain.001.001.03 oder .09)
- SDD: `SEPA_DD_CORE` / `SEPA_DD_B2B`
- Kein Extra-Aufwand gegenüber DE

**LCR in SAP — komplexer:**
- Kein Standard-DMEE für CFONB-LCR-Format
- Optionen: SAP Add-On (z.B. Serrala, Hanse Orga FR-Modul) oder Custom DMEE
- CFONB-Format: 80-Zeichen-Satzformat (Altformat) oder neueres CFONB-XML
- LCR-Akzeptanz prüfen: Viele FR-Lieferanten nehmen auch SEPA SCT → LCR-Notwendigkeit prüfen

**BankConnect FR:**
- EBICS: Alle FR-Großbanken unterstützen EBICS 3.0; Standardkanal für Corporate
- SWIFT FileAct: BNP Paribas, Société Générale — für internationale Konzerne
- H2H-Proprietary: Einige FR-Regionalbanken (Caisse d'Épargne regional)

### Typische Projektfehler Frankreich

1. **RIB statt IBAN:** FR-Lieferanten liefern RIB-Dokument — SAP-Stammdatenmigration muss RIB → IBAN konvertieren (Banque de France Konverter)
2. **LCR unterschätzt:** Wenn FR-Lieferanten LCR bevorzugen, ist kein Standard-DMEE vorhanden — frühzeitig abklären
3. **Zahlungsreferenz:** FR-Banken verlangen oft strukturierte Referenz in Remittance Information — freier Text im EndToEndId wird z.T. abgeschnitten
4. **Sprache in Bankverträgen:** FR-Hausbanken (BNP, SocGen) erstellen Vertragsunterlagen oft nur auf Französisch; Übersetzungsaufwand einplanen
5. **Bastille-Feiertag (14.07.):** Im SAP-Fabrikkalender oft vergessen; besonders kritisch da großes Volumen an Lohnläufen im Juli
6. **Vorauszahlungen 08.05:** Tag der Siegesfeier — in DE unbekannt, wird oft im Zahllauf-Timing ignoriert
7. **TIP-Rückgaben:** Wenn noch TIP-Instrumente aktiv, kommt spezifisches CFONB-Reject-Format; SAP kann nicht automatisch verarbeiten

### IHB / POBO FR-Konfiguration

- POBO-Rider mit FR-Hausbank erforderlich (schriftlich, oft auf Französisch)
- UltmtDbtr in pain.001 korrekt befüllen: FR-SIRET der zahlenden Gesellschaft
- **SIRET / SIREN**: SIRET (14-stellig) = Unternehmensnummer + 5-stelliger Betriebsstättencode; SIREN (9-stellig) = Unternehmensstammnummer. In SAP als Steuernummer (STCD1/STCEG) pflegen.
- pain.001-Feld `Tax/Dbtr/TaxId`: SIRET der zahlenden FR-Gesellschaft bei POBO

---

## BLOCK 5 — Lokale Formate Frankreich

### SEPA-Formate (Standard)

| Format | Version | Verwendung |
|---|---|---|
| pain.001.001.03 | SEPA SCT | Ausgehende Überweisungen |
| pain.001.001.09 | SEPA SCT | Neuinstallationen empfohlen |
| pain.008.001.02 | SEPA SDD | Lastschriften |
| pain.002.001.03 | Status-Meldung | Rejects und Rückgaben |
| camt.053.001.02+ | Kontoauszug | Tagesauszug |
| camt.052 | Intraday | Liquiditäts-Monitoring |

### FR-Spezifische Altformate (CFONB)

| Format | Beschreibung | Status |
|---|---|---|
| CFONB LCR | Lettre de Change Relevé XML | Noch aktiv in bestimmten Branchen |
| CFONB BOR | Billet à Ordre Relevé | Rückläufig |
| CFONB TIP | Titre Interbancaire de Paiement | Weitgehend durch SDD abgelöst |
| CFONB 120 (Virement) | Altes FR-Überweisungsformat (120 Zeichen) | Abgelöst durch SEPA |
| MT940 FR-Spezifik | Banque de France Kontoauszug | Läuft parallel zu camt.053 |

**CFONB-LCR technisches Format:**
```
Satzart 06: LCR-Einzugsauftrag
Satzart 07: Sammelposten
Zeichen: EBCDIC oder ASCII, 80 Zeichen je Satz
Einreichungsfrist: D-1 über CORE-FR
```

### Steuer-IDs Frankreich

| ID | Format | Bedeutung | SAP-Feld |
|---|---|---|---|
| SIREN | 9 Stellen numerisch | Unternehmens-Registernummer | STCD1 |
| SIRET | 14 Stellen (SIREN + 5 NIC) | Betriebsstättenidentifikation | STCD2 |
| Numéro de TVA intracommunautaire | FR + 2 + SIREN | EU-USt-ID | STCEG |
| Numéro fiscal | 13-stellig | Steueridentifikation natürl. Personen | (nicht relevant für Corp.) |

---

## BLOCK 6 — Go-Live Checkliste Frankreich

### Vorbereitung

- [ ] RIB-Dokumente aller FR-Lieferanten gesammelt → IBAN abgeleitet und geprüft
- [ ] SIRET/SIREN aller FR-Lieferanten in Kreditorenstamm (STCD1/STCD2) gepflegt
- [ ] SIRET der eigenen FR-Gesellschaft in T001/OBY6 hinterlegt
- [ ] Gläubiger-ID (CI) bei Banque de France beantragt (falls SDD)
- [ ] EBICS-Verbindung zu FR-Hausbank aufgebaut (BNP/SocGen: EBICS 3.0)
- [ ] FR-Fabrikkalender in SCAL: 11 Feiertage inkl. 14.07, 08.05, 15.08, 01.11, 11.11
- [ ] LCR-Anforderungen mit FR-Hausbank und Lieferanten abgeklärt
- [ ] Wenn LCR: Add-On oder Custom-DMEE evaluiert und implementiert
- [ ] POBO-Vereinbarung mit FR-Hausbank auf Französisch unterzeichnet
- [ ] pain.001-Format auf FR-spezifische Anforderungen (Remittance Information) geprüft

### Produktivsetzung

- [ ] Testübertragung EBICS Upload/Download erfolgreich
- [ ] pain.001-Testdatei mit FR-Banktestsystem validiert
- [ ] Erster F110-Zahllauf in Produktion; Fehlermeldungen geprüft
- [ ] camt.053-Auszug von FR-Bank empfangen und korrekt verbucht
- [ ] SIRET-Übermittlung in pain.001 verifiziert (Feld Tax/Dbtr/TaxId)
- [ ] SDD-Ersteinzug (FRST) mit D-5-Vorlaufzeit korrekt eingereicht

### Laufender Betrieb

- [ ] LCR-Lieferanten: sukzessive auf SEPA SCT migrieren wo möglich
- [ ] CFONB-Format-Updates durch STET verfolgen (jährliche Releases)
- [ ] PSD3 CoP: FR-Banken-Piloten zum IBAN-Namensabgleich beobachten
- [ ] Fabrikkalender jährlich aktualisieren
- [ ] EBICS-Zertifikate-Ablauf überwachen
