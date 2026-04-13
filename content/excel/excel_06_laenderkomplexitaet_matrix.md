# Global Payments Datenbank — Länderkomplexität-Matrix (Cockpit-Übersicht)

> Schnell-Orientierung pro Land  \|   Grün = kein Problem  \|   Gelb = Besonderheit beachten  \|   Orange = komplex/eingeschränkt  \|   Rot = nicht möglich / verboten  \|  Stand: April 2026

## DACH

### LAND & WÄHRUNG

| Land | ISO / Währung | Region | SEPA- Mitglied |
| --- | --- | --- | --- |
| Deutschland | DE / EUR | DACH | ✓ Ja |
| Österreich | AT / EUR | DACH | ✓ Ja |
| Schweiz | CH / CHF+EUR | DACH | Teilw. (non-EU) |

### ZAHLUNGSINFRASTRUKTUR

| Clearing- System | Instant Payment | SWIFT Erreichbarkeit |
| --- | --- | --- |
| STEP2 / TIPS / T2 | ✓ SCT Inst | ✓ Gut |
| STEP2 / TIPS / T2 | ✓ SCT Inst | ✓ Gut |
| SIC (CHF) / STEP2 (EUR) | ✓ SIC Instant | ✓ Gut |

### IHB / POBO / COBO

| IHB / POBO | COBO / Netting | Lok. Konto erforderlich |
| --- | --- | --- |
| ✓ Vollständig | ✓ Ja | ✗ Nein |
| ✓ Vollständig | ✓ Ja | ✗ Nein |
| ✓ EUR / ⚠ CHF | ✓ Ja | ✓ CHF nötig |

### REGULATORIK & COMPLIANCE

| Devisenkontrolle / Konvertierbar | e-Invoicing Pflicht | Steuer-ID in Zahlung |
| --- | --- | --- |
| Frei / EUR | Nein (geplant 2025+) | ✗ Nein |
| Frei / EUR | Nein | ✗ Nein |
| Frei | QR-Rechnung Pflicht | ✓ CHF-Ref. |

### LOKALE BESONDERHEITEN

| Quellensteuer IC-Zahlungen | Sanktions- risiko | Lokales Format nötig |
| --- | --- | --- |
| Keine | Niedrig | Nein |
| Keine | Niedrig | Nein |
| Keine | Niedrig | ✓ CH-pain.001 |

### SAP-AUFWAND

| SAP-Aufwand (Setup) |
| --- |
| Gering |
| Gering |
| Mittel |

### GESAMTKOMPLEXITÄT

| Gesamt- komplexität | Komplexitäts- score (1-10) |
| --- | --- |
| ★★☆☆☆ Niedrig | 2 |
| ★★☆☆☆ Niedrig | 2 |
| ★★★☆☆ Mittel | 4 |

### WICHTIGSTER HINWEIS

| Wichtigster Hinweis / Hauptbesonderheit |
| --- |
| Benchmark für IHB-Setup. EBICS T+TS als Standard. BaFin ZAG § 2 prüfen. T2-Feiertage in SAP pflegen. |
| 13 AT-Feiertage (mehr als DE!) in SAP pflegen. OeNB CI für SDD. Gruppenbesteuerung AT steuerlich vorteilhaft. |
| DUAL-SETUP: EUR via SEPA + CHF via SIC. QR-Rechnung mit Creditor Reference seit 2022 Pflicht. Kantonale Feiertage in SAP. CH-pain.001.001.03.ch.02 weicht von EPC ab. |

## Benelux

### LAND & WÄHRUNG

| Land | ISO / Währung | Region | SEPA- Mitglied |
| --- | --- | --- | --- |
| Niederlande | NL / EUR | Benelux | ✓ Ja |
| Belgien | BE / EUR | Benelux | ✓ Ja |
| Luxemburg | LU / EUR | Benelux | ✓ Ja |

### ZAHLUNGSINFRASTRUKTUR

| Clearing- System | Instant Payment | SWIFT Erreichbarkeit |
| --- | --- | --- |
| STEP2 / TIPS / T2 | ✓ SCT Inst | ✓ Sehr gut |
| STEP2 / TIPS / T2 | ✓ SCT Inst | ✓ Gut |
| STEP2 / TIPS / T2 | ✓ SCT Inst | ✓ Sehr gut |

### IHB / POBO / COBO

| IHB / POBO | COBO / Netting | Lok. Konto erforderlich |
| --- | --- | --- |
| ✓ Vollständig | ✓ Ja | ✗ Nein |
| ✓ Vollständig | ✓ Ja | ✗ Nein |
| ✓ Vollständig | ✓ Ja | ✗ Nein |

### REGULATORIK & COMPLIANCE

