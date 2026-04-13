# Global Payments Datenbank — Format-Bibliothek (Zahlungs- & Kontonachrichten)

> Stand: April 2026  \|  Experten-Version (blau) + Einsteiger-Version (grün) nebeneinander  \|  Quellen: ISO, EPC, SWIFT, SAP

## ISO 20022 – pain (Zahlungsauftrag vom Kunden)

### IDENTIFIKATION & VERSIONEN

| Format-Name | Nachrichtentyp | Familie / Standard | Aktuelle Version | Versionshistorie (alle Versionen + Änderungen) |
| --- | --- | --- | --- | --- |
| pain.001 | Customer Credit Transfer Initiation | ISO 20022 – pain (Zahlungsauftrag vom Kunden) | pain.001.001.13 (2023) | → [Details unten: pain_001_Versionshistorie_alle_Versionen_nderungen_] |
| pain.002 | Customer Payment Status Report | ISO 20022 – pain (Zahlungsauftrag vom Kunden) | pain.002.001.14 (2023) | → [Details unten: pain_002_Versionshistorie_alle_Versionen_nderungen_] |
| pain.008 | Customer Direct Debit Initiation | ISO 20022 – pain (Zahlungsauftrag vom Kunden) | pain.008.001.11 (2023) | → [Details unten: pain_008_Versionshistorie_alle_Versionen_nderungen_] |

### BESCHREIBUNG

| Zweck & Verwendung (Experte) | Zweck & Verwendung (Einsteiger) |
| --- | --- |
| → [Details unten: Customer_Credit_Transfer_Initiation_Nachricht_vom_Kunden_Cor] | → [Details unten: Customer_Credit_Transfer_Initiation_Nachricht_vom_Kunden_Cor] |
| → [Details unten: Statusr_ckmeldung_der_Bank_an_den_Corporate_nach_Einreichung] | → [Details unten: Statusr_ckmeldung_der_Bank_an_den_Corporate_nach_Einreichung] |
| → [Details unten: Customer_Direct_Debit_Initiation_Initiiert_Lastschriften_Abb] | → [Details unten: Customer_Direct_Debit_Initiation_Initiiert_Lastschriften_Abb] |

### TECHNISCHE DETAILS

| Wichtige Felder (technisch) | Pflichtfelder | Datenrichtung |
| --- | --- | --- |
| → [Details unten: GrpHdr_MsgId_Eindeutige_Nachrichten-ID_max_35_Zeichen_GrpHdr] | → [Details unten: GrpHdr_MsgId_Eindeutige_Nachrichten-ID_max_35_Zeichen_GrpHdr] | Corporate → Bank (Ausgehende Zahlung) |
| → [Details unten: GrpHdr_MsgId_ID_dieser_Statusnachricht_GrpHdr_OrgnlMsgId_Ref] | Pflicht: • OrgnlMsgId • OrgnlEndToEndId • TxSts • Rsn/Cd (bei RJCT) | Bank → Corporate (Eingehende Statusmeldung) |
| → [Details unten: GrpHdr_MsgId_CreDtTm_NbOfTxs_CtrlSum_PmtInf_PmtMtd_DD_Direct] | Pflicht: • CdtrSchmeId (Gläubiger-ID) • MndtId • DtOfSgntr • SeqTp • ReqdColltnDt • Dbtr/Nm • DbtrAcct/IBAN | Corporate (Gläubiger) → Bank (Lastschrift-Einzug) |

### SAP-RELEVANZ

| SAP-Relevanz (Bereich) |
| --- |
| AP (Kreditorenbuchhaltung) Treasury / BCM DMEE (Formatbaum) F110 (Zahllauf) FPAYH (manuell) |
| BCM (Bank Communication Mgmt) BAM (Bank Account Management) Exception Handling AP Buchungslogik |
| AP/AR (Debitorenbuchhaltung) DMEE (SDD-Formatbaum) Mandat-Stammdaten (FI) F110 (Zahllauf DD) |

### PFLICHTFELDER & FEHLERQUELLEN

| Typische Fehlerquellen (Experte) | Typische Fehlerquellen (Einsteiger) |
| --- | --- |
| → [Details unten: 1_CtrlSum-Mismatch_Summe_der_Einzelbetr_ge_stimmt_nicht_mit_] | → [Details unten: 1_CtrlSum-Mismatch_Summe_der_Einzelbetr_ge_stimmt_nicht_mit_] |
| → [Details unten: 1_Reason_Code_nicht_im_BCM-Mapping_hinterlegt_unbekannte_Cod] | → [Details unten: 1_Reason_Code_nicht_im_BCM-Mapping_hinterlegt_unbekannte_Cod] |
| → [Details unten: 1_SeqTp_falsch_FRST_bei_erstem_Einzug_vergessen_oder_RCUR_na] | → [Details unten: 1_SeqTp_falsch_FRST_bei_erstem_Einzug_vergessen_oder_RCUR_na] |

### SAP-MAPPING

| SAP-Mapping (Experte) | SAP-Mapping (Einsteiger) |
| --- | --- |
| → [Details unten: DMEE-Formatbaum_SEPA_CT_Standard_EPC_03_SWIFT_MX_CT_09_Trans] | → [Details unten: DMEE-Formatbaum_SEPA_CT_Standard_EPC_03_SWIFT_MX_CT_09_Trans] |
| → [Details unten: BCM_Eingehende_pain_002_ber_EBICS_FileAct_BCM_Monitoring_Coc] | → [Details unten: BCM_Eingehende_pain_002_ber_EBICS_FileAct_BCM_Monitoring_Coc] |
| → [Details unten: DMEE_SEPA_DD_CORE_SEPA_DD_B2B_Mandatsstammdaten_SAP_FI_Debit] | → [Details unten: DMEE_SEPA_DD_CORE_SEPA_DD_B2B_Mandatsstammdaten_SAP_FI_Debit] |

### TYPISCHE FEHLER

| Häufige Projektfehler (Experte) | Häufige Projektfehler (Einsteiger) |
| --- | --- |
| → [Details unten: 1_DMEE-Versionskonflikt_SAP_ECC_nutzt_03-DMEE_Bank_verlangt_] | → [Details unten: 1_DMEE-Versionskonflikt_SAP_ECC_nutzt_03-DMEE_Bank_verlangt_] |
| → [Details unten: 1_PART-Handling_fehlt_Nur_RJCT_und_ACCP_implementiert_PART_n] | → [Details unten: 1_PART-Handling_fehlt_Nur_RJCT_und_ACCP_implementiert_PART_n] |
| → [Details unten: 1_SeqTp-Automatik_nicht_konfiguriert_SAP_setzt_immer_RCUR_FR] | → [Details unten: 1_SeqTp-Automatik_nicht_konfiguriert_SAP_setzt_immer_RCUR_FR] |

### STATUS / ABLÖSUNG

| Status / Ablösung |
| --- |
| Aktiv; .03 für SEPA weiterhin gültig .09+ Pflicht für SWIFT MX Nov. 2025: MT103 abgeschaltet → .09/.13 Pflicht |
| Aktiv; .03 für SEPA; .09+ für SWIFT MX Keine Abschaltung geplant |
| Aktiv; .03 für SEPA SDD Keine Abschaltung geplant |

### pain_001_Versionshistorie_alle_Versionen_nderungen_

VERSION 001.001.02 (2005) – Initiale ISO-Version • Grundstruktur: GrpHdr / PmtInf / CdtTrfTxInf • GrpHdr/MsgId, CreDtTm, NbOfTxs, CtrlSum • PmtInf/PmtMtd (TRF), ReqdExctnDt, Dbtr/Nm, DbtrAcct/Id/Othr (noch keine IBAN-Pflicht), DbtrAgt/FinInstnId/BIC • CdtTrfTxInf/InstrId, EndToEndId, Amt/InstdAmt, Cdtr/Nm, CdtrAcct/Id/Othr • RmtInf/Ustrd: Freitext, max. 140 Zeichen • Adresse: Freitext (AdrLine, max. 7 Zeilen × 70 Zeichen) – KEIN strukturiertes Format • Keine SvcLvl, keine PurpCd, keine LEI-Felder • SAP-Implikation: Nicht produktiv genutzt; zu wenig SEPA-spezifische Felder  VERSION 001.001.03 (2008) – EPC SEPA-Basis ← HEUTE NOCH STANDARD FÜR SEPA SCT NEU: + PmtInf/SvcLvl/Cd: „SEPA" – kennzeichnet SEPA-Zahlung (Pflicht für SEPA) + PmtInf/LclInstrm/Cd: „CORE" / „B2B" / „COR1" für SDD-Varianten + DbtrAcct/Id/IBAN: IBAN als Pflichtfeld (ersetzt Othr) + CdtrAcct/Id/IBAN: IBAN Empfänger Pflicht + CdtTrfTxInf/ChrgBr: SLEV (Share Level – Pflicht bei SEPA, ersetzt OUR/SHA) + RmtInf/Strd/CdtrRefInf: Strukturierte Referenz (ISO/SCOR/BBAN) GEÄNDERT: ~ BIC: DbtrAgt + CdtrAgt/FinInstnId/BIC – beide Pflicht (bis 2016 aufgehoben) ~ Cdtr/PstlAdr: Immer noch Freitext (AdrLine) – NOCH NICHT strukturiert ENTFERNT: - Othr-Kontonummer als alleinige ID (IBAN übernimmt) SAP-Implikation: Standard-DMEE SEPA_CT basiert auf dieser Version; SAP ECC und S/4HANA unterstützen beide .03 nativ  VERSION 001.001.04 (2012) NEU: + CtgyPurp/Cd: Kategorie-Verwendungszweck (z.B. SALA für Gehalt, SUPP für Lieferant) + UltmtDbtr/Nm + UltmtDbtr/Id: Ultimativer Auftraggeber (für POBO-Strukturen) + UltmtCdtr/Nm: Ultimativer Empfänger + InstrPrty: HIGH/NORM – Zahlungspriorität GEÄNDERT: ~ RmtInf/Strd: Erweiterung um AddtlRmtInf (zusätzliche Info, max. 140 Zeichen) SAP-Implikation: UltmtDbtr-Felder für POBO/COBO-Strukturen nutzbar; CtgyPurp für Gehaltsläufe relevant  VERSION 001.001.05 (2014) NEU: + TaxRmt: Steuerinformationen in Remittance (für einige Länder relevant, z.B. IT, ES) + Purp/Cd: Erweiterter Purpose Code (ISO 20022 ExternalPurpose1Code) GEÄNDERT: ~ Cdtr/PstlAdr: Empfehlung strukturierter Felder, noch keine Pflicht SAP-Implikation: Selten eingesetzt; TaxRmt für Italien-spezifische Anforderungen relevant  VERSION 001.001.06 (2016) NEU: + PmtInf/PmtTpInf/SvcLvl/Prtry: Proprietärer Service Level (für bankspezifische Services) + RgltryRptg: Regulatorisches Reporting (Währungskontrolle, z.B. für CN, IN, BR) + Tax/Cdtr, Tax/Dbtr, Tax/Tp: Steuer-Identifikation für Zahlungsparteien + MndtRltdInf (für SDD in pain.001 COR1-Variante) GEÄNDERT: ~ RmtInf/Strd/CdtrRefInf/Ref: Max. Länge auf 35 Zeichen standardisiert SAP-Implikation: RgltryRptg-Felder für Zahlungen in kontrollierte Währungsräume; breitere Nutzung außerhalb SEPA  VERSION 001.001.07 (2017) NEU: + InitgPty/Id/OrgId/AnyBIC: BIC als Auftraggeber-Identifikator + InitgPty/Id/OrgId/LEI: LEI-Feld für Auftraggeber (noch optional) + SplmtryData: Supplementary Data für bankspezifische Erweiterungen GEÄNDERT: ~ Dbtr/Id/OrgId: Erweiterung um LEI-Option SAP-Implikation: LEI kann jetzt in Zahlungen mitgeführt werden (optional); SAP-Konfiguration für InitgPty-Felder  VERSION 001.001.08 (2018) NEU: + GrpHdr/BtchBookg: Batch Booking Flag (true/false – Sammelbuchung oder Einzelbuchung auf Kontoauszug) + InstrForCdtrAgt/Cd: Instruktionen an Empfänger-Bank (CHQB, HOLD, PHOB, TELB) + InstrForNxtAgt/Cd: Instruktionen an nächste Bank in der Kette GEÄNDERT: ~ SvcLvl: Erweiterung um URGP (Dringlich) und SDVA (Same Day Value) SAP-Implikation: BtchBookg steuert ob Bank Sammelbuchung macht → relevant für BAM-Buchungslogik  VERSION 001.001.09 (2019) – SWIFT gpi / MX ← PFLICHT FÜR SWIFT MX AB NOV. 2025 NEU (MAJOR UPDATE): + CdtTrfTxInf/SvcLvl/Cd: „INST" – Instant Payment Service Level + Cdtr/PstlAdr/StrtNm: Straßenname (strukturiert, PFLICHT bei SWIFT MX) + Cdtr/PstlAdr/BldgNb: Hausnummer (strukturiert) + Cdtr/PstlAdr/PstCd: Postleitzahl (strukturiert, PFLICHT) + Cdtr/PstlAdr/TwnNm: Stadt (strukturiert, PFLICHT) + Cdtr/PstlAdr/Ctry: Ländercode ISO 3166 (strukturiert, PFLICHT) + Dbtr/PstlAdr: Gleiche strukturierte Felder für Auftraggeber (PFLICHT bei SWIFT MX) + CdtTrfTxInf/CdtrAgt/FinInstnId/BICFI: BIC Empfänger-Bank (wieder Pflicht bei MX) + RmtInf/Strd/AddtlRmtInf: Bis 3 × 140 Zeichen strukturierte Zusatzinfo + IntrBkSttlmAmt: Interbank Settlement Amount (für gpi-Tracking) + XchgRateInf: Wechselkursinformation für FX-Zahlungen + Tax/Dbtr/TaxId: Steuer-ID Auftraggeber + Tax/Cdtr/TaxId: Steuer-ID Empfänger GEÄNDERT (BREAKING CHANGES): ~ Cdtr/PstlAdr: AdrLine (Freitext) wird bei SWIFT MX NICHT MEHR AKZEPTIERT → strukturierte Felder Pflicht ~ Dbtr/PstlAdr: Gleicher Breaking Change ~ RmtInf/Ustrd: Weiterhin max. 140 Zeichen; bei Strd/RmtInf bis 750 Zeichen möglich ENTFERNT (bei SWIFT MX): - AdrLine als alleinige Adressangabe SAP-Implikation: S/4HANA mit aktuellem Release unterstützt .09 nativ; ECC 6.0 benötigt Add-On oder Custom DMEE; Adressstammdaten müssen strukturiert sein; größtes Migrationsprojekt für viele Unternehmen  VERSION 001.001.10 (2020) NEU: + Proxy/Tp + Proxy/Id: Alias-basierte Adressierung (Telefonnummer, E-Mail als Zahlungsadresse – für Instant Payment in einigen Ländern) + VrfctnOfTermsAndCndtns: Verifikationsfelder für Request-to-Pay GEÄNDERT: ~ Cdtr/PstlAdr: Weitere Präzisierung strukturierter Unterfelder SAP-Implikation: Proxy-Felder für zukünftige Instant-Payment-Szenarien; heute noch kaum produktiv  VERSION 001.001.11 (2021) NEU: + CdtTrfTxInf/MndtRltdInf: Mandatsinformation direkt in Credit Transfer (für recurring payments) + GrpHdr/TtlIntrBkSttlmAmt: Gesamtsumme Interbank Settlement + CshAcct/Tp/Cd: Kontotyp-Klassifikation GEÄNDERT: ~ UltmtDbtr / UltmtCdtr: Erweiterung um vollständige Adressfelder SAP-Implikation: Wenige produktive Änderungen; UltmtDbtr-Adressfelder für POBO-Verbesserung  VERSION 001.001.12 (2022) NEU: + RgltryRptg/DbtCdtRptgInd: Richtungsindikator für regulatorisches Reporting + RgltryRptg/Authrty/Ctry + Authrty/Nm: Zuständige Aufsichtsbehörde + AddtlInf in RgltryRptg: Freitextfeld für Behördeninformationen + CdtTrfTxInf/NclsdFile: Beigefügte Dokumente (Referenz auf externe Anhänge) GEÄNDERT: ~ Proxy: Erweiterung um neue Proxy-Typen (EMAL, MOBN, NIDN, CCPT) SAP-Implikation: RgltryRptg-Erweiterungen für Zahlungen in CN, IN, BR, ZA wichtig  VERSION 001.001.13 (2023) – AKTUELLSTE VERSION NEU: + UltmtDbtr/PstlAdr: Vollständige strukturierte Adresse für ultimativen Auftraggeber + UltmtCdtr/PstlAdr: Vollständige strukturierte Adresse für ultimativen Empfänger + CdtTrfTxInf/Purp/Prtry: Proprietärer Verwendungszweck (bankindividuell) + InstrForCdtrAgt/InstrInf: Freitext-Instruktionen an Empfänger-Bank (max. 140 Zeichen) + GrpHdr/PmtTpInf: Zahlungstyp-Information auf Gruppen-Ebene (bisher nur auf PmtInf-Ebene) GEÄNDERT: ~ RmtInf/Strd: Weitere Unterfelder für strukturierte Referenzen ~ ChrgsInf: Detailliertere Gebühreninformationen SAP-Implikation: S/4HANA 2023+ unterstützt .13 nativ; empfohlene Zielversion für neue Bankanbindungen

