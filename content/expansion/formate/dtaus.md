---
format_name: DTAUS
aktuelle_version: "DTAUS (Inlandszahlungsverkehr, abgekündigt 2014)"
nachrichtentyp: Inlandsüberweisungsauftrag und Lastschrift — Fixed-Width Textformat (Deutsche Kreditwirtschaft)
familie_standard: Germany Legacy
datenrichtung: Ausgehend (Corporate → Bank)
sap_relevanz: SAP ERP — Historisch F110 + RFFODTA0/RFFODTU0; seit SEPA-Pflicht Feb 2014 durch pain.001/pain.008 ersetzt; SAP-Altsysteme können noch DTAUS-Verarbeitung haben
status: Abgekündigt — seit 1. Februar 2014 nicht mehr gültig im deutschen Zahlungsverkehr; vollständig durch SEPA-Formate (pain.001/pain.008) ersetzt
---

# DTAUS — Datenträgeraustausch Inlandszahlungsverkehr (Abgekündigt)

**Stand:** April 2026 | **Quellen:** Deutsche Kreditwirtschaft (DK), Bundesbank, SAP-Dokumentation

## Zweck & Verwendung

### Experte

**DTAUS** (Datenträgeraustausch) war das Standard-Dateiformat der Deutschen Kreditwirtschaft für **inländische Überweisungen und Lastschriften** — das Rückgrat des deutschen Massenzahlungsverkehrs für über 30 Jahre. Es ist ein **Fixed-Width-Textformat** (kein XML) mit dem charakteristischen Aufbau aus A-Satz (Vorsatz), C-Sätzen (Transaktionssätze) und E-Satz (Nachsatz).

DTAUS existierte in zwei Hauptvarianten:
- **DTAUS0 (Diskette/Magnetband)**: Ursprungsformat für physische Datenträger
- **DTAUS-U (Datenfernübertragung)**: Digitale Übertragungsversion per EDIFACT/EBICS

**Dateistruktur:**
| Satzart | Inhalt |
|---|---|
| A-Satz | Vorsatz: BLZ (8), Konto (10), Auftragsart (GTLMS...), Ausführungsdatum |
| C-Satz | Transaktionssatz: Empfänger-BLZ, Konto, Betrag (Pfennig), Name, Verwendungszweck |
| E-Satz | Nachsatz: Summe Beträge, Summe BLZs, Summe Kontonummern, Anzahl Sätze |

**Auftragsarten (A-Satz Feld 6):**
- `GK`: Gutschrift (Überweisung)
- `LK`: Lastschrift
- `GS`: Gehaltszahlung
- `LS`: Lohnzahlung

Mit der **SEPA-Verordnung (EU 260/2012)** endete die Gültigkeit von DTAUS zum **1. Februar 2014** in Deutschland. Seit diesem Datum müssen alle Euro-Zahlungen im SEPA-Raum im pain.001 (Überweisung) bzw. pain.008 (Lastschrift)-Format eingereicht werden.

### Einsteiger

DTAUS war der "Vorgänger von SEPA" in Deutschland — das Format, mit dem Unternehmen über 30 Jahre lang ihre Überweisungen und Lastschriften an die Bank geschickt haben. Das Format war sehr einfach: eine Textdatei mit festen Spaltenbreiten, die Kontonummer, BLZ (Bankleitzahl), Betrag und Verwendungszweck enthielt. Seit 2014 ist DTAUS Geschichte und wurde durch das europäische SEPA-Format ersetzt. Wer noch DTAUS-Konfigurationen in SAP hat, muss diese längst migriert haben — sonst funktioniert nichts mehr.

## Versionshistorie / Standard-Entwicklung

| Zeitraum | Ereignis |
|---|---|
| 1976 | DTAUS-Format eingeführt — Magnetbandaustausch zwischen Unternehmen und Banken |
| 1985 | DTAUS0 Spezifikation standardisiert (physischer Datenträger) |
| 1990er | DTAUS-U für elektronische Übertragung (EDIFACT, später EBICS) |
| 2002 | BLZ/Konto → IBAN/BIC-Übergangsplanung begonnen |
| 2008 | Erste SEPA-Überweisungen (pain.001) parallel zu DTAUS möglich |
| 01.02.2014 | **DTAUS offiziell abgekündigt** — SEPA-Pflicht für alle Euro-Zahlungen |
| 2014–heute | DTAUS nur noch in Archiven; neue Zahlungen ausschließlich pain.001/pain.008 |

## Wichtige Felder (technisch)

| Feld | C-Satz Position | Beschreibung | Pflicht |
|---|---|---|---|
| Satzart | 1-1 | "C" für Transaktionssatz | Ja |
| Satzlänge | 2-5 | 187 Bytes (Standard-C-Satz) | Ja |
| BLZ Empfängerbank | 6-13 | 8-stellige BLZ | Ja |
| Kontonummer Empfänger | 14-23 | 10-stellige Kontonummer (mit führenden Nullen) | Ja |
| Interne Kundennummer | 24-35 | Freifeld Auftraggeber | Nein |
| Kz. Textschlüssel | 36-37 | 51=Überweisung, 05=Lastschrift, 52=Lohn/Gehalt | Ja |
| Betrag in Pfennig | 50-61 | Betrag × 100, max. 12 Stellen, rechtsbündig | Ja |
| BLZ Auftraggeber | 62-69 | 8-stellige BLZ des einreichenden Unternehmens | Ja |
| Kontonummer Auftraggeber | 70-79 | 10-stellige Kontonummer | Ja |
| Name Empfänger | 93-119 | 27 Zeichen, linksbündig | Ja |
| Verwendungszweck | 120-146 | 27 Zeichen (erster Block) | Ja |

