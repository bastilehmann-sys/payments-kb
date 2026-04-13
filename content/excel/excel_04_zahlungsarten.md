# Global Payments Datenbank — Zahlungsarten, Cut-offs & Value Dates

> Stand: April 2026  \|  Experten-Version (blau) + Einsteiger-Version (grün)  \|  Cut-off-Zeiten immer in CET/CEST  \|  Bankspezifische Abweichungen möglich

## SEPA – Credit Transfer (Überweisung)

### IDENTIFIKATION & GRUNDDATEN

| Zahlungsart | Kürzel / Code | Instrument-Typ | Geltungsbereich & Währung | Clearing-System | Nachrichtenformat |
| --- | --- | --- | --- | --- | --- |
| SEPA Credit Transfer | SCT | Push Payment (Überweisung) Initiiert durch Auftraggeber | SEPA-Raum (36 Länder) Währung: EUR | STEP2 (EBA Clearing) + TARGET2 (für URGP) | pain.001.001.03+ pacs.008 (Interbank) pain.002 (Status) |

### BESCHREIBUNG

| Beschreibung (Experte) | Beschreibung (Einsteiger) |
| --- | --- |
| → [Details unten: Standard-_berweisung_im_SEPA-Raum_Push-Payment_Auftraggeber_] | → [Details unten: Standard-_berweisung_im_SEPA-Raum_Push-Payment_Auftraggeber_] |

### TIMING – CUT-OFFS & VALUE DATES

| Cut-off-Zeiten (Einreichung bei Bank) | Value Date Auftraggeber | Value Date Empfänger | Besondere Fristen & Vorlaufzeiten |
| --- | --- | --- | --- |
| → [Details unten: STEP2-Zyklen_Richtwerte_Zyklus_1_Cut-off_06_00_CET_Zyklus_2_] | D+0 (Tag der Ausführung bei Einreichung vor Cut-off)  Konto wird am Ausführungstag belastet | D+1 (nächster Bankarbeitstag nach Settlement)  Gesetzliche Maximalfrist laut SEPA-VO: D+1  Bei frühem STEP2-Zyklus (Zyklus 1): ggf. Same-Day-Gutschrift möglich (bankabhängig) | → [Details unten: STEP2-Zyklen_Richtwerte_Zyklus_1_Cut-off_06_00_CET_Zyklus_2_] |

### KOSTEN & LIMITS

| Typische Kosten (Richtwerte) | Betragslimits |
| --- | --- |
| Für Corporate: € 0,00 – 0,50/Transaktion (bankabhängig)  Grenzüberschreitend SEPA: GLEICHER Preis wie national (Preisparität-Pflicht)  Eilüberweisung (URGP über T2): EUR 5–25 je nach Bank | Technisch: kein Limit  Praktisch bankabhängig: Retail: bis EUR 50.000 Corporate: individuell verhandelt  STEP2 technisch: kein Maximalbetrag  Für Großbeträge: T2 URGP empfohlen |

### CORPORATE RELEVANZ & PRAXIS

| Corporate Relevanz & SAP-Praxis (Experte) | Corporate Relevanz & SAP-Praxis (Einsteiger) |
| --- | --- |
| → [Details unten: 1_F110-ZAHLLAUF_Standard-SCT_ist_das_dominierende_Zahlungsin] | → [Details unten: 1_F110-ZAHLLAUF_Standard-SCT_ist_das_dominierende_Zahlungsin] |

### RISIKEN & FALLSTRICKE

| Risiken & Fallstricke (Experte) | Risiken & Fallstricke (Einsteiger) |
| --- | --- |
| → [Details unten: 1_DUPLIKAT-ZAHLUNG_Gleiche_MsgId_oder_EndToEndId_Bank_weist_] | → [Details unten: 1_DUPLIKAT-ZAHLUNG_Gleiche_MsgId_oder_EndToEndId_Bank_weist_] |

### LÄNDERVERFÜGBARKEIT

| Länderverfügbarkeit & regionale Besonderheiten | Länder mit Einschränkungen & lokale Varianten |
| --- | --- |
| → [Details unten: VOLLST_NDIG_VERF_GBAR_36_SEPA-L_nder_EU-27_DE_AT_BE_BG_CY_CZ] | → [Details unten: VOLLST_NDIG_VERF_GBAR_36_SEPA-L_nder_EU-27_DE_AT_BE_BG_CY_CZ] |

### Standard-_berweisung_im_SEPA-Raum_Push-Payment_Auftraggeber_

Standard-Überweisung im SEPA-Raum. Push-Payment: Auftraggeber initiiert aktiv. Ausführungsfrist D+1 gesetzlich garantiert (SEPA-VO). Drei STEP2-Clearing-Zyklen täglich (06:00, 12:00, 16:00 CET Cut-off). Revokation möglich bis zum Zeitpunkt der Ausführung (recall via camt.056). Keine Betragsbegrenzung technisch; praktisch Bankgrenzen.  Technische Parameter: • EndToEndId: max. 35 Zeichen, vom Auftraggeber vergeben, bis Empfänger durchgereicht • RmtInf/Ustrd: max. 140 Zeichen Verwendungszweck • RmtInf/Strd: strukturierte Referenz (Rechnungsnummer) bis 35 Zeichen • ChargeBearer: SLEV (Pflicht bei SEPA) • SvcLvl: SEPA (Pflicht für SEPA-Routing) • BIC: seit 2016 kein Pflichtfeld für grenzüberschreitende SEPA

### Standard-_berweisung_im_SEPA-Raum_Push-Payment_Auftraggeber_

SCT ist die normale SEPA-Überweisung – das was die meisten Menschen als 'Banküberweisung' kennen. Sie beauftragen Ihre Bank, Geld von Ihrem Konto auf das Konto eines Empfängers zu überweisen.  Wichtigste Merkmale: • Funktioniert in 36 europäischen Ländern in Euro • Geld ist spätestens am nächsten Bankarbeitstag beim Empfänger • Günstig – oft kostenlos oder wenige Cent • Nur Bankarbeitstage (kein Wochenende) • Sie initiieren aktiv ('Push') – niemand kann Ihnen einfach Geld abbuchen

### STEP2-Zyklen_Richtwerte_Zyklus_1_Cut-off_06_00_CET_Zyklus_2_

STEP2-Zyklen (Richtwerte): Zyklus 1: Cut-off 06:00 CET Zyklus 2: Cut-off 12:00 CET Zyklus 3: Cut-off 16:00 CET  Bankinterne Cut-offs (typisch): • Deutsche Bank: 15:00 CET • Commerzbank: 14:30 CET • UniCredit DE: 14:00 CET • ING: 15:30 CET  Hinweis: Bankinterner Cut-off liegt VOR STEP2-Cut-off (Verarbeitungszeit der Bank)  SAP F110-Timing: Optimal: Zahllauf bis 13:00 CET

### STEP2-Zyklen_Richtwerte_Zyklus_1_Cut-off_06_00_CET_Zyklus_2_

Revokation (Rückruf): Möglich bis T 15:00 CET (Ausführungstag) via camt.056 (Recall)  Nach Settlement: Recall via camt.056 → Empfänger-Bank leitet weiter → Empfänger muss zustimmen  Rückbuchungs-Frist: Keine gesetzliche Pflicht nach D+1 Settlement  Sperrfristen: TARGET2-Feiertage: 6 Tage/Jahr (kein Settlement)

### 1_F110-ZAHLLAUF_Standard-SCT_ist_das_dominierende_Zahlungsin

1) F110-ZAHLLAUF: Standard-SCT ist das dominierende Zahlungsinstrument für AP. SAP F110 erzeugt pain.001 mit SvcLvl SEPA via DMEE SEPA_CT. Kritisch: Zahldatum-Logik (ZFBDT) korrekt auf Bankarbeitstage prüfen. 2) SAMMELZAHLUNG: BtchBookg=true → Bank fasst alle SCTs zu einer Kontoauszugsbuchung zusammen → vereinfacht BAM, erschwert Debitorenmatching. BtchBookg=false → Einzelbuchungen im Auszug. 3) RECALL-PROZESS: Falsche Zahlung zurückrufen via camt.056 (PaymentCancellationRequest). SAP-Standard: keine Out-of-the-Box-Funktion; meist manuell über Bank-Portal. 4) COR1 (DEPRECATED): Frühere Variante SCT COR1 (1-Tages-Ausführung) ist seit 2016 in regulärem SCT aufgegangen. 5) IBAN-ONLY: Seit 2016 keine BIC-Pflicht mehr; SAP sollte bei leerem BIC-Feld keinen Fehler werfen.

### 1_F110-ZAHLLAUF_Standard-SCT_ist_das_dominierende_Zahlungsin

1) DAS STANDARDINSTRUMENT: 90%+ aller Lieferantenzahlungen in Europa laufen als SCT. In SAP ist das der Zahllauf F110 mit dem SEPA-Zahlungsformat. 2) DATUM RICHTIG SETZEN: In SAP muss das Zahlungsdatum ein Bankarbeitstag sein. Fällt es auf ein Wochenende oder Feiertag, verschiebt SAP es automatisch – wenn richtig konfiguriert. 3) VERWENDUNGSZWECK MAXIMIEREN: Die 140 Zeichen Verwendungszweck sind wertvoll. Tragen Sie dort die Rechnungsnummer ein – das erleichtert dem Lieferanten die Zuordnung. 4) FEHLER RÜCKRUFEN: Wenn Sie versehentlich falsch gezahlt haben, können Sie die Zahlung zurückrufen – aber nur wenn sie noch nicht beim Empfänger angekommen ist. Danach brauchen Sie die Kooperation des Empfängers.

### 1_DUPLIKAT-ZAHLUNG_Gleiche_MsgId_oder_EndToEndId_Bank_weist_

1) DUPLIKAT-ZAHLUNG: Gleiche MsgId oder EndToEndId → Bank weist zweite Datei ab. SAP-Nummernkreis-Überschneidungen bei Multi-Bukrs-Setups → doppelte EndToEndIds. 2) DATUM-FEHLER: ReqdExctnDt auf Feiertag gesetzt → Bank verschiebt auf nächsten Bankarbeitstag ohne Notification → Lieferant beschwert sich über Verzug. 3) CUTOFF VERPASST: pain.001 nach bankinternem Cut-off eingereicht → Ausführung erst nächsten Tag → bei engen Zahlungszielen (z.B. Skonto) problematisch. 4) RECALL NACH SETTLEMENT: camt.056 nach D+1 Settlement → Empfänger-Bank kann nur weiterleiten → keine Garantie der Rückbuchung → rechtlicher Weg nötig. 5) IBAN-FEHLER: Zahlung auf falsche IBAN geht durch (Prüfziffer korrekt, aber falsches Konto). Ohne IBAN-Name-Check (PSD3) keine Prüfung des Namens.

### 1_DUPLIKAT-ZAHLUNG_Gleiche_MsgId_oder_EndToEndId_Bank_weist_