| Devisenkontrolle / Konvertierbar | e-Invoicing Pflicht | Steuer-ID in Zahlung |
| --- | --- | --- |
| Frei / EUR | Nein | ✗ Nein |
| Frei / EUR | Nein | ✗ Nein |
| Frei / EUR | Nein | ✗ Nein |

### LOKALE BESONDERHEITEN

| Quellensteuer IC-Zahlungen | Sanktions- risiko | Lokales Format nötig |
| --- | --- | --- |
| Keine | Niedrig | Nein |
| Keine | Niedrig | Nein |
| Keine | Niedrig | Nein |

### SAP-AUFWAND

| SAP-Aufwand (Setup) |
| --- |
| Gering |
| Gering |
| Gering |

### GESAMTKOMPLEXITÄT

| Gesamt- komplexität | Komplexitäts- score (1-10) |
| --- | --- |
| ★★☆☆☆ Niedrig | 2 |
| ★★☆☆☆ Niedrig | 2 |
| ★★☆☆☆ Niedrig | 2 |

### WICHTIGSTER HINWEIS

| Wichtigster Hinweis / Hauptbesonderheit |
| --- |
| Idealer European Treasury Hub. Notional Pooling gut etabliert. ING/ABN AMRO mit starkem Corporate Treasury Service. Koningsdag 27.4. = voller Bankfeiertag. |
| NBB CI für SDD. 11 Feiertage + regionaler Kalender (Flandern ≠ Wallonien). EU-Institutionen in Brüssel – SEPA-Standard. |
| Beliebt als Finanzholding-Standort. CSSF als Aufsicht. Sehr bankenfreundlich. Standard-SEPA-Setup. |

## Westeuropa

### LAND & WÄHRUNG

| Land | ISO / Währung | Region | SEPA- Mitglied |
| --- | --- | --- | --- |
| Frankreich | FR / EUR | Westeuropa | ✓ Ja |
| Italien | IT / EUR | Westeuropa | ✓ Ja |
| Spanien | ES / EUR | Westeuropa | ✓ Ja |
| Portugal | PT / EUR | Westeuropa | ✓ Ja |
| Griechenland | GR / EUR | Westeuropa | ✓ Ja |

### ZAHLUNGSINFRASTRUKTUR

| Clearing- System | Instant Payment | SWIFT Erreichbarkeit |
| --- | --- | --- |
| STEP2 / TIPS / T2 | ✓ SCT Inst | ✓ Gut |
| STEP2 / TIPS / CBI | ✓ SCT Inst | ✓ Gut |
| STEP2 / TIPS / T2 | ✓ SCT Inst | ✓ Gut |
| STEP2 / TIPS / T2 | ✓ SCT Inst | ✓ Gut |
| STEP2 / TIPS / T2 | ⚠ Wächst | ✓ Gut |

### IHB / POBO / COBO

| IHB / POBO | COBO / Netting | Lok. Konto erforderlich |
| --- | --- | --- |
| ✓ Vollständig | ✓ Ja | ✗ Nein |
| ✓ (CF-Pflicht) | ✓ (eingeschränkt) | ✗ Nein |
| ✓ Vollständig | ✓ Ja | ✗ Nein |
| ✓ Vollständig | ✓ Ja | ✗ Nein |
| ✓ Vollständig | ✓ Ja | ✗ Nein |

### REGULATORIK & COMPLIANCE

| Devisenkontrolle / Konvertierbar | e-Invoicing Pflicht | Steuer-ID in Zahlung |
| --- | --- | --- |
| Frei / EUR | B2B ab 2026 geplant | ✗ Nein |
| Frei / EUR | ✓ Pflicht seit 2019 | ✓ Codice Fiscale |
| Frei / EUR | B2B in Vorbereitung | ✓ NIF/CIF |
| Frei / EUR | AT (e-Invoice Pflicht) | ✓ NIF |
| Frei / EUR | ✓ myDATA Pflicht | ✓ AFM |

### LOKALE BESONDERHEITEN

| Quellensteuer IC-Zahlungen | Sanktions- risiko | Lokales Format nötig |
| --- | --- | --- |
| Keine | Niedrig | Nein |
| Keine | Niedrig | ✓ CBI (lokal) |
| Keine | Niedrig | Nein |
| Keine | Niedrig | Nein |
| Keine | Niedrig | Nein |

### SAP-AUFWAND

| SAP-Aufwand (Setup) |
| --- |
| Gering |
| Mittel |
| Gering |
| Gering |
| Gering |

### GESAMTKOMPLEXITÄT

| Gesamt- komplexität | Komplexitäts- score (1-10) |
| --- | --- |
| ★★☆☆☆ Niedrig | 2 |
| ★★★☆☆ Mittel | 5 |
| ★★★☆☆ Mittel | 3 |
| ★★★☆☆ Mittel | 3 |
| ★★★☆☆ Mittel | 4 |

### WICHTIGSTER HINWEIS