### pain_002_Versionshistorie_alle_Versionen_nderungen_

VERSION 001.001.02 (2005) – Initiale Version • OrgnlGrpInfAndSts/GrpSts: RJCT/ACCP nur auf Gruppen-Ebene • TxInfAndSts/TxSts: RJCT/ACCP auf Transaktions-Ebene • StsRsnInf/Rsn/Cd: Erste Reason Codes (AC01, AC04, AM04 etc.) • Nur synchrone Rückmeldung konzipiert • SAP-Implikation: Grundfunktionalität vorhanden; wenige Reason Codes  VERSION 001.001.03 (2008) – EPC SEPA-Basis ← HEUTE NOCH STANDARD FÜR SEPA NEU: + OrgnlGrpInfAndSts/StsRsnInf/Rsn/Cd: „PART" – teilweise abgelehnt (neu) + TxInfAndSts/OrgnlEndToEndId: Rückverweis auf ursprüngliche EndToEndId + TxInfAndSts/OrgnlInstrId: Rückverweis auf InstrId + StsRsnInf/AddtlInf: Freitext-Zusatzinfo der Bank zum Ablehnungsgrund (max. 105 Zeichen) + AccptncDtTm: Annahme-Zeitstempel ERWEITERTE REASON CODES: + MD01: No Mandate (SDD: Mandat fehlt) + MD02: Missing Mandatory Information in Mandate + MD06: Return of Funds Requested by End Customer + MD07: End Customer Deceased + RC01: Incorrect BIC + SL01: Specific Service offered by Debtor Agent SAP-Implikation: Standard-BCM-Mapping basiert auf .03; PART-Status muss explizit konfiguriert werden  VERSION 001.001.04–008 (2012–2018) NEU PRO VERSION: + 004: OrgnlTxRef-Block: Rückspiegelung aller ursprünglichen pain.001-Felder (Betrag, Datum, Parteien)   → Ermöglicht Abgleich ohne Zugriff auf ursprüngliche pain.001 + 005: NbOfTxsPerSts: Anzahl Transaktionen je Status (RJCT-Count, ACCP-Count) + 006: StsRsnInf/Orgtr: Urheber der Ablehnung (Bank oder Clearing-System) + 007: ChrgsInf: Gebühreninformation in Statusrückmeldung + 008: SWIFT gpi Vorbereitung; IntrBkSttlmAmt in OrgnlTxRef NEUE REASON CODES: + AC13: Invalid Debtor Account Type + AG01: Transaction Forbidden (Zahlungsart auf diesem Konto nicht erlaubt) + AG02: Invalid Bank Operation Code + CNOR: Creditor Bank Not Registered + DNOR: Debtor Bank Not Registered + DUPL: Duplicate Payment (Duplikat erkannt) + FOCR: Following Cancellation Request (Zahlung wegen Rückruf storniert) + LEGL: Legal Decision (rechtliche Anordnung) + NARR: Narrative (Freitext-Ablehnungsgrund wenn kein Code passt) + RR01–RR04: Regulatory Reporting Codes SAP-Implikation: OrgnlTxRef ab .04 ermöglicht besseres Exception-Handling; DUPL-Code für Duplikat-Erkennung konfigurierbar  VERSION 001.001.09 (2019) – SWIFT MX Alignment NEU: + TxInfAndSts/TxSts: „ACSC" – AcceptedSettlementCompleted (für Instant Payment: Settlement sofort abgeschlossen) + TxInfAndSts/TxSts: „ACWC" – AcceptedWithChange (akzeptiert mit Datenänderung durch Bank) + TxInfAndSts/TxSts: „PDNG" – Pending (in Warteschleife, z.B. Compliance-Prüfung) + TxInfAndSts/TxSts: „PNDG" – PendingSettlement (Settlement ausstehend) + StsRsnInf/Rsn/Prtry: Proprietärer Ablehnungsgrund (bankindividueller Code, max. 35 Zeichen) + TxInfAndSts/PrcgDt: Verarbeitungsdatum der Bank NEUE REASON CODES: + AC15: Account Blocked – Regulatory (Konto gesperrt wegen Regulatorik) + AM14: Transaction Amount Exceeds Agreed Maximum Amount + AM21: Transaction Amount Below Agreed Minimum Amount (Instant-Limit) + BE04: Missing Creditor Address (fehlende strukturierte Adresse – NEU in .09) + BE07: Missing Debtor Address + BE08: Missing Debtor Name + FF01: Invalid File Format + G004: Narrative Reason (Ländercode + Freitext) + ARDT: Already Returned Transaction SAP-Implikation: ACSC für Instant Payment wichtig; neue Adress-Reason-Codes (BE04/BE07/BE08) werden bei SWIFT MX relevant; BCM-Mapping muss erweitert werden  VERSION 001.001.10–14 (2020–2023) NEU PRO VERSION: + 010: TxInfAndSts/ChrgsInf: Gebührendetails je Transaktion in Statusrückmeldung + 011: Proxy in OrgnlTxRef: Rückspiegelung der Proxy-Adresse (Telefon/E-Mail) + 012: RgltryRptg in OrgnlTxRef: Rückspiegelung regulatorischer Reportingdaten + 013: UltmtDbtr/UltmtCdtr strukturierte Adressen in OrgnlTxRef + 014: GrpHdr/MsgId jetzt 35 Zeichen (war 35; keine Änderung) + neue Proxy-Typen NEUE REASON CODES .010+: + CH03: Requested Execution Date/Collection Date too Far in Future + CH11: Debtor Identification Code Missing or Invalid + CH16: Clearing Request Aborted + DS04: Order Rejected by the Bank + FRTR: Follow-up of Return/Recall + INDA: Instructed by Next Agent + SVNR: Service Not Rendered SAP-Implikation: Reason Code Bibliothek muss laufend aktualisiert werden; neue Codes für Instant und Regulatory Reporting relevant

### pain_008_Versionshistorie_alle_Versionen_nderungen_

VERSION 001.001.02 (2008) – EPC SEPA-Basis ← HEUTE NOCH STANDARD FÜR SEPA SDD • GrpHdr: MsgId, CreDtTm, NbOfTxs, CtrlSum (identisch pain.001) • PmtInf/PmtMtd: „DD" (Direct Debit) • PmtInf/SeqTp: FRST / RCUR / OOFF / FNAL – Mandatssequenz (Pflicht) • PmtInf/ReqdColltnDt: Fälligkeitstag (Pflicht; mind. T+2 für FRST, T+1 für RCUR) • PmtInf/Cdtr/Nm: Name Gläubiger (Pflicht) • PmtInf/CdtrAcct/Id/IBAN: IBAN Gläubiger (Pflicht) • PmtInf/CdtrSchmeId/Id/PrvtId/Othr: Creditor Identifier / Gläubiger-ID (Pflicht) • DrctDbtTxInf/MndtRltdInf/MndtId: Mandatsreferenz (Pflicht, max. 35 Zeichen) • DrctDbtTxInf/MndtRltdInf/DtOfSgntr: Mandatsdatum (Pflicht) • DrctDbtTxInf/MndtRltdInf/AmdmntInd: Änderungsindikator true/false (Pflicht) • DrctDbtTxInf/MndtRltdInf/AmdmntInfDtls: Geänderte Mandatsdaten (Pflicht wenn AmdmntInd=true)   - OrgnlMndtId: Ursprüngliche Mandats-ID   - OrgnlCdtrSchmeId: Ursprüngliche Gläubiger-ID   - OrgnlDbtrAcct/IBAN: Ursprüngliche Schuldner-IBAN   - OrgnlDbtrAgt/FinInstnId: Ursprüngliche Schuldner-Bank • DrctDbtTxInf/Dbtr/Nm: Name Schuldner (Pflicht) • DrctDbtTxInf/DbtrAcct/Id/IBAN: IBAN Schuldner (Pflicht) • DrctDbtTxInf/DbtrAgt/FinInstnId/BIC: BIC Schuldner-Bank (Pflicht bis 2016) • RmtInf/Ustrd: Verwendungszweck (max. 140 Zeichen) SAP-Implikation: Standard-DMEE SEPA_DD_CORE und SEPA_DD_B2B basieren auf .02; SAP pflegt SeqTp automatisch aus Mandatsstamm  VERSION 001.001.03 (2012) NEU: + PmtInf/BtchBookg: Batch Booking Flag (Sammelbuchung auf Kontoauszug) + DrctDbtTxInf/InstrPrty: HIGH/NORM – Priorität + DrctDbtTxInf/Purp/Cd: Purpose Code (z.B. RCUR für wiederkehrend) + UltmtCdtr/Nm: Ultimativer Gläubiger (für POBO-ähnliche Lastschrift-Strukturen) + UltmtDbtr/Nm: Ultimativer Schuldner GEÄNDERT: ~ BIC Schuldner-Bank: Ab SEPA-Verordnung 2016 kein Pflichtfeld mehr SAP-Implikation: UltmtCdtr für Konzernlastschriften relevant; BtchBookg steuert Sammelbuchung  VERSION 001.001.04–007 (2014–2018) NEU PRO VERSION: + 004: TaxRmt/TaxId: Steuer-ID in Remittance (relevant für IT, ES, PT) + 004: CtgyPurp/Cd: Kategorie-Verwendungszweck + 005: RgltryRptg: Regulatorisches Reporting (für Devisenkontrollländer) + 006: SplmtryData: Bankspezifische Erweiterungen + 007: InitgPty/Id/OrgId/LEI: LEI des Initiators GEÄNDERT: ~ SeqTp: Keine strukturellen Änderungen; Klarstellung bei FNAL (letzter Einzug schließt Mandat) SAP-Implikation: TaxRmt für Italian-spezifische Anforderungen (Codice Fiscale in Lastschrift); LEI optional mitführbar  VERSION 001.001.08 (2019) – SWIFT Alignment NEU: + DrctDbtTxInf/Cdtr/PstlAdr/StrtNm: Strukturierter Straßenname Gläubiger + DrctDbtTxInf/Cdtr/PstlAdr/PstCd: Strukturierte PLZ Gläubiger + DrctDbtTxInf/Cdtr/PstlAdr/TwnNm: Strukturierte Stadt Gläubiger + DrctDbtTxInf/Cdtr/PstlAdr/Ctry: Ländercode Gläubiger + DrctDbtTxInf/Dbtr/PstlAdr: Identische strukturierte Felder für Schuldner + XchgRateInf: Wechselkurs (für FX-Lastschriften außerhalb SEPA) GEÄNDERT: ~ AdrLine: Bei SWIFT MX nicht mehr akzeptiert – strukturierte Adresse Pflicht ~ MndtId: Klarstellung Eindeutigkeitsanforderung (pro Gläubiger-ID eindeutig) SAP-Implikation: Strukturierte Adressfelder müssen in DMEE gemappt sein; AdrLine-Migration nötig  VERSION 001.001.09–11 (2020–2023) NEU: + 009 (2020): Proxy/Tp + Proxy/Id: Alias-Adressierung für Schuldner (Telefon/E-Mail) + 009: VrfctnOfTermsAndCndtns: Request-to-Pay Verifikation + 010 (2021): MndtRltdInf/Tp: Mandatstyp-Klassifikation (ONE_OFF, RECURRING)   → Ergänzt SeqTp um semantische Klassifikation + 010: ElctrncSgntr: Elektronische Signatur des Mandats (für digitale Mandate) + 011 (2023): InstdAmt/CCY für Multi-Currency-Lastschriften + 011: UltmtDbtr/PstlAdr strukturiert; UltmtCdtr/PstlAdr strukturiert GEÄNDERT: ~ AmdmntInfDtls: Erweiterung um OrgnlDbtrAgt/PstlAdr strukturiert ~ DtOfSgntr: Klarstellung bei digitalen Mandaten (elektronisches Datum zulässig) SAP-Implikation: ElctrncSgntr für digitale Mandate (z.B. E-Mandate) relevant; Proxy für zukünftige Instant-Lastschrift-Szenarien

### Customer_Credit_Transfer_Initiation_Nachricht_vom_Kunden_Cor

