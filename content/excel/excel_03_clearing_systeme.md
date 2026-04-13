# Global Payments Datenbank — Clearing- & Settlement-Systeme

> Stand: April 2026  \|  Experten-Version (blau) + Einsteiger-Version (grün)  \|  Quellen: ECB, BIS, EPC, SWIFT, nationale Zentralbanken

## SEPA – Europäische Zahlungssysteme

### IDENTIFIKATION

| System-Name | Abkürzung | Typ | Region / Land | Betreiber |
| --- | --- | --- | --- | --- |
| STEP2 – SEPA Credit Transfer | STEP2-T | DNS – Deferred Net Settlement (Sammelverrechnung) | SEPA-Raum (36 Länder) | EBA Clearing (Paris) |
| TARGET Instant Payment Settlement | TIPS | RTGS-ähnlich – Echtzeit-Settlement (Individual, 24/7) | SEPA-Raum / Eurozone | Europäische Zentralbank (EZB) |
| TARGET2 / TARGET (T2) | T2 | RTGS – Real-Time Gross Settlement (Großbetrag, Einzelverrechnung) | Eurozone + opt. Nicht-EUR EU-Länder | Europäische Zentralbank (EZB) + nationale Zentralbanken |

### SYSTEMBESCHREIBUNG

| Systembeschreibung (Experte) | Systembeschreibung (Einsteiger) |
| --- | --- |
| → [Details unten: Multilaterales_Netting-System_f_r_SEPA_Credit_Transfers_SCT_] | → [Details unten: Multilaterales_Netting-System_f_r_SEPA_Credit_Transfers_SCT_] |
| → [Details unten: TIPS_ist_das_EZB-eigene_Instant_Payment_Settlement-System_f_] | → [Details unten: TIPS_ist_das_EZB-eigene_Instant_Payment_Settlement-System_f_] |
| → [Details unten: TARGET2_seit_Nov_2022_konsolidiert_als_T2_ist_das_RTGS-Syste] | → [Details unten: TARGET2_seit_Nov_2022_konsolidiert_als_T2_ist_das_RTGS-Syste] |

### TECHNISCHE DETAILS

| Nachrichtenformat | Settlement-Modell & Zyklen | Betriebszeiten & Cut-offs |
| --- | --- | --- |
| SCT: ISO 20022 pacs.008.001.02+ SDD: ISO 20022 pacs.003 Status: pacs.002 Return: pacs.004 R-Messages: pacs.002 / camt.056 | → [Details unten: SCT_ISO_20022_pacs_008_001_02_SDD_ISO_20022_pacs_003_Status_] | → [Details unten: SCT_ISO_20022_pacs_008_001_02_SDD_ISO_20022_pacs_003_Status_] |
| ISO 20022: pacs.008.001.08+ (SCT Inst) pacs.002 (Status) pacs.004 (Return) camt.054 (Gutschrift-Benachrichtigung)  Kommunikation: SWIFT gpi / TIPS-Gateway oder EBA RT1 als Alternative | → [Details unten: ISO_20022_pacs_008_001_08_SCT_Inst_pacs_002_Status_pacs_004_] | → [Details unten: ISO_20022_pacs_008_001_08_SCT_Inst_pacs_002_Status_pacs_004_] |
| → [Details unten: ISO_20022_seit_Nov_2022_pacs_008_Kundenzahlung_pacs_009_Inte] | → [Details unten: ISO_20022_seit_Nov_2022_pacs_008_Kundenzahlung_pacs_009_Inte] | → [Details unten: ISO_20022_seit_Nov_2022_pacs_008_Kundenzahlung_pacs_009_Inte] |

### TEILNEHMER & ZUGANG

| Direkte Teilnehmer & Zugang |
| --- |
| → [Details unten: Ca_250_direkte_Teilnehmer_Banken_Indirekter_Zugang_ber_direk] |
| → [Details unten: Ca_60_direkte_Teilnehmer_Banken_mit_TIPS_DCA_Indirekte_Teiln] |
| → [Details unten: Direkte_Teilnehmer_Ca_1_000_Kreditinstitute_in_der_Eurozone_] |

### RELEVANZ FÜR CORPORATES

| Relevanz & Auswirkung (Experte) | Relevanz & Auswirkung (Einsteiger) |
| --- | --- |
| → [Details unten: 1_VALUTA-STEUERUNG_Durch_die_3_SCT-Zyklen_k_nnen_Corporates_] | → [Details unten: 1_VALUTA-STEUERUNG_Durch_die_3_SCT-Zyklen_k_nnen_Corporates_] |
| → [Details unten: 1_LIQUIDIT_TS-MANAGEMENT_Keine_Puffer-Zeit_mehr_zwischen_Zah] | → [Details unten: 1_LIQUIDIT_TS-MANAGEMENT_Keine_Puffer-Zeit_mehr_zwischen_Zah] |
| → [Details unten: 1_URGP_SDVA-ZAHLUNGEN_Corporate_kann_in_pain_001_PmtTpInf_Sv] | → [Details unten: 1_URGP_SDVA-ZAHLUNGEN_Corporate_kann_in_pain_001_PmtTpInf_Sv] |

### CORPORATE ZUGANG & PRAXIS

| Corporate Zugang & SAP-Anbindung (Experte) | Corporate Zugang & SAP-Anbindung (Einsteiger) |
| --- | --- |
| → [Details unten: Corporate-Zugang_ausschlie_lich_indirekt_ber_Hausbank_SAP-Re] | → [Details unten: Corporate-Zugang_ausschlie_lich_indirekt_ber_Hausbank_SAP-Re] |
| → [Details unten: Corporate-Zugang_indirekt_ber_Hausbank_wie_STEP2_SAP-Konfigu] | → [Details unten: Corporate-Zugang_indirekt_ber_Hausbank_wie_STEP2_SAP-Konfigu] |
| → [Details unten: Corporate-Zugang_indirekt_ber_Hausbank_SAP-Konfiguration_Svc] | → [Details unten: Corporate-Zugang_indirekt_ber_Hausbank_SAP-Konfiguration_Svc] |

### STATUS

| Status / Entwicklung |
| --- |
| Aktiv; Hauptsystem für SEPA-Massenzahlungen Ergänzt durch TIPS (Instant) Kontinuierliche Kapazitätserweiterung |
| Aktiv seit Nov. 2018 Wächst stark durch Instant Payments-Verordnung 2024 SEK/DKK-Erweiterung in Planung |
| Aktiv; konsolidiert als T2 seit Nov. 2022 Nachfolger-Plattform T2+T2S operativ Kerninfrastruktur des Euroraums |

### Multilaterales_Netting-System_f_r_SEPA_Credit_Transfers_SCT_

Multilaterales Netting-System für SEPA Credit Transfers (SCT) und SEPA Direct Debits (SDD). Betrieben von EBA Clearing. Verrechnung erfolgt als Deferred Net Settlement (DNS): Zahlungen werden über den Tag gesammelt, am Tagesende wird der Nettobetrag über TARGET2-Konten der teilnehmenden Banken verrechnet. Verarbeitungskapazität: über 25 Millionen Transaktionen täglich. STEP2 ist neben dem EZB-eigenen TIPS das Haupt-Clearing-System für SEPA-Massenzahlungen.  Funktionsweise DNS: 1) Bank A schickt SCT über STEP2 an Bank B 2) STEP2 sammelt alle Zahlungen zwischen A→B und B→A 3) Tagesende: STEP2 berechnet Nettopositionen 4) Nur der Nettobetrag wird über TARGET2 verrechnet (spart Liquidität) 5) Empfänger-Bank gutschreibt Endkunden bis D+1

### Multilaterales_Netting-System_f_r_SEPA_Credit_Transfers_SCT_

STEP2 ist das große europäische Rechenzentrum für SEPA-Überweisungen. Wenn Sie als deutsches Unternehmen einem italienischen Lieferanten Geld überweisen, läuft das durch STEP2.  So funktioniert es vereinfacht: 1) Ihre Bank schickt Ihre Überweisung an STEP2 2) STEP2 sammelt den ganzen Tag lang alle Überweisungen zwischen allen europäischen Banken 3) Am Tagesende rechnet STEP2 aus: Bank A schuldet Bank B netto X Euro – und überweist nur diesen Nettobetrag 4) Ihr Lieferant bekommt das Geld spätestens am nächsten Bankarbeitstag  Als Unternehmen sehen Sie STEP2 nie direkt – es ist die Infrastruktur im Hintergrund.

### TIPS_ist_das_EZB-eigene_Instant_Payment_Settlement-System_f_

TIPS ist das EZB-eigene Instant Payment Settlement-System für SCT Inst (SEPA Instant Credit Transfer). Im Gegensatz zu STEP2 (DNS) erfolgt Settlement bei TIPS in Echtzeit und final (RTGS-ähnlich) auf Zentralbankgeld-Basis. Jede Transaktion wird einzeln und sofort verrechnet – kein Netting. Betrieb 24/7/365 inkl. Wochenenden und Feiertage.  Technischer Ablauf: 1) Corporate initiiert SCT Inst (pain.001 mit SvcLvl INST) 2) Auftraggeber-Bank prüft intern und sendet pacs.008 an TIPS 3) TIPS prüft Deckung auf TIPS-DCA-Konto (Dedicated Cash Account) der Bank 4) TIPS bucht Betrag von DCA Auftraggeber-Bank ab und auf DCA Empfänger-Bank gut 5) Empfänger-Bank gutschreibt Endkunden 6) Gesamtzeit: < 10 Sekunden Ende-zu-Ende 7) Settlement ist final und unwiderruflich ab TIPS-Buchung

### TIPS_ist_das_EZB-eigene_Instant_Payment_Settlement-System_f_

TIPS ist das Echtzeit-Zahlungssystem der Europäischen Zentralbank. Wenn Sie oder Ihr Lieferant eine Sofortüberweisung (Instant Payment) machen, läuft das Settlement durch TIPS.  Der Unterschied zu STEP2: • STEP2: sammelt Zahlungen → verrechnet am Tagesende → D+1 • TIPS: verrechnet jede Zahlung sofort, einzeln → < 10 Sekunden → 24/7  Für Sie als Unternehmen wichtig: • Sofortüberweisungen gehen über TIPS • Auch am Samstagnacht um 23:00 Uhr • Sobald TIPS die Zahlung verbucht hat, ist sie final – keine Rückholung möglich

