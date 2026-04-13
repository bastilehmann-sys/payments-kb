---
format_name: DTAZV
aktuelle_version: "DTAZV (Auslandszahlungsverkehr, Legacy)"
nachrichtentyp: Auslandsüberweisungsauftrag — Fixed-Width Textformat (Deutsche Kreditwirtschaft)
familie_standard: Germany Legacy
datenrichtung: Ausgehend (Corporate → Bank)
sap_relevanz: SAP ERP / S/4HANA — F110 Zahlungsprogramm, DMEE-Formatdefinition DTAZV, Auftragsart DTAZV bei EBICS; Ablösung durch pain.001 (SEPA/SWIFT) weitgehend vollzogen
status: Legacy — offiziell abgelöst durch ISO 20022 pain.001; viele SAP-Altsysteme erzeugen DTAZV noch für Nicht-SEPA-Länder (USA, Asien, Latein-Amerika)
---

# DTAZV — Datenträgeraustausch Auslandszahlungsverkehr (Legacy)

**Stand:** April 2026 | **Quellen:** Deutsche Kreditwirtschaft (DK), Bundesbank, SAP-Dokumentation, EBICS-Gesellschaft

## Zweck & Verwendung

### Experte

**DTAZV** (Datenträgeraustausch Auslandszahlungsverkehr) ist das historische Dateiformat der Deutschen Kreditwirtschaft für **grenzüberschreitende Überweisungsaufträge** (Nicht-SEPA-Zahlungen). Es ist ein **Fixed-Width-Textformat** (keine XML-Struktur) mit exakt definierten Zeichenpositionen pro Satzart. Jede Datei besteht aus einem Vorsatz (A-Satz), beliebig vielen Transaktionssätzen (Q-Satz, C-Satz für Details) und einem Nachsatz (Z-Satz).

DTAZV war primär für **Auslandsüberweisungen** außerhalb des SEPA-Raums konzipiert: USD-Zahlungen in die USA, JPY nach Japan, CHF-Zahlungen (teilweise), etc. Innerhalb SEPA ersetzt seit 2014 der pain.001-SCT das DTAZV vollständig. Für Drittlandzahlungen wird es schrittweise durch pain.001 (CBPR+/SWIFT) abgelöst, bleibt aber in SAP-Altinstallationen aktiv.

**Satzarten DTAZV:**

| Satzart | Inhalt |
|---|---|
| A-Satz | Vorsatz: BLZ, Kontonummer, Dateierstellungsdatum, Währung |
| Q-Satz | Hauptsatz: Betrag, Empfänger-IBAN/Konto, BIC, Verwendungszweck |
| C-Satz | Zusatzsatz: Erweiterter Verwendungszweck, Empfängeradresse |
| Z-Satz | Nachsatz: Anzahl Transaktionen, Summenbetrag |

**Encoding:** EBCDIC oder ASCII je nach Bank/Übertragungsweg; EBICS-Einreichung als DTAZV-Datei (Auftragsart `IZV` oder `DTAZV`).

### Einsteiger

DTAZV ist das "alte" Dateiformat für internationale Überweisungen in Deutschland — ähnlich wie DTAUS für Inlandsüberweisungen. Das Format ist aus den 1970er/80er-Jahren und besteht aus festen Textzeilen. SAP kann solche Dateien automatisch erzeugen (nach Zahlungslauf F110), die dann per EBICS zur Bank übertragen werden. Innerhalb Europas (SEPA) wird DTAZV nicht mehr genutzt — dort gilt pain.001. Für Zahlungen in die USA, nach Japan etc. gibt es in manchen Altinstallationen noch DTAZV-Konfigurationen.

## Versionshistorie / Standard-Entwicklung

| Zeitraum | Ereignis |
|---|---|
| 1970er | DTA-Verfahren der Deutschen Kreditwirtschaft eingeführt — Magnetband-Datenträger |
| 1980er | DTAZV als Auslandsvariante des DTA-Verfahrens spezifiziert |
| 1995 | EBICS-Vorgänger DTAS (Datenfernübertragung) — DTAZV per Modem übertragen |
| 2002 | DTAZV-Spezifikation V4.0 — Ergänzung BIC/IBAN-Felder für SWIFT |
| 2008 | SEPA-Übergangsphase: DTAZV bleibt für Drittland-Zahlungen; pain.001 für SEPA |
| 2014 | SEPA-Migration vollständig: DTAZV im SEPA-Raum durch pain.001 ersetzt |
| 2025 | Schrittweise Ablösung durch pain.001 (CBPR+) für SWIFT-Drittlandzahlungen |

## Wichtige Felder (technisch)

| Feld | Position (Q-Satz) | Beschreibung | Pflicht |
|---|---|---|---|
| Satzart | 1-1 | "Q" für Transaktionssatz | Ja |
| Länge | 2-5 | Satzlänge in Bytes | Ja |
| Bankleitzahl Auftraggeber | 6-13 | 8-stellige BLZ | Ja |
| Kontonummer Auftraggeber | 14-23 | 10-stellige Kontonummer | Ja |
| BIC Empfängerbank | 24-34 | 11-stelliger SWIFT BIC | Ja |
| IBAN Empfänger | 35-60 | IBAN (max. 34 Zeichen) | Ja |
| Währung | 61-63 | ISO 4217 (z.B. USD) | Ja |
| Betrag | 64-76 | Rechtsbündig, 2 Dezimalstellen | Ja |
| Verwendungszweck | 77-163 | 87 Zeichen freitext | Ja |
| Empfängername | 164-199 | 36 Zeichen | Ja |
| Zahlungsart | 200-202 | SWIFT Charge-Typ: OUR/SHA/BEN | Ja |