Customer Credit Transfer Initiation: Nachricht vom Kunden (Corporate/Debtor) an seine Bank zur Initiierung einer oder mehrerer Überweisungen. Enthält: GrpHdr (Group Header mit Gesamtbetrag, Anzahl Transaktionen, MSGID), PmtInf (Payment Information – Zahlungsweise, Datum, Debtor-Daten) und CdtTrfTxInf (Credit Transfer Transaction – Betrag, Währung, Creditor-Daten, Remittance). Wird von SAP via DMEE erzeugt und per EBICS/SWIFT FileAct an Bank übermittelt.

### Customer_Credit_Transfer_Initiation_Nachricht_vom_Kunden_Cor

pain.001 ist die Datei die SAP an Ihre Bank schickt wenn Sie Überweisungen ausführen möchten. Stellen Sie sich vor, Sie schicken Ihrer Bank einen Stapel Überweisungsaufträge in einem standardisierten Umschlag – das ist pain.001. Die Datei kann eine oder tausende Überweisungen auf einmal enthalten. Die Bank liest die Datei, prüft sie und führt die Überweisungen aus.

### Statusr_ckmeldung_der_Bank_an_den_Corporate_nach_Einreichung

Statusrückmeldung der Bank an den Corporate nach Einreichung einer pain.001. Enthält Verarbeitungsstatus auf Gruppen- und Transaktionsebene: RJCT (Rejected), ACCP (Accepted), ACSC (AcceptedSettlementCompleted), PDNG (Pending). Kritisch für automatisiertes Ausnahme-Handling in SAP BCM – Reason Codes müssen in Buchungsregeln und Exception-Workflows gemappt sein.

### Statusr_ckmeldung_der_Bank_an_den_Corporate_nach_Einreichung

pain.002 ist die Antwort der Bank auf Ihren Zahlungsauftrag (pain.001). Die Bank sagt damit: 'Ich habe Ihre Überweisungen erhalten und hier ist der Status – akzeptiert, abgelehnt oder noch in Bearbeitung.' Wenn eine Zahlung abgelehnt wurde, steht in dieser Datei auch warum – z.B. 'falsche IBAN' oder 'Konto gesperrt'.

### Customer_Direct_Debit_Initiation_Initiiert_Lastschriften_Abb

Customer Direct Debit Initiation: Initiiert Lastschriften (Abbuchungen) vom Konto des Schuldners. Pflichtfelder: Mandatsreferenz (MndtId), Mandatsdatum (DtOfSgntr), Sequenz (SeqTp: FRST/RCUR/OOFF/FNAL), Creditor Identifier (CdtrSchmeId). Zwei Varianten: SDD Core (B2C und B2B, mit Rückgaberecht) und SDD B2B (nur B2B, kein Rückgaberecht für Schuldner). Pre-Notification Pflicht: 14 Tage vor FRST.

### Customer_Direct_Debit_Initiation_Initiiert_Lastschriften_Abb

pain.008 ist das Gegenstück zu pain.001 – aber für Lastschriften. Wenn Ihr Unternehmen Geld von Kunden einzieht (z.B. wiederkehrende Gebühren), schickt SAP eine pain.008-Datei an die Bank. Die Bank zieht dann das Geld vom Kunden-Konto ab. Voraussetzung: Der Kunde hat vorher eine Einzugsermächtigung (Mandat) unterschrieben.

### GrpHdr_MsgId_Eindeutige_Nachrichten-ID_max_35_Zeichen_GrpHdr

GrpHdr/MsgId: Eindeutige Nachrichten-ID (max. 35 Zeichen) GrpHdr/CreDtTm: Erstellungszeitpunkt GrpHdr/NbOfTxs: Anzahl Transaktionen GrpHdr/CtrlSum: Summe aller Beträge (Prüfsumme) PmtInf/PmtMtd: Zahlungsart (TRF = Überweisung) PmtInf/ReqdExctnDt: Gewünschtes Ausführungsdatum PmtInf/Dbtr/Nm: Name Auftraggeber PmtInf/DbtrAcct/Id/IBAN: IBAN Auftraggeber PmtInf/DbtrAgt/FinInstnId/BICFI: BIC Auftraggeber-Bank CdtTrfTxInf/InstrId: Interne Anweisungs-ID CdtTrfTxInf/EndToEndId: End-to-End-Referenz (wird bis Empfänger durchgereicht) CdtTrfTxInf/Amt/InstdAmt: Betrag + Währung CdtTrfTxInf/Cdtr/Nm: Name Empfänger CdtTrfTxInf/CdtrAcct/Id/IBAN: IBAN Empfänger CdtTrfTxInf/RmtInf: Verwendungszweck (Ustrd: Freitext bis 140 Zeichen; Strd: strukturiert bis 750 Zeichen) Ab .09: CdtTrfTxInf/Cdtr/PstlAdr: strukturierte Empfänger-Adresse Ab .09: PmtInf/SvcLvl/Cd: SEPA / URGP / INST (für Instant)

### GrpHdr_MsgId_Eindeutige_Nachrichten-ID_max_35_Zeichen_GrpHdr

Pflicht (alle Versionen): • GrpHdr/MsgId • GrpHdr/CreDtTm • GrpHdr/NbOfTxs • GrpHdr/CtrlSum • PmtInf/PmtMtd • PmtInf/ReqdExctnDt • PmtInf/Dbtr/Nm • PmtInf/DbtrAcct/IBAN • PmtInf/DbtrAgt/BIC • CdtTrfTxInf/EndToEndId • CdtTrfTxInf/Amt/InstdAmt • CdtTrfTxInf/Cdtr/Nm • CdtTrfTxInf/CdtrAcct/IBAN  Zusätzlich ab .09 (SWIFT MX): • Cdtr/PstlAdr (strukturiert: StrtNm, BldgNb, PstCd, TwnNm, Ctry) • Dbtr/PstlAdr (strukturiert) • ChargeBearer (SLEV/SHAR/CRED/DEBT)

### GrpHdr_MsgId_ID_dieser_Statusnachricht_GrpHdr_OrgnlMsgId_Ref

GrpHdr/MsgId: ID dieser Statusnachricht GrpHdr/OrgnlMsgId: Referenz auf die ursprüngliche pain.001 OrgnlGrpInfAndSts/GrpSts: Status der gesamten Gruppe (RJCT/ACCP/PART) TxInfAndSts/OrgnlEndToEndId: Referenz auf ursprüngliche Transaktion TxInfAndSts/TxSts: Status der einzelnen Transaktion TxInfAndSts/StsRsnInf/Rsn/Cd: Reason Code (z.B. AC01, AM04) TxInfAndSts/StsRsnInf/AddtlInf: Freitext-Zusatzinfo der Bank

### GrpHdr_MsgId_CreDtTm_NbOfTxs_CtrlSum_PmtInf_PmtMtd_DD_Direct

GrpHdr/MsgId, CreDtTm, NbOfTxs, CtrlSum PmtInf/PmtMtd: DD (Direct Debit) PmtInf/SeqTp: FRST/RCUR/OOFF/FNAL PmtInf/ReqdColltnDt: Fälligkeitstag PmtInf/Cdtr/Nm: Name Gläubiger PmtInf/CdtrSchmeId: Creditor Identifier (Gläubiger-ID) DrctDbtTxInf/MndtRltdInf/MndtId: Mandatsreferenz DrctDbtTxInf/MndtRltdInf/DtOfSgntr: Mandatsdatum DrctDbtTxInf/MndtRltdInf/AmdmntInd: Änderungsindikator DrctDbtTxInf/Dbtr/Nm: Name Schuldner DrctDbtTxInf/DbtrAcct/IBAN: IBAN Schuldner

### 1_CtrlSum-Mismatch_Summe_der_Einzelbetr_ge_stimmt_nicht_mit_

1) CtrlSum-Mismatch: Summe der Einzelbeträge stimmt nicht mit GrpHdr/CtrlSum überein → sofortiger Reject 2) MsgId-Duplikat: Gleiche MsgId innerhalb von 24h wird von Bank abgewiesen (Duplikatschutz) 3) EndToEndId nicht eindeutig: Führt zu Matching-Problemen in pain.002 und camt.054 4) Strukturierte Adresse (.09+): Freitext statt strukturiert → SWIFT-Reject bei MX-Kanal 5) ReqdExctnDt in Vergangenheit oder Wochenende/Feiertag: Je nach Bank Reject oder Datumkorrektur 6) Cdtr/Nm leer: Bei PSD3-IBAN-Name-Check → Reject 7) RmtInf/Ustrd > 140 Zeichen: Wird abgeschnitten oder Reject (bankabhängig) 8) SvcLvl/Cd SEPA + non-SEPA IBAN: Widerspruch → Reject 9) ChargeBearer DEBT bei SEPA: Nicht erlaubt (SEPA schreibt SLEV vor)

### 1_CtrlSum-Mismatch_Summe_der_Einzelbetr_ge_stimmt_nicht_mit_

1) PRÜFSUMME STIMMT NICHT: SAP berechnet eine Kontrollsumme über alle Beträge. Stimmt die nicht mit der Gesamtsumme überein, lehnt die Bank die gesamte Datei ab – keine einzige Zahlung wird ausgeführt. 2) GLEICHE DATEI ZWEIMAL GESCHICKT: Wenn SAP versehentlich die gleiche Datei zweimal sendet, erkennt die Bank den Duplikat und lehnt die zweite ab. Das ist gut (kein doppeltes Zahlen), kann aber zu Verwirrung führen. 3) EMPFÄNGER-NAME FEHLT: Wenn der Name des Empfängers in SAP leer ist, wird die Zahlung künftig abgelehnt (IBAN-Name-Prüfung). 4) VERWENDUNGSZWECK ZU LANG: Mehr als 140 Zeichen Verwendungszweck werden entweder abgeschnitten oder die Zahlung wird abgelehnt. 5) FALSCHES DATUM: Wenn das Ausführungsdatum ein Wochenende oder Feiertag ist, reagieren verschiedene Banken unterschiedlich.

### 1_Reason_Code_nicht_im_BCM-Mapping_hinterlegt_unbekannte_Cod

1) Reason Code nicht im BCM-Mapping hinterlegt → unbekannte Codes landen in generischer Ausnahme-Queue ohne Handlungshinweis 2) PART-Status (teilweise abgelehnt) nicht korrekt verarbeitet → Corporate denkt alle Zahlungen wurden ausgeführt 3) OrgnlEndToEndId-Matching fehlerhaft → Statusrückmeldung kann nicht der ursprünglichen SAP-Zahlung zugeordnet werden 4) Delay: pain.002 kommt asynchron – kann Minuten bis Stunden nach pain.001 kommen → synchroner Polling-Prozess nötig 5) Neue Reason Codes (.09+) in alten BCM-Mappings nicht bekannt → Codes werden ignoriert

### 1_Reason_Code_nicht_im_BCM-Mapping_hinterlegt_unbekannte_Cod

1) UNBEKANNTE FEHLERCODES: Die Bank schickt einen Ablehnungsgrund-Code den SAP nicht kennt. SAP weiß nicht was es damit machen soll – die abgelehnte Zahlung liegt in einem Stapel unvearbeiteter Fälle. 2) NUR TEILWEISE ABGELEHNT: Von 100 Zahlungen werden 3 abgelehnt, 97 ausgeführt. Wenn das nicht richtig verarbeitet wird, denkt das System alle 100 wurden ausgeführt. 3) ZUORDNUNG NICHT MÖGLICH: Die Statusrückmeldung der Bank kann nicht der richtigen Rechnung in SAP zugeordnet werden – weil die Referenznummer nicht übereinstimmt. 4) ZEITVERZÖGERUNG: Die Statusrückmeldung kommt manchmal erst Stunden nach dem Zahlungsauftrag. Prozesse die sofort auf den Status warten, laufen ins Leere.

### 1_SeqTp_falsch_FRST_bei_erstem_Einzug_vergessen_oder_RCUR_na

1) SeqTp falsch: FRST bei erstem Einzug vergessen oder RCUR nach Mandatspause → Reject MD01/MD02 2) CdtrSchmeId fehlt oder falsch: Ohne gültige Gläubiger-ID wird gesamter Batch abgewiesen 3) ReqdColltnDt zu früh: SDD Core mind. T+1 (RCUR) / T+2 (FRST) nach Einreichung; sonst Reject 4) AmdmntInd: Wenn Mandatsdaten geändert wurden (IBAN, Name) muss AmdmntInd=true mit OrgnlMndt-Feldern → wird häufig vergessen 5) OOFF nach RCUR: Wenn nach mehreren RCUR ein OOFF gesendet wird → Mandat endet danach; häufig falsch gesetzt

### 1_SeqTp_falsch_FRST_bei_erstem_Einzug_vergessen_oder_RCUR_na

1) ERSTE ABBUCHUNG FALSCH MARKIERT: Bei der allerersten Abbuchung eines Kunden muss 'FRST' (First) stehen. Steht dort 'RCUR' (Recurring/Wiederkehrend), lehnt die Bank ab. 2) GLÄUBIGER-ID FEHLT: Ohne die Gläubiger-ID (eine spezielle Kennnummer die Sie bei Ihrer Bank beantragen müssen) wird der gesamte Lastschrift-Batch abgewiesen. 3) ZU KURZFRISTIG EINGEREICHT: Lastschriften müssen einige Tage vorher bei der Bank eingereicht werden. Zu spät eingereicht bedeutet Reject. 4) MANDATSDATEN GEÄNDERT, NICHT GEMELDET: Wenn ein Kunde seine IBAN geändert hat und das nicht korrekt im System vermerkt ist, wird die Abbuchung abgewiesen.

### DMEE-Formatbaum_SEPA_CT_Standard_EPC_03_SWIFT_MX_CT_09_Trans

DMEE-Formatbaum: SEPA_CT (Standard EPC .03); SWIFT_MX_CT (.09+) Transaktion F110: Zahllauf erzeugt pain.001 via DMEE Transaktion FPAYHX: Manuelle Zahlungsanweisung BCM Kanal: EBICS (bevorzugt DE/AT/FR) oder SWIFT FileAct Relevante SAP-Felder: • Dbtr/Nm ← T001 BUKRS Firmenname • Dbtr/IBAN ← BNKA IBAN Hausbank • Cdtr/Nm ← LFB1/LFA1 Kreditorname • Cdtr/IBAN ← LFBK IBAN Kreditor • EndToEndId ← BELNR + BUKRS + GJAHR • RmtInf/Ustrd ← SGTXT Buchungstext (max. 140 Z.) • ReqdExctnDt ← ZFBDT Zahlungsdatum

### DMEE-Formatbaum_SEPA_CT_Standard_EPC_03_SWIFT_MX_CT_09_Trans

