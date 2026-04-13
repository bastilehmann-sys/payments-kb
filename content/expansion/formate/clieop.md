---
format_name: CLIEOP
aktuelle_version: "CLIEOP03 (abgelöst 2014 durch SEPA; historisches Referenzformat)"
nachrichtentyp: Niederländisches Legacy-Zahlungsformat — Betaalopdrachten (Überweisungen) und Incasso (Lastschriften) — ersetzt durch SEPA
familie_standard: Netherlands Legacy
datenrichtung: Ausgehend (Corporate → Bank) für Überweisungen und Lastschriftaufträge
sap_relevanz: SAP ERP (Legacy) — CLIEOP war via DMEE konfiguriert; nach SEPA-Migration 2014 durch pain.001/pain.008 ersetzt; historisches Know-how für Altinstallationen relevant
status: Legacy — abgelöst seit 01.02.2014 (SEPA-Migrationspflicht Niederlande); kein aktiver Betrieb; historisches Format
---

# CLIEOP — Niederländisches Legacy-Zahlungsformat (Abgelöst 2014)

**Stand:** April 2026 | **Quellen:** Betaalvereniging Nederland (früher Currence), DNB (De Nederlandsche Bank), SEPA-Migrationsdokumentation NL

## Zweck & Verwendung

### Experte

**CLIEOP** (CLIënt-OPdrachten) war das standardisierte Zahlungsformat für den niederländischen Massenzahlungsverkehr, definiert und gepflegt durch **Currence** (jetzt **Betaalvereniging Nederland**). CLIEOP war in den Varianten:
- **CLIEOP02**: Überweisungen (Betaalopdrachten) für Inlandszahlungen in Gulden/EUR
- **CLIEOP03**: Lastschriften (Incasso-Machtigingen) und erweiterte Überweisungen — die verbreitetste Variante

**Format-Aufbau**: CLIEOP ist ein Fixed-Width-ASCII-Format mit 80-Zeichen-Records (ähnlich NACHA und CFONB). Records unterschieden sich durch einen Recordtype (e.g. `00` = Dateikopf, `01` = Auftragskopf, `10` = Buchungszeile, `99` = Schlusssatz).

**Kontonummern**: CLIEOP nutzte das alte niederländische Kontosystem (Rekeningnummer, 9-10-stellig) und seit IBAN-Einführung hybride IBAN/Rekeningnummer-Notation.

**Historische Bedeutung**: Fast alle niederländischen Unternehmen nutzten CLIEOP für Gehalts-, Lieferanten- und Steuerzahlungen. Die Migration zu SEPA (pain.001/pain.008) war 2014 Pflicht.

**SAP-Kontext**: Viele ältere SAP-Installationen in niederländischen Unternehmen oder europäischen Konzernen mit NL-Niederlassung haben noch CLIEOP-DMEE-Konfigurationen — diese müssen bei S/4HANA-Migrationen auf pain.001 umgestellt werden.

### Einsteiger

CLIEOP war das niederländische Zahlungsformat — ähnlich dem deutschen DTAUS oder dem französischen CFONB. Es wurde 2014 durch SEPA ersetzt, als alle europäischen Länder auf einheitliche Formate umsteigen mussten. Heute ist CLIEOP nicht mehr aktiv, aber in alten SAP-Systemen findet man noch CLIEOP-Konfigurationen, die bei einer SAP-Migration aufgeräumt werden müssen.

## Versionshistorie / Standard-Entwicklung

| Zeitraum | Ereignis |
|---|---|
| 1980er | CLIEOP von niederländischen Banken als Standard eingeführt |
| 1990er | CLIEOP02 und CLIEOP03 als Standard-Varianten definiert |
| 2002 | Euro-Einführung: CLIEOP auf EUR umgestellt (vorher NLG) |
| 2008 | SEPA-Vorbereitung: Currence kündigt CLIEOP-Ablösung an |
| 2014-02-01 | SEPA-Migrationspflicht: CLIEOP offiziell abgelöst |
| 2024 | CLIEOP historisch; SAP-Altinstallationen enthalten noch DMEE-Konfigurationen |

## Wichtige Felder (technisch, CLIEOP03)