## Pflichtfelder (Kurzliste)

BLZ (Auftraggeber) · Kontonummer (Auftraggeber) · BIC (Empfänger) · IBAN (Empfänger) · Währung · Betrag · Empfängername · Verwendungszweck · Zahlungsart (OUR/SHA/BEN)

## SAP-Mapping

### Experte

DTAZV ist in SAP über DMEE oder klassische Zahlungsprogramm-Konfiguration unterstützt:
- **DMEE-Format**: Formatbaum `DTAZV` in Transaktion `DMEE`. Erzeugt Fixed-Width-Datei nach DK-Spezifikation.
- **F110 (Zahlungsprogramm)**: Zahlungsweg konfigurieren mit Programmname `RFFODE_U` (Auslandsüberweisungen) oder DMEE-Variante. Tabelle `T042Z` für Zahlungsweg-Zuordnung.
- **EBICS-Übertragung**: Auftragsart `IZV` (Inländischer Zahlungsverkehr Ausland) oder `DTAZV` je nach Bank.
- **Bankketten (Intermediary Banks)**: DTAZV unterstützt Korrespondenzbanken über C-Satz-Erweiterungen. In SAP über Bankverbindungs-Customizing (`FI-BL`).
- **Charge-Typ**: OUR (alle Gebühren trägt Auftraggeber), SHA (geteilt), BEN (Empfänger trägt alle Gebühren) — in SAP als Zahlungswegattribut oder per Belegart-Customizing steuerbar.
- **Pain.001-Migration**: T-Code `FPAYMIG` (S/4HANA) für Mapping bestehender DTAZV-Zahlungswege auf pain.001.001.09.

### Einsteiger

In SAP gibt es eine fertige Vorlage für DTAZV-Zahlungsdateien. Nach dem Zahlungslauf (F110) erzeugt SAP die DTAZV-Datei automatisch. Diese wird dann per EBICS (eine sichere Verbindung zur Bank) übertragen. Wichtig: Für US-Dollar-Zahlungen muss SAP wissen, welche Empfängerbank den Betrag weiterleitet und welcher SWIFT-Code verwendet wird. Das muss im System hinterlegt sein, sonst schlägt die Übertragung fehl.

## Typische Fehlerquellen

### Experte

- **Zeichensatz-Fehler**: DTAZV ist historisch EBCDIC-kodiert — manche Banken erwarten ASCII, andere EBCDIC. SAP-Kodierung muss mit Bank-Erwartung übereinstimmen (Konfiguration `DMEE → Zeichensatz`).
- **Fehlende BIC**: Für Drittlandzahlungen muss der BIC der Empfängerbank korrekt hinterlegt sein. Fehlende oder falsche BICs führen zu "Unable to Apply"-Rückgaben vom SWIFT-Netz.
- **Betrag-Format**: DTAZV erwartet rechtsbündigen Betrag ohne Dezimaltrennzeichen (Cent bereits enthalten in letzten 2 Stellen) — SAP-Mapping muss korrekt konfiguriert sein.
- **Charge-Typ SHA vs. OUR**: Falsche Charge-Konfiguration führt zu unerwarteten Abzügen beim Empfänger (BEN) oder Rückbelastungen beim Auftraggeber (OUR bei Korrespondenzbank-Gebühren).
- **Satzlänge-Abweichung**: Fixed-Width-Format erfordert exakt definierte Feldlängen — fehlerhafte Konfiguration in DMEE führt zu abgewiesenen Dateien.

### Einsteiger

- Die Bank meldet eine kryptische Fehlermeldung — meistens stimmt das Datenformat nicht (EBCDIC vs. ASCII).
- Eine US-Dollar-Überweisung schlägt fehl, weil der SWIFT-Code der US-Bank fehlt oder falsch ist.
- Der Empfänger erhält weniger als erwartet, weil Bankgebühren falsch konfiguriert wurden (Charge-Typ).

## Häufige Projektfehler

### Experte

- **Keine Testphase mit Echtbank**: DTAZV-Dateien können nicht vollständig simuliert werden — Banken lehnen Testdateien oft ab oder akzeptieren nur Sandboxes. Projekte überspringen Integrationstests.
- **Parallelkonfiguration DTAZV + pain.001**: Während der Migrationsphasen laufen beide Formate parallel. Zahlungsweg-Konfiguration muss klar trennen, welche Zahlungen DTAZV vs. pain.001 nutzen — fehlende Trennung führt zu doppelt gesendeten Aufträgen.
- **Altdaten-Migration vergessen**: Offene Verbindlichkeiten, die im DTAZV-Format generiert wurden, müssen bei Format-Wechsel nicht neu gebucht werden — aber SAP-Zahlungsweg-Zuordnung muss geändert werden, um pain.001 zu erzeugen.
- **Fehlende Felder für FATF-Compliance**: DTAZV hat kein strukturiertes Feld für Ultimate Debtor / Originator-Information — bei Drittlandzahlungen (FATF Travel Rule) wird dies zum Problem und erfordert Workarounds.

### Einsteiger

- Das Projekt migriert auf SEPA pain.001, vergisst aber Zahlungen an US-Lieferanten — diese brechen plötzlich ab, weil die DTAZV-Konfiguration entfernt wurde.
- Nach einem SAP-Upgrade funktioniert DTAZV nicht mehr — DMEE-Formatbaum muss für neue SAP-Version angepasst werden.
- Buchhalter wissen nicht, dass DTAZV-Zahlungen 1–3 Tage länger dauern als SEPA — Fälligkeitstermine werden zu spät gesetzt.