| Wichtigster Hinweis / Hauptbesonderheit |
| --- |
| Chorus Pro (B2B e-Invoicing) ab 2026 stufenweise Pflicht. LCR/BOR (Wechsel) rückläufig. Banque de France CI. Bastille Day 14.7. + Toussaint 1.11. beachten. |
| → [Details unten: Fattura_Elettronica_SDI_Pflicht_seit_2019_Zahlungsreferenz_m] |
| NIF (Personas físicas) / CIF (Empresas) als Steuer-ID in bestimmten Zahlungen. Bizum (Consumer Instant sehr verbreitet). B2B e-Invoicing in Vorbereitung (Verifactu). Banco de España CI. |
| NIF (Número de Identificação Fiscal) in Zahlungen empfohlen. AT (Autoridade Tributária) e-Invoice für öffentl. Auftraggeber Pflicht; B2B in Ausweitung. MB WAY (Consumer Instant). |
| → [Details unten: myDATA_My_Digital_Accounting_Tax_Application_digitale_Buchf_] |

### Fattura_Elettronica_SDI_Pflicht_seit_2019_Zahlungsreferenz_m

Fattura Elettronica (SDI) Pflicht seit 2019 – Zahlungsreferenz muss mit e-Invoice korrelieren. Codice Fiscale in Zahlung erforderlich. CBI-Format für lokale Banken (Intesa, BPM). RIBA/SBF als lokale Instrumente.

### myDATA_My_Digital_Accounting_Tax_Application_digitale_Buchf_

myDATA (My Digital Accounting & Tax Application): digitale Buchführungspflicht seit 2021 – alle Transaktionen werden an AADE (Steuerbehörde) gemeldet. AFM (ΑΦΜ) als Steuer-ID. Instant Payment noch im Ausbau.

## Nordeuropa

### LAND & WÄHRUNG

| Land | ISO / Währung | Region | SEPA- Mitglied |
| --- | --- | --- | --- |
| Schweden | SE / SEK+EUR | Nordeuropa | ✓ (non-EUR) |
| Dänemark | DK / DKK+EUR | Nordeuropa | ✓ (non-EUR) |
| Norwegen | NO / NOK+EUR | Nordeuropa | ✓ (non-EU/non-EUR) |
| Finnland | FI / EUR | Nordeuropa | ✓ Ja |

### ZAHLUNGSINFRASTRUKTUR

| Clearing- System | Instant Payment | SWIFT Erreichbarkeit |
| --- | --- | --- |
| BiR/RIX (SEK) + STEP2 (EUR) | Swish (Consumer) RIX-INST (Interbank) | ✓ Gut |
| Nets (DKK) + STEP2 (EUR) | MobilePay / Straksclearing | ✓ Gut |
| NICS (NOK) + STEP2 (EUR) | Vipps (Consumer) | ✓ Gut |
| STEP2 / TIPS / T2 | ✓ SCT Inst | ✓ Gut |

### IHB / POBO / COBO

| IHB / POBO | COBO / Netting | Lok. Konto erforderlich |
| --- | --- | --- |
| ✓ EUR vollständig | ✓ Ja | ✓ SEK nötig |
| ✓ EUR vollständig | ✓ Ja | ✓ DKK nötig |
| ✓ EUR vollständig | ✓ Ja | ✓ NOK nötig |
| ✓ Vollständig | ✓ Ja | ✗ Nein |

### REGULATORIK & COMPLIANCE

| Devisenkontrolle / Konvertierbar | e-Invoicing Pflicht | Steuer-ID in Zahlung |
| --- | --- | --- |
| Frei | Nein | ✗ Nein |
| Frei | Nein | ✗ Nein |
| Frei | Nein | ✗ Nein |
| Frei / EUR | Nein | ✗ Nein |

### LOKALE BESONDERHEITEN

| Quellensteuer IC-Zahlungen | Sanktions- risiko | Lokales Format nötig |
| --- | --- | --- |
| Keine | Niedrig | Nein |
| Keine | Niedrig | Nein |
| Keine | Niedrig | Nein |
| Keine | Niedrig | Nein |

### SAP-AUFWAND

| SAP-Aufwand (Setup) |
| --- |
| Gering |
| Gering |
| Gering |
| Gering |

### GESAMTKOMPLEXITÄT

| Gesamt- komplexität | Komplexitäts- score (1-10) |
| --- | --- |
| ★★★☆☆ Mittel | 3 |
| ★★★☆☆ Mittel | 3 |
| ★★★☆☆ Mittel | 3 |
| ★★☆☆☆ Niedrig | 2 |

### WICHTIGSTER HINWEIS