1) FALSCHE IBAN: Wenn Sie sich bei der IBAN vertippt haben aber die Prüfziffer zufällig stimmt, geht das Geld auf ein falsches Konto. Heute gibt es keine automatische Namens-Prüfung (kommt erst mit PSD3).  2) CUT-OFF VERPASST: Wenn SAP die Zahlungsdatei nach 14–15 Uhr schickt, wird die Zahlung erst am nächsten Tag ausgeführt. Bei engen Zahlungszielen (Skonto-Frist!) kann das teuer werden.  3) FEIERTAGS-ÜBERRASCHUNG: Die 6 TARGET2-Feiertage sind nicht immer national bekannt (z.B. Ostermontag ist in einigen Ländern kein Feiertag). Zahlung kommt trotzdem einen Tag später.  4) RÜCKRUF SCHWIERIG: Nach Settlement kooperiert der Empfänger vielleicht nicht bei der Rückgabe. Das kann teuer und langsam werden.

### VOLLST_NDIG_VERF_GBAR_36_SEPA-L_nder_EU-27_DE_AT_BE_BG_CY_CZ

VOLLSTÄNDIG VERFÜGBAR (36 SEPA-Länder): EU-27: DE, AT, BE, BG, CY, CZ, DK, EE, ES, FI, FR, GR, HR, HU, IE, IT, LT, LU, LV, MT, NL, PL, PT, RO, SE, SI, SK Non-EU SEPA: CH (Schweiz), GB (UK post-Brexit), NO, IS, LI, MC, SM, VA, AD  VERFÜGBARKEIT: • Alle 36 Länder: SCT senden und empfangen vollständig • Ausführungsfrist D+1: EU-weit gesetzlich garantiert (SEPA-VO) • Non-EU SEPA (CH, UK etc.): SEPA-Erreichbarkeit technisch sichergestellt, aber kein gesetzlicher D+1-Anspruch  WÄHRUNG: Nur EUR • CH: CHF-Zahlungen separat über SIC (Swiss Interbank Clearing) • UK: GBP-Zahlungen separat über CHAPS/FPS • DK: DKK-Zahlungen über Nets (dänisches System) • SE: SEK-Zahlungen über BiR/RIX • CZ/HU/PL/RO: Landeswährung über nationale Systeme

### VOLLST_NDIG_VERF_GBAR_36_SEPA-L_nder_EU-27_DE_AT_BE_BG_CY_CZ

UK (POST-BREXIT): • Technisch SEPA-Mitglied geblieben • UK-Banken NICHT mehr zur SEPA-Erreichbarkeit verpflichtet • Einzelne UK-Banken empfangen SEPA, andere nicht • Empfehlung: Vor UK-SCT-Zahlung Erreichbarkeit prüfen • Alternative: SWIFT MT103/pacs.008 + CHAPS  SCHWEIZ: • SEPA-Mitglied (non-EU) • CHF-Zahlungen: Nicht über SCT – separate SIC-Verbindung nötig • EUR-Zahlungen an CH-IBAN: über SCT möglich • CH IBANs: beginnen mit CH, 21 Stellen  SKANDINAVIEN (DK, SE, NO): • SEPA-Mitglieder für EUR • Nationale Währungen (DKK, SEK, NOK): eigene Systeme • Besonderheit NO: Vipps für Consumer Instant  OSTEUROPA (PL, CZ, HU, RO, BG): • SEPA-Mitglieder für EUR • Nationale Währungen: eigene Clearing-Systeme • EUR-Anteil im Zahlungsverkehr geringer als Westeuropa

## Instant Payments (Echtzeit)

### IDENTIFIKATION & GRUNDDATEN

| Zahlungsart | Kürzel / Code | Instrument-Typ | Geltungsbereich & Währung | Clearing-System | Nachrichtenformat |
| --- | --- | --- | --- | --- | --- |
| SEPA Instant Credit Transfer | SCT Inst | Push Payment (Echtzeit) Unwiderruflich ab Settlement | SEPA-Raum Währung: EUR 24/7/365 | TIPS (EZB) + EBA RT1 | pain.001.001.09+ (SvcLvl: INST) pacs.008 camt.054 (Gutschrift) |

### BESCHREIBUNG

| Beschreibung (Experte) | Beschreibung (Einsteiger) |
| --- | --- |
| → [Details unten: Echtzeit-_berweisung_mit_Settlement-Finalit_t_innerhalb_10_S] | → [Details unten: Echtzeit-_berweisung_mit_Settlement-Finalit_t_innerhalb_10_S] |

### TIMING – CUT-OFFS & VALUE DATES

| Cut-off-Zeiten (Einreichung bei Bank) | Value Date Auftraggeber | Value Date Empfänger | Besondere Fristen & Vorlaufzeiten |
| --- | --- | --- | --- |
| → [Details unten: KEIN_Cut-off_24_7_365_Maximale_Ausf_hrungszeit_10_Sekunden_T] | D+0, Sekunden (sofortige Kontobelastung bei Ausführung)  KEIN Float | D+0, < 10 Sekunden (sofortige finale Gutschrift)  Bestätigung via camt.054 innerhalb Sekunden | → [Details unten: KEIN_Cut-off_24_7_365_Maximale_Ausf_hrungszeit_10_Sekunden_T] |

### KOSTEN & LIMITS

| Typische Kosten (Richtwerte) | Betragslimits |
| --- | --- |
| Preisparität mit SCT (Pflicht ab Okt. 2025)  Aktuell noch: EUR 0,00–1,00/Transaktion (bankabhängig)  Ziel: gleich günstig wie SCT Standard | Aktuell: EUR 100.000 pro Transaktion  Geplant: EUR 250.000 (Ende 2025)  Banken können niedrigere Limits setzen (verhandelbar)  24/7: auch für Beträge über EUR 50.000 |

### CORPORATE RELEVANZ & PRAXIS

| Corporate Relevanz & SAP-Praxis (Experte) | Corporate Relevanz & SAP-Praxis (Einsteiger) |
| --- | --- |
| → [Details unten: 1_SAP_BCM_KONFIGURATION_pain_001_PmtTpInf_SvcLvl_Cd_muss_INS] | → [Details unten: 1_SAP_BCM_KONFIGURATION_pain_001_PmtTpInf_SvcLvl_Cd_muss_INS] |

### RISIKEN & FALLSTRICKE

| Risiken & Fallstricke (Experte) | Risiken & Fallstricke (Einsteiger) |
| --- | --- |
| → [Details unten: 1_UNWIDERRUFLICHKEIT_Einzige_Kontrollm_glichkeit_ist_Pre-Exe] | → [Details unten: 1_UNWIDERRUFLICHKEIT_Einzige_Kontrollm_glichkeit_ist_Pre-Exe] |

### LÄNDERVERFÜGBARKEIT

| Länderverfügbarkeit & regionale Besonderheiten | Länder mit Einschränkungen & lokale Varianten |
| --- | --- |
| → [Details unten: EUROZONE_20_L_nder_PFLICHT_AB_OKT_2025_DE_AT_BE_CY_EE_ES_FI_] | → [Details unten: EUROZONE_20_L_nder_PFLICHT_AB_OKT_2025_DE_AT_BE_CY_EE_ES_FI_] |

### Echtzeit-_berweisung_mit_Settlement-Finalit_t_innerhalb_10_S

Echtzeit-Überweisung mit Settlement-Finalität innerhalb 10 Sekunden. Betrieb 24/7/365. Seit SEPA-Instant-VO (2024/886): Pflicht für alle Eurozone-PSPs ab Okt. 2025 (Empfang) / Jan. 2025 (Senden) zu Preisparität mit SCT. Settlement über TIPS (Zentralbankgeld, final) oder EBA RT1.  Kritische Unterschiede zu SCT: • UNWIDERRUFLICH: Kein Recall nach Settlement möglich (Ausnahme: technischer Fehler) • SOFORTIGE KONTOBELASTUNG: Kein Float • 24/7: auch Wochenenden und Feiertage • IBAN-Verifikation: Pflicht vor Ausführung (Instant-VO) • Timeout: 20 Sekunden; danach REJECT • pain.001 Service Level: 'INST' statt 'SEPA'

### Echtzeit-_berweisung_mit_Settlement-Finalit_t_innerhalb_10_S

SCT Inst ist die Sofortüberweisung – Geld ist in unter 10 Sekunden beim Empfänger, auch am Wochenende und nachts.  Der wichtigste Unterschied zur normalen Überweisung: • Normal (SCT): Geld kommt am nächsten Bankarbeitstag an • Instant (SCT Inst): Geld kommt in unter 10 Sekunden an  Und das Wichtigste: • Instant ist UNWIDERRUFLICH. Wenn Sie auf ein falsches Konto überweisen, ist das Geld weg. Kein Rückruf möglich. • Ab Oktober 2025: Alle Banken müssen Instant anbieten – zum gleichen Preis wie normale Überweisungen.

### KEIN_Cut-off_24_7_365_Maximale_Ausf_hrungszeit_10_Sekunden_T

KEIN Cut-off (24/7/365)  Maximale Ausführungszeit: < 10 Sekunden  Timeout: 20 Sekunden – danach automatischer REJECT  Bankspezifische interne Prüfzeiten: Sanctions Screening: max. 30 Sekunden erlaubt (SEPA-Instant-VO)  SAP-Timing: Sofortiger Push nach Zahlungsfreigabe

### KEIN_Cut-off_24_7_365_Maximale_Ausf_hrungszeit_10_Sekunden_T

Revokation: NICHT MÖGLICH nach Settlement  Ausnahme: Technischer Fehler der Bank (TIPS-seitig)  Recall-Verfahren: pacs.028 (Payment Status Request) für Status-Abfrage  Limit: Aktuell: EUR 100.000 Geplant: EUR 250.000 (Ende 2025)  Sanctions Screening: Max. 30 Sek. Verzögerung erlaubt (SEPA-Instant-VO)

### 1_SAP_BCM_KONFIGURATION_pain_001_PmtTpInf_SvcLvl_Cd_muss_INS

1) SAP BCM KONFIGURATION: pain.001 PmtTpInf/SvcLvl/Cd muss 'INST' enthalten. Standard SEPA_CT DMEE enthält INST nicht – separate Konfiguration oder DMEE-Erweiterung nötig. 2) PRE-EXECUTION CONTROLS: Da kein Recall möglich – Fraud-Prävention vor Ausführung kritisch. Implementierung: Betragslimit pro Transaktion, Whitelist bekannter Empfänger, Dual-Control für Beträge über Schwelle. 3) CAMT.054 ECHTZEIT: Incoming Instant Payments erzeugen camt.054 innerhalb Sekunden. BAM muss Echtzeit-Processing unterstützen (nicht nur Tages-Batch). SAP S/4HANA: Cash Management Echtzeit-Update konfigurieren. 4) IHB-OPTIMIERUNG: Intragroup Instant Payments 24/7 für Notfall-Liquidität. Kein Warten auf Banköffnungszeiten für konzerninternen Liquiditätsausgleich. 5) DUAL USE: Instant für Eilzahlungen (ersetzt URGP über T2, günstiger); Standard-SCT für Batch-Zahlungsläufe.

### 1_SAP_BCM_KONFIGURATION_pain_001_PmtTpInf_SvcLvl_Cd_muss_INS

