---
format_name: Cuaderno 34
aktuelle_version: "Cuaderno 34 SEPA (AEB/Asociación Española de Banca, 2014 SEPA-Revision)"
nachrichtentyp: Spanisches SEPA-Überweisungsformat — Transferencia SEPA (Cuaderno 34 SEPA)
familie_standard: Spain Local
datenrichtung: Ausgehend (Corporate → Bank) für Überweisungen
sap_relevanz: SAP ERP / S/4HANA — via DMEE (Format Cuaderno 34 SEPA) oder pain.001.001.03 direkt; SAP liefert Standard-DMEE für Cuaderno 34; F110 mit Spain-Zahlungsweg
status: Aktiv — Cuaderno 34 SEPA ist das Standard-Überweisungsformat für Spanien; parallel existiert pain.001 als Alternative
---

# Cuaderno 34 — Spanisches SEPA-Überweisungsformat (AEB)

**Stand:** April 2026 | **Quellen:** AEB (Asociación Española de Banca), Banco de España, EPC SEPA

## Zweck & Verwendung

### Experte

**Cuaderno 34** ist das spanische nationale Banküberweisungsformat, standardisiert durch die **AEB (Asociación Española de Banca)**. Seit der SEPA-Migration 2014 existiert Cuaderno 34 in einer SEPA-konformen Variante ("Cuaderno 34 SEPA"), die IBAN/BIC nutzt und ISO-20022-Konzepte adaptiert, aber im proprietären AEB-Format bleibt. Es gibt zwei Hauptvarianten:

**Cuaderno 34 (Clásico)**: Altes Format für Inlandsüberweisungen in Spanien (vor SEPA). Nutzte CCC (Código de Cuenta Cliente) statt IBAN — 20-stellige spanische Kontonummer.

**Cuaderno 34 SEPA**: SEPA-konforme Variante seit 2014, basiert auf IBAN/BIC, kompatibel mit SEPA SCT-Anforderungen. Format bleibt proprietär AEB-Text, aber Inhalte sind SEPA-konform.

**Alternativen**: Viele spanische Banken akzeptieren inzwischen direkt pain.001.001.03/09 — Cuaderno 34 ist in einigen Projekten nicht mehr nötig, wenn die Bank MX-Format unterstützt.

**CFONB-Analogie**: Cuaderno 34 ist für Spanien das, was CFONB für Frankreich ist — nationaler Bankstandard, der parallel zu ISO 20022 existiert.

Weitere relevante spanische Cuadernos:
- **Cuaderno 19**: SEPA Direct Debit (Adeudo Domiciliado SEPA) — Lastschriften
- **Cuaderno 43**: Kontoauszug (ähnlich MT940/camt.053)
- **Cuaderno 58**: Wechsel/Pagaré-Einzug

### Einsteiger

Cuaderno 34 ist das spanische Format für Überweisungen — ähnlich wie SEPA, aber in einem eigenem Format, das spanische Banken traditionell verwendet haben. Seit 2014 gibt es eine SEPA-kompatible Version, aber das Format bleibt "spanisch". SAP hat eine fertige Unterstützung dafür. Viele spanische Banken akzeptieren inzwischen auch direkt pain.001 — es lohnt sich zu prüfen, ob Cuaderno 34 überhaupt noch nötig ist.

## Versionshistorie / Standard-Entwicklung

| Zeitraum | Ereignis |
|---|---|
| 1987 | AEB standardisiert Cuaderno 34 als nationales Überweisungsformat |
| 1999 | Euro-Einführung: Cuaderno 34 für EUR-Zahlungen angepasst |
| 2008 | SEPA-Vorbereitung: AEB definiert Cuaderno 34 SEPA-Variante |
| 2014-02-01 | SEPA-Migration Pflicht: Cuaderno 34 SEPA als Standardformat |
| 2018 | Spanische Banken beginnen pain.001 als Alternative anzubieten |
| 2023 | Cuaderno 34 weiterhin aktiv; pain.001 wächst als Alternative |

## Wichtige Felder (technisch)

| Cuaderno-34-Feld | Beschreibung | Pflicht |
|---|---|---|
| Código de operación | 56 (Überweisung), 57 (Auslandsüberweisung) | Ja |
| NIF/CIF del Ordenante | Spanische Steuer-ID (NIF/CIF) des Auftraggebers | Ja |
| IBAN del Ordenante | IBAN des Auftraggebers | Ja |
| IBAN del Beneficiario | IBAN des Empfängers | Ja |
| BIC del Banco Beneficiario | BIC der Empfängerbank | Ja (SEPA-Variant opt.) |
| Importe | Betrag in Euro-Cent | Ja |
| Fecha de Valor | Wertstellungsdatum DDMMYYYY | Ja |
| Concepto | Verwendungszweck, max. 140 Zeichen | Nein |
| Referencia del Ordenante | Auftraggeberreferenz, max. 35 Zeichen | Nein |