| Wichtigster Hinweis / Hauptbesonderheit |
| --- |
| DUAL-CURRENCY: EUR via SEPA problemlos; SEK über nationales BiR/RIX. Swish sehr verbreitet (Consumer). SCT Inst für SEK erst ab Jan. 2027 Pflicht. Midsommar (Jun) + Nationalfeiertag (6.6.) beachten. |
| DUAL-CURRENCY: EUR via SEPA; DKK via Nets Clearing. MobilePay (Consumer Instant) extrem verbreitet. Straksclearing = DKK Instant. Grundlovsdag (5.6.) + Pinse (Pfingstmontag) beachten. |
| NICHT EU-Mitglied (EWR). NOK-Zahlungen über NICS. Vipps (Consumer Instant sehr verbreitet). Norwegen hat viele Feiertage rund um Ostern und 17. Mai (Nationalfeiertag). |
| Standard SEPA-Setup. MobilePay (Dänemark) und Pivo/Siirto (FI Consumer Instant). Midsommar (Jun) + Unabhängigkeitstag 6.12. beachten. |

## Osteuropa

### LAND & WÄHRUNG

| Land | ISO / Währung | Region | SEPA- Mitglied |
| --- | --- | --- | --- |
| Polen | PL / PLN+EUR | Osteuropa | ✓ (non-EUR) |
| Tschechien | CZ / CZK+EUR | Osteuropa | ✓ (non-EUR) |
| Ungarn | HU / HUF+EUR | Osteuropa | ✓ (non-EUR) |
| Rumänien | RO / RON+EUR | Osteuropa | ✓ (non-EUR) |

### ZAHLUNGSINFRASTRUKTUR

| Clearing- System | Instant Payment | SWIFT Erreichbarkeit |
| --- | --- | --- |
| ELIXIR (PLN) + STEP2 (EUR) | BLIK (Consumer) Express ELIXIR (Instant) | ✓ Gut |
| CERTIS (CZK) + STEP2 (EUR) | ⚠ Im Aufbau | ✓ Gut |
| GIRO (HUF) + STEP2 (EUR) | ✓ AFR (HUF Instant seit 2020) | ✓ Gut |
| SENT (RON) + STEP2 (EUR) | ⚠ Im Aufbau | ✓ Gut |

### IHB / POBO / COBO

| IHB / POBO | COBO / Netting | Lok. Konto erforderlich |
| --- | --- | --- |
| ✓ EUR vollständig | ✓ Ja | ✓ PLN nötig |
| ✓ EUR vollständig | ✓ Ja | ✓ CZK nötig |
| ✓ EUR vollständig | ✓ Ja | ✓ HUF nötig |
| ✓ EUR vollständig | ✓ Ja | ✓ RON nötig |

### REGULATORIK & COMPLIANCE

| Devisenkontrolle / Konvertierbar | e-Invoicing Pflicht | Steuer-ID in Zahlung |
| --- | --- | --- |
| Frei | KSeF geplant 2025 | ✓ NIP (Steuer-ID) |
| Frei | Nein | ✓ IČO (Firmen-ID) |
| Frei | eÁFA in Vorbereitung | ✓ Adószám |
| Frei | e-Factura Pflicht seit 2024 | ✓ CUI |

### LOKALE BESONDERHEITEN

| Quellensteuer IC-Zahlungen | Sanktions- risiko | Lokales Format nötig |
| --- | --- | --- |
| Keine | Niedrig | Nein |
| Keine | Niedrig | Nein |
| Keine | Niedrig | Nein |
| Keine | Niedrig | Nein |

### SAP-AUFWAND

| SAP-Aufwand (Setup) |
| --- |
| Mittel |
| Gering |
| Gering |
| Mittel |

### GESAMTKOMPLEXITÄT

| Gesamt- komplexität | Komplexitäts- score (1-10) |
| --- | --- |
| ★★★☆☆ Mittel | 4 |
| ★★★☆☆ Mittel | 3 |
| ★★★☆☆ Mittel | 3 |
| ★★★☆☆ Mittel | 4 |

### WICHTIGSTER HINWEIS

| Wichtigster Hinweis / Hauptbesonderheit |
| --- |
| DUAL-CURRENCY: PLN via ELIXIR; EUR via SEPA. BLIK extrem verbreitet (Consumer). KSeF (Krajowy System e-Faktur) = poln. e-Invoicing Pflicht geplant. NIP (Numer Identyfikacji Podatkowej) als Steuer-ID. |
| DUAL-CURRENCY: CZK via CERTIS; EUR via SEPA. IČO (Identifikační číslo osoby) als tschechische Unternehmens-ID in Transaktionen. Instant Payment im Aufbau. |
| AFR (Azonnali Fizetési Rendszer) = HUF Instant seit März 2020, 24/7 Pflicht für alle HUF-Überweisungen. DUAL-CURRENCY Setup nötig. Adószám (HU-Steuer-ID) in Zahlungen. |
| e-Factura (RO e-Invoice) Pflicht seit Jan. 2024 für B2B-Transaktionen. CUI (Cod Unic de Înregistrare) = RO-Unternehmens-ID. DUAL-CURRENCY: RON via SENT; EUR via SEPA. |