1) WANN NUTZEN: Instant Payment empfiehlt sich für: dringende Lieferantenzahlungen, Zahlungen nach Bankschluss/am Wochenende, Skonto-Ausnutzung bis zur letzten Minute, Notfall-Konzernzahlungen. 2) SAP MUSS KONFIGURIERT SEIN: Nicht jede SAP-Konfiguration kann Instant automatisch senden. Lassen Sie prüfen ob das aktiv ist. 3) FREIGABEPROZESS KRITISCH: Da Instant nicht rückrufbar ist, muss der interne Freigabeprozess stimmen. Vier-Augen-Prinzip vor dem Senden – nicht danach. 4) EINGEHENDE INSTANT-ZAHLUNGEN: Wenn Kunden per Instant zahlen, müssen Sie das sofort in SAP sehen – nicht erst am nächsten Morgen. Das muss extra eingerichtet werden.

### 1_UNWIDERRUFLICHKEIT_Einzige_Kontrollm_glichkeit_ist_Pre-Exe

1) UNWIDERRUFLICHKEIT: Einzige Kontrollmöglichkeit ist Pre-Execution. Fehlbetrag oder falsche IBAN nach Ausführung: kein Recall. Nur über Kooperation des Empfängers oder Rechtsweg. 2) LIMIT-UNTERSCHREITUNG DURCH BANK: Bankspezifische Limits (z.B. EUR 15k) unterschreiten Verordnungspflicht (EUR 100k) → verhandelbar, aber manche Banken setzen niedriger. 3) CAMT.054 + CAMT.053 DUPLIKAT: Ohne Deduplizierungslogik (AcctSvcrRef als Key) werden Instant-Eingänge doppelt gebucht. 4) SANCTIONS-SCREENING-TIMEOUT: Wenn Sanctions Screening > 30 Sek. → Zahlung wird als RJCT returned → automatischer Fallback auf SCT Standard nötig. 5) DATENQUALITÄT: IBAN-Name-Check vor Instant-Ausführung (Pflicht per Instant-VO) → Stammdatenqualität kritisch.

### 1_UNWIDERRUFLICHKEIT_Einzige_Kontrollm_glichkeit_ist_Pre-Exe

1) KEIN RÜCKRUF MÖGLICH: Das ist das größte Risiko. Wenn jemand versehentlich auf eine falsche IBAN überweist oder den falschen Betrag eingibt – das Geld ist weg. Freigabeprozesse müssen stimmen.  2) DOPPELT GEBUCHT: Wenn die sofortige Benachrichtigung (camt.054) UND der Tagesauszug (camt.053) nicht richtig koordiniert sind, wird die gleiche Buchung zweimal in SAP erfasst.  3) BANKLIMIT ZU NIEDRIG: Manche Banken erlauben Instant nur bis EUR 15.000, obwohl gesetzlich EUR 100.000 vorgeschrieben. Das muss aktiv mit der Bank verhandelt werden.  4) NICHT KONFIGURIERT: SAP sendet die Zahlung als normale SCT statt als Instant, weil die Konfiguration fehlt. Der Vorteil der Sofortüberweisung geht verloren.

### EUROZONE_20_L_nder_PFLICHT_AB_OKT_2025_DE_AT_BE_CY_EE_ES_FI_

EUROZONE (20 Länder) – PFLICHT AB OKT. 2025: DE, AT, BE, CY, EE, ES, FI, FR, GR, IE, IT, LT, LU, LV, MT, NL, PT, SI, SK + HR (ab 2023)  NON-EURO SEPA – PFLICHT AB JAN. 2027: BG, CZ, DK, HU, PL, RO, SE + UK, CH, NO, IS, LI  AKTUELLE VERFÜGBARKEIT (April 2026): • DE: Sehr gut ausgebaut (Sparkassen, Volksbanken, Großbanken) • NL: Sehr gut (ING, Rabobank, ABN AMRO vorne) • IT: Gut ausgebaut (Intesa, UniCredit) • ES: Gut (CaixaBank, Santander ES) • FR: Gut (BNP, Société Générale, Crédit Agricole) • AT: Gut (Erste, Raiffeisen) • PL: Gut ausgebaut (BLIK-System ergänzt)  SYSTEME: • TIPS (EZB): Primäres Instant-Settlement-System • EBA RT1: Parallelsystem (EBA Clearing) • Interoperabilität TIPS ↔ RT1: sichergestellt

### EUROZONE_20_L_nder_PFLICHT_AB_OKT_2025_DE_AT_BE_CY_EE_ES_FI_

LÄNDER MIT EINGESCHRÄNKTER INSTANT-VERFÜGBARKEIT: • Kleine EU-Länder (CY, MT, LU): eingeschränkte Bankauswahl • Nicht-Eurozone (SE, DK, CZ, HU): eigene Instant-Systeme parallel   - SE: Swish (Consumer), RIX-INST (Interbank, in Einführung)   - DK: MobilePay / Straksclearing   - PL: BLIK (Consumer Instant sehr verbreitet)   - HU: AFR (Azonnali Fizetési Rendszer) – Instant seit 2020  UK (POST-BREXIT): • Faster Payments Service (FPS): GBP Instant • Nicht Teil von TIPS/RT1 • Separates System, kein SEPA-Instant  NICHT-SEPA-LÄNDER: • USA: FedNow (seit 2023, wächst), RTP (The Clearing House) • JP: Zengin Instant (24/7 seit 2018) • AU: NPP (New Payments Platform, seit 2018) • IN: UPI (Unified Payments Interface) – sehr verbreitet • BR: PIX (seit 2020, > 150 Mio Nutzer) • CN: CNAPS2 / Alipay / WeChat Pay

## SEPA – Direct Debit (Lastschrift)

### IDENTIFIKATION & GRUNDDATEN

| Zahlungsart | Kürzel / Code | Instrument-Typ | Geltungsbereich & Währung | Clearing-System | Nachrichtenformat |
| --- | --- | --- | --- | --- | --- |
| SEPA Direct Debit Core | SDD Core | Pull Payment (Lastschrift) Initiiert durch Gläubiger | SEPA-Raum (36 Länder) Währung: EUR B2C und B2B | STEP2 (EBA Clearing) | pain.008.001.02+ (SvcLvl: SEPA, LclInstrm: CORE) pain.002 (Status) camt.054 (R-Transaction) |
| SEPA Direct Debit B2B | SDD B2B | Pull Payment (Lastschrift) Nur B2B – kein Verbraucher | SEPA-Raum Währung: EUR Nur B2B | STEP2 (EBA Clearing) | pain.008.001.02+ (LclInstrm: B2B) pain.002 camt.054 |

### BESCHREIBUNG

| Beschreibung (Experte) | Beschreibung (Einsteiger) |
| --- | --- |
| → [Details unten: SEPA_Direct_Debit_Core_Gl_ubiger_zieht_Betrag_vom_Schuldner-] | → [Details unten: SEPA_Direct_Debit_Core_Gl_ubiger_zieht_Betrag_vom_Schuldner-] |
| → [Details unten: SDD_B2B_Lastschrift_ausschlie_lich_zwischen_Unternehmen_Zent] | → [Details unten: SDD_B2B_Lastschrift_ausschlie_lich_zwischen_Unternehmen_Zent] |

### TIMING – CUT-OFFS & VALUE DATES

| Cut-off-Zeiten (Einreichung bei Bank) | Value Date Auftraggeber | Value Date Empfänger | Besondere Fristen & Vorlaufzeiten |
| --- | --- | --- | --- |
| → [Details unten: STEP2_Einreichfristen_FRST_OOFF_Einreichung_D-2_bis_14_00_CE] | D (Fälligkeitstag) Konto Gläubiger wird am Fälligkeitstag gutgeschrieben | D (Fälligkeitstag) Schuldner-Konto wird am Fälligkeitstag belastet  Beide gleichzeitig (Same Day) | → [Details unten: STEP2_Einreichfristen_FRST_OOFF_Einreichung_D-2_bis_14_00_CE] |
| → [Details unten: STEP2_Einreichfristen_FRST_UND_RCUR_Einreichung_D-1_bis_14_0] | D (Fälligkeitstag) Gutschrift Gläubiger | D (Fälligkeitstag) Belastung Schuldner  Kein Rückgaberecht! Gutschrift ist final | → [Details unten: STEP2_Einreichfristen_FRST_UND_RCUR_Einreichung_D-1_bis_14_0] |

### KOSTEN & LIMITS

| Typische Kosten (Richtwerte) | Betragslimits |
| --- | --- |
| Für Gläubiger: EUR 0,00–0,30/Transaktion  Rückbuchungskosten: EUR 5–15/Rückbuchung (bankabhängig)  Hinweis: 8-Wochen-Rückgabe ohne Begründung ist kostenpflichtig für den Gläubiger | Technisch: kein Limit  Praktisch: Für große Einzüge: SDD B2B bevorzugen (kein Rückgaberecht) |
| Gleich wie SDD Core EUR 0,00–0,30/Transaktion  Keine Rückbuchungskosten durch 8-Wochen-Refund (gibt es nicht bei B2B) | Technisch: kein Limit  Empfehlung: Für große B2B-Beträge bevorzugen (kein Rückgaberecht) |

### CORPORATE RELEVANZ & PRAXIS

| Corporate Relevanz & SAP-Praxis (Experte) | Corporate Relevanz & SAP-Praxis (Einsteiger) |
| --- | --- |
| → [Details unten: 1_CI_PRO_LAND_Creditor_Identifier_ist_national_zu_beantragen] | → [Details unten: 1_CI_PRO_LAND_Creditor_Identifier_ist_national_zu_beantragen] |
| → [Details unten: 1_MANDATS-REGISTRIERUNG_BEIM_SCHULDNER_Kritischer_Unterschie] | → [Details unten: 1_MANDATS-REGISTRIERUNG_BEIM_SCHULDNER_Kritischer_Unterschie] |

### RISIKEN & FALLSTRICKE

| Risiken & Fallstricke (Experte) | Risiken & Fallstricke (Einsteiger) |
| --- | --- |
| → [Details unten: 1_SEQUENZ-FEHLER_RCUR_statt_FRST_Reject_MD01_MD02_Nach_Daten] | → [Details unten: 1_SEQUENZ-FEHLER_RCUR_statt_FRST_Reject_MD01_MD02_Nach_Daten] |
| → [Details unten: 1_MANDATS-REGISTRIERUNG_NICHT_ERFOLGT_H_ufigster_Fehler_bei_] | → [Details unten: 1_MANDATS-REGISTRIERUNG_NICHT_ERFOLGT_H_ufigster_Fehler_bei_] |

### LÄNDERVERFÜGBARKEIT

| Länderverfügbarkeit & regionale Besonderheiten | Länder mit Einschränkungen & lokale Varianten |
| --- | --- |
| → [Details unten: VOLLST_NDIG_VERF_GBAR_36_SEPA-L_nder_Gleiche_L_nderliste_wie] | → [Details unten: VOLLST_NDIG_VERF_GBAR_36_SEPA-L_nder_Gleiche_L_nderliste_wie] |
| → [Details unten: VOLLST_NDIG_VERF_GBAR_36_SEPA-L_nder_Gleiche_L_nderliste_wie] | → [Details unten: VOLLST_NDIG_VERF_GBAR_36_SEPA-L_nder_Gleiche_L_nderliste_wie] |

### SEPA_Direct_Debit_Core_Gl_ubiger_zieht_Betrag_vom_Schuldner-