In SAP gibt es eine Konfiguration (DMEE – Zahlungsmedienformat) die bestimmt wie die pain.001-Datei aussieht.  Was SAP woher nimmt: • Name Ihres Unternehmens → aus den Firmenstammdaten • IBAN Ihres Kontos → aus der Hausbank-Konfiguration • Name des Lieferanten → aus dem Lieferantenstamm • IBAN des Lieferanten → aus den Bankdaten des Lieferanten • Verwendungszweck → aus dem Buchungstext der Rechnung • Ausführungsdatum → aus dem Zahlungsdatum im Buchungskreis  Wenn eines dieser Felder in SAP falsch oder leer ist, wird die Zahlung entweder abgelehnt oder mit falschen Daten ausgeführt.

### BCM_Eingehende_pain_002_ber_EBICS_FileAct_BCM_Monitoring_Coc

BCM: Eingehende pain.002 über EBICS/FileAct → BCM Monitoring Cockpit Transaktion BFBT: BCM Monitor für Transaktionsstatus Reason Code Mapping: BCM Customizing → Buchungsregel je Reason Code RJCT mit AC01 → Alert + manuelle Klärungsaufgabe RJCT mit AM04 → Liquiditäts-Alert an Treasury OrgnlEndToEndId ↔ SAP BELNR+BUKRS+GJAHR für Rückverfolgung

### BCM_Eingehende_pain_002_ber_EBICS_FileAct_BCM_Monitoring_Coc

Wenn die Bank eine Zahlung ablehnt, kommt eine pain.002-Datei zurück in SAP. SAP liest diese Datei und vergleicht die Referenznummer mit dem ursprünglichen Zahlungsauftrag.  Was SAP dann tun sollte: • Bei Ablehnung: Eine Aufgabe im System erstellen damit jemand den Fehler beheben kann • Den Ablehnungsgrund anzeigen ('Falsche IBAN – bitte korrigieren') • Die Zahlung als 'nicht ausgeführt' markieren  Das muss aber konfiguriert sein – es passiert nicht automatisch.

### DMEE_SEPA_DD_CORE_SEPA_DD_B2B_Mandatsstammdaten_SAP_FI_Debit

DMEE: SEPA_DD_CORE / SEPA_DD_B2B Mandatsstammdaten: SAP FI Debitorenstamm → Zahlungsverkehr → Mandat CdtrSchmeId ← Konfiguration Buchungskreis (Gläubiger-ID) MndtId ← Mandat-Referenz im Debitorenstamm SeqTp ← Automatisch aus Mandatsstatus (FRST bei erstem Einzug) ReqdColltnDt ← ZFBDT + Vorlaufzeit-Konfiguration

### DMEE_SEPA_DD_CORE_SEPA_DD_B2B_Mandatsstammdaten_SAP_FI_Debit

SAP holt alle nötigen Informationen für die Lastschrift-Datei aus verschiedenen Stellen: • Ihre Gläubiger-ID → aus der SAP-Buchungskreis-Konfiguration • Mandatsreferenz → aus dem Debitorenstammsatz des Kunden • Ob es die erste Abbuchung ist → SAP merkt sich ob schon abgebucht wurde • IBAN des Kunden → aus dem Kundenstamm • Fälligkeitsdatum → aus der Rechnung plus automatisch berechneter Vorlaufzeit

### 1_DMEE-Versionskonflikt_SAP_ECC_nutzt_03-DMEE_Bank_verlangt_

1) DMEE-Versionskonflikt: SAP ECC nutzt .03-DMEE, Bank verlangt .09 für SWIFT MX → Migration erforderlich vor Nov. 2025 2) CtrlSum-Bug nach DMEE-Customizing: Manuelle DMEE-Anpassung verursacht falsche Summenberechnung → alle Dateien werden abgewiesen 3) EndToEndId-Kollision: Mehrere Buchungskreise nutzen gleiche Nummernkreise → Duplikat-IDs → Matching-Chaos in Statusrückmeldung 4) ChargeBearer hardcoded DEBT in DMEE → alle SEPA-Zahlungen werden abgewiesen 5) Adressfelder: SAP-Kreditorenstamm hat Adresse als ein Freitextfeld → structured address nicht möglich ohne Datenmigration

### 1_DMEE-Versionskonflikt_SAP_ECC_nutzt_03-DMEE_Bank_verlangt_

1) ALTE KONFIGURATION, NEUE BANK-ANFORDERUNG: SAP hat eine alte Zahlungsdatei-Konfiguration, die Bank verlangt aber eine neuere Version. Resultat: Alle Zahlungen werden abgewiesen bis die Konfiguration aktualisiert wird. 2) SUMME STIMMT NICHT: Jemand hat an der Konfiguration gebaut und dabei die Summenberechnung kaputt gemacht. Alle Zahlungsdateien werden abgewiesen – niemand versteht warum. 3) GLEICHE REFERENZNUMMERN: Mehrere Gesellschaften im SAP-System nutzen die gleichen Referenznummern. Die Bank denkt, es ist ein Duplikat und lehnt ab. 4) ADRESSEN NICHT STRUKTURIERT: Die Lieferantenadressen sind in SAP als ein langer Text gespeichert. Das neue Format verlangt Straße, PLZ und Ort getrennt. Das erfordert eine aufwändige Datenmigration.

### 1_PART-Handling_fehlt_Nur_RJCT_und_ACCP_implementiert_PART_n

1) PART-Handling fehlt: Nur RJCT und ACCP implementiert, PART nicht → bei teilweise abgelehnten Batches unklar welche Zahlungen ausgeführt wurden 2) Reason Codes nicht lokalisiert: Bank sendet länderspezifische Codes (z.B. CBI-Codes IT) die im Standard-BCM-Mapping fehlen 3) pain.002 kommt mehrfach: Erst ACCP, dann RJCT (late rejection) → SAP hat bereits als gebucht markiert

### 1_PART-Handling_fehlt_Nur_RJCT_und_ACCP_implementiert_PART_n

1) TEILWEISE ABLEHNUNG NICHT BEACHTET: Das System ist nur für 'alles OK' oder 'alles abgelehnt' eingerichtet. Wenn von 100 Zahlungen 5 abgelehnt werden, merkt niemand es – bis Lieferanten anrufen. 2) LÄNDERSPEZIFISCHE CODES: Italienische oder französische Banken schicken manchmal andere Ablehnungscodes. SAP kennt diese nicht und lässt die Meldung unbearbeitet liegen. 3) ERST JA, DANN NEIN: Eine Zahlung wird zunächst als akzeptiert gemeldet, dann später doch abgelehnt. SAP hat sie schon als bezahlt gebucht – das muss manuell korrigiert werden.

### 1_SeqTp-Automatik_nicht_konfiguriert_SAP_setzt_immer_RCUR_FR

1) SeqTp-Automatik nicht konfiguriert: SAP setzt immer RCUR → FRST-Transaktionen werden abgewiesen 2) Mandats-Reset vergessen: Nach Mandatspause von >36 Monaten muss FRST erneut verwendet werden → System sendet RCUR 3) Gläubiger-ID für jedes Land separat: In DE: DE98ZZZ..., IT: IT..., FR: FR... – SAP-Konfiguration muss je Buchungskreis korrekte ID nutzen

### 1_SeqTp-Automatik_nicht_konfiguriert_SAP_setzt_immer_RCUR_FR

1) IMMER 'WIEDERKEHREND': SAP ist so konfiguriert, dass immer 'wiederkehrend' statt 'erstmalig' steht. Alle ersten Abbuchungen neuer Kunden werden abgewiesen. 2) PAUSE ZU LANG: Wenn ein Kunde 3 Jahre nichts abgebucht wurde und dann wieder eine Lastschrift kommt, muss es wieder eine 'erste Abbuchung' sein – SAP sendet aber 'wiederkehrend'. 3) FALSCHE GLÄUBIGER-ID PER LAND: In Deutschland, Italien und Frankreich haben Sie unterschiedliche Gläubiger-IDs. Wenn SAP die deutsche ID für eine italienische Lastschrift nutzt, wird abgewiesen.

## ISO 20022 – camt (Kontoinformation)

### IDENTIFIKATION & VERSIONEN

| Format-Name | Nachrichtentyp | Familie / Standard | Aktuelle Version | Versionshistorie (alle Versionen + Änderungen) |
| --- | --- | --- | --- | --- |
| camt.052 | Bank to Customer Account Report (Intraday) | ISO 20022 – camt (Kontoinformation) | camt.052.001.11 (2023) | → [Details unten: camt_052_Versionshistorie_alle_Versionen_nderungen_] |
| camt.053 | Bank to Customer Statement (Tagesauszug) | ISO 20022 – camt (Kontoinformation) | camt.053.001.11 (2023) | → [Details unten: camt_053_Versionshistorie_alle_Versionen_nderungen_] |
| camt.054 | Bank to Customer Debit/Credit Notification | ISO 20022 – camt (Kontoinformation) | camt.054.001.11 (2023) | → [Details unten: camt_054_Versionshistorie_alle_Versionen_nderungen_] |

### BESCHREIBUNG

| Zweck & Verwendung (Experte) | Zweck & Verwendung (Einsteiger) |
| --- | --- |
| → [Details unten: Intraday-Kontoauszug_Liefert_untert_gige_Buchungsinformation] | → [Details unten: Intraday-Kontoauszug_Liefert_untert_gige_Buchungsinformation] |
| → [Details unten: Bank_to_Customer_Statement_Tagesendauszug_mit_allen_endg_lti] | → [Details unten: Bank_to_Customer_Statement_Tagesendauszug_mit_allen_endg_lti] |
| → [Details unten: Sofortige_Einzel-Buchungsbenachrichtigung_bei_Belastung_oder] | → [Details unten: Sofortige_Einzel-Buchungsbenachrichtigung_bei_Belastung_oder] |

### TECHNISCHE DETAILS

| Wichtige Felder (technisch) | Pflichtfelder | Datenrichtung |
| --- | --- | --- |
| → [Details unten: Acct_Id_IBAN_Konto-IBAN_Bal_Salden_OpeningBooked_ClosingAvai] | Pflicht: • Acct/IBAN • Bal (mind. ein Saldo) • Ntry/Amt • Ntry/CdtDbtInd • Ntry/BookgDt | Bank → Corporate (Eingehend, auf Abruf) |
| → [Details unten: Stmt_Id_Auszugs-ID_Stmt_LglSeqNb_Fortlaufende_Auszugsnummer_] | Pflicht: • Acct/IBAN • Bal (OPBD + CLBD) • Ntry/Amt • Ntry/CdtDbtInd • Ntry/BookgDt • Ntry/ValDt • LglSeqNb | Bank → Corporate (Täglich, Tagesende) |
| → [Details unten: Ntfctn_Id_Benachrichtigungs-ID_Ntfctn_Acct_Id_IBAN_Konto_Ntf] | Pflicht: • Acct/IBAN • Itm/Amt • Itm/CdtDbtInd • Itm/BookgDt | Bank → Corporate (Sofort bei Buchung) |

### SAP-RELEVANZ

| SAP-Relevanz (Bereich) |
| --- |
| BAM (Bank Account Management) Liquiditätsplanung Cash Visibility SAP S/4 Cash Mgmt |
| BAM (FF_5 Import) AP/AR Buchungslogik Electronic Bank Statement Cash Management |
| BAM (Echtzeit-Posting) Instant Payment Reconciliation SDD R-Transaction Handling |

### PFLICHTFELDER & FEHLERQUELLEN

| Typische Fehlerquellen (Experte) | Typische Fehlerquellen (Einsteiger) |
| --- | --- |
| → [Details unten: 1_PDNG-Buchungen_in_BAM-Positivsaldo_eingerechnet_Liquidit_t] | → [Details unten: 1_PDNG-Buchungen_in_BAM-Positivsaldo_eingerechnet_Liquidit_t] |
| → [Details unten: 1_BAM-Buchungsregeln_Posting_Rules_nicht_auf_camt_053_angepa] | → [Details unten: 1_BAM-Buchungsregeln_Posting_Rules_nicht_auf_camt_053_angepa] |
| → [Details unten: 1_Doppelbuchung_camt_054_camt_053_beide_verarbeitet_Buchung_] | → [Details unten: 1_Doppelbuchung_camt_054_camt_053_beide_verarbeitet_Buchung_] |

### SAP-MAPPING

| SAP-Mapping (Experte) | SAP-Mapping (Einsteiger) |
| --- | --- |
| → [Details unten: BAM_Transaktion_FF_5_camt_052_Import_und_Verarbeitung_Postin] | → [Details unten: BAM_Transaktion_FF_5_camt_052_Import_und_Verarbeitung_Postin] |
| → [Details unten: Transaktion_FF_5_Elektronischer_Kontoauszug_Import_FEBAN_Kon] | → [Details unten: Transaktion_FF_5_Elektronischer_Kontoauszug_Import_FEBAN_Kon] |
| → [Details unten: BAM_Separate_Posting_Rules_f_r_camt_054_Echtzeit_vs_camt_053] | → [Details unten: BAM_Separate_Posting_Rules_f_r_camt_054_Echtzeit_vs_camt_053] |

### TYPISCHE FEHLER

| Häufige Projektfehler (Experte) | Häufige Projektfehler (Einsteiger) |
| --- | --- |
| → [Details unten: 1_Kein_PDNG-Handling_Buchungsregeln_nur_f_r_BOOK-Status_PDNG] | → [Details unten: 1_Kein_PDNG-Handling_Buchungsregeln_nur_f_r_BOOK-Status_PDNG] |
| → [Details unten: 1_MT940_camt_053-Migration_ohne_Posting-Rule-Review_nahezu_a] | → [Details unten: 1_MT940_camt_053-Migration_ohne_Posting-Rule-Review_nahezu_a] |
| → [Details unten: 1_Keine_Deduplizierung_zwischen_camt_054_und_camt_053_Doppel] | → [Details unten: 1_Keine_Deduplizierung_zwischen_camt_054_und_camt_053_Doppel] |

### STATUS / ABLÖSUNG

| Status / Ablösung |
| --- |
| Aktiv; ergänzend zu camt.053 Keine Abschaltung geplant |
| Aktiv; Nachfolger MT940 MT940 Sunset bei SWIFT: Nov. 2025 |
| Aktiv; v.a. für Instant Payment und SDD-Rückgaben Keine Abschaltung geplant |

### camt_052_Versionshistorie_alle_Versionen_nderungen_