## UK & Irland

### LAND & WÄHRUNG

| Land | ISO / Währung | Region | SEPA- Mitglied |
| --- | --- | --- | --- |
| Großbritannien | GB / GBP+EUR | UK & Irland | ✓ (post-Brexit non-EU) |
| Irland | IE / EUR | UK & Irland | ✓ Ja |

### ZAHLUNGSINFRASTRUKTUR

| Clearing- System | Instant Payment | SWIFT Erreichbarkeit |
| --- | --- | --- |
| CHAPS / FPS / BACS | ✓ FPS (GBP Instant) | ✓ Sehr gut |
| STEP2 / TIPS / T2 | ✓ SCT Inst | ✓ Gut |

### IHB / POBO / COBO

| IHB / POBO | COBO / Netting | Lok. Konto erforderlich |
| --- | --- | --- |
| ✓ (mit Vereinbarung) | ✓ (eingeschränkt) | ✓ GBP nötig |
| ✓ Vollständig | ✓ Ja | ✗ Nein |

### REGULATORIK & COMPLIANCE

| Devisenkontrolle / Konvertierbar | e-Invoicing Pflicht | Steuer-ID in Zahlung |
| --- | --- | --- |
| Frei | Making Tax Digital (MTD) | ✗ Nein |
| Frei / EUR | Nein | ✗ Nein |

### LOKALE BESONDERHEITEN

| Quellensteuer IC-Zahlungen | Sanktions- risiko | Lokales Format nötig |
| --- | --- | --- |
| Keine | Niedrig | ✓ BACS/FPS |
| Keine | Niedrig | Nein |

### SAP-AUFWAND

| SAP-Aufwand (Setup) |
| --- |
| Hoch |
| Gering |

### GESAMTKOMPLEXITÄT

| Gesamt- komplexität | Komplexitäts- score (1-10) |
| --- | --- |
| ★★★★☆ Hoch | 6 |
| ★★☆☆☆ Niedrig | 2 |

### WICHTIGSTER HINWEIS

| Wichtigster Hinweis / Hauptbesonderheit |
| --- |
| → [Details unten: POST-BREXIT_GBP-Zahlungen_ber_CHAPS_FPS_BACS_eigenes_UK-Kont] |
| EU-Mitglied, EUR, Standard SEPA-Setup. Irland = beliebter EU-Holdingstandort (Apple, Google, Meta). CBI (Central Bank of Ireland) als Aufsicht. |

### POST-BREXIT_GBP-Zahlungen_ber_CHAPS_FPS_BACS_eigenes_UK-Kont

POST-BREXIT: GBP-Zahlungen über CHAPS/FPS/BACS – eigenes UK-Konto dringend empfohlen. UK PSD2 (PSR 2017) statt EU PSD2. BACS DD statt SEPA SDD. FPS = GBP Instant bis GBP 1 Mio. SEPA-Erreichbarkeit nicht mehr garantiert.

## APAC

### LAND & WÄHRUNG

| Land | ISO / Währung | Region | SEPA- Mitglied |
| --- | --- | --- | --- |
| China | CN / CNY | APAC | ✗ Nein |
| Japan | JP / JPY | APAC | ✗ Nein |
| Australien | AU / AUD | APAC | ✗ Nein |
| Singapur | SG / SGD | APAC | ✗ Nein |
| Indien | IN / INR | APAC | ✗ Nein |

### ZAHLUNGSINFRASTRUKTUR

| Clearing- System | Instant Payment | SWIFT Erreichbarkeit |
| --- | --- | --- |
| CNAPS / CIPS | ✓ NetsUnion (lokal) | ⚠ CIPS |
| Zengin / BOJ-NET | ✓ Zengin Instant (24/7) | ✓ Gut |
| NPP / RITS | ✓ NPP (PayID, Instant) | ✓ Gut |
| FAST / MEPS+ | ✓ FAST (Instant 24/7) | ✓ Sehr gut |
| NEFT / RTGS / UPI | ✓ UPI (Consumer Instant) | ⚠ Begrenzt |

### IHB / POBO / COBO

| IHB / POBO | COBO / Netting | Lok. Konto erforderlich |
| --- | --- | --- |
| ✗ Verboten | ✗ Verboten | ✓ PFLICHT |
| ⚠ (lokales Konto nötig) | ⚠ Eingeschränkt | ✓ JPY nötig |
| ⚠ (lokales Konto empfohlen) | ⚠ Eingeschränkt | ✓ AUD empfohlen |
| ⚠ (lokales Konto empfohlen) | ✓ Ja | ✓ SGD empfohlen |
| ✗ Verboten | ✗ Verboten | ✓ PFLICHT |

### REGULATORIK & COMPLIANCE