SEPA Direct Debit Core: Gläubiger zieht Betrag vom Schuldner-Konto ein (Pull). Voraussetzung: gültiges SEPA-Mandat (Einzugsermächtigung). Schuldner hat Rückgaberecht: bis 8 Wochen nach Belastung ohne Angabe von Gründen; bis 13 Monate bei nicht autorisierter Transaktion.  Mandate: • Creditor Identifier (CI): Pflicht, je Land zu beantragen • MndtId: max. 35 Zeichen, pro CI eindeutig • Sequenztypen: FRST (erster Einzug), RCUR (wiederkehrend), OOFF (einmalig), FNAL (letzter Einzug) • AmdmntInd: Pflichtfeld wenn Mandatsdaten geändert (IBAN-Wechsel, Namensänderung) • Pre-Notification: mind. 14 Tage vor FRST (vertraglich auf 1 Tag reduzierbar) • Mandat erlischt: nach 36 Monaten ohne Nutzung

### SEPA_Direct_Debit_Core_Gl_ubiger_zieht_Betrag_vom_Schuldner-

SDD Core ist die europäische Lastschrift – Ihr Unternehmen zieht Geld direkt vom Konto Ihrer Kunden ein, statt auf deren Überweisung zu warten.  Wie es funktioniert: 1) Ihr Kunde unterschreibt einmalig eine Einzugsermächtigung (Mandat) 2) Sie reichen regelmäßig Lastschriften ein 3) Die Bank Ihres Kunden bucht den Betrag ab und schickt Ihnen das Geld  Wichtig: Ihr Kunde kann eine Lastschrift bis zu 8 Wochen lang zurückbuchen lassen – ohne Begründung. Das ist ein gesetzliches Recht.

### SDD_B2B_Lastschrift_ausschlie_lich_zwischen_Unternehmen_Zent

SDD B2B: Lastschrift ausschließlich zwischen Unternehmen. Zentraler Unterschied zu SDD Core: • KEIN Rückgaberecht für Schuldner (8-Wochen-Recht entfällt) • Schuldner-Bank MUSS Mandat vorab verifizieren (Mandatsdaten müssen bei Schuldner-Bank hinterlegt sein) • Kürzere R-Return-Fristen: D+1 (statt D+5 bei Core FRST) • Vorlaufzeit: FRST und RCUR beide D-1 (nicht D-2 wie Core FRST)  Mandats-Verifizierung bei Schuldner-Bank: Schuldner muss Mandat aktiv bei seiner Bank registrieren lassen → Bank prüft bei Einzug ob Mandat hinterlegt ist → ohne Hinterlegung: automatischer Reject

### SDD_B2B_Lastschrift_ausschlie_lich_zwischen_Unternehmen_Zent

SDD B2B ist die Firmenlastschrift – ähnlich wie SDD Core, aber mit einem großen Vorteil für Sie als Gläubiger:  Der Hauptunterschied: • SDD Core: Ihr Kunde kann die Lastschrift 8 Wochen lang ohne Begründung zurückbuchen • SDD B2B: Das Rückgaberecht gibt es NICHT – sobald das Geld bei Ihnen ist, bleibt es da  Dafür gibt es eine zusätzliche Anforderung: • Ihr Firmenkunde muss das Mandat aktiv bei seiner eigenen Bank registrieren lassen • Ohne diese Registrierung wird die Lastschrift abgewiesen

### STEP2_Einreichfristen_FRST_OOFF_Einreichung_D-2_bis_14_00_CE

STEP2 Einreichfristen:  FRST / OOFF: Einreichung: D-2 bis 14:00 CET (2 Bankarbeitstage vor Fälligk.)  RCUR / FNAL: Einreichung: D-1 bis 14:00 CET (1 Bankarbeitstag vor Fälligk.)  Bankinterner Cut-off: oft 12:00–13:00 CET (Vorlaufzeit der Bank!)  SAP F110 DD-Timing: FRST-Lauf: D-2 morgens RCUR-Lauf: D-1 morgens

### STEP2_Einreichfristen_FRST_OOFF_Einreichung_D-2_bis_14_00_CE

Pre-Notification: FRST: mind. 14 Tage vor Einzug (vertraglich: 1 Tag)  Rückgabe-Fristen: • R-Return (Bank):   bis D+5 (FRST)   bis D+2 (RCUR) • Refund (Schuldner):   bis 8 Wochen   (AUTHORIZED) • Unauthorized:   bis 13 Monate  Mandat-Verfallsdatum: 36 Monate ohne Nutzung → Neues FRST nötig  Gläubiger-ID (CI): Pro Land separat beantragen

### STEP2_Einreichfristen_FRST_UND_RCUR_Einreichung_D-1_bis_14_0

STEP2 Einreichfristen:  FRST UND RCUR: Einreichung: D-1 bis 14:00 CET (1 Bankarbeitstag vorher)  Vorteil gegenüber Core: FRST auch nur D-1 (Core: D-2 für FRST)  Bankinterner Cut-off: ca. 12:00–13:00 CET

### STEP2_Einreichfristen_FRST_UND_RCUR_Einreichung_D-1_bis_14_0

Rückgabe-Fristen: • R-Return (Bank):   D+1 (sehr kurz!) • Kein 8-Wochen-Refund   für Schuldner  Mandat-Verifizierung: Schuldner muss Mandat bei seiner Bank hinterlegen BEVOR erster Einzug  Vorlaufzeit: D-1 (auch für FRST)  Mandat-Verfall: 36 Monate (wie Core)

### 1_CI_PRO_LAND_Creditor_Identifier_ist_national_zu_beantragen

1) CI PRO LAND: Creditor Identifier ist national zu beantragen (DE: Bundesbank; IT: Banca d'Italia; FR: Banque de France etc.). Jeder CI hat eigenes Format (DE98ZZZ..., IT...). SAP: CI im Buchungskreis konfigurieren; bei multi-country DD: je Buchungskreis eigener CI. 2) SEQUENZ-AUTOMATIK IN SAP: SAP verwaltet SeqTp automatisch aus Mandatsstamm. FRST wird gesetzt wenn Mandat neu oder nach 36-Monats-Pause. RCUR für Folgeeinzüge. Fehler häufig bei manuellen Korrekturen. 3) AMDMNTIND: Bei IBAN-Wechsel des Schuldners: AmdmntInd=true + OrgnlDbtrAcct im pain.008 → häufig vergessen → Reject MD02. 4) R-TRANSACTION-HANDLING: SDD-Rückgaben via camt.054 mit RtrInf/Rsn/Cd. SAP BCM: Separate Buchungsregel je Reason Code. MD06 (Refund) ≠ AM04 (keine Deckung) → unterschiedliche Workflows. 5) PRE-NOTIFICATION AUTOMATISIERUNG: SAP kann Pre-Notification automatisch mit Ausgangsrechnung versenden (Formular via Natch/SXDC). Spart manuelle Arbeit.

### 1_CI_PRO_LAND_Creditor_Identifier_ist_national_zu_beantragen

1) GLÄUBIGER-ID ZUERST: Bevor Sie in irgendeinem europäischen Land Lastschriften einziehen können, müssen Sie eine Gläubiger-ID bei der Zentralbank des jeweiligen Landes beantragen. In Deutschland: bei der Deutschen Bundesbank. 2) ERSTE LASTSCHRIFT ANDERS: Die allererste Lastschrift eines Kunden heißt 'FRST' und muss 2 Bankarbeitstage früher eingereicht werden als alle weiteren. Wenn SAP das nicht richtig unterscheidet, werden erste Lastschriften abgewiesen. 3) MANDAT ABLAUFZEIT: Wenn ein Kunde 3 Jahre lang nicht per Lastschrift gezahlt hat und dann wieder eine Lastschrift kommt, gilt das Mandat als abgelaufen. Sie müssen es neu aufnehmen oder eine neue erste Lastschrift machen. 4) 8 WOCHEN RÜCKGABERECHT: Jeder Kunde kann innerhalb von 8 Wochen seine Lastschrift zurückbuchen lassen – ohne Begründung. Das ist Gesetz. Planen Sie das in Ihrer Liquidität ein.

### 1_MANDATS-REGISTRIERUNG_BEIM_SCHULDNER_Kritischer_Unterschie

1) MANDATS-REGISTRIERUNG BEIM SCHULDNER: Kritischer Unterschied zu Core. Vor erstem B2B-Einzug muss Schuldner Mandat bei seiner Bank hinterlegen. Onboarding-Prozess: Mandatsdaten (CI, MndtId, Gläubiger-Name) an Schuldner kommunizieren; Schuldner meldet bei seiner Bank. Ohne Hinterlegung: Reject AG01 oder MD01. 2) NUR FÜR B2B: SDD B2B darf nur zwischen Unternehmen genutzt werden. Einzug bei Verbraucher (auch versehentlich) verletzt SEPA-Regeln → Bank lehnt ab oder ist rückgabepflichtig. 3) VORLAUFZEIT-VORTEIL: Nur D-1 für alle Sequenztypen (statt D-2 für FRST bei Core) → kürzerer Prozesskalender für SAP F110. 4) LIQUIDITÄTSSICHERHEIT: Kein 8-Wochen-Rückgaberecht → bessere Liquiditätsplanung für Gläubiger. Ideal für regelmäßige B2B-Zahlungen (Wartungsverträge, Leasing, Konzerninterne Verrechnung).

### 1_MANDATS-REGISTRIERUNG_BEIM_SCHULDNER_Kritischer_Unterschie

1) KEIN RÜCKGABERECHT = MEHR SICHERHEIT: Bei SDD B2B können Ihre Firmenkunden die Lastschrift nicht einfach zurückbuchen. Das Geld bleibt bei Ihnen. Das macht SDD B2B ideal für regelmäßige B2B-Abbuchungen. 2) MANDAT MUSS REGISTRIERT SEIN: Anders als bei normalen Lastschriften muss Ihr Kunde das Mandat aktiv bei seiner eigenen Bank eintragen lassen. Das ist ein zusätzlicher Schritt beim Kunden-Onboarding. 3) KÜRZERE VORLAUFFRIST: SDD B2B muss nur einen Bankarbeitstag früher eingereicht werden – bei normalen Erstlastschriften sind es zwei Tage. Das vereinfacht den Prozess. 4) NUR FÜR FIRMEN: SDD B2B darf nicht für Privatkunden genutzt werden. Nur für Unternehmen.

### 1_SEQUENZ-FEHLER_RCUR_statt_FRST_Reject_MD01_MD02_Nach_Daten

1) SEQUENZ-FEHLER: RCUR statt FRST → Reject MD01/MD02. Nach Datenmigration oder SAP-Mandats-Import häufig falsch gesetzt. 2) CI FALSCH JE LAND: DE-CI für IT-Lastschrift → sofortiger Reject. Bei Multi-Country-Setup: CI-Mapping je Buchungskreis kritisch. 3) MANDAT-36-MONATE: Automatische FRST-Eskalation nach 36 Monaten häufig nicht konfiguriert → RCUR-Einreichung für abgelaufenes Mandat → Reject MD01. 4) AMDMNTIND VERGESSEN: IBAN des Schuldners ändert sich (z.B. Bankfusion) → pain.008 ohne AmdmntInd=true → Reject AM05 (Duplication) oder MD02. 5) 8-WOCHEN-RÜCKGABEN UNTERSCHÄTZT: Hohe Rückgabequote bei B2C-Lastschriften nach Urlaub (viele Kunden bemerken erst nach Wochen). Liquiditätsplanung muss Rückgaben berücksichtigen.