VERSION 001.001.02 (2008) – Erste SEPA-Version • Rpt/Id: Report-ID • Rpt/ElctrSeqNb: Fortlaufende Sequenznummer je Abruf (für Lückenerkennung) • Rpt/CreDtTm: Erstellungszeitpunkt • Rpt/FrToDt: Zeitraum (von/bis) • Rpt/Acct/Id/IBAN: Konto-IBAN • Rpt/Bal: Salden – ITBD (InterimBooked), ITAV (InterimAvailable), FWAV (ForwardAvailable) • Rpt/Ntry/Amt + CdtDbtInd + BookgDt + ValDt • Rpt/Ntry/Sts: BOOK (endgültig gebucht) oder PDNG (vorläufig) • Rpt/Ntry/BkTxCd: Bankspezifischer Transaktionscode (Domain/Family/SubFamily) • Rpt/Ntry/NtryDtls/TxDtls/EndToEndId: End-to-End-Referenz • Rpt/Ntry/NtryDtls/TxDtls/RmtInf/Ustrd: Verwendungszweck (max. 140 Zeichen) SAP-Implikation: BAM-Import via FF_5; EBICS-Auftragsart C52; separate Buchungsregeln für PDNG nötig  VERSION 001.001.03–05 (2009–2013) NEU: + 003: NtryDtls/TxDtls/RltdPties/Dbtr/Nm + IBAN: Strukturierte Gegenpartei-Information + 003: NtryDtls/TxDtls/RltdPties/Cdtr/Nm + IBAN + 003: NtryDtls/TxDtls/RltdAgts/DbtrAgt/BIC: Bank der Gegenpartei + 004: NtryDtls/TxDtls/Refs/TxId: Transaktions-ID der Bank + 004: NtryDtls/TxDtls/Refs/InstrId: Instruktions-ID (Rückverweis auf pain.001) + 005: NtryDtls/Btch/MsgId: Batch-ID wenn Sammelposition vorliegt + 005: NtryDtls/Btch/NbOfTxs: Anzahl Einzeltransaktionen in Sammelbuchung + 005: NtryDtls/Btch/TtlAmt: Gesamtbetrag der Sammelbuchung SAP-Implikation: RltdPties ermöglicht besseres automatisches Matching; Btch-Felder für Sammelbuchungsauflösung  VERSION 001.001.06 (2016) NEU: + NtryDtls/TxDtls/RmtInf/Strd/CdtrRefInf/Tp/CdOrPrtry/Cd: Strukturierter Referenztyp (SCOR/ISO/BBAN) + NtryDtls/TxDtls/RmtInf/Strd/CdtrRefInf/Ref: Strukturierte Referenz (Rechnungsnummer, max. 35 Zeichen) + NtryDtls/TxDtls/RmtInf/Strd/AddtlRmtInf: Zusätzliche strukturierte Info (3 × 140 Zeichen) + NtryDtls/TxDtls/Purp/Cd: Purpose Code in Transaktionsdetails GEÄNDERT: ~ Bal/Tp/CdOrPrtry: Erweiterung um FWAV (ForwardAvailable) Saldo-Typ SAP-Implikation: Strd/CdtrRefInf für automatisches Rechnungsmatching; AddtlRmtInf für erweiterte Zuordnung  VERSION 001.001.07–09 (2017–2019) – SWIFT MX Alignment NEU: + 007: NtryDtls/TxDtls/RltdPties/UltmtDbtr + UltmtCdtr: Ultimativer Auftraggeber/Empfänger + 007: NtryDtls/TxDtls/RltdPties/InitgPty: Initiierende Partei (bei POBO: zahlende Muttergesellschaft) + 008: NtryDtls/TxDtls/Refs/UETR: SWIFT gpi Tracking-Referenz ← NEU wichtig für internationale Zahlungen + 008: NtryDtls/TxDtls/RltdDts/IntrBkSttlmDt: Interbank-Verrechnungsdatum + 009: NtryDtls/TxDtls/RltdPties/Dbtr/PstlAdr: Strukturierte Adresse der Gegenpartei (StrtNm, PstCd, TwnNm, Ctry) + 009: NtryDtls/TxDtls/RltdPties/Cdtr/PstlAdr: Strukturierte Adresse Empfänger SAP-Implikation: UETR für SWIFT gpi Tracking in BAM; UltmtDbtr/UltmtCdtr für POBO-Transparenz  VERSION 001.001.10–11 (2021–2023) NEU: + 010: NtryDtls/TxDtls/RltdPties/Dbtr/Proxy: Proxy-Adresse des Schuldners (Telefon/E-Mail bei Instant) + 010: NtryDtls/TxDtls/RltdPties/Cdtr/Proxy: Proxy-Adresse Empfänger + 011: Ntry/ChrgsAmt: Gebühren direkt in der Buchung ausgewiesen + 011: NtryDtls/TxDtls/Tax/Dbtr/TaxId + Tax/Cdtr/TaxId: Steuer-IDs in Transaktionsdetails + 011: NtryDtls/TxDtls/RltdPties/MndtHldr: Mandatsinhaber (für SDD-Buchungen) SAP-Implikation: ChrgsAmt für direkte Gebührenverbuchung; Tax-Felder für ländersp. Anforderungen

### camt_053_Versionshistorie_alle_Versionen_nderungen_

VERSION 001.001.02 (2008) – Erste SEPA-Version, Nachfolger MT940 • Stmt/Id: Auszugs-ID (eindeutig je Bank/Konto/Tag) • Stmt/ElctrSeqNb: Elektronische Auszugsnummer (für Lückenerkennung, Pflicht) • Stmt/LglSeqNb: Legale/physische Auszugsnummer • Stmt/CreDtTm: Erstellungszeitpunkt • Stmt/FrToDt: Abrechnungszeitraum • Stmt/Acct/Id/IBAN: Konto-IBAN (Pflicht) • Stmt/Acct/Ccy: Kontowährung • Stmt/Bal/Tp/CdOrPrtry/Cd: Saldo-Typen OPBD (Opening Booked), CLBD (Closing Booked), CLAV (Closing Available), FWAV (Forward Available) • Stmt/Bal/Amt + CdtDbtInd + Dt • Stmt/Ntry/Amt + CdtDbtInd + Sts (BOOK) + BookgDt + ValDt • Stmt/Ntry/AcctSvcrRef: Bankreferenz der Buchung (max. 35 Zeichen) • Stmt/Ntry/BkTxCd/Domn/Cd + Fmly/Cd + SubFmlyCd: ISO Bank Transaction Code (strukturiert) • Stmt/Ntry/NtryDtls/TxDtls/EndToEndId: End-to-End-Referenz • Stmt/Ntry/NtryDtls/TxDtls/RmtInf/Ustrd: Verwendungszweck (max. 140 Zeichen) SAP-Implikation: Import via FF_5; EBICS C53; BkTxCd muss auf SAP Posting Rules gemappt werden; Lückenerkennung via ElctrSeqNb konfigurierbar  VERSION 001.001.03–05 (2009–2013) NEU: + 003: NtryDtls/TxDtls/RltdPties/Dbtr + Cdtr: Name und IBAN der Zahlungsparteien in Transaktionsdetails   → Vorher: Gegenpartei nur in Freitext (wie MT940 :86:); jetzt strukturiert + 003: NtryDtls/TxDtls/RltdAgts/DbtrAgt/BIC + CdtrAgt/BIC: Banken der Gegenparteien + 004: NtryDtls/TxDtls/Refs/TxId: Bank-interne Transaktions-ID + 004: NtryDtls/TxDtls/Refs/InstrId: Rückverweis auf ursprüngliche pain.001 InstrId + 004: NtryDtls/TxDtls/Refs/EndToEndId: Klarstellung dass EndToEndId Pflicht in TxDtls + 005: NtryDtls/Btch/MsgId: Batch-Referenz (wenn Sammelbuchung vorliegt) + 005: NtryDtls/Btch/NbOfTxs: Anzahl Einzelbuchungen in Sammelbuchung + 005: NtryDtls/Btch/TtlAmt: Gesamtbetrag Sammelbuchung SAP-Implikation: RltdPties ermöglicht erstmals automatisches Matching ohne :86:-Parsing; Btch für Sammelbuchungsauflösung (Btch-Booking in pain.001)  VERSION 001.001.06 (2016) – Breite Einführung als MT940-Nachfolger NEU: + NtryDtls/TxDtls/RmtInf/Strd/CdtrRefInf/Ref: Strukturierte Rechnungsreferenz (max. 35 Zeichen)   → Ermöglicht automatisches Debitorenmatching nach Rechnungsnummer + NtryDtls/TxDtls/RmtInf/Strd/CdtrRefInf/Tp/CdOrPrtry/Cd: Referenztyp (SCOR/ISO/BBAN) + NtryDtls/TxDtls/RmtInf/Strd/AddtlRmtInf: 3 × 140 Zeichen strukturierte Zusatzinfo + NtryDtls/TxDtls/Purp/Cd: ISO Purpose Code (SALA, SUPP, TRAD etc.) direkt in Buchung + NtryDtls/TxDtls/Tax/Dbtr/TaxId: Steuer-ID Auftraggeber (für IT, ES, BR relevant) + NtryDtls/TxDtls/Tax/Cdtr/TaxId: Steuer-ID Empfänger GEÄNDERT: ~ BkTxCd: Empfehlung vollständige Domain/Family/SubFamily statt nur Domain SAP-Implikation: Strd/CdtrRefInf ist Schlüsselfeld für automatisches AR-Clearing; Tax-Felder für länderspezifische Buchungsregeln; AddtlRmtInf für erweiterte Matchinglogik  VERSION 001.001.07–09 (2017–2019) – SWIFT MX Alignment NEU: + 007: NtryDtls/TxDtls/RltdPties/UltmtDbtr/Nm + IBAN: Ultimativer Auftraggeber   → Bei POBO-Zahlungen: Tochtergesellschaft sichtbar im Kontoauszug + 007: NtryDtls/TxDtls/RltdPties/UltmtCdtr: Ultimativer Empfänger + 007: NtryDtls/TxDtls/RltdPties/InitgPty/Nm: Initiierende Partei (Konzernmutter bei POBO) + 008: NtryDtls/TxDtls/Refs/UETR: SWIFT gpi Unique End-to-End Transaction Reference   → Ermöglicht Tracking internationaler Zahlungen in BAM + 008: NtryDtls/TxDtls/RltdDts/IntrBkSttlmDt: Interbank-Verrechnungsdatum   → Unterschied zum ValDt relevant für Zinsberechnung + 009: NtryDtls/TxDtls/RltdPties/Dbtr/PstlAdr/StrtNm + PstCd + TwnNm + Ctry: Strukturierte Adresse der Gegenpartei + 009: NtryDtls/TxDtls/RltdPties/Cdtr/PstlAdr: Strukturierte Adresse Empfänger + 009: Stmt/Acct/Ownr/Id/OrgId/LEI: LEI des Kontoinhabers GEÄNDERT: ~ AcctSvcrRef: Klarstellung max. 35 Zeichen; muss bankweit eindeutig sein SAP-Implikation: UETR für SWIFT gpi Tracking im BAM; UltmtDbtr für POBO-Transparenz in Buchungsdetails; LEI des Kontoinhabers für regulatorische Auswertungen  VERSION 001.001.10–11 (2021–2023) NEU: + 010: NtryDtls/TxDtls/RltdPties/Dbtr/Proxy/Tp + Id: Proxy-Adresse (Telefon/E-Mail) für Instant + 010: NtryDtls/TxDtls/RltdPties/Cdtr/Proxy: Proxy-Adresse Empfänger + 011: Ntry/ChrgsAmt: Gebührenbetrag direkt in Buchungszeile (nicht mehr nur in BkTxCd)   → Ermöglicht direkte Gebührenverbuchung ohne Extraauswertung + 011: NtryDtls/TxDtls/Tax: Vollständiger Tax-Block in Transaktionsdetails + 011: NtryDtls/TxDtls/RltdPties/MndtHldr: Mandatsinhaber (für SDD-Rückgaben relevant) + 011: Stmt/Acct/Ownr/PstlAdr: Strukturierte Adresse des Kontoinhabers GEÄNDERT: ~ RmtInf/Strd: Weitere Unterstrukturierung für komplexe Remittance-Szenarien SAP-Implikation: ChrgsAmt für automatische Gebührenverbuchung ohne manuelle Klärung; MndtHldr für SDD-R-Transaction-Handling

### camt_054_Versionshistorie_alle_Versionen_nderungen_

VERSION 001.001.02 (2008) – Erste Version • Grundstruktur identisch camt.052/camt.053 auf Buchungsebene • Ntfctn/Id: Benachrichtigungs-ID • Ntfctn/Acct/Id/IBAN: Konto • Ntfctn/Itm/Amt + CdtDbtInd + BookgDt + ValDt • Ntfctn/Itm/Sts: BOOK / PDNG • Ntfctn/Itm/AcctSvcrRef: Bankreferenz • Ntfctn/Itm/NtryDtls/TxDtls: Transaktionsdetails (wie camt.053) • Primär genutzt für: SDD-Rückgaben (R-Transactions) und Batch-Auflösung SAP-Implikation: Separate Posting Rules gegenüber camt.053 nötig; Deduplizierung mit camt.053 via AcctSvcrRef  VERSION 001.001.03–05 (2009–2013) – Erweiterungen identisch camt.052/camt.053 NEU (parallel zu camt.052/053): + 003: RltdPties/Dbtr + Cdtr mit Nm und IBAN (strukturierte Gegenpartei) + 004: TxDtls/Refs/TxId + InstrId (Bank-Referenzen) + 005: Btch/MsgId + NbOfTxs + TtlAmt (Batch-Referenzen für Sammelbuchungsauflösung) BESONDERHEIT camt.054: + RtrInf/Rsn/Cd: Rückgabe-Reason-Code (für SDD-Rückgaben)   - AC04: Account Closed (Konto geschlossen)   - AM04: Insufficient Funds (keine Deckung)   - MD01: No Mandate (kein Mandat)   - MD06: Refund Request by End Customer (Rückforderung Schuldner innerhalb 8 Wochen)   - MS02: Not Specified Reason by Customer (Sammelrückgabe)   - SL01: Specific Service (bankspezifisch) SAP-Implikation: RtrInf/Rsn/Cd für SDD-Rückgaben-Verarbeitung; Rückgabe-Buchungsregel je Reason Code  VERSION 001.001.06 (2016) NEU: + NtryDtls/TxDtls/RmtInf/Strd/CdtrRefInf: Strukturierte Referenz in Echtzeit-Benachrichtigung   → Ermöglicht sofortiges automatisches AR-Matching bei Instant Payment + NtryDtls/TxDtls/Purp/Cd: Purpose Code in Echtzeitbenachrichtigung + Ntfctn/Itm/ValDt/DtTm: Wertstellungszeitpunkt mit Uhrzeit (NICHT nur Datum)   → Für Instant Payment: Sekundengenaue Wertstellung SAP-Implikation: ValDt/DtTm mit Uhrzeit für Instant-Reconciliation; CdtrRefInf für automatisches Clearing  VERSION 001.001.07–09 (2017–2019) – SWIFT MX + Instant Payment NEU: + 007: UltmtDbtr + UltmtCdtr in RltdPties (POBO-Transparenz in Echtzeit) + 008: UETR (Unique End-to-End Transaction Reference) in TxDtls/Refs   → Sofortiges SWIFT gpi Tracking ab Gutschrift + 009: Strukturierte Adressen in RltdPties/Dbtr/PstlAdr und Cdtr/PstlAdr + 009: Ntfctn/Itm/NtryDtls/TxDtls/RltdDts/AccptncDtTm: Akzeptanzzeitpunkt   → Für Instant: Zeitpunkt der Akzeptanz durch Empfänger-Bank (< 10 Sek. nach Einreichung) GEÄNDERT: ~ Sts: PDNG nun auch in camt.054 (für Echtzeit-Pending-Status bei Instant) SAP-Implikation: AccptncDtTm für SLA-Überwachung bei Instant; UETR für gpi-Tracking in Echtzeit  VERSION 001.001.10–11 (2021–2023) NEU: + 010: Proxy in RltdPties (Telefon/E-Mail als Empfängeradresse bei Instant) + 010: CxlRsnInf/Rsn/Cd: Stornierungsgrund (bei stornierter Echtzeit-Buchung) + 011: Ntfctn/Itm/ChrgsAmt: Gebühren in Echtzeit-Benachrichtigung + 011: RtrInf: Erweiterte Rückgabe-Felder für Instant Payment Returns   → RtrId: Eindeutige Rückgabe-ID   → OrgnlUETR: UETR der ursprünglichen Instant-Zahlung   → RtrChain: Vollständige Rückgabe-Kette GEÄNDERT: ~ RtrInf/Rsn/Cd: Neue Codes für Instant Returns:   - FOCR: Following Cancellation Request (nach Rückruf)   - ARDT: Already Returned   - CUST: Customer Decision (Empfänger lehnt Zahlung ab) SAP-Implikation: RtrId und OrgnlUETR für vollständige Rückgabe-Tracing bei Instant; ChrgsAmt für Echtzeit-Gebührenverbuchung

