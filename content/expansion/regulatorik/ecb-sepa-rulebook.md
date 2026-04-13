---
kuerzel: EPC-SEPA-2025
name: EPC SEPA Rulebook 2025 (SCT / SCT Inst / SDD)
typ: EPC-Regelwerk / Industriestandard
kategorie: SEPA / Zahlungsinfrastruktur
in_kraft_seit: "17.11.2024"
naechste_aenderung: "Konsultation Rulebook 2026 Q1 2025; Anwendung SCT-Inst-Pflicht (SEPA-Instant-VO) ab 09.01.2025 / 09.10.2025"
behoerde_link: https://www.europeanpaymentscouncil.eu/what-we-do/sepa-payment-schemes/sepa-credit-transfer
betroffene_abteilungen: Treasury, Cash Management, IT, Compliance, Banken-Relations
geltungsbereich: Alle SEPA-Mitgliedsstaaten (EU + EWR + weitere assoziierte Länder); gilt für Zahlungsdienstleister, die SEPA-Rulebook-Schemata anbieten; mittelbar für Corporate-Treasury-Abteilungen als Nutzer
status_version: SCT Rulebook v1.1 (2024 release, Anwendung 17.11.2024); SCT Inst Rulebook v1.2 (2024 release, Anwendung 17.11.2024); SDD Core Rulebook v4.0 (2024 release); SDD B2B Rulebook v4.0 (2024 release)
beschreibung_experte: |
  Das European Payments Council (EPC) veröffentlicht und pflegt die SEPA-Rulebooks als normative Grundlage für die vier SEPA-Zahlungsschemata: SEPA Credit Transfer (SCT), SEPA Instant Credit Transfer (SCT Inst), SEPA Direct Debit Core (SDD Core) und SEPA Direct Debit B2B (SDD B2B). Die Rulebooks definieren Datenformate (auf Basis ISO 20022 pain.001, pain.002, pain.008, pacs.002, pacs.003, pacs.004, pacs.008), Fristen, Rückgabecodes, Teilnehmerrechte und -pflichten sowie Interbank Settlement-Regeln. Die 2025-Rulebook-Generation (Release 2024, Anwendung November 2024) ist geprägt durch: 1) Vollständige Strukturanpassung an die SEPA-Instant-VO (VO (EU) 2024/886) — SCT-Inst-Pflicht für Zahlungsdienstleister und Erreichbarkeit; 2) Erweiterung der Zeichenmenge für Verwendungszweck und Adressfelder (lateinisch + ausgewählte nicht-lateinische Zeichen in bestimmten Feldern); 3) Überarbeitete Rückgabecodes und -fristen für SDD; 4) Vorbereitung auf IBAN-Name-Check-Anforderungen aus PSD3/PSR-Entwürfen; 5) Purpose-Code-Erweiterungen (ISO 20022 ExternalPurposeCode) für Salary, Tax, Government-Zahlungen.
beschreibung_einsteiger: |
  Das EPC-SEPA-Rulebook ist das offizielle Regelwerk für alle SEPA-Überweisungen, Echtzeitüberweisungen und Lastschriften in Europa. Es legt fest, wie eine Zahlung technisch aufgebaut sein muss, welche Felder befüllt werden müssen, und was passiert, wenn eine Zahlung zurückkommt oder abgelehnt wird. Die aktuellen Rulebooks gelten seit November 2024 und bringen Neuerungen bei Instant Payments, Zeichensätzen und Rückgabecodes.