### TARGET2_seit_Nov_2022_konsolidiert_als_T2_ist_das_RTGS-Syste

TARGET2 (seit Nov. 2022: konsolidiert als T2) ist das RTGS-System der EZB für Euro-Großbetragszahlungen. Jede Zahlung wird sofort und einzeln auf Zentralbankgeld-Basis verrechnet (kein Netting). Genutzt für: Interbanken-Settlement, Notenbank-Operationen, Settlement von STEP2/TIPS-Nettopositionen, dringende Kundenzahlungen.  T2-Konsolidierung (Nov. 2022): TARGET2 wurde mit TARGET2-Securities (T2S) auf einer gemeinsamen Plattform zusammengeführt. Neue Architektur: Central Liquidity Management (CLM) + Real-Time Gross Settlement (RTGS). ISO 20022 als neues Nachrichtenformat (pacs.009 für Interbank, pacs.008 für Kundenzahlungen).  Für Corporates direkt relevant: Dringende Einzelzahlungen (URGP) und Same-Day-Value-Zahlungen können über T2 anstatt STEP2 geroutet werden.

### TARGET2_seit_Nov_2022_konsolidiert_als_T2_ist_das_RTGS-Syste

TARGET2 (jetzt T2) ist das 'Hochgeschwindigkeitssystem' für sehr große und sehr dringende Euro-Zahlungen zwischen Banken. Während STEP2 für normale tägliche Überweisungen zuständig ist, nutzt T2 die Zentralbank wenn es schnell und sicher gehen muss.  Einfaches Beispiel: Wenn eine Bank einer anderen Bank sofort 500 Millionen Euro überweisen muss (z.B. für einen Kredit), geht das über T2 – sofort, auf die Sekunde.  Für Ihr Unternehmen relevant: Wenn Sie eine sehr dringende Zahlung haben die noch heute ankommen muss (z.B. eine Unternehmensübernahme), kann Ihre Bank diese über T2 routen – das ist aber teurer als normale SEPA-Überweisungen.

### SCT_ISO_20022_pacs_008_001_02_SDD_ISO_20022_pacs_003_Status_

DNS (Deferred Net Settlement)  Zyklen SCT: • 3 Settlement-Zyklen täglich • Zyklus 1: Cut-off 06:00 CET → Settlement 09:00 • Zyklus 2: Cut-off 12:00 CET → Settlement 15:00 • Zyklus 3: Cut-off 16:00 CET → Settlement 18:30  SDD: • 2 Zyklen täglich • Einreichfrist: D-1 (Vortag) bis 14:00 CET • Settlement: D (Fälligkeitstag) 09:00 CET  Settlement-Währung: EUR Settlement-Konto: TARGET2

### SCT_ISO_20022_pacs_008_001_02_SDD_ISO_20022_pacs_003_Status_

Mo–Fr (Bankarbeitstage) KEINE Wochenend- oder Feiertagsverarbeitung  SCT-Einreichung: • Frühester Cut-off: 06:00 CET • Letzter Cut-off: 16:00 CET • Bankabhängig: viele Banken haben internen Cut-off 14:00–15:00 CET  SDD-Einreichung: • Voranmeldung: D-1 14:00 CET (FRST/OOFF: D-2)  Feiertage: • TARGET2-Feiertage (1.1, Karfreitag, Ostermontag, 1.5, 25.12, 26.12) • Nationale Feiertage NUR wenn Bank des Empfängers geschlossen

### ISO_20022_pacs_008_001_08_SCT_Inst_pacs_002_Status_pacs_004_

RTGS-ähnlich (Individual Settlement) Echtzeit-Final-Settlement auf Zentralbankgeld  Kein Netting – jede Zahlung einzeln  Settlement-Konto: TIPS Dedicated Cash Account (DCA) → Teilnehmende Banken halten Liquidität auf DCA  Settlement-Währung: EUR (SEK, DKK geplant für Nicht-EUR SEPA)  Verfügbarkeit: 24/7/365 Keine Tageszyklen

### ISO_20022_pacs_008_001_08_SCT_Inst_pacs_002_Status_pacs_004_

Betriebszeiten: 24 Stunden / 7 Tage / 365 Tage Auch an Feiertagen und Wochenenden  Cut-off: Kein Cut-off – Echtzeit  Maximale Ausführungszeit: < 10 Sekunden Ende-zu-Ende  Transaktionslimit: Aktuell: EUR 100.000 Geplant: EUR 250.000 (Ende 2025)  Timeout: 20 Sekunden – danach automatischer Reject

### ISO_20022_seit_Nov_2022_pacs_008_Kundenzahlung_pacs_009_Inte

ISO 20022 (seit Nov. 2022): pacs.008 (Kundenzahlung) pacs.009 (Interbank-Zahlung) pacs.010 (Direct Debit interbank) camt.050 (Liquiditätsmanagement) camt.053 (Kontoauszug)  Legacy (bis Nov. 2022): MT103 (Kundenzahlung) MT202 (Interbank) MT900/910 (Avisierung)

### ISO_20022_seit_Nov_2022_pacs_008_Kundenzahlung_pacs_009_Inte

RTGS – Individual Settlement Jede Zahlung sofort und einzeln Kein Netting  Settlement-Konto: RTGS-Konto auf T2 (Zentralbankgeld)  Settlement-Währung: EUR  Liquiditätsoptimierung: • Offsetting: gegenseitige Zahlungen werden verrechnet • Queuing: Zahlungen warten auf Liquiditätszufluss • Gridlock Resolution: automatische Auflösung bei Patt  Tagesvolumen: ca. EUR 1,5–2 Billionen täglich

### ISO_20022_seit_Nov_2022_pacs_008_Kundenzahlung_pacs_009_Inte

Betriebszeiten (T2): Mo–Fr (TARGET2-Bankkalender)  Öffnung: 07:00 CET Letzter Cut-off Kundenzahlungen: 17:00 CET Letzter Cut-off Interbank: 18:00 CET System-Close: 18:45 CET  Feiertage: Neujahr (1.1), Karfreitag, Ostermontag Tag der Arbeit (1.5), Weihnachten (25.+26.12)  Hinweis: Kundenzahlungen über T2 haben höheren Preis als STEP2

### Ca_250_direkte_Teilnehmer_Banken_Indirekter_Zugang_ber_direk

Ca. 250 direkte Teilnehmer (Banken) Indirekter Zugang: über direkten Teilnehmer  Größte direkte Teilnehmer: • Deutsche Bank, Commerzbank, DZ Bank (DE) • BNP Paribas, Société Générale (FR) • UniCredit, Intesa Sanpaolo (IT) • Santander, BBVA (ES) • ING, Rabobank (NL)  Corporate: kein direkter Zugang → Immer indirekt über Hausbank

### Ca_60_direkte_Teilnehmer_Banken_mit_TIPS_DCA_Indirekte_Teiln

Ca. 60+ direkte Teilnehmer (Banken mit TIPS DCA) Indirekte Teilnehmer: über direkten Teilnehmer  Reachability: • Jede Bank im Euroraum muss bis Okt. 2025 SCT Inst empfangen können • Senden: bis Jan. 2025 (Eurozone)  Parallel-System: EBA RT1 (EBA Clearing) als zweites Instant-System im SEPA-Raum → Interoperabilität zwischen TIPS und RT1 sichergestellt

### Direkte_Teilnehmer_Ca_1_000_Kreditinstitute_in_der_Eurozone_

Direkte Teilnehmer: Ca. 1.000 Kreditinstitute in der Eurozone + opt. Nicht-EUR EU-Banken  Indirekte Teilnehmer: Ca. 2.000 Banken über direkte Teilnehmer  Zugang für Corporates: Kein direkter Zugang → Immer über Hausbank  Routing-Entscheidung: Bank entscheidet ob SCT über STEP2 oder T2 geroutet wird (Cost-Benefit) Corporate kann URGP/SDVA als Hinweis setzen

### 1_VALUTA-STEUERUNG_Durch_die_3_SCT-Zyklen_k_nnen_Corporates_

1) VALUTA-STEUERUNG: Durch die 3 SCT-Zyklen können Corporates den Ausführungszeitpunkt optimieren. Zahlung vor 06:00 CET eingereicht → Settlement 09:00 → Empfänger hat Geld vormittags. Zahlung um 15:00 CET → Settlement 18:30 → Empfänger hat Geld erst nächsten Morgen. 2) SDD-VORLAUFZEITEN: SDD Core erfordert Einreichung D-1 (RCUR) oder D-2 (FRST) bis 14:00 CET bei STEP2 → Banken haben internen Cut-off oft 12:00–13:00 CET. Diese Vorlaufzeiten bestimmen den Prozesskalender für Lastschriftläufe in SAP. 3) DNS-RISIKO: Bei DNS-Settlement besteht theoretisches Intraday-Ausfallrisiko (Bank fällt aus bevor Settlement) → für Corporates praktisch irrelevant, aber bei IHB-Liquiditätsplanung zu beachten. 4) KEINE ECHTZEITFÄHIGKEIT: STEP2 ist kein Instant-System – dafür gibt es TIPS/RT1.

### 1_VALUTA-STEUERUNG_Durch_die_3_SCT-Zyklen_k_nnen_Corporates_

1) TIMING IHRER ZAHLUNGEN: Je nachdem wann SAP Ihre Zahlungsdatei an die Bank schickt, landet Ihre Zahlung in einem anderen Verarbeitungszyklus. Wird die Datei vor 14:00 Uhr eingereicht (bankabhängig), kann Ihr Lieferant das Geld noch am gleichen oder frühen nächsten Tag haben. 2) LASTSCHRIFTEN BRAUCHEN VORLAUF: Wenn Sie Lastschriften einziehen, müssen diese mindestens einen Bankarbeitstag vorher bei der Bank eingereicht sein. Das bestimmt wann SAP den Lastschrift-Zahllauf starten muss. 3) KEIN WOCHENENDE: STEP2 arbeitet nur an Bankarbeitstagen. Zahlungen die freitags nach dem Cut-off eingehen, werden erst montags verarbeitet. 4) FÜR SIE UNSICHTBAR: Als Unternehmen sehen Sie STEP2 nie direkt – aber die Cut-off-Zeiten Ihrer Bank basieren auf STEP2-Fristen.