### 1_SEQUENZ-FEHLER_RCUR_statt_FRST_Reject_MD01_MD02_Nach_Daten

1) FALSCHE SEQUENZ: SAP setzt 'wiederkehrend' obwohl es die erste Lastschrift ist. Die Bank lehnt ab. Das passiert häufig nach Datenmigration oder bei manuellen Änderungen.  2) MANDAT ABGELAUFEN: Nach 3 Jahren Pause gilt das alte Mandat nicht mehr. Trotzdem wird 'wiederkehrend' gesendet. Ablehnung.  3) FALSCHE GLÄUBIGER-ID: Bei europaweiten Lastschriften braucht jedes Land eine eigene ID. Die falsche zu nutzen führt zur sofortigen Ablehnung.  4) 8-WOCHEN-RÜCKBUCHUNGEN UNTERSCHÄTZT: Besonders nach dem Sommerurlaub kommen viele Rückbuchungen auf einmal. Das muss in der Liquiditätsplanung berücksichtigt werden.

### 1_MANDATS-REGISTRIERUNG_NICHT_ERFOLGT_H_ufigster_Fehler_bei_

1) MANDATS-REGISTRIERUNG NICHT ERFOLGT: Häufigster Fehler bei B2B-Einführung. Gläubiger sendet Einzug, Schuldner hat Mandat nicht bei seiner Bank registriert → Reject MD01 oder AG01 beim ersten Einzug. 2) VERBRAUCHER VERSEHENTLICH EINBEZOGEN: B2B-Kennzeichen (LclInstrm: B2B) auf Verbraucher-Konto → Bank lehnt ab (Verbraucher hat kein B2B-Mandat). 3) D+1 RETURN-FRIST SEHR KURZ: Fehler in der Lastschrift werden von Schuldner-Bank nur bis D+1 retourniert → danach kein automatischer Korrekturmechanismus mehr.

### 1_MANDATS-REGISTRIERUNG_NICHT_ERFOLGT_H_ufigster_Fehler_bei_

1) KUNDE HAT NICHT REGISTRIERT: Ihr Firmenkunde hat das Mandat nicht bei seiner Bank eingetragen. Erste Lastschrift wird abgewiesen. Das muss beim Kunden-Onboarding explizit kommuniziert werden.  2) VERSEHENTLICH PRIVATKUNDEN: Wenn SDD B2B auf ein Privatkunden-Konto eingereicht wird, wird es abgelehnt. Stammdaten müssen korrekt zwischen B2B und B2C unterscheiden.  3) FEHLER SCHNELL MELDEN: Wenn in einer B2B-Lastschrift ein Fehler steckt, muss die Schuldner-Bank innerhalb von einem Bankarbeitstag reagieren. Danach gibt es keine automatische Rückgabe mehr.

### VOLLST_NDIG_VERF_GBAR_36_SEPA-L_nder_Gleiche_L_nderliste_wie

VOLLSTÄNDIG VERFÜGBAR (36 SEPA-Länder): Gleiche Länderliste wie SCT  BESONDERHEITEN JE LAND: • DE: Sehr verbreitet; CI bei Bundesbank (www.bundesbank.de) • AT: CI bei OeNB (Oesterreichische Nationalbank) • IT: CI bei Banca d'Italia; CBI-Format lokal verbreitet • FR: CI bei Banque de France; SEPA SDD gut etabliert • ES: CI bei Banco de España; früher stark auf Domiciliación • NL: CI bei De Nederlandsche Bank • BE: CI bei NBB (Nationale Bank van België)  CREDITOR IDENTIFIER (CI) BEANTRAGUNG: • DE: www.bundesbank.de/de/aufgaben/unbarer-zahlungsverkehr/serviceangebote/glaeubiger-identifikationsnummer • AT: www.oenb.at • IT: www.bancaditalia.it • FR: www.banque-france.fr • Format variiert je Land:   DE: DE98ZZZ0123456789   IT: IT95ZZZ0000012345   FR: FR72ZZZ123456

### VOLLST_NDIG_VERF_GBAR_36_SEPA-L_nder_Gleiche_L_nderliste_wie

LÄNDER MIT EINSCHRÄNKUNGEN: UK (POST-BREXIT): • UK nicht mehr Pflicht zur SEPA SDD-Erreichbarkeit • GBP-Lastschriften: BACS Direct Debit (UK-spezifisch) • EUR-Lastschriften an UK-IBAN: möglich aber nicht garantiert  SCHWEIZ: • Technisch SEPA SDD möglich für EUR-Konten • CHF-Lastschriften: Separates LSV-System (Lastschriftverfahren CH) • Praktisch: Wenige CH-Banken nehmen SDD Core an  OSTEUROPA: • SDD Core verfügbar für EUR-Konten • Nationale Währungen (PLN, CZK, HUF): eigene DD-Systeme   - PL: Polecenie Zapłaty   - CZ: SIPO/Inkaso   - HU: Felhatalmazó levél  NICHT-SEPA: • USA: ACH Debit (vergleichbar, aber NACHA-Format) • UK GBP: BACS Direct Debit • AU: Direct Entry • CA: PAD (Pre-Authorized Debit)

### VOLLST_NDIG_VERF_GBAR_36_SEPA-L_nder_Gleiche_L_nderliste_wie

VOLLSTÄNDIG VERFÜGBAR (36 SEPA-Länder): Gleiche Länderliste wie SCT/SDD Core  ADOPTION VARIIERT STARK JE LAND: • DE: Gut etabliert bei Großunternehmen und Utilities • NL: Sehr gut etabliert (stark B2B-Kultur) • AT: Gut (insb. Energieversorger, Versicherungen) • IT: Weniger verbreitet als Core; CBI-Lastschriften parallel • FR: Etabliert, aber TIP (Titre Interbancaire de Paiement) Konkurrenz • ES: Gut etabliert • BE: Gut  BESONDERHEIT: Schuldner-Bank MUSS Mandat vorab bestätigen → Onboarding-Aufwand höher als Core → Akzeptanz bei kleineren Banken teilweise gering  CREDITOR IDENTIFIER: Gleich wie SDD Core – selbe CI je Land

### VOLLST_NDIG_VERF_GBAR_36_SEPA-L_nder_Gleiche_L_nderliste_wie

LÄNDER MIT GERINGER B2B-ADOPTION: • IT: Lokale CBI-Lastschriften (CBI Direct Debit) oft bevorzugt   → Lokale Banken (regionale Sparkassen) unterstützen B2B teils nicht • GR: Geringere B2B-Lastschrift-Kultur; DIAS-System lokal • CY/MT: Kleine Bankenmärkte; B2B wenig verbreitet • Baltikum (EE, LT, LV): Gut für EUR; nationale Systeme für andere Währungen  UK (POST-BREXIT): • BACS Direct Debit: UK-Äquivalent zu SDD B2B • Kein Rückgaberecht bei Indemnity-Klausel • Separates System, separater CI nötig  NICHT-SEPA B2B-ÄQUIVALENTE: • USA: ACH CCD/CTX mit Corporate Resolution (Autorisierung) • UK GBP: BACS Direct Debit • AU: Direct Entry (DE) – Business • CA: PAD (Pre-Authorized Debit) – Business

## SWIFT – Internationale Zahlungen

### IDENTIFIKATION & GRUNDDATEN

| Zahlungsart | Kürzel / Code | Instrument-Typ | Geltungsbereich & Währung | Clearing-System | Nachrichtenformat |
| --- | --- | --- | --- | --- | --- |
| SWIFT International Transfer | MT103 → pacs.008 | Push Payment (international) Korrespondenzbankenprinzip | Global (200+ Länder) Alle Währungen (außer SEPA-EUR) | SWIFT Netzwerk → lokale RTGS/ACH (Fedwire, CHAPS etc.) | MT103 (bis Nov. 2025) pacs.008.001.09+ (ab Nov. 2025 Pflicht) |

### BESCHREIBUNG

| Beschreibung (Experte) | Beschreibung (Einsteiger) |
| --- | --- |
| → [Details unten: SWIFT-basierte_grenz_berschreitende_Zahlung_im_Korrespondenz] | → [Details unten: SWIFT-basierte_grenz_berschreitende_Zahlung_im_Korrespondenz] |

### TIMING – CUT-OFFS & VALUE DATES

| Cut-off-Zeiten (Einreichung bei Bank) | Value Date Auftraggeber | Value Date Empfänger | Besondere Fristen & Vorlaufzeiten |
| --- | --- | --- | --- |
| → [Details unten: Bankabh_ngig_USD-Zahlungen_typisch_Cut-off_12_00_14_00_CET_f] | D+0 (Kontobelastung bei Einreichung vor Cut-off) | D+1 bis D+3 (je nach Korrespondenz- bankenkette und Zielland/-währung)  USD: D+1 (Same-Day bei früher Einreichung) GBP: D+1 JPY: D+1 bis D+2 Exotische Währungen: D+2 bis D+5 | → [Details unten: Bankabh_ngig_USD-Zahlungen_typisch_Cut-off_12_00_14_00_CET_f] |

### KOSTEN & LIMITS

| Typische Kosten (Richtwerte) | Betragslimits |
| --- | --- |
| → [Details unten: EUR_5_50_Transaktion_bankabh_ngig_71A_OUR_Auftraggeber_tr_gt] | Technisch: kein Limit  Praktisch: je nach Korrespondenz- bankvereinbarung  USD > USD 1 Mio: ggf. zusätzliche Compliance-Prüfung |

### CORPORATE RELEVANZ & PRAXIS

| Corporate Relevanz & SAP-Praxis (Experte) | Corporate Relevanz & SAP-Praxis (Einsteiger) |
| --- | --- |
| → [Details unten: 1_DMEE_MIGRATION_MT103-DMEE_pacs_008-DMEE_bis_Nov_2025_zwing] | → [Details unten: 1_DMEE_MIGRATION_MT103-DMEE_pacs_008-DMEE_bis_Nov_2025_zwing] |

### RISIKEN & FALLSTRICKE

| Risiken & Fallstricke (Experte) | Risiken & Fallstricke (Einsteiger) |
| --- | --- |
| → [Details unten: 1_MT-SUNSET_NICHT_GEPLANT_Nach_Nov_2025_keine_MT103-Verarbei] | → [Details unten: 1_MT-SUNSET_NICHT_GEPLANT_Nach_Nov_2025_keine_MT103-Verarbei] |

### LÄNDERVERFÜGBARKEIT

| Länderverfügbarkeit & regionale Besonderheiten | Länder mit Einschränkungen & lokale Varianten |
| --- | --- |
| → [Details unten: GLOBAL_VERF_GBAR_200_L_NDER_Alle_SWIFT-Mitgliedsl_nder_WICHT] | → [Details unten: GLOBAL_VERF_GBAR_200_L_NDER_Alle_SWIFT-Mitgliedsl_nder_WICHT] |