## Pflichtfelder (Kurzliste)

Código de operación · NIF/CIF · IBAN Auftraggeber · IBAN Empfänger · Betrag (Cent) · Wertstellungsdatum

## SAP-Mapping

### Experte

SAP unterstützt Cuaderno 34 über das DMEE-Framework:
- **DMEE-Format**: SAP liefert DMEE-Vorlagen für Cuaderno 34 (klassisch und SEPA). Konfiguration in Transaktion `DMEE`.
- **F110**: Spain-Zahlungsweg mit Cuaderno 34 oder pain.001. Bankschlüssel in SAP als IBAN. Vorsicht: Ältere SAP-Installationen haben möglicherweise noch CCC (Código Cuenta Cliente) in `BNKA`-Tabelle statt IBAN.
- **NIF/CIF-Stammdaten**: Spanische Steuer-ID (NIF für Privatpersonen, CIF für Unternehmen) muss in Debitor/Kreditor-Stammdaten gepflegt sein (Feld `STCD1`).
- **pain.001 als Alternative**: Wenn Hausbank pain.001 akzeptiert, ist direkte ISO-20022-Einreichung möglich — Cuaderno 34 DMEE nicht nötig.
- **Kontoauszug Cuaderno 43**: Eingehende Kontoauszüge als Cuaderno 43 werden über SAP-Programm `RFEBKA00` importiert (analoges FF.5-Mapping).

### Einsteiger

SAP hat eine fertige Konfigurationsvorlage für Cuaderno 34. Im Zahlungslauf (F110) wird die Cuaderno-34-Datei erzeugt und zur Bank gesendet. Wichtig: In SAP müssen die spanischen Steuer-IDs der Lieferanten und Kunden korrekt hinterlegt sein. Manche spanischen Banken akzeptieren inzwischen direkt pain.001 — in diesem Fall ist Cuaderno 34 nicht mehr nötig, und die Konfiguration wird einfacher.

## Typische Fehlerquellen

### Experte

- **NIF/CIF fehlt oder falsch**: Spanische Steuer-IDs haben spezifische Validierungsregeln (NIF = 8 Ziffern + 1 Buchstabe; CIF = 1 Buchstabe + 7 Ziffern + 1 Kontrollzeichen) — falsche IDs führen zur Ablehnung.
- **Altes CCC statt IBAN**: Ältere SAP-Systeme haben noch das alte CCC-Format (20 Stellen) — nach SEPA-Migration muss IBAN verwendet werden.
- **Zeichensatz**: Cuaderno 34 erlaubt nur bestimmte Sonderzeichen — spanische Zeichen (ñ, á, é, í, ó, ú, ü) müssen ASCII-konform kodiert oder transliteriert werden.
- **Betrag in Cent**: Wie andere nationale Formate — Betrag in Cent, nicht in Euro.

### Einsteiger

- Die Bank lehnt die Datei ab, weil eine CIF-Nummer fehlt — niemand wusste, dass spanische Steuer-IDs in SAP gepflegt werden müssen.
- Spanische Sonderzeichen (ñ, á) im Firmennamen führen zu Encoding-Fehlern in der Datei.
- Betrag kommt 100-fach falsch an.

## Häufige Projektfehler

### Experte

- **Cuaderno 34 vs. pain.001 — kein Assessment**: Projekte konfigurieren Cuaderno 34, ohne zu prüfen, ob die Hausbank pain.001 direkt akzeptiert — unnötiger Aufwand.
- **Keine Cuaderno-19-Implementierung**: SEPA SDD in Spanien läuft über Cuaderno 19 — Projekte implementieren Cuaderno 34 für Zahlungen, vergessen aber Cuaderno 19 für Lastschriften.
- **Kontoauszug Cuaderno 43 vergessen**: Cuaderno 43 (spanischer Kontoauszug) muss ebenfalls importiert und verarbeitet werden — wird im Projektscope oft nicht berücksichtigt.

### Einsteiger

- Das Projekt konfiguriert Cuaderno 34, obwohl die Bank pain.001 akzeptiert hätte — doppelter Aufwand.
- SEPA-Lastschriften für Spanien werden vergessen (Cuaderno 19) — Lastschrifteinzüge scheitern bei Go-Live.