### 1_LIQUIDIT_TS-MANAGEMENT_Keine_Puffer-Zeit_mehr_zwischen_Zah

1) LIQUIDITÄTS-MANAGEMENT: Keine Puffer-Zeit mehr zwischen Zahlungsausgang und Kontobelastung. DCA-Konten der Banken müssen ausreichend vorfinanziert sein → Banken können Intraday-Liquiditätsanforderungen an Corporate weitergeben. 2) IHB-OPTIMIERUNG: Intragroup SCT Inst über TIPS ermöglicht 24/7-Liquiditätssweeps ohne Wartepuffer. Cash Pooling kann in Echtzeit erfolgen. 3) UNWIDERRUFLICHKEIT: Ab TIPS-Settlement ist Zahlung final. Pre-Execution-Kontrollen (Betragslimit, Whitelist, Dual Control) sind einzige Schutzlinie. 4) CAMT.054 ECHTZEIT: Empfangsbestätigung für SCT Inst kommt als camt.054 innerhalb Sekunden → SAP BAM muss Echtzeit-Processing unterstützen. 5) REGULATORISCHE PFLICHT: Ab Okt. 2025 müssen alle Eurozone-Banken SCT Inst empfangen können; Preisparität mit SCT Pflicht.

### 1_LIQUIDIT_TS-MANAGEMENT_Keine_Puffer-Zeit_mehr_zwischen_Zah

1) SOFORTÜBERWEISUNGEN SIND JETZT STANDARD: Ab Oktober 2025 müssen alle Banken Sofortüberweisungen anbieten – zum gleichen Preis wie normale Überweisungen. Das verändert den Zahlungsverkehr grundlegend. 2) KEIN RÜCKRUF MÖGLICH: Wenn eine Sofortüberweisung durch TIPS verrechnet ist, ist das Geld weg. Kein 'Rückruf' wie bei normalen Überweisungen. 3) WOCHENEND-ZAHLUNGEN: Endlich möglich – auch am Sonntag können Lieferanten bezahlt werden. Das verändert die Liquiditätsplanung. 4) BUCHHALTUNG IN ECHTZEIT: Wenn ein Kunde per Sofortüberweisung zahlt, muss SAP das sofort verarbeiten können – nicht erst beim nächsten Tagesauszug.

### 1_URGP_SDVA-ZAHLUNGEN_Corporate_kann_in_pain_001_PmtTpInf_Sv

1) URGP/SDVA-ZAHLUNGEN: Corporate kann in pain.001 PmtTpInf/SvcLvl/Cd 'URGP' (Urgent) oder 'SDVA' (Same Day Value) setzen → Bank routet über T2 statt STEP2 → Empfänger hat Same-Day-Value. Kosten: EUR 5–25 pro Transaktion je Bank. 2) DRINGENDE LIEFERANTENZAHLUNGEN: Bei drohenden Lieferantensperren oder Bonitätsproblemen kann T2-Routing sicherstellen dass Zahlung noch heute verrechnet wird. 3) TREASURY-SETTLEMENTS: Bei Devisenkäufen, Derivate-Settlements und Geldmarkttransaktionen wird T2 für den EUR-Leg genutzt. 4) T2-KALENDER: T2 hat strengeren Feiertagskalender als STEP2 (nur 6 Feiertage) – relevant für internationale Zahlungen wo beide Seiten T2-Kalender befolgen.

### 1_URGP_SDVA-ZAHLUNGEN_Corporate_kann_in_pain_001_PmtTpInf_Sv

1) FÜR DRINGENDE ZAHLUNGEN: Wenn eine Zahlung unbedingt noch heute ankommen muss (nicht erst morgen), kann Ihre Bank sie über T2 schicken. Das kostet etwas mehr, aber das Geld ist heute da. 2) GROSSE BETRÄGE SICHER: T2 wird für sehr große Zahlungen genutzt – wenn Ihr Unternehmen z.B. eine Immobilie kauft oder eine Unternehmensübernahme finanziert. 3) FEIERTAGE SIND STRENG: T2 hat einen eigenen Feiertagskalender. An diesen 6 Tagen im Jahr können keine Großbetragszahlungen verarbeitet werden – das ist in SAP einzupflegen. 4) MEISTENS NICHT RELEVANT: Für normale Lieferantenzahlungen nutzen Sie nie T2 direkt – das ist STEP2-Terrain.

### Corporate-Zugang_ausschlie_lich_indirekt_ber_Hausbank_SAP-Re

Corporate-Zugang: ausschließlich indirekt über Hausbank  SAP-Relevanz: • Zahlungsweg-Konfiguration (FBZP): Bankinterner Cut-off bestimmt Zahllauf-Scheduling • F110-Zahllauf-Timing: Optimal vor 13:00–14:00 CET für Same-Day-Settlement • SDD-Prozesskalender: F110 für Lastschriften muss D-1/D-2 berücksichtigen • STEP2-Feiertage in SAP-Fabrikkalender pflegen (T-Code SCAL) • BCM-Monitoring: pacs.002-Status zeigt ob STEP2-Einreichung akzeptiert  Best Practice: • Täglichen Zahllauf auf 13:00 CET terminieren • SDD-Lauf auf D-1 08:00 CET terminieren • STEP2-Feiertage = TARGET2-Feiertage → in SCAL hinterlegen

### Corporate-Zugang_ausschlie_lich_indirekt_ber_Hausbank_SAP-Re

Als Unternehmen haben Sie keinen direkten Kontakt mit STEP2. Alles läuft über Ihre Bank.  Was das für SAP bedeutet: • SAP-Zahllauf (F110) sollte täglich bis ca. 13:00–14:00 Uhr laufen, damit Zahlungen noch am gleichen Tag verarbeitet werden • Für Lastschriften: SAP-Lauf muss einen Tag früher starten als der Abbuchungstag • Feiertage: In SAP muss hinterlegt sein, an welchen Tagen keine Zahlungen verarbeitet werden (Karfreitag, Ostermontag, 1. Mai, 25./26. Dezember)  Praktische Faustregel: Zahlung bis 14:00 Uhr eingereicht → Lieferant hat Geld am nächsten Bankarbeitstag.

### Corporate-Zugang_indirekt_ber_Hausbank_wie_STEP2_SAP-Konfigu

Corporate-Zugang: indirekt über Hausbank (wie STEP2)  SAP-Konfiguration für Instant: • pain.001 SvcLvl/Cd: 'INST' in DMEE konfigurieren • BCM: Separate Zahlungsweg-Konfiguration für Instant • Limit-Kontrolle: max. EUR 100k (bald 250k) per Transaktion • Fraud-Control: Pre-Execution-Checks vor INST-Ausgabe • BAM: camt.054 Echtzeit-Import aktivieren (nicht nur Tages-Batch) • Deduplizierung: camt.054 + camt.053 darf nicht doppelt buchen  IHB-Nutzung: • Intragroup Instant via IHB möglich • Liquidity Sweep 24/7 konfigurierbar • Konzernweite Notfall-Liquidität ohne Banköffnungszeiten

### Corporate-Zugang_indirekt_ber_Hausbank_wie_STEP2_SAP-Konfigu

Auch für Sofortüberweisungen haben Sie keinen direkten Kontakt mit TIPS – alles über Ihre Bank.  Was in SAP eingestellt sein muss: • SAP muss wissen welche Zahlungen als Sofortüberweisung gesendet werden sollen • Ein Maximalbetrag muss definiert sein (aktuell 100.000 EUR) • SAP muss eingehende Sofortzahlungen sofort verarbeiten – nicht erst am nächsten Morgen • Es muss verhindert werden, dass die gleiche Buchung sowohl aus der Sofort-Benachrichtigung als auch aus dem Tagesauszug doppelt gebucht wird  Einfache Faustregel: Für normale Zahlungen → STEP2. Für alles Dringende → TIPS.

### Corporate-Zugang_indirekt_ber_Hausbank_SAP-Konfiguration_Svc

Corporate-Zugang: indirekt über Hausbank  SAP-Konfiguration: • SvcLvl/Cd 'URGP' in pain.001 aktivieren für dringende Zahlungen • Separater Zahlungsweg 'Eilüberweisung' in FBZP konfigurieren • T2-Fabrikkalender in SCAL: nur 6 Feiertage (strenger als nationale Kalender) • Buchungskreis-Konfiguration: T2-Feiertage als Ausschlussdaten  Treasury-Relevanz: • FX-Spot-Settlement (EUR-Leg) immer über T2 • Money Market Transactions: T2 für EUR-Settlement • In SAP TRM: Valuta-Kalender auf T2-Basis konfigurieren

### Corporate-Zugang_indirekt_ber_Hausbank_SAP-Konfiguration_Svc

Für normale Zahlungen müssen Sie T2 nicht kennen. Aber zwei Situationen sind relevant:  1) DRINGENDE ZAHLUNG HEUTE: Sagen Sie Ihrer Bank: 'Diese Zahlung muss heute noch ankommen.' Die Bank routet sie dann über T2. In SAP kann das als 'Eilüberweisung' konfiguriert sein.  2) FEIERTAGE RICHTIG EINTRAGEN: In SAP müssen die 6 T2-Feiertage hinterlegt sein: Neujahr, Karfreitag, Ostermontag, 1. Mai, 25. und 26. Dezember. An diesen Tagen können keine EUR-Zahlungen verarbeitet werden – auch wenn es kein nationaler Feiertag ist.

## Großbritannien

### IDENTIFIKATION

| System-Name | Abkürzung | Typ | Region / Land | Betreiber |
| --- | --- | --- | --- | --- |
| Clearing House Automated Payment System | CHAPS | RTGS – Großbetrag, Einzelverrechnung | Großbritannien (GBP) | Bank of England |

### SYSTEMBESCHREIBUNG

| Systembeschreibung (Experte) | Systembeschreibung (Einsteiger) |
| --- | --- |
| → [Details unten: CHAPS_ist_das_britische_RTGS-System_f_r_GBP-Gro_betragszahlu] | → [Details unten: CHAPS_ist_das_britische_RTGS-System_f_r_GBP-Gro_betragszahlu] |