### Intraday-Kontoauszug_Liefert_untert_gige_Buchungsinformation

Intraday-Kontoauszug: Liefert untertägige Buchungsinformationen (vorläufige und endgültige Buchungen) ohne Tagesabschluss. Ermöglicht Real-Time Cash Visibility für Liquiditätssteuerung. Felder identisch zu camt.053; Unterschied: Bnkg/Stmt/Rpt/ElctrSeqNb fortlaufend je Abruf; Buchungen können als 'pending' markiert sein.

### Intraday-Kontoauszug_Liefert_untert_gige_Buchungsinformation

camt.052 ist eine Zwischenstandsmeldung Ihres Kontos während des Tages – bevor der offizielle Tagesauszug kommt. Wenn Sie wissen möchten ob eine Kundenzahlung schon heute Nachmittag eingegangen ist (und nicht erst morgen früh im Tagesauszug), nutzen Sie camt.052. Hilfreich für die Liquiditätsplanung: 'Wieviel Geld ist gerade auf dem Konto?'

### Bank_to_Customer_Statement_Tagesendauszug_mit_allen_endg_lti

Bank to Customer Statement: Tagesendauszug mit allen endgültigen Buchungen. Primärer Kontoauszug-Standard im SEPA-Raum; Nachfolger von MT940. Enthält strukturierte Buchungsdetails mit NtryDtls/TxDtls für automatisiertes Debitorenmatching. Saldo-Typen: OPBD (Opening Booked), CLBD (Closing Booked), CLAV (Closing Available), FWAV (Forward Available). Kritisch für BAM-Posting und automatisches Clearing in SAP.

### Bank_to_Customer_Statement_Tagesendauszug_mit_allen_endg_lti

camt.053 ist der offizielle Tagesauszug Ihres Bankkontos – das Äquivalent zum Kontoauszug den Sie früher per Post bekommen haben, jetzt aber als strukturierte Datei. SAP importiert diese Datei täglich und bucht alle Kontobewegungen automatisch. Das ermöglicht automatisches Zuordnen von Zahlungseingängen zu offenen Rechnungen.

### Sofortige_Einzel-Buchungsbenachrichtigung_bei_Belastung_oder

Sofortige Einzel-Buchungsbenachrichtigung bei Belastung oder Gutschrift – ohne auf Tagesauszug zu warten. Kritisch für Instant Payment Reconciliation und SDD-Rückgaben. Wird auch für Batch-Auflösung bei Sammelbuchungen genutzt (camt.054 enthält Einzeltransaktionen zu einer camt.053-Sammelbuchung).

### Sofortige_Einzel-Buchungsbenachrichtigung_bei_Belastung_oder

camt.054 ist eine sofortige Benachrichtigung wenn etwas auf Ihrem Konto gebucht wird – Sie müssen nicht bis zum nächsten Tagesauszug warten. Besonders wichtig für Instant Payments: Wenn ein Kunde per Sofortüberweisung bezahlt, kommt camt.054 innerhalb von Sekunden und SAP kann die Rechnung sofort als bezahlt markieren.

### Acct_Id_IBAN_Konto-IBAN_Bal_Salden_OpeningBooked_ClosingAvai

Acct/Id/IBAN: Konto-IBAN Bal: Salden (OpeningBooked, ClosingAvailable, ForwardAvailable) Ntry/Amt: Buchungsbetrag + Währung Ntry/CdtDbtInd: Gutschrift (CRDT) oder Belastung (DBIT) Ntry/BookgDt: Buchungsdatum Ntry/ValDt: Wertstellungsdatum Ntry/Sts: BOOK (gebucht) oder PDNG (vorläufig) Ntry/NtryDtls/TxDtls/RmtInf: Verwendungszweck Ntry/NtryDtls/TxDtls/EndToEndId: Referenz

### Stmt_Id_Auszugs-ID_Stmt_LglSeqNb_Fortlaufende_Auszugsnummer_

Stmt/Id: Auszugs-ID Stmt/LglSeqNb: Fortlaufende Auszugsnummer Stmt/FrToDt: Zeitraum des Auszugs Stmt/Acct/Id/IBAN: Konto-IBAN Stmt/Bal: Salden (OPBD, CLBD, CLAV, FWAV) Ntry/Amt + CdtDbtInd + BookgDt + ValDt Ntry/AcctSvcrRef: Bankreferenz der Buchung Ntry/BkTxCd: Bank Transaction Code (strukturiert: Domain/Family/SubFamily) NtryDtls/TxDtls/RmtInf/Ustrd: Verwendungszweck Freitext NtryDtls/TxDtls/RmtInf/Strd/CdtrRefInf: Strukturierte Referenz (Rechnungsnummer) NtryDtls/TxDtls/EndToEndId: End-to-End-Referenz NtryDtls/TxDtls/RltdPties: Beteiligte Parteien (Debtor/Creditor) NtryDtls/TxDtls/RltdDts/IntrBkSttlmDt: Interbankverrechnungsdatum

### Ntfctn_Id_Benachrichtigungs-ID_Ntfctn_Acct_Id_IBAN_Konto_Ntf

Ntfctn/Id: Benachrichtigungs-ID Ntfctn/Acct/Id/IBAN: Konto Ntfctn/Itm/Amt + CdtDbtInd Ntfctn/Itm/BookgDt + ValDt Ntfctn/Itm/NtryDtls/TxDtls: Transaktionsdetails (identisch camt.053) Ntfctn/Itm/AcctSvcrRef: Bankreferenz

### 1_PDNG-Buchungen_in_BAM-Positivsaldo_eingerechnet_Liquidit_t

1) PDNG-Buchungen in BAM-Positivsaldo eingerechnet → Liquiditätsposition überschätzt 2) ElctrSeqNb-Lücken: Wenn eine Nachricht verloren geht, fehlen Buchungen → kein automatischer Re-request 3) Zeitstempel-Interpretation: BookgDt vs. ValDt unterschiedlich → Wertstellungsdatum für Zinsberechnung relevant 4) Mehrfachabruf: Gleiche Buchung erscheint in mehreren camt.052-Abrufen → Doppelbuchung wenn nicht dedupliziert

### 1_PDNG-Buchungen_in_BAM-Positivsaldo_eingerechnet_Liquidit_t

1) VORLÄUFIGE BUCHUNGEN EINGERECHNET: Eine Zahlung steht als 'vorläufig' auf dem Konto, ist aber noch nicht endgültig gebucht. Wenn das System das nicht erkennt, denkt es es hat mehr Geld als wirklich da ist. 2) NACHRICHTEN FEHLEN: Wenn eine Zwischenstandsmeldung verloren geht, fehlen Buchungen im System – ohne dass jemand es merkt. 3) GLEICHE BUCHUNG ZWEIMAL: Der Zwischenstand wird mehrfach abgerufen und enthält die gleiche Buchung mehrmals. Das System bucht sie doppelt.

### 1_BAM-Buchungsregeln_Posting_Rules_nicht_auf_camt_053_angepa

1) BAM-Buchungsregeln (Posting Rules) nicht auf camt.053 angepasst nach Migration von MT940 → alle Buchungen landen in Klärungskonto 2) BkTxCd nicht in Buchungsregel gemappt → unbekannte Transaktionstypen erzeugen manuelle Klärungsaufgaben 3) LglSeqNb-Lücke: Auszugsnummer nicht fortlaufend → Buchungslücke unbemerkt 4) Mehrere NtryDtls pro Ntry: SAP verarbeitet nur erste TxDtls → Sammelbuchungen teilweise nicht aufgelöst 5) ValDt ≠ BookgDt: Für Zinsberechnungen und Valuta-Matching relevant; unterschiedliche Interpretation je BAM-Konfiguration

### 1_BAM-Buchungsregeln_Posting_Rules_nicht_auf_camt_053_angepa

1) ALTE BUCHUNGSREGELN: Wenn SAP vorher MT940-Dateien bekommen hat und jetzt auf camt.053 umgestellt wird, passen die alten Buchungsregeln nicht mehr. Alle Buchungen landen auf einem Klärungskonto und müssen manuell bearbeitet werden. 2) UNBEKANNTE BUCHUNGSARTEN: Die Bank schickt einen Buchungstyp-Code den SAP nicht kennt. SAP weiß nicht was es damit machen soll. 3) SAMMELBUCHUNGEN NICHT AUFGELÖST: Eine Buchung im Auszug enthält 50 Einzelzahlungen. SAP verarbeitet nur die erste und ignoriert den Rest. 4) AUSZUGSNUMMERN-LÜCKE: Ein Tagesauszug fehlt. SAP merkt es nicht und die fehlenden Buchungen werden nie gebucht.

### 1_Doppelbuchung_camt_054_camt_053_beide_verarbeitet_Buchung_

1) Doppelbuchung: camt.054 + camt.053 beide verarbeitet → Buchung doppelt wenn Posting Rules nicht deduplizieren 2) Async-Verarbeitung: camt.054 kommt vor camt.053 aber SAP-Batch läuft nur nachts → Instant-Reconciliation-Vorteil verpufft 3) SDD-Rückgaben (R-Transactions): kommen als camt.054 → müssen als Rückgabe-Buchung (nicht als neue Zahlung) verarbeitet werden

### 1_Doppelbuchung_camt_054_camt_053_beide_verarbeitet_Buchung_

1) DOPPELT GEBUCHT: Die Sofortbenachrichtigung (camt.054) und der Tagesauszug (camt.053) enthalten beide die gleiche Buchung. SAP bucht sie zweimal wenn es nicht richtig konfiguriert ist. 2) KEIN ECHTZEIT-VORTEIL: camt.054 kommt sofort, aber SAP verarbeitet es erst nachts im Batch-Lauf. Der Vorteil der Sofortbenachrichtigung geht verloren. 3) RÜCKGEBUCHTE LASTSCHRIFTEN: Wenn ein Kunde eine Lastschrift zurückbucht, kommt das als camt.054. Das muss als Rückbuchung behandelt werden, nicht als neue Zahlung.

### BAM_Transaktion_FF_5_camt_052_Import_und_Verarbeitung_Postin

BAM Transaktion FF_5: camt.052 Import und Verarbeitung Posting Rules: Separate Rules für PDNG vs. BOOK SAP Cash Management: camt.052 als Basis für Intraday Liquidity Monitoring EBICS-Auftragsart: C52 (camt.052 Abruf)

### BAM_Transaktion_FF_5_camt_052_Import_und_Verarbeitung_Postin

In SAP gibt es einen Bereich (BAM – Bank Account Management) der die Kontostandsmeldungen der Bank verarbeitet. Der Zwischenstand camt.052 wird dort importiert und zeigt den aktuellen Kontostand im Laufe des Tages.  Das muss konfiguriert sein, damit SAP weiß: • Wie oft soll der Zwischenstand abgerufen werden? • Wie sollen vorläufige Buchungen behandelt werden? • Welche Buchungsregeln gelten für eingehende Zahlungen?

### Transaktion_FF_5_Elektronischer_Kontoauszug_Import_FEBAN_Kon

Transaktion FF_5: Elektronischer Kontoauszug Import FEBAN: Kontoauszug-Monitor und manuelle Zuordnung Posting Rules Customizing: T-Code OT83/SPRO BkTxCd → SAP Posting Rule Mapping RmtInf/Strd/CdtrRefInf → BELNR-Matching für auto. Clearing EBICS-Auftragsart: C53 (camt.053 Abruf) MT940 parallel: Übergangsweise via SWIFT MT940→camt.053-Konverter

### Transaktion_FF_5_Elektronischer_Kontoauszug_Import_FEBAN_Kon

SAP importiert den Tagesauszug täglich (meist nachts) und versucht, jede Buchung einer offenen Rechnung zuzuordnen.  Damit das funktioniert, muss SAP wissen: • Welche Buchungsart bedeutet was? (z.B. 'SEPA-Eingang' → Buchungsregel A) • Welche Referenznummer im Auszug entspricht welcher Rechnung? • Was soll passieren wenn keine Zuordnung möglich ist?  Diese Regeln müssen einmalig konfiguriert werden – und nach jeder Formatumstellung neu.

### BAM_Separate_Posting_Rules_f_r_camt_054_Echtzeit_vs_camt_053

BAM: Separate Posting Rules für camt.054 (Echtzeit) vs. camt.053 (Batch) Deduplizierungs-Flag: AcctSvcrRef als Eindeutigkeitsschlüssel SDD R-Transaction: BkTxCd PMNT/IRCT → Rückbuchungsregel Instant: BookgDt+ValDt identisch + BkTxCd PMNT/ICDT → Instant-Eingang

### BAM_Separate_Posting_Rules_f_r_camt_054_Echtzeit_vs_camt_053

SAP muss zwei Dinge wissen: 1. Wenn camt.054 kommt und später der gleiche Buchung in camt.053 nochmal erscheint – nur einmal buchen. 2. Wenn camt.054 eine zurückgebuchte Lastschrift enthält – als Rückbuchung behandeln, nicht als neuen Eingang.  Beides muss explizit konfiguriert sein.

### 1_Kein_PDNG-Handling_Buchungsregeln_nur_f_r_BOOK-Status_PDNG

