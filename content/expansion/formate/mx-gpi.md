---
format_name: MX gpi
aktuelle_version: "pacs.008.001.08 + SRH (gSRP)"
nachrichtentyp: SWIFT gpi Customer Credit Transfer (MX-Format)
familie_standard: SWIFT GPI / ISO 20022 / pacs
datenrichtung: Ausgehend + Eingehend (Interbank, über SWIFT)
sap_relevanz: SAP S/4HANA Treasury / BCM / SWIFT Alliance / Payment Hub
status: Aktiv — SWIFT-Pflicht für Korrespondenzbanken ab November 2025 (vollständig MX)
---

# MX gpi — SWIFT Global Payments Innovation (MX-Format)

**Stand:** April 2026 | **Quellen:** SWIFT gpi Rulebook, SWIFT Standards Release 2023, ISO 20022

## Zweck & Verwendung

### Experte

SWIFT **gpi (Global Payments Innovation)** ist kein eigenes Format, sondern ein **Service-Layer** auf Basis von ISO-20022-Nachrichten (MX), primär **pacs.008** (FI to FI Customer Credit Transfer). Die gpi-spezifische Erweiterung erfolgt über den **SWIFT gpi Service Reference Header (gSRP / SRH)** im `SplmtryData`-Block oder als separater SWIFT-Header. Kernelemente: **UETR** (Unique End-to-End Transaction Reference, UUID v4) als Pflichtfeld für End-to-End-Tracking, **gpi Tracker** (SWIFT Cloud-Dienst für Echtzeit-Statusverfolgung), **gSRP-Statusupdates** (g001: ACSP, g002: ACCC, g003: RJCT). Ab **November 2025** sind alle SWIFT-Mitglieder verpflichtet, MX-Nachrichten zu verwenden (CBPR+ Coexistence-Phase endet). Routing erfolgt über SWIFT FIN → MX-Migration: pacs.008.001.08 mit BIC-basiertem Routing, UETR als Tracking-Anker über alle Intermediaries.

### Einsteiger

SWIFT gpi ist ein Service, der internationale Überweisungen schneller, transparenter und nachverfolgbar macht. Wenn ein Unternehmen Geld ins Ausland überweist, durchläuft die Zahlung oft mehrere Banken (Korrespondenzbanken). Früher wusste man nicht, wo das Geld gerade ist. Mit SWIFT gpi kann jede beteiligte Bank ihren Status melden, und der Auftraggeber kann auf einem "Tracking-Portal" sehen, ob die Zahlung angekommen ist — wie ein Paketverfolgungssystem für Geld.

## Versionshistorie / Meilensteine

| Meilenstein | Jahr | Bedeutung |
|---|---|---|
| SWIFT gpi Pilot | 2017 | Ersteinführung mit pacs.008.001.05, UETR als optionales Feld |
| gpi Phase 2 | 2018 | UETR-Pflicht für alle gpi-Mitglieder; gpi Tracker live |
| gpi Universal Confirmations | 2019 | Alle Banken müssen Zahlungsbestätigung senden |
| CBPR+ MX-Mandat | 2022 | ISO 20022 als Pflicht-Format für Cross-Border Payments angekündigt |
| Coexistence Phase | 2023–2025 | MT103 und pacs.008 parallel; Inhalte per Translation Engine gemappt |
| Vollständig MX | Nov 2025 | MT-FIN-Nachrichten abgekündigt; pacs.008.001.08+ Pflicht |
| Aktuell | April 2026 | pacs.008.001.08 mit gSRP; pacs.004/009 für Returns/Investigations |

## Wichtige Felder (technisch)

| XML-Element | Bedeutung | Pflicht (gpi) |
|---|---|---|
| `GrpHdr/MsgId` | Eindeutige Nachrichten-ID | Ja |
| `CdtTrfTxInf/PmtId/UETR` | UUID v4 — gpi-Tracking-Ankerpunkt | Ja (gpi) |
| `CdtTrfTxInf/IntrBkSttlmAmt` | Interbank-Settlement-Betrag | Ja |
| `CdtTrfTxInf/IntrBkSttlmDt` | Settlement-Datum | Ja |
| `CdtTrfTxInf/ChrgBr` | Gebührenkodierung (SHAR/DEBT/CRED) | Ja |
| `CdtTrfTxInf/Cdtr/PstlAdr` | Strukturierte Empfängeradresse (CPP-konform) | Ja (CBPR+) |
| `CdtTrfTxInf/CdtrAcct/Id/IBAN` | Empfänger-IBAN (oder Othr für Non-SEPA) | Empfohlen |
| `SplmtryData` (gSRP) | SWIFT gpi Service Reference Header | Ja (gpi-Service) |
| `CdtTrfTxInf/PrvsInstgAgt1–3` | Vorherige Intermediary-Banken | Ja (Routing) |

## Pflichtfelder (Kurzliste)

