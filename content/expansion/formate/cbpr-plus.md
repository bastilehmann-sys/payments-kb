---
format_name: CBPR+
aktuelle_version: "pacs.008.001.08 (2023)"
nachrichtentyp: Cross-Border Payments and Reporting Plus — FI to FI Customer Credit Transfer
familie_standard: ISO 20022 / pacs / SWIFT CBPR+
datenrichtung: Ausgehend + Eingehend (Interbank Korrespondenzbanken, über SWIFT)
sap_relevanz: SAP S/4HANA Treasury / SWIFT Alliance / Bank Communication Manager
status: Aktiv — Pflichtstandard für SWIFT-Korrespondenzbanken ab November 2025
---

# CBPR+ — Cross-Border Payments and Reporting Plus

**Stand:** April 2026 | **Quellen:** SWIFT CBPR+ Implementation Guidelines 2023, ISO 20022, EBA, BIS

## Zweck & Verwendung

### Experte

**CBPR+ (Cross-Border Payments and Reporting Plus)** ist das von SWIFT definierte **Usage Guideline Set** für ISO-20022-Nachrichten im grenzüberschreitenden Interbank-Zahlungsverkehr. Es definiert nicht nur das Format (z. B. pacs.008.001.08 für Customer Credit Transfers), sondern auch **verbindliche Nutzungsregeln** (Mandatory/Conditional/Optional-Einstufungen), **erlaubte Code-Werte** und **strukturierte Adressen** (CPP — Correspondent and Payment Plus). CBPR+ umfasst die Nachrichten-Familien **pacs** (Payment Clearing and Settlement), **camt** (Cash Management) und **pain** (Payments Initiation) in ihrer jeweiligen SWIFT-Ausprägung. Kernunterschied zur generischen ISO-20022-Spezifikation: CBPR+ schränkt ein und ergänzt sie für das SWIFT-Netzwerk — u. a. UETR-Pflicht, BIC-basiertes Routing (statt Clearing-System-Member-ID), Pflicht strukturierter Adressen, maximal 140 Zeichen für `Nm`-Felder. Die **Migration von MT zu MX** (SWIFT FIN → ISO 20022) ist die treibende Kraft — Deadline: November 2025 für alle SWIFT-Mitglieder.

### Einsteiger

CBPR+ ist die "Hausordnung" für internationale Banküberweisungen im SWIFT-Netzwerk. Früher schickten Banken Nachrichten im alten MT-Format (kurze, telegrafisch-ähnliche Texte). Jetzt wechseln alle auf das modernere ISO-20022-Format (strukturiertes XML). CBPR+ legt fest, wie dieses XML-Format bei SWIFT genau aussehen muss — welche Felder Pflicht sind, wie Adressen angegeben werden und welche Codes verwendet werden dürfen. Es betrifft hauptsächlich Banken untereinander (nicht direkt Unternehmen), aber SAP-Kunden spüren es, weil ihre Banken die neuen Anforderungen an Zahlungsdaten durchsetzen.

## Versionshistorie / Meilensteine

| Version / Meilenstein | Jahr | Bedeutung |
|---|---|---|
| CBPR+ Phase 1 | 2022 | pacs.008.001.08 als primäre CBPR+-Version; freiwillige Nutzung |
| Coexistence Start | Jan 2023 | MT103/MX parallel; SWIFT Translation Engine aktiv |
| CBPR+ Guidelines 2023 | 2023 | Strukturierte Adressen (CPP) als "Recommended", UETR-Pflicht |
| Mandatory MX | Nov 2025 | Alle SWIFT-Korrespondenzbanken müssen MX verwenden; MT FIN abgekündigt |
| CPP Enforcement | 2026+ | Vollständig strukturierte Adressen Pflicht; unstrukturierte AdrLines führen zu Ablehnung |

## Wichtige Felder (technisch)

| XML-Element | Bedeutung | CBPR+ Pflicht |
|---|---|---|
| `AppHdr/BizMsgIdr` | Business Message Identifier (CBPR+ App Header) | Ja |
| `AppHdr/MsgDefIdr` | z. B. `pacs.008.001.08` | Ja |
| `GrpHdr/MsgId` | Eindeutige Nachrichtenreferenz | Ja |
| `CdtTrfTxInf/PmtId/UETR` | Unique End-to-End Transaction Reference (UUID v4) | Ja |
| `CdtTrfTxInf/IntrBkSttlmAmt` | Settlement-Betrag mit Währung | Ja |
| `CdtTrfTxInf/IntrBkSttlmDt` | Settlement-Datum | Ja |
| `CdtTrfTxInf/InstgAgt/FinInstnId/BICFI` | BIC der beauftragenden Bank | Ja |
| `CdtTrfTxInf/InstdAgt/FinInstnId/BICFI` | BIC der beauftragten Bank | Ja |
| `CdtTrfTxInf/Cdtr/PstlAdr/StrtNm` | Straßenname (strukturiert) | Ja (CPP 2026) |
| `CdtTrfTxInf/Cdtr/PstlAdr/TwnNm` | Stadt | Ja |
| `CdtTrfTxInf/Cdtr/PstlAdr/Ctry` | ISO-Ländercode | Ja |
| `CdtTrfTxInf/PrvsInstgAgt1` | Vorherige Intermediary-Bank | Conditional |

## Pflichtfelder (Kurzliste)

`AppHdr` · `MsgId` · `CreDtTm` · `UETR` · `IntrBkSttlmAmt` · `IntrBkSttlmDt` · `InstgAgt/BICFI` · `InstdAgt/BICFI` · `Cdtr/Nm` · `Cdtr/PstlAdr` · `CdtrAcct/Id`