auswirkungen_experte: |
  1) SCT Inst-Pflicht durch SEPA-Instant-VO: Ab 09.01.2025 müssen Zahlungsdienstleister, die SEPA CT anbieten, auch SCT Inst anbieten (für natürliche Personen); ab 09.10.2025 für alle Zahlungsdienstleister; bis 01.10.2025 müssen Corporate-Treasury-Kunden ebenfalls SCT-Inst-Empfang ermöglichen — SAP MBC / Bank-Connectivity-Konfiguration prüfen.
  2) Verwendungszweck-Zeichensatz (Rulebook Annex 1): Der erlaubte Zeichensatz wurde für Remittance-Information-Felder erweitert — Sonderzeichen aus nicht-lateinischen Sprachen in definierten Feldern möglich; technische Validierung in SAP anpassen.
  3) Überarbeitete SDD-Rückgabecodes: SDD Core Rulebook 2024 präzisiert R-Transaktions-Codes (RJCT, RETU, REVC, CNCD); besonders relevant: MS03 (Reason not specified), MD06 (Refund Request by End Customer) — Buchungslogik in SAP prüfen, ob neue Codes korrekt verarbeitet werden.
  4) IBAN-Name-Check-Vorbereitung: PSD3/PSR (noch in Trilog) sieht IBAN-Payee-Verification vor; EPC bereitet Rulebook-Anpassungen vor — Treasury-Systeme, die Zahlungsempfänger-Stammdaten pflegen, sollten API-Schnittstelle zu IBAN-Name-Check-Service vorbereiten.
  5) Purpose-Code-Nutzung: ISO 20022 ExternalPurposeCode (z. B. SALA für Gehalt, TAXS für Steuerzahlungen, SUPP für Lieferantenzahlungen) ermöglicht automatisierte Kategorisierung auf Empfängerseite — für inhouse Banking und POBO/COBO-Strukturen relevant.
auswirkungen_einsteiger: |
  Wenn dein Unternehmen SEPA-Überweisungen oder Lastschriften nutzt, solltest du sicherstellen, dass deine Bank und dein SAP-System die neuesten Rulebook-Versionen unterstützen. Besonders wichtig: Ab 2025 müssen auch Firmenkunden Instant Payments empfangen können. Außerdem können neue Rückgabe-Codes von Banken kommen, die das System kennen und richtig verarbeiten sollte.
pflichtmassnahmen_experte: |
  • SCT-Inst-Empfangsbereitschaft herstellen: Bank-Konnektivität (SWIFT MBC, EBICS) auf SCT-Inst-Empfang konfigurieren; interne Buchungslogik für Instant-Zahlungseingang anpassen (Valuta-Datum heute, nicht D+1); Liquiditätsmanagement für Echtzeit-Eingänge anpassen
  • SDD-Rückgabecode-Matrix aktualisieren: Liste aller verarbeiteten pain.002-Rückgabecodes mit den aktuellen EPC-Definitionen abgleichen; SAP-Customizing (Rückgabegrund-Codes in TA FBZP / Kreditoren-Buchungslogik) anpassen
  • Zeichensatz-Validierung prüfen: Wenn Zahlungsdaten aus nicht-lateinischen Systemen importiert werden (z. B. griechische Lieferanten, kyrillische Zeichen aus RU-Subsidiaries — obwohl SEPA kein RU mehr), Validierungs-Filter in SAP Payment Medium anpassen
  • Purpose-Code-Policy definieren: Welche Purpose-Codes werden in welchen Zahlungsläufen gesetzt? SALA, TAXS, SUPP, INTC (Konzernzahlung) — konsistente Belegung verbessert AML-Screening und Echtzeit-Monitoring beim Empfänger
  • Mandat-Management für SDD aktualisieren: SDD Rulebook 2024 präzisiert Mandat-Informationen in pain.008 — Mandatsdaten im SAP-Debitorenstamm auf Vollständigkeit prüfen (MandateID, SignatureDate, SequenceType)
  • Rulebook-Versionsmanagement: EPC veröffentlicht jährlich neue Rulebook-Versionen (typisch Anwendung im November); internes Prozess zur zeitgerechten Implementierung (mind. 6 Monate Vorlauf) etablieren
pflichtmassnahmen_einsteiger: |
  Konkret zu tun: 1) Frage deine Bank, ob sie die neuen Rulebook-Versionen (2024/2025) schon unterstützt — insbesondere für Instant Payments. 2) Stelle sicher, dass SAP die neuen Rückgabecodes kennt, wenn eine SEPA-Lastschrift zurückkommt. 3) Stelle sicher, dass das System Instant Payments empfangen kann — das ist ab Oktober 2025 Pflicht.