1) Kein PDNG-Handling: Buchungsregeln nur für BOOK-Status → PDNG-Buchungen erzeugen offene Posten die sich nie schließen 2) Kein Intraday-Abruf-Schedule: camt.052 wird nur einmal täglich abgerufen → kein Vorteil gegenüber camt.053 3) Saldo-Typ falsch: ClosingAvailable statt InterimAvailable für Intraday-Saldo → falsche Liquiditätsposition

### 1_Kein_PDNG-Handling_Buchungsregeln_nur_f_r_BOOK-Status_PDNG

1) NUR EINMAL AM TAG: camt.052 wird nur morgens abgerufen. Dann hat man den Intraday-Vorteil nicht. 2) VORLÄUFIGE BUCHUNGEN VERURSACHEN PROBLEME: Das System hat keine Regel wie es mit vorläufigen Buchungen umgehen soll – es entstehen Buchungen die nie abgeschlossen werden. 3) FALSCHER SALDO: Das System liest den falschen Saldo-Typ und zeigt einen anderen Kontostand als der tatsächliche.

### 1_MT940_camt_053-Migration_ohne_Posting-Rule-Review_nahezu_a

1) MT940→camt.053-Migration ohne Posting-Rule-Review → nahezu alle Buchungen in Ausnahme 2) BkTxCd-Varianz zwischen Banken: jede Bank nutzt eigene Domain/Family/SubFamily-Codes → individuelles Mapping pro Bank nötig 3) Sammelbuchungs-Handling (batch booking): NbOfTxs > 1 in einer Ntry → SAP Standard nur erste TxDtls → Add-On oder Custom-Coding nötig

### 1_MT940_camt_053-Migration_ohne_Posting-Rule-Review_nahezu_a

1) FORMAT-UMSTELLUNG OHNE ANPASSUNG DER REGELN: Die Bank schickt jetzt camt.053, SAP hat aber noch die alten Regeln für MT940. Alles landet im Klärungsstapel – manuelle Arbeit explodiert. 2) JEDE BANK ANDERS: Bank A und Bank B nutzen unterschiedliche Buchungstyp-Codes für die gleiche Art Transaktion. Die Regeln müssen für jede Bank separat eingestellt werden. 3) STAPELZAHLUNGEN: Eine Buchung im Auszug enthält 100 Einzelzahlungen zusammengefasst. SAP kann nur die erste lesen und ordnet die anderen nicht zu.

### 1_Keine_Deduplizierung_zwischen_camt_054_und_camt_053_Doppel

1) Keine Deduplizierung zwischen camt.054 und camt.053 → Doppelbuchungen bei allen Real-Time-Buchungen 2) Kein Echtzeit-Processing-Schedule → camt.054 Vorteil nicht genutzt 3) R-Transaction-Erkennung fehlt → SDD-Rückgaben als normale Gutschriften gebucht

### 1_Keine_Deduplizierung_zwischen_camt_054_und_camt_053_Doppel

1) ALLES DOPPELT: camt.054 wird aktiviert ohne zu konfigurieren, dass camt.053 die gleichen Buchungen nicht nochmal bucht. Ergebnis: alle Buchungen doppelt. 2) KEIN ECHTZEITBETRIEB: camt.054 wird zwar empfangen, aber erst am nächsten Morgen verarbeitet. Kein Unterschied zu camt.053. 3) RÜCKBUCHUNGEN FALSCH BEHANDELT: Eine zurückgebuchte Lastschrift erscheint als neue Gutschrift – das Konto stimmt nicht mehr.

## SWIFT Legacy – MT-Nachrichten

### IDENTIFIKATION & VERSIONEN

| Format-Name | Nachrichtentyp | Familie / Standard | Aktuelle Version | Versionshistorie (alle Versionen + Änderungen) |
| --- | --- | --- | --- | --- |
| MT103 | Single Customer Credit Transfer (SWIFT Legacy) | SWIFT Legacy – MT-Nachrichten | MT103 (kein Versionssystem; Final Version vor Sunset) | → [Details unten: MT103_Versionshistorie_alle_Versionen_nderungen_] |
| MT940 | Customer Statement Message (SWIFT Legacy Kontoauszug) | SWIFT Legacy – MT-Nachrichten | MT940 (Final Version vor Sunset) | → [Details unten: MT940_Versionshistorie_alle_Versionen_nderungen_] |

### BESCHREIBUNG

| Zweck & Verwendung (Experte) | Zweck & Verwendung (Einsteiger) |
| --- | --- |
| → [Details unten: SWIFT-Standardformat_f_r_grenz_berschreitende_Einzel_berweis] | → [Details unten: SWIFT-Standardformat_f_r_grenz_berschreitende_Einzel_berweis] |
| → [Details unten: SWIFT_Legacy-Kontoauszugsformat_Zeilenbasiertes_Freitextform] | → [Details unten: SWIFT_Legacy-Kontoauszugsformat_Zeilenbasiertes_Freitextform] |

### TECHNISCHE DETAILS

| Wichtige Felder (technisch) | Pflichtfelder | Datenrichtung |
| --- | --- | --- |
| → [Details unten: _20_Transaktionsreferenz_max_16_Zeichen_23B_Bankdienstleistu] | Pflicht: • :20: Referenz • :23B: Dienstleistungstyp • :32A: Datum/Währung/Betrag • :50K: Auftraggeber • :59: Empfänger • :71A: Gebühren | Corporate → Bank → Korrespondenzbanken → Empfänger-Bank (Ausgehend; Kettenprinzip) |
| → [Details unten: _20_Transaktionsreferenz_25_Kontonummer_IBAN_oder_national_2] | Pflicht: • :25: Konto • :28C: Auszugsnummer • :60F: Eröffnungssaldo • :62F: Schlusssaldo • :61: je Buchung | Bank → Corporate (Täglich, Tagesende; eingehend) |

### SAP-RELEVANZ

| SAP-Relevanz (Bereich) |
| --- |
| BCM (SWIFT-Kanal) DMEE (SWIFT_MT103) AP Auslandszahlungen FX Zahlungen |
| BAM (FF_5 Import) Electronic Bank Statement AP/AR Buchungslogik |

### PFLICHTFELDER & FEHLERQUELLEN

| Typische Fehlerquellen (Experte) | Typische Fehlerquellen (Einsteiger) |
| --- | --- |
| → [Details unten: 1_Feldl_ngen-_berschreitung_50K_59_max_4_35_Zeichen_bei_lang] | → [Details unten: 1_Feldl_ngen-_berschreitung_50K_59_max_4_35_Zeichen_bei_lang] |
| → [Details unten: 1_86_-Parsing_bankindividuell_Deutsche_Bank_86_anders_als_Co] | → [Details unten: 1_86_-Parsing_bankindividuell_Deutsche_Bank_86_anders_als_Co] |

### SAP-MAPPING

| SAP-Mapping (Experte) | SAP-Mapping (Einsteiger) |
| --- | --- |
| → [Details unten: DMEE_SWIFT_MT103_oder_SWIFT_MT103_PLUS_BCM_Kanal_SWIFT_FIN_F] | → [Details unten: DMEE_SWIFT_MT103_oder_SWIFT_MT103_PLUS_BCM_Kanal_SWIFT_FIN_F] |
| → [Details unten: Transaktion_FF_5_MT940-Import_Note_to_Payee_Parsing_Bankspez] | → [Details unten: Transaktion_FF_5_MT940-Import_Note_to_Payee_Parsing_Bankspez] |

### TYPISCHE FEHLER

| Häufige Projektfehler (Experte) | Häufige Projektfehler (Einsteiger) |
| --- | --- |
| → [Details unten: 1_Migration_auf_MX_nicht_geplant_Nov_2025_Deadline_bersehen_] | → [Details unten: 1_Migration_auf_MX_nicht_geplant_Nov_2025_Deadline_bersehen_] |
| → [Details unten: 1_MT940-Parsing-Regeln_f_r_neue_Bank_nicht_erstellt_alle_Buc] | → [Details unten: 1_MT940-Parsing-Regeln_f_r_neue_Bank_nicht_erstellt_alle_Buc] |

### STATUS / ABLÖSUNG

| Status / Ablösung |
| --- |
| SUNSET: November 2025 Nachfolger: pain.001.001.09 (SWIFT MX) Handlungsbedarf jetzt! |
| SUNSET über SWIFT: November 2025 Nachfolger: camt.053 (Tagesauszug) / camt.052 (Intraday) EBICS: MT940 ggf. auch nach 2025 noch verfügbar – Neuverträge auf camt.053 |

### MT103_Versionshistorie_alle_Versionen_nderungen_

1970er: Erste MT-Formate im SWIFT-Netzwerk MT103 (Standard): Einzelüberweisung; Pflichtformat für grenzüberschreitende Kundenzahlungen MT103+ (STP): Straight-Through-Processing-Variante mit strengeren Feldregeln für automatisierte Verarbeitung MT103 REMIT: Erweiterte Version mit strukturierten Remittance-Daten (bis 9.000 Zeichen) – kaum genutzt 2019: SWIFT gpi (global payment innovation) – MT103 mit gpi-Header für Tracking Nov. 2025: SWIFT MT-Sunset – MT103 wird abgeschaltet und durch pain.001.001.09+ (MX) ersetzt

### MT940_Versionshistorie_alle_Versionen_nderungen_

1970er: Erste Version im SWIFT-Netzwerk MT940: Tagesendauszug; Standard seit Jahrzehnten MT942: Intraday-Variante (entspricht camt.052) MT941: Saldorückmeldung (selten genutzt) Nov. 2025: SWIFT MT-Sunset – MT940/MT942 werden durch camt.053/camt.052 ersetzt Für Non-SWIFT-Verbindungen (EBICS): MT940 wird von manchen Banken über EBICS weiterhin angeboten auch nach SWIFT-Sunset – aber Neuverträge sollten auf camt.053 gesetzt werden

### SWIFT-Standardformat_f_r_grenz_berschreitende_Einzel_berweis

SWIFT-Standardformat für grenzüberschreitende Einzelüberweisungen in Fremdwährung (non-SEPA). Strukturiertes Freitextformat (Tags: :20:, :32A:, :50K:, :59:, :70:, :71A:). Kein XML – zeilenbasiertes Format mit max. 35 Zeichen pro Feld. MT103+ für STP-Verarbeitung. Wird durch pain.001.001.09 (SWIFT MX) im November 2025 vollständig abgelöst. Noch heute Standard für USD, GBP, JPY, CHF-Zahlungen außerhalb SEPA.

### SWIFT-Standardformat_f_r_grenz_berschreitende_Einzel_berweis

MT103 ist das alte SWIFT-Format für internationale Zahlungen – so wie ein Fax im Vergleich zu einer modernen E-Mail. Es ist nicht XML-basiert sondern besteht aus Textzeilen mit Codes. Wenn Ihr Unternehmen in US-Dollar, britischem Pfund oder anderen Währungen außerhalb des SEPA-Raums zahlt, nutzt es wahrscheinlich noch MT103. Aber: Das Format wird im November 2025 abgeschaltet.

### SWIFT_Legacy-Kontoauszugsformat_Zeilenbasiertes_Freitextform

SWIFT Legacy-Kontoauszugsformat. Zeilenbasiertes Freitextformat. Tags: :20: (Referenz), :25: (Konto), :28C: (Auszugsnummer), :60F/M: (Eröffnungssaldo), :61: (Buchungszeile), :86: (Buchungsdetail-Freitext), :62F/M: (Schlusssaldo), :64: (verfügbarer Saldo). :86:-Feld bankindividuell formatiert – kein Standard; jede Bank hat eigenes :86:-Format → individuelle BAM-Parsing-Logik erforderlich.

### SWIFT_Legacy-Kontoauszugsformat_Zeilenbasiertes_Freitextform

MT940 ist der alte SWIFT-Tagesauszug – das was SAP bisher täglich von den Banken bekommen hat um Buchungen zu buchen. Das Format ist wie ein alter Faxtext: nicht strukturiert, jede Bank formatiert es ein bisschen anders. Der Nachfolger ist camt.053, das strukturierter und informativer ist. MT940 wird im November 2025 abgeschaltet.

### _20_Transaktionsreferenz_max_16_Zeichen_23B_Bankdienstleistu

:20: Transaktionsreferenz (max. 16 Zeichen) :23B: Bankdienstleistungstyp (CRED) :32A: Wertstellungsdatum + Währung + Betrag :50K/50F: Auftraggeber (Name + Adresse, max. 4×35 Zeichen) :52A/52D: Auftraggeber-Bank (BIC oder Name) :53B: Abrechnungskonto :56A/56D: Intermediary Bank (Korrespondenzbank) :57A/57D: Empfänger-Bank (BIC oder Name) :59/59A: Empfänger (Name + IBAN oder Kontonummer) :70: Verwendungszweck (max. 4×35 Zeichen = 140 Zeichen) :71A: Gebührenregelung (OUR/SHA/BEN) :72: Bank-zu-Bank-Informationen

### _20_Transaktionsreferenz_25_Kontonummer_IBAN_oder_national_2

:20: Transaktionsreferenz :25: Kontonummer (IBAN oder national) :28C: Auszugsnummer/Folgenummer :60F: Eröffnungssaldo (Datum + Währung + Betrag) :61: Buchungszeile (Datum/ValDt/Betrag/Referenz) :86: Buchungsdetails (bankindividuelles Freiformat) :62F: Schlusssaldo :64: Verfügbarer Saldo :65: Vorgemerkte Buchungen

### 1_Feldl_ngen-_berschreitung_50K_59_max_4_35_Zeichen_bei_lang

1) Feldlängen-Überschreitung: :50K/:59: max. 4×35 Zeichen → bei langen Firmennamen/Adressen Abschneidung → OFAC-Matching schlägt fehl 2) Zeichensatz: MT103 unterstützt nur SWIFT-Zeichensatz (keine Umlaute ä/ö/ü, keine €) → automatische Konvertierung nötig 3) :71A: OUR statt SHA: Bei OUR trägt Auftraggeber alle Gebühren; bei SHA teilen sich beide – falsch gesetzt führt zu falschen Gebührenbelastungen 4) Intermediary Bank fehlt: Zahlung nach APAC/LATAM ohne Korrespondenzbank → wird von Empfänger-Bank abgewiesen 5) Cover Payment (MT202COV): Bei bestimmten Währungen/Korridoren muss Cover Payment separat gesendet werden – fehlt häufig

### 1_Feldl_ngen-_berschreitung_50K_59_max_4_35_Zeichen_bei_lang