### TECHNISCHE DETAILS

| Nachrichtenformat | Settlement-Modell & Zyklen | Betriebszeiten & Cut-offs |
| --- | --- | --- |
| ISO 20022 (seit 2023): pacs.008 (Kundenzahlung) pacs.009 (Interbank) camt.053 (Kontoauszug)  Einlieferung: SWIFT (über CHAPS-Gateway) oder direkte Teilnehmer-Verbindung | RTGS – Individual Settlement Jede Zahlung sofort und final Settlement-Währung: GBP Settlement-Konto: Bank of England  Tagesvolumen: Ca. GBP 400 Mrd. täglich Ca. 200.000 Transaktionen/Tag | → [Details unten: ISO_20022_seit_2023_pacs_008_Kundenzahlung_pacs_009_Interban] |

### TEILNEHMER & ZUGANG

| Direkte Teilnehmer & Zugang |
| --- |
| → [Details unten: Ca_30_direkte_CHAPS-Mitglieder_Gro_banken_Barclays_HSBC_Lloy] |

### RELEVANZ FÜR CORPORATES

| Relevanz & Auswirkung (Experte) | Relevanz & Auswirkung (Einsteiger) |
| --- | --- |
| → [Details unten: 1_POST-BREXIT_GBP-ZAHLUNGEN_GBP-Zahlungen_sind_keine_SEPA-Za] | → [Details unten: 1_POST-BREXIT_GBP-ZAHLUNGEN_GBP-Zahlungen_sind_keine_SEPA-Za] |

### CORPORATE ZUGANG & PRAXIS

| Corporate Zugang & SAP-Anbindung (Experte) | Corporate Zugang & SAP-Anbindung (Einsteiger) |
| --- | --- |
| → [Details unten: Corporate-Zugang_indirekt_ber_UK-Hausbank_oder_Korrespondenz] | → [Details unten: Corporate-Zugang_indirekt_ber_UK-Hausbank_oder_Korrespondenz] |

### STATUS

| Status / Entwicklung |
| --- |
| Aktiv; seit 2023 auf ISO 20022 migriert Parallel: Faster Payments (FPS) für Kleinbeträge New Payments Architecture (NPA) als Langzeit-Nachfolger geplant |

### CHAPS_ist_das_britische_RTGS-System_f_r_GBP-Gro_betragszahlu

CHAPS ist das britische RTGS-System für GBP-Großbetragszahlungen. Betrieben von der Bank of England seit 2017 (vorher: CHAPS Clearing Company). Genutzt für: Immobilientransaktionen, Unternehmensübernahmen, Interbanken-Settlements, Treasury-Zahlungen. 2023 auf ISO 20022 migriert (pacs.008/pacs.009). Kein Mindestbetrag technisch, aber preislich für Großbeträge konzipiert.  Wichtig für Corporates: Post-Brexit keine SEPA-Integration mehr. GBP-Zahlungen nach UK laufen über SWIFT MT103 (→ pacs.008 MX ab 2025) und werden empfängerseitig über CHAPS oder Faster Payments (FPS) verrechnet, je nach Betrag und Dringlichkeit.

### CHAPS_ist_das_britische_RTGS-System_f_r_GBP-Gro_betragszahlu

CHAPS ist das britische System für große und dringende GBP-Zahlungen – ähnlich wie TARGET2 für den Euro. Wenn ein deutsches Unternehmen einem britischen Lieferanten eine sehr große Summe in GBP überweist, landet diese letztendlich über CHAPS.  Nach dem Brexit: UK ist nicht mehr Teil des SEPA-Raums. Das bedeutet: GBP-Zahlungen sind technisch wie internationale Zahlungen zu behandeln – mit SWIFT, höheren Gebühren und längeren Laufzeiten als SEPA.

### ISO_20022_seit_2023_pacs_008_Kundenzahlung_pacs_009_Interban

Betriebszeiten: Mo–Fr (UK Bankarbeitstage)  Öffnung: 06:00 GMT/BST Cut-off Kundenzahlungen: 17:00 GMT/BST Cut-off Interbank: 18:00 GMT/BST  UK-Feiertage: Neujahr, Karfreitag, Ostermontag Early May Bank Holiday Spring Bank Holiday Summer Bank Holiday Weihnachten (25.+26.12)

### Ca_30_direkte_CHAPS-Mitglieder_Gro_banken_Barclays_HSBC_Lloy

Ca. 30 direkte CHAPS-Mitglieder (Großbanken: Barclays, HSBC, Lloyds, NatWest, Santander UK, Standard Chartered)  Indirekt: Alle anderen UK-Banken  Corporate: kein direkter Zugang → Immer über UK-Hausbank oder Korrespondenzbank

### 1_POST-BREXIT_GBP-ZAHLUNGEN_GBP-Zahlungen_sind_keine_SEPA-Za

1) POST-BREXIT GBP-ZAHLUNGEN: GBP-Zahlungen sind keine SEPA-Zahlungen mehr. Technisch: SWIFT-Überweisung (pain.001 → MT103/pacs.008) → empfängerseitig CHAPS oder FPS. Zeitrahmen: D+1 bis D+2 je nach Cut-off und Korrespondenzbank. 2) GEBÜHREN: CHAPS-Zahlungen sind teurer als SEPA (typisch GBP 25–50 Bankgebühr). Bei regelmäßigen GBP-Zahlungen: UK-Hausbankverbindung prüfen (lokales GBP-Konto spart Kosten). 3) UK-BANKKONTO FÜR VIELE GBP-ZAHLUNGEN SINNVOLL: Eigenes GBP-Konto bei UK-Bank → Zahlungen als Inlandszahlung über Faster Payments (kostenlos) oder CHAPS. 4) SAP FX: GBP-Zahlungen erfordern FX-Konfiguration in SAP (Hauswährung EUR, Zahlungswährung GBP); Wechselkurs-Management. 5) UK-FABRIKKALENDER: UK-Feiertage unterscheiden sich von deutschen → separate Konfiguration in SCAL.

### 1_POST-BREXIT_GBP-ZAHLUNGEN_GBP-Zahlungen_sind_keine_SEPA-Za

1) GBP-ZAHLUNGEN SIND TEURER: Seit dem Brexit ist Großbritannien kein SEPA-Land mehr. Eine Überweisung nach UK kostet mehr und dauert länger als früher – wie eine internationale Zahlung. 2) OFT SINNVOLL: EIN UK-KONTO ERÖFFNEN: Wenn Ihr Unternehmen regelmäßig britische Lieferanten bezahlt, lohnt sich ein eigenes GBP-Konto bei einer UK-Bank. Dann sind Zahlungen wieder günstig und schnell. 3) UK-FEIERTAGE BEACHTEN: Britische Feiertage unterscheiden sich von deutschen. In SAP müssen die UK-Bankfeiertage separat hinterlegt werden. 4) ZEITZONE BEACHTEN: UK ist im Winter 1 Stunde hinter Deutschland. Cut-off-Zeiten entsprechend anpassen.

### Corporate-Zugang_indirekt_ber_UK-Hausbank_oder_Korrespondenz

Corporate-Zugang: indirekt über UK-Hausbank oder Korrespondenzbank  Optionen für regelmäßige GBP-Zahlungen: 1) Direkte UK-Bankverbindung (Barclays, HSBC UK etc.)    → Zahlungen als UK-Inlandszahlungen (FPS oder CHAPS)    → SAP: separater Zahlungsweg GBP, UK-DMEE (BACS/FPS-Format) 2) Deutsche Hausbank mit GBP-Korrespondenzbank    → SWIFT MT103/pacs.008 → CHAPS    → SAP: SWIFT_MT103-DMEE; Währung GBP  SAP-Konfiguration: • FBZP: Zahlungsweg für GBP-Auslandszahlungen • UK-Fabrikkalender (SCAL): UK-Feiertage • Wechselkurstyp: M (Mittelkurs) oder B (Briefkurs) je nach Vereinbarung

### Corporate-Zugang_indirekt_ber_UK-Hausbank_oder_Korrespondenz

Wenn Ihr Unternehmen regelmäßig GBP zahlt, gibt es zwei Wege:  WEG 1 – UK-Konto eröffnen: • Eröffnen Sie ein GBP-Konto bei einer britischen Bank • Überweisen Sie einmal größere EUR-Beträge auf das UK-Konto • Zahlen Sie britische Lieferanten dann direkt in GBP – günstiger und schneller  WEG 2 – Über deutsche Hausbank: • Ihre Bank schickt GBP-Zahlungen über das internationale SWIFT-Netzwerk • Teurer, aber einfacher in SAP zu verwalten  In SAP: UK-Feiertage separat eintragen, damit keine Zahlungen auf britische Bankfeiertage fallen.

## USA – Zahlungssysteme

### IDENTIFIKATION

| System-Name | Abkürzung | Typ | Region / Land | Betreiber |
| --- | --- | --- | --- | --- |
| Fedwire Funds Service | Fedwire | RTGS – Großbetrag, Einzelverrechnung | USA (USD) | Federal Reserve (US-Notenbank) |
| Automated Clearing House | ACH (US) | DNS – Deferred Net Settlement (Massenverrechnung) | USA (USD) | Nacha (National Automated Clearing House Association) + Federal Reserve (FedACH) + The Clearing House (EPN) |

### SYSTEMBESCHREIBUNG

| Systembeschreibung (Experte) | Systembeschreibung (Einsteiger) |
| --- | --- |
| → [Details unten: Fedwire_ist_das_RTGS-System_der_US_Federal_Reserve_f_r_USD-G] | → [Details unten: Fedwire_ist_das_RTGS-System_der_US_Federal_Reserve_f_r_USD-G] |
| → [Details unten: ACH_ist_das_US-amerikanische_Massenzahlungssystem_f_r_USD_fu] | → [Details unten: ACH_ist_das_US-amerikanische_Massenzahlungssystem_f_r_USD_fu] |

### TECHNISCHE DETAILS