| Devisenkontrolle / Konvertierbar | e-Invoicing Pflicht | Steuer-ID in Zahlung |
| --- | --- | --- |
| Kontrolliert (nicht konvertierbar) | ✓ VAT Fapiao Pflicht | ✓ USCI Pflicht |
| Bedingt konvertierbar (>JPY 30 Mio: Meldung) | Nein | ✓ Katakana-Pflicht |
| Frei | Nein | ✗ Nein |
| Frei | Nein | ✗ Nein |
| Kontrolliert (FEMA) | ✓ GST e-Invoice Pflicht | ✓ PAN/GSTIN Pflicht |

### LOKALE BESONDERHEITEN

| Quellensteuer IC-Zahlungen | Sanktions- risiko | Lokales Format nötig |
| --- | --- | --- |
| Hoch | Mittel | ✓ CNAPS (komplex) |
| Niedrig | Niedrig | ✓ Zengin-Format |
| Keine | Niedrig | ✓ BSB+Account Nr. |
| Keine | Niedrig | ✓ FAST-Format |
| Hoch | Niedrig | ✓ Proprietär |

### SAP-AUFWAND

| SAP-Aufwand (Setup) |
| --- |
| Sehr hoch |
| Hoch |
| Mittel |
| Mittel |
| Sehr hoch |

### GESAMTKOMPLEXITÄT

| Gesamt- komplexität | Komplexitäts- score (1-10) |
| --- | --- |
| ★★★★★ Sehr hoch | 10 |
| ★★★★☆ Hoch | 7 |
| ★★★☆☆ Mittel | 4 |
| ★★★☆☆ Mittel | 4 |
| ★★★★★ Sehr hoch | 9 |

### WICHTIGSTER HINWEIS

| Wichtigster Hinweis / Hauptbesonderheit |
| --- |
| → [Details unten: VOLLST_NDIGE_DEVISENKONTROLLE_POBO_COBO_verboten_Eigenes_CNY] |
| → [Details unten: Zengin-Format_KEIN_IBAN_Katakana-Pflicht_f_r_Empf_ngernamen_] |
| → [Details unten: NPP_New_Payments_Platform_AUD_Instant_seit_2018_PayID-System] |
| → [Details unten: FAST_Fast_and_Secure_Transfers_SGD_Instant_24_7_MEPS_SGD_RTG] |
| → [Details unten: FEMA-DEVISENKONTROLLE_POBO_COBO_verboten_Lokales_Konto_PFLIC] |

### VOLLST_NDIGE_DEVISENKONTROLLE_POBO_COBO_verboten_Eigenes_CNY

VOLLSTÄNDIGE DEVISENKONTROLLE: POBO/COBO verboten. Eigenes CNY-Konto PFLICHT. SAFE-Genehmigung für alle grenzüberschr. Zahlungen. VAT Fapiao (e-Invoice) Pflicht. USCI (18-stellig) in Zahlungen. CIPS als SWIFT-Alternative. Nur Reporting-Integration in IHB.

### Zengin-Format_KEIN_IBAN_Katakana-Pflicht_f_r_Empf_ngernamen_

Zengin-Format: KEIN IBAN, Katakana-Pflicht für Empfängernamen. Bankcode (7-stellig) + Filialnummer (3-stellig). Golden Week (Ende Apr/Anfang Mai): 4–5 Bankarbeitstage gesperrt. BOJ-Meldepflicht > JPY 30 Mio. 16 Feiertage/Jahr.

### NPP_New_Payments_Platform_AUD_Instant_seit_2018_PayID-System

NPP (New Payments Platform) = AUD Instant seit 2018, PayID-System. BSB (Bank State Branch, 6-stellig) + Kontonummer statt IBAN. RITS (RBA) = AUD RTGS. AUD gut konvertierbar. Standard SWIFT für internationale Zahlungen.

### FAST_Fast_and_Secure_Transfers_SGD_Instant_24_7_MEPS_SGD_RTG

FAST (Fast and Secure Transfers) = SGD Instant 24/7. MEPS+ = SGD RTGS. SGD frei konvertierbar. MAS (Monetary Authority of Singapore) = proaktive, unternehmensfreundliche Regulierung. Sehr guter SWIFT-Hub für APAC.

### FEMA-DEVISENKONTROLLE_POBO_COBO_verboten_Lokales_Konto_PFLIC

FEMA-DEVISENKONTROLLE: POBO/COBO verboten. Lokales Konto PFLICHT. RBI Purpose Code für alle grenzüberschr. Zahlungen. PAN/GSTIN in Zahlungen. TDS (Quellensteuer) auf IC-Zinsen. GST e-Invoice Pflicht. UPI dominiert Consumer. Lokaler Finance Manager nötig.

## Americas

### LAND & WÄHRUNG