1) FIRMENNAME ZU LANG: MT103 erlaubt nur 35 Zeichen pro Zeile. Langer Firmenname wird abgeschnitten. Bei Sicherheitsprüfungen durch amerikanische Banken (OFAC) kann das zur Ablehnung führen. 2) KEINE UMLAUTE ERLAUBT: Das Format unterstützt keine deutschen Umlaute (ä, ö, ü). Diese werden automatisch umgewandelt (ae, oe, ue) oder führen zu Fehlern. 3) GEBÜHRENREGELUNG FALSCH: Es gibt verschiedene Optionen wer die Bankgebühren trägt. Die falsche Einstellung führt zu unerwarteten Gebühren auf Ihrem Konto. 4) FORMAT WIRD ABGESCHALTET: Ab November 2025 funktioniert MT103 nicht mehr für internationale Zahlungen.

### 1_86_-Parsing_bankindividuell_Deutsche_Bank_86_anders_als_Co

1) :86:-Parsing bankindividuell: Deutsche Bank :86: anders als Commerzbank :86: anders als Intesa Sanpaolo :86: → eigenes Parsing je Bank 2) Zeichensatz-Limitierung: Keine Sonderzeichen; Umlaute werden als ? oder als ae/oe/ue übertragen 3) Referenz in :61: nur 16 Zeichen → End-to-End-Referenz wird abgeschnitten → Matching-Fehler in SAP 4) :28C:-Lücken: Fehlende Auszugsnummern werden von SAP nicht automatisch erkannt

### 1_86_-Parsing_bankindividuell_Deutsche_Bank_86_anders_als_Co

1) JEDE BANK ANDERS: Das Freitextfeld :86: in MT940 wird von jeder Bank anders befüllt. SAP braucht für jede Bank eine eigene Erkennungsregel. 2) KEINE UMLAUTE: Umlaute werden als Fragezeichen oder als 'ae/oe/ue' übertragen – das macht automatisches Matching schwieriger. 3) REFERENZ ABGESCHNITTEN: Die Referenznummer wird auf 16 Zeichen beschränkt. Längere Referenzen werden abgeschnitten – SAP kann die Zahlung keiner Rechnung zuordnen. 4) FORMAT WIRD ABGESCHALTET: Über SWIFT-Verbindungen wird MT940 im November 2025 abgeschaltet.

### DMEE_SWIFT_MT103_oder_SWIFT_MT103_PLUS_BCM_Kanal_SWIFT_FIN_F

DMEE: SWIFT_MT103 oder SWIFT_MT103_PLUS BCM Kanal: SWIFT FIN (FileAct oder FIN-Einzelnachricht) Zeichensatz-Konvertierung: SAP DMEE-Customizing Sonderzeichen-Mapping :50K: Dbtr aus T001 (Buchungskreis-Adresse) :59: Cdtr aus LFA1/LFB1 + LFBK (Kontonummer/IBAN) :70: SGTXT Buchungstext (max. 140 Z., 4×35) :71A: Konfigurierbar per Zahlungsweg in FBZP

### DMEE_SWIFT_MT103_oder_SWIFT_MT103_PLUS_BCM_Kanal_SWIFT_FIN_F

SAP hat eine Konfiguration (DMEE) die den MT103-Text zusammenbaut: • Ihren Firmennamen und Adresse → aus den SAP-Firmenstammdaten • Lieferantenname und Kontonummer → aus dem Lieferantenstamm • Betrag und Währung → aus der Rechnung • Verwendungszweck → aus dem Buchungstext  Wichtig: Ab November 2025 muss diese Konfiguration auf das neue ISO 20022 (pain.001.001.09) umgestellt werden.

### Transaktion_FF_5_MT940-Import_Note_to_Payee_Parsing_Bankspez

Transaktion FF_5: MT940-Import Note to Payee Parsing: Bankspezifisches :86:-Parsing via Konfiguration EBICS-Auftragsart: STA (MT940) / VMK (MT942) Parallel-Nutzung: MT940 über EBICS kann auch nach SWIFT-Sunset weiterhin von manchen Banken angeboten werden

### Transaktion_FF_5_MT940-Import_Note_to_Payee_Parsing_Bankspez

SAP importiert den MT940-Tagesauszug und versucht jede Buchung einer offenen Rechnung zuzuordnen.  Das Problem mit MT940: Jede Bank formatiert den Detailbereich anders. SAP braucht deshalb für jede Bank eine separate Erkennungsregel. Das ist aufwändig und fehleranfällig.  Deshalb empfehlen wir: Auf camt.053 umstellen – das ist standardisierter und einfacher zu verarbeiten.

### 1_Migration_auf_MX_nicht_geplant_Nov_2025_Deadline_bersehen_

1) Migration auf MX nicht geplant: Nov. 2025 Deadline übersehen → ab Sunset kein grenzüberschreitender SWIFT-Zahlungsverkehr mehr möglich 2) Zeichensatz-Mapping fehlt: Umlaute in SAP-Stammdaten führen zu Reject-Nachrichten von SWIFT 3) :50K-Feld zu lang: Buchungskreis-Adresse in SAP nicht auf 4×35 Zeichen optimiert → automatisches Abschneiden verfälscht OFAC-relevante Daten

### 1_Migration_auf_MX_nicht_geplant_Nov_2025_Deadline_bersehen_

1) NOVEMBER 2025 VERGESSEN: Das ist der häufigste und teuerste Fehler. Niemand plant die Migration auf das neue Format. Ab November 2025 können keine internationalen Zahlungen mehr gesendet werden. 2) UMLAUTE MACHEN PROBLEME: Deutsche Firmennamen mit Umlauten werden in MT103 falsch übertragen. Das kann bei Sicherheitsprüfungen zu Ablehnungen führen. 3) ADRESSE ZU LANG: Wenn Ihre Firmenadresse zu lang ist, wird sie abgeschnitten. Das sieht niemand – bis eine amerikanische Bank die Zahlung wegen unvollständiger Absenderdaten stoppt.

### 1_MT940-Parsing-Regeln_f_r_neue_Bank_nicht_erstellt_alle_Buc

1) MT940-Parsing-Regeln für neue Bank nicht erstellt → alle Buchungen in Klärungskonto 2) Keine Migration auf camt.053 geplant vor SWIFT-Sunset → ab Nov. 2025 kein Auszugsempfang mehr über SWIFT 3) Auszugsnummer-Lücken unbemerkt: Fehlendes MT940 für einen Tag → Buchungslücke in SAP

### 1_MT940-Parsing-Regeln_f_r_neue_Bank_nicht_erstellt_alle_Buc

1) NEUE BANK, NEUE REGELN: Eine neue Bank wird angebunden und niemand erstellt die SAP-Parsing-Regeln für deren MT940-Format. Alle Buchungen landen auf einem Klärungskonto. 2) NOVEMBER 2025 VERGESSEN: Über SWIFT-Verbindungen kommen nach November 2025 keine MT940-Dateien mehr an. Wer nicht auf camt.053 umstellt, hat keinen Tagesauszug mehr. 3) FEHLENDE TAGE UNBEMERKT: Wenn ein MT940 für einen Tag fehlt, bucht SAP einfach nichts – ohne Warnung.

## ISO 20022 – pacs (Interbank-Clearing)

### IDENTIFIKATION & VERSIONEN

| Format-Name | Nachrichtentyp | Familie / Standard | Aktuelle Version | Versionshistorie (alle Versionen + Änderungen) |
| --- | --- | --- | --- | --- |
| pacs.008 | FI to FI Customer Credit Transfer | ISO 20022 – pacs (Interbank-Clearing) | pacs.008.001.11 (2023) | → [Details unten: pacs_008_Versionshistorie_alle_Versionen_nderungen_] |

### BESCHREIBUNG

| Zweck & Verwendung (Experte) | Zweck & Verwendung (Einsteiger) |
| --- | --- |
| → [Details unten: Interbank-Nachricht_zwischen_Finanzinstituten_f_r_Kundenzahl] | → [Details unten: Interbank-Nachricht_zwischen_Finanzinstituten_f_r_Kundenzahl] |

### TECHNISCHE DETAILS

| Wichtige Felder (technisch) | Pflichtfelder | Datenrichtung |
| --- | --- | --- |
| → [Details unten: GrpHdr_MsgId_CreDtTm_NbOfTxs_GrpHdr_SttlmInf_SttlmMtd_Abrech] | Pflicht: • UETR (SWIFT gpi) • IntrBkSttlmAmt • IntrBkSttlmDt • Dbtr/Nm • Cdtr/Nm + IBAN | Bank → Clearing-System → Empfänger-Bank (Interbank; Corporate sieht das nicht direkt) |

### SAP-RELEVANZ

| SAP-Relevanz (Bereich) |
| --- |
| SWIFT gpi Tracking Zahlungsnachverfolgung (TMS) Exception Handling bei SWIFT-Delays |

### PFLICHTFELDER & FEHLERQUELLEN

| Typische Fehlerquellen (Experte) | Typische Fehlerquellen (Einsteiger) |
| --- | --- |
| → [Details unten: 1_Datenverlust_bei_pain_001_pacs_008-Transformation_Adressfe] | → [Details unten: 1_Datenverlust_bei_pain_001_pacs_008-Transformation_Adressfe] |

### SAP-MAPPING

| SAP-Mapping (Experte) | SAP-Mapping (Einsteiger) |
| --- | --- |
| Nicht direkt in SAP genutzt Relevant für SWIFT gpi Status-Tracking UETR erscheint in camt.053/054 AcctSvcrRef | → [Details unten: Nicht_direkt_in_SAP_genutzt_Relevant_f_r_SWIFT_gpi_Status-Tr] |

### TYPISCHE FEHLER

| Häufige Projektfehler (Experte) | Häufige Projektfehler (Einsteiger) |
| --- | --- |
| → [Details unten: 1_SWIFT_gpi_nicht_aktiviert_UETR_wird_nicht_genutzt_keine_Za] | → [Details unten: 1_SWIFT_gpi_nicht_aktiviert_UETR_wird_nicht_genutzt_keine_Za] |

### STATUS / ABLÖSUNG

| Status / Ablösung |
| --- |
| Aktiv; Standard für Interbank-Clearing Keine Abschaltung – ersetzt MT202/MT103 im Interbank-Bereich |

### pacs_008_Versionshistorie_alle_Versionen_nderungen_

001.001.01 (2008): Erste Version für Interbank-Clearing 001.001.02–06: Erweiterungen für SEPA SCT und TARGET2 001.001.07 (2018): SWIFT gpi Integration 001.001.08 (2019): SWIFT MX Standard; strukturierte Adresse 001.001.09–11 (2020–2023): Erweiterungen Instant, Proxy, LEI

### Interbank-Nachricht_zwischen_Finanzinstituten_f_r_Kundenzahl

Interbank-Nachricht zwischen Finanzinstituten für Kundenzahlungen im Clearing. Nicht vom Corporate direkt genutzt – wird von der Auftraggeber-Bank an das Clearing-System (STEP2, TARGET2) und zur Empfänger-Bank gesendet. Enthält pain.001-Daten transformiert für Interbank-Format. Für Corporates relevant: End-to-End-Tracking (SWIFT gpi UETR-Feld) und Transparenz über Zahlungsweg.

### Interbank-Nachricht_zwischen_Finanzinstituten_f_r_Kundenzahl

pacs.008 ist eine Nachricht die nicht Ihr Unternehmen sendet, sondern Ihre Bank – an das Zahlungssystem und an die Empfänger-Bank. Wenn Sie eine Überweisung schicken, wandelt Ihre Bank Ihre pain.001-Datei in pacs.008 um und sendet sie ins Bankennetzwerk. Als Unternehmen bekommen Sie pacs.008 in der Regel nicht zu sehen – aber es ist gut zu wissen dass es existiert, besonders für Zahlungsnachverfolgung.

### GrpHdr_MsgId_CreDtTm_NbOfTxs_GrpHdr_SttlmInf_SttlmMtd_Abrech

GrpHdr/MsgId, CreDtTm, NbOfTxs GrpHdr/SttlmInf/SttlmMtd: Abrechnungsmethode (CLRG/INDA) CdtTrfTxInf/PmtId/UETR: Unique End-to-End Transaction Reference (SWIFT gpi Tracking-ID) CdtTrfTxInf/IntrBkSttlmAmt: Interbankbetrag CdtTrfTxInf/IntrBkSttlmDt: Interbank-Verrechnungsdatum CdtTrfTxInf/Dbtr/Nm + PstlAdr (aus pain.001 übernommen) CdtTrfTxInf/Cdtr/Nm + PstlAdr CdtTrfTxInf/RmtInf: Verwendungszweck

### 1_Datenverlust_bei_pain_001_pacs_008-Transformation_Adressfe

1) Datenverlust bei pain.001 → pacs.008-Transformation: Adressfelder werden bei Freitext abgeschnitten 2) UETR nicht in camt.053/054 zurückgemeldet: SWIFT gpi Tracking nicht möglich wenn Bank UETR nicht ins Kontoauszugsformat überträgt 3) IntrBkSttlmDt bei Feiertagen: Automatische Verschiebung durch Clearing-System → Corporate erwartet ValDt anders

### 1_Datenverlust_bei_pain_001_pacs_008-Transformation_Adressfe

1) INFORMATIONEN GEHEN VERLOREN: Beim Umwandeln Ihrer Zahlungsdatei in das Interbank-Format können Informationen abgeschnitten werden – besonders bei langen Adressen. 2) TRACKING FUNKTIONIERT NICHT: Jede internationale Zahlung hat eine eindeutige Tracking-ID (UETR). Wenn diese nicht korrekt weitergegeben wird, können Sie die Zahlung nicht nachverfolgen. 3) FEIERTAGS-VERSCHIEBUNG: Das Verrechnungsdatum kann sich wegen Feiertagen verschieben – Ihr Lieferant bekommt das Geld später als erwartet.

### Nicht_direkt_in_SAP_genutzt_Relevant_f_r_SWIFT_gpi_Status-Tr

pacs.008 ist die 'Sprache' zwischen den Banken. Als Unternehmen konfigurieren Sie das nicht selbst.  Was für Sie relevant ist: Die UETR-Tracking-ID – damit können Sie bei der Bank nachfragen wo eine internationale Zahlung gerade ist.

### 1_SWIFT_gpi_nicht_aktiviert_UETR_wird_nicht_genutzt_keine_Za

1) SWIFT gpi nicht aktiviert: UETR wird nicht genutzt → keine Zahlungsnachverfolgung bei Delays 2) pain.001-Adressfelder zu lang: pacs.008-Transformation schneidet ab → OFAC-Matching-Fehler bei US-Korrespondenzbank

### 1_SWIFT_gpi_nicht_aktiviert_UETR_wird_nicht_genutzt_keine_Za

1) TRACKING NICHT EINGERICHTET: Wenn Ihre Bank SWIFT gpi nicht aktiviert hat, können Sie den Status einer internationalen Zahlung nicht nachverfolgen. Bei Problemen müssen Sie blind warten. 2) ADRESSE ZU LANG: Wenn Ihre Firmenadresse zu lang für das Format ist, wird sie abgeschnitten. Das kann bei Sicherheitsprüfungen zu Ablehnungen führen.