| Nachrichtenformat | Settlement-Modell & Zyklen | Betriebszeiten & Cut-offs |
| --- | --- | --- |
| → [Details unten: ISO_20022_ab_2025_pacs_008_Kundenzahlung_pacs_009_Interbank_] | → [Details unten: ISO_20022_ab_2025_pacs_008_Kundenzahlung_pacs_009_Interbank_] | → [Details unten: ISO_20022_ab_2025_pacs_008_Kundenzahlung_pacs_009_Interbank_] |
| → [Details unten: NACHA-Format_propriet_r_CCD_Corporate_Credit_Debit_B2B_Einze] | → [Details unten: NACHA-Format_propriet_r_CCD_Corporate_Credit_Debit_B2B_Einze] | → [Details unten: NACHA-Format_propriet_r_CCD_Corporate_Credit_Debit_B2B_Einze] |

### TEILNEHMER & ZUGANG

| Direkte Teilnehmer & Zugang |
| --- |
| → [Details unten: Ca_9_000_direkte_Fedwire-Teilnehmer_alle_Federal_Reserve_Mem] |
| → [Details unten: Ca_10_000_ACH-Teilnehmer_Alle_NACHA-Mitglieds-Banken_Zugang_] |

### RELEVANZ FÜR CORPORATES

| Relevanz & Auswirkung (Experte) | Relevanz & Auswirkung (Einsteiger) |
| --- | --- |
| → [Details unten: 1_JEDE_USD-ZAHLUNG_US-KORRESPONDENZBANK_Egal_wo_Ihr_Unterneh] | → [Details unten: 1_JEDE_USD-ZAHLUNG_US-KORRESPONDENZBANK_Egal_wo_Ihr_Unterneh] |
| → [Details unten: 1_B2B_USD-MASSENZAHLUNGEN_ACH_ist_die_kosteng_nstigste_Optio] | → [Details unten: 1_B2B_USD-MASSENZAHLUNGEN_ACH_ist_die_kosteng_nstigste_Optio] |

### CORPORATE ZUGANG & PRAXIS

| Corporate Zugang & SAP-Anbindung (Experte) | Corporate Zugang & SAP-Anbindung (Einsteiger) |
| --- | --- |
| → [Details unten: Corporate-Zugang_indirekt_ber_Hausbank_US-Korrespondenzbank_] | → [Details unten: Corporate-Zugang_indirekt_ber_Hausbank_US-Korrespondenzbank_] |
| → [Details unten: Corporate-Zugang-Optionen_1_US-Tochtergesellschaft_mit_US-Ba] | → [Details unten: Corporate-Zugang-Optionen_1_US-Tochtergesellschaft_mit_US-Ba] |

### STATUS

| Status / Entwicklung |
| --- |
| Aktiv; ISO 20022 Migration 2025 Parallel: CHIPS (private, international) FedNow (Instant, seit 2023) als Ergänzung |
| Aktiv; dominantes US-Massenzahlungssystem Same-Day ACH seit 2016, ausgebaut 2021 FedNow (Instant) als Ergänzung seit 2023 ISO 20022 Migration noch nicht beschlossen |

### Fedwire_ist_das_RTGS-System_der_US_Federal_Reserve_f_r_USD-G

Fedwire ist das RTGS-System der US Federal Reserve für USD-Großbetragszahlungen. Jede Zahlung wird sofort und final auf Federal Reserve Bank-Konten verrechnet. Genutzt für: Interbanken-Settlements, Treasury-Zahlungen, Hypothekenabschlüsse, Securities-Settlements.  Für internationale Corporates relevant: Jede USD-Zahlung aus dem Ausland läuft durch das US-Korrespondenzbanksystem und wird letztendlich über Fedwire oder ACH verrechnet. Fedwire ist dabei für Großbeträge, ACH für Massenzahlungen zuständig.  CHIPS (Clearing House Interbank Payments System) ist das private Gegenstück zu Fedwire für internationale USD-Zahlungen (betrieben von The Clearing House).  ISO 20022 Migration: Fedwire hat 2025 ISO 20022 eingeführt (pacs.008/pacs.009).

### Fedwire_ist_das_RTGS-System_der_US_Federal_Reserve_f_r_USD-G

Fedwire ist das amerikanische System für große und dringende USD-Zahlungen – betrieben von der US-Notenbank (Federal Reserve). Ähnlich wie T2 für EUR.  Für europäische Unternehmen wichtig: Wenn Sie USD zahlen – zum Beispiel für eine Warenlieferung aus den USA – läuft das Geld irgendwann durch Fedwire. Das passiert im Hintergrund; Sie sehen es nicht direkt.  Wichtig: Jede USD-Zahlung aus Europa muss durch eine US-Korrespondenzbank. Diese Bank führt automatisch Sicherheitsprüfungen (OFAC-Sanktionsliste) durch – das kann zu Verzögerungen führen.

### ACH_ist_das_US-amerikanische_Massenzahlungssystem_f_r_USD_fu

ACH ist das US-amerikanische Massenzahlungssystem für USD – funktional vergleichbar mit SEPA SCT/SDD. DNS-Verrechnung mit mehreren Zyklen täglich (seit 2021: Same-Day ACH bis 14:45 ET). Genutzt für: Gehaltsabrechnungen (Direct Deposit), Lastschriften (ACH Debit), B2B-Zahlungen, Steuererstattungen.  Zwei Netzwerke parallel: • FedACH: Federal Reserve-betrieben • EPN (Electronic Payments Network): Privat (The Clearing House)  Format: ANSI X12 820 / NACHA-Format (kein ISO 20022); Migration zu ISO 20022 in Diskussion aber noch nicht beschlossen.  Wichtig: ACH-Rejects ('Returns') haben standardisierte Return Reason Codes (R01-R99).

### ACH_ist_das_US-amerikanische_Massenzahlungssystem_f_r_USD_fu

ACH ist das amerikanische System für normale USD-Überweisungen und Lastschriften – ähnlich wie SEPA in Europa. Wenn ein US-Arbeitgeber Gehälter auszahlt, läuft das über ACH. Wenn Sie als europäisches Unternehmen USD-Zahlungen an viele US-Empfänger schicken wollen (z.B. Händlernetz), ist ACH der günstigste Weg.  Der wichtigste Unterschied zu SEPA: ACH nutzt kein ISO 20022-Format sondern ein eigenes amerikanisches Format (NACHA). SAP braucht dafür eine spezielle Konfiguration.

### ISO_20022_ab_2025_pacs_008_Kundenzahlung_pacs_009_Interbank_

ISO 20022 (ab 2025): pacs.008 (Kundenzahlung) pacs.009 (Interbank)  Legacy (bis 2025): Fedwire Funds Message Format (proprietäres Format)  Einlieferung: Direkte Fed-Verbindung oder SWIFT (über US-Korrespondenzbank)

### ISO_20022_ab_2025_pacs_008_Kundenzahlung_pacs_009_Interbank_

RTGS – Individual Settlement Jede Zahlung sofort und final Settlement auf Federal Reserve Accounts Settlement-Währung: USD  Tagesvolumen: Ca. USD 4 Billionen täglich Ca. 800.000 Transaktionen/Tag  Kein Mindestbetrag Typisch: > USD 100.000

### ISO_20022_ab_2025_pacs_008_Kundenzahlung_pacs_009_Interbank_

Betriebszeiten: Mo–Fr (US Federal Reserve Bankkalender)  Öffnung: 21:00 ET (Vortag) = 03:00 CET Cut-off: 18:30 ET = 00:30 CET (nächster Tag)  Wichtig: ET = Eastern Time Sommerzeit: ET = CET -6h Winterzeit: ET = CET -5h (US Zeitumstellung!)  US Federal Holidays: Neujahr, MLK Day, Presidents Day, Memorial Day, Independence Day (4.7), Labor Day, Columbus Day, Veterans Day, Thanksgiving, Weihnachten (25.12)

### NACHA-Format_propriet_r_CCD_Corporate_Credit_Debit_B2B_Einze

NACHA-Format (proprietär): • CCD: Corporate Credit/Debit (B2B Einzelzahlung) • CTX: Corporate Trade Exchange (B2B mit Remittance) • PPD: Prearranged Payment/Deposit (Gehalte) • WEB: Internet-initiierte Zahlung  KEIN ISO 20022 ISO 20022 Migration diskutiert aber noch nicht terminiert

### NACHA-Format_propriet_r_CCD_Corporate_Credit_Debit_B2B_Einze

DNS (Deferred Net Settlement)  Zyklen (seit Same-Day ACH 2021): • Zyklus 1: Cut-off 10:30 ET → Settlement 13:00 ET • Zyklus 2: Cut-off 14:45 ET → Settlement 17:00 ET • Standard Next-Day: Cut-off 18:45 ET → Settlement D+1  Return-Frist: • ACH Debit Return: 2 Bankarbeitstage • ACH Credit Return: 5 Bankarbeitstage Settlement-Währung: USD

### NACHA-Format_propriet_r_CCD_Corporate_Credit_Debit_B2B_Einze

Betriebszeiten: Mo–Fr (US Federal Reserve Bankkalender)  Same-Day Einreichung: • Zyklus 1: bis 10:30 ET = ca. 16:30–17:30 CET • Zyklus 2: bis 14:45 ET = ca. 20:45–21:45 CET  US Federal Holidays: Gleiche wie Fedwire (10 Feiertage)  Praktisch: Für europäische Einreichung D+1 oder D+2 planen (Zeitverschiebung + Korrespondenzbank-Vorlauf)

### Ca_9_000_direkte_Fedwire-Teilnehmer_alle_Federal_Reserve_Mem

Ca. 9.000 direkte Fedwire-Teilnehmer (alle Federal Reserve Member Banks)  Internationale Corporates: Kein direkter Zugang → USD-Zahlung über: 1) Eigene US-Tochtergesellschaft mit US-Bankkonto 2) Europäische Bank mit US-Korrespondenzbank    (z.B. Deutsche Bank → Deutsche Bank NY → Fedwire)  Bekannte US-Korrespondenzbanken: JP Morgan, Citibank, Bank of America, Wells Fargo, Deutsche Bank NY, BNY Mellon

### Ca_10_000_ACH-Teilnehmer_Alle_NACHA-Mitglieds-Banken_Zugang_