best_practice_experte: |
  • EPC-Regelwerk-Monitoring als Pflichtprozess: EPC veröffentlicht jährlich Change-Request-Konsultationen (Q1) und finale Rulebooks (Q3); Treasury-IT und Compliance sollten im EPC-Stakeholder-Newsletter eingetragen sein
  • Rulebook-Versioning in SAP-Landschaft dokumentieren: Welche pain.001-Version wird für welchen Zahlungsweg genutzt? pain.001.001.03 (SEPA 2019), pain.001.001.09 (ISO 20022 2019) — Versionsmismatch mit Bankpartner frühzeitig erkennen
  • SEPA-Inst-Liquiditätsmodell anpassen: SCT Inst erfordert Verfügbarkeit von Deckung rund um die Uhr (24/7/365); Intraday-Liquiditätspuffer bei TARGET2 / TIPS erhöhen oder zusätzliche Kreditlinie mit Hausbank vereinbaren
  • IBAN-Name-Check-API vorbereiten: EBA-Prüfschema (CoP — Confirmation of Payee) kommt mit PSD3/PSR; frühzeitig prüfen, welche Bankpartner APIs anbieten (z. B. über Open Banking via Berlin Group NextGenPSD2); Pilotierung im 2025er Zahlungszyklus
  • SDD-B2B statt SDD-Core für B2B-Lastschriften: SDD B2B bietet kein Widerrufsrecht für den Schuldner nach Einlösung — geringeres Rückbuchungsrisiko für Treasury; aber: B2B-Mandate müssen bei Schuldnerbank gesondert autorisiert werden
best_practice_einsteiger: |
  Abonniere die EPC-Newsletter, um immer über neue Regelwerk-Versionen informiert zu bleiben. Wenn deine Bank die neueste Version noch nicht unterstützt, frage aktiv nach — oft gibt es Übergangslösungen. Prüfe regelmäßig, ob deine SEPA-Lastschriftmandate noch gültig und vollständig sind.
risiken_experte: |
  • Versionsmismatch-Risiko: Wenn Treasury-System pain.001.001.03 sendet, Bankpartner aber nur pain.001.001.09 akzeptiert (oder umgekehrt), führt das zu Verarbeitungsfehlern oder Ablehnungen — besonders nach Rulebook-Generationswechsel
  • SCT-Inst-Pflicht-Verstoß: Zahlungsdienstleister, die ab 09.01.2025 / 09.10.2025 kein SCT Inst anbieten oder empfangen, verstoßen gegen SEPA-Instant-VO — Aufsichtssanktionen durch NCA (BaFin, OeNB) möglich
  • SDD-Rückbuchungs-Risiko bei falschem Purpose-Code: Wenn bei Verbraucherlastschriften ein falscher Sequence-Type (RCUR statt FRST für erste Lastschrift) gesetzt wird, kann die Lastschrift zurückgebucht werden — Liquiditätsplanung gestört
  • Mandat-Verfallsrisiko (SDD): SEPA-Lastschriftmandate verfallen nach 36 Monaten ohne Nutzung — veraltete Mandate führen zu MD07-Rückgaben (Debtor Deceased) oder AC04-Fehlern; automatisches Mandat-Monitoring empfohlen
  • Nicht-SEPA-IBAN-Risiko: Einige IBAN-Formate (z. B. türkische TR-IBANs oder GB-IBANs post-Brexit) werden von SEPA-Schemata nicht akzeptiert — Validierung vor Zahlungsabgabe erforderlich
risiken_einsteiger: |
  Wenn das Zahlungssystem eine veraltete Rulebook-Version nutzt, können Zahlungen abgelehnt werden. Das passiert z. B. wenn neue Felder oder neue Rückgabecodes nicht bekannt sind. Auch vergessene oder abgelaufene Lastschriftmandate führen zu Rückbuchungen, was den Cashflow stört und Verwaltungsaufwand erzeugt.
---

# EPC SEPA Rulebook 2025 — Vertiefung

## Übersicht: SEPA-Schemata und aktuelle Rulebook-Versionen (Stand April 2026)