`MsgId` · `CreDtTm` · `NbOfTxs` · `UETR` · `IntrBkSttlmAmt` · `IntrBkSttlmDt` · `ChrgBr` · `CdtrAgt/BICFI` · `Cdtr/Nm` · `Cdtr/PstlAdr` · `CdtrAcct/Id`

## SAP-Mapping

### Experte

In SAP S/4HANA wird gpi über den **Bank Communication Manager (BCM)** und die **SWIFT Alliance Gateway**-Integration abgebildet. Das UETR wird in SAP bei der Zahlungsauftragsanlage (Transaktion F110 / FBZP) in das `UETR`-Feld des Zahlungsbelegs geschrieben (Customizing: Payment Method / Payment Medium Format). Die pacs.008-Ausgabedatei wird via DMEEX oder PMW erzeugt — für gpi-kompatible Banken ist das DMEEX-Format `CGPACS008OUTB` oder bankspezifisch konfiguriert. Das gpi-Tracking (UETR-Statusabfrage) erfolgt entweder über **SWIFT gpi Tracker API** (REST) oder über eingehende **camt.054** / **pacs.002**-Statusnachrichten. Im SAP-Kontext: UETR wird als Referenz in Tabelle `REGUT` (Zahlungsauftrag) gespeichert.

### Einsteiger

SAP schreibt automatisch eine eindeutige Transaktionsnummer (UETR) in jede internationale Überweisung — diese Nummer ist der Schlüssel fürs SWIFT-Tracking. Der Buchhalter muss nichts manuell tun; SAP und die Bank kümmern sich darum. Wenn man wissen will, ob eine Zahlung angekommen ist, kann man die UETR-Nummer im SWIFT gpi-Tracker der eigenen Bank eingeben — ähnlich wie eine Sendungsverfolgungsnummer.

## Typische Fehlerquellen

### Experte

- **UETR-Format falsch**: Muss UUID v4 (RFC 4122) sein — `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`. Viele Legacy-Systeme generieren sequentielle IDs statt UUIDs.
- **UETR nicht über alle Hops weitergeleitet**: Jede Intermediary-Bank muss die UETR unverändert in `PmtId/UETR` weiterleiten — bei alten Banksystemen wird sie gelöscht oder neu generiert (Tracking-Kette bricht).
- **Strukturierte Adresspflicht (CPP) ignoriert**: Ab November 2025 Pflicht für grenzüberschreitende Zahlungen — `StrtNm`, `BldgNb`, `PstCd`, `TwnNm`, `Ctry`. Unstrukturierte `AdrLine` wird zunehmend von Empfängerbanken abgelehnt.
- **ChrgBr-Konflikt**: `SHAR` ist SWIFT-Standard, manche Corridors erfordern `DEBT` (Sender zahlt alle Gebühren) — falsche Kodierung führt zu Deduktionen beim Empfänger.

### Einsteiger

- Die Tracking-Nummer (UETR) wird nicht korrekt an alle beteiligten Banken weitergegeben — dann "verschwindet" die Zahlung aus dem Tracker nach der ersten Zwischenbank.
- Empfängeradressen sind noch im alten Format (unstrukturiert) — neuere Systeme lehnen das ab, und die Zahlung muss manuell nachbearbeitet werden.
- Man verwechselt SWIFT gpi mit einem eigenen Zahlungsformat — es ist kein Format, sondern ein Service auf Basis von ISO-20022-Nachrichten.

## Häufige Projektfehler

### Experte

- **UETR-Generierung nicht in SAP-Customizing konfiguriert**: Standardmäßig erzeugt SAP keine UETRs — dies muss explizit im Payment Method Supplement aktiviert werden (SAP Note 2652651).
- **gpi Tracker-Integration fehlt**: Die meisten SAP-Projekte implementieren nur die Outbound-Seite (pacs.008 senden), aber nicht die Inbound-Tracking-Updates (pacs.002 / camt.054 mit Statusrückmeldung) — gpi-Mehrwert geht verloren.
- **Coexistence-Übersetzungsfehler**: Während der MT-MX-Coexistence-Phase (2023–2025) übersetzt die SWIFT Translation Engine automatisch; nach November 2025 müssen Systeme direkt MX sprechen — late adopters haben Nachholbedarf.

### Einsteiger

- Unternehmen wissen nicht, dass ihre Bank gpi überhaupt unterstützt — in der Projektanalyse wird das nicht geprüft, und man zahlt für gpi-Lizenzen, ohne den Nutzen zu haben.
- Das SWIFT-Tracking-Portal wird dem Treasury-Team nicht erklärt — niemand nutzt das neue Feature, obwohl es verfügbar ist.
- Zahlungsreferenzen (End-to-End-ID) werden inkonsistent gepflegt — das Tracking zeigt dann "unbekannte Zahlung", obwohl technisch alles funktioniert.