| Land | ISO / Währung | Region | SEPA- Mitglied |
| --- | --- | --- | --- |
| USA | US / USD | Americas | ✗ Nein |
| Kanada | CA / CAD | Americas | ✗ Nein |
| Brasilien | BR / BRL | Americas | ✗ Nein |
| Mexiko | MX / MXN | Americas | ✗ Nein |

### ZAHLUNGSINFRASTRUKTUR

| Clearing- System | Instant Payment | SWIFT Erreichbarkeit |
| --- | --- | --- |
| Fedwire / ACH / RTP | ✓ FedNow / RTP (Instant) | ✓ Sehr gut |
| Lynx / AFT / Interac | ✓ Interac e-Transfer | ✓ Gut |
| PIX / STR / TED | ✓ PIX (Instant 24/7) | ⚠ Begrenzt |
| SPEI / SPID | ✓ SPEI (Instant 24/7) | ⚠ Begrenzt |

### IHB / POBO / COBO

| IHB / POBO | COBO / Netting | Lok. Konto erforderlich |
| --- | --- | --- |
| ⚠ (MTL-Prüfung nötig) | ⚠ Eingeschränkt | ✓ USD empfohlen |
| ⚠ (lokales Konto empfohlen) | ⚠ Eingeschränkt | ✓ CAD empfohlen |
| ✗ Verboten | ✗ Verboten | ✓ PFLICHT |
| ⚠ Eingeschränkt | ⚠ Eingeschränkt | ✓ MXN empfohlen |

### REGULATORIK & COMPLIANCE

| Devisenkontrolle / Konvertierbar | e-Invoicing Pflicht | Steuer-ID in Zahlung |
| --- | --- | --- |
| Frei | Nein | ✗ Nein |
| Frei | Nein | ✗ Nein |
| Kontrolliert (IOF-Steuer) | ✓ NF-e Pflicht | ✓ CNPJ Pflicht |
| Bedingt frei (Regulierung) | ✓ CFDI Pflicht | ✓ RFC Pflicht |

### LOKALE BESONDERHEITEN

| Quellensteuer IC-Zahlungen | Sanktions- risiko | Lokales Format nötig |
| --- | --- | --- |
| OFAC-Screening Pflicht | Niedrig | ✓ NACHA (ACH) |
| Keine | Niedrig | ✓ AFT-Format |
| Hoch (IOF) | Niedrig | ✓ FEBRABAN |
| Mittel | Niedrig | ✓ SPEI-Format |

### SAP-AUFWAND

| SAP-Aufwand (Setup) |
| --- |
| Hoch |
| Mittel |
| Sehr hoch |
| Hoch |

### GESAMTKOMPLEXITÄT

| Gesamt- komplexität | Komplexitäts- score (1-10) |
| --- | --- |
| ★★★★☆ Hoch | 6 |
| ★★★☆☆ Mittel | 4 |
| ★★★★★ Sehr hoch | 9 |
| ★★★★☆ Hoch | 7 |

### WICHTIGSTER HINWEIS

| Wichtigster Hinweis / Hauptbesonderheit |
| --- |
| → [Details unten: NACHA-Format_f_r_ACH_kein_ISO_20022_Routing_Number_ABA_9-ste] |
| → [Details unten: AFT_Automated_Funds_Transfer_CA-ACH-_quivalent_Lynx_CAD_RTGS] |
| → [Details unten: IOF-Steuer_auf_alle_Devisenzahlungen_NF-e_Nota_Fiscal_Eletr_] |
| → [Details unten: CFDI_Comprobante_Fiscal_Digital_por_Internet_MX_e-Invoice_Pf] |

### NACHA-Format_f_r_ACH_kein_ISO_20022_Routing_Number_ABA_9-ste

NACHA-Format für ACH (kein ISO 20022). Routing Number (ABA, 9-stellig) statt IBAN. OFAC-Screening für alle USD-Zahlungen weltweit. State Money Transmitter Laws für POBO prüfen. Fedwire für Großbetrag; ACH für Massenverwendung. 10 Federal Holidays.

### AFT_Automated_Funds_Transfer_CA-ACH-_quivalent_Lynx_CAD_RTGS

AFT (Automated Funds Transfer) = CA-ACH-Äquivalent. Lynx = CAD RTGS (Nachfolger LVTS). Transit Number (5-stellig) + Kontonummer statt IBAN. Interac = Consumer Instant. CAD frei konvertierbar. Bilingual (EN/FR in Quebec).

### IOF-Steuer_auf_alle_Devisenzahlungen_NF-e_Nota_Fiscal_Eletr_

IOF-Steuer auf alle Devisenzahlungen. NF-e (Nota Fiscal Eletrônica) Pflicht für alle Transaktionen. CNPJ (14-stellig) in Zahlungen. PIX = Instant 24/7, dominiert BR-Inland. POBO/COBO verboten. BCB-Meldung für alle Auslandstransfers. SAP BR-Add-On nötig.

