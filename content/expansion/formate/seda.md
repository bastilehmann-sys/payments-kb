---
format_name: SEDA
aktuelle_version: "SEDA v2.0 (SEPA-compliant Electronic Database Alignment, CBI 2016)"
nachrichtentyp: Mandatsverwaltung für SEPA SDD — Elektronischer Mandats-Datenabgleich zwischen Creditor, Bank und Debtor-Bank
familie_standard: Italy Local
datenrichtung: Bidirektional — Creditor → Bank (Mandats-Aktivierung/Änderung) + Bank → Creditor (Mandats-Bestätigung)
sap_relevanz: SAP ERP / S/4HANA — nur über Custom-Entwicklung oder Bankadapter; kein natives SAP-SEDA-Format; relevant für SEPA SDD B2B-Implementierungen in Italien
status: Aktiv — spezifisch für den italienischen Markt als SEPA-SDD-Mandatsverwaltungs-Framework
---

# SEDA — SEPA-compliant Electronic Database Alignment (Italien)

**Stand:** April 2026 | **Quellen:** CBI S.c.p.A., ABI, EPC SEPA SDD Rulebook, Banca d'Italia

## Zweck & Verwendung

### Experte

**SEDA (SEPA-compliant Electronic Database Alignment)** ist ein italienisches Framework zur elektronischen Verwaltung und zum Abgleich von SEPA-Lastschrift-Mandaten (SEPA Direct Debit — SDD) zwischen Gläubiger (Creditor/Biller), Gläubigerbank (Creditor Bank) und Schuldnerbank (Debtor Bank). SEDA ersetzt den manuellen Prozess der physischen Mandats-Unterzeichnung und ermöglicht die vollautomatische Mandatsaktivierung, -änderung und -kündigung über das CBI-Netzwerk.

**Technisch**: SEDA nutzt XML-Nachrichten auf Basis des CBI-eigenen Schemas (ähnlich pain.012 — Mandate Amendment Request). Die Kernprozesse:
1. **Mandats-Aktivierung** (SEDA-Aktivierungsanfrage): Creditor sendet Mandatsdaten → Creditor Bank → Debtor Bank → Debtor bestätigt → Mandatsdatenbank synchronisiert.
2. **Mandats-Änderung** (SEDA-Änderungsanfrage): Aktualisierung von Konto-IBAN, Betrag, Frequenz.
3. **Mandats-Kündigung** (SEDA-Stornoanfrage): Elektronische Kündigung ohne physischen Papierweg.

SEDA unterscheidet zwischen **Core SEDA** (SEPA SDD Core, B2C) und **B2B SEDA** (SEPA SDD B2B, Firmenkunden).

### Einsteiger

SEDA löst ein praktisches Problem in Italien: Beim SEPA-Lastschriftverfahren muss ein Mandat zwischen Gläubiger und Schuldner existieren. Früher bedeutete das: Papierformular ausfüllen, unterschreiben, per Post schicken. SEDA macht das elektronisch — der Gläubiger schickt die Mandatsdaten digital an die Bank, und die Banken kümmern sich um Bestätigung und Synchronisation. Das spart Zeit und Papier und reduziert Fehler beim Lastschrifteneinzug.

## Versionshistorie / Standard-Entwicklung

| Zeitraum | Ereignis |
|---|---|
| 2013 | SEDA v1.0 von CBI eingeführt, parallel zu SEPA-SDD-Einführung in Italien |
| 2016 | SEDA v2.0 — Erweiterungen für B2B, verbesserte Fehlerbehandlung, Mandats-History |
| 2018 | Integration in CBI Globe-Plattform |
| 2021 | SEDA für SEPA Instant Direct Debit (zukünftig) vorbereitet |
| 2024 | SEDA weiterhin aktiv; kein europäisches Äquivalent außerhalb Italiens |

## Wichtige Felder (technisch)

| SEDA-Element | Beschreibung | Pflicht |
|---|---|---|
| `SdaId` | Eindeutige SEDA-Aktivierungs-ID | Ja |
| `MndtId` | Mandat-Referenz (MandateIdentification) | Ja |
| `CdtrSchmeId` | Creditor-Schema-Identifikation (CBI-SDA-ID) | Ja |
| `Dbtr/Id/IBAN` | Schuldner-IBAN | Ja |
| `Cdtr/Id/IBAN` | Gläubiger-IBAN | Ja |
| `SeqTp` | Sequenztyp: FRST/RCUR/OOFF/FNAL | Ja |
| `AmdmntInd` | Änderungsindikator (true/false) | Ja |
| `ElctrcSgntr` | Elektronische Signatur des Schuldners (optional bei SEDA) | Nein |