### SWIFT-basierte_grenz_berschreitende_Zahlung_im_Korrespondenz

SWIFT-basierte grenzüberschreitende Zahlung im Korrespondenzbankenprinzip. Zahlung wird von Bank zu Bank weitergeleitet (Correspondent Banking Chain): Auftraggeber-Bank → 0–3 Korrespondenzbanken → Empfänger-Bank. Jede Bank in der Kette zieht Gebühren ab (je nach :71A: OUR/SHA/BEN).  SWIFT gpi (seit 2017): • UETR: Unique End-to-End Transaction Reference – ermöglicht Tracking der gesamten Zahlungskette • SLA: 50% innerhalb 30 Min; 75% innerhalb 6h • Transparenz: Alle Abzüge sichtbar  MT-Sunset November 2025: MT103 → pacs.008.001.09+ (MX). Migration zwingend. SWIFT-Translator als Übergangshilfe.

### SWIFT-basierte_grenz_berschreitende_Zahlung_im_Korrespondenz

SWIFT ist der internationale Postweg für Zahlungen außerhalb Europas. Wenn Sie in US-Dollar, japanischen Yen oder britischen Pfund zahlen, läuft das über SWIFT.  So funktioniert es: 1) Ihre Bank schickt eine Zahlungsnachricht über das SWIFT-Netzwerk 2) Die Nachricht geht durch 1–3 Zwischenbanken (Korrespondenzbanken) 3) Jede Zwischenbank kann Gebühren abziehen 4) Am Ende kommt das Geld bei der Empfänger-Bank an  Dauert typisch 1–3 Bankarbeitstage. WICHTIG: Ab November 2025 muss auf ein neues Format (ISO 20022) umgestellt werden.

### Bankabh_ngig_USD-Zahlungen_typisch_Cut-off_12_00_14_00_CET_f

Bankabhängig:  USD-Zahlungen (typisch): Cut-off: 12:00–14:00 CET für Same-Day-USD  EUR außerhalb SEPA: (z.B. CH, UK): Cut-off: 14:00–15:00 CET  GBP nach UK: CHAPS Cut-off: 17:00 GMT → Bankinterner Cut-off ca. 14:00–15:00 CET  JPY: Cut-off: 07:00–09:00 CET (wegen JST +8h)

### Bankabh_ngig_USD-Zahlungen_typisch_Cut-off_12_00_14_00_CET_f

Recall: Möglich via MT199/ camt.056 (gpi Recall) → Empfänger-Bank muss zustimmen → Keine Garantie  OFAC Screening: USD-Zahlungen immer durch US-Korrespondenzbank  SWIFT gpi SLA: 50%: < 30 Min 75%: < 6h 100%: < 24h  MT-Sunset: November 2025 → Umstieg auf pacs.008 JETZT planen!

### EUR_5_50_Transaktion_bankabh_ngig_71A_OUR_Auftraggeber_tr_gt

EUR 5–50/Transaktion (bankabhängig)  :71A: OUR: Auftraggeber trägt ALLE Gebühren :71A: SHA: geteilt :71A: BEN: Empfänger trägt alle  Korrespondenzbank- abzüge: USD 10–35 je Zwischenbank  SWIFT gpi: Transparenz über alle Abzüge

### 1_DMEE_MIGRATION_MT103-DMEE_pacs_008-DMEE_bis_Nov_2025_zwing

1) DMEE MIGRATION: MT103-DMEE → pacs.008-DMEE bis Nov. 2025 zwingend. SAP ECC: Custom-DMEE oder Add-On nötig (pain.001.001.09 als Basis). S/4HANA: Standard-DMEE für MX vorhanden. 2) STRUKTURIERTE ADRESSE: pacs.008.001.09+ erfordert strukturierte Absender/Empfänger-Adressen (StrtNm, PstCd, TwnNm, Ctry). SAP-Kreditorenstamm muss auf strukturierte Felder umgestellt werden. 3) GEBÜHRENREGEL :71A: In SAP FBZP konfigurierbar je Zahlungsweg. SHA als Standard (Kosten geteilt) vs. OUR (Corporate trägt alle Kosten). OUR für sensible Zahlungen wo Empfänger vollen Betrag erhalten muss. 4) SWIFT CSP: Wenn SWIFT direkt (nicht via Bank) genutzt wird: jährliche Selbst-Attestierung gegen CSCF-Framework. SAP-BCM-Server in CSP-Scope. 5) UETR-TRACKING: SWIFT gpi UETR in camt.053/054 erscheint als AcctSvcrRef → ermöglicht Tracking in BAM. Bankabhängig ob UETR weitergeleitet wird.

### 1_DMEE_MIGRATION_MT103-DMEE_pacs_008-DMEE_bis_Nov_2025_zwing

1) NOVEMBER 2025 IST BALD: Das alte SWIFT-Format wird abgeschaltet. Fragen Sie Ihre IT jetzt: Nutzen wir noch MT103 für internationale Zahlungen? Falls ja – das ist dringend zu ändern. 2) ADRESSEN VOLLSTÄNDIG: Internationale Zahlungen brauchen vollständige strukturierte Absenderadresse. Fehlt die, stoppt die amerikanische oder britische Bank die Zahlung. 3) GEBÜHREN VERSTEHEN: Je nachdem welche Gebührenregel gesetzt ist, kann der Empfänger weniger Geld bekommen als Sie überwiesen haben (Korrespondenzbanken ziehen Gebühren ab). Bei sensiblen Zahlungen: OUR wählen (Sie zahlen alle Gebühren, Empfänger bekommt vollen Betrag). 4) VERFOLGUNG MÖGLICH: Mit SWIFT gpi können Sie nachverfolgen wo Ihre internationale Zahlung gerade ist – fragen Sie Ihre Bank ob sie SWIFT gpi unterstützt.

### 1_MT-SUNSET_NICHT_GEPLANT_Nach_Nov_2025_keine_MT103-Verarbei

1) MT-SUNSET NICHT GEPLANT: Nach Nov. 2025 keine MT103-Verarbeitung mehr über SWIFT → kompletter Ausfall internationaler Zahlungen wenn nicht migriert. 2) ADRESS-TRUNCATION: MT103 :50K/:59: max. 4×35 Zeichen. Lange Firmennamen/Adressen werden abgeschnitten → OFAC-Name-Matching-Fehler bei US-Korrespondenzbank → HOLD. 3) :71A: BEN GESETZT: Empfänger erhält weniger als erwartet (Gebühren abgezogen) → Lieferant fordert Differenz nach → Doppelzahlung. 4) ZEICHENSATZ: MT103 kein UTF-8 → Umlaute (ä,ö,ü) werden zu ? oder ae/oe/ue → OFAC-Matching-Probleme. 5) OFAC FALSE POSITIVE: Ähnlichkeit des Firmennamens mit sanktionierter Entität → automatischer HOLD durch US-Korrespondenzbank → manuelles Freigabeverfahren, Dauer: Tage bis Wochen.

### 1_MT-SUNSET_NICHT_GEPLANT_Nach_Nov_2025_keine_MT103-Verarbei

1) NOVEMBER 2025 VERGESSEN: Das passiert oft. Niemand plant die Migration rechtzeitig. Ab November 2025 gehen keine internationalen SWIFT-Zahlungen mehr raus wenn das alte Format noch aktiv ist.  2) ADRESSE ABGESCHNITTEN: Das alte Format erlaubt nur kurze Adresszeilen. Langer Firmenname wird abgeschnitten. Amerikanische Sicherheitsprüfung schlägt an – Zahlung wird tagelang festgehalten.  3) EMPFÄNGER BEKOMMT ZU WENIG: Wenn die Gebührenregel falsch gesetzt ist, zieht jede Zwischenbank Gebühren vom Betrag ab. Der Lieferant bekommt EUR 950 statt EUR 1.000 und stellt eine Nachforderung.  4) NAMENS-ÄHNLICHKEIT MIT SANKTIONSLISTE: Ein Firmenname ähnelt zufällig einem sanktionierten Unternehmen. Die amerikanische Zwischenbank friert die Zahlung ein. Klärung dauert Wochen.

### GLOBAL_VERF_GBAR_200_L_NDER_Alle_SWIFT-Mitgliedsl_nder_WICHT

GLOBAL VERFÜGBAR (200+ LÄNDER): Alle SWIFT-Mitgliedsländer  WICHTIGSTE KORRIDORE: • EUR ↔ USD: Täglich hohe Volumina; gut etabliert • EUR ↔ GBP: Gut; CHAPS als Empfangssystem UK • EUR ↔ JPY: Gut; Zengin als Empfangssystem Japan • EUR ↔ CHF: Gut; SIC als Empfangssystem CH • EUR ↔ CNY: Eingeschränkt – Devisenkontrolle China • EUR ↔ INR: Eingeschränkt – RBI-Regulierung Indien • EUR ↔ BRL: Eingeschränkt – Banco Central do Brasil • EUR ↔ RUB: DE FACTO BLOCKIERT (Sanktionen seit 2022)  FREIE WÄHRUNGEN (kein Problem): USD, EUR, GBP, JPY, CHF, CAD, AUD, NZD, SGD, HKD, NOK, SEK, DKK

### GLOBAL_VERF_GBAR_200_L_NDER_Alle_SWIFT-Mitgliedsl_nder_WICHT

LÄNDER MIT ZAHLUNGSVERKEHRS-EINSCHRÄNKUNGEN: CHINA (CNY): • CNY nicht frei konvertierbar • Alle grenzüberschreitenden CNY-Zahlungen: SAFE-Genehmigung • CIPS (Cross-Border Interbank Payment System): China-Alternative zu SWIFT • Zahlungen > USD 50.000: erhöhte Dokumentationspflicht  INDIEN (INR): • INR nicht frei konvertierbar • Alle Auslandszahlungen: RBI-konformes Reporting (FEMA) • Korrespondenzbank in Indien nötig • Zahlungen erfordern Purpose Code  BRASILIEN (BRL): • BRL kontrolliert • Alle Devisenzahlungen: Banco Central Meldung • IOF-Steuer auf Devisenzahlungen • PIX nur für Inlandszahlungen  RUSSLAND/BELARUS (SANKTIONEN): • SWIFT-Disconnect für große RU-Banken seit Feb. 2022 • De facto kein normaler Zahlungsverkehr möglich  IRAN/NORDKOREA/MYANMAR: • FATF Schwarzliste • Zahlungen verboten (UN/EU/US-Sanktionen)

## SEPA – Credit Transfer (Überweisung)

### IDENTIFIKATION & GRUNDDATEN

| Zahlungsart | Kürzel / Code | Instrument-Typ | Geltungsbereich & Währung | Clearing-System | Nachrichtenformat |
| --- | --- | --- | --- | --- | --- |
| Urgent Payment / Same-Day Value | URGP / SDVA | Push Payment (dringend) Over TARGET2 | SEPA-Raum / Eurozone Währung: EUR | TARGET2 (T2) RTGS der EZB | pain.001.001.03+ (SvcLvl: URGP oder SDVA) pacs.008 |

### BESCHREIBUNG