Ca. 10.000 ACH-Teilnehmer (Alle NACHA-Mitglieds-Banken)  Zugang für EU-Corporates: 1) US-Tochtergesellschaft mit US-Bankkonto    → direkter ACH-Zugang 2) Europäische Bank mit US-ACH-Service    (z.B. Deutsche Bank, HSBC, Citibank) 3) Payment Service Provider    (Stripe, Adyen, Worldpay für B2C)

### 1_JEDE_USD-ZAHLUNG_US-KORRESPONDENZBANK_Egal_wo_Ihr_Unterneh

1) JEDE USD-ZAHLUNG = US-KORRESPONDENZBANK: Egal wo Ihr Unternehmen sitzt – jede USD-Zahlung läuft durch eine US-Korrespondenzbank die OFAC-Screening durchführt. Unvollständige Originator-Daten (Name, Adresse) führen zu automatischen Rejects oder Holds. 2) ZEITVERSCHIEBUNG: Fedwire Cut-off 18:30 ET = 00:30 CET (Winterzeit). Für Same-Day-USD-Zahlungen: pain.001 muss spätestens bis ca. 14:00 CET bei Bank eingegangen sein (interne Verarbeitungszeit der Korrespondenzbank einrechnen). 3) CHIPS vs. FEDWIRE: Internationale USD-Zahlungen laufen meist über CHIPS (private, netting-basiert, günstiger). Settlement von CHIPS-Nettopositionen über Fedwire. Für Corporate praktisch kein Unterschied. 4) US-KONTEN: USD-Zahlungsoptimierung durch eigenes USD-Konto bei US-Bank (Fedwire-Direktzugang über Bank) oder Notional Pooling. 5) ACH vs. FEDWIRE: Für USD-Massenzahlungen ACH nutzen (günstig, D+1/D+2). Fedwire nur für große Einzelzahlungen.

### 1_JEDE_USD-ZAHLUNG_US-KORRESPONDENZBANK_Egal_wo_Ihr_Unterneh

1) USD-ZAHLUNGEN DAUERN LÄNGER: Eine USD-Zahlung von Deutschland in die USA dauert typisch 1–2 Bankarbeitstage – länger als SEPA. Das liegt an der US-Korrespondenzbank dazwischen. 2) ZEITVERSCHIEBUNG BEACHTEN: Wenn Sie wollen dass eine USD-Zahlung noch am gleichen Tag in den USA ankommt, muss sie bis ca. 14:00 Uhr Mittag (deutsche Zeit) raus. 3) SICHERHEITSPRÜFUNG USA: Jede USD-Zahlung wird von einer amerikanischen Bank auf Sanktionslisten geprüft (OFAC). Fehlen Absenderdaten oder hat ein Name Ähnlichkeit mit einem sanktionierten Unternehmen, wird die Zahlung gestoppt – manchmal für Tage. 4) FÜR REGELMÄSSIGE USD-ZAHLER: Wenn Sie oft USD zahlen, lohnt ein eigenes USD-Konto bei einer US-Bank. Das spart Gebühren und beschleunigt Zahlungen.

### 1_B2B_USD-MASSENZAHLUNGEN_ACH_ist_die_kosteng_nstigste_Optio

1) B2B USD-MASSENZAHLUNGEN: ACH ist die kostengünstigste Option für USD-Massenzahlungen in die USA. Typische Kosten: USD 0,10–0,50 pro Transaktion vs. USD 15–30 für Fedwire/SWIFT. 2) NACHA-FORMAT IN SAP: SAP-Standard hat kein NACHA-DMEE – Custom-DMEE oder Add-On (z.B. Serrala, Bottomline) erforderlich. CTX-Format für B2B mit strukturierter Remittance Information (820-Segment). 3) RETURN CODES: ACH Returns (R01–R99) müssen in BCM/BAM verarbeitet werden. R01 (Insufficient Funds), R02 (Account Closed), R03 (No Account), R09 (Uncollected Funds) häufigste. 4) PRENOTIFICATION: Vor erstem ACH Debit ist Pre-Notification (Vorab-Test-Buchung) empfohlen. 5) US-KONTO EMPFOHLEN: Eigenes USD-Konto bei US-Bank (Citibank, JP Morgan) ermöglicht direkten ACH-Zugang und eliminiert Korrespondenzbank-Kosten.

### 1_B2B_USD-MASSENZAHLUNGEN_ACH_ist_die_kosteng_nstigste_Optio

1) GÜNSTIGER ALS SWIFT FÜR VIELE USD-ZAHLUNGEN: Wenn Sie viele kleinere USD-Zahlungen in die USA machen (z.B. an ein Vertriebsnetz), ist ACH viel günstiger als internationale SWIFT-Überweisungen. 2) EIGENES SAP-FORMAT NÖTIG: ACH nutzt ein amerikanisches Format das SAP nicht automatisch mitbringt. Sie brauchen eine extra Konfiguration oder ein Add-On. 3) RÜCKGABEN ÜBERWACHEN: Ähnlich wie SEPA-Lastschriften können ACH-Zahlungen zurückgegeben werden. Für jeden Rückgabegrund gibt es einen Code (R01, R02 etc.) den SAP kennen muss. 4) ZEITVERSCHIEBUNG WICHTIG: Same-Day ACH ist möglich, aber der Cut-off liegt nachmittags in Amerika – das ist abends in Deutschland.

### Corporate-Zugang_indirekt_ber_Hausbank_US-Korrespondenzbank_

Corporate-Zugang: indirekt über Hausbank + US-Korrespondenzbank  SAP-Konfiguration USD-Zahlungen: • DMEE: SWIFT_MT103 (bis Nov. 2025) → pacs.008 (danach) • Zahlungsweg: Auslandszahlung USD in FBZP • Originator-Felder VOLLSTÄNDIG: Name, Adresse (strukturiert ab pain.009+) • Wechselkurs: FX-Konfiguration EUR/USD • US-Fabrikkalender (SCAL): 10 US Federal Holidays • Zeitverschiebung: Zahllauf bis 13:00 CET für Same-Day-USD  Für regelmäßige USD-Zahlungen: • USD-Hausbankverbindung (Citibank, JP Morgan) • Eigenes USD-Konto in SAP-Hausbanken • ACH-Anbindung für Massenzahlungen in USD

### Corporate-Zugang_indirekt_ber_Hausbank_US-Korrespondenzbank_

Wenn Ihr Unternehmen regelmäßig in USD zahlt, sollten Sie Folgendes wissen:  1) VOLLSTÄNDIGE ABSENDERDATEN: Jede USD-Zahlung braucht den vollständigen Namen und die Adresse Ihres Unternehmens. Fehlt das, stoppt die amerikanische Bank die Zahlung.  2) FRÜHZEITIG ABSCHICKEN: Für USD-Zahlungen die heute ankommen sollen: bis 13:00 Uhr mittags (deutsche Zeit) einreichen.  3) US-FEIERTAGE IN SAP: Amerikanische Feiertage unterscheiden sich von deutschen. An diesen Tagen gibt es kein USD-Settlement. In SAP separat eintragen.  4) BEI VIELEN USD-ZAHLUNGEN: Sprechen Sie mit Ihrer Bank über ein eigenes USD-Konto – das spart erheblich Gebühren.

### Corporate-Zugang-Optionen_1_US-Tochtergesellschaft_mit_US-Ba

Corporate-Zugang-Optionen:  1) US-Tochtergesellschaft mit US-Bankkonto:    → Direkter ACH-Zugang    → SAP-Konfiguration: NACHA-DMEE (Custom oder Add-On)    → Zahlungsweg: USD ACH in FBZP    → EBICS nicht verfügbar in USA → API oder SFTP-Verbindung  2) EU-Bank mit US-ACH-Service:    → Bank übernimmt NACHA-Konvertierung    → SAP: Standard SWIFT-Datei; Bank konvertiert  SAP NACHA-Felder: • Company ID: 10-stellige ACH-Originator-ID • Routing Number: 9-stellige ABA-Nummer (statt BIC/IBAN) • Account Number: US-Kontonummer (keine IBAN) • SEC Code: CCD/CTX/PPD je Zahlungstyp

### Corporate-Zugang-Optionen_1_US-Tochtergesellschaft_mit_US-Ba

Für US-Dollar-Massenzahlungen gibt es zwei praktische Wege:  WEG 1 – US-Konto für US-Tochter: • Ihre US-Tochtergesellschaft hat ein Konto bei einer US-Bank • Zahlungen werden direkt in USD abgewickelt • SAP braucht dafür eine spezielle US-Zahlungskonfiguration  WEG 2 – Europäische Bank mit US-Service: • Ihre deutsche Hausbank (z.B. Deutsche Bank, Commerzbank) bietet US-ACH-Zahlungen an • Einfacher für SAP: die Bank übernimmt die Formatkonvertierung  Wichtig zu wissen: • US-Kontonummern sind KEINE IBANs – 9-stellige Routing Number + Kontonummer • In SAP müssen diese anders hinterlegt werden als SEPA-Konten

## SWIFT – Internationales Netzwerk

### IDENTIFIKATION

| System-Name | Abkürzung | Typ | Region / Land | Betreiber |
| --- | --- | --- | --- | --- |
| Society for Worldwide Interbank Financial Telecommunication | SWIFT | Nachrichtennetzwerk (kein Settlement-System) | Global (200+ Länder) | SWIFT scrl (Genossenschaft) La Hulpe, Belgien |

### SYSTEMBESCHREIBUNG

| Systembeschreibung (Experte) | Systembeschreibung (Einsteiger) |
| --- | --- |
| → [Details unten: SWIFT_ist_KEIN_Zahlungssystem_und_f_hrt_KEIN_Settlement_durc] | → [Details unten: SWIFT_ist_KEIN_Zahlungssystem_und_f_hrt_KEIN_Settlement_durc] |

### TECHNISCHE DETAILS

| Nachrichtenformat | Settlement-Modell & Zyklen | Betriebszeiten & Cut-offs |
| --- | --- | --- |
| → [Details unten: Aktuell_bis_Nov_2025_MT-Nachrichten_Legacy_MT103_Kundenzahlu] | → [Details unten: Aktuell_bis_Nov_2025_MT-Nachrichten_Legacy_MT103_Kundenzahlu] | → [Details unten: Aktuell_bis_Nov_2025_MT-Nachrichten_Legacy_MT103_Kundenzahlu] |