## SAP-Mapping

### Experte

In SAP S/4HANA wird CBPR+ primär über den **Bank Communication Manager (BCM)** und den **SWIFT Alliance Gateway** abgebildet. Das pacs.008-Format wird entweder direkt vom **SAP Payment Hub** (in S/4HANA Cloud) oder über ein DMEEX-Format erzeugt. Wichtige SAP-Aspekte:
- **AppHdr (Business Application Header)**: Muss als separater CBPR+-Block erzeugt werden — in SAP standardmäßig nicht enthalten, muss im DMEEX oder PMW-Plugin konfiguriert werden.
- **UETR-Generierung**: Aktivierung per SAP Note 2652651 / SAP Note 3008342 (S/4HANA 2021+).
- **Strukturierte Adressen**: Im Debitoren-/Kreditorenstamm (BP / LFA1 / KNA1) müssen `StrtNm`, `BldgNb`, `PstCd`, `TwnNm`, `Ctry` einzeln gepflegt sein — generische `AdrLine`-Felder reichen ab 2026 nicht mehr.
- **pacs.002-Verarbeitung**: CBPR+-Statusrückmeldungen (pacs.002) werden über BCM eingehend verarbeitet und auf Zahlungsbelege zugeordnet.
- Tabellen-Referenzen: `REGUT` (Zahlungsauftrag), `PAYR` (Zahlungsträger), `FEBEP` (EBS-Posting).

### Einsteiger

Für SAP-Anwender bedeutet CBPR+ vor allem: **Die Adressdaten von Lieferanten und Kunden müssen vollständig und strukturiert sein**. Wenn in SAP nur "Musterstraße 1, 90401 Nürnberg" als eine Textzeile steht, kann die Bank das ab 2026 nicht mehr als gültige CBPR+-Adresse akzeptieren. SAP selbst unterstützt das neue Format — aber die Stammdatenqualität muss stimmen. Banken leiten Zahlungen mit unvollständigen Adressen zurück oder leiten sie in manuelle Bearbeitung.

## Typische Fehlerquellen

### Experte

- **Fehlender oder falscher AppHdr**: CBPR+ erfordert einen **ISO 20022 Business Application Header (BAH)** — viele DMEEX-Formate für pacs.008 erzeugen keinen separaten BAH. SWIFT lehnt Nachrichten ohne BAH ab.
- **Unstrukturierte Adressen (AdrLine)**: Ab CPP-Enforcement werden `AdrLine`-only-Adressen zurückgewiesen — betrifft besonders Non-SEPA-Zahlungen in Länder mit abweichenden Adressformaten (z. B. USA, GB, JP).
- **ClrSysMemId statt BICFI**: Nationale Clearing-Systeme verwenden Mitglieds-IDs (z. B. UK Sort Code `GBSORTCODE`) — CBPR+ verlangt BICFI für das SWIFT-Netzwerk. Beides zu unterstützen erfordert Routing-Logik.
- **UETR-Konflikt bei Retries**: Bei technischen Retries desselben Zahlungsauftrags muss die UETR identisch bleiben — neue UETR-Generierung bei Retry erzeugt Duplikat-Zahlung.

### Einsteiger

- Adressdaten von Lieferanten sind unvollständig oder nicht strukturiert — die Überweisung wird von der Bank zurückgegeben oder manuell bearbeitet.
- Teams wissen nicht, dass CBPR+ nur für den Bankverkehr (Interbank) gilt — im Kundensystem (pain.001) gelten andere, weniger strenge Regeln für Adressen.
- Man denkt, MT103 und pacs.008 seien dasselbe Format in verschiedenen Sprachen — aber nach der Migration gibt es keine "Übersetzung" mehr, und Legacy-Systeme müssen aktualisiert werden.

## Häufige Projektfehler

### Experte

- **Stammdaten-Migration unterschätzt**: CBPR+-Adress-Compliance erfordert oft eine **vollständige Stammdatenbereinigung** (BP/Lieferanten/Kunden) — Projekte unterschätzen diesen Aufwand regelmäßig um Faktor 3–5.
- **Dual-Format-Test fehlt**: Während der Coexistence-Phase (2023–2025) muss sowohl MT als auch MX getestet werden — viele Projekte testen nur eines der beiden Formate.
- **SWIFT Connectivity nicht aktualisiert**: Ältere SWIFT Alliance Access-Versionen unterstützen kein MX / AppHdr — Upgrade auf Alliance Messaging Hub oder SWIFT API-Konnektivität notwendig, wird oft zu spät adressiert.
- **Fehlende pacs.009 / pacs.004-Integration**: CBPR+ ist ein Nachrichtensystem, kein Einzel-Format — Rückgaben (pacs.004), Fi-to-Fi-Zahlungen (pacs.009) und Statusmeldungen (pacs.002) müssen alle implementiert werden.

### Einsteiger

- Das Projekt plant die MX-Migration für "irgendwann nach 2025" — aber die Deadline November 2025 ist verbindlich für alle SWIFT-Mitglieder, und Banken fordern von Corporates zunehmend CBPR+-konforme Daten.
- Es wird nur der Outbound-Zahlungsfluss umgestellt, aber nicht die eingehenden Statusmeldungen und Kontoauszüge (camt.054) — der Treasury-Prozess bleibt halbautomatisch.
- Der Unterschied zwischen CBPR+ (Interbank) und SEPA (Kunde-Bank) wird nicht verstanden — beide sind ISO 20022, aber mit anderen Regeln und Pflichtfeldern.