| Beschreibung (Experte) | Beschreibung (Einsteiger) |
| --- | --- |
| → [Details unten: Dringende_SEPA-Zahlung_ber_TARGET2_RTGS_statt_STEP2_DNS_Init] | → [Details unten: Dringende_SEPA-Zahlung_ber_TARGET2_RTGS_statt_STEP2_DNS_Init] |

### TIMING – CUT-OFFS & VALUE DATES

| Cut-off-Zeiten (Einreichung bei Bank) | Value Date Auftraggeber | Value Date Empfänger | Besondere Fristen & Vorlaufzeiten |
| --- | --- | --- | --- |
| → [Details unten: Bankinterne_Cut-offs_ca_14_00_15_00_CET_f_r_same-day_T2_T2_o] | D+0 (Same-Day-Belastung) | D+0 (Same-Day-Wertstellung beim Empfänger)  Intraday-Settlement | → [Details unten: Bankinterne_Cut-offs_ca_14_00_15_00_CET_f_r_same-day_T2_T2_o] |

### KOSTEN & LIMITS

| Typische Kosten (Richtwerte) | Betragslimits |
| --- | --- |
| EUR 5–25/Transaktion (bankabhängig)  Deutlich teurer als SCT Standard  Ab Okt. 2025: SCT Inst zu Preisparität = günstigere Alternative | Gleich wie SCT kein technisches Limit  Für sehr große Beträge (> EUR 1 Mio): geeignet (SCT Inst Limit: 100k)  URGP hat kein Limit → Alternative zu Instant für große Beträge |

### CORPORATE RELEVANZ & PRAXIS

| Corporate Relevanz & SAP-Praxis (Experte) | Corporate Relevanz & SAP-Praxis (Einsteiger) |
| --- | --- |
| → [Details unten: 1_SAP_KONFIGURATION_SvcLvl_URGP_in_pain_001_PmtTpInf_separat] | → [Details unten: 1_SAP_KONFIGURATION_SvcLvl_URGP_in_pain_001_PmtTpInf_separat] |

### RISIKEN & FALLSTRICKE

| Risiken & Fallstricke (Experte) | Risiken & Fallstricke (Einsteiger) |
| --- | --- |
| → [Details unten: 1_NACH_14_00_CET_ZU_SP_T_Bankinterne_Verarbeitungszeit_f_r_T] | → [Details unten: 1_NACH_14_00_CET_ZU_SP_T_Bankinterne_Verarbeitungszeit_f_r_T] |

### LÄNDERVERFÜGBARKEIT

| Länderverfügbarkeit & regionale Besonderheiten | Länder mit Einschränkungen & lokale Varianten |
| --- | --- |
| → [Details unten: VERF_GBAR_IN_EUROZONE_ber_TARGET2_DE_AT_BE_CY_EE_ES_FI_FR_GR] | → [Details unten: VERF_GBAR_IN_EUROZONE_ber_TARGET2_DE_AT_BE_CY_EE_ES_FI_FR_GR] |

### Dringende_SEPA-Zahlung_ber_TARGET2_RTGS_statt_STEP2_DNS_Init

Dringende SEPA-Zahlung über TARGET2 (RTGS) statt STEP2 (DNS). Initiiert durch SvcLvl-Code 'URGP' (Urgent Payment) oder 'SDVA' (Same Day Value Assignment) in pain.001. Bank routet über T2 → sofortiges RTGS-Settlement auf Zentralbankgeld-Basis.  Unterschied URGP vs. SDVA: • URGP: Dringlich, Bank entscheidet ob T2 oder STEP2 • SDVA: Gleicher Wertstellungstag garantiert  Cut-off: 17:00 CET (Kundenzahlungen über T2); bankintern oft 14:00–15:00 CET. Kosten: EUR 5–25 je Transaktion (bankabhängig). Nur für echten Bedarf einsetzen.

### Dringende_SEPA-Zahlung_ber_TARGET2_RTGS_statt_STEP2_DNS_Init

URGP ist die Eilüberweisung innerhalb von Europa. Wenn eine normale SEPA-Überweisung erst morgen ankommt, Sie das Geld aber HEUTE brauchen, können Sie URGP nutzen.  Was passiert: • Ihre Bank leitet die Zahlung direkt über das schnelle T2-System der EZB • Der Empfänger bekommt noch heute einen Wertstellungstag  Kosten: EUR 5–25 extra (je nach Bank)  Hinweis: Seit SCT Inst günstiger und schneller ist (ab Okt. 2025 Preisparität), ist URGP für die meisten Zwecke nicht mehr nötig.

### Bankinterne_Cut-offs_ca_14_00_15_00_CET_f_r_same-day_T2_T2_o

Bankinterne Cut-offs: ca. 14:00–15:00 CET (für same-day T2)  T2 offizieller Cut-off: Kundenzahlungen: 17:00 CET  Feiertage: T2-Kalender (6 Feiertage/Jahr)  Empfehlung: Ab Okt. 2025 SCT Inst statt URGP nutzen (günstiger + schneller)

### Bankinterne_Cut-offs_ca_14_00_15_00_CET_f_r_same-day_T2_T2_o

Kein Recall nach Settlement  Bankinterne Deadline: ca. 14:00–15:00 CET für same-day Ausführung  T2-Feiertage: 6 Tage/Jahr gesperrt  Hinweis: SCT Inst ist ab Okt. 2025 günstiger und 24/7 → URGP-Bedarf sinkt stark

### 1_SAP_KONFIGURATION_SvcLvl_URGP_in_pain_001_PmtTpInf_separat

1) SAP KONFIGURATION: SvcLvl 'URGP' in pain.001 PmtTpInf → separater Zahlungsweg 'Eilüberweisung' in FBZP. Zusatzgebühr als separate Buchung oder in Zahlungsweg-Konfiguration berücksichtigen. 2) ABLÖSUNG DURCH INSTANT: Mit SCT Inst Preisparität (Okt. 2025) wird URGP für EUR ≤ 100k obsolet. Nur noch relevant für: Beträge > 100k (Instant-Limit), Empfänger nicht Instant-fähig. 3) T2-KALENDER: URGP-Zahlungen unterliegen T2-Feiertagskalender (6 Tage). SAP SCAL-Konfiguration. 4) KOMBINATION MIT INSTANT: Prozess: Versuche Instant → wenn Betrag > 100k oder Empfänger nicht Instant-fähig → automatisch URGP über T2.

### 1_SAP_KONFIGURATION_SvcLvl_URGP_in_pain_001_PmtTpInf_separat

1) BALD KAUM NOCH NÖTIG: Ab Oktober 2025 bieten alle Banken Sofortüberweisungen (Instant) zum gleichen Preis an. Für Beträge bis EUR 100.000 ist Instant dann schneller und günstiger als URGP. 2) FÜR GROSSE BETRÄGE: URGP bleibt relevant für Zahlungen über EUR 100.000, die sofort ankommen müssen (da Instant auf 100k begrenzt ist). 3) IN SAP: URGP braucht eine separate Konfiguration ('Eilüberweisung') mit eigenen Gebühren.

### 1_NACH_14_00_CET_ZU_SP_T_Bankinterne_Verarbeitungszeit_f_r_T

1) NACH 14:00 CET ZU SPÄT: Bankinterne Verarbeitungszeit für T2-Routing. URGP nach 14:00 CET eingereicht → keine Garantie für Same-Day-Settlement. 2) UNNÖTIGE KOSTEN: URGP für Zahlungen die kein same-day brauchen → EUR 5–25 verschwendet. Prozess-Review: Wann wirklich URGP notwendig? 3) T2-FEIERTAG: URGP an T2-Feiertag nicht möglich – auch wenn Empfänger-Land keinen Feiertag hat.

### 1_NACH_14_00_CET_ZU_SP_T_Bankinterne_Verarbeitungszeit_f_r_T

1) ZU SPÄT EINGEREICHT: Wenn URGP nach 14 Uhr eingereicht wird, kommt es möglicherweise erst morgen an – trotz Eilgebühr.  2) UNNÖTIGE GEBÜHREN: Wenn URGP für Zahlungen genutzt wird, die keine Eile haben, zahlen Sie EUR 5–25 extra ohne Nutzen. Prozess überprüfen.  3) AB OKTOBER 2025 ÜBERHOLT: Für Beträge bis EUR 100.000 ist Instant günstiger und schneller. URGP-Prozesse sollten dann umgestellt werden.

### VERF_GBAR_IN_EUROZONE_ber_TARGET2_DE_AT_BE_CY_EE_ES_FI_FR_GR

VERFÜGBAR IN EUROZONE (über TARGET2): DE, AT, BE, CY, EE, ES, FI, FR, GR, IE, IT, LT, LU, LV, MT, NL, PT, SI, SK + HR  OPTIONAL: Non-Euro EU-Länder mit T2-Anbindung: BG, CZ, DK, HU, PL, RO, SE (haben freiwillig T2-Zugang)  NON-EU: • Nicht verfügbar außerhalb T2-Teilnehmerländer  BESONDERHEITEN JE LAND: • Alle T2-Länder: URGP technisch verfügbar • Bankabhängig ob URGP-Routing aktiv angeboten • Preis variiert: EUR 5–25 je nach Land/Bank  ENTWICKLUNG: • Ab Okt. 2025: SCT Inst zu Preisparität • URGP-Relevanz sinkt stark für EUR ≤ 100k • URGP bleibt für Großbeträge > 100k relevant

### VERF_GBAR_IN_EUROZONE_ber_TARGET2_DE_AT_BE_CY_EE_ES_FI_FR_GR

EINSCHRÄNKUNGEN: • Nur EUR über T2 (kein GBP, CHF, USD über URGP) • Non-SEPA-Länder: Kein URGP-Äquivalent   → USD dringend: Fedwire (USA)   → GBP dringend: CHAPS (UK)   → CHF dringend: SIC (CH)   → JPY dringend: BOJ-NET (Japan)  NATIONALE BESONDERHEITEN: • IT: Einige kleinere Banken bieten URGP nicht an • Neue EU-Länder (BG, HR): URGP weniger etabliert  ABLÖSUNG DURCH INSTANT: • Ab Oktober 2025: SCT Inst günstiger + 24/7 • Für EUR bis 100k: URGP praktisch obsolet • Überprüfen Sie Ihre internen URGP-Prozesse

## Inlandszahlungssysteme (non-SEPA)

### IDENTIFIKATION & GRUNDDATEN

| Zahlungsart | Kürzel / Code | Instrument-Typ | Geltungsbereich & Währung | Clearing-System | Nachrichtenformat |
| --- | --- | --- | --- | --- | --- |
| US ACH Credit / Debit | ACH (US) | Push (Credit) oder Pull (Debit) Massenverrechnung | USA (USD) Nacha-Mitglieder | FedACH (Federal Reserve) + EPN (The Clearing House) | NACHA-Format (proprietär: CCD/CTX/PPD) KEIN ISO 20022 |

### BESCHREIBUNG

| Beschreibung (Experte) | Beschreibung (Einsteiger) |
| --- | --- |
| → [Details unten: US-amerikanisches_Massenzahlungssystem_f_r_USD_DNS-Verrechnu] | → [Details unten: US-amerikanisches_Massenzahlungssystem_f_r_USD_DNS-Verrechnu] |

### TIMING – CUT-OFFS & VALUE DATES