### CFDI_Comprobante_Fiscal_Digital_por_Internet_MX_e-Invoice_Pf

CFDI (Comprobante Fiscal Digital por Internet) = MX e-Invoice Pflicht für alle Transaktionen. RFC (Registro Federal de Contribuyentes) = MX-Steuer-ID in Zahlungen Pflicht. SPEI = Instant 24/7, günstig. CLABE (18-stellig) statt IBAN. SAT-Behörde = strenge Compliance.

## Middle East / Afrika

### LAND & WÄHRUNG

| Land | ISO / Währung | Region | SEPA- Mitglied |
| --- | --- | --- | --- |
| VAE / Dubai | AE / AED | Middle East / Afrika | ✗ Nein |
| Saudi-Arabien | SA / SAR | Middle East / Afrika | ✗ Nein |
| Südafrika | ZA / ZAR | Middle East / Afrika | ✗ Nein |

### ZAHLUNGSINFRASTRUKTUR

| Clearing- System | Instant Payment | SWIFT Erreichbarkeit |
| --- | --- | --- |
| UAEFTS / IPP | ✓ UAEFTS Instant | ✓ Gut |
| SARIE / SAMA | ✓ SARIE Instant | ⚠ Begrenzt |
| SAMOS / RTC | ✓ RTC (Instant) | ✓ Gut |

### IHB / POBO / COBO

| IHB / POBO | COBO / Netting | Lok. Konto erforderlich |
| --- | --- | --- |
| ⚠ (lokales Konto nötig) | ⚠ Eingeschränkt | ✓ AED nötig |
| ⚠ Eingeschränkt | ⚠ Eingeschränkt | ✓ SAR nötig |
| ⚠ Eingeschränkt | ⚠ Eingeschränkt | ✓ ZAR nötig |

### REGULATORIK & COMPLIANCE

| Devisenkontrolle / Konvertierbar | e-Invoicing Pflicht | Steuer-ID in Zahlung |
| --- | --- | --- |
| Frei (AED an USD gebunden) | Nein (kein VAT auf Zahlungen) | ✗ Nein |
| Bedingt frei (SAR an USD gebunden) | ✓ Fatoora e-Invoice Pflicht | ✓ VAT-Nr. Pflicht |
| Devisenkontrolle (SARB) | Nein | ✓ SARS Tax Nr. |

### LOKALE BESONDERHEITEN

| Quellensteuer IC-Zahlungen | Sanktions- risiko | Lokales Format nötig |
| --- | --- | --- |
| Niedrig | Niedrig | ✓ UAEFTS-Format |
| Mittel | Niedrig | ✓ SARIE-Format |
| Mittel | Niedrig | ✓ ZAEFT-Format |

### SAP-AUFWAND

| SAP-Aufwand (Setup) |
| --- |
| Mittel |
| Hoch |
| Hoch |

### GESAMTKOMPLEXITÄT

| Gesamt- komplexität | Komplexitäts- score (1-10) |
| --- | --- |
| ★★★☆☆ Mittel | 4 |
| ★★★★☆ Hoch | 6 |
| ★★★★☆ Hoch | 6 |

### WICHTIGSTER HINWEIS

| Wichtigster Hinweis / Hauptbesonderheit |
| --- |
| → [Details unten: AED_an_USD_gebunden_Pegged_Currency_kein_FX-Risiko_AED_USD_U] |
| → [Details unten: Fatoora_SA_e-Invoice_Pflicht_Phase_1_Ausstellung_seit_2021_P] |
| → [Details unten: SARB_South_African_Reserve_Bank_Devisen-regulierung_EFT_Elec] |

### AED_an_USD_gebunden_Pegged_Currency_kein_FX-Risiko_AED_USD_U

AED an USD gebunden (Pegged Currency): kein FX-Risiko AED/USD. UAEFTS = UAE Instant Transfers. Kein Income Tax (seit 2023: 9% Corporate Tax). DIFC/ADGM als internationale Financial Centers mit eigenen Regelwerken. Freitagsfeiertage beachten.

### Fatoora_SA_e-Invoice_Pflicht_Phase_1_Ausstellung_seit_2021_P

Fatoora = SA e-Invoice Pflicht (Phase 1: Ausstellung seit 2021; Phase 2: Integration mit ZATCA seit 2022). VAT 15% seit 2020. SAR an USD gebunden. Vision 2030 treibt Digitalisierung. SAMA = Saudi Central Bank. Wochenende: Fr+Sa.

### SARB_South_African_Reserve_Bank_Devisen-regulierung_EFT_Elec

SARB (South African Reserve Bank) Devisen-regulierung. EFT (Electronic Funds Transfer) Standard für Inlandszahlungen. ZAEFT-Format (proprietär). Alle Devisenzahlungen > ZAR 1 Mio meldepflichtig. ZAR volatil. Korruptionsrisiko beachten.