| Schema | Abkürzung | Rulebook-Version | Anwendung seit | Kernformat | Verarbeitungszeit |
|---|---|---|---|---|---|
| SEPA Credit Transfer | SCT | v1.1 (2024) | 17.11.2024 | pain.001.001.03 / pacs.008.001.08 | D+1 (TARGET2-Öffnungszeiten) |
| SEPA Instant Credit Transfer | SCT Inst | v1.2 (2024) | 17.11.2024 | pain.001.001.09 / pacs.008.001.08 | < 10 Sekunden, 24/7/365 |
| SEPA Direct Debit Core | SDD Core | v4.0 (2024) | 17.11.2024 | pain.008.001.02 / pacs.003.001.08 | D-5 Pre-Notification, D-1 Einreichung |
| SEPA Direct Debit B2B | SDD B2B | v4.0 (2024) | 17.11.2024 | pain.008.001.02 / pacs.003.001.08 | D-1 Einreichung, kein Widerrufsrecht |

## Wesentliche Änderungen Rulebook 2024 vs. 2023

### SCT Rulebook

1) **Art. 4.2 (Erreichbarkeit)**: Präzisierung der PSP-Erreichbarkeitspflicht im Kontext SEPA-Instant-VO; Pflicht zur 24/7-Erreichbarkeit für SCT Inst ab 09.01.2025
2) **Annex 1 (Zeichensatz)**: Erweiterung um ergänzende lateinische Zeichen (diakritische Zeichen wie é, ñ, ä) in allen Text-Feldern; Sonderzeichen-Whitelist präzisiert
3) **PT-01 to PT-22 (Purpose-Code-Tabelle)**: Neue Purpose-Codes für Kryptowährungstransaktionen (CRYP) und digitale Token (TRAD) aufgenommen
4) **Rückgabefristen R-Transaktionen**: Fristverkürzung für einige Rückgabe-Szenarien — RJCT innerhalb von T+5 TARGET-Geschäftstagen

### SCT Inst Rulebook

1) **Betragslimit**: Erhöhung des Einzeltransaktion-Limits von 100.000 EUR auf 100.000 EUR bleibt — Diskussion über 1 Mio. EUR-Limit läuft bei EPC; einige Mitgliedsbanken bieten bereits höhere Limits bilateral
2) **Positive Confirmation (PT-42)**: Neue Bestätigungsnachricht vom Empfänger-PSP verbessert STP-Transparenz für Treasury-Monitoring
3) **Recall-Prozess (DS-04)**: Überarbeiteter Recall-Workflow für Instant Payments — Recall-Anfrage muss innerhalb von 10 Bankarbeitstagen nach Ausführung eingereicht werden; Antwort vom Empfänger-PSP innerhalb 5 TARGET-Geschäftstagen

### SDD Core / B2B Rulebook

1) **MD06 (Refund by End Customer)**: Fristpräzisierung — End-Kunde kann bis 8 Wochen nach Belastungsdatum ohne Angabe von Gründen Rückbuchung verlangen (SDD Core); kein entsprechendes Recht bei SDD B2B
2) **MS02 (Not Specified Reason by Agent)**: Nutzung eingeschränkt — Banken dürfen MS02 nicht als Auffang-Rückgabegrund nutzen, wenn spezifischer Code vorhanden
3) **Mandat-Änderungs-Prozess (AT-36)**: Überarbeitete Regeln, wann eine Mandat-Änderung (z. B. Gläubiger-IBAN-Wechsel) eine neue Mandatsreferenz erfordert

## SAP-Konfigurationshinweise

Für SAP S/4HANA Treasury / SAP Payment Medium Workbench:

• **TA FBZP** (Zahlungswege): Für SCT Inst eigenen Zahlungsweg anlegen (z. B. "TI" für SEPA-Instant-Transfer) — separater Zahlungsweg ermöglicht eigene Cutoff-Logik und Formatmapping
• **pain.001-Versionssteuerung**: Im SAP Payment Medium Workbench konfigurieren, welche pain.001-Version je Zahlungsweg/-bank genutzt wird — keine Mischung verschiedener Versionen für denselben Bankkanal
• **SDD Rückgabecode-Customizing**: Tabelle TBZID pflegen — alle EPC-definierten R-Codes mit Buchungsregel (Return, Refund, Reject) hinterlegen; nicht gemappte Codes führen zu manuellem Eingriff
• **Purpose-Code-Defaulting**: In Zahlungsweg-Konfiguration oder per BAdI einen Default-Purpose-Code setzen (z. B. SUPP für alle Lieferantenzahlungen, SALA für Lohnbuchungen)