| Cut-off-Zeiten (Einreichung bei Bank) | Value Date Auftraggeber | Value Date Empfänger | Besondere Fristen & Vorlaufzeiten |
| --- | --- | --- | --- |
| → [Details unten: Same-Day_ACH_Zyklus_1_10_30_ET_16_30_CET_Sommer_17_30_CET_Wi] | D+0 (Same-Day) oder D+1 (Next-Day) je nach Zyklus | D+0 (Same-Day) oder D+1 (Next-Day)  ACH Debit Return: bis D+2 ACH Credit Return: bis D+5 | → [Details unten: Same-Day_ACH_Zyklus_1_10_30_ET_16_30_CET_Sommer_17_30_CET_Wi] |

### KOSTEN & LIMITS

| Typische Kosten (Richtwerte) | Betragslimits |
| --- | --- |
| USD 0,05–0,50 pro Transaktion  Deutlich günstiger als SWIFT für US-Massenzahlungen  Same-Day ACH: Aufschlag ca. USD 0,05 je nach Nacha-Regeln | Aktuell: USD 1.000.000 pro Same-Day-ACH Transaktion  Next-Day: kein Limit technisch |

### CORPORATE RELEVANZ & PRAXIS

| Corporate Relevanz & SAP-Praxis (Experte) | Corporate Relevanz & SAP-Praxis (Einsteiger) |
| --- | --- |
| → [Details unten: 1_NACHA-FORMAT_IN_SAP_SAP-Standard_hat_kein_NACHA-DMEE_Optio] | → [Details unten: 1_NACHA-FORMAT_IN_SAP_SAP-Standard_hat_kein_NACHA-DMEE_Optio] |

### RISIKEN & FALLSTRICKE

| Risiken & Fallstricke (Experte) | Risiken & Fallstricke (Einsteiger) |
| --- | --- |
| → [Details unten: 1_ROUTING_NUMBER_FEHLER_Falsche_ABA_Routing_Number_R03_Retur] | → [Details unten: 1_ROUTING_NUMBER_FEHLER_Falsche_ABA_Routing_Number_R03_Retur] |

### LÄNDERVERFÜGBARKEIT

| Länderverfügbarkeit & regionale Besonderheiten | Länder mit Einschränkungen & lokale Varianten |
| --- | --- |
| → [Details unten: VERF_GBAR_USA_USD_alle_50_Bundesstaaten_US-Territorien_Puert] | → [Details unten: VERF_GBAR_USA_USD_alle_50_Bundesstaaten_US-Territorien_Puert] |

### US-amerikanisches_Massenzahlungssystem_f_r_USD_DNS-Verrechnu

US-amerikanisches Massenzahlungssystem für USD. DNS-Verrechnung mit Same-Day-ACH (seit 2021) und Standard-Next-Day. NACHA-Format (kein ISO 20022). Zwei parallele Netzwerke: FedACH (Federal Reserve) und EPN (privat). Corporate-Zahlungstypen: CCD (Corporate Credit/Debit, einfach), CTX (mit 9.000 Zeichen Remittance, ANSI X12 820), PPD (Gehalte).  Wichtig für EU-Corporates: • Kein IBAN: Routing Number (9-stellig, ABA) + Account Number • ACH Debit: Analog SDD Core – Autorisierung ('Authorization Agreement') nötig • Return Codes R01–R99: Standardisiert • Kein direkter EU-Zugang: US-Konto oder EU-Bank mit ACH-Service nötig

### US-amerikanisches_Massenzahlungssystem_f_r_USD_DNS-Verrechnu

ACH ist das amerikanische SEPA – günstig, weit verbreitet, für alle USD-Massenzahlungen in den USA.  Was Sie wissen müssen: • Kein IBAN-System: US-Konten haben Routing Number (9-stellig) + Kontonummer • Format ist anders als in Europa – SAP braucht extra Konfiguration • Same-Day möglich, aber der Cut-off liegt nachmittags US-Zeit = abends in Deutschland • Für Lastschriften in den USA: Vergleichbar mit SEPA-Lastschrift – Kunde muss zustimmen

### Same-Day_ACH_Zyklus_1_10_30_ET_16_30_CET_Sommer_17_30_CET_Wi

Same-Day ACH: Zyklus 1: 10:30 ET = 16:30 CET (Sommer) = 17:30 CET (Winter)  Zyklus 2: 14:45 ET = 20:45 CET (Sommer) = 21:45 CET (Winter)  Next-Day Standard: 18:45 ET  Praktisch für EU: D+1 oder D+2 einplanen (wegen Zeitversatz + Korrespondenzbank-Vorlauf)

### Same-Day_ACH_Zyklus_1_10_30_ET_16_30_CET_Sommer_17_30_CET_Wi

Return-Frist: • R-Code D+2 (Debit) • R-Code D+5 (Credit)  Authorization Agreement: Vor ACH Debit erforderlich (analog SDD-Mandat)  Pre-Notification: Empfohlen vor erstem ACH Debit (Probe-Transaktion USD 0)  US Federal Holidays: 10 Feiertage/Jahr → Kein ACH-Settlement

### 1_NACHA-FORMAT_IN_SAP_SAP-Standard_hat_kein_NACHA-DMEE_Optio

1) NACHA-FORMAT IN SAP: SAP-Standard hat kein NACHA-DMEE. Optionen: (a) Custom DMEE entwickeln, (b) Add-On (Serrala, Bottomline, Kyriba), (c) EU-Bank mit ACH-Konvertierung. Nacha-Pflichtfelder: Company ID (10-stellig), SEC Code (CCD/CTX/PPD), Routing Number (ABA), Account Number. 2) CTX FÜR REMITTANCE: CTX-Format unterstützt ANSI X12 820-Addenda mit strukturierten Rechnungsreferenzen. Ideal für B2B-Zahlungen mit Rechnungszuordnung. 3) RETURN CODE MAPPING: ACH Returns (R01–R99) müssen in SAP BCM/BAM gemappt werden. Häufigste: R01 (Insufficient Funds), R02 (Account Closed), R03 (No Account/Unable to Locate Account), R09 (Uncollected Funds). 4) US-KONTO EMPFOHLEN: Eigenes USD-Konto bei Citibank, JP Morgan, Wells Fargo → direkter ACH-Zugang, keine Korrespondenzbank-Kosten, direktes FedACH-Settlement.

### 1_NACHA-FORMAT_IN_SAP_SAP-Standard_hat_kein_NACHA-DMEE_Optio

1) GÜNSTIG FÜR VIELE USD-ZAHLUNGEN: ACH kostet nur wenige Cent pro Transaktion – viel günstiger als SWIFT. Wenn Sie viele US-Zahlungen machen, ist ACH die richtige Wahl. 2) US-KONTONUMMERN ANDERS: Keine IBAN – stattdessen eine 9-stellige Routing Number und eine Kontonummer. In SAP anders hinterlegen als europäische Bankverbindungen. 3) EXTRA SAP-KONFIGURATION NÖTIG: ACH-Format ist nicht Standard in SAP. Ihre IT muss das extra einrichten oder ein Add-On kaufen. 4) ZEITVERSCHIEBUNG EINPLANEN: Same-Day ACH hat den Cut-off nachmittags US-Zeit – das ist abends in Deutschland. Realistischer sind D+1 oder D+2 für EU-initiierte Zahlungen.

### 1_ROUTING_NUMBER_FEHLER_Falsche_ABA_Routing_Number_R03_Retur

1) ROUTING NUMBER FEHLER: Falsche ABA Routing Number → R03 Return → Zahlung nicht ausgeführt. Im Gegensatz zu IBAN kein standardisiertes Prüfziffernverfahren → Fehler schwerer automatisch erkennbar. 2) RETURN CODE NICHT GEMAPPT: Unbekannte R-Codes landen in generischer Ausnahme → manuelle Klärung ohne Kontext. 3) AUTORIZATION FEHLT: ACH Debit ohne vorherige Authorization Agreement → R10 Return (Customer Advises Originator Not Known/No Authorization). 4) NACHA-KONFIGURATION AUFWÄNDIG: Custom DMEE-Entwicklung für NACHA komplex → Fehler in Dateistruktur (Header/Batch/Entry/Trailer) → gesamte Datei rejected.

### 1_ROUTING_NUMBER_FEHLER_Falsche_ABA_Routing_Number_R03_Retur

1) FALSCHE ROUTING NUMBER: US-Konten haben keine IBAN-Prüfziffer. Eine falsch eingetippte Routing Number führt zu einer Ablehnung – aber manchmal erst nach Tagen wenn die Rückmeldung kommt.  2) KEIN GENEHMIGUNGSVERFAHREN: Wenn Sie in den USA per Lastschrift einziehen wollen ohne dass der Kunde zugestimmt hat, kommt die Lastschrift zurück und Ihr Ansehen beim Kunden leidet.  3) FORMAT-FEHLER GANZER DATEI: Ein kleiner Fehler in der NACHA-Dateistruktur führt dazu, dass die gesamte Datei mit allen Zahlungen abgewiesen wird – nicht nur die fehlerhafte Zahlung.

### VERF_GBAR_USA_USD_alle_50_Bundesstaaten_US-Territorien_Puert

VERFÜGBAR: USA (USD) – alle 50 Bundesstaaten + US-Territorien (Puerto Rico, Guam etc.)  NACHA-MITGLIEDER: Ca. 10.000 US-Finanzinstitute (praktisch alle US-Banken)  ZUGANG FÜR EU-CORPORATES: Option 1: US-Tochtergesellschaft • US-Bankkonto (Citibank, JP Morgan, Wells Fargo, Bank of America) • Direkter ACH-Zugang via FedACH oder EPN • SAP: NACHA-DMEE oder Add-On  Option 2: EU-Bank mit US-ACH-Service • Deutsche Bank, HSBC, Citi, BNP Paribas, Commerzbank • Bank übernimmt NACHA-Konvertierung • SAP: Standard SWIFT-Datei (Bank konvertiert)  PARALLEL-SYSTEME USA: • Fedwire: Großbetrag/dringend • RTP (Real-Time Payments, The Clearing House): Instant, B2B • FedNow (Federal Reserve): Instant, seit Juli 2023

### VERF_GBAR_USA_USD_alle_50_Bundesstaaten_US-Territorien_Puert

LÄNDER MIT ACH-ÄQUIVALENTEN: KANADA: • EFT (Electronic Funds Transfer) / AFT • PAD (Pre-Authorized Debit) – wie SDD • Betreiber: Payments Canada (Interac) • Format: SWIFT oder proprietär  AUSTRALIEN: • Direct Entry (BECS): Massenüberweisungen + Lastschriften • NPP (New Payments Platform): Instant • BSB-Nummer + Account Number (kein IBAN) • PayID: Alias-System für NPP  INDIEN: • NEFT (National Electronic Funds Transfer): Batch • RTGS: Großbetrag • UPI (Unified Payments Interface): Instant (Consumer) • IMPS: Instant Banking  MEXIKO: • SPEI (Sistema de Pagos Electrónicos Interbancarios) • Instant 24/7 • CLABE (18-stellige Kontonummer statt IBAN)  WICHTIG: Alle diese Länder haben eigene Formate (kein ISO 20022 oder NACHA) → Separate SAP-Konfiguration je Land nötig