| Recordtyp | Feld | Beschreibung | Pflicht |
|---|---|---|---|
| 00 (Dateikopf) | Nummer Opgever | Eindeutige Auftraggeber-ID | Ja |
| 01 (Auftragskopf) | Rekeningnummer Opdrachtgever | Auftraggeberkonto (IBAN) | Ja |
| 10 (Buchung) | Rekeningnummer Begunstigde | Empfängerkonto | Ja |
| 10 (Buchung) | Bedrag | Betrag in Eurocent | Ja |
| 10 (Buchung) | Naam Begunstigde | Name des Empfängers | Ja |
| 10 (Buchung) | Omschrijving | Verwendungszweck (4 × 32 Zeichen) | Nein |
| 99 (Schlusssatz) | Aantal Records | Record-Anzahl zur Kontrolle | Ja |

## Pflichtfelder (Kurzliste)

Rekeningnummer Opdrachtgever · Rekeningnummer Begunstigde · Bedrag (Cent) · Naam Begunstigde

## SAP-Mapping

### Experte

CLIEOP war in SAP über DMEE konfiguriert (Formattyp `CLIEOP` oder `CLIEOP03`). Für aktuelle Projekte relevant:
- **S/4HANA-Migration**: Bestehende CLIEOP-DMEE-Konfigurationen müssen identifiziert (Transaktion `DMEE`, Tabelle `DFTXML`) und auf pain.001 migriert werden.
- **Bankdaten**: Niederländische Bankdaten in SAP (früher Rekeningnummer, jetzt IBAN NL-Format) — IBAN-Migration der Kreditorenstammdaten prüfen.
- **Kontoauszug (MT940/camt)**: CLIEOP hatte keine eigene Kontoauszugs-Variante — niederländische Banken lieferten MT940, heute camt.053.

### Einsteiger

CLIEOP ist Geschichte — in SAP heute nicht mehr konfigurieren. Wenn man noch CLIEOP-Einstellungen in einem alten SAP-System findet, müssen diese auf das aktuelle SEPA-Format (pain.001 für Überweisungen, pain.008 für Lastschriften) umgestellt werden. Das ist oft Teil einer S/4HANA-Migration oder einer SEPA-Nacharbeit.

## Typische Fehlerquellen (historisch / Migrations-relevant)

### Experte

- **CLIEOP-DMEE in S/4HANA nicht migriert**: Bei S/4HANA-Upgrades werden bestehende CLIEOP-Konfigurationen übernommen, sind aber nicht funktional — erst beim Zahlungslauf tritt der Fehler auf.
- **Rekeningnummer statt IBAN in Stammdaten**: Alte Kreditorenstammdaten haben noch niederländische Rekeningnummern — IBAN-Migration ist Voraussetzung für pain.001.
- **Verwendungszweck-Länge**: CLIEOP erlaubte 4×32 = 128 Zeichen; pain.001 erlaubt 140 Zeichen — Textlängen müssen ggf. angepasst werden.

### Einsteiger

- Nach S/4HANA-Migration läuft der Zahlungslauf in eine Fehlermeldung, weil CLIEOP nicht mehr unterstützt wird — Umkonfiguration auf pain.001 nötig.
- Alte Kreditorenstammdaten haben keine IBAN — SEPA-Zahlungen scheitern.

## Häufige Projektfehler

### Experte

- **CLIEOP-Konfiguration im Scope vergessen**: S/4HANA-Migrationsprojekte prüfen oft nicht alle vorhandenen DMEE-Konfigurationen — CLIEOP wird übersehen und führt zu Produktionsproblemen.
- **Keine Validierung der IBAN-Migration**: Wenn Kreditor-IBANs aus alten Rekeningnummern konvertiert werden, muss die Konversionslogik geprüft werden — NL-IBAN-Berechnung aus Rekeningnummer hat spezifische Regeln.

### Einsteiger

- Das Migrationsprojekt vergisst CLIEOP — nach Go-Live können Zahlungen für NL-Konten nicht ausgeführt werden.
- Die alten Kontonummern wurden nie in IBANs umgewandelt — Zahlungen werden abgewiesen.