## Pflichtfelder (Kurzliste)

BLZ (Empfänger) · Kontonummer (Empfänger) · Textschlüssel · Betrag (Pfennig) · BLZ (Auftraggeber) · Kontonummer (Auftraggeber) · Name Empfänger · Verwendungszweck

## SAP-Mapping

### Experte

DTAUS war in SAP über spezifische Zahlungsprogramme unterstützt:
- **Programm RFFODTA0**: Klassisches SAP-Programm zur Erzeugung von DTAUS-Dateien (Überweisungen).
- **Programm RFFODTU0**: Erzeugung DTAUS-U (elektronische Übertragung).
- **Transaktion F110**: Zahlungsprogramm mit Zahlungsweg "D" (DTAUS-Überweisung) oder "L" (DTAUS-Lastschrift). Konfiguration in `T042Z`.
- **Tabelle T028B**: DTAUS-Textschlüssel-Zuordnung zu SAP-Belegart.
- **SEPA-Migration in SAP**: T-Code `FSEPA_MAINT` (S/4HANA) für Migration von DTAUS-Zahlungswegen auf pain.001/pain.008. Migration-Guide SAP Note 1605469.
- **Archiv**: Alte DTAUS-Dateien können noch mit `FF.5` (Kontoauszugsimport) verarbeitet werden, falls historische Bank Statements im DTAUS-Format vorliegen.

### Einsteiger

In SAP gibt es (bzw. gab es) spezielle Programme (RFFODTA0 usw.), die DTAUS-Dateien erstellt haben. Seit 2014 sind diese nicht mehr relevant für aktive Zahlungsläufe. Was übrig bleibt: Wenn ein Unternehmen noch alte SAP-Systeme hat (z.B. SAP R/3 ohne SEPA-Migration), könnten noch DTAUS-Zahlungswege konfiguriert sein. Diese müssen auf pain.001 migriert werden — was eine technische SAP-Anpassung erfordert.

## Typische Fehlerquellen

### Experte

- **Betrag in Pfennig**: DTAUS erwartet den Betrag in Pfennig (Cent × 10) — ein häufiger historischer Fehler war die Übergabe in Euro statt Pfennig, was zu 100-fach falschen Beträgen führte.
- **Prüfsumme E-Satz falsch**: Der E-Satz enthält Quersummen von BLZs, Kontonummern und Beträgen — SAP-Programme berechnen diese automatisch, Eigenentwicklungen oft fehlerhaft.
- **Zeichensatz**: DTAUS akzeptiert nur 28 Sonderzeichen aus dem DK-Zeichensatz — Umlaute (ä, ö, ü) mussten als (Ae, Oe, Ue) kodiert werden; SAP konvertiert automatisch, aber Eigenentwicklungen nicht immer.
- **BLZ-Prüfung**: BLZ muss in der Bundesbank-BLZ-Datei (BLZ-Online) existieren — ungültige BLZs führen zum kompletten Dateiabweis.

### Einsteiger

- Beträge waren 100-mal zu groß oder zu klein (Euro vs. Pfennig-Verwechslung).
- Die Datei wird abgewiesen, weil die Quersumme (E-Satz) falsch ist.
- Umlaute im Verwendungszweck führten zu Zeichensatz-Fehlern.

## Häufige Projektfehler

### Experte

- **Verspätete SEPA-Migration**: Einige Unternehmen hatten bis kurz vor dem 01.02.2014-Deadline noch keine funktionsfähige pain.001-Konfiguration — Notlösung über Hausbank-Konvertierung, aber mit Extrakosten.
- **Doppelkonfiguration ohne Abschaltung DTAUS**: Projekte aktivierten pain.001, vergaßen aber DTAUS-Zahlungswege zu sperren — Risiko doppelter Zahlungsläufe.
- **Fehlende Mandatsmigration (Lastschriften)**: DTAUS-Lastschriften hatten keine formellen Mandate — für SEPA-Lastschriften (pain.008) mussten retroaktiv Mandate erstellt werden (große rechtliche und operative Herausforderung).
- **SAP-Customizing nicht dokumentiert**: DTAUS-Konfiguration war oft über Jahre gewachsen und nicht dokumentiert — Migrationsteams mussten reverse-engineering betreiben.

### Einsteiger

- Das Unternehmen ist 2014 nicht auf SEPA umgestiegen und musste in letzter Minute den Bankeinzug manuell durchführen.
- Lastschriften haben nach der SEPA-Migration nicht funktioniert, weil Mandatsnummern fehlten.
- Alte SAP-Systeme haben nach der Migration keine Zahlungen mehr ausgeführt — komplette Zahlungssperre bis zur Nachkonfiguration.