## Pflichtfelder (Kurzliste)

SdaId · MndtId · CdtrSchmeId · Debtor-IBAN · Creditor-IBAN · SeqTp · Fälligkeitsdatum der ersten Lastschrift

## SAP-Mapping

### Experte

SAP bietet keine native SEDA-Unterstützung. Typische Integration:
- **SAP FI-CA / FI-AR**: Mandat-Stammdaten in SAP-Mandatsverwaltung (`F_SEPA_01` / `SE38 RSEPA_DD_MNDTM`) — müssen mit SEDA-Daten synchron gehalten werden.
- **Custom-Adapter**: SEDA-Nachrichten werden per benutzerdefiniertem ABAP oder Middleware zwischen SAP-Mandatsverwaltung und CBI-SEDA-Interface übersetzt.
- **SEPA-SDD-Verarbeitung in SAP**: Standardmäßig über pain.008 (DMEE) — SEDA stellt sicher, dass die Mandatsdaten im CBI-Netzwerk korrekt hinterlegt sind, bevor pain.008 eingereicht wird.
- **Bankadapter**: Serrala FS² unterstützt SEDA-Integration für SAP.

### Einsteiger

SEDA ist in SAP nicht von Haus aus vorhanden. Das bedeutet: Wenn ein Unternehmen in Italien SEPA-Lastschriften einziehen will, muss entweder ein Extra-Programm entwickelt werden, das SEDA-Nachrichten erzeugt und an die Bank schickt, oder ein fertiger Bankadapter eines Drittanbieters wird eingesetzt. SEDA ist quasi der "Vorbereiter" für die eigentliche Lastschrift (pain.008) — erst wenn das Mandat über SEDA bestätigt ist, darf die Lastschrift eingereicht werden.

## Typische Fehlerquellen

### Experte

- **Mandat nicht aktiviert vor Ersteinzug**: Eine pain.008-Einreichung mit SeqTp=FRST scheitert, wenn das SEDA-Mandat noch nicht bestätigt wurde — Bank lehnt die Lastschrift ab.
- **IBAN-Wechsel ohne SEDA-Update**: Wenn der Schuldner sein Konto wechselt und das SEDA-Mandat nicht aktualisiert wird, scheitern folgende Einzüge.
- **CBI-SEDA-ID falsch**: Die CBI-Creditor-Schema-ID (CBI-SDA-ID) muss korrekt beim CBI registriert sein — Fehler führt zu vollständiger Ablehnung aller SEDA-Anfragen.
- **Timing-Problem**: SEDA-Bestätigung dauert bis zu 3 Bankarbeitstage — Creditor muss warten, bevor erste Lastschrift eingereicht werden darf.

### Einsteiger

- Das Unternehmen reicht eine Lastschrift ein, bevor das SEDA-Mandat bestätigt wurde — die Bank lehnt ab, der Einzug schlägt fehl.
- Kundenkonto hat sich geändert, SEDA-Mandat wurde nicht aktualisiert — alle Folge-Lastschriften scheitern.

## Häufige Projektfehler

### Experte

- **SEDA-Prozess nicht im Projektscope**: SEPA-SDD-Projekte in Italien implementieren pain.008, vergessen aber SEDA als Voraussetzung — gesamtes Lastschrift-Setup ist nicht funktionsfähig.
- **Keine SEDA-Testumgebung**: CBI SEDA hat eigene Testinfrastruktur — ohne SEDA-spezifische Tests werden Integrationsfehler erst in der Produktion entdeckt.
- **Mandatsdaten-Synchronisation fehlt**: SEDA-Bestätigungen müssen in SAP-Mandat-Stammdaten zurückgeschrieben werden — ohne Synchronisation divergieren Datenbanken, Lastschriften scheitern.

### Einsteiger

- Das Projekt plant "SEPA SDD für Italien" ohne zu wissen, dass in Italien SEDA Pflicht ist — der Scope wird nachträglich erweitert, was Zeit und Budget kostet.
- Die Testphase wird ohne SEDA-Bestätigungen durchgeführt — im Produktionsbetrieb stellt sich heraus, dass die Mandate nicht korrekt aktiviert sind.