### TEILNEHMER & ZUGANG

| Direkte Teilnehmer & Zugang |
| --- |
| → [Details unten: Ca_11_000_Mitglieder_in_200_L_ndern_Mitglieder_Banken_Hauptn] |

### RELEVANZ FÜR CORPORATES

| Relevanz & Auswirkung (Experte) | Relevanz & Auswirkung (Einsteiger) |
| --- | --- |
| → [Details unten: 1_MT-SUNSET_NOV_2025_Alle_SWIFT-Nachrichten_MT103_MT940_MT94] | → [Details unten: 1_MT-SUNSET_NOV_2025_Alle_SWIFT-Nachrichten_MT103_MT940_MT94] |

### CORPORATE ZUGANG & PRAXIS

| Corporate Zugang & SAP-Anbindung (Experte) | Corporate Zugang & SAP-Anbindung (Einsteiger) |
| --- | --- |
| → [Details unten: SAP_BCM_SWIFT-Anbindung_Option_1_SWIFT_via_Bank_empfohlen_f_] | → [Details unten: SAP_BCM_SWIFT-Anbindung_Option_1_SWIFT_via_Bank_empfohlen_f_] |

### STATUS

| Status / Entwicklung |
| --- |
| KRITISCH: MT-Sunset November 2025 MX (ISO 20022) als Pflichtstandard SWIFT gpi wächst stark CSP-Attestierung jährlich Pflicht |

### SWIFT_ist_KEIN_Zahlungssystem_und_f_hrt_KEIN_Settlement_durc

SWIFT ist KEIN Zahlungssystem und führt KEIN Settlement durch – es ist ein gesichertes Nachrichtennetzwerk zwischen Finanzinstituten. SWIFT transportiert Zahlungsnachrichten (MT/MX) und leitet sie an das jeweilige lokale Settlement-System weiter.  Architektur: • FIN-Service: MT-Nachrichten (Abschaltung Nov. 2025) • FileAct: Dateiübertragung (pain.001, camt.053 etc.) • InterAct: XML-basierte Echtzeit-Nachrichten • SWIFT gpi: Global Payment Innovation – Tracking, Transparenz, Speed • SWIFT MX: ISO 20022-basierte Nachrichten (Nachfolger MT)  Für Corporates: SWIFT Corporate Access (SWIFTNet für Corporates) ermöglicht direkte SWIFT-Verbindung ohne Zwischenbank. Alternativ: SWIFT via Servicebureau oder EBICS (in Europa bevorzugt).

### SWIFT_ist_KEIN_Zahlungssystem_und_f_hrt_KEIN_Settlement_durc

SWIFT ist kein Zahlungssystem – es ist ein Kommunikationsnetz zwischen Banken weltweit. Stellen Sie sich SWIFT wie die Post vor: Es transportiert Briefe (Zahlungsnachrichten) von Bank zu Bank, aber es überweist selbst kein Geld.  Wenn Ihr Unternehmen eine internationale Zahlung macht: 1) SAP schickt die Zahlungsdatei an Ihre Bank 2) Ihre Bank sendet die Zahlungsnachricht über SWIFT an die Empfänger-Bank 3) Das eigentliche Geld wird über lokale Systeme (T2, Fedwire etc.) verrechnet  SWIFT ist der Kanal, nicht die Kasse.

### Aktuell_bis_Nov_2025_MT-Nachrichten_Legacy_MT103_Kundenzahlu

Aktuell (bis Nov. 2025): MT-Nachrichten (Legacy): • MT103 (Kundenzahlung) • MT202 (Interbank) • MT940/942 (Kontoauszug)  Ab Nov. 2025 (SWIFT MX): ISO 20022 XML: • pacs.008 (Kundenzahlung) • pacs.009 (Interbank) • camt.053 (Kontoauszug)  FileAct: Dateiübertragung FIN: Einzelnachrichten InterAct: Echtzeit

### Aktuell_bis_Nov_2025_MT-Nachrichten_Legacy_MT103_Kundenzahlu

KEIN Settlement Nur Nachrichtenübertragung  Settlement erfolgt durch: • EUR: TARGET2/TIPS/STEP2 • USD: Fedwire/CHIPS/ACH • GBP: CHAPS/FPS • JPY: Zengin/BOJ-NET • etc.  SWIFT gpi SLA: • 50% aller Zahlungen: < 30 Minuten • 75%: < 6 Stunden • 100%: < 24 Stunden (Ziel)

### Aktuell_bis_Nov_2025_MT-Nachrichten_Legacy_MT103_Kundenzahlu

Betriebszeiten: 24/7 Nachrichtenübertragung  MT-Sunset: November 2025 → Danach nur noch MX (ISO 20022)  Wartungsfenster: Samstag 22:00 – Sonntag 08:00 CET (reduzierter Service, keine Wartung)  BIC/SWIFT-Code: 8 oder 11 Zeichen (AAAABBCC oder AAAABBCCDDD)

### Ca_11_000_Mitglieder_in_200_L_ndern_Mitglieder_Banken_Hauptn

Ca. 11.000 Mitglieder in 200+ Ländern  Mitglieder: • Banken (Hauptnutzer) • Corporates (SWIFT for Corporates) • Zentralbanken • Broker-Dealer  Corporate-Zugang: 1) Direktes SWIFT-Mitglied (BIC erforderlich)    → Kosten: EUR 10.000–50.000/Jahr    → Sinnvoll ab 10.000+ Transaktionen/Jahr 2) SWIFT Servicebureau (z.B. Bottomline, TIS) 3) SWIFT via Bank (indirekter Zugang) 4) EBICS (Europa-Alternative, günstiger)

### 1_MT-SUNSET_NOV_2025_Alle_SWIFT-Nachrichten_MT103_MT940_MT94

1) MT-SUNSET NOV. 2025: Alle SWIFT-Nachrichten (MT103, MT940, MT942, MT202) werden abgeschaltet. Migration auf MX (ISO 20022) zwingend erforderlich. Betrifft: SAP DMEE für ausgehende Zahlungen, BAM für eingehende Kontoauszüge, BCM-Kanalverbindungen. 2) SWIFT CSP (Customer Security Programme): Jährliche Pflicht-Selbstattestierung gegen CSCF-Framework. Betrifft SAP-BCM-Server, EBICS-Server und alle SWIFT-verbundenen Systeme. 3) SWIFT gpi UETR: Unique End-to-End Transaction Reference für Zahlungsnachverfolgung. UETR erscheint in camt.053 AcctSvcrRef und ermöglicht Status-Tracking. 4) SWIFT vs. EBICS: In DACH bevorzugen 90%+ der Corporates EBICS (günstiger, simpler). SWIFT sinnvoll für: globale Multi-Bank-Konnektivität, non-SEPA-Länder, SWIFT gpi-Tracking. 5) SANCTIONS SCREENING: Alle SWIFT-Nachrichten werden von Korrespondenzbanken gegen Sanktionslisten geprüft. OFAC, EU-Sanktionen, UN-Embargos.

### 1_MT-SUNSET_NOV_2025_Alle_SWIFT-Nachrichten_MT103_MT940_MT94

1) NOVEMBER 2025 – WICHTIGE DEADLINE: Das alte SWIFT-Format (MT) wird abgeschaltet. Wer noch alte Formate nutzt, kann danach keine internationalen Zahlungen mehr senden. Das ist wie wenn E-Mail-Server aufgehört hätten alte E-Mail-Standards zu unterstützen. 2) SICHERHEITSPFLICHTEN: Wenn Ihr Unternehmen SWIFT direkt nutzt, muss jedes Jahr nachgewiesen werden, dass die Sicherheitsanforderungen erfüllt sind. 3) ZAHLUNGSVERFOLGUNG: Mit SWIFT gpi kann man nachverfolgen wo eine internationale Zahlung gerade ist – ähnlich wie Pakete per Sendungsverfolgung. 4) EBICS IST MEIST GÜNSTIGER: Für europäische Zahlungen ist EBICS (der Standard in Deutschland, Österreich, Frankreich) oft günstiger und einfacher als SWIFT. SWIFT lohnt sich vor allem für internationale Zahlungen außerhalb Europas.

### SAP_BCM_SWIFT-Anbindung_Option_1_SWIFT_via_Bank_empfohlen_f_

SAP BCM – SWIFT-Anbindung:  Option 1: SWIFT via Bank (empfohlen für die meisten Corporates) • SAP → EBICS → Hausbank → Hausbank sendet über SWIFT weiter • Keine eigene SWIFT-Infrastruktur nötig  Option 2: Direktes SWIFT-Mitglied • Eigener BIC • SAP BCM → SWIFT Alliance Lite2 oder SWIFT Service Bureau • Alliance Lite2: cloudbasiert, günstigster Direktzugang • CSP-Pflichten selbst erfüllen  MT-Sunset-Checkliste für SAP: ☐ DMEE: MT103 → pacs.008 migrieren ☐ BAM: MT940 → camt.053 migrieren ☐ BCM: Kanalverbindungen auf MX umstellen ☐ Adressfelder: strukturiert (pain.001.001.09+) ☐ Banken informieren: Wann schalten sie um? ☐ Test-Transaktionen: vor Nov. 2025

### SAP_BCM_SWIFT-Anbindung_Option_1_SWIFT_via_Bank_empfohlen_f_

Für die meisten Unternehmen gilt: • Für europäische Zahlungen: EBICS nutzen (einfacher, günstiger) • Für internationale Zahlungen außerhalb Europa: SWIFT über Ihre Bank  Was Sie bis November 2025 sicherstellen müssen: 1) Fragen Sie Ihre IT und Ihre Bank: Nutzen wir noch alte MT-Formate? 2) Wenn ja: Migration auf neue ISO 20022-Formate planen 3) Das betrifft: ausgehende Zahlungen UND eingehende Kontoauszüge  Einfache Faustregel: • Europäische Zahlung → EBICS → STEP2/TIPS • Internationale Zahlung (USD, GBP, JPY...) → SWIFT → lokales Settlement-System

## APAC – Asien/Pazifik

### IDENTIFIKATION

| System-Name | Abkürzung | Typ | Region / Land | Betreiber |
| --- | --- | --- | --- | --- |
| Zengin System | Zengin | DNS – Massenverrechnung (Retail) + RTGS (Großbetrag über BOJ-NET) | Japan (JPY) | Japanese Bankers Association (JBA) + Bank of Japan (BOJ-NET für Großbetrag) |

### SYSTEMBESCHREIBUNG

| Systembeschreibung (Experte) | Systembeschreibung (Einsteiger) |
| --- | --- |
| → [Details unten: Zengin_ist_das_japanische_Interbank-Clearing-System_f_r_JPY-] | → [Details unten: Zengin_ist_das_japanische_Interbank-Clearing-System_f_r_JPY-] |

### TECHNISCHE DETAILS

| Nachrichtenformat | Settlement-Modell & Zyklen | Betriebszeiten & Cut-offs |
| --- | --- | --- |
| → [Details unten: Zengin-Format_propriet_r_EDI-basiert_Zengin_EDI_2019_struktu] | → [Details unten: Zengin-Format_propriet_r_EDI-basiert_Zengin_EDI_2019_struktu] | → [Details unten: Zengin-Format_propriet_r_EDI-basiert_Zengin_EDI_2019_struktu] |

### TEILNEHMER & ZUGANG

| Direkte Teilnehmer & Zugang |
| --- |
| → [Details unten: Ca_1_300_japanische_Banken_Zugang_f_r_EU-Corporates_1_JPY-Ko] |

### RELEVANZ FÜR CORPORATES

| Relevanz & Auswirkung (Experte) | Relevanz & Auswirkung (Einsteiger) |
| --- | --- |
| → [Details unten: 1_KATAKANA-PFLICHT_Empf_ngername_in_Katakana_ist_technische_] | → [Details unten: 1_KATAKANA-PFLICHT_Empf_ngername_in_Katakana_ist_technische_] |

### CORPORATE ZUGANG & PRAXIS

| Corporate Zugang & SAP-Anbindung (Experte) | Corporate Zugang & SAP-Anbindung (Einsteiger) |
| --- | --- |
| → [Details unten: SAP-Konfiguration_f_r_Japan_Bankschl_ssel_Japan_T-Code_FI01_] | → [Details unten: SAP-Konfiguration_f_r_Japan_Bankschl_ssel_Japan_T-Code_FI01_] |

### STATUS

| Status / Entwicklung |
| --- |
| Aktiv; dominantes JPY-System Zengin EDI (2019) für strukturierte Remittance ISO 20022 Migration diskutiert BOJ-NET parallel für Großbetrag |

### Zengin_ist_das_japanische_Interbank-Clearing-System_f_r_JPY-

Zengin ist das japanische Interbank-Clearing-System für JPY-Retail-Zahlungen. Betrieben von der Japanese Bankers Association. DNS-Verrechnung mit täglichen Settlement-Zyklen via Bank of Japan. Für Großbetragszahlungen: BOJ-NET (RTGS der Bank of Japan).  Besonderheiten Japan: • Kein IBAN-System: 7-stellige Banknummer + 3-stellige Filial-Nummer + Kontonummer • Kein BIC als Standard: Zengin-eigene Bankcode-Struktur • Katakana-Pflicht: Empfängername muss in Katakana (japanisches Schriftzeichen-Silbenalphabet) angegeben werden • Zengin EDI (ab 2019): Strukturierter Remittance-Standard für B2B • ISO 20022 Migration: geplant, noch nicht terminiert

### Zengin_ist_das_japanische_Interbank-Clearing-System_f_r_JPY-

Zengin ist das japanische System für JPY-Überweisungen – vergleichbar mit SEPA für Japan. Wenn Ihr Unternehmen japanische Lieferanten in Yen bezahlt, läuft das über Zengin.  Drei wichtige Japan-Besonderheiten: 1) Keine IBAN: Japan nutzt ein anderes Kontonummernsystem 2) Name auf Japanisch: Der Empfängername muss in Katakana (japanische Schrift) angegeben werden – lateinische Buchstaben reichen nicht 3) Zeitverschiebung: Japan ist im Winter 8 Stunden vor Deutschland – Zahlungen müssen sehr früh morgens (deutsche Zeit) eingereicht werden

### Zengin-Format_propriet_r_EDI-basiert_Zengin_EDI_2019_struktu

Zengin-Format (proprietär, EDI-basiert) Zengin EDI (2019): strukturierte Remittance  KEIN ISO 20022 (noch) KEIN IBAN  SWIFT MT103: für internationale JPY-Zahlungen aus dem Ausland → Korrespondenzbank Japan konvertiert auf Zengin

### Zengin-Format_propriet_r_EDI-basiert_Zengin_EDI_2019_struktu

DNS – Deferred Net Settlement  Zyklen: • Intraday-Clearing: mehrere Zyklen • Final Settlement: über BOJ-NET am Tagesende  BOJ-NET (Großbetrag): RTGS, Real-Time, Zentralbankgeld  Settlement-Währung: JPY  Keine Fremdwährungen (FX-Konvertierung vor Einreichung)

### Zengin-Format_propriet_r_EDI-basiert_Zengin_EDI_2019_struktu

Betriebszeiten: Mo–Fr (japanische Bankarbeitstage)  Öffnung: 08:30 JST = 00:30 CET (Winter) Cut-off: 15:30 JST = 07:30 CET (Winter)  Japan Standard Time (JST): JST = CET + 8h (Winter) JST = CEST + 7h (Sommer)  Japanische Feiertage: viele! Ca. 16 Nationalfeiertage/Jahr Golden Week (Ende April–Anfang Mai): ca. 4–5 Bankarbeitstage gesperrt → Zahlungen VORHER planen

### Ca_1_300_japanische_Banken_Zugang_f_r_EU-Corporates_1_JPY-Ko

Ca. 1.300 japanische Banken  Zugang für EU-Corporates: 1) JPY-Konto bei japanischer Bank    (MUFG, SMBC, Mizuho) 2) EU-Bank mit Japan-Korrespondenz    (Deutsche Bank, HSBC, Citibank)  Empfehlung: Bei regelmäßigen JPY-Zahlungen: JPY-Konto bei japanischer Bank → günstiger + direkter Zengin-Zugang

### 1_KATAKANA-PFLICHT_Empf_ngername_in_Katakana_ist_technische_

1) KATAKANA-PFLICHT: Empfängername in Katakana ist technische Voraussetzung für Zengin-Verarbeitung. Bei SWIFT MT103 aus Ausland: Korrespondenzbank (MUFG, SMBC etc.) muss Katakana-Konvertierung durchführen. SAP-Stammdaten: Katakana-Feld zusätzlich zu lateinischen Namen pflegen. 2) KEIN IBAN: Japanische Bankkonten haben 7-stellige Bankleitzahl (Zengin-Bankcode) + 3-stellige Filialnummer + Kontonummer. SAP-Konfiguration: Bankschlüssel-Struktur für Japan anpassen. 3) GOLDEN WEEK: Ende April / Anfang Mai: ca. 4–5 Bankarbeitstage keine JPY-Zahlungen möglich. Zahllauf-Planung anpassen; Lieferanten informieren. 4) JPY/EUR FX: JPY-Zahlungen erfordern FX-Buchung in SAP. Volatile Wechselkurse beachten. 5) ZENGIN EDI: Für strukturierte Remittance in B2B-Zahlungen; ermöglicht automatisches Invoice-Matching bei japanischen Empfängern.

### 1_KATAKANA-PFLICHT_Empf_ngername_in_Katakana_ist_technische_

1) JAPANISCHE KONTONUMMERN ANDERS EINTRAGEN: Japan hat kein IBAN-System. Sie brauchen drei Angaben: Bankcode, Filialnummer, Kontonummer. In SAP müssen diese anders hinterlegt werden als europäische Konten. 2) NAME AUF JAPANISCH: Wenn Sie einem japanischen Lieferanten zahlen, muss sein Name in japanischer Schrift (Katakana) in Ihrer Zahlung stehen. Ohne das kann die Zahlung nicht zugeordnet werden. 3) GOLDEN WEEK PLANEN: Ende April / Anfang Mai hat Japan ca. 4–5 Feiertage hintereinander. In dieser Zeit gibt es keine Zahlungsverarbeitung. Zahlungen müssen vorher oder danach eingeplant werden. 4) FRÜH MORGENS EINREICHEN: Wegen der Zeitverschiebung (Japan ist 8 Stunden vor Deutschland) muss eine JPY-Zahlung die heute in Japan ankommen soll, in Deutschland sehr früh morgens eingereicht sein.

### SAP-Konfiguration_f_r_Japan_Bankschl_ssel_Japan_T-Code_FI01_

SAP-Konfiguration für Japan:  Bankschlüssel Japan (T-Code FI01): • Bankland: JP • Bankleitzahl: 7-stelliger Zengin-Bankcode • KEIN IBAN-Format  Kontoinhaber: • Standardfeld: lateinische Schrift • Zusatzfeld: Katakana (Custom-Feld oder Adresszeile)  DMEE / Zahlungsformat: • SWIFT_MT103 für Auslandszahlung JPY • Katakana-Feld in MT103 :59: übergeben • Japanische Korrespondenzbank konvertiert auf Zengin  Fabrikkalender Japan (SCAL): • 16 nationale Feiertage • Golden Week explizit eintragen • Obon-Periode (Mitte August) beachten  Wechselkurs: • Kurstyp M (Mittelkurs) für JPY • Tagesaktuelle Kurse via SAP-Kurspflege

### SAP-Konfiguration_f_r_Japan_Bankschl_ssel_Japan_T-Code_FI01_

Für JPY-Zahlungen müssen Sie in SAP einmalig einrichten:  1) JAPANISCHE BANKDATEN RICHTIG EINGEBEN:    Kein IBAN – stattdessen:    • Bankcode (7 Stellen)    • Filialnummer (3 Stellen)    • Kontonummer  2) JAPANISCHEN NAMEN HINTERLEGEN:    Für jeden japanischen Lieferanten: Katakana-Name zusätzlich zum normalen Namen  3) JAPANISCHE FEIERTAGE IN SAP:    Besonders wichtig: Golden Week Ende April/Anfang Mai  4) FRÜHE DEADLINE:    JPY-Zahlungen für denselben Tag: bis ca. 07:30 Uhr morgens (deutsche Zeit) einreichen